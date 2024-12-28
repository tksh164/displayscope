import { app, dialog, BrowserWindow } from "electron";
import fs  from "fs";
import path from "path";
import { AppSettings } from "./types/appSettings";
import { IsRunInDevelopmentEnv } from "./utils";

// Retain the app settings.
let appSettings: AppSettings | undefined = undefined;

export async function getAppSettings(window: BrowserWindow): Promise<AppSettings> {
  if (!(appSettings)) {
    // Load the app settings from the settings file if it is not loaded yet.
    appSettings = await loadAppSettingsFromFile(window);
    if (!(appSettings)) {
      // If couldn't load the app settings from the settings file, try load it again because the settings file may be created.
      appSettings = await loadAppSettingsFromFile(window);
    }
  }
  return appSettings;
}

async function loadAppSettingsFromFile(window: BrowserWindow): Promise<AppSettings> {
  const appSettingsFilePath = getAppSettingsFilePath();
  try {
    const jsonText = fs.readFileSync(appSettingsFilePath, { encoding: "utf8", flag: "r" });
    return JSON.parse(jsonText);
  }
  catch (e: any) {
    if (e.code === 'ENOENT') {
      // If the app settings file does not exist, create a new app settings file by copy the default app settings file.
      await createNewAppSettingsFile(window);
      return undefined;
    }
    else {
      if (e.message.includes("Unexpected token")) {
        // The app settings file has syntax error.
        const message = `Couldn't load the app settings because the app settings file \"${appSettingsFilePath}\" has syntax error.\n\n` + e.message + "\n\n" + e.stack;
        dialog.showMessageBox(window, {
          type: "error",
          title: app.getName(),
          message: message,
        });
      }
      else {
        // Unexpected error.
        const message = e.name + "\n" + e.message + "\n" + e.stack;
        dialog.showMessageBox(window, {
          type: "error",
          title: app.getName(),
          message: message,
        });
      }
      throw e;
    }
  }
}

async function createNewAppSettingsFile(window: BrowserWindow): Promise<void> {
  const defaultAppSettingsFilePath = getDefaultAppSettingsFilePath();
  const appSettingsFilePath = getAppSettingsFilePath();
  try {
    fs.copyFileSync(defaultAppSettingsFilePath, appSettingsFilePath, fs.constants.COPYFILE_EXCL);
  }
  catch (e: any) {
    // Couldn't create a new app settings file.
    const message = "Couldn't create a new app settings file.\n\n" +
      `Source: ${defaultAppSettingsFilePath}\n` +
      `Destination: ${appSettingsFilePath}\n\n` +
      `Name: ${e.name}\n` + `Message: ${e.message}\n` + `${e.stack}`;
    dialog.showMessageBox(window, {
      type: "error",
      title: app.getName(),
      message: message,
    });
    throw e;
  }
}

function getAppSettingsFilePath(): string {
  const APP_SETTINGS_FILE_NAME = "settings1.json"
  const appSettingsFilePath = path.join(app.getPath("userData"), APP_SETTINGS_FILE_NAME);
  console.log("App settings file path:", appSettingsFilePath);
  return appSettingsFilePath;
}

function getDefaultAppSettingsFilePath(): string {
  const DEFAULT_APP_SETTINGS_FILE_NAME = "default-settings.json"
  const defaultAppSettingsFilePath = IsRunInDevelopmentEnv() ?
    path.join(process.cwd(), 'src/assets', DEFAULT_APP_SETTINGS_FILE_NAME) :
    path.join(path.dirname(app.getAppPath()), DEFAULT_APP_SETTINGS_FILE_NAME);
  console.log("Default app settings file path:", defaultAppSettingsFilePath);
  return defaultAppSettingsFilePath;
}
