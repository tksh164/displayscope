<template>
  <div class="screen-select-wrapper">
    <div class="functions-container">
      <el-button type="primary"
                 icon="el-icon-refresh"
                 circle
                 @click="refreshScreenMetadataList"></el-button>
    </div>
    <transition-group class="screen-list"
                      name="list-item-transition"
                      tag="div"
                      appear>
      <screen-item v-for="screen in screens"
                   :key="screen.id"
                   :screenId="screen.id"
                   :centerPoint="screen.centerPoint"
                   :screenName="screen.name"
                   :thumbnailUrl="screen.thumbnailDataUrl"></screen-item>
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
import { getScreenMetadataList } from "@/screen-capturer";
import { ScreenItemData } from "@/@types/pipapp/ScreenSelect";

@Component({
  components: {
    ScreenItem
  }
})
export default class ScreenSelect extends Vue {
  screens: ScreenItemData[] = [];

  mounted(): void {
    setTimeout(this.refreshScreenMetadataList, 30);
  }

  refreshScreenMetadataList(): void {
    getScreenMetadataList(1000, 1000)
      .then((screenMetadataArray) => {
        const screens: ScreenItemData[] = [];
        for (const sm of screenMetadataArray) {
          const scaledDisplayWidth = Math.floor(sm.display.bounds.width * sm.display.scaleFactor);
          const scaledDisplayHeight = Math.floor(sm.display.bounds.height * sm.display.scaleFactor);
          const scaledScreenOriginPoint = remote.screen.dipToScreenPoint({ x: sm.display.bounds.x, y: sm.display.bounds.y })
          const centerPosX = Math.floor(((scaledDisplayWidth) / 2) + scaledScreenOriginPoint.x);
          const centerPosY = Math.floor(((scaledDisplayHeight) / 2) + scaledScreenOriginPoint.y);
          screens.push({
            id: sm.id,
            name: sm.name + " (" + (sm.display.isPrimary ? "Primary, " : "") + scaledDisplayWidth + " x " + scaledDisplayHeight + ", " + (sm.display.scaleFactor * 100) + "%)",
            centerPoint: {
              x: centerPosX,
              y: centerPosY
            },
            thumbnailDataUrl: sm.thumbnailDataUrl
          });
        }
        this.screens = screens;
      });
  }
}
</script>
