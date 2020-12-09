import { desktopCapturer, remote } from "electron";
import { DisplayMetadataValue, ScreenMetadata } from "@/@types/pipapp/screen-capturer";

export async function getScreenMetadataList(thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenMetadata[]> {

  // Retrieve display metadata.
  const primaryDisplayId = remote.screen.getPrimaryDisplay().id;
  const allDisplays = remote.screen.getAllDisplays();
  const displayMetadata: { [key: string]: DisplayMetadataValue; } = {};
  for (const display of allDisplays) {
    displayMetadata[display.id.toString()] = {
      bounds: display.bounds,
      scaleFactor: display.scaleFactor,
      isPrimary: display.id === primaryDisplayId
    };
  }

  // Retrieve screen metadata.
  const screenMetadataArray: ScreenMetadata[] = [];
  const sources = await desktopCapturer.getSources({
    types: ["screen"],
    thumbnailSize: { width: thumbnailWidth, height: thumbnailHeight },
    fetchWindowIcons: false
  });
  for (const source of sources) {
    screenMetadataArray.push({
      id: source.id,
      name: source.name,
      thumbnailDataUri: source.thumbnail.toDataURL(),
      display: {
        bounds: displayMetadata[source.display_id].bounds,
        scaleFactor: displayMetadata[source.display_id].scaleFactor,
        isPrimary: displayMetadata[source.display_id].isPrimary
      }
    });
  }
  return screenMetadataArray;
}

export async function getScreenMediaStream(sourceId: string): Promise<void | MediaStream> {
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
