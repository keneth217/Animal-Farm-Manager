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
      path: "/update/:id",
      name: "UpdateCourse",
      component: () => import("../views/Admin/UpdateCourse.vue"),
    },
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/Users/AboutView.vue"),
    },
    {
      path: "/animals",
      name: "AnimalsView",
      component: () => import("../views/Users/AnimalsView.vue"),
    },
    {
      path: "/blog/:id",
      name: "BlogList",
      component: () => import("../views/Admin/BlogList.vue"),
    },
   
    {
      path: "/contacts",
      name: "ContactUs",
      component: () => import("../views/Users/ContactUs.vue"),
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
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/Users/NotFound.vue"),
    },
   

    {
      path: "/my/:id/:title",
      name: "SingleCourse",
      component: () => import("../views/Users/SingleCourse.vue"),
    },
    {
      path: "/animals",
      name: "AnimalsView",
      component: () => import("../views/Users/AnimalsView.vue"),
    },
    {
      path: "/blog/:id",
      name: "BlogDetails",
      component: () => import("../views/Users/BlogDetails.vue"),
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
          name: "NewCourse",
          component: () => import("../views/Admin/NewCourse.vue"),
        },
        {
          path: "update/:id",
          name: "UpdateCourse",
          component: () => import("../views/Admin/UpdateCourse.vue"),
        },
        {
          path: "new",
          name: "NewMessage",
          component: () => import("../views/Admin/NewMessage.vue"),
        },
        {
          path: "single/:id",
          name: "SingleArticle",
          component: () => import("../views/Admin/SingleArticle.vue"),
        },
        {
          path: "courses",
          name: "coursesView",
          component: () => import("../views/Admin/coursesView.vue"),
        },
        {
          path: "blog",
          name: "NewBlog",
          component: () => import("../views/Admin/NewBLog.vue"),
        },
        {
          path: "blogs",
          name: "AdminBlogs",
          component: () => import("../views/Admin/AdminBlogs.vue"),
        },
        {
          path: "blogs/:id",
          name: "BlogList",
          component: () => import("../views/Admin/BlogList.vue"),
        },
        {
          path: "blogs/update/:id",
          name: "UpdateBlog",
          component: () => import("../views/Admin/UpdateBlog.vue"),
        },
        {
          path: "topics/add/:id",
          name: "SubTopic",
          component: () => import("../views/Admin/SubTopic.vue"),
        },
        {
          path: "topic/add/:id",
          name: "CourseSubTopic",
          component: () => import("../views/Admin/CourseSubTopic.vue"),
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
