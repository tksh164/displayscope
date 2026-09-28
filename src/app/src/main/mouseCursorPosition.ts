import path from "path";
import { isRunInDevelopmentEnv } from "./utils";
import { SET_MOUSE_CURSOR_POS_ADDON_FILE_NAME } from "./constants";
import { SetMouseCursorPosAddon } from "./types/setMouseCursorPosAddon.d";

export async function setMouseCursorPosition(posX: number, posY: number): Promise<void> {
  const addonFilePath = await getAddonFilePath();
  const addon = require(addonFilePath) as SetMouseCursorPosAddon;
  console.log("Addon version:", addon.version);
  addon.setMouseCursorPosition(posX, posY);
}

export async function getAddonFilePath(): Promise<string> {
    const addonFilePath = isRunInDevelopmentEnv()
      ? path.join(process.cwd(), "../setmousecursorpos-addon/out", SET_MOUSE_CURSOR_POS_ADDON_FILE_NAME)
      : path.join(process.resourcesPath, SET_MOUSE_CURSOR_POS_ADDON_FILE_NAME);
    console.log("Addon file path:", addonFilePath);
    return addonFilePath;
}
