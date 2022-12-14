export default class Resampler {
    constructor(fromSampleRate: number, toSampleRate: number, channels: number, inputBuffer: Float32Array | Float64Array);
    initialize(): void;
    initializeBuffers(): void;
    bypassResampler(upTo: number): number;
    multiTapFn(bufferLength: number): number;
    linerarInterpolationFn(bufferLength: number): number;
    get outputBuffer(): Float32Array | Float64Array;
    get resampler(): Function;
    private _fromSampleRate;
    private _toSampleRate;
    private _channels;
    private _inputBuffer;
    private _outputBuffer;
    private _lastOutput;
    private _resampler;
    private _ratioWeight;
    private _lastWeight;
    private _tailExists;
}
