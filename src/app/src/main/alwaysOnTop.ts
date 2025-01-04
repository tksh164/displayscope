import { app, BrowserWindow } from "electron";
import { IPC_CHANNELS } from "./constants";

export function getAlwaysOnTopState(window: BrowserWindow): boolean {
  return window.isAlwaysOnTop();
}

export function setAlwaysOnTopState(window: BrowserWindow, newAlwaysOnTopState: boolean): void {
  window.setAlwaysOnTop(newAlwaysOnTopState);
}

export function setAlwaysOnTopMenuItemCheck(menuItemId: string, isChecked: boolean): void {
  const menuItem = app.applicationMenu?.getMenuItemById(menuItemId);
  if (menuItem) menuItem.checked = isChecked;
}

export function notifyAlwaysOnTopStateChanged(window: BrowserWindow, newAlwaysOnTopState: boolean): void {
  window.webContents.send(IPC_CHANNELS.ALWAYS_ON_TOP_STATE_CHANGED, newAlwaysOnTopState);
}
