import { BrowserWindow } from "electron";

export function setAlwaysOnTop(window: BrowserWindow, newAlwaysOnTopSetting: boolean): void {
  window.setAlwaysOnTop(newAlwaysOnTopSetting);
}
