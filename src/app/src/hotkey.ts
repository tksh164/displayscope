import { globalShortcut, BrowserWindow, screen } from "electron";
import { setMouseCursorPosition } from "@/mouse-cursor-setter";

export const HOTKEY_MOVE_MOUSE_CURSOR_TO_APP_WINDOW = "Shift+Escape";

function moveMouseCursorToAppWindowArea(): void {
  const winScreenRect = screen.dipToScreenRect(win, win!.getBounds());
  const posX = Math.floor(winScreenRect.width / 2) + winScreenRect.x;
  const posY = Math.floor(winScreenRect.height / 2) + winScreenRect.y;
  setMouseCursorPosition(posX, posY);
}

let win: BrowserWindow;
export function registerHotkeys(browserWindow: BrowserWindow): boolean {
  win = browserWindow;

  // Register a hotkey to move the mouse cursor to on app window from the screen.
  return globalShortcut.register(HOTKEY_MOVE_MOUSE_CURSOR_TO_APP_WINDOW, moveMouseCursorToAppWindowArea);
}

export function unregisterHotkeys(): void {
  // Unregister a hotkey to move the mouse cursor to on app window from the screen.
  globalShortcut.unregister(HOTKEY_MOVE_MOUSE_CURSOR_TO_APP_WINDOW);
}