import Vue from 'vue'
import Router from 'vue-router'
import landing from '@/components/landing'
import overall from '@/components/overall'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing',
      component: landing
    },
    {
      path: '/analytics/overall',
      name: 'overall',
      component: overall
    }
  ]
})
