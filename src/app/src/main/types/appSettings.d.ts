export type AppSettings = {
  readonly schemaVersion: number;
  readonly shortcutKeys: ShortcutKeysInAppSettings;
};

export type ShortcutKeysInAppSettings = {
  readonly returnMouseCursorToAppWindow: string;
  readonly navigateToScreenList: string;
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

export type ShortcutKeysInAppSettingsItemName = keyof ShortcutKeysInAppSettings;
