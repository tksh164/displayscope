export type AppSetting = {
  readonly schemaVersion: number;
  readonly shortcutKeyToReturnMouseCursorToAppWindow: string;
  readonly shortcutKeys: AppShortcutKeysSetting;
};

export type AppShortcutKeysSetting = {
  readonly returnMouseCursorToAppWindow: string;
  readonly navigateToInteractiveScreen1: string;
  readonly navigateToInteractiveScreen2: string;
  readonly navigateToInteractiveScreen3: string;
  readonly navigateToInteractiveScreen4: string;
  readonly navigateToInteractiveScreen5: string;
  readonly navigateToInteractiveScreen6: string;
  readonly navigateToInteractiveScreen7: string;
  readonly navigateToInteractiveScreen8: string;
  readonly navigateToInteractiveScreen9: string;
};

export type AppShortcutKeysSettingKey = keyof AppShortcutKeysSetting;
