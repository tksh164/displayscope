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
    <el-card class="return-button" :class="returnButtonClass">
      <div>
        <div>Your cursor is now on this window.</div>
        <el-button type="primary" round @click="moveToScreenSelectView">Return to screen select</el-button>
      </div>
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

.return-button {
  display: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%);
  width: 300px;
}

.return-button-pause {
  display: block;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getScreenMediaStream } from "@/screen-capturer";

@Component
export default class ScreenView extends Vue {
  screenStream: MediaStream = new MediaStream();
  isScreenVideoPlaying = false;

  get screenVideoClass(): object {
    return { 'screen-video-pause': !this.isScreenVideoPlaying };
  }

  get returnButtonClass(): object {
    return { 'return-button-pause': !this.isScreenVideoPlaying };
  }

  mounted(): void {
    this.setScreenStream();
  }

  setScreenStream(): void {
    getScreenMediaStream(this.$route.params.screenId)
      .then((stream: void | MediaStream) => {
        if (this.isMediaStream(stream)) this.screenStream = stream;
      });
  }

  isMediaStream(arg: any): arg is MediaStream {
    return arg !== null && arg !== undefined &&
      typeof arg === 'object' &&
      typeof arg.active === 'boolean' &&
      typeof arg.id === 'string' &&
      typeof arg.addTrack === 'function' &&
      typeof arg.removeTrack === 'function';
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
    return typeof videoElement === 'object' ? videoElement : null;
  }

  moveToScreenSelectView(): void {
    this.$router.push({ name: "ScreenSelect" });
  }
}
</script>
