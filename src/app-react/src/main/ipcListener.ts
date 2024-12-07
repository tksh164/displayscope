import { BrowserWindow, ipcMain } from "electron";
import { setAlwaysOnTop } from "./alwaysOnTop";

export function initializeIpcListeners(mainWindow: BrowserWindow): void {
  ipcMain.on("set-always-on-top-setting", async (event, newAlwaysOnTopSetting: boolean): Promise<void> => {
    setAlwaysOnTop(mainWindow, newAlwaysOnTopSetting);
  });
}
