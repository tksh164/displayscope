import { desktopCapturer } from "electron";

export function getScreenMetadataList(thumbnailWidth: number, thumbnailHeight: number): Promise<{ id: string, name: string, thumbnailDataUrl: string, display: { size: Electron.Size, scaleFactor: number } }[]> {

  // Retrieve display metadata.
  const { screen } = require("electron").remote;
  const displays = screen.getAllDisplays();
  const displayMetadata: { [key:string]: { size: Electron.Size, scaleFactor: number } } = {};
  for (const display of displays) {
    displayMetadata[display.id.toString()] = {
      size: display.size,
      scaleFactor: display.scaleFactor
    };
  }

  return desktopCapturer
    .getSources({
      types: ["screen"],
      thumbnailSize: { width: thumbnailWidth, height: thumbnailHeight },
      fetchWindowIcons: false
    })
    .then(async sources => {
      const screenMetadataArray: { id: string, name: string, thumbnailDataUrl: string, display: { size: Electron.Size, scaleFactor: number } }[] = [];
      for (const source of sources) {
        screenMetadataArray.push({
          id: source.id,
          name: source.name,
          thumbnailDataUrl: source.thumbnail.toDataURL(),
          display: {
            size: displayMetadata[source.display_id].size,
            scaleFactor: displayMetadata[source.display_id].scaleFactor
          }
        });
      }
      return screenMetadataArray;
    });
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
