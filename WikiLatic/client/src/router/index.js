import Vue from 'vue'
import Router from 'vue-router'
import landing from '@/components/landing'
import overall from '@/components/overall'
import author from '@/components/author'
import individual from '@/components/individual'


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
    },
    {
      path: '/analytics/author',
      name: 'author',
      component: author
    },
    {
      path: '/analytics/individual',
      name: 'individual',
      component: individual
    }
  ]
})
