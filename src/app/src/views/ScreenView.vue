<template>
  <div class="screen-view-wrapper"
    @mousemove="pauseScreenStream"
    @mouseleave="playScreenStream">
    <video class="screen-video"
      :class="screenVideoClass"
      ref="screenVideoRef"
      @canplaythrough="onCanPlayThrough"
      @play="onPlay"
      @pause="onPause"
      :src-object.prop.camel="screenStream"></video>
    <el-card class="pause-card" :class="pauseCardClass">
      <div slot="header" class="card-header">Your mouse cursor is now on this window</div>
      <el-row>
        <el-col class="card-body-column mouse-cursor-button">
          <el-button type="primary"
            round icon="el-icon-position"
            @click="moveMouseCursorIntoScreen">Move your mouse cursor into the screen</el-button>
        </el-col>
      </el-row>
      <el-row>
        <div class="card-body-column mouse-cursor-text">Press <strong class="hotkey-stroke">Shift + Esc</strong> to return your mouse cursor to this window.</div>
      </el-row>
      <el-row>
        <el-col class="card-body-column return-button">
          <el-button round
            icon="el-icon-back"
            @click="moveToScreenSelectView">Select another screen</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style>
.screen-view-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.screen-video {
  height: 100%;
  max-width: 100%;
  max-height: 100vh;
}

.screen-video-pause {
  filter: brightness(50%) grayscale(100%) blur(3px);
}

.pause-card {
  display: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
}

.pause-card .card-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pause-card .card-body-column {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pause-card .mouse-cursor-button {
  margin-bottom: 1vh;
}

.pause-card .mouse-cursor-text {
  font-size: small;
}

.mouse-cursor-text .hotkey-stroke {
  margin-left: 0.5ch;
  margin-right: 0.5ch;
  font-weight: bold;
}

.pause-card .return-button {
  margin-top: 3vh;
}

.pause-card-show {
  display: block;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getScreenMediaStream } from "@/renderer/screen-capturer";

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

  setScreenStream(): void {
    getScreenMediaStream(this.$route.params.screenId)
      .then((stream: MediaStream) => {
        this.screenStream = stream;
      });
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
