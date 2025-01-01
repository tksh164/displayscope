//
// IPC channels.
//

export const IPC_CHANNELS = {
  // Screen spec
  GET_ALL_SCREEN_SPECS: "get-all-screen-specs",

  // Mouse cursor position
  SET_MOUSE_CURSOR_POSITION: "set-mouse-cursor-position",

  // Always on top setting
  GET_ALWAYS_ON_TOP_SETTING: "get-always-on-top-setting",
  SET_ALWAYS_ON_TOP_SETTING: "set-always-on-top-setting",
  ALWAYS_ON_TOP_SETTING_CHANGED: "always-on-top-setting-changed",

  // Mouse cursor return to the app window shortcut key
  GET_MOUSE_CURSOR_RETURN_SHORTCUT_KEY: "get-mouse-cursor-return-shortcut-key",

  // Navigate to interactive screen view shortcut keys
  REGISTER_NAVIGATE_TO_INTERACTIVE_SCREEN_SHORTCUT_KEYS: "register-navigate-to-interactive-screen-view-shortcut-key",
  UNREGISTER_NAVIGATE_TO_INTERACTIVE_SCREEN_SHORTCUT_KEYS: "unregister-navigate-to-interactive-screen-view-shortcut-key",
  NAVIGATE_TO_INTERACTIVE_SCREEN_SHORTCUT_KEY_PRESSED: "navigate-to-interactive-screen-shortcut-key-pressed",
};

//
// App menu.
//

export const MENU_ITEM_IDS = {
  WINDOW_ALWAYS_ON_TOP: "window-always-on-top",
};

//
// App setting file.
//

export const APP_SETTING_FILE_NAME = "setting.json";
export const APP_DEFAULT_SETTING_FILE_NAME = "default-setting.json";
export const APP_SETTING_FILE_SCHEMA_VERSION = 2;
export const APP_SETTING_KEY_PREFIX_NAVIGATE_TO_INTERACTIVE_SCREEN_SHORTCUT_KEY = "navigateToInteractiveScreen";

//
// Asset resource file names.
//

export const SETMOUSECURSORPOS_EXECUTABLE_FILE_NAME = "setmousecursorpos.exe";
export const APP_ICON_PNG_FILE_NAME = "appicon.png";

//
// Error codes.
//

export const ERROR_CODE_NAMES = {
  INVALID_APP_SETTINGS_SCHEMA_VERSION: "INVALID_APP_SETTINGS_SCHEMA_VERSION",
};
