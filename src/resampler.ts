"use strict";
//JavaScript Audio Resampler
//Copyright (C) 2011-2015 Grant Galitz
//Released to Public Domain

export default class Resampler {
  constructor(
    fromSampleRate: number,
    toSampleRate: number,
    channels: number,
    inputBuffer: Float32Array | Float64Array
  ) {
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
    if (
      !(inputBuffer instanceof Array) &&
      !(inputBuffer instanceof Float32Array) &&
      !(inputBuffer instanceof Float64Array)
    ) {
      throw new Error(
        "inputBuffer is not an array or a float32 or a float64 array."
      );
    }
    this._inputBuffer = inputBuffer;
    this.initialize();
  }

  initialize() {
    //Perform some checks:
    if (
      this._fromSampleRate > 0 &&
      this._toSampleRate > 0 &&
      this._channels > 0
    ) {
      if (this._fromSampleRate == this._toSampleRate) {
        //Setup a resampler bypass:
        this._resampler = this.bypassResampler; //Resampler just returns what was passed through.
        this._ratioWeight = 1;
        this._outputBuffer = this._inputBuffer;
      } else {
        this._ratioWeight = this._fromSampleRate / this._toSampleRate;
        if (this._fromSampleRate < this._toSampleRate) {
          /*
                    Use generic linear interpolation if upsampling,
                    as linear interpolation produces a gradient that we want
                    and works fine with two input sample points per output in this case.
                */
          this.compileLinearInterpolationFunction();
          this._lastWeight = 1;
        } else {
          /*
                    Custom resampler I wrote that doesn't skip samples
                    like standard linear interpolation in high downsampling.
                    This is more accurate than linear interpolation on downsampling.
                */
          this.compileMultiTapFunction();
          this.tailExists = false;
          this._lastWeight = 0;
        }
        this.initializeBuffers();
      }
    } else {
      throw new Error("Invalid settings specified for the resampler.");
    }
  }
  initializeBuffers() {
    //Initialize the internal buffer:
    var outputBufferSize =
      Math.ceil(
        ((this._inputBuffer.length * this._toSampleRate) /
          this._fromSampleRate /
          this._channels) *
          1.000000476837158203125
      ) *
        this._channels +
      this._channels;
    try {
      this._outputBuffer = new Float32Array(outputBufferSize);
      this._lastOutput = new Float32Array(this._channels);
    } catch (error) {
      this._outputBuffer = new Float32Array([]);
      this._lastOutput = new Float32Array([]);
    }
  }
  bypassResampler(upTo: number): number {
    return upTo;
  }
  compileMultiTapFunction() {
    var toCompile =
      "var outputOffset = 0;\
    if (bufferLength > 0) {\
        var buffer = this.inputBuffer;\
        var weight = 0;";
    for (var channel = 0; channel < this._channels; ++channel) {
      toCompile += "var output" + channel + " = 0;";
    }
    toCompile +=
      "var actualPosition = 0;\
        var amountToNext = 0;\
        var alreadyProcessedTail = !this.tailExists;\
        this.tailExists = false;\
        var outputBuffer = this.outputBuffer;\
        var currentPosition = 0;\
        do {\
            if (alreadyProcessedTail) {\
                weight = " +
      this._ratioWeight +
      ";";
    for (channel = 0; channel < this._channels; ++channel) {
      toCompile += "output" + channel + " = 0;";
    }
    toCompile +=
      "}\
            else {\
                weight = this.lastWeight;";
    for (channel = 0; channel < this._channels; ++channel) {
      toCompile += "output" + channel + " = this.lastOutput[" + channel + "];";
    }
    toCompile +=
      "alreadyProcessedTail = true;\
            }\
            while (weight > 0 && actualPosition < bufferLength) {\
                amountToNext = 1 + actualPosition - currentPosition;\
                if (weight >= amountToNext) {";
    for (channel = 0; channel < this._channels; ++channel) {
      toCompile +=
        "output" + channel + " += buffer[actualPosition++] * amountToNext;";
    }
    toCompile +=
      "currentPosition = actualPosition;\
                    weight -= amountToNext;\
                }\
                else {";
    for (channel = 0; channel < this._channels; ++channel) {
      toCompile +=
        "output" +
        channel +
        " += buffer[actualPosition" +
        (channel > 0 ? " + " + channel : "") +
        "] * weight;";
    }
    toCompile +=
      "currentPosition += weight;\
                    weight = 0;\
                    break;\
                }\
            }\
            if (weight <= 0) {";
    for (channel = 0; channel < this._channels; ++channel) {
      toCompile +=
        "outputBuffer[outputOffset++] = output" +
        channel +
        " / " +
        this._ratioWeight +
        ";";
    }
    toCompile +=
      "}\
            else {\
                this.lastWeight = weight;";
    for (channel = 0; channel < this._channels; ++channel) {
      toCompile += "this.lastOutput[" + channel + "] = output" + channel + ";";
    }
    toCompile +=
      "this.tailExists = true;\
                break;\
            }\
        } while (actualPosition < bufferLength);\
    }\
    return outputOffset;";
    this._resampler = Function("bufferLength", toCompile);
  }
  compileLinearInterpolationFunction() {
    var toCompile =
      "var outputOffset = 0;\
    if (bufferLength > 0) {\
        var buffer = this.inputBuffer;\
        var weight = this.lastWeight;\
        var firstWeight = 0;\
        var secondWeight = 0;\
        var sourceOffset = 0;\
        var outputOffset = 0;\
        var outputBuffer = this.outputBuffer;\
        for (; weight < 1; weight += " +
      this._ratioWeight +
      ") {\
            secondWeight = weight % 1;\
            firstWeight = 1 - secondWeight;";
    for (var channel = 0; channel < this._channels; ++channel) {
      toCompile +=
        "outputBuffer[outputOffset++] = (this.lastOutput[" +
        channel +
        "] * firstWeight) + (buffer[" +
        channel +
        "] * secondWeight);";
    }
    toCompile +=
      "}\
        weight -= 1;\
        for (bufferLength -= " +
      this._channels +
      ", sourceOffset = Math.floor(weight) * " +
      this._channels +
      "; sourceOffset < bufferLength;) {\
            secondWeight = weight % 1;\
            firstWeight = 1 - secondWeight;";
    for (var channel = 0; channel < this._channels; ++channel) {
      toCompile +=
        "outputBuffer[outputOffset++] = (buffer[sourceOffset" +
        (channel > 0 ? " + " + channel : "") +
        "] * firstWeight) + (buffer[sourceOffset + " +
        (this._channels + channel) +
        "] * secondWeight);";
    }
    toCompile +=
      "weight += " +
      this._ratioWeight +
      ";\
            sourceOffset = Math.floor(weight) * " +
      this._channels +
      ";\
        }";
    for (var channel = 0; channel < this._channels; ++channel) {
      toCompile += "this.lastOutput[" + channel + "] = buffer[sourceOffset++];";
    }
    toCompile +=
      "this.lastWeight = weight % 1;\
    }\
    return outputOffset;";
    this._resampler = Function("bufferLength", toCompile);
  }

  get outputBuffer(): Float32Array | Float64Array {
    return this._outputBuffer;
  }

  get resampler(): Function {
    return this._resampler;
  }

  private _fromSampleRate: number;
  private _toSampleRate: number;
  private _channels: number;
  private _inputBuffer: Float32Array | Float64Array;
  private _outputBuffer: Float32Array | Float64Array;
  private _lastOutput: Float32Array | Float64Array;
  private _resampler: Function;
  private _ratioWeight: number;
  private _lastWeight: number;
  private tailExists: boolean;
}
