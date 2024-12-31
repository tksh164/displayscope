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
      label: display.label,
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
      sources.map((source, i) => {
        // Find the display spec that matches the source.
        const displaySpec = displaySpecDictionary[source.display_id];
        screenSpecs.push({
          id: source.id,
          name: source.name,
          thumbnailDataUri: source.thumbnail.toDataURL(),
          scaledScreenOriginPoint: screen.dipToScreenPoint({
            x: displaySpec.bounds.x,
            y: displaySpec.bounds.y
          }),
          displaySpec: displaySpec,
          sequenceNumber: i,
        });
      });
      return screenSpecs;
    });
}
