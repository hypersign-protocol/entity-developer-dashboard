import Vue from 'vue'
import Router from 'vue-router'
import fetch from 'node-fetch'
import config from './config'
import store from './store'

import PKIIdLogin from './views/PKIIdLogin.vue'
import Home from './views/Home.vue'
import MainDashboard from './views/Dashboard.vue'
import Credential from './views/playground/Sessions.vue'
import CredentialDetails from './views/playground/SessionsDetails.vue'
import DIDs from './views/playground/DID.vue'
import UsageS from './views/playground/Usage.vue';
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
      path: '/studio/sessions/:appId',
      name: 'playgroundCredential',
      component: Credential,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - Sessions`
      }
    },
    {
      path: '/studio/did/:appId',
      name: 'DIDs',
      component: DIDs,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - DIDs`
      }
    },
    {
      path: '/studio/usage/:appId',
      name: 'UsageS',
      component: UsageS,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - Usages`
      }
    },
    {
      path: '/studio/sessions/:appId/:sessionId',
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

router.beforeEach(async (to, from, next) => {
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
      try {

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          method: "POST",
        })


        const json = await response.json()
        console.log(json)
        if (json.statusCode == 403 || json.statusCode == 401) {
          console.log('Unauthenticated....')
          throw new Error(json.error)
        } else if (json.status === 200) {
          localStorage.setItem("user", JSON.stringify(json.message));
          store.commit('playgroundStore/addUserDetailsToProfile', json.message)
          next()
        }

      } catch (e) {
        console.log(e)
        store.commit('mainStore/setMainSideNavBar', false)
        next({
          path: '/studio/login',
          params: { nextUrl: to.fullPath }
        })

      }

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
