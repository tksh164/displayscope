import { app, BrowserWindow, Menu, MenuItemConstructorOptions, dialog } from "electron";
import os from "os";
import { MENU_ITEM_IDS, APP_ICON_PNG_FILE_NAME } from "./constants";
import { getAlwaysOnTopState, setAlwaysOnTopState, notifyAlwaysOnTopStateChanged } from "./alwaysOnTop";
import { IsRunInDevelopmentEnv } from "./utils";

export async function setAppMenu(window: BrowserWindow): Promise<void> {
  const menu = Menu.buildFromTemplate(getAppMenuTemplate(window));
  Menu.setApplicationMenu(menu);
}

function getAppMenuTemplate(window: BrowserWindow): MenuItemConstructorOptions[] {
  const appName = app.getName();
  const appVersion = app.getVersion();
  return [
    {
      label: "&File",
      submenu: [
        { role: "quit" }
      ]
    },
    {
      label: "&View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    {
      label: "&Window",
      submenu: [
        {
          id: MENU_ITEM_IDS.WINDOW_ALWAYS_ON_TOP,
          label: "Always on top",
          type: "checkbox",
          checked: false,
          click: async () => {
            const newAlwaysOnTopState = !getAlwaysOnTopState(window);
            setAlwaysOnTopState(window, newAlwaysOnTopState);
            notifyAlwaysOnTopStateChanged(window, newAlwaysOnTopState);
          }
        },
        { type: "separator" },
        { role: "minimize" },
        { role: "close" }
      ]
    },
    {
      label: "&Help",
      submenu: [
        {
          label: "Learn more",
          click: async () => {
            const shell = await import("electron").then(({ shell }) => shell);
            await shell.openExternal("https://github.com/tksh164/displayscope");
          }
        },
        {
          label: "Third party notices",
          click: async () => {
            const shell = await import("electron").then(({ shell }) => shell);
            await shell.openExternal("https://github.com/tksh164/displayscope/blob/master/ThirdPartyNotices.txt");
          }
        },
        {
          label: `About ${appName}`,
          click: async () => {
            dialog.showMessageBoxSync(window, {
              icon: await getAppIconResourceFilePath(),
              title: `About ${appName}`,
              message: appName,
              detail: `${appName}: ${appVersion} \n` +
                      `Electron: ${process.versions.electron}\n` +
                      `Chrome: ${process.versions.chrome}\n` +
                      `Node.js: ${process.version}\n` +
                      `V8: ${process.versions.v8}\n` +
                      `OS: ${os.type()} ${os.arch()} ${process.getSystemVersion()}`
            });
          }
        }
      ]
    }
  ];
}

async function getAppIconResourceFilePath(): Promise<string> {
  const path = await import("path").then((path) => path);
  const appIconResourceFilePath = IsRunInDevelopmentEnv() ?
    path.join(process.cwd(), "src/assets", APP_ICON_PNG_FILE_NAME) :
    path.join(process.resourcesPath, APP_ICON_PNG_FILE_NAME);
  console.log("App icon resource file path:", appIconResourceFilePath);
  return appIconResourceFilePath;
}
