import { app, BrowserWindow } from "electron";
import { IPC_CHANNELS } from "../constants";

export function getCurrentAlwaysOnTopSetting(window: BrowserWindow): boolean {
  return window.isAlwaysOnTop();
}

export function setAlwaysOnTop(window: BrowserWindow, shouldAlwaysOnTop: boolean): void {
  window.setAlwaysOnTop(shouldAlwaysOnTop);
}

export function setAlwaysOnTopMenuItemCheck(menuItemId: string, isChecked: boolean): void {
  const menuItem = app.applicationMenu?.getMenuItemById(menuItemId);
  if (menuItem) menuItem.checked = isChecked;
}

export function notifyAlwaysOnTopSettingChanged(window: BrowserWindow, newAlwaysOnTopSetting: boolean): void {
  window.webContents.send(IPC_CHANNELS.ALWAYS_ON_TOP_SETTING_CHANGED, newAlwaysOnTopSetting);
}
