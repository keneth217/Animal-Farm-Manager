<template>
  <div class="container-flud content">
    <NavBar />
    <div class="">
      <router-view v-slot="{ Component }">
        <transition name="slide" mode="out-in">
          <component :is="Component"></component>
        </transition>

      </router-view>
    </div>
    <FooterComp />
  </div>
</template>

<script>

import NavBar from './components/NavBar.vue'
import FooterComp from './components/FooterComp.vue'


export default {
  components: {
    NavBar, FooterComp
  },
  setup() {

  }
};
</script>


<style>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'poppins', sans-serif;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.1s, transform 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
</style>

