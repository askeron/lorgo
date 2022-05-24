import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PupilRooms from '../views/PupilRooms.vue'
import PupilJoin from '../views/PupilJoin.vue'
import TeacherRooms from '../views/TeacherRooms.vue'
import TeacherCreate from '../views/TeacherCreate.vue'
import TeacherRoom from '../views/TeacherRoom.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'pupilRooms',
      component: PupilRooms
    },
    {
      path: '/join',
      name: 'pupilJoin',
      component: PupilJoin
    },
    {
      path: '/teacher',
      name: 'teacherRooms',
      component: TeacherRooms
    },
    {
      path: '/teacher/create',
      name: 'teacherCreate',
      component: TeacherCreate
    },
    {
      path: '/teacher/room/:roomId',
      name: 'teacherRoom',
      component: TeacherRoom
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
