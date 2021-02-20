export async function getScreenMediaStream(sourceId: string): Promise<MediaStream | void> {
  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: ({
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: sourceId
      }
    } as unknown as undefined)
  });
}
