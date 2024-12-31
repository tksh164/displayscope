export type ScreenSpec = {
  id: string;
  name: string;
  thumbnailDataUri: string;
  scaledScreenOriginPoint: ScreenPoint;
  displaySpec: DisplaySpec;
  sequenceNumber: number;
};

export type DisplayBounds = {
  x: number;       // The x coordinate of the origin of the rectangle. It must be an integer.
  y: number;       // The y coordinate of the origin of the rectangle. It must be an integer.
  width: number;   // The width of the rectangle. It must be an integer.
  height: number;  // The height of the rectangle. It must be an integer.
};

export type ScreenPoint = {
  x: number;
  y: number;
};

export type DisplaySpecDictionary = {
  [key: string]: DisplaySpec;
};

export type DisplaySpec = {
  bounds: DisplayBounds;
  scaleFactor: number;
  isPrimary: boolean;
  label: string;
};
