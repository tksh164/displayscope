export interface ExposedApi {
  getAllScreenMetadata: (thumbnailWidth: number, thumbnailHeight: number) => Promise<ScreenMetadata[]>;
  setMouseCursorPosition: (posX: number, posY: number) => Promise<void>;
  getCurrentAlwaysOnTopSetting: () => Promise<boolean>;
  setAlwaysOnTopSetting: (newAlwaysOnTopSetting: boolean) => Promise<void>;
  addAlwaysOnTopChangedByMenuItemListener: (listener: Function) => Promise<void>;
}

export interface DisplayRectangle {
  x: number;       // The x coordinate of the origin of the rectangle (must be an integer).
  y: number;       // The y coordinate of the origin of the rectangle (must be an integer).
  width: number;   // The width of the rectangle (must be an integer).
  height: number;  // The height of the rectangle (must be an integer).
}

export interface ScreenPoint {
  x: number,
  y: number
}

export interface DisplayMetadataValue {
  bounds: DisplayRectangle;
  scaleFactor: number;
  isPrimary: boolean;
}

export interface ScreenMetadata {
  id: string;
  name: string;
  thumbnailDataUri: string;
  centerPoint: ScreenPoint,
  display: {
    bounds: DisplayRectangle;
    scaleFactor: number;
    isPrimary: boolean;
  }
}

export interface ScreenItemProperty {
  id: string;
  name: string;
  centerPoint: ScreenPoint;
  thumbnailDataUri: string;
  bounds: DisplayRectangle;
  scaleFactor: number;
  isPrimary: boolean;
}
