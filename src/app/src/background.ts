"use strict";

import { app, protocol, BrowserWindow, screen, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import * as path from "path";
import { ScreenSpec } from "@/types/app";
import { getAppSettings } from "@/main/app-settings";
import { setAppMenu } from "@/main/app-menu";
import { registerHotkeyReturnCursorToAppWindow, unregisterHotkeyReturnCursorToAppWindow } from "@/main/hotkey-registerer";
import { getAllScreenSpec } from "@/main/screen-metadata";
import { setMouseCursorPosition } from "@/main/mouse-cursor-setter";
import { getCurrentAlwaysOnTopSetting, setAlwaysOnTop, setAlwaysOnTopMenuItemCheck } from "@/main/always-on-top";

const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object.
let mainWindow: BrowserWindow | null = null;

async function createWindow(): Promise<BrowserWindow> {
  // Create the browser window.
  const [winWidth, winHeight] = getInitialAppWindowSize();
  const win = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  // Set application menu.
  await setAppMenu(win);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  // Set a global reference to the main window object.
  mainWindow = win;

  return win;
}

function getInitialAppWindowSize(): [number, number] {
  const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
  return [
    Math.floor(workAreaSize.width * 0.8),
    Math.floor(workAreaSize.height * 0.8)
  ];
}

// Get single instance lock to allow only one app instance.
const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  console.log("This app instance is will quit because the app instance is already running.");
  app.quit();
} else {
  // Scheme must be registered before the app is ready
  protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
  ]);

  app.on("will-quit", async () => {
    // Unregister hotkey.
    await unregisterHotkeyReturnCursorToAppWindow();
  });

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  // This evnet will be call when the second app instance launched.
  app.on("second-instance", (event, argv, workingDirectory) => {
    if (mainWindow?.isMinimized()) mainWindow.restore();
    mainWindow?.focus();
  });
  
  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
      // Install Vue Devtools
      try {
        await installExtension(VUEJS_DEVTOOLS);
      } catch (e: any) {
        console.error("Vue Devtools failed to install:", e.toString());
      }
    }

    // Load the app settings from the file.
    try {
      await getAppSettings();
    } catch {
      app.exit(-1);
    }

    // Create the browser window.
    const win = await createWindow();

    // Register hotkey.
    try {
      await registerHotkeyReturnCursorToAppWindow(win.id);
    } catch {
      app.exit(-1);
    }
  });

  // Exit cleanly on request from parent process in development mode.
  if (isDevelopment) {
    if (process.platform === "win32") {
      process.on("message", (data) => {
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

  ipcMain.handle("get-all-screen-spec", async (event, thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenSpec[]> => {
    return getAllScreenSpec(thumbnailWidth, thumbnailHeight);
  });

  ipcMain.on("set-mouse-cursor-position", async (event, posX: number, posY: number) => {
    setMouseCursorPosition(posX, posY);
  });

  ipcMain.handle("get-current-always-on-top-setting", async (event): Promise<boolean> => {
    return mainWindow ? getCurrentAlwaysOnTopSetting(mainWindow) : false;
  });

  ipcMain.on("set-always-on-top-setting", async (event, newAlwaysOnTopSetting: boolean): Promise<void> => {
    if (mainWindow) {
      setAlwaysOnTop(mainWindow, newAlwaysOnTopSetting);
      setAlwaysOnTopMenuItemCheck("window-always-on-top", newAlwaysOnTopSetting);
    }
  });

  ipcMain.handle("get-mouse-cursor-return-shortcut-key", async (event): Promise<string> => {
    return (await getAppSettings()).MouseCursorReturnShortcutKey;
  });
}
