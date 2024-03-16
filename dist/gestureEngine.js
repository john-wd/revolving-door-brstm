"use strict";
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
