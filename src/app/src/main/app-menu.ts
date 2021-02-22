import { app, BrowserWindow, Menu } from "electron";
import * as path from "path";

function getAppIconResourceFilePath(): string {
    const APP_ICON_FILE_NAME = "icon.png";
    return process.env.NODE_ENV !== "production" ?
      path.join(process.cwd(), "build", APP_ICON_FILE_NAME) :
      path.join(process.resourcesPath, APP_ICON_FILE_NAME);
}

export async function setAppMenu(browserWindow: BrowserWindow): Promise<void> {
  const appName = app.getName();
  const appVersion = app.getVersion();
  const menuTemplate: Electron.MenuItemConstructorOptions[] = [
    {
      label: "File",
      submenu: [
        { role: "quit" }
      ]
    },
    {
      label: "View",
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
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "close" }
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Learn more",
          click: async () => {
            const shell = await import("electron").then(({ shell }) => shell);
            await shell.openExternal("https://github.com/tksh164/displayscope");
          }
        },
        {
          label: `About ${appName}`,
          click: async () => {
            const os = await import("os").then((os) => os);
            const dialog = await import("electron").then(({ dialog }) => dialog);
            dialog.showMessageBoxSync(browserWindow, {
              icon: getAppIconResourceFilePath(),
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
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}
