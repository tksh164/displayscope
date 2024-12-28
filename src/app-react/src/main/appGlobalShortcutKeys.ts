import { BrowserWindow, screen } from "electron";
import { registerGlobalShortcutKey, unregisterGlobalShortcutKey } from "./globalShortcutKey";
import { setMouseCursorPosition } from "./mouseCursorPosition";

// Retain the shortcut key for the mouse cursor back to the app window.
let mouseCursorBackToAppWindowShortcutKey: string;

// Register a shortcut key to move the mouse cursor to on the app window from the screen.
export async function registerMouseCursorBackToAppWindowShortcutKey(shortcutKey: string, window: BrowserWindow): Promise<void> {
  mouseCursorBackToAppWindowShortcutKey = shortcutKey;  // Retain the shortcut key for unregister.
  const messageWhenFailed = `Couldn't register a shortcut key \"${shortcutKey}\" for move mouse cursor back to the app window.`;
  registerGlobalShortcutKey(shortcutKey, () => { moveMouseCursorToAppWindow(window); }, window, messageWhenFailed);
}

// Unregister a shortcut key to move the mouse cursor to on the app window from the screen.
export async function unregisterMouseCursorBackToAppWindowShortcutKey(): Promise<void> {
  unregisterGlobalShortcutKey(mouseCursorBackToAppWindowShortcutKey);
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
