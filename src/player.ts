// This script shouldn't do anything without explicit user interaction (Triggering playback)
import { STREAMING_MIN_RESPONSE, PLAYER_TAG_ID } from "./configProvider";
import copyToChannelPolyfill from "./copyToChannelPolyfill";
import resampler from "./resampler";
import unlock from "./webAudioUnlock";
import { browserCapabilities, Capabilities } from "./browserCapabilities";
import { sleep, awaitMessage } from "./util";
import { Brstm } from "brstm";
import { PlayerEvent } from "./eventTypes";

function partitionedGetSamples(brstm, start, size) {
  let samples = [];
  let got = 0;
  for (let i = 0; i < brstm.metadata.numberChannels; i++) {
    samples.push(new Int16Array(size));
  }

  while (got < size) {
    let buf = brstm.getSamples(
      start + got,
      Math.min(brstm.metadata.samplesPerBlock, size - got)
    );
    for (let i = 0; i < buf.length; i++) {
      samples[i].set(buf[i], got);
    }
    got += Math.min(brstm.metadata.samplesPerBlock, size - got);
  }

  return samples;
}

const SMASHCUSTOMMUSIC_URL = "https://smashcustommusic.net";

interface SongDetails {
  approved_by: string;
  available: boolean;
  description: string;
  downloads: number;
  end_loop_point: number;
  game_banner_exists: boolean;
  game_id: number;
  game_name: string;
  length: number;
  loop_type: string;
  name: string;
  ok: boolean;
  remix: boolean;
  sample_rate: number;
  size: number;
  start_loop_point: number;
  theme_type: string;
  uploader: string;
}

// Player state variables
interface State {
  hasInitialized: boolean; // If we measured browser capabilities yet
  capabilities: Capabilities; // Capabilities of our browser
  audioContext: AudioContext; // WebAudio Audio context
  scriptNode: ScriptProcessorNode; // WebAudio script node
  gainNode: GainNode; // WebAudio gain node
  fullyLoaded: boolean; // Set to false if file is still streaming
  loadState: number; // How many bytes we loaded
  playbackCurrentSample: number; // Current sample of playback (in the LibBRSTM)
  brstm: Brstm; // Instance of LibBRSTM
  brstmBuffer: ArrayBuffer; // Memory view shared with LibBRSTM
  paused: boolean;
  enableLoop: boolean;
  streamCancel: boolean;
  playAudioRunning: boolean;
  stopped: boolean;
  volume: number;
  samplesReady: number; // How many samples the streamer loaded
}

export class BrstmPlayer {
  constructor(apiURL: string = SMASHCUSTOMMUSIC_URL) {
    this._state = {
      hasInitialized: false,
      capabilities: null,
      audioContext: null,
      scriptNode: null,
      gainNode: null,
      fullyLoaded: true,
      loadState: 0,
      playbackCurrentSample: 0,
      brstm: null,
      brstmBuffer: null,
      paused: false,
      stopped: false,
      enableLoop: false,
      streamCancel: false,
      playAudioRunning: false,
      volume: Number(localStorage.getItem("volumeoverride")) || 1,
      samplesReady: 0,
    };
    this._apiURL = apiURL;
    this._audio = document.createElement("audio");
    this._audio.id = PLAYER_TAG_ID;
    this._audio.src =
      "https://github.com/anars/blank-audio/blob/master/5-seconds-of-silence.mp3?raw=true";
    this._audio.loop = true;
    document.body.appendChild(this._audio);
  }

  private getBrstmUrl(id: string): string {
    return this._apiURL + "/brstm/" + id;
  }

  private getSongUrl(id: string): string {
    return this._apiURL + "/json/song/" + id;
  }

  private _state: State;
  private _audio: HTMLAudioElement;
  private _apiURL: string;
  private _song: SongDetails;

  sendEvent(type: PlayerEvent, payload: object = {}) {
    this._audio.dispatchEvent(new CustomEvent(type, { detail: payload }));
  }
  sendUpdateStateEvent() {
    this.sendEvent(PlayerEvent.step, {
      position: this._state.playbackCurrentSample,
      paused: this._state.paused,
      volume: this._state.volume,
      loaded: this._state.samplesReady,
      looping: this._state.enableLoop,
    });
  }

  private getResampledSample(
    sourceSr: number,
    targetSr: number,
    sample: number
  ) {
    return Math.ceil((sample / sourceSr) * targetSr);
  }

  private async loadSongLegacy(url: string) {
    // Old song loading logic
    let resp = await fetch(url);
    let body = await resp.arrayBuffer(); // Fetch whole song

    this._state.brstm = new Brstm(body);

    this._state.fullyLoaded = true;
    this._state.loadState = Number.MAX_SAFE_INTEGER; // This is legacy loading logic, we can just assume we downloaded everything
    this._state.samplesReady = Number.MAX_SAFE_INTEGER;
  }

  private loadSongStreaming(url: string): Promise<void> {
    // New, fancy song loading logic
    return new Promise(async (resolve, reject) => {
      this.sendEvent(PlayerEvent.loading);
      let resp: Response;
      let reader: ReadableStreamDefaultReader;
      try {
        resp = await fetch(url);
        reader = (await resp.body).getReader(); // Initialize reader
      } catch (e) {
        return reject(e);
      }
      this._state.brstmBuffer = new ArrayBuffer(
        parseInt(resp.headers.get("content-length"))
      );
      let bufferView = new Uint8Array(this._state.brstmBuffer); // Create shared memory view
      let writeOffset = 0; // How much we read
      let resolved = false; // Did we resolve the promise already
      let brstmHeaderSize = 0;
      this._state.samplesReady = 0;
      this._state.fullyLoaded = false; // We are now streaming
      this._state.streamCancel = false;
      while (true) {
        let d: ReadableStreamReadResult<any>;
        try {
          d = await reader.read(); // Read next chunk
        } catch (e) {
          if (resolved) {
            this.sendEvent(PlayerEvent.killed, {
              streamingDied: true,
              buffering: false,
              ready: true,
            });
            await this._state.audioContext.close();
            this._state.audioContext = null;
          } else {
            reject(e);
          }
          return;
        }
        if (this._state.streamCancel) {
          await reader.cancel();
          window.postMessage("continueload");
          return;
        }
        if (!d.done) {
          // This means we will receive more
          bufferView.set(d.value, writeOffset);
          writeOffset += d.value.length;
          this._state.loadState = writeOffset;

          // Read the file's header size from the file before passing the file to the BRSTM reader.
          if (brstmHeaderSize == 0 && writeOffset > 0x80) {
            // Byte order. 0 = LE, 1 = BE.
            let endian = 0;
            // Read byte order mark. 0x04
            let bom = bufferView[0x04] * 256 + bufferView[0x05];
            if (bom == 0xfeff) {
              endian = 1;
            }

            // Read the audio offset. 0x70
            if (endian == 1) {
              brstmHeaderSize =
                bufferView[0x70] * 16777216 +
                bufferView[0x71] * 65536 +
                bufferView[0x72] * 256 +
                bufferView[0x73];
            } else {
              brstmHeaderSize =
                bufferView[0x70] +
                bufferView[0x71] * 256 +
                bufferView[0x72] * 65536 +
                bufferView[0x73] * 16777216;
            }
            // If the offset in the file turned out to be 0 for some reason or seems to small,
            // then fall back to the default minimum size, though the file is very likely to be invalid in this case.
            if (brstmHeaderSize < 0x90) {
              brstmHeaderSize = STREAMING_MIN_RESPONSE;
            }
          }

          if (
            !resolved &&
            brstmHeaderSize != 0 &&
            writeOffset > brstmHeaderSize
          ) {
            // Initialize BRSTM instance and allow player to continue loading
            try {
              this._state.brstm = new Brstm(this._state.brstmBuffer);
              resolve();
              resolved = true;
            } catch (e) {
              reject(e);
              return;
            }
          }
          if (resolved) {
            this._state.samplesReady =
              Math.floor(
                (this._state.loadState - brstmHeaderSize) /
                  this._state.brstm.metadata.numberChannels /
                  this._state.brstm.metadata.blockSize
              ) * this._state.brstm.metadata.samplesPerBlock;
          }
        } else {
          if (!resolved) {
            // For some reason we haven't resolved yet despite the file finishing
            try {
              this._state.brstm = new Brstm(this._state.brstmBuffer);
              resolve();
              resolved = true;
            } catch (e) {
              reject(e);
              return;
            }
          }
          this._state.fullyLoaded = true;
          this._state.samplesReady = Number.MAX_SAFE_INTEGER; // Just in case
          console.log("File finished streaming");
          break;
        }
      }
    });
  }

  setVolume(level: number) {
    this._state.volume = level;
    this.sendEvent(PlayerEvent.setVolume, {
      volume: level,
    });
    this.sendUpdateStateEvent();
    if (this._state.gainNode)
      this._state.gainNode.gain.setValueAtTime(
        this._state.volume,
        this._state.audioContext.currentTime
      );
  }
  incVolume(step: number) {
    this.setVolume(Math.min(this._state.volume + step, 1));
  }
  decVolume(step: number) {
    this.setVolume(Math.max(this._state.volume - step, 0));
  }
  seek(to: number) {
    this._state.playbackCurrentSample = Math.floor(to);
    this.sendEvent(PlayerEvent.seek, {
      toSample: this._state.playbackCurrentSample,
    });
    this.sendUpdateStateEvent();
  }
  next() {
    this.sendEvent(PlayerEvent.next);
  }
  previous() {
    this.sendEvent(PlayerEvent.previous);
  }
  playPause() {
    this._state.paused = !this._state.paused;
    this._state.audioContext[this._state.paused ? "suspend" : "resume"]();
    if (this._state.capabilities.mediaSession) {
      navigator.mediaSession.playbackState =
        navigator.mediaSession.playbackState === "playing"
          ? "paused"
          : "playing";
    }
    this.sendEvent(PlayerEvent.playPause, {
      playing: navigator.mediaSession.playbackState === "playing",
    });
    this.sendUpdateStateEvent();
  }
  setLoop(enable: boolean) {
    this._state.enableLoop = enable;
    this.sendEvent(PlayerEvent.setLoop, {
      loop: enable,
    });
    this.sendUpdateStateEvent();
  }
  stop() {
    this._state.stopped = true;
    this.sendEvent(PlayerEvent.stop);
  }

  async fetchSongDetails(id: string): Promise<void> {
    let resp = await fetch(this.getSongUrl(id));
    if (resp.status >= 400) {
      console.error(`could not fetch song details for id ${id}.`);
      return;
    }
    this._song = await resp.json();
  }

  async play(id: string) {
    let url = this.getBrstmUrl(id);
    this.sendEvent(PlayerEvent.play, {
      id: id,
      url: url,
    });
    this._state.capabilities = await browserCapabilities();

    // fetch details
    this.fetchSongDetails(id).then((_) => {
      this._setMediaSessionData();
      if (this._state.capabilities.mediaSession) {
        navigator.mediaSession.playbackState = "playing";
      }
    });

    // Entry point to the
    this._state.stopped = false;
    console.log(`Playing ${url}`);
    if (!this._state.hasInitialized) {
      this.sendEvent(PlayerEvent.start, {
        loaded: this._state.samplesReady,
      });
    }

    if (this._state.playAudioRunning) return;
    this._state.playAudioRunning = true;
    if (!this._state.fullyLoaded) {
      console.log("Cancelling last stream...");
      this._state.streamCancel = true;
      await awaitMessage("continueload");
      console.log("Done.");
    }
    if (this._state.audioContext) {
      // We have a previous audio context, we need to murderize it
      await this._state.audioContext.close();
      this._state.audioContext = null;
    }

    this._state.playbackCurrentSample = 0; // Set the state for playback
    this._state.paused = false; // Unpause it

    // Populate GUI with initial, yet unknown data
    this.sendEvent(PlayerEvent.resetState, {
      ready: false,
      position: 0,
      samples: 1e6,
      loaded: 0,
      volume: this._state.volume,
      paused: false,
      buffering: false,
      sampleRate: 44100,
      streamingDied: false,
    });
    try {
      await (this._state.capabilities.streaming
        ? this.loadSongStreaming.bind(this)
        : this.loadSongLegacy.bind(this))(url); // Begin loading based on capabilities
    } catch (e) {
      this.sendEvent(PlayerEvent.killed, {
        streamingDied: true,
        buffering: false,
        ready: true,
      });
      console.error(e);
      this._state.playAudioRunning = false;
      return;
    }
    // The promise returned by the loading method is either resolved after the download is done (legacy)
    // Or after we download enough to begin loading (modern)

    this._state.audioContext = new window.AudioContext( // Because Safari is retarded
      this._state.capabilities.sampleRate
        ? { sampleRate: this._state.brstm.metadata.sampleRate }
        : {}
    ); // Do we support sampling?
    // If not, we just let the browser pick

    this._state.enableLoop = this._state.brstm.metadata.loopFlag === 1; // Set the loop settings respective to the loop flag in brstm file

    await unlock(this._state.audioContext); // Request unlocking of the audio context

    if (this._state.capabilities.streaming) {
      await sleep(1000); // In streaming sometimes the start is slightly crunchy, this should fix it.
    }

    // Create the script node
    this._state.scriptNode = this._state.audioContext.createScriptProcessor(
      0,
      0,
      2
    );

    // Process bufferSize
    let bufferSize = this._state.scriptNode.bufferSize;

    // If we have to resample, the buffer that we get from the BRSTM will be different size.
    bufferSize = this._state.capabilities.sampleRate
      ? bufferSize
      : this.getResampledSample(
          this._state.audioContext.sampleRate,
          this._state.brstm.metadata.sampleRate,
          bufferSize
        );
    let loadBufferSize = bufferSize;

    // If we resample, we need to also fetch some extra samples to prevent audio glitches
    if (!this._state.capabilities.sampleRate) {
      loadBufferSize += 20;
    }

    this.sendEvent(PlayerEvent.loaded, {
      ready: true,
      samples: this._state.brstm.metadata.totalSamples,
      sampleRate: this._state.brstm.metadata.sampleRate,
    });
    this._state.playAudioRunning = false;
    // Set the audio loop callback (called by the browser every time the internal buffer expires)
    this._state.scriptNode.onaudioprocess = (audioProcessingEvent) => {
      if (this._state.stopped === true) return;
      this.sendUpdateStateEvent();
      // Get a handle for the audio buffer
      let outputBuffer = audioProcessingEvent.outputBuffer;
      if (!outputBuffer.copyToChannel)
        // On safari (Because it's retarded), we have to polyfill this
        outputBuffer.copyToChannel = copyToChannelPolyfill;

      // Not enough samples override
      if (
        this._state.playbackCurrentSample + bufferSize + 1024 >
        this._state.samplesReady
      ) {
        // override, return early.
        this.sendEvent(PlayerEvent.buffering, {
          buffering: true,
        });
        console.log("Buffering....");
        outputBuffer.copyToChannel(
          new Float32Array(this._state.scriptNode.bufferSize).fill(0),
          0
        );
        outputBuffer.copyToChannel(
          new Float32Array(this._state.scriptNode.bufferSize).fill(0),
          1
        );
        return;
      }
      this.sendEvent(PlayerEvent.buffering, {
        buffering: false,
      });
      if (this._state.paused) {
        // If we are paused, we just bail out and return with just zeros
        outputBuffer.copyToChannel(
          new Float32Array(this._state.scriptNode.bufferSize).fill(0),
          0
        );
        outputBuffer.copyToChannel(
          new Float32Array(this._state.scriptNode.bufferSize).fill(0),
          1
        );
        return;
      }

      let samples; // Declare the variable for samples
      // This will be filled using the below code for handling looping
      if (
        this._state.playbackCurrentSample + loadBufferSize <
        this._state.brstm.metadata.totalSamples
      ) {
        // Standard codepath if no loop
        // Populate samples with enough that we can just play it (or resample + play it) without glitches
        samples = partitionedGetSamples(
          this._state.brstm,
          this._state.playbackCurrentSample,
          loadBufferSize
        );

        // We use bufferSize not loadBufferSize because the last 20 samples if we have resampling are inaudible
        this._state.playbackCurrentSample += bufferSize;
      } else {
        // We are reaching EOF
        // Check if we have looping enabled
        if (this._state.enableLoop) {
          // First, get all the samples to the end of the file
          samples = partitionedGetSamples(
            this._state.brstm,
            this._state.playbackCurrentSample,
            this._state.brstm.metadata.totalSamples -
              this._state.playbackCurrentSample
          );

          let endSamplesLength = samples[0].length;

          console.log(
            this._state.brstm.metadata.totalSamples -
              this._state.playbackCurrentSample,
            loadBufferSize - endSamplesLength
          );

          // Get enough samples to fully populate the buffer AFTER loop start point
          let postLoopSamples = partitionedGetSamples(
            this._state.brstm,
            this._state.brstm.metadata.loopStartSample,
            loadBufferSize - endSamplesLength
          );

          // For every channel, join the first and second buffers created above
          for (let i = 0; i < samples.length; i++) {
            let buf = new Int16Array(loadBufferSize).fill(0);
            buf.set(samples[i]);
            buf.set(postLoopSamples[i], samples[i].length);
            samples[i] = buf;
          }

          // Set to loopStartPoint + length of second buffer (recalculated to not set extra resampling samples)
          this._state.playbackCurrentSample =
            this._state.brstm.metadata.loopStartSample +
            bufferSize -
            endSamplesLength;
        } else {
          // No looping
          // Get enough samples until EOF
          samples = partitionedGetSamples(
            this._state.brstm,
            this._state.playbackCurrentSample,
            this._state.brstm.metadata.totalSamples -
              this._state.playbackCurrentSample -
              1
          );

          // Fill remaining space in the buffer with 0
          for (let i = 0; i < samples.length; i++) {
            let buf = new Int16Array(loadBufferSize).fill(0);
            buf.set(samples[i]);
            samples[i] = buf;
          }

          // Tell the player that on the next iteration we are at the start and paused
          this._state.playbackCurrentSample = 0;
          this._state.paused = true;
          setTimeout(() => {
            this._state.audioContext.suspend();
          }, 200);
        }
      }

      // In files with too many channels, we just play the first 2 channels
      if (samples.length > 2) {
        samples = [samples[0], samples[1]];
      }

      // In mono files, we duplicate the channel because stereo is mandatory
      if (samples.length === 1) {
        samples = [samples[0], samples[0]];
      }

      // Populate outputs for both channels
      for (let i = 0; i < samples.length; i++) {
        // WebAudio requires Float32 (-1 to 1), we have Int16 (-32768 to 32767)
        let chan = new Float32Array(loadBufferSize);

        // Convert to Float32
        for (let sid = 0; sid < loadBufferSize; sid++) {
          chan[sid] = samples[i][sid] / 32768;
        }

        // If we require resampling
        if (!this._state.capabilities.sampleRate) {
          // Initialize the resampler with the original data we got from BRSTM
          let zresampler = new resampler(
            this._state.brstm.metadata.sampleRate,
            this._state.audioContext.sampleRate,
            1,
            chan
          );

          // Resample all the samples we loaded
          zresampler.resampler(loadBufferSize);

          // Copy the output to the channel
          chan = new Float32Array(zresampler.outputBuffer);

          // Cut off excess samples
          if (chan.length > this._state.scriptNode.bufferSize) {
            chan = chan.slice(0, this._state.scriptNode.bufferSize);
          }
        }

        // At last, write all samples to the output buffer
        outputBuffer.copyToChannel(chan, i);
      }
    };

    // Gain node controls volume
    this._state.gainNode = this._state.audioContext.createGain();

    // Script node needs to pass through gain so it can be controlled
    this._state.scriptNode.connect(this._state.gainNode);

    // Gain node outputs to the actual speakers
    this._state.gainNode.connect(this._state.audioContext.destination);

    // Set gain node volume to `volumeoverride` for remembering the volume
    this._state.gainNode.gain.setValueAtTime(
      this._state.volume,
      this._state.audioContext.currentTime
    );
  }

  async _setMediaSessionData() {
    if (!this._state.capabilities.mediaSession) {
      return;
    }

    this._audio
      .play()
      .then((_) => {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this._song.name,
          album: this._song.game_name,
          artist: this._song.uploader,
          artwork: [
            {
              src: "https://ssb.wiki.gallery/images/a/a2/SSBU_spirit_Smash_Ball.png",
              type: "image/png",
              sizes: "560x544",
            },
          ],
        });

        navigator.mediaSession.setActionHandler("play", () => {
          this.playPause();
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          this.playPause();
        });
        navigator.mediaSession.setActionHandler("stop", () => {
          this.stop();
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => this.next);
        navigator.mediaSession.setActionHandler(
          "previoustrack",
          () => this.previous
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
