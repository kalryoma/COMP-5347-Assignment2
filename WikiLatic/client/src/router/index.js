import Vue from 'vue'
import Router from 'vue-router'
import landing from '@/components/landing'
import register from '@/components/register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing',
      component: landing
    },
    {
      path: '/register',
      name: 'register',
      component: register
    }
  ]
})
