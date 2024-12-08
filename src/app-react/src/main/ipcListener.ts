import { BrowserWindow, ipcMain } from "electron";
import { getAllScreenSpecs } from "./screenSpec";
import { ScreenSpec } from "./types/screenSpec";
import { setAlwaysOnTop } from "./alwaysOnTop";

export function initializeIpcListeners(mainWindow: BrowserWindow): void {
  ipcMain.handle("get-all-screen-specs", async (event, thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenSpec[]> => {
    return getAllScreenSpecs(thumbnailWidth, thumbnailHeight);
  });

  ipcMain.on("set-always-on-top-setting", async (event, newAlwaysOnTopSetting: boolean): Promise<void> => {
    setAlwaysOnTop(mainWindow, newAlwaysOnTopSetting);
  });
}
