import { app, dialog, BrowserWindow } from "electron";
import fs  from "fs";
import path from "path";
import { AppSetting } from "./types/appSetting.d";
import { APP_SETTING_FILE_NAME, APP_DEFAULT_SETTING_FILE_NAME, APP_SETTING_FILE_SCHEMA_VERSION, ERROR_CODE_NAMES } from "./constants";
import { IsRunInDevelopmentEnv } from "./utils";

// Retain the app setting.
let appSettingCache: AppSetting | undefined = undefined;

export async function getAppSetting(window: BrowserWindow): Promise<AppSetting> {
  if (!(appSettingCache)) {
    // Load the app setting from the setting file if it is not loaded yet.
    appSettingCache = await loadAppSettingFromFile(window);
    if (!(appSettingCache)) {
      // If couldn't load the app setting from the setting file, try load it again because the setting file may be created.
      appSettingCache = await loadAppSettingFromFile(window);
    }
  }
  return appSettingCache;
}

async function loadAppSettingFromFile(window: BrowserWindow): Promise<AppSetting> {
  const appSettingFilePath = getAppSettingFilePath();
  try {
    const jsonText = fs.readFileSync(appSettingFilePath, { encoding: "utf8", flag: "r" });
    const appSetting: AppSetting = JSON.parse(jsonText);
    verifyAppSetting(appSetting, appSettingFilePath);
    return appSetting;
  }
  catch (e) {
    if (e.code === 'ENOENT') {
      // If the app setting file does not exist, create a new app setting file by copy the default app setting file.
      await createNewAppSettingFile(window);
      return undefined;
    }
    else {
      // The app setting file has an invalid schema version.
      if (e.name === ERROR_CODE_NAMES.INVALID_APP_SETTING_SCHEMA_VERSION || e.name === ERROR_CODE_NAMES.NO_SHORTCUT_KEY_SETTING) {
        // Rename the setting file to back up the current setting file.
        const renamedFileName = renameAppSettingFile(appSettingFilePath);

        // Create a new app setting file with default setting.
        await createNewAppSettingFile(window);

        const message = e.message + `\n\nRenamed the current setting file to "${renamedFileName}" and created a new setting file with the default setting.`;
        await dialog.showMessageBox(window, {
          type: "warning",
          title: app.getName(),
          message: message,
        });
        return undefined;
      }

      // The app setting file has syntax error.
      else if (e.message.includes("Unexpected token")) {
        const message = `Couldn't load the app setting because the app setting file "${appSettingFilePath}" has syntax error.\n\n` + e.message + "\n\n" + e.stack;
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

function verifyAppSetting(appSettingToVerify: AppSetting, appSettingFilePath: string): void {
  // Verify the schema version.
  if (appSettingToVerify.schemaVersion !== APP_SETTING_FILE_SCHEMA_VERSION) {
    const err = new Error(`The app setting file "${appSettingFilePath}" has an invalid schema version.\n` +
      `Expected: ${APP_SETTING_FILE_SCHEMA_VERSION}, Actual: ${appSettingToVerify.schemaVersion}`);
    err.name = ERROR_CODE_NAMES.INVALID_APP_SETTING_SCHEMA_VERSION;
    throw err;
  }

  // Verify the shortcut key property.
  if (!(appSettingToVerify.shortcutKeys)) {
    const err = new Error(`The app setting file "${appSettingFilePath}" has no shortcut key setting. The setting file's schema is invalid.`);
    err.name = ERROR_CODE_NAMES.NO_SHORTCUT_KEY_SETTING;
    throw err;
  }
}

function renameAppSettingFile(appSettingFilePath: string): string {
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
  const renamedFileName = appSettingFilePath + suffix;
  fs.renameSync(appSettingFilePath, renamedFileName);
  console.log("Renamed setting file name:", renamedFileName);
  return renamedFileName;
}

async function createNewAppSettingFile(window: BrowserWindow): Promise<void> {
  const defaultAppSettingFilePath = getDefaultAppSettingFilePath();
  const appSettingFilePath = getAppSettingFilePath();
  try {
    fs.copyFileSync(defaultAppSettingFilePath, appSettingFilePath, fs.constants.COPYFILE_EXCL);
  }
  catch (e) {
    // Couldn't create a new app setting file.
    const message = "Couldn't create a new app setting file.\n\n" +
      `Source: ${defaultAppSettingFilePath}\n` +
      `Destination: ${appSettingFilePath}\n\n` +
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
  const appSettingFilePath = path.join(app.getPath("userData"), APP_SETTING_FILE_NAME);
  console.log("App setting file path:", appSettingFilePath);
  return appSettingFilePath;
}

function getDefaultAppSettingFilePath(): string {
  const defaultAppSettingFilePath = IsRunInDevelopmentEnv() ?
    path.join(process.cwd(), 'src/assets', APP_DEFAULT_SETTING_FILE_NAME) :
    path.join(path.dirname(app.getAppPath()), APP_DEFAULT_SETTING_FILE_NAME);
  console.log("Default app setting file path:", defaultAppSettingFilePath);
  return defaultAppSettingFilePath;
}
