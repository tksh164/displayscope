import { app, dialog, BrowserWindow } from "electron";
import fs  from "fs";
import path from "path";
import { AppSettings } from "./types/appSettings.d";
import { APP_SETTINGS_FILE_NAME, APP_DEFAULT_SETTINGS_FILE_NAME, APP_SETTINGS_FILE_SCHEMA_VERSION, ERROR_CODE_NAMES } from "./constants";
import { IsRunInDevelopmentEnv } from "./utils";

// Retain the app settings.
let appSettingsCache: AppSettings | undefined = undefined;

export async function getAppSettings(window: BrowserWindow): Promise<AppSettings> {
  if (!(appSettingsCache)) {
    // Load the app settings from the settings file if it is not loaded yet.
    appSettingsCache = await loadAppSettingsFromFile(window);
    if (!(appSettingsCache)) {
      // If couldn't load the app settings from the settings file, try load it again because the settings file may be created.
      appSettingsCache = await loadAppSettingsFromFile(window);
    }
  }
  return appSettingsCache;
}

async function loadAppSettingsFromFile(window: BrowserWindow): Promise<AppSettings> {
  const appSettingsFilePath = getAppSettingsFilePath();
  try {
    const jsonText = fs.readFileSync(appSettingsFilePath, { encoding: "utf8", flag: "r" });
    const appSettings: AppSettings = JSON.parse(jsonText);
    verifyAppSettings(appSettings, appSettingsFilePath);
    return appSettings;
  }
  catch (e) {
    if (e.code === 'ENOENT') {
      // If the app settings file does not exist, create a new app settings file by copy the default app settings file.
      await createNewAppSettingsFile(window);
      return undefined;
    }
    else {
      // The app settings file has an invalid schema version.
      if (e.name === ERROR_CODE_NAMES.INVALID_APP_SETTINGS_SCHEMA_VERSION || e.name === ERROR_CODE_NAMES.NO_SHORTCUT_KEY_SETTING) {
        // Rename the settings file to back up the current settings file.
        const renamedFileName = renameAppSettingsFile(appSettingsFilePath);

        // Create a new app settings file with default settings.
        await createNewAppSettingsFile(window);

        const message = e.message + `\n\nRenamed the current settings file to "${renamedFileName}" and created a new settings file with the default settings.`;
        await dialog.showMessageBox(window, {
          type: "warning",
          title: app.getName(),
          message: message,
        });
        return undefined;
      }

      // The app settings file has syntax error.
      else if (e.message.includes("Unexpected token")) {
        const message = `Couldn't load the app settings because the app settings file "${appSettingsFilePath}" has syntax error.\n\n` + e.message + "\n\n" + e.stack;
        dialog.showMessageBox(window, {
          type: "error",
          title: app.getName(),
          message: message,
        });
        throw e;
      }

      // Unexpected error.
      else {
        const message = e.name + "\n" + e.message + "\n" + e.stack;
        dialog.showMessageBox(window, {
          type: "error",
          title: app.getName(),
          message: message,
        });
        throw e;
      }
    }
  }
}

function verifyAppSettings(appSettingsToVerify: AppSettings, appSettingsFilePath: string): void {
  // Verify the schema version.
  if (appSettingsToVerify.schemaVersion !== APP_SETTINGS_FILE_SCHEMA_VERSION) {
    const err = new Error(`The app settings file "${appSettingsFilePath}" has an invalid schema version.\n` +
      `Expected: ${APP_SETTINGS_FILE_SCHEMA_VERSION}, Actual: ${appSettingsToVerify.schemaVersion}`);
    err.name = ERROR_CODE_NAMES.INVALID_APP_SETTINGS_SCHEMA_VERSION;
    throw err;
  }

  // Verify the shortcut key property.
  if (!(appSettingsToVerify.shortcutKeys)) {
    const err = new Error(`The app settings file "${appSettingsFilePath}" has no shortcut key setting. The settings file's schema is invalid.`);
    err.name = ERROR_CODE_NAMES.NO_SHORTCUT_KEY_SETTING;
    throw err;
  }
}

function renameAppSettingsFile(appSettingsFilePath: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const dateTimeParts = (new Intl.DateTimeFormat("en-US", options)).formatToParts(new Date());
  const partValues = dateTimeParts.map((p) => p.value);
  const suffix = "." + partValues[4] + partValues[0] + partValues[2] + partValues[6] + partValues[8] + partValues[10];
  const renamedFileName = appSettingsFilePath + suffix;
  fs.renameSync(appSettingsFilePath, renamedFileName);
  console.log("Renamed settings file name:", renamedFileName);
  return renamedFileName;
}

async function createNewAppSettingsFile(window: BrowserWindow): Promise<void> {
  const defaultAppSettingsFilePath = getDefaultAppSettingsFilePath();
  const appSettingsFilePath = getAppSettingsFilePath();
  try {
    fs.copyFileSync(defaultAppSettingsFilePath, appSettingsFilePath, fs.constants.COPYFILE_EXCL);
  }
  catch (e) {
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
  const appSettingsFilePath = path.join(app.getPath("userData"), APP_SETTINGS_FILE_NAME);
  console.log("App settings file path:", appSettingsFilePath);
  return appSettingsFilePath;
}

function getDefaultAppSettingsFilePath(): string {
  const defaultAppSettingsFilePath = IsRunInDevelopmentEnv() ?
    path.join(process.cwd(), 'src/assets', APP_DEFAULT_SETTINGS_FILE_NAME) :
    path.join(path.dirname(app.getAppPath()), APP_DEFAULT_SETTINGS_FILE_NAME);
  console.log("Default app settings file path:", defaultAppSettingsFilePath);
  return defaultAppSettingsFilePath;
}
