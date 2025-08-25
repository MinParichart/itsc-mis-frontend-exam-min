import { createRouter, createWebHistory } from "vue-router"

// views
const BlogsView = () => import("@/views/BlogsView.vue")
const BlogsCreateView = () => import("@/views/BlogsCreateView.vue")
// const LoginView = () => import("@/views/LoginView.vue")

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/blogs" },

    // หน้าเข้าสู่ระบบ (ไม่ต้อง requireAuth)
    // { path: "/login", name: "login", component: LoginView },

    // ตัวอย่างหน้า Blogs (ต้องการ auth)
    { path: "/blogs", name: "blogs", component: BlogsView, meta: { requiresAuth: true } },

     // path สร้างบทความใหม่
    { path: "/blogs/create", name: "blogs-create", component:BlogsView, meta : { requiresAuth : true} },


    // 404
    { path: "/:pathMatch(.*)*", redirect: "/blogs" },
  ],
})

// Simple auth guard
router.beforeEach((to) => {
  const token = localStorage.getItem("token")

  // ถ้าไปหน้าอื่นที่ requireAuth แต่ไม่มี token → เด้งไป login
  if (to.meta.requiresAuth && !token) {
    return { path: "/login", query: { redirect: to.fullPath } }
  }

  // ถ้าไปหน้า login แต่มี token อยู่แล้ว → กลับไป blogs
  if (to.path === "/login" && token) {
    return { path: "/blogs" }
  }
})

export default router
