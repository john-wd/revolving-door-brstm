type listernerFn = (x: number, y: number, callbackfn?: () => void) => void;

class GestureEngine {
  constructor() {
    this.currentlyGesturing = false;
    this.activeArea = "";
    this.activeAreaElem = null;
    this.operationListeners = new Map();
    this.finishedListeners = new Map();
  }

  public currentlyGesturing: boolean;
  public activeArea;
  public activeAreaElem: any;

  public operationListeners: Map<string, listernerFn>;
  public finishedListeners: Map<string, listernerFn>;

  public sanitize(x, y) {
    let bcr = this.activeAreaElem.getBoundingClientRect();

    let xx = x - bcr.x;
    let yy = y - bcr.y;

    if (xx < 0) xx = 0;
    if (yy < 0) yy = 0;
    if (xx > bcr.width) xx = bcr.width;
    if (yy > bcr.height) yy = bcr.height;

    return [xx, yy];
  }

  public fireOp(e, x, y) {
    if (this.operationListeners.has(e)) {
      for (let i = 0; i < this.operationListeners.get(e).length; i++) {
        this.operationListeners.get(e)[i](x, y);
      }
    }
  }

  public fireFin(e, x, y) {
    if (this.finishedListeners.has(e)) {
      for (let i = 0; i < this.finishedListeners.get(e).length; i++) {
        this.finishedListeners.get(e)[i](x, y);
      }
    }
  }

  registerOpEvent = function (element, cb) {
    if (this.operationListeners.has(element)) {
      let z = this.operationListeners.get(element);
      z.push(cb);
      this.operationListeners.set(element, z);
    } else {
      this.operationListeners.set(element, [cb]);
    }
  };

  registerFinEvent = function (element, cb) {
    if (this.finishedListeners.has(element)) {
      let z = this.finishedListeners.get(element);
      z.push(cb);
      this.finishedListeners.set(element, z);
    } else {
      this.finishedListeners.set(element, [cb]);
    }
  };

  runGestureEngine() {
    runGestureEngine();
  }
}

let singleton = new GestureEngine();

function getInstance(): GestureEngine {
  if (singleton == null) {
    singleton = new GestureEngine();
  }
  return singleton;
}

function runGestureEngine() {
  document.addEventListener("mousedown", function (e: any) {
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

export { getInstance, runGestureEngine };
