"use strict";
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
