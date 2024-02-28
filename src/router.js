import Vue from 'vue'
import Router from 'vue-router'
import fetch from 'node-fetch'
import config from './config'
import store from './store'

import PKIIdLogin from './views/PKIIdLogin.vue'
import Home from './views/Home.vue'
import MainDashboard from './views/Dashboard.vue'
import Credential from './views/playground/Credential.vue'
import CredentialDetails from './views/playground/CredentialDetails.vue'

Vue.use(Router)

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
      path: '/home',
      redirect: '/studio/home'
    },
    {
      path: '/studio/home',
      name: 'Home',
      component: Home
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
      path: '/studio/credential/:appId',
      name: 'playgroundCredential',
      component: Credential,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - Credential`
      }
    },
    {
      path: '/studio/credential/:appId/:sessionId',
      name: 'sessionDetails',
      component: CredentialDetails,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - Session Details`
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
      const url = `${config.studioServer.BASE_URL}api/v1/auth`
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
