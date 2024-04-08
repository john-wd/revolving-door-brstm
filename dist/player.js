"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrstmPlayer = void 0;
// This script shouldn't do anything without explicit user interaction (Triggering playback)
const brstm_1 = require("brstm");
const browserCapabilities_1 = require("./browserCapabilities");
const configProvider_1 = require("./configProvider");
const copyToChannelPolyfill_1 = __importDefault(require("./copyToChannelPolyfill"));
const eventTypes_1 = require("./eventTypes");
const resampler_1 = __importDefault(require("./resampler"));
const util_1 = require("./util");
const webAudioUnlock_1 = __importDefault(require("./webAudioUnlock"));
function partitionedGetSamples(brstm, start, size) {
    let samples = [];
    let got = 0;
    for (let i = 0; i < brstm.metadata.numberChannels; i++) {
        samples.push(new Int16Array(size));
    }
    while (got < size) {
        let buf = brstm.getSamples(start + got, Math.min(brstm.metadata.samplesPerBlock, size - got));
        for (let i = 0; i < buf.length; i++) {
            samples[i].set(buf[i], got);
        }
        got += Math.min(brstm.metadata.samplesPerBlock, size - got);
    }
    return samples;
}
class BrstmPlayer {
    constructor() {
        this._state = {
            hasInitialized: false,
            capabilities: {},
            audioContext: new AudioContext(),
            scriptNode: {},
            gainNode: {},
            fullyLoaded: true,
            loadState: 0,
            playbackCurrentSample: 0,
            brstm: {},
            brstmBuffer: new ArrayBuffer(0),
            paused: false,
            stopped: false,
            enableLoop: false,
            loopCount: 0,
            loopFor: Number.MAX_SAFE_INTEGER,
            streamCancel: false,
            playAudioRunning: false,
            volume: Number(localStorage.getItem("volumeoverride")) || 1,
            samplesReady: 0,
            isCrossfading: false,
            musicEnded: false,
            crossfade: false,
        };
        this._audio = document.createElement("audio");
        this._audio.id = configProvider_1.PLAYER_TAG_ID;
        this._audio.src = configProvider_1.SILENCE_URL;
        this._audio.loop = true;
        document.body.appendChild(this._audio);
    }
    sendEvent(type, payload = {}) {
        // dispatchEvent(new CustomEvent(type, { detail: payload }));
        this._audio.dispatchEvent(new CustomEvent(type, { detail: payload, bubbles: true }));
    }
    sendUpdateStateEvent() {
        this.sendEvent(eventTypes_1.PlayerEvent.step, {
            position: this._state.playbackCurrentSample,
            paused: this._state.paused,
            volume: this._state.volume,
            loaded: this._state.samplesReady,
            looping: this._state.enableLoop,
        });
    }
    getResampledSample(sourceSr, targetSr, sample) {
        return Math.ceil((sample / sourceSr) * targetSr);
    }
    loadSongLegacy(url) {
        return __awaiter(this, void 0, void 0, function* () {
            // Old song loading logic
            let resp = yield fetch(url);
            let body = yield resp.arrayBuffer(); // Fetch whole song
            this._state.brstm = new brstm_1.Brstm(body);
            this._state.fullyLoaded = true;
            this._state.loadState = Number.MAX_SAFE_INTEGER; // This is legacy loading logic, we can just assume we downloaded everything
            this._state.samplesReady = Number.MAX_SAFE_INTEGER;
        });
    }
    loadSongStreaming(url) {
        // New, fancy song loading logic
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this.sendEvent(eventTypes_1.PlayerEvent.loading);
            let resp;
            let reader;
            try {
                resp = yield fetch(url);
                let body = yield resp.body;
                if (!body)
                    throw "could not read body";
                reader = body.getReader(); // Initialize reader
                let length = resp.headers.get("content-length");
                if (!length)
                    throw "could not read content-length header";
                this._state.brstmBuffer = new ArrayBuffer(parseInt(length));
            }
            catch (e) {
                return reject(e);
            }
            let bufferView = new Uint8Array(this._state.brstmBuffer); // Create shared memory view
            let writeOffset = 0; // How much we read
            let resolved = false; // Did we resolve the promise already
            let brstmHeaderSize = 0;
            this._state.samplesReady = 0;
            this._state.fullyLoaded = false; // We are now streaming
            this._state.streamCancel = false;
            while (true) {
                let d;
                try {
                    d = yield reader.read(); // Read next chunk
                }
                catch (e) {
                    if (resolved) {
                        this.sendEvent(eventTypes_1.PlayerEvent.killed, {
                            streamingDied: true,
                            buffering: false,
                            ready: true,
                        });
                        yield this._state.audioContext.close();
                        this._state.audioContext = {};
                    }
                    else {
                        reject(e);
                    }
                    return;
                }
                if (this._state.streamCancel) {
                    yield reader.cancel();
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
                        }
                        else {
                            brstmHeaderSize =
                                bufferView[0x70] +
                                    bufferView[0x71] * 256 +
                                    bufferView[0x72] * 65536 +
                                    bufferView[0x73] * 16777216;
                        }
                        // If the offset in the file turned out to be 0 for some reason or seems to small,
                        // then fall back to the default minimum size, though the file is very likely to be invalid in this case.
                        if (brstmHeaderSize < 0x90) {
                            brstmHeaderSize = configProvider_1.STREAMING_MIN_RESPONSE;
                        }
                    }
                    if (!resolved &&
                        brstmHeaderSize != 0 &&
                        writeOffset > brstmHeaderSize) {
                        // Initialize BRSTM instance and allow player to continue loading
                        try {
                            this._state.brstm = new brstm_1.Brstm(this._state.brstmBuffer);
                            resolve();
                            resolved = true;
                        }
                        catch (e) {
                            reject(e);
                            return;
                        }
                    }
                    if (resolved) {
                        this._state.samplesReady =
                            Math.floor((this._state.loadState - brstmHeaderSize) /
                                this._state.brstm.metadata.numberChannels /
                                this._state.brstm.metadata.blockSize) * this._state.brstm.metadata.samplesPerBlock;
                    }
                }
                else {
                    if (!resolved) {
                        // For some reason we haven't resolved yet despite the file finishing
                        try {
                            this._state.brstm = new brstm_1.Brstm(this._state.brstmBuffer);
                            resolve();
                            resolved = true;
                        }
                        catch (e) {
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
        }));
    }
    get totalSamples() {
        return this._state.brstm ? this._state.brstm.metadata.totalSamples : -1;
    }
    get sampleRate() {
        return this._state.brstm ? this._state.brstm.metadata.sampleRate : -1;
    }
    getSongLength() {
        return this.totalSamples / this.sampleRate;
    }
    crossfadeStep() {
        this.decVolume(0.01);
        if (this._state.volume <= 0) {
            this.stop();
        }
    }
    setVolume(level) {
        this._state.volume = level;
        this.sendEvent(eventTypes_1.PlayerEvent.setVolume, {
            volume: level,
        });
        this.sendUpdateStateEvent();
        if (this._state.gainNode)
            this._state.gainNode.gain.setValueAtTime(this._state.volume, this._state.audioContext.currentTime);
    }
    incVolume(step) {
        this.setVolume(Math.min(this._state.volume + step, 1));
    }
    decVolume(step) {
        this.setVolume(Math.max(this._state.volume - step, 0));
    }
    seek(to) {
        this._state.playbackCurrentSample = Math.floor(to);
        this.sendEvent(eventTypes_1.PlayerEvent.seek, {
            toSample: this._state.playbackCurrentSample,
        });
        this.sendUpdateStateEvent();
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
        this.sendEvent(eventTypes_1.PlayerEvent.playPause, {
            playing: navigator.mediaSession.playbackState === "playing",
        });
        this.sendUpdateStateEvent();
    }
    setLoop(loopType, loopFor) {
        this._state.loopType = loopType;
        this._state.loopFor = loopFor || Number.MAX_SAFE_INTEGER;
        this.sendEvent(eventTypes_1.PlayerEvent.setLoop, {
            loopType,
            loopFor,
        });
        this.sendUpdateStateEvent();
    }
    stop() {
        this._state.stopped = true;
        if (this._state.musicEnded)
            this.sendEvent(eventTypes_1.PlayerEvent.next);
        else
            this.sendEvent(eventTypes_1.PlayerEvent.stop);
    }
    shouldLoop() {
        let loopNow = false;
        switch (this._state.loopType) {
            case "count":
                loopNow = this._state.loopCount < this._state.loopFor;
                break;
            case "time":
                loopNow = this._state.loopCount * (this.totalSamples / this.sampleRate) < this._state.loopFor;
                break;
            case "none":
                loopNow = false;
                break;
            case "infinite":
                return true;
        }
        if (!loopNow) {
            if (this._state.crossfade) {
                this._state.isCrossfading = true;
                return true; // loop one last time
            }
            this._state.musicEnded = true;
        }
        this._state.loopCount += 1;
        return loopNow;
    }
    restartState(volume = 1) {
        this._state = Object.assign(Object.assign({}, this._state), { volume: volume, isCrossfading: false, loopCount: 0, stopped: false });
    }
    play(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sendEvent(eventTypes_1.PlayerEvent.play, {
                url: url,
            });
            this.restartState((options === null || options === void 0 ? void 0 : options.volume) || 1);
            this._state.capabilities = yield (0, browserCapabilities_1.browserCapabilities)();
            if (options) {
                this._state.crossfade = options.crossfade;
                this._state.loopType = options.loopType;
                if (options.loopFor)
                    this._state.loopFor = options.loopFor;
                // fetch details
                if (options.mediaControls) {
                    this._setMediaSessionData(options.song);
                    if (this._state.capabilities.mediaSession) {
                        navigator.mediaSession.playbackState = "playing";
                    }
                }
            }
            // Entry point to the
            this._state.stopped = false;
            console.log(`Playing ${url}`);
            this.sendEvent(eventTypes_1.PlayerEvent.buffering, {
                buffering: true,
            });
            if (!this._state.hasInitialized) {
                this.sendEvent(eventTypes_1.PlayerEvent.start, {
                    loaded: this._state.samplesReady,
                });
            }
            if (this._state.playAudioRunning)
                return;
            this._state.playAudioRunning = true;
            if (!this._state.fullyLoaded) {
                console.log("Cancelling last stream...");
                this._state.streamCancel = true;
                yield (0, util_1.awaitMessage)("continueload");
                console.log("Done.");
            }
            if (this._state.audioContext) {
                // We have a previous audio context, we need to murderize it
                yield this._state.audioContext.close();
                this._state.audioContext = {};
            }
            this._state.playbackCurrentSample = 0; // Set the state for playback
            this._state.paused = false; // Unpause it
            // Populate GUI with initial, yet unknown data
            this.sendEvent(eventTypes_1.PlayerEvent.resetState, {
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
                yield (this._state.capabilities.streaming
                    ? this.loadSongStreaming.bind(this)
                    : this.loadSongLegacy.bind(this))(url); // Begin loading based on capabilities
            }
            catch (e) {
                this.sendEvent(eventTypes_1.PlayerEvent.killed, {
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
            this._state.audioContext = new window.AudioContext(// Because Safari is retarded
            this._state.capabilities.sampleRate
                ? { sampleRate: this._state.brstm.metadata.sampleRate }
                : {}); // Do we support sampling?
            // If not, we just let the browser pick
            this._state.enableLoop = this._state.brstm.metadata.loopFlag === 1; // Set the loop settings respective to the loop flag in brstm file
            yield (0, webAudioUnlock_1.default)(this._state.audioContext); // Request unlocking of the audio context
            if (this._state.capabilities.streaming) {
                yield (0, util_1.sleep)(1000); // In streaming sometimes the start is slightly crunchy, this should fix it.
            }
            // Create the script node
            this._state.scriptNode = this._state.audioContext.createScriptProcessor(0, 0, 2);
            // Process bufferSize
            let bufferSize = this._state.scriptNode.bufferSize;
            // If we have to resample, the buffer that we get from the BRSTM will be different size.
            bufferSize = this._state.capabilities.sampleRate
                ? bufferSize
                : this.getResampledSample(this._state.audioContext.sampleRate, this._state.brstm.metadata.sampleRate, bufferSize);
            let loadBufferSize = bufferSize;
            // If we resample, we need to also fetch some extra samples to prevent audio glitches
            if (!this._state.capabilities.sampleRate) {
                loadBufferSize += 20;
            }
            this.sendEvent(eventTypes_1.PlayerEvent.loaded, {
                ready: true,
                samples: this._state.brstm.metadata.totalSamples,
                sampleRate: this._state.brstm.metadata.sampleRate,
            });
            this._state.playAudioRunning = false;
            // Set the audio loop callback (called by the browser every time the internal buffer expires)
            this._state.scriptNode.onaudioprocess = (audioProcessingEvent) => {
                if (this._state.stopped === true)
                    return;
                this.sendUpdateStateEvent();
                // Get a handle for the audio buffer
                let outputBuffer = audioProcessingEvent.outputBuffer;
                if (!outputBuffer.copyToChannel)
                    // On safari (Because it's retarded), we have to polyfill this
                    outputBuffer.copyToChannel = copyToChannelPolyfill_1.default;
                // Not enough samples override
                if (this._state.playbackCurrentSample + bufferSize + 1024 >
                    this._state.samplesReady) {
                    // override, return early.
                    this.sendEvent(eventTypes_1.PlayerEvent.buffering, {
                        buffering: true,
                    });
                    console.log("Buffering....");
                    outputBuffer.copyToChannel(new Float32Array(this._state.scriptNode.bufferSize).fill(0), 0);
                    outputBuffer.copyToChannel(new Float32Array(this._state.scriptNode.bufferSize).fill(0), 1);
                    return;
                }
                this.sendEvent(eventTypes_1.PlayerEvent.buffering, {
                    buffering: false,
                });
                if (this._state.paused) {
                    // If we are paused, we just bail out and return with just zeros
                    outputBuffer.copyToChannel(new Float32Array(this._state.scriptNode.bufferSize).fill(0), 0);
                    outputBuffer.copyToChannel(new Float32Array(this._state.scriptNode.bufferSize).fill(0), 1);
                    return;
                }
                let samples; // Declare the variable for samples
                // This will be filled using the below code for handling looping
                if (this._state.playbackCurrentSample + loadBufferSize <
                    this._state.brstm.metadata.totalSamples) {
                    // Step crossfader, if enabled
                    if (this._state.isCrossfading)
                        this.crossfadeStep();
                    // Standard codepath if no loop
                    // Populate samples with enough that we can just play it (or resample + play it) without glitches
                    samples = partitionedGetSamples(this._state.brstm, this._state.playbackCurrentSample, loadBufferSize);
                    // We use bufferSize not loadBufferSize because the last 20 samples if we have resampling are inaudible
                    this._state.playbackCurrentSample += bufferSize;
                }
                else {
                    // We are reaching EOF
                    // Check if we have looping enabled
                    if (this.shouldLoop()) {
                        // First, get all the samples to the end of the file
                        samples = partitionedGetSamples(this._state.brstm, this._state.playbackCurrentSample, this._state.brstm.metadata.totalSamples -
                            this._state.playbackCurrentSample);
                        let endSamplesLength = samples[0].length;
                        console.log(this._state.brstm.metadata.totalSamples -
                            this._state.playbackCurrentSample, loadBufferSize - endSamplesLength);
                        // Get enough samples to fully populate the buffer AFTER loop start point
                        let postLoopSamples = partitionedGetSamples(this._state.brstm, this._state.brstm.metadata.loopStartSample, loadBufferSize - endSamplesLength);
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
                    }
                    else {
                        // No looping
                        // Get enough samples until EOF
                        samples = partitionedGetSamples(this._state.brstm, this._state.playbackCurrentSample, this._state.brstm.metadata.totalSamples -
                            this._state.playbackCurrentSample -
                            1);
                        // Fill remaining space in the buffer with 0
                        for (let i = 0; i < samples.length; i++) {
                            let buf = new Int16Array(loadBufferSize).fill(0);
                            buf.set(samples[i]);
                            samples[i] = buf;
                        }
                        // Tell the player that on the next iteration we are at the start and paused
                        this._state.playbackCurrentSample = 0;
                        this._state.paused = true;
                        this.stop();
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
                        let zresampler = new resampler_1.default(this._state.brstm.metadata.sampleRate, this._state.audioContext.sampleRate, 1, chan);
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
            this._state.gainNode.gain.setValueAtTime(this._state.volume, this._state.audioContext.currentTime);
        });
    }
    _setMediaSessionData(song) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._state.capabilities.mediaSession) {
                return;
            }
            this._audio
                .play()
                .then((_) => {
                if (song)
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: song.name,
                        album: song.game_name,
                        artist: song.uploader,
                        artwork: [
                            {
                                src: configProvider_1.ARTWORK_URL,
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
            })
                .catch((error) => {
                console.error(error);
            });
        });
    }
}
exports.BrstmPlayer = BrstmPlayer;
