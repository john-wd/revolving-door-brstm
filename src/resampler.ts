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
          this._resampler = this.linerarInterpolationFn;
          this._lastWeight = 1;
        } else {
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
  multiTapFn(bufferLength: number): number {
    var outputOffset = 0;
    if (bufferLength > 0) {
      var buffer = this._inputBuffer;
      var weight = 0;
      var outputChannels: number[] = [];
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
        } else {
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
          } else {
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
        } else {
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
  linerarInterpolationFn(bufferLength: number) {
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
      for (
        bufferLength -= this._channels,
          sourceOffset = Math.floor(weight) * this._channels;
        sourceOffset < bufferLength;

      ) {
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
  private _tailExists: boolean;
}
