
import { screen, desktopCapturer } from "electron";
import { DisplayMetadataValue, ScreenPoint, ScreenMetadata } from "@/@types/pipapp/screen-capturer";

export async function getAllScreenMetadata(thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenMetadata[]> {
  return getDisplayMetadataDictionary()
    .then(async (displayMetadataDictionary) => {
      return getScreenMetadata(displayMetadataDictionary, thumbnailWidth, thumbnailHeight);
    });
}
  
async function getDisplayMetadataDictionary(): Promise<{ [key: string]: DisplayMetadataValue; }> {
  const primaryDisplayId = screen.getPrimaryDisplay().id;
  const allDisplays = screen.getAllDisplays();
  const displayMetadata: { [key: string]: DisplayMetadataValue; } = {};
  for (const display of allDisplays) {
    displayMetadata[display.id.toString()] = {
      bounds: display.bounds,
      scaleFactor: display.scaleFactor,
      isPrimary: display.id === primaryDisplayId
    };
  }
  return displayMetadata;
}
  
async function getScreenCenterPoint(displayBounds: Electron.Rectangle, scaleFactor: number): Promise<ScreenPoint> {
  const scaledScreenOriginPoint = screen.dipToScreenPoint({ x: displayBounds.x, y: displayBounds.y });
  const scaledScreenWidth = displayBounds.width * scaleFactor;
  const scaledScreenHeight = displayBounds.height * scaleFactor;
  return {
    x: Math.floor((scaledScreenWidth / 2) + scaledScreenOriginPoint.x),
    y: Math.floor((scaledScreenHeight / 2) + scaledScreenOriginPoint.y)
  }
}

async function getScreenMetadata(displayMetadataDictionary: { [key: string]: DisplayMetadataValue; }, thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenMetadata[]> {
  return desktopCapturer
    .getSources({
      types: ["screen"],
      thumbnailSize: {
        width: thumbnailWidth,
        height: thumbnailHeight
      },
      fetchWindowIcons: false
    })
    .then(async (sources) => {
      const screenMetadataArray: ScreenMetadata[] = [];
      for (const source of sources) {
        const dm = displayMetadataDictionary[source.display_id];
        screenMetadataArray.push({
          id: source.id,
          name: source.name,
          thumbnailDataUri: source.thumbnail.toDataURL(),
          centerPoint: await getScreenCenterPoint(dm.bounds, dm.scaleFactor),
          display: {
            bounds: dm.bounds,
            scaleFactor: dm.scaleFactor,
            isPrimary: dm.isPrimary
          }
        });
      }
      return screenMetadataArray;
    });
}
