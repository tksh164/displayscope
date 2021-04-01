<template>
  <div class="screen-view-wrapper" @mousemove="showFunctionArea" @mouseleave="hideFunctionArea">
    <video class="screen-video" ref="screenVideoRef" @canplaythrough="onCanPlayThrough" :src-object.prop.camel="screenStream"></video>
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
  isScreenVideoPlaying = false;

  get screenVideoClass(): object {
    return { "screen-video-pause": !this.isScreenVideoPlaying };
  }

  get pauseCardClass(): object {
    return { "pause-card-show": !this.isScreenVideoPlaying };
  }

  mounted(): void {
    this.setScreenStream();
  }

  async setScreenStream(): Promise<void> {
    this.screenStream = await getScreenMediaStream(this.$route.params.screenId).then((stream: MediaStream) => stream);
  }

  onCanPlayThrough(): void {
    this.getVideoElement()?.play();
  }

  onPause(): void {
    this.isScreenVideoPlaying = false;
  }

  onPlay(): void {
    this.isScreenVideoPlaying = true;
  }

  pauseScreenStream(): void {
    if (this.isScreenVideoPlaying) this.getVideoElement()?.pause();
  }

  playScreenStream(): void {
    this.getVideoElement()?.play();
  }

  getVideoElement(): null | HTMLVideoElement {
    const videoElement = this.$refs.screenVideoRef as HTMLVideoElement;
    return typeof videoElement === "object" ? videoElement : null;
  }

  moveToScreenSelectView(): void {
    this.screenStream.getTracks().map((track, index, array) => {
      track.stop();
    });
    this.$router.push({ name: "ScreenSelect" });
  }

  moveMouseCursorIntoScreen(): void {
    const posX = typeof this.$route.query.centerX === "string" ? parseInt(this.$route.query.centerX) : 0;
    const posY = typeof this.$route.query.centerY === "string" ? parseInt(this.$route.query.centerY) : 0;
    window.exposedApi.setMouseCursorPosition(posX, posY);
  }
}
</script>
