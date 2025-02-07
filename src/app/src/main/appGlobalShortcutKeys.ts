import { BrowserWindow, screen } from "electron";
import { ScreenSpec } from "./types/screenSpec.d";
import { ShortcutKeysInAppSettingsItemName } from "./types/appSettings.d";
import { registerGlobalShortcutKey, unregisterGlobalShortcutKey } from "./globalShortcutKey";
import { setMouseCursorPosition } from "./mouseCursorPosition";
import { getAppSettings } from "./appSettings";
import { IPC_CHANNELS, APP_SETTINGS_ITEM_NAME_SHORTCUT_KEY_RETURN_MOUSE_CURSOR_TO_APP_WINDOW, APP_SETTINGS_ITEM_NAME_PREFIX_SHORTCUT_KEY_NAVIGATE_TO_INTERACTIVE_SCREEN } from "./constants";

type RegisteredShortcutKeyStore = {
  returnMouseCursorToAppWindow: string[],
  navigateToInteractiveScreen: string[],
};

// Retaining the shortcut keys for unregistering.
const registeredShortcutKeyStore: RegisteredShortcutKeyStore = {
  returnMouseCursorToAppWindow: [],
  navigateToInteractiveScreen: [],
};

//
// Mouse cursor return to the app window shortcut key
//

// Register a shortcut key to move the mouse cursor to on the app window from the screen.
export async function registerShortcutKeyToReturnMouseCursorToAppWindow(window: BrowserWindow): Promise<void> {
  const shortcutKeysSetting = (await getAppSettings(window)).shortcutKeys;
  const shortcutKey = shortcutKeysSetting[APP_SETTINGS_ITEM_NAME_SHORTCUT_KEY_RETURN_MOUSE_CURSOR_TO_APP_WINDOW as ShortcutKeysInAppSettingsItemName];

  // Retaining the shortcut key for unregistering.
  registeredShortcutKeyStore.returnMouseCursorToAppWindow.push(shortcutKey);

  const messageWhenFailed = `Couldn't register a shortcut key "${shortcutKey}" for move mouse cursor back to the app window.`;
  registerGlobalShortcutKey(shortcutKey, () => { moveMouseCursorToAppWindow(window); }, window, messageWhenFailed);
}

// Unregister a shortcut key to move the mouse cursor to on the app window from the screen.
export async function unregisterShortcutKeyToReturnMouseCursorToAppWindow(): Promise<void> {
  unregisterShortcutKeys(registeredShortcutKeyStore.returnMouseCursorToAppWindow);
}

function moveMouseCursorToAppWindow(window: BrowserWindow): void {
  const [posX, posY] = calcCenterPositionOfWindow(window);
  setMouseCursorPosition(posX, posY);
  window.focus();
}

function calcCenterPositionOfWindow(window: BrowserWindow): [number, number] {
  const windowScreenRect = screen.dipToScreenRect(window, window.getBounds());
  return [
    Math.floor(windowScreenRect.width / 2) + windowScreenRect.x,
    Math.floor(windowScreenRect.height / 2) + windowScreenRect.y
  ];
}

//
// Navigate to interactive screen view shortcut keys
//

export async function registerNavigateToInteractiveScreenShortcutKeys(screenSpecs: ScreenSpec[], window: BrowserWindow): Promise<void> {
  const shortcutKeysSetting = (await getAppSettings(window)).shortcutKeys;
  screenSpecs.map((screenSpec) => {
    // Register a shortcut key and a callback for navigate to interactive screen directly.
    const settingItemName = APP_SETTINGS_ITEM_NAME_PREFIX_SHORTCUT_KEY_NAVIGATE_TO_INTERACTIVE_SCREEN + (screenSpec.sequenceNumber + 1).toString();
    const shortcutKey = shortcutKeysSetting[settingItemName as ShortcutKeysInAppSettingsItemName];
    const messageWhenFailed = `Couldn't register a shortcut key "${shortcutKey}" for navigate to specific interactive screen directly.`;
    registerGlobalShortcutKey(shortcutKey, () => {
      // Send the screen spec to be navigated to the renderer process.
      window.webContents.send(IPC_CHANNELS.NAVIGATE_TO_INTERACTIVE_SCREEN_SHORTCUT_KEY_PRESSED, screenSpec);
      window.focus();
      //console.log("Send the screen spec to be navigated to the renderer process.");
    }, window, messageWhenFailed);

    // Retaining the shortcut key for unregistering.
    registeredShortcutKeyStore.navigateToInteractiveScreen.push(shortcutKey);

    //console.log('Registered a shortcut key for navigate to interactive screen:', shortcutKey);
  });
}

export async function unregisterNavigateToInteractiveScreenShortcutKeys(): Promise<void> {
  unregisterShortcutKeys(registeredShortcutKeyStore.navigateToInteractiveScreen);
}

function unregisterShortcutKeys(shortcutKeyStore: string[]): void {
  shortcutKeyStore.map((shortcutKey) => {
    unregisterGlobalShortcutKey(shortcutKey);
  });

  // Clear the retained shortcut keys.
  shortcutKeyStore.length = 0;
}
