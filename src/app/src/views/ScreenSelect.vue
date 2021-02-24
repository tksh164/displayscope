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
import { Component, Vue } from "vue-property-decorator";
import ScreenItem from "@/components/ScreenItem.vue";
import { ScreenItemProperty, ScreenMetadata } from "@/types/app";

@Component({
  components: {
    ScreenItem
  }
})
export default class ScreenSelect extends Vue {
  screenItems: ScreenItemProperty[] = [];
  alwaysOnTop = false;

  async beforeMount(): Promise<void> {
    this.alwaysOnTop = await window.exposedApi.getCurrentAlwaysOnTopSetting();
  }

  mounted(): void {
    window.exposedApi.addAlwaysOnTopChangedByMenuItemListener((newAlwaysOnTopSetting: boolean) => {
      this.alwaysOnTop = newAlwaysOnTopSetting;
    });
    setTimeout(this.refreshScreenMetadataList, 30);
  }

  getScreenDescription(sm: ScreenMetadata): string {
    const scaledDisplayWidth = Math.floor(sm.display.bounds.width * sm.display.scaleFactor);
    const scaledDisplayHeight = Math.floor(sm.display.bounds.height * sm.display.scaleFactor);
    const primary = sm.display.isPrimary ? "Primary, " : "";
    const resolution = `${scaledDisplayWidth} x ${scaledDisplayHeight}`; 
    const scale = `${sm.display.scaleFactor * 100}%`;
    return `${primary}${resolution}, ${scale}`;
  }

  refreshScreenMetadataList(): void {
    window.exposedApi.getAllScreenMetadata(1000, 1000)
      .then((screenMetadataArray: ScreenMetadata[]) => {
        const screenItems: ScreenItemProperty[] = [];
        for (const sm of screenMetadataArray) {
          screenItems.push({
            id: sm.id,
            name: sm.name,
            description: this.getScreenDescription(sm),
            centerPoint: sm.centerPoint,
            thumbnailDataUri: sm.thumbnailDataUri
          });
        }
        this.screenItems = screenItems;
      });
  }

  changeAlwasyOnTop(): void {
    window.exposedApi.setAlwaysOnTopSetting(this.alwaysOnTop);
  }
}
</script>
