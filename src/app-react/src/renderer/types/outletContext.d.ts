export type OutletContext = {
  screenSpecs: ScreenSpec[];
  setScreenSpecs: React.Dispatch<React.SetStateAction<ScreenSpec[]>>;
  currentScreenId: string;
  setCurrentScreenId: React.Dispatch<React.SetStateAction<string>>;
};
