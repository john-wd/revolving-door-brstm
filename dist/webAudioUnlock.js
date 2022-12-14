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
exports.default = default_1;
