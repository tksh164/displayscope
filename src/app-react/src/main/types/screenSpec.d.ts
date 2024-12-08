export interface ScreenSpec {
  id: string;
  name: string;
  thumbnailDataUri: string;
  display: {
    bounds: DisplayBounds;
    scaleFactor: number;
    isPrimary: boolean;
    scaledScreenOriginPoint: ScreenPoint;
  }
}

export interface DisplayBounds {
  x: number;       // The x coordinate of the origin of the rectangle. It must be an integer.
  y: number;       // The y coordinate of the origin of the rectangle. It must be an integer.
  width: number;   // The width of the rectangle. It must be an integer.
  height: number;  // The height of the rectangle. It must be an integer.
}

export interface ScreenPoint {
  x: number;
  y: number;
}

export interface DisplaySpecDictionary {
  [key: string]: DisplaySpec;
}

export interface DisplaySpec {
  bounds: DisplayBounds;
  scaleFactor: number;
  isPrimary: boolean;
}
