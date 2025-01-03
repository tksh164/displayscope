import { screen, desktopCapturer } from "electron";
import { DisplaySpec, ScreenSpec } from "./types/screenSpec.d";

export async function getAllScreenSpecs(thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenSpec[]> {
  return getScreenSpecs(thumbnailWidth, thumbnailHeight);
}

async function getDisplaySpecs(): Promise<DisplaySpec[]> {
  const primaryDisplayId = screen.getPrimaryDisplay().id;
  const allDisplays = screen.getAllDisplays();

  // Enumerate all display specs.
  const displaySpecs: DisplaySpec[] = [];
  for (const display of allDisplays) {
    displaySpecs.push({
      id: display.id.toString(),
      bounds: display.bounds,
      scaleFactor: display.scaleFactor,
      isPrimary: display.id === primaryDisplayId,
      label: display.label,
    });
  }

  // Sort the display specs.
  const result = displaySpecs.sort((a, b) => {
      // The primary display should always be first.
      if (a.isPrimary) {
        return -1;
      }
      else if (b.isPrimary) {
        return 1;
      }
      return a.label.localeCompare(b.label);
  });

  return result;
}

async function getScreenSpecs(thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenSpec[]> {
  return await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: {
        width: thumbnailWidth,
        height: thumbnailHeight
      },
      fetchWindowIcons: false
    })
    .then(async (sources) => {
      // Create a dictionary for look up source by display ID.
      const sourceDictionary: { [key: string]: Electron.DesktopCapturerSource } = {};
      sources.map((source) => {
        sourceDictionary[source.display_id] = source;
      });

      // Create a screen spec array.
      const screenSpecs: ScreenSpec[] = [];
      const displaySpecs = await getDisplaySpecs();
      displaySpecs.map((displaySpec, i) => {
        // Find the source that matches the display ID.
        const source = sourceDictionary[displaySpec.id];
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
