export interface DisplayMetadataValue {
  bounds: Electron.Rectangle;
  scaleFactor: number;
  isPrimary: boolean;
}

export interface ScreenPoint {
  x: number,
  y: number
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
