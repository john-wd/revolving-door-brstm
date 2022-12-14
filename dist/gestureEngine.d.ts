type listernerFn = (x: number, y: number, callbackfn?: () => void) => void;
declare class GestureEngine {
    constructor();
    currentlyGesturing: boolean;
    activeArea: string;
    activeAreaElem: any;
    operationListeners: Map<string, listernerFn[]>;
    finishedListeners: Map<string, listernerFn[]>;
    sanitize(x: number, y: number): number[];
    fireOp(e: string, x: number, y: number): void;
    fireFin(e: string, x: number, y: number): void;
    registerOpEvent(element: string, cb: listernerFn): void;
    registerFinEvent(element: string, cb: listernerFn): void;
    runGestureEngine(): void;
}
declare function getInstance(): GestureEngine;
declare function runGestureEngine(): void;
export { getInstance, runGestureEngine };
