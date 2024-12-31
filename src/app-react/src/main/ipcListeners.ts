import { BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from "electron";
import { IPC_CHANNELS, MENU_ITEM_IDS } from "./constants";
import { getAllScreenSpecs } from "./screenSpec";
import { ScreenSpec } from "./types/screenSpec";
import { setMouseCursorPosition } from "./mouseCursorPosition";
import { getCurrentAlwaysOnTopSetting, setAlwaysOnTop, setAlwaysOnTopMenuItemCheck } from "./alwaysOnTop";
import { getAppSettings } from "./appSettings";
import { registerNavigateToInteractiveScreenShortcutKeys, unregisterNavigateToInteractiveScreenShortcutKeys } from "./appGlobalShortcutKeys";

export function initializeIpcListeners(mainWindow: BrowserWindow): void {
  //
  // Screen spec
  //

  ipcMain.handle(IPC_CHANNELS.GET_ALL_SCREEN_SPECS, async (event: IpcMainInvokeEvent, thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenSpec[]> => {
    return getAllScreenSpecs(thumbnailWidth, thumbnailHeight);
  });

  //
  // Mouse cursor position
  //

  ipcMain.on(IPC_CHANNELS.SET_MOUSE_CURSOR_POSITION, async (event: IpcMainEvent, posX: number, posY: number) => {
    setMouseCursorPosition(posX, posY);
  });

  //
  // Always on top setting
  //

  ipcMain.handle(IPC_CHANNELS.GET_ALWAYS_ON_TOP_SETTING, async (event: IpcMainInvokeEvent): Promise<boolean> => {
    return getCurrentAlwaysOnTopSetting(mainWindow);
  });

  ipcMain.on(IPC_CHANNELS.SET_ALWAYS_ON_TOP_SETTING, async (event: IpcMainEvent, shouldAlwaysOnTop: boolean): Promise<void> => {
    setAlwaysOnTop(mainWindow, shouldAlwaysOnTop);
    setAlwaysOnTopMenuItemCheck(MENU_ITEM_IDS.WINDOW_ALWAYS_ON_TOP, shouldAlwaysOnTop);
  });

  //
  // Mouse cursor return to the app window shortcut key
  //

  ipcMain.handle(IPC_CHANNELS.GET_MOUSE_CURSOR_RETURN_SHORTCUT_KEY, async (event: IpcMainInvokeEvent): Promise<string> => {
    return (await getAppSettings(mainWindow)).mouseCursorBackToAppWindowShortcutKey.replaceAll(" ", "");
  });

  //
  // Navigate to interactive screen view shortcut keys
  //

  ipcMain.on(IPC_CHANNELS.REGISTER_NAVIGATE_TO_INTERACTIVE_SCREEN_SHORTCUT_KEYS, async (event: IpcMainEvent, screenSpecs: ScreenSpec[]) => {
    registerNavigateToInteractiveScreenShortcutKeys(screenSpecs, mainWindow);
  });

  ipcMain.on(IPC_CHANNELS.UNREGISTER_NAVIGATE_TO_INTERACTIVE_SCREEN_SHORTCUT_KEYS, async (event: IpcMainEvent) => {
    unregisterNavigateToInteractiveScreenShortcutKeys();
  });
}
