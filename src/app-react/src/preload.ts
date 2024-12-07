// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("exposedApi", {
  setAlwaysOnTopSetting: async (newAlwaysOnTopSetting: boolean): Promise<void> => {
    return ipcRenderer.send("set-always-on-top-setting", newAlwaysOnTopSetting);
  }
});
