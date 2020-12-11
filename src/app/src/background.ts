"use strict";

import { app, protocol, BrowserWindow, screen, globalShortcut } from "electron";
import {
  createProtocol,
  installVueDevtools
} from "vue-cli-plugin-electron-builder/lib";
import { setMouseCursorPosition } from "@/mouse-cursor-setter";
const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

// Allow only one app instance.
const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) app.quit();

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

function createWindow() {
  // Create the browser window.
  const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width: Math.floor(workAreaSize.width * 0.8),
    height: Math.floor(workAreaSize.height * 0.8),
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      nodeIntegration: true,
      enableRemoteModule: true
    },
    autoHideMenuBar: true
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
  });
}

const HOTKEY_MOVE_MOUSE_CURSOR_TO_APP_WINDOW = "Shift+Escape";
function moveMouseCursorToAppWindowArea(): void {
  const winScreenRect = screen.dipToScreenRect(win, win!.getBounds());
  const posX = Math.floor(winScreenRect.width / 2) + winScreenRect.x;
  const posY = Math.floor(winScreenRect.height / 2) + winScreenRect.y;
  setMouseCursorPosition(posX, posY);
}

app.on("will-quit", () => {
  // Unregister a hot-key to move the mouse cursor to on app window from the screen.
  globalShortcut.unregister(HOTKEY_MOVE_MOUSE_CURSOR_TO_APP_WINDOW);
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    try {
      await installVueDevtools()
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString())
    }
  }

  createWindow();

  // Register a hot-key to move the mouse cursor to on app window from the screen.
  const ret = globalShortcut.register(HOTKEY_MOVE_MOUSE_CURSOR_TO_APP_WINDOW, moveMouseCursorToAppWindowArea);
  if (!ret) {
    console.log(`Failed the hot-key registration: ${HOTKEY_MOVE_MOUSE_CURSOR_TO_APP_WINDOW}`);
  }
});

// This method will be call when the second app instance launched.
app.on("second-instance", (event, argv, workingDirectory) => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
