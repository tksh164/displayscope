import { BrowserWindow, ipcMain } from "electron";
import { IPC_CHANNELS, MENU_ITEM_IDS } from "../constants";
import { getAllScreenSpecs } from "./screenSpec";
import { ScreenSpec } from "./types/screenSpec";
import { setMouseCursorPosition } from "./mouseCursorPosition";
import { getCurrentAlwaysOnTopSetting, setAlwaysOnTop, setAlwaysOnTopMenuItemCheck } from "./alwaysOnTop";

export function initializeIpcListeners(mainWindow: BrowserWindow): void {
  ipcMain.handle(IPC_CHANNELS.GET_ALL_SCREEN_SPECS, async (event, thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenSpec[]> => {
    return getAllScreenSpecs(thumbnailWidth, thumbnailHeight);
  });

  ipcMain.on(IPC_CHANNELS.SET_MOUSE_CURSOR_POSITION, async (event, posX: number, posY: number) => {
    setMouseCursorPosition(posX, posY);
  });

  ipcMain.handle(IPC_CHANNELS.GET_CURRENT_ALWAYS_ON_TOP_SETTING, async (event): Promise<boolean> => {
    return getCurrentAlwaysOnTopSetting(mainWindow);
  });

  ipcMain.on(IPC_CHANNELS.SET_ALWAYS_ON_TOP_SETTING, async (event, shouldAlwaysOnTop: boolean): Promise<void> => {
    setAlwaysOnTop(mainWindow, shouldAlwaysOnTop);
    setAlwaysOnTopMenuItemCheck(MENU_ITEM_IDS.WINDOW_ALWAYS_ON_TOP, shouldAlwaysOnTop);
  });
}
