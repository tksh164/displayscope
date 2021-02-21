import { contextBridge, ipcRenderer } from "electron";
import { ScreenMetadata } from "@/types/pipapp/screen-capturer";

contextBridge.exposeInMainWorld("exposedApi", {
  getAllScreenMetadata: async (thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenMetadata[]> => {
    return ipcRenderer.invoke("get-all-screen-metadata", thumbnailWidth, thumbnailHeight);     
  },
  setMouseCursorPosition: async (posX: number, posY: number): Promise<void> => {
    return ipcRenderer.send("set-mouse-cursor-position", posX, posY);
  },
  getCurrentAlwaysOnTopSetting: async (): Promise<boolean | undefined> => {
    return ipcRenderer.invoke("get-current-always-on-top-setting");
  },
  setAlwaysOnTopSetting: async (newAlwaysOnTopSetting: boolean): Promise<void> => {
    return ipcRenderer.send("set-always-on-top-setting", newAlwaysOnTopSetting);
  }
});
