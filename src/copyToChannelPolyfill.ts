/**
 * This function serves as an override to AudioBuffer.copyToChannel in order to
 * make the library more compatible between browsers.
 */
export default function (
  buffer: Float32Array | Float64Array,
  channelIndex: number
) {
  let outputBuffer = this.getChannelData(channelIndex);
  for (let i = 0; i < buffer.length; i++) {
    outputBuffer[i] = buffer[i];
  }
}
