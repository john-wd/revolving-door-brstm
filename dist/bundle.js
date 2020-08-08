/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/brstm/dist/brstm.js":
/*!******************************************!*\
  !*** ./node_modules/brstm/dist/brstm.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function t(t,a,e){for(var s=[],r=a;r<a+e;r++)s.push(t[r]);return s}function a(a,e,s){return t(a,e,s).reduce(function(t,a){return 256*t+a},0)}function e(t,a,e){return t<=a?a:t>=e?e:t}function s(t){return t>=32768?t-65536:t}exports.Brstm=function(){function r(e){if(this.rawData=new Uint8Array(e),\"RSTM\"!==(s=t(this.rawData,0,4),String.fromCharCode.apply(String,s)))throw new Error(\"Not a valid BRSTM file\");var s;this._offsetToHead=a(this.rawData,16,4),this._offsetToHeadChunk1=this._offsetToHead+a(this.rawData,this._offsetToHead+12,4)+8,this._offsetToHeadChunk2=this._offsetToHead+a(this.rawData,this._offsetToHead+20,4)+8,this._offsetToHeadChunk3=this._offsetToHead+a(this.rawData,this._offsetToHead+28,4)+8,this._offsetToAdpc=a(this.rawData,24,4),this._offsetToData=a(this.rawData,32,4),this.metadata=this._getMetadata(),this._cachedSamples=null,this._partitionedAdpcChunkData=null,this._cachedChannelInfo=null,this._cachedBlockResults=[]}var o=r.prototype;return o._getChannelInfo=function(){if(this._cachedChannelInfo)return this._cachedChannelInfo;for(var t=this.metadata.numberChannels,e=[],r=0;r<t;r++){for(var o=this._offsetToHead+a(this.rawData,this._offsetToHeadChunk3+8+8*r,4)+8+8,i=[],h=0;h<16;h++){var n=a(this.rawData,o+2*h,2);i.push(s(n))}e.push({adpcmCoefficients:i,gain:a(this.rawData,o+40,2),initialPredictorScale:a(this.rawData,o+42,2),historySample1:a(this.rawData,o+44,2),historySample2:a(this.rawData,o+46,2),loopPredictorScale:a(this.rawData,o+48,2),loopHistorySample1:a(this.rawData,o+50,2),loopHistorySample2:a(this.rawData,o+52,2)})}return this._cachedChannelInfo=e,e},o._getMetadata=function(){var t=a(this.rawData,this._offsetToHeadChunk1+2,1);return{fileSize:a(this.rawData,8,4),codec:a(this.rawData,this._offsetToHeadChunk1,1),loopFlag:a(this.rawData,this._offsetToHeadChunk1+1,1),numberChannels:t,sampleRate:a(this.rawData,this._offsetToHeadChunk1+4,2),loopStartSample:a(this.rawData,this._offsetToHeadChunk1+8,4),totalSamples:a(this.rawData,this._offsetToHeadChunk1+12,4),totalBlocks:a(this.rawData,this._offsetToHeadChunk1+20,4),blockSize:a(this.rawData,this._offsetToHeadChunk1+24,4),samplesPerBlock:a(this.rawData,this._offsetToHeadChunk1+28,4),finalBlockSize:a(this.rawData,this._offsetToHeadChunk1+32,4),finalBlockSizeWithPadding:a(this.rawData,this._offsetToHeadChunk1+40,4),totalSamplesInFinalBlock:a(this.rawData,this._offsetToHeadChunk1+36,4),adpcTableSamplesPerEntry:a(this.rawData,this._offsetToHeadChunk1+44,4),adpcTableBytesPerEntry:a(this.rawData,this._offsetToHeadChunk1+48,4),numberTracks:a(this.rawData,this._offsetToHeadChunk2,1),trackDescriptionType:a(this.rawData,this._offsetToHeadChunk2+1,1)}},o._getPartitionedBlockData=function(t){for(var a=this.metadata,e=a.blockSize,s=a.totalBlocks,r=a.numberChannels,o=a.finalBlockSize,i=a.finalBlockSizeWithPadding,h=[],n=0;n<r;n++)h.push(new Uint8Array(t===s-1?o:e));for(var f=t,l=0;l<r;l++){var c=0!==l&&f+1===s?f*r*e+l*i:(f*r+l)*e,u=this.rawData.slice(this._offsetToData+32+c,this._offsetToData+32+(f+1===s?c+o:c+e));h[l].set(u)}return h},o._getPartitionedAdpcChunkData=function(){if(this._partitionedAdpcChunkData)return this._partitionedAdpcChunkData;for(var t=this.metadata,e=t.totalBlocks,r=t.numberChannels,o=a(this.rawData,this._offsetToAdpc+4,4),i=this.rawData.slice(this._offsetToAdpc+8,this._offsetToAdpc+8+o),h=0,n=0,f=0,l=0;l<r;l++)n=s(a(i,h,2)),f=s(a(i,h+=2,2)),h+=2;for(var c=[],u=0;u<e;u++){c.push([]);for(var d=0;d<r;d++)u>0&&(n=s(a(i,h,2)),f=s(a(i,h+=2,2)),h+=2),c[u].push({yn1:n,yn2:f})}for(var p=[],_=function(t){p.push(c.map(function(a){return a[t]}))},k=0;k<r;k++)_(k);return this._partitionedAdpcChunkData=p,p},o.getAllSamples=function(){if(this._cachedSamples)return this._cachedSamples;for(var t=this.metadata,a=t.numberChannels,e=t.totalSamples,s=t.totalBlocks,r=t.samplesPerBlock,o=[],i=0;i<a;i++)o.push(new Int16Array(e));for(var h=0;h<s;h++)for(var n=this._getSamplesAtBlock(h),f=0;f<a;f++)o[f].set(n[f],h*r);return this._cachedSamples=o,o},o._getSamplesAtBlock=function(t){if(this._cachedBlockResults[t])return this._cachedBlockResults[t];for(var r=this.metadata,o=r.numberChannels,i=r.totalBlocks,h=r.totalSamplesInFinalBlock,n=r.samplesPerBlock,f=r.codec,l=this._getChannelInfo(),c=this._getPartitionedBlockData(t),u=this._getPartitionedAdpcChunkData(),d=[],p=t===i-1?h:n,_=0;_<o;_++)d.push(new Int16Array(p));for(var k=0;k<o;k++){var m=l[k].adpcmCoefficients,D=c[k],w=[];if(2===f){for(var C=u[k][t],T=D[0],v=C.yn1,S=C.yn2,H=0,B=0;B<p;){var g=0;B%14==0&&(T=D[H++]),(g=0==(1&B++)?D[H]>>4:15&D[H++])>=8&&(g-=16);var y=T>>4<<1;g=1024+((1<<(15&T))*g<<11)+m[e(y,0,15)]*v+m[e(y+1,0,15)]*S>>11,S=v,v=e(g,-32768,32767),w.push(v)}t<i-1&&(u[k][t+1].yn1=w[p-1],u[k][t+1].yn2=w[p-2])}else if(1===f)for(var A=0;A<p;A++){var P=s(a(D,2*A,2));w.push(P)}else{if(0!==f)throw new Error(\"Invalid codec\");for(var b=0;b<p;b++)w.push(s(D[b]))}d[k].set(w)}return this._cachedBlockResults[t]=d,d},o.getBuffer=function(t,a){return this.getSamples(t,a)},o.getSamples=function(t,a){for(var e=this.metadata,s=e.numberChannels,r=e.totalBlocks,o=e.totalSamples,i=e.samplesPerBlock,h=Math.max(0,t),n=Math.min(o,t+a),f=Math.max(0,Math.floor(h/i)),l=Math.min(r-1,Math.floor(n/i)),c=[],u=f;u<=l;u++)c.push(this._getSamplesAtBlock(u));for(var d=[],p=0;p<s;p++)d.push(new Int16Array(n-h));for(var _=f;_<=l;_++){var k=_-f;if(_===f&&_===l)for(var m=0;m<s;m++)d[m].set(c[k][m].slice(h-f*i,h-f*i+a),0);else if(_===f)for(var D=0;D<s;D++){var w=c[k][D].slice(h-f*i);d[D].set(w,0)}else if(_===l)for(var C=0;C<s;C++){var T=c[k][C].slice(0,n-c[k][C].length-f*i);d[C].set(T,_*i-h)}else for(var v=0;v<s;v++)d[v].set(c[k][v],_*i-h)}return d},r}();\n//# sourceMappingURL=brstm.js.map\n\n\n//# sourceURL=webpack:///./node_modules/brstm/dist/brstm.js?");

/***/ }),

/***/ "./src/browserCapabilities.js":
/*!************************************!*\
  !*** ./src/browserCapabilities.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = async function() {\n    let capabilities = {\n        sampleRate: false,\n        streaming: false\n    };\n\n    // Evaluate webaudio\n    try {\n        let ctx = new (window.AudioContext||window.webkitAudioContext)({\n            sampleRate: 8000\n        });\n\n        capabilities.sampleRate = (ctx.sampleRate === 8000);\n        ctx.close().then(() => console.log(\"Closed capability detection audio context.\"));\n    } catch(e) {\n        console.log(\"WebAudio sample rate capability detection failed. Assuming fallback.\");\n    }\n\n    // Evaluate streaming\n    try {\n        let b = new Uint8Array(2**16);\n\n        let blob = new Blob([b], {type:\"application/octet-stream\"});\n        let u = URL.createObjectURL(blob);\n        let resp = await fetch(u);\n        let body = await resp.body;\n        const reader = body.getReader();\n\n        while (true) {\n            let d = await reader.read();\n            if (d.done) {\n                break;\n            }\n        }\n        capabilities.streaming = true;\n    } catch(e) {\n        console.log(\"Streaming capability detection failed. Assuming fallback.\");\n    }\n\n    return capabilities;\n}\n\n//# sourceURL=webpack:///./src/browserCapabilities.js?");

/***/ }),

/***/ "./src/configProvider.js":
/*!*******************************!*\
  !*** ./src/configProvider.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports.STREAMING_MIN_RESPONSE = 2**19;\n\n//# sourceURL=webpack:///./src/configProvider.js?");

/***/ }),

/***/ "./src/copyToChannelPolyfill.js":
/*!**************************************!*\
  !*** ./src/copyToChannelPolyfill.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(buf, cid) {\n    let outputBuffer = this.getChannelData(cid);\n    for (let i = 0; i < buf.length; i++) {\n        outputBuffer[i] = buf[i];\n    }\n}\n\n//# sourceURL=webpack:///./src/copyToChannelPolyfill.js?");

/***/ }),

/***/ "./src/gui.js":
/*!********************!*\
  !*** ./src/gui.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("let h = 0;\n\nmodule.exports.alert = function(text) {\n    let box = document.createElement(\"div\");\n    box.innerHTML = `<div style=\"text-align: center; display: flex; align-items: center; justify-content: center; font-family: sans-serif; background-color: #666; color: white; position: fixed; bottom: ${h + 20}px; left: 20px; height: 75px; width: 300px\">\n${text}\n</div>`;\n    h += 100;\n\n    setTimeout(function() {\n        box.remove();\n        h -= 100;\n    }, 1e4);\n\n    document.body.appendChild(box);\n}\n\n//# sourceURL=webpack:///./src/gui.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _resampler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./resampler */ \"./src/resampler.js\");\n/* harmony import */ var _resampler__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_resampler__WEBPACK_IMPORTED_MODULE_0__);\n// This script shouldn't do anything without explicit user interaction (Triggering playback)\n//require(\"regenerator-runtime/runtime\");\nconst browserCapabilities = __webpack_require__(/*! ./browserCapabilities */ \"./src/browserCapabilities.js\");\nconst unlock = __webpack_require__(/*! ./webAudioUnlock */ \"./src/webAudioUnlock.js\");\nconst libbrstm = __webpack_require__(/*! brstm */ \"./node_modules/brstm/dist/brstm.js\");\nconst { STREAMING_MIN_RESPONSE } = __webpack_require__(/*! ./configProvider */ \"./src/configProvider.js\");\nconst copyToChannelPolyfill = __webpack_require__(/*! ./copyToChannelPolyfill */ \"./src/copyToChannelPolyfill.js\");\nconst gui = __webpack_require__(/*! ./gui */ \"./src/gui.js\");\n\nconst powersOf2 = [256, 512, 1024, 2048, 4096, 8192, 16384, 32768];\nlet hasInitialized = false;\nlet capabilities = null;\nlet audioContext = null;\nlet scriptNode = null;\nlet gainNode = null;\nlet fullyLoaded = true;\nlet loadState = 0;\nlet playbackCurrentSample = 0;\nlet brstm = null;\nlet brstmBuffer = null;\n\nfunction getResampledSample(sourceSr, targetSr, sample) {\n    return Math.ceil((sample / sourceSr) * targetSr);\n}\n\nasync function loadSongLegacy(url) {\n    let resp = await fetch(url);\n    let body = await resp.arrayBuffer();\n\n    brstm = new libbrstm.Brstm(body);\n\n    console.log(brstm._getMetadata());\n\n    fullyLoaded = true;\n    loadState = Number.MAX_SAFE_INTEGER;\n}\n\nfunction loadSongStreaming(url) {\n    return new Promise(async (resolve, reject) => {\n        let resp = await fetch(url);\n        let reader = (await resp.body).getReader();\n        brstmBuffer = new ArrayBuffer(parseInt(resp.headers.get(\"content-length\")));\n        let bufferView = new Uint8Array(brstmBuffer);\n        let writeOffset = 0;\n        let resolved = false;\n        let brstmHeaderSize = 0;\n        fullyLoaded = false;\n        while(true) {\n            let d = await reader.read();\n            if (!d.done) {\n                bufferView.set(d.value, writeOffset);\n                writeOffset += d.value.length;\n                loadState = writeOffset;\n                \n                // Read the file's header size from the file before passing the file to the BRSTM reader.\n                if (brstmHeaderSize == 0 && writeOffset > 0x80) {\n                    // Byte order. 0 = LE, 1 = BE.\n                    let endian = 0;\n                    // Read byte order mark. 0x04\n                    let bom = (bufferView[0x04]*256 + bufferView[0x05]);\n                    if (bom == 0xFEFF) {\n                        endian = 1;\n                    }\n                    \n                    // Read the audio offset. 0x70\n                    if(endian == 1) {\n                        brstmHeaderSize = (bufferView[0x70]*16777216 + bufferView[0x71]*65536 + bufferView[0x72]*256 + bufferView[0x73]);\n                    } else {\n                        brstmHeaderSize = (bufferView[0x70] + bufferView[0x71]*256 + bufferView[0x72]*65536 + bufferView[0x73]*16777216);\n                    }\n                    // If the offset in the file turned out to be 0 for some reason or seems to small,\n                    // then fall back to the default minimum size, though the file is very likely to be invalid in this case.\n                    if(brstmHeaderSize < 0x90) {\n                        brstmHeaderSize = STREAMING_MIN_RESPONSE;\n                    }\n                    // Require 64 more bytes just to be safe.\n                    brstmHeaderSize += 64;\n                    \n                    console.log('WO ' + writeOffset + '. LE ' + endian + '. File header size is ' + brstmHeaderSize + ' bytes'); //DEBUG\n                }\n\n                if (!resolved && brstmHeaderSize != 0 && writeOffset > brstmHeaderSize) {\n                    console.log('Creating brstm object with ' + writeOffset + ' bytes of data'); //DEBUG\n                    brstm = new libbrstm.Brstm(brstmBuffer);\n                    resolve();\n                    resolved = true;\n                }\n            } else {\n                if (!resolved) {\n                    console.log('Creating brstm object with all data'); //DEBUG\n                    brstm = new libbrstm.Brstm(brstmBuffer);\n                    resolve();\n                    resolved = true;\n                }\n                fullyLoaded = true;\n                console.log(\"Frog\");\n                break;\n            }\n        }\n    });\n}\n\nasync function startPlaying(url) {\n    if (!hasInitialized) {\n        capabilities = await browserCapabilities();\n        hasInitialized = true;\n    }\n\n    if (fullyLoaded) {\n        await (capabilities.streaming? loadSongStreaming : loadSongLegacy)(url);\n    } else {\n        return gui.alert(\"A song is still loading.\");\n    }\n\n    if (audioContext) {\n        await audioContext.close();\n    }\n\n    playbackCurrentSample = 0;\n\n    audioContext = new (window.AudioContext || window.webkitAudioContext)(capabilities.sampleRate ? {\n        sampleRate: brstm.metadata.sampleRate\n    } : {});\n\n    await unlock(audioContext);\n    console.log(audioContext);\n\n    // Create all the stuff\n    scriptNode = audioContext.createScriptProcessor(4096, 0,\n        brstm.metadata.numberChannels\n    );\n    if (scriptNode.bufferSize > brstm.metadata.samplesPerBlock) {\n        let highest = 256;\n        for (let i = 0; i < powersOf2.length; i++) {\n            if (powersOf2[i] < brstm.metadata.samplesPerBlock) {\n                highest = powersOf2[i];\n            } else {\n                break;\n            }\n        }\n\n        scriptNode = audioContext.createScriptProcessor(highest, 0, brstm.metadata.numberChannels);\n    }\n\n    let bufferSize = scriptNode.bufferSize;\n    bufferSize = capabilities.sampleRate ? bufferSize : getResampledSample(\n        audioContext.sampleRate,\n        brstm.metadata.sampleRate,\n        bufferSize\n    );\n    scriptNode.onaudioprocess = function(audioProcessingEvent) {\n        let outputBuffer = audioProcessingEvent.outputBuffer;\n        if (!outputBuffer.copyToChannel)\n            outputBuffer.copyToChannel = copyToChannelPolyfill;\n\n        let samples = brstm.getSamples(\n            playbackCurrentSample,\n            bufferSize\n        );\n\n        for (let i = 0; i < samples.length; i++) {\n            let chan = new Float32Array(bufferSize);\n            for (let sid = 0; sid < bufferSize; sid++) {\n                chan[sid] = samples[i][sid] / 32768;\n            }\n\n            if (!capabilities.sampleRate) {\n                let zresampler = new _resampler__WEBPACK_IMPORTED_MODULE_0___default.a(brstm.metadata.sampleRate, audioContext.sampleRate, 1, chan);\n                zresampler.resampler(bufferSize);\n                chan = zresampler.outputBuffer;\n                if (chan.length > scriptNode.bufferSize) {\n                    chan = chan.slice(0, scriptNode.bufferSize);\n                }\n            }\n\n            outputBuffer.copyToChannel(chan, i);\n        }\n\n        playbackCurrentSample += bufferSize;\n    }\n\n    gainNode = audioContext.createGain();\n    scriptNode.connect(gainNode);\n    gainNode.connect(audioContext.destination);\n    gainNode.gain.setValueAtTime((localStorage.getItem(\"volumeoverride\") || 1), audioContext.currentTime);\n}\n\nwindow.player = {\n    play: startPlaying\n}\n\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ }),

/***/ "./src/resampler.js":
/*!**************************!*\
  !*** ./src/resampler.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n//JavaScript Audio Resampler\n//Copyright (C) 2011-2015 Grant Galitz\n//Released to Public Domain\nfunction Resampler(fromSampleRate, toSampleRate, channels, inputBuffer) {\n    //Input Sample Rate:\n    this.fromSampleRate = +fromSampleRate;\n    //Output Sample Rate:\n    this.toSampleRate = +toSampleRate;\n    //Number of channels:\n    this.channels = channels | 0;\n    //Type checking the input buffer:\n    if (typeof inputBuffer != \"object\") {\n        throw(new Error(\"inputBuffer is not an object.\"));\n    }\n    if (!(inputBuffer instanceof Array) && !(inputBuffer instanceof Float32Array) && !(inputBuffer instanceof Float64Array)) {\n        throw(new Error(\"inputBuffer is not an array or a float32 or a float64 array.\"));\n    }\n    this.inputBuffer = inputBuffer;\n    //Initialize the resampler:\n    this.initialize();\n}\nResampler.prototype.initialize = function () {\n    //Perform some checks:\n    if (this.fromSampleRate > 0 && this.toSampleRate > 0 && this.channels > 0) {\n        if (this.fromSampleRate == this.toSampleRate) {\n            //Setup a resampler bypass:\n            this.resampler = this.bypassResampler;\t\t//Resampler just returns what was passed through.\n            this.ratioWeight = 1;\n            this.outputBuffer = this.inputBuffer;\n        }\n        else {\n            this.ratioWeight = this.fromSampleRate / this.toSampleRate;\n            if (this.fromSampleRate < this.toSampleRate) {\n                /*\n                    Use generic linear interpolation if upsampling,\n                    as linear interpolation produces a gradient that we want\n                    and works fine with two input sample points per output in this case.\n                */\n                this.compileLinearInterpolationFunction();\n                this.lastWeight = 1;\n            }\n            else {\n                /*\n                    Custom resampler I wrote that doesn't skip samples\n                    like standard linear interpolation in high downsampling.\n                    This is more accurate than linear interpolation on downsampling.\n                */\n                this.compileMultiTapFunction();\n                this.tailExists = false;\n                this.lastWeight = 0;\n            }\n            this.initializeBuffers();\n        }\n    }\n    else {\n        throw(new Error(\"Invalid settings specified for the resampler.\"));\n    }\n}\nResampler.prototype.compileLinearInterpolationFunction = function () {\n    var toCompile = \"var outputOffset = 0;\\\n    if (bufferLength > 0) {\\\n        var buffer = this.inputBuffer;\\\n        var weight = this.lastWeight;\\\n        var firstWeight = 0;\\\n        var secondWeight = 0;\\\n        var sourceOffset = 0;\\\n        var outputOffset = 0;\\\n        var outputBuffer = this.outputBuffer;\\\n        for (; weight < 1; weight += \" + this.ratioWeight + \") {\\\n            secondWeight = weight % 1;\\\n            firstWeight = 1 - secondWeight;\";\n    for (var channel = 0; channel < this.channels; ++channel) {\n        toCompile += \"outputBuffer[outputOffset++] = (this.lastOutput[\" + channel + \"] * firstWeight) + (buffer[\" + channel + \"] * secondWeight);\";\n    }\n    toCompile += \"}\\\n        weight -= 1;\\\n        for (bufferLength -= \" + this.channels + \", sourceOffset = Math.floor(weight) * \" + this.channels + \"; sourceOffset < bufferLength;) {\\\n            secondWeight = weight % 1;\\\n            firstWeight = 1 - secondWeight;\";\n    for (var channel = 0; channel < this.channels; ++channel) {\n        toCompile += \"outputBuffer[outputOffset++] = (buffer[sourceOffset\" + ((channel > 0) ? (\" + \" + channel) : \"\") + \"] * firstWeight) + (buffer[sourceOffset + \" + (this.channels + channel) + \"] * secondWeight);\";\n    }\n    toCompile += \"weight += \" + this.ratioWeight + \";\\\n            sourceOffset = Math.floor(weight) * \" + this.channels + \";\\\n        }\";\n    for (var channel = 0; channel < this.channels; ++channel) {\n        toCompile += \"this.lastOutput[\" + channel + \"] = buffer[sourceOffset++];\";\n    }\n    toCompile += \"this.lastWeight = weight % 1;\\\n    }\\\n    return outputOffset;\";\n    this.resampler = Function(\"bufferLength\", toCompile);\n}\nResampler.prototype.compileMultiTapFunction = function () {\n    var toCompile = \"var outputOffset = 0;\\\n    if (bufferLength > 0) {\\\n        var buffer = this.inputBuffer;\\\n        var weight = 0;\";\n    for (var channel = 0; channel < this.channels; ++channel) {\n        toCompile += \"var output\" + channel + \" = 0;\"\n    }\n    toCompile += \"var actualPosition = 0;\\\n        var amountToNext = 0;\\\n        var alreadyProcessedTail = !this.tailExists;\\\n        this.tailExists = false;\\\n        var outputBuffer = this.outputBuffer;\\\n        var currentPosition = 0;\\\n        do {\\\n            if (alreadyProcessedTail) {\\\n                weight = \" + this.ratioWeight + \";\";\n    for (channel = 0; channel < this.channels; ++channel) {\n        toCompile += \"output\" + channel + \" = 0;\"\n    }\n    toCompile += \"}\\\n            else {\\\n                weight = this.lastWeight;\";\n    for (channel = 0; channel < this.channels; ++channel) {\n        toCompile += \"output\" + channel + \" = this.lastOutput[\" + channel + \"];\"\n    }\n    toCompile += \"alreadyProcessedTail = true;\\\n            }\\\n            while (weight > 0 && actualPosition < bufferLength) {\\\n                amountToNext = 1 + actualPosition - currentPosition;\\\n                if (weight >= amountToNext) {\";\n    for (channel = 0; channel < this.channels; ++channel) {\n        toCompile += \"output\" + channel + \" += buffer[actualPosition++] * amountToNext;\"\n    }\n    toCompile += \"currentPosition = actualPosition;\\\n                    weight -= amountToNext;\\\n                }\\\n                else {\";\n    for (channel = 0; channel < this.channels; ++channel) {\n        toCompile += \"output\" + channel + \" += buffer[actualPosition\" + ((channel > 0) ? (\" + \" + channel) : \"\") + \"] * weight;\"\n    }\n    toCompile += \"currentPosition += weight;\\\n                    weight = 0;\\\n                    break;\\\n                }\\\n            }\\\n            if (weight <= 0) {\";\n    for (channel = 0; channel < this.channels; ++channel) {\n        toCompile += \"outputBuffer[outputOffset++] = output\" + channel + \" / \" + this.ratioWeight + \";\"\n    }\n    toCompile += \"}\\\n            else {\\\n                this.lastWeight = weight;\";\n    for (channel = 0; channel < this.channels; ++channel) {\n        toCompile += \"this.lastOutput[\" + channel + \"] = output\" + channel + \";\"\n    }\n    toCompile += \"this.tailExists = true;\\\n                break;\\\n            }\\\n        } while (actualPosition < bufferLength);\\\n    }\\\n    return outputOffset;\";\n    this.resampler = Function(\"bufferLength\", toCompile);\n}\nResampler.prototype.bypassResampler = function (upTo) {\n    return upTo;\n}\nResampler.prototype.initializeBuffers = function () {\n    //Initialize the internal buffer:\n    var outputBufferSize = (Math.ceil(this.inputBuffer.length * this.toSampleRate / this.fromSampleRate / this.channels * 1.000000476837158203125) * this.channels) + this.channels;\n    try {\n        this.outputBuffer = new Float32Array(outputBufferSize);\n        this.lastOutput = new Float32Array(this.channels);\n    }\n    catch (error) {\n        this.outputBuffer = [];\n        this.lastOutput = [];\n    }\n}\n\nmodule.exports = Resampler;\n\n//# sourceURL=webpack:///./src/resampler.js?");

/***/ }),

/***/ "./src/webAudioUnlock.js":
/*!*******************************!*\
  !*** ./src/webAudioUnlock.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout));\nmodule.exports = function(ac) {\n    return new Promise(async function(resolve) {\n        let alreadyremoved = false;\n        let unlockWrapper = document.createElement(\"div\");\n        unlockWrapper.style = `background: #888a; z-index: 88888; position: fixed; top: 0; bottom: 0; left: 0; right: 0; display: flex; align-items: center; justify-content: center;`\n        let unlockPrompt = document.createElement(\"div\");\n        unlockPrompt.style = `display: flex; align-items: center; justify-content: center; flex-direction: column`;\n        unlockPrompt.innerHTML = `<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.0\"  width=\"200\" height=\"200\" viewBox=\"0 0 75 75\">\n<path d=\"M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z\"\nstyle=\"stroke:#fff;stroke-width:5;stroke-linejoin:round;fill:#fff;\"\n/>\n<path d=\"M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6\" style=\"fill:none;stroke:#fff;stroke-width:5;stroke-linecap:round\"/>\n</svg><h1 style=\"font-family: sans-serif; color: white; margin: 0;\">Tap or click anywhere to enable audio.</h1>`;\n\n        unlockWrapper.appendChild(unlockPrompt);\n\n        setTimeout(function() {\n            if (!alreadyremoved)\n                document.body.appendChild(unlockWrapper);\n        }, 200);\n\n\n        ac.onstatechange = function() {\n            if (ac.state == \"running\") {\n                resolve();\n                unlockWrapper.remove();\n                alreadyremoved = true;\n            }\n        }\n\n        try {\n            ac.resume();\n            console.log(\"!!!!!!!\");\n        } catch(e) {\n            console.error(e);\n        }\n\n        unlockWrapper.addEventListener(\"touchend\", async function() {\n            await ac.resume();\n            if (ac.state === \"running\") {\n                resolve();\n                unlockWrapper.remove();\n                alreadyremoved = true;\n            }\n        });\n\n        unlockWrapper.addEventListener(\"click\", async function() {\n            await ac.resume();\n            if (ac.state === \"running\") {\n                resolve();\n                unlockWrapper.remove();\n                alreadyremoved = true;\n            }\n        });\n\n        if (ac.state === \"running\") {\n            resolve();\n            unlockWrapper.remove();\n            alreadyremoved = true;\n        }\n    });\n}\n\n//# sourceURL=webpack:///./src/webAudioUnlock.js?");

/***/ })

/******/ });