export type OutletContext = {
  readonly screenSpecs: ScreenSpec[];
  readonly setScreenSpecs: React.Dispatch<React.SetStateAction<ScreenSpec[]>>;
  readonly currentScreenSpec: ScreenSpec;
  readonly setCurrentScreenSpec: React.Dispatch<React.SetStateAction<ScreenSpec>>;
  readonly isInteractiveScreenNavigatedByShortcutKey: boolean;
  readonly setIsInteractiveScreenNavigatedByShortcutKey: React.Dispatch<React.SetStateAction<boolean>>;
};
