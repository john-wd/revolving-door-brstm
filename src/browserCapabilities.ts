export interface Capabilities {
  sampleRate: boolean;
  streaming: boolean;
  mediaSession: boolean;
}

export async function browserCapabilities(): Promise<Capabilities> {
  let capabilities: Capabilities = {
    sampleRate: false,
    streaming: false,
    mediaSession: false,
  };

  // Evaluate webaudio
  try {
    let ctx = new (window.AudioContext || AudioContext)({
      sampleRate: 8000,
    });

    capabilities.sampleRate = ctx.sampleRate === 8000;
    ctx.close();
  } catch (e) {
    console.log(
      "WebAudio sample rate capability detection failed. Assuming fallback."
    );
  }

  // Evaluate streaming
  try {
    let b = new Uint8Array(2 ** 16);

    let blob = new Blob([b], { type: "application/octet-stream" });
    let u = URL.createObjectURL(blob);
    let resp = await fetch(u);
    let body = await resp.body;
    const reader = body.getReader();

    while (true) {
      let d = await reader.read();
      if (d.done) {
        break;
      }
    }
    capabilities.streaming = true;
  } catch (e) {
    console.log("Streaming capability detection failed. Assuming fallback.");
  }

  // Evaluate mediaSession
  capabilities.mediaSession = "mediaSession" in navigator;

  // Check for Chrome 89
  // https://stackoverflow.com/a/4900484
  // https://github.com/rphsoftware/revolving-door/issues/10
  // To Rph: Remove this chunk of code if you manage to implement a proper fix before the heat death of the universe.
  var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  var chromeVersion = raw ? parseInt(raw[2], 10) : false;

  if (chromeVersion !== false && chromeVersion >= 89) {
    //Disable native resampling
    capabilities.sampleRate = false;
  }

  return capabilities;
}
