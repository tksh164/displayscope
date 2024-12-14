export interface OutletContext {
  screenSpecs: ScreenSpec[];
  setScreenSpecs: React.Dispatch<React.SetStateAction<ScreenSpec[]>>;
}
