// This script shouldn't do anything without explicit user interaction (Triggering playback)

const browserCapabilities = require("./browserCapabilities");
const unlock = require("./webAudioUnlock");
const libbrstm = require("brstm");
const { STREAMING_MIN_RESPONSE } = require("./configProvider");
const copyToChannelPolyfill = require("./copyToChannelPolyfill");
const gui = require("./gui");
import resampler from "./resampler";
const sleep = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));
const powersOf2 = [256, 512, 1024, 2048, 4096, 8192, 16384, 32768];

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

// Player state variables
let hasInitialized = false; // If we measured browser capabilities yet
let capabilities = null; // Capabilities of our browser
let audioContext = null; // WebAudio Audio context
let scriptNode = null; // WebAudio script node
let gainNode = null; // WebAudio gain node
let fullyLoaded = true; // Set to false if file is still streaming
let loadState = 0; // How many bytes we loaded
let playbackCurrentSample = 0; // Current sample of playback (in the LibBRSTM)
let brstm = null; // Instance of LibBRSTM
let brstmBuffer = null; // Memory view shared with LibBRSTM
let paused = false;
let enableLoop = false;
let streamCancel = false;
let playAudioRunning = false;

let samplesReady = 0; // How many samples the streamer loaded
let volume = localStorage.getItem("volumeoverride") || 1;
function guiupd() {
  gui.updateState({
    position: playbackCurrentSample,
    paused,
    volume,
    loaded: samplesReady,
    looping: enableLoop,
  });
}
function getResampledSample(sourceSr, targetSr, sample) {
  return Math.ceil((sample / sourceSr) * targetSr);
}

async function loadSongLegacy(url) {
  // Old song loading logic
  let resp = await fetch(url);
  let body = await resp.arrayBuffer(); // Fetch whole song

  brstm = new libbrstm.Brstm(body); // Initialize libBRSTM into global state

  fullyLoaded = true;
  loadState = Number.MAX_SAFE_INTEGER; // This is legacy loading logic, we can just assume we downloaded everything
  samplesReady = Number.MAX_SAFE_INTEGER;
}

function awaitMessage(content) {
  return new Promise(function (resolve) {
    function handler(c) {
      if (c.data === content && c.isTrusted) {
        window.removeEventListener("message", handler);
        resolve();
      }
    }

    window.addEventListener("message", handler);
  });
}

function loadSongStreaming(url) {
  // New, fancy song loading logic
  return new Promise(async (resolve, reject) => {
    let resp;
    let reader;
    try {
      resp = await fetch(url);
      reader = (await resp.body).getReader(); // Initialize reader
    } catch (e) {
      return reject(e);
    }
    brstmBuffer = new ArrayBuffer(parseInt(resp.headers.get("content-length")));
    let bufferView = new Uint8Array(brstmBuffer); // Create shared memory view
    let writeOffset = 0; // How much we read
    let resolved = false; // Did we resolve the promise already
    let brstmHeaderSize = 0;
    samplesReady = 0;
    fullyLoaded = false; // We are now streaming
    streamCancel = false;
    while (true) {
      let d;
      try {
        d = await reader.read(); // Read next chunk
      } catch (e) {
        if (resolved) {
          gui.updateState({
            streamingDied: true,
            buffering: false,
            ready: true,
          });
          await audioContext.close();
          audioContext = null;
        } else {
          reject(e);
        }
        return;
      }
      if (streamCancel) {
        await reader.cancel();
        window.postMessage("continueload");
        return;
      }
      if (!d.done) {
        // This means we will receive more
        bufferView.set(d.value, writeOffset);
        writeOffset += d.value.length;
        loadState = writeOffset;

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
            brstm = new libbrstm.Brstm(brstmBuffer);
            resolve();
            resolved = true;
          } catch (e) {
            reject(e);
            return;
          }
        }
        if (resolved) {
          samplesReady =
            Math.floor(
              (loadState - brstmHeaderSize) /
                brstm.metadata.numberChannels /
                brstm.metadata.blockSize
            ) * brstm.metadata.samplesPerBlock;
        }
      } else {
        if (!resolved) {
          // For some reason we haven't resolved yet despite the file finishing
          try {
            brstm = new libbrstm.Brstm(brstmBuffer);
            resolve();
            resolved = true;
          } catch (e) {
            reject(e);
            return;
          }
        }
        fullyLoaded = true;
        samplesReady = Number.MAX_SAFE_INTEGER; // Just in case
        console.log("File finished streaming");
        break;
      }
    }
  });
}

const internalApi = {
  setVolume: function (l) {
    volume = l;
    guiupd();
    if (gainNode)
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  },
  seek: function (p) {
    playbackCurrentSample = Math.floor(p);
    guiupd();
  },
  pause: function () {
    paused = !paused;
    audioContext[paused ? "suspend" : "resume"]();
    guiupd();
  },
  setLoop: function (a) {
    enableLoop = a;
    guiupd();
  },
};

async function startPlaying(url) {
  // Entry point to the
  console.log(`playing ${url}`);
  if (!hasInitialized) {
    // We haven't probed the browser for its capabilities yet
    capabilities = await browserCapabilities();
    hasInitialized = true;
    gui.runGUI(internalApi);
    setInterval(function () {
      gui.updateState({ loaded: samplesReady });
      gui.guiUpdate();
    }, 100);
  } // Now we have!

  if (playAudioRunning) return;
  playAudioRunning = true;
  if (!fullyLoaded) {
    console.log("Cancelling last stream...");
    streamCancel = true;
    await awaitMessage("continueload");
    console.log("Done.");
  }
  if (audioContext) {
    // We have a previous audio context, we need to murderize it
    await audioContext.close();
    audioContext = null;
  }

  playbackCurrentSample = 0; // Set the state for playback
  paused = false; // Unpause it

  gui.updateState({
    // Populate GUI with initial, yet unknown data
    ready: false,
    position: 0,
    samples: 1e6,
    loaded: 0,
    volume: volume,
    paused: false,
    buffering: false,
    sampleRate: 44100,
    streamingDied: false,
  });
  try {
    await (capabilities.streaming ? loadSongStreaming : loadSongLegacy)(url); // Begin loading based on capabilities
  } catch (e) {
    gui.updateState({ streamingDied: true, ready: true, buffering: false });
    console.error(e);
    playAudioRunning = false;
    return;
  }
  // The promise returned by the loading method is either resolved after the download is done (legacy)
  // Or after we download enough to begin loading (modern)

  audioContext = new (window.AudioContext || window.webkitAudioContext)( // Because Safari is retarded
    capabilities.sampleRate ? { sampleRate: brstm.metadata.sampleRate } : {}
  ); // Do we support sampling?
  // If not, we just let the browser pick

  enableLoop = brstm.metadata.loopFlag === 1; // Set the loop settings respective to the loop flag in brstm file

  await unlock(audioContext); // Request unlocking of the audio context

  if (capabilities.streaming) {
    await sleep(1000); // In streaming sometimes the start is slightly crunchy, this should fix it.
  }

  // Create the script node
  scriptNode = audioContext.createScriptProcessor(0, 0, 2);

  // Process bufferSize
  let bufferSize = scriptNode.bufferSize;

  // If we have to resample, the buffer that we get from the BRSTM will be different size.
  bufferSize = capabilities.sampleRate
    ? bufferSize
    : getResampledSample(
        audioContext.sampleRate,
        brstm.metadata.sampleRate,
        bufferSize
      );
  let loadBufferSize = bufferSize;

  // If we resample, we need to also fetch some extra samples to prevent audio glitches
  if (!capabilities.sampleRate) {
    loadBufferSize += 20;
  }

  gui.updateState({ ready: true, samples: brstm.metadata.totalSamples });
  gui.updateState({ sampleRate: brstm.metadata.sampleRate });
  playAudioRunning = false;
  // Set the audio loop callback (called by the browser every time the internal buffer expires)
  scriptNode.onaudioprocess = function (audioProcessingEvent) {
    guiupd();
    // Get a handle for the audio buffer
    let outputBuffer = audioProcessingEvent.outputBuffer;
    if (!outputBuffer.copyToChannel)
      // On safari (Because it's retarded), we have to polyfill this
      outputBuffer.copyToChannel = copyToChannelPolyfill;

    // Not enough samples override
    if (playbackCurrentSample + bufferSize + 1024 > samplesReady) {
      // override, return early.
      gui.updateState({ buffering: true });
      console.log("Buffering....");
      outputBuffer.copyToChannel(
        new Float32Array(scriptNode.bufferSize).fill(0),
        0
      );
      outputBuffer.copyToChannel(
        new Float32Array(scriptNode.bufferSize).fill(0),
        1
      );
      return;
    }
    gui.updateState({ buffering: false });
    if (paused) {
      // If we are paused, we just bail out and return with just zeros
      outputBuffer.copyToChannel(
        new Float32Array(scriptNode.bufferSize).fill(0),
        0
      );
      outputBuffer.copyToChannel(
        new Float32Array(scriptNode.bufferSize).fill(0),
        1
      );
      return;
    }

    let samples; // Declare the variable for samples
    // This will be filled using the below code for handling looping
    if (playbackCurrentSample + loadBufferSize < brstm.metadata.totalSamples) {
      // Standard codepath if no loop
      // Populate samples with enough that we can just play it (or resample + play it) without glitches
      samples = partitionedGetSamples(
        brstm,
        playbackCurrentSample,
        loadBufferSize
      );

      // We use bufferSize not loadBufferSize because the last 20 samples if we have resampling are inaudible
      playbackCurrentSample += bufferSize;
    } else {
      // We are reaching EOF
      // Check if we have looping enabled
      if (enableLoop) {
        // First, get all the samples to the end of the file
        samples = partitionedGetSamples(
          brstm,
          playbackCurrentSample,
          brstm.metadata.totalSamples - playbackCurrentSample
        );

        let endSamplesLength = samples[0].length;

        console.log(
          brstm.metadata.totalSamples - playbackCurrentSample,
          loadBufferSize - endSamplesLength
        );

        // Get enough samples to fully populate the buffer AFTER loop start point
        let postLoopSamples = partitionedGetSamples(
          brstm,
          brstm.metadata.loopStartSample,
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
        playbackCurrentSample =
          brstm.metadata.loopStartSample + bufferSize - endSamplesLength;
      } else {
        // No looping
        // Get enough samples until EOF
        samples = partitionedGetSamples(
          brstm,
          playbackCurrentSample,
          brstm.metadata.totalSamples - playbackCurrentSample - 1
        );

        // Fill remaining space in the buffer with 0
        for (let i = 0; i < samples.length; i++) {
          let buf = new Int16Array(loadBufferSize).fill(0);
          buf.set(samples[i]);
          samples[i] = buf;
        }

        // Tell the player that on the next iteration we are at the start and paused
        playbackCurrentSample = 0;
        paused = true;
        setTimeout(function () {
          audioContext.suspend();
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
      if (!capabilities.sampleRate) {
        // Initialize the resampler with the original data we got from BRSTM
        let zresampler = new resampler(
          brstm.metadata.sampleRate,
          audioContext.sampleRate,
          1,
          chan
        );

        // Resample all the samples we loaded
        zresampler.resampler(loadBufferSize);

        // Copy the output to the channel
        chan = zresampler.outputBuffer;

        // Cut off excess samples
        if (chan.length > scriptNode.bufferSize) {
          chan = chan.slice(0, scriptNode.bufferSize);
        }
      }

      // At last, write all samples to the output buffer
      outputBuffer.copyToChannel(chan, i);
    }
  };

  // Gain node controls volume
  gainNode = audioContext.createGain();

  // Script node needs to pass through gain so it can be controlled
  scriptNode.connect(gainNode);

  // Gain node outputs to the actual speakers
  gainNode.connect(audioContext.destination);

  // Set gain node volume to `volumeoverride` for remembering the volume
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
}

window.player = {
  play: startPlaying,
};
