<template>
  <div id="wrapper" class="screen-view-wrapper" @mousemove="showFunctionArea" @mouseleave="hideFunctionArea">
    <video id="video" class="screen-video" :src-object.prop.camel="screenStream" @canplaythrough="onCanPlayThrough" @click="moveMouseCursorIntoScreen"></video>
    <div class="function-area" :class="showFunctionAreaClass">
      <div class="function-area-item grid-column1">
        <el-button type="primary" circle icon="el-icon-back" @click="moveToScreenSelectView"></el-button>
      </div>
      <div class="function-area-item grid-column2">
        <div class="notification-message">Your mouse cursor is now on this window. Click anywhere on the viewing screen to enter the screen.<br/>
          Press <strong class="hotkey-stroke">{{ mouseCursorReturnShortcutKey }}</strong> key combination to return your mouse cursor on this window.</div>
      </div>
    </div>
  </div>
</template>

<style>
.screen-view-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.screen-view-wrapper .screen-video {
  position: absolute;
  cursor: pointer;
}

.screen-view-wrapper .function-area {
  display: none;
}

.screen-view-wrapper .show-function-area {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 15% 70% 15%;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 25%);
  backdrop-filter: blur(100px);
}

.screen-view-wrapper .function-area-item {
  margin: 0.8rem;
}

.screen-view-wrapper .grid-column1 {
  grid-column: 1;
}

.screen-view-wrapper .grid-column2 {
  grid-column: 2;
}

.screen-view-wrapper .notification-message {
  color: white;
  text-align: center;
  text-shadow: 0 0 5px rgb(0, 0, 0);
  line-height: 1.5rem;
}

.screen-view-wrapper .hotkey-stroke {
  margin-left: 0.5ch;
  margin-right: 0.5ch;
  font-weight: bold;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getScreenMediaStream } from "@/renderer/screen-media-stream";

@Component
export default class ScreenView extends Vue {
  screenStream: MediaStream | null = null;
  isShowFunctionArea = false;
  mouseCursorReturnShortcutKey = "";
  
  get showFunctionAreaClass(): object {
    return { "show-function-area": this.isShowFunctionArea };
  }

  created(): void {
    window.addEventListener("resize", this.setVideoElementBounds);
  }

  mounted(): void {
    window.exposedApi.getMouseCursorReturnShortcutKey().then(shortcutKey => {
      this.mouseCursorReturnShortcutKey = shortcutKey;
    });
    this.setScreenStream();
  }

  destroyed(): void {
    window.removeEventListener("resize", this.setVideoElementBounds);
  }

  setVideoElementBounds(): void {
    const wrapperElementComputedStyles = window.getComputedStyle(document.getElementById("wrapper") as HTMLElement);
    const wrapperElementComputedSize = {
      width: parseFloat(wrapperElementComputedStyles.getPropertyValue("width")),
      height: parseFloat(wrapperElementComputedStyles.getPropertyValue("height")),
    };
    const videoElement = document.getElementById("video") as HTMLVideoElement;
    const newVideoElementBounds = { left: 0, top: 0, width: 0, height: 0 };

    newVideoElementBounds.width = wrapperElementComputedSize.width;
    newVideoElementBounds.height = videoElement.videoHeight * (wrapperElementComputedSize.width / videoElement.videoWidth);
    newVideoElementBounds.left = 0;
    newVideoElementBounds.top = (wrapperElementComputedSize.height - newVideoElementBounds.height) / 2;

    if (newVideoElementBounds.height > wrapperElementComputedSize.height) {
      newVideoElementBounds.width = videoElement.videoWidth * (wrapperElementComputedSize.height / videoElement.videoHeight);
      newVideoElementBounds.height = wrapperElementComputedSize.height;
      newVideoElementBounds.left = (wrapperElementComputedSize.width - newVideoElementBounds.width) / 2;
      newVideoElementBounds.top = 0;
    }

    videoElement.style.left = newVideoElementBounds.left + "px";
    videoElement.style.top = newVideoElementBounds.top + "px";
    videoElement.width = newVideoElementBounds.width;
    videoElement.height = newVideoElementBounds.height;
  }

  async setScreenStream(): Promise<void> {
    this.screenStream = await getScreenMediaStream(this.$route.params.screenId).then((stream: MediaStream) => stream);
  }

  onCanPlayThrough(event: Event): void {
    this.setVideoElementBounds();
    const videoElement = event.target as HTMLVideoElement;
    videoElement.play();
  }

  showFunctionArea(): void {
    this.isShowFunctionArea = true;
  }

  hideFunctionArea(): void {
    this.isShowFunctionArea = false;
  }

  moveToScreenSelectView(): void {
    this.screenStream?.getTracks().forEach((track): void => track.stop());
    this.$router.push({ name: "ScreenSelect" });
  }

  moveMouseCursorIntoScreen(event: MouseEvent): void {
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

    window.exposedApi.setMouseCursorPosition(newMouseCursorPosition.x, newMouseCursorPosition.y);
  }
}
</script>
