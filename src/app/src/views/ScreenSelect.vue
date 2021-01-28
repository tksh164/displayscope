<template>
  <el-container class="container">
    <el-header style="padding: 1rem; height: auto;">
      <div class="function-area">
        <div class="function-area-item">
          <el-switch v-model="alwaysOnTop"
            active-text="Always on top"
            @change="changeAlwasyOnTop"></el-switch>
        </div>
        <div class="function-area-item">
          <el-button type="primary"
            circle
            icon="el-icon-refresh"
            @click="refreshScreenMetadataList"></el-button>
        </div>
      </div>
    </el-header>
    <el-main style="padding: 1rem;">
    <transition-group name="list-item-transition"
      appear
      tag="div"
      class="screen-list">
      <screen-item v-for="screenItem in screenItems"
        :key="screenItem.id"
        :screenId="screenItem.id"
        :centerPoint="screenItem.centerPoint"
        :screenName="screenItem.name"
        :screenDescription="screenItem.description"
        :thumbnailUrl="screenItem.thumbnailDataUri"></screen-item>
    </transition-group>
    </el-main>
  </el-container>
</template>

<style>
.container {
  height: 100%;
}

.function-area {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.function-area-item {
  margin-left: 2rem;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}

.function-area-item .el-switch__label {
  color: #cccccc;
}

.screen-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
}

.list-item-transition-enter-active,
.list-item-transition-leave-active {
  transition: opacity 0.2s;
}

.list-item-transition-enter,
.list-item-transition-leave-to {
  opacity: 0;
}
</style>

<script lang="ts">
import { remote } from "electron";
import { Component, Vue } from "vue-property-decorator";
import ScreenItem from "@/components/ScreenItem.vue";
import * as screenCapturer from "@/screen-capturer";
import { ScreenItemProperty } from "@/@types/pipapp/ScreenSelect";
import { ScreenMetadata } from "@/@types/pipapp/screen-capturer";

@Component({
  components: {
    ScreenItem
  }
})
export default class ScreenSelect extends Vue {
  screenItems: ScreenItemProperty[] = [];
  alwaysOnTop = false;

  beforeMount(): void {
    this.alwaysOnTop = remote.getCurrentWindow().isAlwaysOnTop();
  }

  mounted(): void {
    setTimeout(this.refreshScreenMetadataList, 30);
  }

  getScreenDsiplayName(sm: ScreenMetadata): string {
    const scaledDisplayWidth = Math.floor(sm.display.bounds.width * sm.display.scaleFactor);
    const scaledDisplayHeight = Math.floor(sm.display.bounds.height * sm.display.scaleFactor);
    return `${sm.name} (${sm.display.isPrimary ? "Primary, " : ""}${scaledDisplayWidth} x ${scaledDisplayHeight}, ${sm.display.scaleFactor * 100}%)`;
  }

  getScreenDescription(sm: ScreenMetadata): string {
    const scaledDisplayWidth = Math.floor(sm.display.bounds.width * sm.display.scaleFactor);
    const scaledDisplayHeight = Math.floor(sm.display.bounds.height * sm.display.scaleFactor);
    const primary = sm.display.isPrimary ? "Primary, " : "";
    const resolution = `${scaledDisplayWidth} x ${scaledDisplayHeight}`; 
    const scale = `${sm.display.scaleFactor * 100}%`;
    return `${primary}${resolution}, ${scale}`;
  }

  getScreenCenterPoint(displayBounds: Electron.Rectangle, scaleFactor: number): { x: number; y: number } {
    const scaledScreenOriginPoint = remote.screen.dipToScreenPoint({ x: displayBounds.x, y: displayBounds.y });
    const scaledDisplayWidth = displayBounds.width * scaleFactor;
    const scaledDisplayHeight = displayBounds.height * scaleFactor;
    return {
      x: Math.floor((scaledDisplayWidth / 2) + scaledScreenOriginPoint.x),
      y: Math.floor((scaledDisplayHeight / 2) + scaledScreenOriginPoint.y)
    }
  }

  refreshScreenMetadataList(): void {
    screenCapturer.getScreenMetadataList(1000, 1000)
      .then((screenMetadataArray) => {
        const screenItems: ScreenItemProperty[] = [];
        for (const sm of screenMetadataArray) {
          screenItems.push({
            id: sm.id,
            name: this.getScreenDsiplayName(sm),
            description: this.getScreenDescription(sm),
            centerPoint: this.getScreenCenterPoint(sm.display.bounds, sm.display.scaleFactor),
            thumbnailDataUri: sm.thumbnailDataUri
          });
        }
        this.screenItems = screenItems;
      });
  }

  changeAlwasyOnTop(): void {
    remote.getCurrentWindow().setAlwaysOnTop(this.alwaysOnTop);
  }
}
</script>
