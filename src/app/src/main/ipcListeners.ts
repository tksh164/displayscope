import { BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from "electron";
import { IPC_CHANNELS, MENU_ITEM_IDS } from "./constants";
import { ScreenSpec } from "./types/screenSpec.d";
import { ShortcutKeysInAppSettingsItemName } from "./types/appSettings.d";
import { getAllScreenSpecs } from "./screenSpec";
import { setMouseCursorPosition } from "./mouseCursorPosition";
import { getAlwaysOnTopState, setAlwaysOnTopState, setAlwaysOnTopMenuItemCheck } from "./alwaysOnTop";
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
  // Always on top state
  //

  ipcMain.handle(IPC_CHANNELS.GET_ALWAYS_ON_TOP_STATE, async (event: IpcMainInvokeEvent): Promise<boolean> => {
    return getAlwaysOnTopState(mainWindow);
  });

  ipcMain.on(IPC_CHANNELS.SET_ALWAYS_ON_TOP_STATE, async (event: IpcMainEvent, newAlwaysOnTopState: boolean): Promise<void> => {
    setAlwaysOnTopState(mainWindow, newAlwaysOnTopState);
    setAlwaysOnTopMenuItemCheck(MENU_ITEM_IDS.WINDOW_ALWAYS_ON_TOP, newAlwaysOnTopState);
  });

  //
  // Get shortcut key setting from the app settings
  //

  ipcMain.handle(IPC_CHANNELS.GET_SHORTCUT_KEY_SETTING, async (event: IpcMainInvokeEvent, settingItemName: string): Promise<string> => {
    const shortcutKeysSetting = (await getAppSettings(mainWindow)).shortcutKeys;
    const shortcutKey = shortcutKeysSetting[settingItemName as ShortcutKeysInAppSettingsItemName];
    return shortcutKey.replaceAll(" ", "");
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
