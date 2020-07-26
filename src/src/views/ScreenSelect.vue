<template>
  <div class="screen-select-wrapper">
    <div class="functions-container">
      <el-button
        type="primary"
        icon="el-icon-refresh"
        circle
        @click="refreshScreenMetadataList"
      ></el-button>
    </div>
    <transition-group
      class="screen-list"
      name="list-item-transition"
      tag="div"
      appear
    >
      <screen-item
        v-for="screen in screenMetadataList"
        :key="screen.id"
        :screenId="screen.id"
        :screenName="screen.name"
        :thumbnailUrl="screen.thumbnailDataUrl"
      ></screen-item>
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
import { Component, Vue } from "vue-property-decorator";
import ScreenItem from "@/components/ScreenItem.vue";
import { getScreenMetadataList } from "@/screen-capturer";

@Component({
  components: {
    ScreenItem
  }
})
export default class ScreenSelect extends Vue {
  screenMetadataList: object[] = [];

  mounted() {
    setTimeout(this.refreshScreenMetadataList, 30);
  }

  refreshScreenMetadataList() {
    this.screenMetadataList = getScreenMetadataList(1000, 1000);
  }
}
</script>
