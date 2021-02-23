import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from "electron";

export async function setAppMenu(win: BrowserWindow): Promise<void> {
  const menu = Menu.buildFromTemplate(getAppMenuTemplate(win));
  Menu.setApplicationMenu(menu);
}

function getAppMenuTemplate(win: BrowserWindow): MenuItemConstructorOptions[] {
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
          label: `About ${appName}`,
          click: async () => {
            const [os, dialog] = await Promise.all([
              import("os").then((os) => os),
              import("electron").then(({ dialog }) => dialog)
            ]);
            dialog.showMessageBoxSync(win, {
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
  const APP_ICON_FILE_NAME = "icon.png";
  const isDevelopment = process.env.NODE_ENV !== "production";
  return isDevelopment ?
    path.join(process.cwd(), "build", APP_ICON_FILE_NAME) :
    path.join(process.resourcesPath, APP_ICON_FILE_NAME);
}
