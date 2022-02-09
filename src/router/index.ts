import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Login from '../views/login/index.vue'


// const _import = (path: string) => defineAsyncComponent(() => import(`../views/${path}.vue`))

/**
 * requiredLogin: 是否需要登录后才能访问，默认是
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'login',
    component: Login,
    meta: {
      requiredLogin: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },
  
]

const routerHistory = createWebHistory()

const router = createRouter({
  history: routerHistory,
  routes: [...routes]
})

export default router
