import { contextBridge, ipcRenderer } from "electron";
import { ScreenMetadata } from "@/types/app";

contextBridge.exposeInMainWorld("exposedApi", {
  getAllScreenMetadata: async (thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenMetadata[]> => {
    return ipcRenderer.invoke("get-all-screen-metadata", thumbnailWidth, thumbnailHeight);     
  },
  setMouseCursorPosition: async (posX: number, posY: number): Promise<void> => {
    return ipcRenderer.send("set-mouse-cursor-position", posX, posY);
  },
  getCurrentAlwaysOnTopSetting: async (): Promise<boolean> => {
    return ipcRenderer.invoke("get-current-always-on-top-setting");
  },
  setAlwaysOnTopSetting: async (newAlwaysOnTopSetting: boolean): Promise<void> => {
    return ipcRenderer.send("set-always-on-top-setting", newAlwaysOnTopSetting);
  },
  addAlwaysOnTopChangedByMenuItemListener: async (listener: Function): Promise<void> => {
    ipcRenderer.removeAllListeners("changed-always-on-top-setting");
    ipcRenderer.on("changed-always-on-top-setting", (event, newAlwaysOnTopSetting) => listener(newAlwaysOnTopSetting));
  },
  getMouseCursorReturnShortcutKey: async (): Promise<string> => {
    return ipcRenderer.invoke("get-mouse-cursor-return-shortcut-key");     
  }
});
