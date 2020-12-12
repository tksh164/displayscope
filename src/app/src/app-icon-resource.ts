import * as path from "path";

export function getAppIconResourceFilePath(): string {
    const APP_ICON_FILE_NAME = "icon.png";
    return process.env.NODE_ENV !== "production" ?
      path.join(process.cwd(), "build", APP_ICON_FILE_NAME) :
      path.join(process.resourcesPath, APP_ICON_FILE_NAME);
}
