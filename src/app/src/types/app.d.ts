export interface ExposedApi {
  getAllScreenMetadata: (thumbnailWidth: number, thumbnailHeight: number) => Promise<ScreenMetadata[]>;
  setMouseCursorPosition: (posX: number, posY: number) => Promise<void>;
  getCurrentAlwaysOnTopSetting: () => Promise<boolean | undefined>;
  setAlwaysOnTopSetting: (newAlwaysOnTopSetting: boolean) => Promise<void>;
}

export interface ScreenPoint {
    x: number,
    y: number
  }

export interface DisplayMetadataValue {
  bounds: Electron.Rectangle;
  scaleFactor: number;
  isPrimary: boolean;
}

export interface ScreenMetadata {
  id: string;
  name: string;
  thumbnailDataUri: string;
  centerPoint: ScreenPoint,
  display: {
    bounds: Electron.Rectangle;
    scaleFactor: number;
    isPrimary: boolean;
  }
}

export interface ScreenItemProperty {
  id: string;
  name: string;
  description: string;
  centerPoint: ScreenPoint;
  thumbnailDataUri: string;
}
