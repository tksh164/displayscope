import { desktopCapturer } from "electron";

export async function getScreenMetadataList(thumbnailWidth: number, thumbnailHeight: number): Promise<{ id: string; name: string; thumbnailDataUrl: string; display: { size: Electron.Size; scaleFactor: number; isPrimary: boolean; }; }[]> {

  // Retrieve display metadata.
  const { screen } = require("electron").remote;
  const primaryDisplayId = screen.getPrimaryDisplay().id;
  const displays = screen.getAllDisplays();
  const displayMetadata: { [key: string]: { size: Electron.Size; scaleFactor: number; isPrimary: boolean; }; } = {};
  for (const display of displays) {
    displayMetadata[display.id.toString()] = {
      size: display.size,
      scaleFactor: display.scaleFactor,
      isPrimary: display.id === primaryDisplayId
    };
  }

  // Retrieve screen metadata.
  const screenMetadataArray: { id: string; name: string; thumbnailDataUrl: string; display: { size: Electron.Size; scaleFactor: number; isPrimary: boolean; }; }[] = [];
  const sources = await desktopCapturer.getSources({
    types: ["screen"],
    thumbnailSize: { width: thumbnailWidth, height: thumbnailHeight },
    fetchWindowIcons: false
  });
  for (const source of sources) {
    screenMetadataArray.push({
      id: source.id,
      name: source.name,
      thumbnailDataUrl: source.thumbnail.toDataURL(),
      display: {
        size: displayMetadata[source.display_id].size,
        scaleFactor: displayMetadata[source.display_id].scaleFactor,
        isPrimary: displayMetadata[source.display_id].isPrimary
      }
    });
  }
  return screenMetadataArray;
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
