(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn) {
	  var module = { exports: {} };
		return fn(module, module.exports), module.exports;
	}

	var brstm = createCommonjsModule(function (module, exports) {
	var q=(r,t,s)=>{if(!t.has(r))throw TypeError("Cannot "+s)};var e=(r,t,s)=>(q(r,t,"read from private field"),s?s.call(r):t.get(r)),S=(r,t,s)=>{if(t.has(r))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(r):t.set(r,s);},B=(r,t,s,h)=>(q(r,t,"write to private field"),h?h.call(r,s):t.set(r,s),s);var C=(r,t,s)=>(q(r,t,"access private method"),s);Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});function Q(r,t,s){const h=[];for(let i=t;i<t+s;i++)h.push(r[i]);return h}const R={LITTLE:0,BIG:1};function at(r){const t=Q(r,4,2);return t[0]===255&&t[1]===254?R.LITTLE:R.BIG}function nt(r,t,s,h=R.BIG){const i=Q(r,t,s);return h===R.LITTLE&&i.reverse(),String.fromCharCode(...i)}function a(r,t,s,h=R.BIG){const i=Q(r,t,s);return h===R.LITTLE&&i.reverse(),i.reduce((l,n)=>l*256+n,0)}function J(r,t,s){return r<=t?t:r>=s?s:r}function b(r){return r>=32768?r-65536:r}var T,w,g,z,A,L,E,P,M,x,F,Y,G,Z,N,$,O,tt,H,K;class it{constructor(t){S(this,F);S(this,G);S(this,N);S(this,O);S(this,H);S(this,T,void 0);S(this,w,void 0);S(this,g,void 0);S(this,z,void 0);S(this,A,void 0);S(this,L,void 0);S(this,E,void 0);S(this,P,void 0);S(this,M,void 0);S(this,x,void 0);if(B(this,E,null),B(this,P,null),B(this,M,null),B(this,x,[]),this.rawData=new Uint8Array(t),nt(this.rawData,0,4)!=="RSTM")throw new Error("Not a valid BRSTM file");this.endianness=at(this.rawData),B(this,T,a(this.rawData,16,4,this.endianness)),B(this,w,e(this,T)+a(this.rawData,e(this,T)+12,4,this.endianness)+8),B(this,g,e(this,T)+a(this.rawData,e(this,T)+20,4,this.endianness)+8),B(this,z,e(this,T)+a(this.rawData,e(this,T)+28,4,this.endianness)+8),B(this,A,a(this.rawData,24,4,this.endianness)),B(this,L,a(this.rawData,32,4,this.endianness)),this.metadata=C(this,G,Z).call(this);}getAllSamples(){if(e(this,E))return e(this,E);const{numberChannels:t,totalSamples:s,totalBlocks:h,samplesPerBlock:i}=this.metadata,l=[];for(let n=0;n<t;n++)l.push(new Int16Array(s));for(let n=0;n<h;n++){const d=C(this,H,K).call(this,n);for(let p=0;p<t;p++)l[p].set(d[p],n*i);}return B(this,E,l),l}getBuffer(t,s){return this.getSamples(t,s)}getSamples(t,s){const{numberChannels:h,totalBlocks:i,totalSamples:l,samplesPerBlock:n}=this.metadata,d=Math.max(0,t),p=Math.min(l,t+s),o=Math.max(0,Math.floor(d/n)),f=Math.min(i-1,Math.floor(p/n)),D=[];for(let m=o;m<=f;m++)D.push(C(this,H,K).call(this,m));const u=[];for(let m=0;m<h;m++)u.push(new Int16Array(p-d));for(let m=o;m<=f;m++){const I=m-o;if(m===o&&m===f)for(let c=0;c<h;c++)u[c].set(D[I][c].slice(d-o*n,d-o*n+s),0);else if(m===o)for(let c=0;c<h;c++){const k=D[I][c].slice(d-o*n);u[c].set(k,0);}else if(m===f)for(let c=0;c<h;c++){const k=D[I][c].slice(0,p-D[I][c].length-o*n);k.length+(m*n-d)>u[c].length?u[c].set(k.slice(0,s-(m*n-d)),m*n-d):u[c].set(k,m*n-d);}else for(let c=0;c<h;c++)u[c].set(D[I][c],m*n-d);}return u}}T=new WeakMap,w=new WeakMap,g=new WeakMap,z=new WeakMap,A=new WeakMap,L=new WeakMap,E=new WeakMap,P=new WeakMap,M=new WeakMap,x=new WeakMap,F=new WeakSet,Y=function(){if(e(this,M))return e(this,M);const{numberChannels:t}=this.metadata,s=[];for(let h=0;h<t;h++){const i=e(this,T)+a(this.rawData,e(this,z)+8+h*8,4,this.endianness)+8+8,l=[];for(let n=0;n<16;n++){const d=a(this.rawData,i+2*n,2,this.endianness);l.push(b(d));}s.push({adpcmCoefficients:l,gain:a(this.rawData,i+40,2,this.endianness),initialPredictorScale:a(this.rawData,i+42,2,this.endianness),historySample1:a(this.rawData,i+44,2,this.endianness),historySample2:a(this.rawData,i+46,2,this.endianness),loopPredictorScale:a(this.rawData,i+48,2,this.endianness),loopHistorySample1:a(this.rawData,i+50,2,this.endianness),loopHistorySample2:a(this.rawData,i+52,2,this.endianness)});}return B(this,M,s),s},G=new WeakSet,Z=function(){const t=a(this.rawData,e(this,w)+2,1,this.endianness),s=a(this.rawData,e(this,g),1,this.endianness),h=a(this.rawData,e(this,g)+1,1,this.endianness),i=[];for(let n=0;n<s;n++){const d=e(this,T)+8+a(this.rawData,e(this,g)+4+n*8+4,4,this.endianness),p=a(this.rawData,e(this,g)+4+n*8+1,1,this.endianness);let o=0;p===0?o=a(this.rawData,d,1,this.endianness):p===1&&(o=a(this.rawData,d+8,1,this.endianness)),i.push({numberChannels:o,type:p});}const l={fileSize:a(this.rawData,8,4,this.endianness),endianness:this.endianness,codec:a(this.rawData,e(this,w),1,this.endianness),loopFlag:a(this.rawData,e(this,w)+1,1,this.endianness),numberChannels:t,sampleRate:a(this.rawData,e(this,w)+4,2,this.endianness),loopStartSample:a(this.rawData,e(this,w)+8,4,this.endianness),totalSamples:a(this.rawData,e(this,w)+12,4,this.endianness),totalBlocks:a(this.rawData,e(this,w)+20,4,this.endianness),blockSize:a(this.rawData,e(this,w)+24,4,this.endianness),samplesPerBlock:a(this.rawData,e(this,w)+28,4,this.endianness),finalBlockSize:a(this.rawData,e(this,w)+32,4,this.endianness),finalBlockSizeWithPadding:a(this.rawData,e(this,w)+40,4,this.endianness),totalSamplesInFinalBlock:a(this.rawData,e(this,w)+36,4,this.endianness),adpcTableSamplesPerEntry:a(this.rawData,e(this,w)+44,4,this.endianness),adpcTableBytesPerEntry:a(this.rawData,e(this,w)+48,4,this.endianness),numberTracks:s,trackDescriptionType:h,trackDescriptions:i};return l.loopStartSample>=l.totalSamples&&(l.loopFlag=0,l.loopStartSample=0,console.warn("The loop start sample in this file is invalid.")),l},N=new WeakSet,$=function(t){const{blockSize:s,totalBlocks:h,numberChannels:i,finalBlockSize:l,finalBlockSizeWithPadding:n}=this.metadata,d=[];for(let o=0;o<i;o++)d.push(new Uint8Array(t===h-1?l:s));let p=t;for(let o=0;o<i;o++){const f=o!==0&&p+1===h?p*i*s+o*n:(p*i+o)*s,D=p+1===h?f+l:f+s,u=this.rawData.slice(e(this,L)+32+f,e(this,L)+32+D);d[o].set(u);}return d},O=new WeakSet,tt=function(){if(e(this,P))return e(this,P);const{totalBlocks:t,numberChannels:s}=this.metadata,h=a(this.rawData,e(this,A)+4,4,this.endianness),i=this.rawData.slice(e(this,A)+8,e(this,A)+8+h);let l=0,n=0,d=0;for(let f=0;f<s;f++)n=b(a(i,l,2,this.endianness)),l+=2,d=b(a(i,l,2,this.endianness)),l+=2;const p=[];for(let f=0;f<t;f++){p.push([]);for(let D=0;D<s;D++)f>0&&(n=b(a(i,l,2,this.endianness)),l+=2,d=b(a(i,l,2,this.endianness)),l+=2),p[f].push({yn1:n,yn2:d});}let o=[];for(let f=0;f<s;f++)o.push(p.map(D=>D[f]));return B(this,P,o),o},H=new WeakSet,K=function(t){if(e(this,x)[t])return e(this,x)[t];const{numberChannels:s,totalBlocks:h,totalSamplesInFinalBlock:i,samplesPerBlock:l,codec:n}=this.metadata,d=C(this,F,Y).call(this),p=C(this,N,$).call(this,t),o=C(this,O,tt).call(this),f=[],D=t===h-1?i:l;for(let u=0;u<s;u++)f.push(new Int16Array(D));for(let u=0;u<s;u++){const{adpcmCoefficients:m}=d[u],I=p[u],c=[];if(n===2){const k=I[0],{yn1:U,yn2:st}=o[u][t];let W=k,v=U,V=st,_=0;for(let j=0;j<D;){let y=0;j%14===0&&(W=I[_++]),(j++&1)===0?y=I[_]>>4:y=I[_++]&15,y>=8&&(y-=16);const et=1<<(W&15),X=W>>4<<1;y=1024+(et*y<<11)+m[J(X,0,15)]*v+m[J(X+1,0,15)]*V>>11,V=v,v=J(y,-32768,32767),c.push(v);}t<h-1&&(o[u][t+1].yn1=c[D-1],o[u][t+1].yn2=c[D-2]);}else if(n===1)for(let k=0;k<D;k++){const U=b(a(I,k*2,2,this.endianness));c.push(U);}else if(n===0)for(let k=0;k<D;k++)c.push(b(I[k])*256);else throw new Error("Invalid codec");f[u].set(c);}return e(this,x)[t]=f,f};exports.Brstm=it;
	});

	var browserCapabilities_1 = createCommonjsModule(function (module, exports) {
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.browserCapabilities = void 0;
	function browserCapabilities() {
	    return __awaiter(this, void 0, void 0, function* () {
	        let capabilities = {
	            sampleRate: false,
	            streaming: false,
	            mediaSession: false,
	        };
	        // Evaluate webaudio
	        try {
	            let ctx = new (window.AudioContext || AudioContext)({
	                sampleRate: 8000,
	            });
	            capabilities.sampleRate = ctx.sampleRate === 8000;
	            ctx.close();
	        }
	        catch (e) {
	            console.log("WebAudio sample rate capability detection failed. Assuming fallback.");
	        }
	        // Evaluate streaming
	        try {
	            let b = new Uint8Array(Math.pow(2, 16));
	            let blob = new Blob([b], { type: "application/octet-stream" });
	            let u = URL.createObjectURL(blob);
	            let resp = yield fetch(u);
	            let body = yield resp.body;
	            if (!body) {
	                throw "could not get body";
	            }
	            const reader = body.getReader();
	            while (true) {
	                let d = yield reader.read();
	                if (d.done) {
	                    break;
	                }
	            }
	            capabilities.streaming = true;
	        }
	        catch (e) {
	            console.log("Streaming capability detection failed. Assuming fallback.");
	        }
	        // Evaluate mediaSession
	        capabilities.mediaSession = "mediaSession" in navigator;
	        // Check for Chrome 89
	        // https://stackoverflow.com/a/4900484
	        // https://github.com/rphsoftware/revolving-door/issues/10
	        // To Rph: Remove this chunk of code if you manage to implement a proper fix before the heat death of the universe.
	        var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
	        var chromeVersion = raw ? parseInt(raw[2], 10) : false;
	        if (chromeVersion !== false && chromeVersion >= 89) {
	            //Disable native resampling
	            capabilities.sampleRate = false;
	        }
	        return capabilities;
	    });
	}
	exports.browserCapabilities = browserCapabilities;
	});

	var configProvider = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ARTWORK_URL = exports.SILENCE_URL = exports.SMASHCUSTOMMUSIC_URL = exports.PLAYER_TAG_ID = exports.STREAMING_MIN_RESPONSE = void 0;
	exports.STREAMING_MIN_RESPONSE = Math.pow(2, 19);
	exports.PLAYER_TAG_ID = "brstm_player";
	exports.SMASHCUSTOMMUSIC_URL = "https://smashcustommusic.net";
	exports.SILENCE_URL = "https://github.com/anars/blank-audio/blob/master/5-seconds-of-silence.mp3?raw=true";
	exports.ARTWORK_URL = "https://ssb.wiki.gallery/images/a/a2/SSBU_spirit_Smash_Ball.png";
	});

	// @ts-nocheck
	/**
	 * This function serves as an override to AudioBuffer.copyToChannel in order to
	 * make the library more compatible between browsers.
	 */
	function default_1$1(buffer, channelIndex) {
	    let outputBuffer = this.getChannelData(channelIndex);
	    for (let i = 0; i < buffer.length; i++) {
	        outputBuffer[i] = buffer[i];
	    }
	}
	var _default$2 = default_1$1;

	var copyToChannelPolyfill = /*#__PURE__*/Object.defineProperty({
		default: _default$2
	}, '__esModule', {value: true});

	var eventTypes = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PlayerEvent = void 0;
	(function (PlayerEvent) {
	    PlayerEvent["start"] = "brstm_start";
	    PlayerEvent["play"] = "brstm_play";
	    PlayerEvent["pause"] = "brstm_pause";
	    PlayerEvent["playPause"] = "brstm_playpause";
	    PlayerEvent["next"] = "brstm_next";
	    PlayerEvent["stop"] = "brstm_stop";
	    PlayerEvent["seek"] = "brstm_seek";
	    PlayerEvent["setLoop"] = "brstm_setloop";
	    PlayerEvent["setVolume"] = "brstm_setvolume";
	    PlayerEvent["buffering"] = "brstm_buffering";
	    PlayerEvent["loading"] = "brstm_loading";
	    PlayerEvent["loaded"] = "brstm_loaded";
	    PlayerEvent["killed"] = "brstm_killed";
	    PlayerEvent["step"] = "brstm_step";
	    PlayerEvent["resetState"] = "brstm_resetstate";
	})(exports.PlayerEvent || (exports.PlayerEvent = {}));
	});

	//JavaScript Audio Resampler
	//Copyright (C) 2011-2015 Grant Galitz
	//Released to Public Domain
	class Resampler {
	    constructor(fromSampleRate, toSampleRate, channels, inputBuffer) {
	        //Input Sample Rate:
	        this._fromSampleRate = fromSampleRate;
	        //Output Sample Rate:
	        this._toSampleRate = toSampleRate;
	        //Number of channels:
	        this._channels = channels | 0;
	        //Type checking the input buffer:
	        if (typeof inputBuffer != "object") {
	            throw new Error("inputBuffer is not an object.");
	        }
	        if (!(inputBuffer instanceof Array) &&
	            !(inputBuffer instanceof Float32Array) &&
	            !(inputBuffer instanceof Float64Array)) {
	            throw new Error("inputBuffer is not an array or a float32 or a float64 array.");
	        }
	        this._inputBuffer = inputBuffer;
	        // initialize vars
	        this._outputBuffer = new Float32Array();
	        this._lastOutput = new Float32Array();
	        this._resampler = this.linerarInterpolationFn;
	        this._ratioWeight = 1;
	        this._lastWeight = 1;
	        this._tailExists = false;
	        this.initialize();
	    }
	    initialize() {
	        //Perform some checks:
	        if (this._fromSampleRate > 0 &&
	            this._toSampleRate > 0 &&
	            this._channels > 0) {
	            if (this._fromSampleRate == this._toSampleRate) {
	                //Setup a resampler bypass:
	                this._resampler = this.bypassResampler; //Resampler just returns what was passed through.
	                this._ratioWeight = 1;
	                this._outputBuffer = this._inputBuffer;
	            }
	            else {
	                this._ratioWeight = this._fromSampleRate / this._toSampleRate;
	                if (this._fromSampleRate < this._toSampleRate) {
	                    /*
	                              Use generic linear interpolation if upsampling,
	                              as linear interpolation produces a gradient that we want
	                              and works fine with two input sample points per output in this case.
	                          */
	                    this._resampler = this.linerarInterpolationFn;
	                    this._lastWeight = 1;
	                }
	                else {
	                    /*
	                              Custom resampler I wrote that doesn't skip samples
	                              like standard linear interpolation in high downsampling.
	                              This is more accurate than linear interpolation on downsampling.
	                          */
	                    this._resampler = this.multiTapFn;
	                    this._tailExists = false;
	                    this._lastWeight = 0;
	                }
	                this.initializeBuffers();
	            }
	        }
	        else {
	            throw new Error("Invalid settings specified for the resampler.");
	        }
	    }
	    initializeBuffers() {
	        //Initialize the internal buffer:
	        var outputBufferSize = Math.ceil(((this._inputBuffer.length * this._toSampleRate) /
	            this._fromSampleRate /
	            this._channels) *
	            1.000000476837158203125) *
	            this._channels +
	            this._channels;
	        try {
	            this._outputBuffer = new Float32Array(outputBufferSize);
	            this._lastOutput = new Float32Array(this._channels);
	        }
	        catch (error) {
	            this._outputBuffer = new Float32Array([]);
	            this._lastOutput = new Float32Array([]);
	        }
	    }
	    bypassResampler(upTo) {
	        return upTo;
	    }
	    multiTapFn(bufferLength) {
	        var outputOffset = 0;
	        if (bufferLength > 0) {
	            var buffer = this._inputBuffer;
	            var weight = 0;
	            var outputChannels = [];
	            for (var ch = 0; ch < this._channels; ++ch) {
	                outputChannels[0] = 0;
	            }
	            var actualPosition = 0;
	            var amountToNext = 0;
	            var alreadyProcessedTail = !this._tailExists;
	            this._tailExists = false;
	            var outputBuffer = this._outputBuffer;
	            var currentPosition = 0;
	            do {
	                if (alreadyProcessedTail) {
	                    weight = this._ratioWeight;
	                    outputChannels.forEach((_, i) => {
	                        outputChannels[i] = 0;
	                    });
	                }
	                else {
	                    weight = this._lastWeight;
	                    outputChannels.forEach((_, i) => {
	                        outputChannels[i] = this._lastOutput[i];
	                    });
	                    alreadyProcessedTail = true;
	                }
	                while (weight > 0 && actualPosition < bufferLength) {
	                    amountToNext = 1 + actualPosition - currentPosition;
	                    if (weight >= amountToNext) {
	                        outputChannels.forEach((_, i) => {
	                            outputChannels[i] += buffer[actualPosition++] * amountToNext;
	                        });
	                        currentPosition = actualPosition;
	                        weight -= amountToNext;
	                    }
	                    else {
	                        outputChannels.forEach((_, i) => {
	                            outputChannels[i] += buffer[actualPosition + i] * weight;
	                        });
	                        currentPosition += weight;
	                        weight = 0;
	                        break;
	                    }
	                }
	                if (weight <= 0) {
	                    outputChannels.forEach((out) => {
	                        outputBuffer[outputOffset++] = out / this._ratioWeight;
	                    });
	                }
	                else {
	                    this._lastWeight = weight;
	                    outputChannels.forEach((out, i) => {
	                        this._lastOutput[i] = out;
	                    });
	                    this._tailExists = true;
	                    break;
	                }
	            } while (actualPosition < bufferLength);
	        }
	        return outputOffset;
	    }
	    linerarInterpolationFn(bufferLength) {
	        var outputOffset = 0;
	        if (bufferLength > 0) {
	            var buffer = this._inputBuffer;
	            var weight = this._lastWeight;
	            var firstWeight = 0;
	            var secondWeight = 0;
	            var sourceOffset = 0;
	            var outputOffset = 0;
	            var outputBuffer = this._outputBuffer;
	            for (; weight < 1; weight += this._ratioWeight) {
	                secondWeight = weight % 1;
	                firstWeight = 1 - secondWeight;
	                for (var ch = 0; ch < this._channels; ++ch) {
	                    outputBuffer[outputOffset++] =
	                        this._lastOutput[ch] * firstWeight + buffer[ch] * secondWeight;
	                }
	            }
	            weight -= 1;
	            for (bufferLength -= this._channels,
	                sourceOffset = Math.floor(weight) * this._channels; sourceOffset < bufferLength;) {
	                secondWeight = weight % 1;
	                firstWeight = 1 - secondWeight;
	                for (var ch = 0; ch < this._channels; ++ch) {
	                    outputBuffer[outputOffset++] =
	                        buffer[sourceOffset + ch] * firstWeight +
	                            buffer[sourceOffset + ch + this._channels] * secondWeight;
	                }
	                weight += this._ratioWeight;
	                sourceOffset = Math.floor(weight) * this._channels;
	            }
	            for (var ch = 0; ch < this._channels; ++ch) {
	                this._lastOutput[ch] = buffer[sourceOffset++];
	            }
	            this._lastWeight = weight % 1;
	        }
	        return outputOffset;
	    }
	    get outputBuffer() {
	        return this._outputBuffer;
	    }
	    get resampler() {
	        return this._resampler;
	    }
	}
	var _default$1 = Resampler;

	var resampler = /*#__PURE__*/Object.defineProperty({
		default: _default$1
	}, '__esModule', {value: true});

	var util = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.awaitMessage = exports.powersOf2 = exports.sleep = void 0;
	const sleep = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));
	exports.sleep = sleep;
	exports.powersOf2 = [256, 512, 1024, 2048, 4096, 8192, 16384, 32768];
	function awaitMessage(content) {
	    return new Promise((resolve) => {
	        let handler = (evt) => {
	            if (evt.data === content && evt.isTrusted) {
	                window.removeEventListener("message", handler);
	                resolve();
	            }
	        };
	        window.addEventListener("message", handler);
	    });
	}
	exports.awaitMessage = awaitMessage;
	});

	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};

	function default_1(ac) {
	    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
	        let alreadyremoved = false;
	        let unlockWrapper = document.createElement("div");
	        unlockWrapper.setAttribute("style", `background: #888a; z-index: 88888; position: fixed; top: 0; bottom: 0; left: 0; right: 0; display: flex; align-items: center; justify-content: center;`);
	        let unlockPrompt = document.createElement("div");
	        unlockPrompt.setAttribute("style", `display: flex; align-items: center; justify-content: center; flex-direction: column`);
	        unlockPrompt.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" version="1.0"  width="200" height="200" viewBox="0 0 75 75">
<path d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
style="stroke:#fff;stroke-width:5;stroke-linejoin:round;fill:#fff;"
/>
<path d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6" style="fill:none;stroke:#fff;stroke-width:5;stroke-linecap:round"/>
</svg><h1 style="font-family: sans-serif; color: white; margin: 0;">Tap or click anywhere to enable audio.</h1>`;
	        unlockWrapper.appendChild(unlockPrompt);
	        setTimeout(function () {
	            if (!alreadyremoved)
	                document.body.appendChild(unlockWrapper);
	        }, 200);
	        ac.onstatechange = function () {
	            if (ac.state == "running") {
	                resolve();
	                unlockWrapper.remove();
	                alreadyremoved = true;
	            }
	        };
	        try {
	            ac.resume();
	        }
	        catch (e) {
	            console.error(e);
	        }
	        unlockWrapper.addEventListener("touchend", function () {
	            return __awaiter(this, void 0, void 0, function* () {
	                yield ac.resume();
	                if (ac.state === "running") {
	                    resolve();
	                    unlockWrapper.remove();
	                    alreadyremoved = true;
	                }
	            });
	        });
	        unlockWrapper.addEventListener("click", function () {
	            return __awaiter(this, void 0, void 0, function* () {
	                yield ac.resume();
	                if (ac.state === "running") {
	                    resolve();
	                    unlockWrapper.remove();
	                    alreadyremoved = true;
	                }
	            });
	        });
	        if (ac.state === "running") {
	            resolve();
	            unlockWrapper.remove();
	            alreadyremoved = true;
	        }
	    }));
	}
	var _default = default_1;

	var webAudioUnlock = /*#__PURE__*/Object.defineProperty({
		default: _default
	}, '__esModule', {value: true});

	var brstm_1 = brstm;

	var player$1 = createCommonjsModule(function (module, exports) {
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BrstmPlayer = void 0;
	// This script shouldn't do anything without explicit user interaction (Triggering playback)



	const copyToChannelPolyfill_1 = __importDefault(copyToChannelPolyfill);

	const resampler_1 = __importDefault(resampler);

	const webAudioUnlock_1 = __importDefault(webAudioUnlock);
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
	        this._audio.id = configProvider.PLAYER_TAG_ID;
	        this._audio.src = configProvider.SILENCE_URL;
	        this._audio.loop = true;
	        document.body.appendChild(this._audio);
	    }
	    sendEvent(type, payload = {}) {
	        // dispatchEvent(new CustomEvent(type, { detail: payload }));
	        this._audio.dispatchEvent(new CustomEvent(type, { detail: payload, bubbles: true }));
	    }
	    sendUpdateStateEvent() {
	        this.sendEvent(eventTypes.PlayerEvent.step, {
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
	            this.sendEvent(eventTypes.PlayerEvent.loading);
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
	                        this.sendEvent(eventTypes.PlayerEvent.killed, {
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
	                            brstmHeaderSize = configProvider.STREAMING_MIN_RESPONSE;
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
	        this.sendEvent(eventTypes.PlayerEvent.setVolume, {
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
	        this.sendEvent(eventTypes.PlayerEvent.seek, {
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
	        this.sendEvent(eventTypes.PlayerEvent.playPause, {
	            playing: navigator.mediaSession.playbackState === "playing",
	        });
	        this.sendUpdateStateEvent();
	    }
	    setLoop(loopType, loopFor) {
	        this._state.loopType = loopType;
	        this._state.loopFor = loopFor || Number.MAX_SAFE_INTEGER;
	        this.sendEvent(eventTypes.PlayerEvent.setLoop, {
	            loopType,
	            loopFor,
	        });
	        this.sendUpdateStateEvent();
	    }
	    stop() {
	        this._state.stopped = true;
	        if (this._state.musicEnded)
	            this.sendEvent(eventTypes.PlayerEvent.next);
	        else
	            this.sendEvent(eventTypes.PlayerEvent.stop);
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
	    restartState() {
	        this._state = Object.assign(Object.assign({}, this._state), { volume: 1, isCrossfading: false, loopCount: 0, stopped: false });
	    }
	    play(url, options) {
	        return __awaiter(this, void 0, void 0, function* () {
	            this.sendEvent(eventTypes.PlayerEvent.play, {
	                url: url,
	            });
	            this.restartState();
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
	            if (!this._state.hasInitialized) {
	                this.sendEvent(eventTypes.PlayerEvent.start, {
	                    loaded: this._state.samplesReady,
	                });
	            }
	            if (this._state.playAudioRunning)
	                return;
	            this._state.playAudioRunning = true;
	            if (!this._state.fullyLoaded) {
	                console.log("Cancelling last stream...");
	                this._state.streamCancel = true;
	                yield (0, util.awaitMessage)("continueload");
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
	            this.sendEvent(eventTypes.PlayerEvent.resetState, {
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
	                this.sendEvent(eventTypes.PlayerEvent.killed, {
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
	                yield (0, util.sleep)(1000); // In streaming sometimes the start is slightly crunchy, this should fix it.
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
	            this.sendEvent(eventTypes.PlayerEvent.loaded, {
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
	                    this.sendEvent(eventTypes.PlayerEvent.buffering, {
	                        buffering: true,
	                    });
	                    console.log("Buffering....");
	                    outputBuffer.copyToChannel(new Float32Array(this._state.scriptNode.bufferSize).fill(0), 0);
	                    outputBuffer.copyToChannel(new Float32Array(this._state.scriptNode.bufferSize).fill(0), 1);
	                    return;
	                }
	                this.sendEvent(eventTypes.PlayerEvent.buffering, {
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
	                                src: configProvider.ARTWORK_URL,
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
	});

	var gestureEngine = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.runGestureEngine = exports.getInstance = void 0;
	class GestureEngine {
	    constructor() {
	        this.currentlyGesturing = false;
	        this.activeArea = "";
	        this.activeAreaElem = null;
	        this.operationListeners = new Map();
	        this.finishedListeners = new Map();
	    }
	    sanitize(x, y) {
	        let bcr = this.activeAreaElem.getBoundingClientRect();
	        let xx = x - bcr.x;
	        let yy = y - bcr.y;
	        if (xx < 0)
	            xx = 0;
	        if (yy < 0)
	            yy = 0;
	        if (xx > bcr.width)
	            xx = bcr.width;
	        if (yy > bcr.height)
	            yy = bcr.height;
	        return [xx, yy];
	    }
	    fireOp(e, x, y) {
	        if (this.operationListeners.has(e)) {
	            let listeners = this.operationListeners.get(e);
	            if (listeners)
	                listeners.forEach((op) => {
	                    op(x, y);
	                });
	        }
	    }
	    fireFin(e, x, y) {
	        if (this.finishedListeners.has(e)) {
	            let listeners = this.operationListeners.get(e);
	            if (listeners)
	                listeners.forEach((fin) => {
	                    fin(x, y);
	                });
	        }
	    }
	    registerOpEvent(element, cb) {
	        if (this.operationListeners.has(element)) {
	            let z = this.operationListeners.get(element);
	            if (z) {
	                z.push(cb);
	                this.operationListeners.set(element, z);
	            }
	        }
	        else {
	            this.operationListeners.set(element, [cb]);
	        }
	    }
	    registerFinEvent(element, cb) {
	        if (this.finishedListeners.has(element)) {
	            let z = this.finishedListeners.get(element);
	            if (z) {
	                z.push(cb);
	                this.finishedListeners.set(element, z);
	            }
	        }
	        else {
	            this.finishedListeners.set(element, [cb]);
	        }
	    }
	    runGestureEngine() {
	        runGestureEngine();
	    }
	}
	let singleton = new GestureEngine();
	function getInstance() {
	    if (singleton == null) {
	        singleton = new GestureEngine();
	    }
	    return singleton;
	}
	exports.getInstance = getInstance;
	function runGestureEngine() {
	    document.addEventListener("mousedown", function (e) {
	        if (e.target.dataset.gestureHitzone) {
	            singleton.currentlyGesturing = true;
	            singleton.activeArea = e.target.dataset.gestureHitzone;
	            singleton.activeAreaElem = e.target;
	            let [x, y] = singleton.sanitize(e.clientX, e.clientY);
	            singleton.fireOp(singleton.activeArea, x, y);
	        }
	    });
	    document.addEventListener("mousemove", function (e) {
	        if (singleton.currentlyGesturing) {
	            let [x, y] = singleton.sanitize(e.clientX, e.clientY);
	            singleton.fireOp(singleton.activeArea, x, y);
	        }
	    });
	    document.addEventListener("mouseup", function (e) {
	        if (singleton.currentlyGesturing) {
	            let [x, y] = singleton.sanitize(e.clientX, e.clientY);
	            singleton.fireFin(singleton.activeArea, x, y);
	            singleton.currentlyGesturing = false;
	            singleton.activeAreaElem = null;
	            singleton.activeArea = "";
	        }
	    });
	}
	exports.runGestureEngine = runGestureEngine;
	});

	var gui = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.runGUI = void 0;


	const ge = gestureEngine.getInstance();
	let state = {
	    display: false,
	    position: 0,
	    samples: 1e6,
	    loaded: 5e5,
	    volume: 1,
	    paused: false,
	    ready: false,
	    buffering: false,
	    sampleRate: 4.8e4,
	    looping: false,
	    streamingDied: false,
	};
	let overrides = {
	    volume: null,
	    position: null,
	};
	let api = {};
	let volumeCtx = null;
	let barCtx = null;
	let guiElement = null;
	let lastY = -30;
	function hEvent(a) {
	    try {
	        a.preventDefault();
	    }
	    catch (e) { }
	    if (a.targetTouches.length > 0) {
	        let box = a.targetTouches[0].target.getBoundingClientRect();
	        let pos = a.targetTouches[0].clientY + a.targetTouches[0].radiusY - box.top;
	        if (pos < 5)
	            pos = 0;
	        if (pos > 80)
	            pos = 84;
	        let volume = 1 - pos / 84;
	        overrides.volume = volume;
	        if (a.type === "touchend") {
	            state.volume = overrides.volume;
	            api.setVolume(overrides.volume);
	            overrides.volume = null;
	            localStorage.setItem("volumeoverride", volume);
	        }
	        guiUpdate();
	    }
	    else {
	        if (a.type === "touchend") {
	            state.volume = overrides.volume;
	            api.setVolume(overrides.volume);
	            overrides.volume = null;
	        }
	    }
	}
	function hsEvent(a) {
	    try {
	        a.preventDefault();
	    }
	    catch (e) { }
	    if (a.targetTouches.length > 0) {
	        let box = a.targetTouches[0].target.getBoundingClientRect();
	        let pos = a.targetTouches[0].clientX + a.targetTouches[0].radiusX - box.left;
	        if (pos < 5)
	            pos = 0;
	        if (pos > 254)
	            pos = 254;
	        pos = Math.round(pos);
	        if (pos === lastY)
	            return;
	        lastY = pos;
	        let posi = state.samples * (pos / 254);
	        if (posi < state.loaded) {
	            overrides.position = posi;
	        }
	        if (a.type === "touchend") {
	            api.seek(overrides.position);
	            overrides.position = null;
	        }
	        guiUpdate();
	    }
	    else {
	        if (a.type === "touchend") {
	            api.seek(overrides.position);
	            overrides.position = null;
	        }
	    }
	}
	function seekOp(x, y) {
	    let pos = Math.round(x);
	    let posi = state.samples * (pos / 254);
	    if (posi < state.loaded) {
	        overrides.position = posi;
	    }
	    guiUpdate();
	}
	function seekFin(x, y) {
	    let pos = Math.round(x);
	    let posi = state.samples * (pos / 254);
	    if (posi < state.loaded) {
	        overrides.position = posi;
	    }
	    api.seek(posi);
	    overrides.position = null;
	    guiUpdate();
	}
	function volOp(x, y) {
	    y = Math.round(y);
	    overrides.volume = 1 - y / 84;
	    guiUpdate();
	}
	function volFin(x, y) {
	    y = Math.round(y);
	    let volume = 1 - y / 84;
	    overrides.volume = null;
	    localStorage.setItem("volumeoverride", volume);
	    api.setVolume(volume);
	    guiUpdate();
	}
	function runGUI(a) {
	    addEventHandlers();
	    api = a;
	    // Creating GUI
	    guiElement = document.createElement("div");
	    guiElement.style.display = "none";
	    guiElement.classList.add("guiholder");
	    guiElement.innerHTML = `
<div class="error" style="display: none">
    <h3>Playback failed!</h3>
    <h3>Reload the page and try again.</h3>
    <h3>If the issue continues, contact us.</h3>
</div>
<div id="gui-loading-bar">
    <div id="gui-inner-loading-bar"></div>
</div>
<div class="guistate" data-guistate="preload">
    <h3>Loading song...</h3>
</div>
<div class="guistate" data-guistate="ready">
    <div id="pl-pause-play">
        <svg width="48" height="48" viewBox="0 0 48 48" id="pl-play">
            <path d="M 10, 10 l 0, 28 l 28, -14" fill="white"></path>
        </svg>
        <svg width="48" height="48" viewBox="0 0 48 48" id="pl-pause" style="display: none;">
            <path d="M 10, 10 l 0, 28 l 10, 0 l 0, -28 M 28, 10 l 0, 28 l 10, 0 l 0, -28" fill="white"></path>
        </svg>
    </div>
    <canvas id="pl-volume" width="16" height="84" data-gesture-hitzone="volume"></canvas>
    <div id="pl-timing">
        <span id="pl-time-start">0:00</span>
        <span id="pl-time-end"  >0:00</span>
    </div>
    <canvas id="pl-seek" width="254" height="16" data-gesture-hitzone="seek"></canvas>
    <div id="pl-loop">
        <input type="checkbox" id="pl-loop-box" style="width: 16px; height: 16px; margin: 0;">
        <span class="pl-loop-text">Enable loop</span>
        <a class="pl-loop-text" target="_blank" href="https://smashcustommusic.net/feedback/">Send feedback</a>
        <a class="pl-loop-text" target="_blank" href="https://github.com/rphsoftware/revolving-door">v2 by Rph</a>
    </div>
</div>`;
	    document.body.appendChild(guiElement);
	    volumeCtx = document.querySelector("#pl-volume").getContext("2d");
	    barCtx = document.querySelector("#pl-seek").getContext("2d");
	    document.querySelector("#pl-volume").addEventListener("touchstart", hEvent);
	    document.querySelector("#pl-volume").addEventListener("touchmove", hEvent);
	    document.querySelector("#pl-volume").addEventListener("touchend", hEvent);
	    document.querySelector("#pl-seek").addEventListener("touchstart", hsEvent);
	    document.querySelector("#pl-seek").addEventListener("touchmove", hsEvent);
	    document.querySelector("#pl-seek").addEventListener("touchend", hsEvent);
	    document
	        .querySelector("#pl-pause-play")
	        .addEventListener("click", function () {
	        api.playPause();
	        guiUpdate();
	    });
	    document.querySelector("#pl-loop-box").addEventListener("input", function () {
	        state.looping = document.querySelector("#pl-loop-box").checked;
	        api.setLoop(state.looping);
	    });
	    guiElement.addEventListener("drag", function (e) {
	        e.preventDefault();
	    });
	    ge.runGestureEngine();
	    ge.registerOpEvent("seek", seekOp);
	    ge.registerFinEvent("seek", seekFin);
	    ge.registerOpEvent("volume", volOp);
	    ge.registerFinEvent("volume", volFin);
	}
	exports.runGUI = runGUI;
	let lastShowLoading = null;
	let lastReady = null;
	let lastVolume = -1;
	let lastPosition = -1;
	let lastPaused = null;
	let lastLength = -1;
	let lastPositionS = -1;
	let lastLooping = null;
	let lastLoaded = -1;
	let lastStreamState = null;
	function destroyGui() {
	    if (guiElement) {
	        state.display = false;
	        guiElement.style.display = "none";
	    }
	}
	function guiUpdate() {
	    if (state.display) {
	        guiElement.style.display = "block";
	    }
	    if (guiElement) {
	        if (lastStreamState !== state.streamingDied) {
	            guiElement.querySelector(".error").style.display = state.streamingDied
	                ? "flex"
	                : "none";
	            lastStreamState = state.streamingDied;
	        }
	        let showLoading = state.buffering || !state.ready;
	        if (lastShowLoading !== showLoading) {
	            guiElement.querySelector("#gui-loading-bar").dataset.exists = showLoading;
	            lastShowLoading = showLoading;
	        }
	        if (lastReady !== state.ready) {
	            guiElement.querySelector('.guistate[data-guistate="preload"]').style.display = state.ready ? "none" : "block";
	            guiElement.querySelector('.guistate[data-guistate="ready"]').style.display = !state.ready ? "none" : "grid";
	            lastReady = state.ready;
	        }
	        if (!state.ready)
	            return;
	        let vol = Math.round(84 - 84 * state.volume);
	        if (overrides.volume !== null) {
	            vol = Math.round(84 - 84 * overrides.volume);
	        }
	        if (vol !== lastVolume) {
	            volumeCtx.fillStyle = "#444";
	            volumeCtx.fillRect(0, 0, 16, 84);
	            volumeCtx.fillStyle = "hsl(200, 85%, 55%)";
	            volumeCtx.fillRect(0, vol, 16, 84);
	            lastVolume = vol;
	        }
	        let pos = Math.ceil((state.position / state.samples) * 254);
	        if (overrides.position !== null) {
	            pos = Math.ceil((overrides.position / state.samples) * 254);
	        }
	        let loaded = Math.ceil((state.loaded / state.samples) * 254);
	        if (pos !== lastPosition || loaded !== lastLoaded) {
	            barCtx.fillStyle = "#222";
	            barCtx.fillRect(0, 0, 254, 16);
	            barCtx.fillStyle = "#666";
	            barCtx.fillRect(0, 0, Math.min(254, loaded), 16);
	            barCtx.fillStyle = "hsl(200, 85%, 55%)";
	            barCtx.fillRect(0, 0, Math.min(254, pos), 16);
	            lastPosition = pos;
	            lastLoaded = loaded;
	        }
	        if (lastPaused !== state.paused) {
	            guiElement.querySelector("#pl-pause").style.display = state.paused
	                ? "none"
	                : "block";
	            guiElement.querySelector("#pl-play").style.display = !state.paused
	                ? "none"
	                : "block";
	            lastPaused = state.paused;
	        }
	        // Seconds in song
	        let secondsInSong = Math.floor(state.samples / state.sampleRate);
	        let playbackSeconds = Math.floor(state.position / state.sampleRate);
	        if (overrides.position !== null) {
	            playbackSeconds = Math.floor(overrides.position / state.sampleRate);
	        }
	        if (secondsInSong !== lastLength) {
	            guiElement.querySelector("#pl-time-end").innerText = `${Math.floor(secondsInSong / 60)}:${(secondsInSong % 60).toString().padStart(2, "0")}`;
	            lastLength = secondsInSong;
	        }
	        if (playbackSeconds !== lastPositionS) {
	            guiElement.querySelector("#pl-time-start").innerText = `${Math.floor(playbackSeconds / 60)}:${(playbackSeconds % 60).toString().padStart(2, "0")}`;
	            lastPositionS = playbackSeconds;
	        }
	        if (lastLooping !== state.looping) {
	            guiElement.querySelector("#pl-loop-box").checked = state.looping;
	            lastLooping = state.looping;
	        }
	    }
	}
	function addEventHandlers() {
	    let audio = document.getElementById(configProvider.PLAYER_TAG_ID);
	    if (audio) {
	        audio.addEventListener(eventTypes.PlayerEvent.step, (evt) => {
	            state = Object.assign(Object.assign({}, state), { position: evt.detail.position, paused: evt.detail.paused, volume: evt.detail.volume, loaded: evt.detail.loaded, looping: evt.detail.looping });
	            guiUpdate();
	        });
	        audio.addEventListener(eventTypes.PlayerEvent.killed, (evt) => {
	            state = Object.assign(Object.assign({}, state), { streamingDied: evt.detail.streamingDied, buffering: evt.detail.buffering, ready: evt.detail.ready });
	            destroyGui();
	        });
	        audio.addEventListener(eventTypes.PlayerEvent.setVolume, (evt) => {
	            state.volume = evt.detail.volume;
	            guiUpdate();
	        });
	        audio.addEventListener(eventTypes.PlayerEvent.seek, (evt) => {
	            state.position = evt.detail.toSample;
	            guiUpdate();
	        });
	        audio.addEventListener(eventTypes.PlayerEvent.playPause, (evt) => {
	            state.paused = evt.detail.playing;
	            guiUpdate();
	        });
	        audio.addEventListener(eventTypes.PlayerEvent.setLoop, (evt) => {
	            state.looping = evt.detail.loop;
	            guiUpdate();
	        });
	        audio.addEventListener(eventTypes.PlayerEvent.stop, (evt) => {
	            destroyGui();
	        });
	        audio.addEventListener(eventTypes.PlayerEvent.start, (evt) => {
	            state.loaded = evt.detail.loaded;
	            state.display = true;
	            guiUpdate();
	        });
	        audio.addEventListener(eventTypes.PlayerEvent.resetState, (evt) => {
	            state = Object.assign(Object.assign({}, state), { ready: evt.detail.ready, position: evt.detail.position, samples: evt.detail.samples, loaded: evt.detail.loaded, volume: evt.detail.volume, paused: evt.detail.paused, buffering: evt.detail.buffering, sampleRate: evt.detail.sampleRate, streamingDied: evt.detail.streamingDied });
	            guiUpdate();
	        });
	        audio.addEventListener(eventTypes.PlayerEvent.loaded, (evt) => {
	            state = Object.assign(Object.assign({}, state), { ready: evt.detail.ready, samples: evt.detail.samples, sampleRate: evt.detail.sampleRate });
	            guiUpdate();
	        });
	        audio.addEventListener(eventTypes.PlayerEvent.buffering, (evt) => {
	            state.buffering = evt.detail.buffering;
	            guiUpdate();
	        });
	    }
	}
	});

	let player = new player$1.BrstmPlayer();
	gui.runGUI(player);
	window.player = player;

	var dist = /*#__PURE__*/Object.defineProperty({

	}, '__esModule', {value: true});

	return dist;

})();
