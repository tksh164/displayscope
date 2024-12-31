import { app, BrowserWindow } from "electron";

export function getCurrentAlwaysOnTopSetting(win: BrowserWindow): boolean {
  return win.isAlwaysOnTop();
}
  
export function setAlwaysOnTop(win: BrowserWindow, newAlwaysOnTopSetting: boolean): void {
  win.setAlwaysOnTop(newAlwaysOnTopSetting);
}

export function setAlwaysOnTopMenuItemCheck(menuItemId: string, newChecked: boolean): void {
  const menuItem = app.applicationMenu?.getMenuItemById(menuItemId);
  if (menuItem) menuItem.checked = newChecked;
}

export function notifyAlwaysOnTopSettingChanged(win: BrowserWindow, newAlwaysOnTopSetting: boolean): void {
  win.webContents.send("changed-always-on-top-setting", newAlwaysOnTopSetting);
}
