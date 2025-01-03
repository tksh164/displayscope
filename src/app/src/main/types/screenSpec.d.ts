export type ScreenSpec = {
  readonly id: string;
  readonly name: string;
  readonly thumbnailDataUri: string;
  readonly scaledScreenOriginPoint: ScreenPoint;
  readonly displaySpec: DisplaySpec;
  readonly sequenceNumber: number;
};

export type DisplayBounds = {
  readonly x: number;       // The x coordinate of the origin of the rectangle. It must be an integer.
  readonly y: number;       // The y coordinate of the origin of the rectangle. It must be an integer.
  readonly width: number;   // The width of the rectangle. It must be an integer.
  readonly height: number;  // The height of the rectangle. It must be an integer.
};

export type ScreenPoint = {
  readonly x: number;
  readonly y: number;
};

export type DisplaySpec = {
  readonly id: string;
  readonly bounds: DisplayBounds;
  readonly scaleFactor: number;
  readonly isPrimary: boolean;
  readonly label: string;
};
