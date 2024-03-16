export const sleep = (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout));
export const powersOf2 = [256, 512, 1024, 2048, 4096, 8192, 16384, 32768];

export function awaitMessage(content: string): Promise<void> {
  return new Promise((resolve) => {
    let handler = (evt: any) => {
      if (evt.data === content && evt.isTrusted) {
        window.removeEventListener("message", handler);
        resolve();
      }
    };

    window.addEventListener("message", handler);
  });
}
