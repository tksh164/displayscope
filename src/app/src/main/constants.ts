//
// IPC channels.
//

export const IPC_CHANNELS = {
  // Screen spec
  GET_ALL_SCREEN_SPECS: "get-all-screen-specs",

  // Mouse cursor position
  SET_MOUSE_CURSOR_POSITION: "set-mouse-cursor-position",

  // Always on top state
  GET_ALWAYS_ON_TOP_STATE: "get-always-on-top-state",
  SET_ALWAYS_ON_TOP_STATE: "set-always-on-top-state",
  ALWAYS_ON_TOP_STATE_CHANGED: "always-on-top-state-changed",

  // App settings
  GET_SHORTCUT_KEY_SETTING: "get-shortcut-key-setting",

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
// App settings.
//

// App settings file names
export const APP_SETTINGS_FILE_NAME = "settings.json";
export const APP_DEFAULT_SETTINGS_FILE_NAME = "default-settings.json";

// Schema version
export const APP_SETTINGS_FILE_SCHEMA_VERSION = 2;

// Item names
export const APP_SETTINGS_ITEM_NAME_SHORTCUT_KEY_RETURN_MOUSE_CURSOR_TO_APP_WINDOW = "returnMouseCursorToAppWindow";
export const APP_SETTINGS_ITEM_NAME_PREFIX_SHORTCUT_KEY_NAVIGATE_TO_INTERACTIVE_SCREEN = "navigateToInteractiveScreen";

//
// Asset resource file names.
//

export const SET_MOUSE_CURSOR_POS_EXECUTABLE_FILE_NAME = "setmousecursorpos.exe";
export const APP_ICON_PNG_FILE_NAME = "appicon.png";

//
// Error codes.
//

export const ERROR_CODE_NAMES = {
  INVALID_APP_SETTINGS_SCHEMA_VERSION: "INVALID_APP_SETTINGS_SCHEMA_VERSION",
  NO_SHORTCUT_KEY_SETTING: "NO_SHORTCUT_KEY_SETTING",
};
