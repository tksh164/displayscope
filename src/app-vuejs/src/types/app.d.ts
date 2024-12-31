export interface ExposedApi {
  getAllScreenSpec: (thumbnailWidth: number, thumbnailHeight: number) => Promise<ScreenSpec[]>;
  setMouseCursorPosition: (posX: number, posY: number) => Promise<void>;
  getCurrentAlwaysOnTopSetting: () => Promise<boolean>;
  setAlwaysOnTopSetting: (newAlwaysOnTopSetting: boolean) => Promise<void>;
  addAlwaysOnTopChangedByMenuItemListener: (listener: Function) => Promise<void>;
  getMouseCursorReturnShortcutKey: () => Promise<string>;
}

export interface DisplayRectangle {
  x: number;       // The x coordinate of the origin of the rectangle (must be an integer).
  y: number;       // The y coordinate of the origin of the rectangle (must be an integer).
  width: number;   // The width of the rectangle (must be an integer).
  height: number;  // The height of the rectangle (must be an integer).
}

export interface ScreenPoint {
  x: number;
  y: number;
}

export interface DisplaySpec {
  bounds: DisplayRectangle;
  scaleFactor: number;
  isPrimary: boolean;
}

export interface ScreenSpec {
  id: string;
  name: string;
  thumbnailDataUri: string;
  display: {
    bounds: DisplayRectangle;
    scaleFactor: number;
    isPrimary: boolean;
    scaledScreenOriginPoint: ScreenPoint;
  }
}

export interface ScreenItemProperty {
  id: string;
  name: string;
  thumbnailDataUri: string;
  bounds: DisplayRectangle;
  scaleFactor: number;
  isPrimary: boolean;
  scaledScreenOriginPoint: ScreenPoint;
}

export interface AppSettings {
  readonly schemaVersion: number;
  readonly MouseCursorReturnShortcutKey: string;
}
