import { screen, desktopCapturer } from "electron";
import { ScreenSpec, DisplaySpecDictionary } from "./types/screenSpec";

export async function getAllScreenSpecs(thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenSpec[]> {
  return getDisplaySpecDictionary()
    .then(async (displaySpecDictionary) => {
      return getScreenSpecs(displaySpecDictionary, thumbnailWidth, thumbnailHeight);
    });
}

async function getDisplaySpecDictionary(): Promise<DisplaySpecDictionary> {
  const primaryDisplayId = screen.getPrimaryDisplay().id;
  const allDisplays = screen.getAllDisplays();

  const displaySpecDictionary: DisplaySpecDictionary = {};
  for (const display of allDisplays) {
    displaySpecDictionary[display.id.toString()] = {
      bounds: display.bounds,
      scaleFactor: display.scaleFactor,
      isPrimary: display.id === primaryDisplayId,
    };
  }
  return displaySpecDictionary;
}

async function getScreenSpecs(displaySpecDictionary: DisplaySpecDictionary, thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenSpec[]> {
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
            scaledScreenOriginPoint: screen.dipToScreenPoint({
              x: displaySpec.bounds.x,
              y: displaySpec.bounds.y
            }),
          }
        });
      }
      return screenSpecs;
    });
}
