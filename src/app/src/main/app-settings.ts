import { app, dialog } from "electron";
import * as fs from "fs";
import * as path from "path";
import { AppSettings } from "@/types/app";

// Retain the loaded app settings object.
let appSettings: AppSettings | undefined;

export async function getAppSettings(): Promise<AppSettings> {
  if (!(appSettings)) await loadAppSettings();
  return appSettings as AppSettings;
}

async function loadAppSettings(): Promise<void> {
  const appSettingsFilePath = getAppSettingsFilePath();
  try {
    const jsonText = fs.readFileSync(appSettingsFilePath, { encoding: "utf8", flag: "r" });
    appSettings = JSON.parse(jsonText);
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      // If the app settings file does not exist, retrieve the settings from the default app settings file
      // and create a new app settings file by copy the default app settings file.
      appSettings = await loadDefaultAppSettings();
      await createNewAppSettingsFile();
    } else {
      if (e.message.includes("Unexpected token")) {
        await showAppSettingErrorMessageBox("App settings file syntax error",
          `Couldn't load the app settings because the app settings file \"${appSettingsFilePath}\" has syntax error.` + "\n\n" +
          e.message + "\n\n" + e.stack);
      } else {
        await showAppSettingErrorMessageBox("App settings file error", e.name + "\n" + e.message + "\n" + e.stack);
      }
      throw e;
    }
  }
}

function getAppSettingsFilePath(): string {
  const APP_SETTINGS_FILE_NAME = "settings.json"
  return path.join(app.getPath("userData"), APP_SETTINGS_FILE_NAME);
}

async function loadDefaultAppSettings(): Promise<AppSettings> {
  const appSettingsFilePath = getDefaultAppSettingsFilePath();
  try {
    const jsonText = fs.readFileSync(appSettingsFilePath, { encoding: "utf8", flag: "r" });
    return JSON.parse(jsonText);
  } catch (e: any) {
    if (e.message.includes("Unexpected token")) {
      await showAppSettingErrorMessageBox("Default app settings file syntax error",
        `Couldn't load the app settings because the app settings file \"${appSettingsFilePath}\" has syntax error.` + "\n\n" +
        e.message + "\n\n" + e.stack);
    } else {
      await showAppSettingErrorMessageBox("Default app settings file error", e.name + "\n" + e.message + "\n" + e.stack);
    }
    throw e;
  }
}

function getDefaultAppSettingsFilePath(): string {
  const DEFAULT_APP_SETTINGS_FILE_NAME = "default-settings.json"
  const isDevelopment = process.env.NODE_ENV !== "production";
  if (isDevelopment) {
    return path.join(process.cwd(), 'build', DEFAULT_APP_SETTINGS_FILE_NAME);
  } else {
    return path.join(path.dirname(app.getAppPath()), DEFAULT_APP_SETTINGS_FILE_NAME);
  }
}

async function createNewAppSettingsFile(): Promise<void> {
  const defaultAppSettingsFilePath = getDefaultAppSettingsFilePath();
  const appSettingsFilePath = getAppSettingsFilePath();
  try
  {
    fs.copyFileSync(defaultAppSettingsFilePath, appSettingsFilePath, fs.constants.COPYFILE_EXCL);
  } catch (e: any) {
    await showAppSettingErrorMessageBox("App settings file creation error",
      `Source: ${defaultAppSettingsFilePath}` + "\n" +
      `Destination: ${appSettingsFilePath}` + "\n\n" +
      e.name + "\n" + e.message + "\n" + e.stack);
    throw e;
  }
}

async function showAppSettingErrorMessageBox(title: string, message: string): Promise<void> {
  dialog.showMessageBoxSync({
    type: "error",
    title: title,
    message: message,
  });
}
