import Vue from 'vue'
import Router from 'vue-router'
import fetch from 'node-fetch'
import config from './config'
import store from './store'
import Schema from './views/playground/Schema.vue'
import CredentialStatus from './views/playground/CredentialStatus.vue'
const Home = () => import('./views/Home.vue');
const PKIIdLogin = () => import('./views/PKIIdLogin.vue')
const MainDashboard = () => import('./views/Dashboard.vue')
const Credential = () => import('./views/playground/Sessions.vue')
const CredentialDetails = () => import('./views/playground/SessionsDetails.vue')
const DIDs = () => import('./views/playground/DID.vue')
const SSIDashboardCredit = () => import('./views/playground/SSIDashboardCredit.vue')
const SSIDashboardUsage = () => import('./views/playground/SSIDashboardUsages.vue')
const KYCCreditDashboard = () => import('./views/playground/KYCDashboardCredit.vue')
const UsageS = () => import('./views/playground/Usage.vue')
const OnChainKycSystems = () => import('./views/playground/OnChainKycSystems.vue')
const WidgetConfig = () => import('./views/playground/WidgetConfig/Index.vue')
const WebhookConfig = () => import('./views/playground/WebhookConfig.vue')
const KYCWebpageGenerator = () => import('./views/playground/KYCWebpageGenerator.vue')
const MFA = () => import('./components/login/mfa/MFA.vue')
const SettingConfig = () => import('./views/SettingConfig.vue')
const Business=() => import('./views/playground/Business.vue')
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
      path: '/studio/mfa',
      name: 'MFAPage',
      component: MFA,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - MFA`
      }
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
      path: '/studio/settings',
      name: 'SettingConfig',
      component: SettingConfig,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - Settings`
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
      path: '/studio/business/:appId',
      name: 'Business',
      component: Business,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - Business`
      }
    },
    {
      path: '/studio/ssi/did/:appId',
      name: 'DIDs',
      component: DIDs,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - DIDs`
      }
    },
    {
      path: '/studio/ssi/schema/:appId',
      name: 'Schemas',
      component: Schema,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - Schema`
      }
    },
    {
      path: '/studio/ssi/credential/:appId',
      name: 'Credential',
      component: CredentialStatus,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - Credential`
      }
    },
    {
      path: '/studio/ssi/credit/:appId',
      name: 'Credit',
      component: SSIDashboardCredit,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - SSI Credit`
      }
    },
    {
      path: '/studio/ssi/usage/:appId',
      name: 'Usage',
      component: SSIDashboardUsage,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - Usages`
      }
    },
    {
      path: '/studio/onchainkyc/credit/:appId',
      name: 'KYCCredit',
      component: KYCCreditDashboard,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - KYC Credit`
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
      path: '/studio/onchainkyc/:appId',
      name: 'OnChainKycSystems',
      component: OnChainKycSystems,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - OnChainKycSystems`
      }
    },
    {
      path: '/studio/widget-config/:appId',
      name: 'WidgetConfig',
      component: WidgetConfig,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - WidgetConfig`
      }
    },

    {
      path: '/studio/webhook-config/:appId',
      name: 'WebhookConfig',
      component: WebhookConfig,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - WebhookConfig`
      }
    },
    {
      path: '/studio/kyc-webpage-generator/:appId',
      name: 'KYCWebpageGenerator',
      component: KYCWebpageGenerator,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - KYC Verifier Configuration`
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
    document.title = to.meta.title;
    try {
      const response = await fetch(`${config.studioServer.BASE_URL}api/v1/auth`, {
        method: "POST",
        credentials: "include",
      });
      const json = await response.json();
      if (json.statusCode === 401 || json.statusCode === 403) {
        throw new Error(json.error);
      } else if (json.status === 200) {
        localStorage.setItem("user", JSON.stringify(json.message));
        store.commit('playgroundStore/addUserDetailsToProfile', json.message)
        next()
      }
    } catch (e) {
      try {
        const refreshResponse = await fetch(`${config.studioServer.BASE_URL}api/v1/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (!refreshResponse.ok) {
          throw new Error('Refresh failed');
        }
        const authResponse = await fetch(`${config.studioServer.BASE_URL}api/v1/auth`, {
          method: "POST",
          credentials: "include",
        });
        if (authResponse.ok) {
          const user = await authResponse.json();
          localStorage.setItem("user", JSON.stringify(user.message));
          store.commit('playgroundStore/addUserDetailsToProfile', user.message);
          next();
        } else {
          throw new Error('Refresh token invalid');
        }
      } catch (refreshError) {
        store.commit('mainStore/setMainSideNavBar', false);
        next({ path: '/studio/login', query: { redirect: to.fullPath } });
      }
    }
  } else {
    if (to.path === '/studio/login') {
      store.commit('mainStore/setIsLoggedOut', false)
    }
    next()
  }
})
export default router
