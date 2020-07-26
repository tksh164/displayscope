<template>
  <div
    class="screen-view-wrapper"
    @mousemove="pauseScreenStream"
    @mouseleave="playScreenStream"
  >
    <video
      autoplay
      class="screen-video"
      :class="screenVideoClass"
      ref="screenVideoRef"
      @play="screenStreamPlaying"
      :src-object.prop.camel="screenStream"
    ></video>
    <el-card class="return-button" :class="returnButtonClass">
      <div>
        <div>Your cursor is now on this window.</div>
        <el-button type="primary" round @click="moveToScreenSelectView"
          >Return to screen select</el-button
        >
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
  isScreenVideoPlaying = true;

  get screenVideoClass(): object {
    return {
      // TODO: Paly video if load was completed and it was paused.
      "screen-video-pause": !this.isScreenVideoPlaying
      //"screen-video-pause": (this.$refs.screenVideoRef as HTMLVideoElement).paused
    };
  }

  get returnButtonClass(): object {
    return {
      // TODO: Paly video if load was completed and it was paused.
      "return-button-pause": !this.isScreenVideoPlaying
      //"return-button-pause": (this.$refs.screenVideoRef as HTMLVideoElement).paused
    };
  }

  mounted() {
    this.setScreenStream();
  }

  setScreenStream() {
    getScreenMediaStream(this.$route.params.screenId).then(
      (stream: MediaStream) => {
        this.screenStream = stream;
      }
    );
  }

  screenStreamPlaying() {
    this.isScreenVideoPlaying = true;
  }

  pauseScreenStream() {
    // if (this.isScreenVideoPlaying) {
    //   this.isScreenVideoPlaying = false;
    //   (this.$refs.screenVideoRef as HTMLVideoElement).pause();
    // }

    // TODO: Check the video's event fire order.

    // Check the "playing event".
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event
    //
    // canplaythrough
    //

    if (this.isScreenVideoPlaying) {
      //this.isScreenVideoPlaying = false;
      (this.$refs.screenVideoRef as HTMLVideoElement).pause();
      this.isScreenVideoPlaying = false; //!(this.$refs.screenVideoRef as HTMLVideoElement).paused;
    }
  }

  playScreenStream() {
    (this.$refs.screenVideoRef as HTMLVideoElement).play();
    //this.isScreenVideoPlaying = true;
  }

  moveToScreenSelectView() {
    this.$router.push({ name: "ScreenSelect" });
  }
}
</script>
