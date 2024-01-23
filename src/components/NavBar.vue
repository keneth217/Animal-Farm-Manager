<template>
  <nav class="navbar navbar-expand-lg fixed-top navbar-light bg-light" v-if="showNavbar">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/"><i class="bi bi-diamond-fill me-2 text-warning"></i>FARM</router-link>
      <button class="navbar-toggler  border-warning text-warning" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarScroll">
        <ul class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll text-uppercase" style="--bs-scroll-height: 100px;">
          <li class="nav-item" v-for="item in visibleNavItems" :key="item.route">
            <router-link class="nav-link active" aria-current="page" :to="item.route">{{ item.link }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import { computed } from 'vue';
import { useAuthStore } from '../stores/authStore';

export default {
  setup() {
    const authStore = useAuthStore();

    // Check if the user is logged in
    const isLoggedIn = computed(() => authStore.user !== null);

    // Navigation items that should be visible when there is no user
    const visibleNavItems = [
      { route: '/', link: 'home' },
      { route: '/animals', link: 'animals' },
      // { route: '/blog', link: 'blog' },
      // { route: '/articles', link: 'Courses' },
      { route: '/contacts', link: 'contacts' },
      { route: '/auth/login', link: 'Login' }
    ];

    // Combine navigation items based on user login status
    const showNavbar = computed(() => !isLoggedIn.value);

    return {
      visibleNavItems,
      showNavbar
    };
  }
}
</script>

<style scoped>
.navbar-nav {
  box-shadow: red;
}

.navbar-nav .nav-link {
  font-weight: 500;
}

.navbar-nav .nav-link.active {
  color: rgb(20, 20, 20);
}
</style>
