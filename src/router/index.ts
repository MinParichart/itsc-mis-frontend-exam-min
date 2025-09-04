import { createRouter, createWebHistory } from "vue-router";

const BlogsView = () => import("@/views/BlogsView.vue");
const BlogsCreateView = () => import("@/views/BlogsCreateView.vue");
const BlogsUpdateView = () => import("@/views/BlogsUpdateView.vue"); // << add

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/blogs" },

    // list
    { path: "/blogs", name: "blogs", component: BlogsView },

    // create (วางก่อน :id)
    { path: "/blogs/create", name: "blogs-create", component: BlogsCreateView },

    // วางก่อน /blogs/:id เสมอ
    {
      path: "/blogs/:id/update",
      name: "blogs-update",
      component: BlogsUpdateView,
    },

    // by id (บังคับเลขเท่านั้น กันชนกับ 'create')
    { path: "/blogs/:id(\\d+)", name: "blogs_id", component: BlogsView },

    // จับ ทุก URL ที่ไม่ตรงกับเส้นทางอื่น แล้ว เปลี่ยนเส้นทาง (redirect) ไปที่ /blogs
    { path: "/:pathMatch(.*)*", redirect: "/blogs" },
  ],
});

export default router;
