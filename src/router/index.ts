import { createRouter, createWebHistory } from "vue-router";

const BlogsView = () => import("@/views/BlogsView.vue");
const BlogsCreateView = () => import("@/views/BlogsCreateView.vue");
const BlogsUpdateView = () => import("@/views/BlogsUpdateView.vue"); 
const LoginView = () => import("@/views/LoginView.vue"); 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/blogs" },

    // login (ไม่ต้อง requiresAuth)
    { path: "/login", name: "login", component: LoginView},

    // ใส่ meta.requiresAuth ให้ทุกหน้าบล็อก 
    { path: "/blogs", name: "blogs", component: BlogsView, meta: { requiresAuth: true } },
    { path: "/blogs/create", name: "blogs-create", component: BlogsCreateView, meta: { requiresAuth: true } },
    { path: "/blogs/:id/update", name: "blogs-update", component: BlogsUpdateView, meta: { requiresAuth: true } },
    { path: "/blogs/:id(\\d+)", name: "blogs_id", component: BlogsView, meta: { requiresAuth: true } },

    { path: "/:pathMatch(.*)*", redirect: "/blogs" },
  ],
});

// guard
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.path === '/login' && token) {
    return { path: '/blogs' }
  }
})

export default router;
