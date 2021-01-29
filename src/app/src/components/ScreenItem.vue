<template>
  <div class="screen-list-item" @click="moveToScreenView">
    <div class="screen-name">{{ screenName }}</div>
    <div class="screen-description">{{ screenDescription }}</div>
    <el-image class="screen-thumbnail" :src="thumbnailUrl" fit="contain"></el-image>
  </div>
</template>

<style>
.screen-list-item {
  margin: 2%;
  padding: 0.6vw 0.8vw 0.6vw 0.8vw;
  border: solid 1px transparent;
  border-radius: 4px;
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
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ScreenItem extends Vue {
  @Prop({ default: "" })
  screenId!: string;

  @Prop({ default: "-" })
  screenName!: string;

  @Prop({ default: "" })
  screenDescription!: string;

  @Prop({ default: () => { return { x: 0, y: 0 }; } })
  centerPoint!: { x: number; y: number; };

  @Prop({ default: "" })
  thumbnailUrl!: string;

  moveToScreenView() {
    this.$router.push({
      name: "ScreenView",
      params: {
        screenId: this.screenId
      },
      query: {
        centerX: this.centerPoint.x.toString(),
        centerY: this.centerPoint.y.toString()
      }
    });
  }
}
</script>
