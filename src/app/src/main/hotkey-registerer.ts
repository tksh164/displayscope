import { globalShortcut, BrowserWindow, screen, dialog } from "electron";
import { setMouseCursorPosition } from "@/main/mouse-cursor-setter";
import { getAppSettings } from "@/main/app-settings";

// Retain the app window reference.
let appWindow: BrowserWindow;

export async function registerHotkeyReturnCursorToAppWindow(win: BrowserWindow): Promise<void> {
  appWindow = win;
  const shortcutKey = (await getAppSettings()).ShortcutKeyToMoveCursorBackToAppWindow;
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
      await showGlobalShortcutErrorMessageBox(win, "Global shortcut key registration error", e.message);
    } else if (e.name === "TypeError" && e.message.includes("conversion failure")) {
      await showGlobalShortcutErrorMessageBox(win, "Global shortcut key registration error",
        `Couldn't register the global shortcut key \"${shortcutKey}\" that for move mouse cursor back to the app window. ` + 
        `\"${shortcutKey}\" is invalid key combination.`);
    } else {
      await showGlobalShortcutErrorMessageBox(win, "Global shortcut key registration error",
        `Couldn't register the global shortcut key \"${shortcutKey}\" that for move mouse cursor back to the app window.` + "\n\n" +
        "Name: " + e.name + "\n" + "Message: " + e.message + "\n" + "Stack: " + e.stack);
    }
    throw e;
  }
}

export async function unregisterHotkeyReturnCursorToAppWindow(): Promise<void> {
  // Unregister a hotkey to move the mouse cursor to on app window from the screen.
  const shortcutKey = (await getAppSettings()).ShortcutKeyToMoveCursorBackToAppWindow;
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
