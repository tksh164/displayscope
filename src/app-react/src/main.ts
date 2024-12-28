import { app, BrowserWindow } from "electron";
import path from "path";
import started from "electron-squirrel-startup";
import { IsRunInDevelopmentEnv } from "./main/utils";
import { getInitialAppWindowSize } from "./main/appWindowSize";
import { initializeIpcListeners } from "./main/ipcListeners";
import { setAppMenu } from "./main/appMenu";
import { registerMouseCursorBackToAppWindowShortcutKey, unregisterMouseCursorBackToAppWindowShortcutKey } from "./main/appGlobalShortcutKeys";
import { installReactDevTools } from "./main/devTools";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = async (): Promise<BrowserWindow> => {
  // Create the browser window.
  const [windowWidth, windowHeight] = getInitialAppWindowSize();
  const mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    autoHideMenuBar: !(IsRunInDevelopmentEnv()),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Initialize IPC listeners.
  initializeIpcListeners(mainWindow);

  // Set the application menu.
  setAppMenu(mainWindow);

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  installReactDevTools();
  const mainWindow = await createWindow();

  const shortcutKey = "Shift + Esc";
  registerMouseCursorBackToAppWindowShortcutKey(shortcutKey, mainWindow);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("will-quit", async () => {
    // Unregister shortcut key.
    await unregisterMouseCursorBackToAppWindowShortcutKey();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
