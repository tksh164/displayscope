import { screen, desktopCapturer } from "electron";
import { DisplaySpec, DisplayRectangle, ScreenPoint, ScreenSpec } from "@/types/app";

export async function getAllScreenSpec(thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenSpec[]> {
  return getDisplaySpecDictionary()
    .then(async (displaySpecDictionary) => {
      return getScreenSpecs(displaySpecDictionary, thumbnailWidth, thumbnailHeight);
    });
}
  
async function getDisplaySpecDictionary(): Promise<{ [key: string]: DisplaySpec; }> {
  const primaryDisplayId = screen.getPrimaryDisplay().id;
  const allDisplays = screen.getAllDisplays();
  const displaySpec: { [key: string]: DisplaySpec; } = {};
  for (const display of allDisplays) {
    displaySpec[display.id.toString()] = {
      bounds: display.bounds,
      scaleFactor: display.scaleFactor,
      isPrimary: display.id === primaryDisplayId
    };
  }
  return displaySpec;
}
  
async function getScreenCenterPoint(displayBounds: DisplayRectangle, scaleFactor: number): Promise<ScreenPoint> {
  const scaledScreenOriginPoint = screen.dipToScreenPoint({ x: displayBounds.x, y: displayBounds.y });
  const scaledScreenWidth = displayBounds.width * scaleFactor;
  const scaledScreenHeight = displayBounds.height * scaleFactor;
  return {
    x: Math.floor((scaledScreenWidth / 2) + scaledScreenOriginPoint.x),
    y: Math.floor((scaledScreenHeight / 2) + scaledScreenOriginPoint.y)
  }
}

async function getScreenSpecs(displaySpecDictionary: { [key: string]: DisplaySpec; }, thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenSpec[]> {
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
      const screenSpecs: ScreenSpec[] = [];
      for (const source of sources) {
        const displaySpec = displaySpecDictionary[source.display_id];
        screenSpecs.push({
          id: source.id,
          name: source.name,
          thumbnailDataUri: source.thumbnail.toDataURL(),
          display: {
            bounds: displaySpec.bounds,
            scaleFactor: displaySpec.scaleFactor,
            isPrimary: displaySpec.isPrimary,
            scaledScreenOriginPoint: screen.dipToScreenPoint({ x: displaySpec.bounds.x, y: displaySpec.bounds.y }),
          }
        });
      }
      return screenSpecs;
    });
}
