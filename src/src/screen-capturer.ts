import { desktopCapturer } from "electron";

export function getScreenMetadataList(
  thumbnailWidth: number,
  thumbnailHeight: number
) {
  const screenMetadataList: object[] = [];
  desktopCapturer
    .getSources({
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

export function getScreenMediaStream(sourceId: string) {
  return (navigator.mediaDevices as any)
    .getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: sourceId
        }
      }
    })
    .then((stream: MediaStream) => {
      return stream;
    })
    .catch((err: DOMException) => {
      console.log(err);
    });
}
