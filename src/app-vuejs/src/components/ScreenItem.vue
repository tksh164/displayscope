<template>
  <div class="screen-list-item" @click="moveToScreenView">
    <div class="screen-name">{{ screenName }}</div>
    <div class="screen-description">{{ getScreenDescription() }}</div>
    <el-image class="screen-thumbnail" :src="thumbnailUrl" fit="contain"></el-image>
  </div>
</template>

<style>
.screen-list-item {
  margin: 2%;
  padding: 0.6vw 0.8vw 0.6vw 0.8vw;
  border: solid 1px transparent;
  border-radius: 8px;
}

.screen-list-item:hover {
  border: solid 1px #333333;
  background-color: #232323;
}

.screen-name {
  padding-bottom: 0.1rem;
  color: #ffffff;
}

.screen-description {
  padding-bottom: 0.5rem;
  color: #cccccc;
  font-size: 0.9rem;
}

.screen-thumbnail {
  width: 35vw;
  min-width: 300px;
  border-radius: 4px;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { DisplayRectangle, ScreenPoint } from "@/types/app";

@Component
export default class ScreenItem extends Vue {
  @Prop({ default: "" })
  screenId!: string;

  @Prop({ default: "-" })
  screenName!: string;

  @Prop({ default: "" })
  thumbnailUrl!: string;

  @Prop({ default: () => { return { x: 0, y: 0, width: 0, height: 0 }; } })
  screenBounds!: DisplayRectangle;

  @Prop({ default: 0 })
  screenScaleFactor!: number;

  @Prop({ default: false })
  isPrimaryScreen!: boolean;

  @Prop({ default: () => { return { x: 0, y: 0 }; } })
  scaledScreenOriginPoint!: ScreenPoint;

  getScreenDescription(): string {
    const scaledDisplayWidth = Math.floor(this.screenBounds.width * this.screenScaleFactor);
    const scaledDisplayHeight = Math.floor(this.screenBounds.height * this.screenScaleFactor);
    const primary = this.isPrimaryScreen ? "Primary, " : "";
    const resolution = `${scaledDisplayWidth} x ${scaledDisplayHeight}`; 
    const scale = `${this.screenScaleFactor * 100}%`;
    return `${primary}${resolution}, ${scale}`;
  }

  moveToScreenView() {
    this.$router.push({
      name: "ScreenView",
      params: {
        screenId: this.screenId
      },
      query: {
        screenWidth: this.screenBounds.width.toString(),
        screenHeight: this.screenBounds.height.toString(),
        scaleFactor: this.screenScaleFactor.toString(),
        scaledOriginX: this.scaledScreenOriginPoint.x.toString(),
        scaledOriginY: this.scaledScreenOriginPoint.y.toString(),
      }
    });
  }
}
</script>
