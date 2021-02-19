import { contextBridge, ipcRenderer } from "electron";
import { ScreenMetadata } from "@/@type/pipapp/screen-capturer";

contextBridge.exposeInMainWorld("exposedApi", {
  getAllScreenMetadata: async (thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenMetadata[]> => {
    return ipcRenderer.invoke("get-all-screen-metadata", thumbnailWidth, thumbnailHeight);     
  }
});
