// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { IPC_CHANNELS } from "./main/constants";
import { ScreenSpec } from "./main/types/screenSpec";

contextBridge.exposeInMainWorld("exposedApi", {
  //
  // Screen spec
  //

  getAllScreenSpecs: async (thumbnailWidth: number, thumbnailHeight: number): Promise<ScreenSpec[]> => {
    return ipcRenderer.invoke(IPC_CHANNELS.GET_ALL_SCREEN_SPECS, thumbnailWidth, thumbnailHeight);
  },

  //
  // Mouse cursor position
  //

  setMouseCursorPosition: async (posX: number, posY: number): Promise<void> => {
    ipcRenderer.send(IPC_CHANNELS.SET_MOUSE_CURSOR_POSITION, posX, posY);
  },

  //
  // Always on top setting
  //

  getCurrentAlwaysOnTopSetting: async (): Promise<boolean> => {
    return ipcRenderer.invoke(IPC_CHANNELS.GET_CURRENT_ALWAYS_ON_TOP_SETTING);
  },

  setAlwaysOnTopSetting: async (shouldAlwaysOnTop: boolean): Promise<void> => {
    ipcRenderer.send(IPC_CHANNELS.SET_ALWAYS_ON_TOP_SETTING, shouldAlwaysOnTop);
  },

  addAlwaysOnTopSettingChangedEventListener: async (listener: (event: Electron.IpcRendererEvent, shouldAlwaysOnTop: boolean) => void): Promise<void> => {
    ipcRenderer.on(IPC_CHANNELS.ALWAYS_ON_TOP_SETTING_CHANGED, listener);
    //console.log("Add the always-on-top-setting-changed event listener.");
  },

  removeAlwaysOnTopSettingChangedEventListener: async (listener: (event: Electron.IpcRendererEvent, shouldAlwaysOnTop: boolean) => void): Promise<void> => {
    ipcRenderer.removeListener(IPC_CHANNELS.ALWAYS_ON_TOP_SETTING_CHANGED, listener);
    //console.log("Remove the always-on-top-setting-changed event listener.");
  },

  //
  // Mouse cursor return to the app window shortcut key
  //

  getMouseCursorReturnShortcutKey: async (): Promise<string> => {
    return ipcRenderer.invoke(IPC_CHANNELS.GET_MOUSE_CURSOR_RETURN_SHORTCUT_KEY);
  },

  //
  // Navigate to interactive screen view shortcut keys
  //

  addNavigateToInteractiveScreenShortcutKeyPressedEventListener: async (listener: (event: Electron.IpcRendererEvent, screenSpec: ScreenSpec) => void): Promise<void> => {
    ipcRenderer.on(IPC_CHANNELS.NAVIGATE_TO_INTERACTIVE_SCREEN_SHORTCUT_KEY_PRESSED, listener);
  },

  removeNavigateToInteractiveScreenShortcutKeyPressedEventListener: async (listener: (event: Electron.IpcRendererEvent, screenSpec: ScreenSpec) => void): Promise<void> => {
    ipcRenderer.removeListener(IPC_CHANNELS.NAVIGATE_TO_INTERACTIVE_SCREEN_SHORTCUT_KEY_PRESSED, listener);
  },

  registerNavigateToInteractiveScreenShortcutKeys: async (screenSpecs: ScreenSpec[]): Promise<void> => {
    ipcRenderer.send(IPC_CHANNELS.REGISTER_NAVIGATE_TO_INTERACTIVE_SCREEN_SHORTCUT_KEYS, screenSpecs);
  },

  unregisterNavigateToInteractiveScreenShortcutKeys: async (): Promise<void> => {
    ipcRenderer.send(IPC_CHANNELS.UNREGISTER_NAVIGATE_TO_INTERACTIVE_SCREEN_SHORTCUT_KEYS);
  },
});
