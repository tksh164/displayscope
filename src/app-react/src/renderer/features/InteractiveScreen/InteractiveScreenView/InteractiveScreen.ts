export async function getScreenMediaStream(sourceId: string): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: ({
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: sourceId
      }
    } as unknown) as undefined
  });
}

// TODO: This function is can remove if can implement by CSS.
export function setVideoElementBounds(): void {
  console.log("resize");
  // const wrapperElementComputedStyles = window.getComputedStyle(document.getElementById("wrapper") as HTMLElement);
  // const wrapperElementComputedSize = {
  //   width: parseFloat(wrapperElementComputedStyles.getPropertyValue("width")),
  //   height: parseFloat(wrapperElementComputedStyles.getPropertyValue("height")),
  // };
  // const videoElement = document.getElementById("video") as HTMLVideoElement;
  // const newVideoElementBounds = { left: 0, top: 0, width: 0, height: 0 };

  // newVideoElementBounds.width = wrapperElementComputedSize.width;
  // newVideoElementBounds.height = videoElement.videoHeight * (wrapperElementComputedSize.width / videoElement.videoWidth);
  // newVideoElementBounds.left = 0;
  // newVideoElementBounds.top = (wrapperElementComputedSize.height - newVideoElementBounds.height) / 2;

  // if (newVideoElementBounds.height > wrapperElementComputedSize.height) {
  //   newVideoElementBounds.width = videoElement.videoWidth * (wrapperElementComputedSize.height / videoElement.videoHeight);
  //   newVideoElementBounds.height = wrapperElementComputedSize.height;
  //   newVideoElementBounds.left = (wrapperElementComputedSize.width - newVideoElementBounds.width) / 2;
  //   newVideoElementBounds.top = 0;
  // }

  // videoElement.style.left = newVideoElementBounds.left + "px";
  // videoElement.style.top = newVideoElementBounds.top + "px";
  // videoElement.width = newVideoElementBounds.width;
  // videoElement.height = newVideoElementBounds.height;

  // this.isShowScreenVideo = true;
}

export function moveMouseCursorIntoScreen(event: MouseEvent): void {
  // Retrieve the video element's computed bounds.
  const videoElementComputedStyles = window.getComputedStyle(event.target as HTMLVideoElement);
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
  const screenDimension = {
    width: parseInt(this.$route.query.screenWidth as string),
    height: parseInt(this.$route.query.screenHeight as string),
    scaleFactor: parseFloat(this.$route.query.scaleFactor as string),
  };
  // TODO: The scaled width and height are can pre-calculate when the screen selected.
  const scaleRatio = {
    width: (screenDimension.width * screenDimension.scaleFactor) / videoElementComputedBounds.width,
    height: (screenDimension.height * screenDimension.scaleFactor) / videoElementComputedBounds.height,
  };

  // Calculate the mouse cursor position in the actual screen.
  const screenOrigin = {
    x: parseInt(this.$route.query.scaledOriginX as string),
    y: parseInt(this.$route.query.scaledOriginY as string),
  };
  const clickedPositionInScreen = {
    x: clickedPositionInVideoElement.x * scaleRatio.width,
    y: clickedPositionInVideoElement.y * scaleRatio.height,
  };
  const newMouseCursorPosition = {
    x: Math.floor(screenOrigin.x + clickedPositionInScreen.x),
    y: Math.floor(screenOrigin.y + clickedPositionInScreen.y),
  };

  //window.exposedApi.setMouseCursorPosition(newMouseCursorPosition.x, newMouseCursorPosition.y);
}

