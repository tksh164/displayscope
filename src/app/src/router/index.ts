import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import ScreenSelect from "@/views/ScreenSelect.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "ScreenSelect",
    component: ScreenSelect
  },
  {
    path: "/screenview",
    name: "ScreenView",
    component: () =>
      import(/* webpackChunkName: "screenview" */ "@/views/ScreenView.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
