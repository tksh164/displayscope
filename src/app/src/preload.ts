import { contextBridge, ipcRenderer } from "electron";
import { ScreenMetadata } from "@/@type/pipapp/screen-capturer";

contextBridge.exposeInMainWorld("exposedApi", {
  getAllScreenMetadata: async (thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenMetadata[]> => {
    return ipcRenderer.invoke("get-all-screen-metadata", thumbnailWidth, thumbnailHeight);     
  },
  getCurrentAlwaysOnTopSetting: async (): Promise<boolean | undefined> => {
    return ipcRenderer.invoke("get-current-always-on-top-setting");
  },
  setAlwaysOnTopSetting: async (newAlwaysOnTopSetting: boolean): Promise<void> => {
    return ipcRenderer.send("set-always-on-top-setting", newAlwaysOnTopSetting);
  }
});
