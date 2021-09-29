import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
// import SellerPage from '@/views/SellerPage'
// import TrendPage from '@/views/TrendPage'
// import MapPage from '@/views/MapPage'
// import RankPage from '@/views/RankPage'
// import HotPage from '@/views/HotPage'
// import StockPage from '@/views/StockPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/seller',
    component: () => import('@/views/seller/index.vue')
  },
  {
    path: '/trend',
    component: () => import('@/views/trend/index.vue')
  },
  {
    path: '/map',
    component: () => import('@/views/map/index.vue')
  },
  {
    path: '/rank',
    component: () => import('@/views/rank/index.vue')
  },
  {
    path: '/hot',
    component: () => import('@/views/hot/index.vue')
  },
  {
    path: '/stock',
    component: () => import('@/views/stock/index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
