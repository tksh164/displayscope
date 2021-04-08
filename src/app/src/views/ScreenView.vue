<template>
  <div class="screen-view-wrapper" @mousemove="showFunctionArea" @mouseleave="hideFunctionArea">
    <video class="screen-video" :src-object.prop.camel="screenStream" @canplaythrough="onCanPlayThrough" @click="moveMouseCursorIntoScreen"></video>
    <div class="function-area" :class="showFunctionAreaClass">
      <div class="function-area-item grid-column1">
        <el-button type="primary" circle icon="el-icon-back" @click="moveToScreenSelectView"></el-button>
      </div>
      <div class="function-area-item grid-column2">
        <div class="notification-message">Your mouse cursor is now on this window. Click the preview screen to enter the screen.<br/>
          Press <strong class="hotkey-stroke">Shift + Esc</strong> to return your mouse cursor to this window.</div>
      </div>
    </div>
  </div>
</template>

<style>
.screen-view-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.screen-view-wrapper .screen-video {
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.screen-view-wrapper .function-area {
  display: none;
}

.screen-view-wrapper .show-function-area {
  position: absolute;
  width: 100%;
  display: grid;
  grid-template-columns: 15% 70% 15%;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 40%);
  backdrop-filter: blur(8px);
}

.screen-view-wrapper .function-area-item {
  margin: 1rem;
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
  screenStream: MediaStream = new MediaStream();
  isShowFunctionArea = false;
  
  get showFunctionAreaClass(): object {
    return { "show-function-area": this.isShowFunctionArea };
  }

  mounted(): void {
    this.setScreenStream();
  }

  async setScreenStream(): Promise<void> {
    this.screenStream = await getScreenMediaStream(this.$route.params.screenId).then((stream: MediaStream) => stream);
  }

  onCanPlayThrough(event: Event): void {
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
    this.screenStream.getTracks().map((track, index, array) => {
      track.stop();
    });
    this.$router.push({ name: "ScreenSelect" });
  }

  moveMouseCursorIntoScreen(event: MouseEvent): void {
    // Retrieve the video element's computed bounds.
    const videoElement = event.target as HTMLVideoElement;
    const computedVideoElementStyles = window.getComputedStyle(videoElement);
    const computedVideoElementBounds = {
      left: parseFloat(computedVideoElementStyles.getPropertyValue("left")),
      top: parseFloat(computedVideoElementStyles.getPropertyValue("top")),
      width: parseFloat(computedVideoElementStyles.getPropertyValue("width")),
      height: parseFloat(computedVideoElementStyles.getPropertyValue("height")),
    };

    // Correct the clicked position in the video element.
    // NOTE: Shift the clicked position by the half width and half height of the video element from the event's
    // clicked position because the video element centering by CSS transform.
    const correctedPosX = event.clientX - (computedVideoElementBounds.left - (computedVideoElementBounds.width / 2));
    const correctedPosY = event.clientY - (computedVideoElementBounds.top - (computedVideoElementBounds.height / 2));
    const clickedPositionInVideoElement = {
      x: correctedPosX < 0 ? 0 : correctedPosX,
      y: correctedPosY < 0 ? 0 : correctedPosY,
    };

    // Calculate the zoom ratio that the actual screen resolution and the video element.
    const screenDimension = {
      width: typeof this.$route.query.screenWidth === "string" ? parseInt(this.$route.query.screenWidth) : 1,
      height: typeof this.$route.query.screenHeight === "string" ? parseInt(this.$route.query.screenHeight) : 1,
      scaleFactor: typeof this.$route.query.scaleFactor === "string" ? parseFloat(this.$route.query.scaleFactor) : 1.0,
    };
    const zoomRatio = {
      width: (screenDimension.width * screenDimension.scaleFactor) / computedVideoElementBounds.width,
      height: (screenDimension.height * screenDimension.scaleFactor) / computedVideoElementBounds.height,
    };

    // Calculate the mouse cursor position in the actual screen for setting the mouse cursor.
    const clickedPositionInScreen = {
      x: clickedPositionInVideoElement.x * zoomRatio.width,
      y: clickedPositionInVideoElement.y * zoomRatio.height,
    };
    const screenOrigin = {
      x: typeof this.$route.query.scaledOriginX === "string" ? parseInt(this.$route.query.scaledOriginX) : 0,
      y: typeof this.$route.query.scaledOriginY === "string" ? parseInt(this.$route.query.scaledOriginY) : 0,
    };
    const mouseCursorPosition = {
      x: Math.floor(screenOrigin.x + clickedPositionInScreen.x),
      y: Math.floor(screenOrigin.y + clickedPositionInScreen.y),
    };

    window.exposedApi.setMouseCursorPosition(mouseCursorPosition.x, mouseCursorPosition.y);
  }
}
</script>
