import { createRouter, createWebHistory } from "vue-router";

// views
const BlogsView = () => import("@/views/BlogsView.vue");
const BlogsCreateView  = () => import("@/views/BlogsCreateView.vue")

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/blogs" },

    // list
    { path: "/blogs", name: "blogs", component: BlogsView }, // << เอา meta ออก

    // ✅ วาง create ก่อนเสมอ    
     { path: "/blogs/create", name: "blogs-create", component: BlogsCreateView },


    // ✅ บังคับ :id เป็นตัวเลขเท่านั้น เพื่อไม่ชนกับ 'create'
    { path: "/blogs/:id", name: "blogs_id", component: BlogsView },

    { path: "/:pathMatch(.*)*", redirect: "/blogs" },
  ],
});

// ปิด guard ชั่วคราว
// router.beforeEach(() => {})
export default router;
