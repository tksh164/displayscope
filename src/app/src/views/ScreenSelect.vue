<template>
  <div class="screen-select-wrapper">
    <div class="functions-container">
      <div class="function-item">
        <el-switch v-model="alwaysOnTop"
          active-text="Always on top"
          @change="changeAlwasyOnTop"></el-switch>
      </div>
      <div class="function-item">
        <el-button type="primary"
          icon="el-icon-refresh"
          circle
          @click="refreshScreenMetadataList"
          class="function-item"></el-button>
      </div>
    </div>
    <transition-group class="screen-list"
      name="list-item-transition"
      tag="div"
      appear>
      <screen-item v-for="screenItem in screenItems"
        :key="screenItem.id"
        :screenId="screenItem.id"
        :centerPoint="screenItem.centerPoint"
        :screenName="screenItem.name"
        :thumbnailUrl="screenItem.thumbnailDataUri"></screen-item>
    </transition-group>
  </div>
</template>

<style>
.screen-select-wrapper {
  width: 100%;
  height: 100%;
}

.functions-container {
  position: absolute;
  right: 0;
  padding: 1vw;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.function-item {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  margin-left: 2vw;
}

.function-item .el-switch__label {
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
