import { globalShortcut, BrowserWindow, screen } from "electron";
import { setMouseCursorPosition } from "@/main/mouse-cursor-setter";

export const HOTKEY_RETURN_CURSOR_TO_APP_WINDOW = "Shift+Escape";

// Retain the app window reference.
let appWindow: BrowserWindow;

export function registerHotkeyReturnCursorToAppWindow(win: BrowserWindow): boolean {
  appWindow = win;
  // Register a hotkey to move the mouse cursor to on app window from the screen.
  return globalShortcut.register(HOTKEY_RETURN_CURSOR_TO_APP_WINDOW, moveMouseCursorToAppWindowArea);
}

export function unregisterHotkeyReturnCursorToAppWindow(): void {
  // Unregister a hotkey to move the mouse cursor to on app window from the screen.
  globalShortcut.unregister(HOTKEY_RETURN_CURSOR_TO_APP_WINDOW);
}

function moveMouseCursorToAppWindowArea(): void {
  const [posX, posY] = calcCenterPositionInWindow(appWindow);

  // NOTE: Setting the mouse cursor position two times as workaround, because
  // in specific case the mouse cursor is drift from the correct position.
  // The first time, the mouse courser come back to the same screen with the
  // app window, but the position is incorrect. The second time, the mouse
  // cursor move to the correct position in the screen.
  setMouseCursorPosition(posX, posY);
  setMouseCursorPosition(posX, posY);
}

function calcCenterPositionInWindow(win: BrowserWindow): [number, number] {
  const winScreenRect = screen.dipToScreenRect(win, win!.getBounds());
  return [
    Math.floor(winScreenRect.width / 2) + winScreenRect.x,
    Math.floor(winScreenRect.height / 2) + winScreenRect.y
  ];
}
