export type OutletContext = {
  screenSpecs: ScreenSpec[];
  setScreenSpecs: React.Dispatch<React.SetStateAction<ScreenSpec[]>>;
  currentScreenSpec: ScreenSpec;
  setCurrentScreenSpec: React.Dispatch<React.SetStateAction<ScreenSpec>>;
};
