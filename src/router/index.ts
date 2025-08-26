import { createRouter, createWebHistory } from "vue-router"

const BlogsView        = () => import("@/views/BlogsView.vue")
const BlogsCreateView  = () => import("@/views/BlogsCreateView.vue")

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/blogs" },

    // list
    { path: "/blogs", name: "blogs", component: BlogsView },

    // create (วางก่อน :id)
    { path: "/blogs/create", name: "blogs-create", component: BlogsCreateView },

    // by id (บังคับเลขเท่านั้น กันชนกับ 'create')
    { path: "/blogs/:id(\\d+)", name: "blogs_id", component: BlogsView },

    { path: "/:pathMatch(.*)*", redirect: "/blogs" },
  ],
})

export default router
