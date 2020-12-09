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
        <el-button type="primary" round @click="moveMouseCursorIntoScreen">Move the mouse cursor into this screen</el-button>
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
import * as path from "path";
import { exec } from "child_process";

@Component
export default class ScreenView extends Vue {
  screenStream: MediaStream = new MediaStream();
  isScreenVideoPlaying = false;

  get screenVideoClass(): object {
    return { "screen-video-pause": !this.isScreenVideoPlaying };
  }

  get returnButtonClass(): object {
    return { "return-button-pause": !this.isScreenVideoPlaying };
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
      typeof arg === "object" &&
      typeof arg.active === "boolean" &&
      typeof arg.id === "string" &&
      typeof arg.addTrack === "function" &&
      typeof arg.removeTrack === "function";
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
    this.$router.push({ name: "ScreenSelect" });
  }

  moveMouseCursorIntoScreen(): void {
    const setMouseCursorPosExeFileName = "setmousecursorpos.exe";
    const exeFilePath = process.env.NODE_ENV !== "production" ?
      path.join(process.cwd(), "build", setMouseCursorPosExeFileName) :
      path.join(process.resourcesPath, setMouseCursorPosExeFileName);
    const posX = typeof this.$route.query.centerX === "string" ? parseInt(this.$route.query.centerX) : 0;
    const posY = typeof this.$route.query.centerY === "string" ? parseInt(this.$route.query.centerY) : 0;
    const cmdline = '"' + exeFilePath + '" ' + posX + ' ' + posY;
    exec(cmdline, (error, stdout, stderr) => {
      // console.log(stdout);
      // console.log(stderr);
      // console.log(error);
    });
  }
}
</script>
