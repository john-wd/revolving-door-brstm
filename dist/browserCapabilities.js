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
