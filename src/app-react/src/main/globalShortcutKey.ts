import { globalShortcut, BrowserWindow, app, dialog } from "electron";

export async function registerGlobalShortcutKey(shortcutKey: string, callback: () => void, window: BrowserWindow, messageWhenFailed: string): Promise<void> {
  try {
    if (globalShortcut.register(shortcutKey, callback)) {
      console.log(`Registered a global shortcut key \"${shortcutKey}\".`);
    }
    else {
      // The specified shortcut key already registered.
      const message = messageWhenFailed + "\n\n" + `The shortcut key \"${shortcutKey}\" is already registered by another application.`;
      dialog.showMessageBox(window, {
        type: "error",
        title: app.getName(),
        message: message,
      });
    }
  }
  catch (e: any) {
    if (e.name === "TypeError" && e.message.includes("conversion failure")) {
      // The specified shortcut key is invalid.
      const message = messageWhenFailed + "\n\n" + `The shortcut key \"${shortcutKey}\" is invalid key combination.`;
      dialog.showMessageBox(window, {
        type: "error",
        title: app.getName(),
        message: message,
      });
    }
    else {
      // Unexpected error.
      const message = messageWhenFailed + "\n\n" + "Name: " + e.name + "\n" + "Message: " + e.message + "\n" + "Stack: " + e.stack;
      dialog.showMessageBox(window, {
        type: "error",
        title: app.getName(),
        message: message,
      });
    }
    throw e;
  }
}

export async function unregisterGlobalShortcutKey(shortcutKey: string): Promise<void> {
  globalShortcut.unregister(shortcutKey);
  console.log(`Unregistered a global shortcut key \"${shortcutKey}\".`);
}
