import { screen } from "electron";

export function getInitialAppWindowSize(): [number, number] {
  const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
  return [
    Math.floor(workAreaSize.width * 0.7),
    Math.floor(workAreaSize.height * 0.9),
  ];
}
