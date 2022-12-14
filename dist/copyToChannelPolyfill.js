"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
/**
 * This function serves as an override to AudioBuffer.copyToChannel in order to
 * make the library more compatible between browsers.
 */
function default_1(buffer, channelIndex) {
    let outputBuffer = this.getChannelData(channelIndex);
    for (let i = 0; i < buffer.length; i++) {
        outputBuffer[i] = buffer[i];
    }
}
exports.default = default_1;
