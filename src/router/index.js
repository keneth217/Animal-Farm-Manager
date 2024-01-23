import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Users/HomeView.vue";
import { useAuthStore } from "../stores/authStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/animals",
      name: "AnimalsView",
      component: () => import("../views/Users/AnimalsView.vue"),
    },
   
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
   
    {
      path: "/animals",
      name: "AnimalsView",
      component: () => import("../views/Users/AnimalsView.vue"),
    },
    {
      path: "/auth/login",
      name: "AuthLogin",
      component: () => import("../auth/AuthLogin.vue"),
    },
    
    {
      path: "/auth/register",
      name: "AuthRegister",
      component: () => import("../auth/AuthRegister.vue"),
    },
    {
      path: "/contacts",
      name: "ContactUs",
      component: () => import("../views/Users/ContactUs.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/Users/NotFound.vue"),
    },
  
    {
      path: "/animal/:id/:owner",
      name: "SingleAnimal",
      component: () => import("../views/Users/SingleAnimal.vue"),
    },
    {
      path: "/animals",
      name: "AnimalsView",
      component: () => import("../views/Users/AnimalsView.vue"),
    },
   
    //admin
    {
      path: "/dashboard",
      name: "DashBoard",
      component: () => import("../views/Admin/DashBoard.vue"),
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "",
          name: "DashBoard",
          component: () => import("../views/Admin/DashBoardDetails.vue"),
        },
        {
          path: "add",
          name: "NewAnimal",
          component: () => import("../views/Admin/NewAnimal.vue"),
        },
        {
          path: "update/:id",
          name: "UpdateAnimal",
          component: () => import("../views/Admin/UpdateAnimal.vue"),
        },
        {
          path: "new",
          name: "NewMessage",
          component: () => import("../views/Admin/NewMessage.vue"),
        },
        {
          path: "animals",
          name: "animalsView",
          component: () => import("../views/Admin/animalsView.vue"),
        },
        {
          path: "single/:id",
          name: "SingleAnimal",
          component: () => import("../views/Admin/SingleAnimal.vue"),
        },
        
      ],
    },
  ],
});
// Use Vue Router beforeEach guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem("token");

  if (token) {
    // Token is available, user is authenticated
    if (to.path === "/auth/login" || to.path === "/") {
      next("/dashboard");
    } else {
      next();
    }
  } else {
    // Token is not available, user is not authenticated
    if (to.meta.requiresAuth) {
      next("/");
    } else {
      next();
    }
  }
});

// // Use Vue Router beforeEach guard
// router.beforeEach(async (to, from, next) => {
//   const authStore = useAuthStore();
//   // await fetchUser({ commit: store.commit });

//   const user = authStore.user;

//   if (user) {
//     // User is authenticated, allow navigation
//     if (to.path === "/auth/login" || to.path === "/") {
//       next("/dashboard");
//     } else {
//       next();
//     }
//   } else {
//     // User is not authenticated
//     if (to.meta.requiresAuth) {
//       next("/");
//     } else {
//       next();
//     }
//   }
// });

export default router;
