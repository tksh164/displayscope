import { globalShortcut, BrowserWindow, screen } from "electron";
import { setMouseCursorPosition } from "@/main/mouse-cursor-setter";

export const HOTKEY_MOVE_MOUSE_CURSOR_TO_APP_WINDOW = "Shift+Escape";

// Retain the app window reference.
let appWindow: BrowserWindow;

export function registerMoveMouseCursorToAppWindowHotkey(win: BrowserWindow): boolean {
  appWindow = win;
  // Register a hotkey to move the mouse cursor to on app window from the screen.
  return globalShortcut.register(HOTKEY_MOVE_MOUSE_CURSOR_TO_APP_WINDOW, moveMouseCursorToAppWindowArea);
}

export function unregisterMoveMouseCursorToAppWindowHotkey(): void {
  // Unregister a hotkey to move the mouse cursor to on app window from the screen.
  globalShortcut.unregister(HOTKEY_MOVE_MOUSE_CURSOR_TO_APP_WINDOW);
}

function moveMouseCursorToAppWindowArea(): void {
  const [posX, posY] = calcCenterPositionInWindow(appWindow);
  setMouseCursorPosition(posX, posY);
}

function calcCenterPositionInWindow(win: BrowserWindow): [number, number] {
  const winScreenRect = screen.dipToScreenRect(win, win!.getBounds());
  return [
    Math.floor(winScreenRect.width / 2) + winScreenRect.x,
    Math.floor(winScreenRect.height / 2) + winScreenRect.y
  ];
}
