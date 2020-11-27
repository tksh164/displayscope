import { desktopCapturer } from "electron";

export function getScreenMetadataList(thumbnailWidth: number, thumbnailHeight: number): object[] {
  const screenMetadataList: object[] = [];
  desktopCapturer.getSources({
    types: ["screen"],
    thumbnailSize: { width: thumbnailWidth, height: thumbnailHeight },
    fetchWindowIcons: false
  })
  .then(async sources => {
    for (const source of sources) {
      screenMetadataList.push({
        id: source.id,
        name: source.name,
        thumbnailDataUrl: source.thumbnail.toDataURL()
      });
    }
  });
  return screenMetadataList;
}

export function getScreenMediaStream(sourceId: string): Promise<void | MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: sourceId
      }
    } as unknown as undefined
  })
  .then((stream: MediaStream) => {
    return stream;
  })
  .catch((err: DOMException) => {
    //console.log(err);
  });
}
