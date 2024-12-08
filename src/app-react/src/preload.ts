// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { ScreenSpec } from "./main/types/screenSpec";

contextBridge.exposeInMainWorld("exposedApi", {
  getAllScreenSpecs: async (thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenSpec[]> => {
    return ipcRenderer.invoke("get-all-screen-specs", thumbnailWidth, thumbnailHeight);     
  },
  setAlwaysOnTopSetting: async (newAlwaysOnTopSetting: boolean): Promise<void> => {
    return ipcRenderer.send("set-always-on-top-setting", newAlwaysOnTopSetting);
  },
});
