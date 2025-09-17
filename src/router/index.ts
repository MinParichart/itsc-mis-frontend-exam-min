// ✅ ใช้ import type ให้ TS ลบทิ้งตอนรันจริง
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const BlogsView = () => import('@/views/BlogsView.vue')
const BlogsCreateView = () => import('@/views/BlogsCreateView.vue')
const BlogsUpdateView = () => import('@/views/BlogsUpdateView.vue')
const BlogsDetailView = () => import('@/views/BlogsDetailView.vue')
const LoginView = () => import('@/views/LoginView.vue')

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/blogs' },
  { path: '/login', name: 'login', component: LoginView },

  { path: '/blogs', name: 'blogs', component: BlogsView, meta: { requiresAuth: true } },
  { path: '/blogs/create', name: 'blogs-create', component: BlogsCreateView, meta: { requiresAuth: true } },
  { path: '/blogs/:id/edit', name: 'blogs-update', component: BlogsUpdateView, meta: { requiresAuth: true } },
  { path: '/blogs/:id', name: 'blogs_id', component: BlogsDetailView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) return { path: '/login', query: { redirect: to.fullPath } }
  if (to.path === '/login' && token) return { path: '/blogs' }
})

export default router
