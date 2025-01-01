import { app, dialog, BrowserWindow } from "electron";
import fs  from "fs";
import path from "path";
import { AppSetting } from "./types/appSetting";
import { APP_SETTING_FILE_NAME, APP_DEFAULT_SETTING_FILE_NAME, APP_SETTING_FILE_SCHEMA_VERSION, ERROR_CODE_NAMES } from "./constants";
import { IsRunInDevelopmentEnv } from "./utils";

// Retain the app settings.
let appSettings: AppSetting | undefined = undefined;

export async function getAppSetting(window: BrowserWindow): Promise<AppSetting> {
  if (!(appSettings)) {
    // Load the app settings from the settings file if it is not loaded yet.
    appSettings = await loadAppSettingFromFile(window);
    if (!(appSettings)) {
      // If couldn't load the app settings from the settings file, try load it again because the settings file may be created.
      appSettings = await loadAppSettingFromFile(window);
    }
  }
  return appSettings;
}

async function loadAppSettingFromFile(window: BrowserWindow): Promise<AppSetting> {
  const appSettingsFilePath = getAppSettingFilePath();
  try {
    const jsonText = fs.readFileSync(appSettingsFilePath, { encoding: "utf8", flag: "r" });
    const appSettingsJson = JSON.parse(jsonText);

    // Verify the schema version.
    if (appSettingsJson.schemaVersion !== APP_SETTING_FILE_SCHEMA_VERSION) {
      const err = new Error(`The app settings file "${appSettingsFilePath}" has an invalid schema version.\n` +
        `Expected: ${APP_SETTING_FILE_SCHEMA_VERSION}, Actual: ${appSettingsJson.schemaVersion}`);
      err.name = ERROR_CODE_NAMES.INVALID_APP_SETTINGS_SCHEMA_VERSION;
      throw err;
    }

    return appSettingsJson;
  }
  catch (e) {
    if (e.code === 'ENOENT') {
      // If the app settings file does not exist, create a new app settings file by copy the default app settings file.
      await createNewAppSettingFile(window);
      return undefined;
    }
    else {
      // The app settings file has an invalid schema version.
      if (e.name === ERROR_CODE_NAMES.INVALID_APP_SETTINGS_SCHEMA_VERSION) {
        // Rename the settings file to back up the current settings file.
        const renamedFileName = renameAppSettingFile(appSettingsFilePath);

        // Create a new app settings file with default settings.
        await createNewAppSettingFile(window);

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

function renameAppSettingFile(appSettingsFilePath: string): string {
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

async function createNewAppSettingFile(window: BrowserWindow): Promise<void> {
  const defaultAppSettingsFilePath = getDefaultAppSettingFilePath();
  const appSettingsFilePath = getAppSettingFilePath();
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

function getAppSettingFilePath(): string {
  const appSettingsFilePath = path.join(app.getPath("userData"), APP_SETTING_FILE_NAME);
  console.log("App settings file path:", appSettingsFilePath);
  return appSettingsFilePath;
}

function getDefaultAppSettingFilePath(): string {
  const defaultAppSettingsFilePath = IsRunInDevelopmentEnv() ?
    path.join(process.cwd(), 'src/assets', APP_DEFAULT_SETTING_FILE_NAME) :
    path.join(path.dirname(app.getAppPath()), APP_DEFAULT_SETTING_FILE_NAME);
  console.log("Default app settings file path:", defaultAppSettingsFilePath);
  return defaultAppSettingsFilePath;
}
