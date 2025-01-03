import { ScreenSpec } from "../../../../main/types/screenSpec.d";

// HTML element IDs.
const WRAPPER_ELEMENT_ID = "screen-view-wrapper";
const VIDEO_ELEMENT_ID = "screen-video";

//
// Retrieve a screen media stream.
//
export async function getScreenMediaStream(targetWindow: Window, sourceId: string): Promise<MediaStream> {
  return targetWindow.navigator.mediaDevices.getUserMedia({
    audio: false,
    video: ({
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: sourceId
      }
    } as unknown) as undefined
  });
}

//
// Calculate the video element's bounds.
//
export function updateVideoElementBounds(targetWindow: Window): void {
  //
  // Retrieve the wrapper element's computed size.
  //

  const wrapperElement = targetWindow.document.getElementById(WRAPPER_ELEMENT_ID) as HTMLElement;
  if (wrapperElement === null || wrapperElement === undefined) {
    throw new Error(`The wrapper element with ID "${WRAPPER_ELEMENT_ID}" is not found.`);
  }
  const wrapperElementComputedStyles = targetWindow.getComputedStyle(wrapperElement);
  const wrapperElementComputedSize = {
    width: parseFloat(wrapperElementComputedStyles.getPropertyValue("width")),
    height: parseFloat(wrapperElementComputedStyles.getPropertyValue("height")),
  };

  //
  // Calculate the video element's new bounds.
  //

  const videoElement = targetWindow.document.getElementById(VIDEO_ELEMENT_ID) as HTMLVideoElement;
  if (videoElement === null || videoElement === undefined) {
    throw new Error(`The video element with ID "${VIDEO_ELEMENT_ID}" is not found.`);
  }
  const newVideoElementBounds = { left: 0, top: 0, width: 0, height: 0 };

  // First, try to fit the video element to the wrapper element based on width.
  newVideoElementBounds.width = wrapperElementComputedSize.width;
  newVideoElementBounds.height = videoElement.videoHeight * (wrapperElementComputedSize.width / videoElement.videoWidth);
  newVideoElementBounds.left = 0;
  newVideoElementBounds.top = (wrapperElementComputedSize.height - newVideoElementBounds.height) / 2;

  // Second, if the video element's height is greater than the wrapper element's height after first fitting,
  // fitting again the video element to the wrapper element based on height.
  if (newVideoElementBounds.height > wrapperElementComputedSize.height) {
    newVideoElementBounds.width = videoElement.videoWidth * (wrapperElementComputedSize.height / videoElement.videoHeight);
    newVideoElementBounds.height = wrapperElementComputedSize.height;
    newVideoElementBounds.left = (wrapperElementComputedSize.width - newVideoElementBounds.width) / 2;
    newVideoElementBounds.top = 0;
  }

  //
  // Update the video element's bounds.
  //

  videoElement.style.left = newVideoElementBounds.left + "px";
  videoElement.style.top = newVideoElementBounds.top + "px";
  videoElement.width = newVideoElementBounds.width;
  videoElement.height = newVideoElementBounds.height;
}

//
// Set the mouse cursor position.
//
export function setMouseCursorPosition(targetWindow: Window, event: React.MouseEvent, currentScreenSpec: ScreenSpec): void {
  // Retrieve the video element's computed bounds.
  const videoElement = event.target as HTMLVideoElement;
  if (videoElement === null || videoElement === undefined) {
    throw new Error("The target video element is not found.");
  }
  const videoElementComputedStyles = targetWindow.getComputedStyle(videoElement);
  const videoElementComputedBounds = {
    left: parseFloat(videoElementComputedStyles.getPropertyValue("left")),
    top: parseFloat(videoElementComputedStyles.getPropertyValue("top")),
    width: parseFloat(videoElementComputedStyles.getPropertyValue("width")),
    height: parseFloat(videoElementComputedStyles.getPropertyValue("height")),
  };

  // Correct the clicked position to the position in the video element's bounds.
  const clickedPositionInVideoElement = {
    x: event.clientX - videoElementComputedBounds.left,
    y: event.clientY - videoElementComputedBounds.top,
  };
  if (clickedPositionInVideoElement.x < 0) clickedPositionInVideoElement.x = 0;
  if (clickedPositionInVideoElement.y < 0) clickedPositionInVideoElement.y = 0;

  // Calculate the scale ratio that is the ratio between the actual screen resolution and the video element size.
  const currentDisplaySpec = currentScreenSpec.displaySpec;
  const scaleRatio = {
    width: (currentDisplaySpec.bounds.width * currentDisplaySpec.scaleFactor) / videoElementComputedBounds.width,
    height: (currentDisplaySpec.bounds.height * currentDisplaySpec.scaleFactor) / videoElementComputedBounds.height,
  };

  // Calculate the mouse cursor position in the actual screen.
  const clickedPositionInScreen = {
    x: clickedPositionInVideoElement.x * scaleRatio.width,
    y: clickedPositionInVideoElement.y * scaleRatio.height,
  };
  const mouseCursorPositionInActualScreen = {
    x: Math.floor(currentScreenSpec.scaledScreenOriginPoint.x + clickedPositionInScreen.x),
    y: Math.floor(currentScreenSpec.scaledScreenOriginPoint.y + clickedPositionInScreen.y),
  };

  // Move the mouse cursor into the actual screen.
  targetWindow.exposedApi.mouseCursorPosition.set(mouseCursorPositionInActualScreen.x, mouseCursorPositionInActualScreen.y);
}

export function setMouseCursorPositionWhenNavigateByShortcutKey(targetWindow: Window, event: React.SyntheticEvent, currentScreenSpec: ScreenSpec): void {
  // Retrieve the video element's computed left and top.
  const videoElement = targetWindow.document.getElementById(VIDEO_ELEMENT_ID) as HTMLVideoElement;
  if (videoElement === null || videoElement === undefined) {
    throw new Error(`The video element with ID "${VIDEO_ELEMENT_ID}" is not found.`);
  }
  const videoElementComputedStyles = targetWindow.getComputedStyle(videoElement);
  const videoElementComputedLeftTop = {
    left: parseFloat(videoElementComputedStyles.getPropertyValue("left")),
    top: parseFloat(videoElementComputedStyles.getPropertyValue("top")),
  };

  // Set the mouse cursor position within the actual screen.
  const mouseEvent = {
    target: event.target,
    clientX: Math.floor((videoElement.width / 2) + videoElementComputedLeftTop.left),
    clientY: Math.floor((videoElement.height / 2) + videoElementComputedLeftTop.top),
  } as React.MouseEvent;
  setMouseCursorPosition(targetWindow, mouseEvent, currentScreenSpec);
}
