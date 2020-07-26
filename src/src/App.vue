<template>
  <div id="app">
    <transition name="view-transition" appear>
      <router-view />
    </transition>
  </div>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
}

.view-transition-enter-active,
.view-transition-leave-active {
  transition: opacity 0.2s;
}
.view-transition-enter, .view-transition-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
