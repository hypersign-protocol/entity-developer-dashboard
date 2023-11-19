import Vue from 'vue'
import Router from 'vue-router'
import fetch from 'node-fetch'
import config from './config'
import store from './store'

import PKIIdLogin from './views/PKIIdLogin.vue'

import MainDashboard from './views/Dashboard.vue'

import Credential from './views/playground/Credential.vue'
import Presentation from './views/playground/Presentation.vue'
import Dashboard from './views/playground/Dashboard.vue'
import Schema from './views/playground/Schema.vue'
import Org from './views/playground/Org.vue'
import VerifyPresentation from './views/playground/VerifyPresentation.vue'

Vue.use(Router)

console.log(config.app)

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/studio',
      requiresAuth: true,
    },
    {
      path: '/studio',
      redirect: '/studio/dashboard',
      requiresAuth: true
    },
    {
      path: '/login',
      redirect: '/studio/login'
    },
    {
      path: '/studio/login',
      name: 'PKIIdLogin',
      component: PKIIdLogin
    },
    {
      path: '/studio/dashboard',
      name: 'dashboard',
      component: MainDashboard,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - Dashboard`
      }
    },
    {
      path: "/404",
      name: "PageNotFound",

      component: () =>
        import('./views/404.vue'),
      meta: {
        title: `${config.app.name} - 404`
      }
    },
  ]
})
function guardRouteIfOrgNotSelected(to, from, next) {
  let isOrgSelected = false;
  if (localStorage.getItem('selectedOrg'))
    isOrgSelected = true;
  else
    isOrgSelected = false; if (isOrgSelected) {
      next();
    }
  else {
    next({ name: 'dashboard' });
  }
}

router.beforeEach((to, from, next) => {
  if (to.matched.length < 1) {
    document.title = to.meta.title;
    next(false)
    return router.push('/404')
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    document.title = to.meta.title
    const authToken = localStorage.getItem('authToken')
    if (authToken) {
      const url = `${config.studioServer.BASE_URL}api/v2/protected`
      fetch(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        method: "POST",
      }).then(res => res.json())
        .then(json => {
          if (json.status == 403) {
            next({
              path: '/studio/login',
              params: { nextUrl: to.fullPath }
            })
          } else {
            localStorage.setItem("user", JSON.stringify(json.message));
            store.commit('playgroundStore/addUserDetailsToProfile', json.message)
            next()
          }
        })
        .catch((e) => {
          console.log(e);
          store.commit('mainStore/setMainSideNavBar', false)
          next({
            path: '/studio/login',
            params: { nextUrl: to.fullPath }
          })
        })
    } else {
      next({
        path: '/studio/login',
        params: { nextUrl: to.fullPath }
      })
    }
  } else {
    next()
  }
})
export default router
