import { createRouter, createWebHistory } from 'vue-router'
// import { deactivateTabs } from '@/composables/global/useChromeTabs'
import Main from '../views/Main.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:room_id?/:channel_id?',
      name: 'Room',
      component: Main,
    },
  ]
})


export default router
