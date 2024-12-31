<template>
  <div class="screen-select-wrapper">
    <el-container class="container">
      <el-header style="padding: 1rem; height: auto;">
        <div class="function-area">
          <div class="function-area-item">
            <el-switch v-model="alwaysOnTop" active-text="Always on top" @change="changeAlwasyOnTop"></el-switch>
          </div>
          <div class="function-area-item">
            <el-button type="primary" circle icon="el-icon-refresh" @click="refreshScreenSpecList"></el-button>
          </div>
        </div>
      </el-header>
      <el-main style="padding: 1rem;">
        <transition-group name="list-item-transition" appear tag="div" class="screen-list">
          <screen-item v-for="screenItem in screenItems"
            :key="screenItem.id"
            :screenId="screenItem.id"
            :screenName="screenItem.name"
            :thumbnailUrl="screenItem.thumbnailDataUri"
            :screenBounds="screenItem.bounds"
            :screenScaleFactor="screenItem.scaleFactor"
            :isPrimaryScreen="screenItem.isPrimary"
            :scaledScreenOriginPoint="screenItem.scaledScreenOriginPoint"></screen-item>
        </transition-group>
      </el-main>
    </el-container>
  </div>
</template>

<style>
.screen-select-wrapper {
  height: 100%;
}

.screen-select-wrapper .container {
  height: 100%;
}

.screen-select-wrapper .function-area {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.screen-select-wrapper .function-area-item {
  margin-left: 2rem;
}

.screen-select-wrapper .function-area-item .el-switch__label {
  color: #cccccc;
}

.screen-select-wrapper .screen-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
}

.screen-select-wrapper .list-item-transition-enter-active,
.screen-select-wrapper .list-item-transition-leave-active {
  transition: opacity 0.2s;
}

.screen-select-wrapper .list-item-transition-enter,
.screen-select-wrapper .list-item-transition-leave-to {
  opacity: 0;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ScreenItem from "@/components/ScreenItem.vue";
import { ScreenItemProperty, ScreenSpec } from "@/types/app";

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
    setTimeout(this.refreshScreenSpecList, 30);
  }

  refreshScreenSpecList(): void {
    window.exposedApi.getAllScreenSpec(1000, 1000)
      .then((screenSpecs: ScreenSpec[]) => {
        const screenItems: ScreenItemProperty[] = [];
        for (const screenSpec of screenSpecs) {
          screenItems.push({
            id: screenSpec.id,
            name: screenSpec.name,
            thumbnailDataUri: screenSpec.thumbnailDataUri,
            bounds: screenSpec.display.bounds,
            scaleFactor: screenSpec.display.scaleFactor,
            isPrimary: screenSpec.display.isPrimary,
            scaledScreenOriginPoint: screenSpec.display.scaledScreenOriginPoint,
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
