import { globalShortcut, BrowserWindow, screen, dialog } from "electron";
import { setMouseCursorPosition } from "@/main/mouse-cursor-setter";
import { getAppSettings } from "@/main/app-settings";

// Retain the app window ID.
let appWindowId: number;

export async function registerHotkeyReturnCursorToAppWindow(windowId: number): Promise<void> {
  appWindowId = windowId;
  const shortcutKey = (await getAppSettings()).MouseCursorReturnShortcutKey;
  try {
    // Register a hotkey to move the mouse cursor to on app window from the screen.
    if (!globalShortcut.register(shortcutKey, moveMouseCursorToAppWindowArea)) {
      const err = new Error();
      err.name = "GlobalShortcutKeyRegistrationError";
      err.message = `Couldn't register the global shortcut key \"${shortcutKey}\" that for move mouse cursor back to the app window. ` + 
        `\"${shortcutKey}\" is already registered by another application.`
      throw err;
    }
  } catch (e) {
    if (e.name === "GlobalShortcutKeyRegistrationError") {
      const win = BrowserWindow.fromId(appWindowId);
      await showGlobalShortcutErrorMessageBox(win!, "Global shortcut key registration error", e.message);
    } else if (e.name === "TypeError" && e.message.includes("conversion failure")) {
      const win = BrowserWindow.fromId(appWindowId);
      await showGlobalShortcutErrorMessageBox(win!, "Global shortcut key registration error",
        `Couldn't register the global shortcut key \"${shortcutKey}\" that for move mouse cursor back to the app window. ` + 
        `\"${shortcutKey}\" is invalid key combination.`);
    } else {
      const win = BrowserWindow.fromId(appWindowId);
      await showGlobalShortcutErrorMessageBox(win!, "Global shortcut key registration error",
        `Couldn't register the global shortcut key \"${shortcutKey}\" that for move mouse cursor back to the app window.` + "\n\n" +
        "Name: " + e.name + "\n" + "Message: " + e.message + "\n" + "Stack: " + e.stack);
    }
    throw e;
  }
}

export async function unregisterHotkeyReturnCursorToAppWindow(): Promise<void> {
  // Unregister a hotkey to move the mouse cursor to on app window from the screen.
  const shortcutKey = (await getAppSettings()).MouseCursorReturnShortcutKey;
  globalShortcut.unregister(shortcutKey);
}

async function showGlobalShortcutErrorMessageBox(win: BrowserWindow, title: string, message: string): Promise<void> {
  dialog.showMessageBoxSync(win, {
    type: "error",
    title: title,
    message: message,
  });
}

function moveMouseCursorToAppWindowArea(): void {
  const win = BrowserWindow.fromId(appWindowId);
  const [posX, posY] = calcCenterPositionInWindow(win!);
  setMouseCursorPosition(posX, posY);
}

function calcCenterPositionInWindow(win: BrowserWindow): [number, number] {
  const winScreenRect = screen.dipToScreenRect(win, win!.getBounds());
  return [
    Math.floor(winScreenRect.width / 2) + winScreenRect.x,
    Math.floor(winScreenRect.height / 2) + winScreenRect.y
  ];
}
