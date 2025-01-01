import { BrowserWindow, screen } from "electron";
import { ScreenSpec } from "./types/screenSpec.d";
import { AppShortcutKeysSettingKey } from "./types/appSetting.d";
import { registerGlobalShortcutKey, unregisterGlobalShortcutKey } from "./globalShortcutKey";
import { setMouseCursorPosition } from "./mouseCursorPosition";
import { getAppSetting } from "./appSetting";
import { IPC_CHANNELS, APP_SETTING_KEY_PREFIX_NAVIGATE_TO_INTERACTIVE_SCREEN_SHORTCUT_KEY } from "./constants";

//
// Mouse cursor return to the app window shortcut key
//

// Retain to the shortcut key for the mouse cursor back to the app window.
let shortcutKeyToReturnMouseCursorToAppWindow: string | undefined = undefined;

// Register a shortcut key to move the mouse cursor to on the app window from the screen.
export async function registerShortcutKeyToReturnMouseCursorToAppWindow(shortcutKey: string, window: BrowserWindow): Promise<void> {
  shortcutKeyToReturnMouseCursorToAppWindow = shortcutKey;  // Retain the shortcut key for unregister.
  const messageWhenFailed = `Couldn't register a shortcut key "${shortcutKey}" for move mouse cursor back to the app window.`;
  registerGlobalShortcutKey(shortcutKey, () => { moveMouseCursorToAppWindow(window); }, window, messageWhenFailed);
}

// Unregister a shortcut key to move the mouse cursor to on the app window from the screen.
export async function unregisterShortcutKeyToReturnMouseCursorToAppWindow(): Promise<void> {
  unregisterGlobalShortcutKey(shortcutKeyToReturnMouseCursorToAppWindow);
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

// Retain to the shortcut keys for navigate to interactive screen directly.
const navigateToInteractiveScreenShortcutKeys: string[] = [];

export async function registerNavigateToInteractiveScreenShortcutKeys(screenSpecs: ScreenSpec[], window: BrowserWindow): Promise<void> {
  const appSettingShortcutKeys = (await getAppSetting(window)).shortcutKeys;
  screenSpecs.map((screenSpec) => {
    // Register a shortcut key and a callback for navigate to interactive screen directly.
    const shortcutKeySettingKey = APP_SETTING_KEY_PREFIX_NAVIGATE_TO_INTERACTIVE_SCREEN_SHORTCUT_KEY + (screenSpec.sequenceNumber + 1).toString();
    const shortcutKey = appSettingShortcutKeys[shortcutKeySettingKey as AppShortcutKeysSettingKey];
    const messageWhenFailed = `Couldn't register a shortcut key "${shortcutKey}" for navigate to specific interactive screen directly.`;
    registerGlobalShortcutKey(shortcutKey, () => {
      // Send the screen spec to be navigated to the renderer process.
      window.webContents.send(IPC_CHANNELS.NAVIGATE_TO_INTERACTIVE_SCREEN_SHORTCUT_KEY_PRESSED, screenSpec);
      //console.log("Send the screen spec to be navigated to the renderer process.");
    }, window, messageWhenFailed);

    // Retain the shortcut key for unregister.
    navigateToInteractiveScreenShortcutKeys.push(shortcutKey);

    //console.log('Registered a shortcut key for navigate to interactive screen:', shortcutKey);
  });
}

export async function unregisterNavigateToInteractiveScreenShortcutKeys(): Promise<void> {
  navigateToInteractiveScreenShortcutKeys.map((shortcutKey) => {
    unregisterGlobalShortcutKey(shortcutKey);
    //console.log('Unregistered a shortcut key for navigate to interactive screen:', shortcutKey);
  });

  // Clear the retained shortcut keys.
  navigateToInteractiveScreenShortcutKeys.length = 0;
}