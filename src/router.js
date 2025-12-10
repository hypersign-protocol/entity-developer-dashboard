import Vue from 'vue'
import Router from 'vue-router'
import config from './config'
import Schema from './views/playground/Schema.vue'
import CredentialStatus from './views/playground/CredentialStatus.vue'
import OnboardingStepper from './components/stepper/OnboardingStepper.vue'
import EventBus from './eventbus.js';
import store from './store'
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
const WebhookConfig = () => import('./views/playground/developer/WebhookConfig.vue')
const APIKey = () => import('./views/playground/developer/APIKey.vue')
const KYCWebpageGenerator = () => import('./views/playground/KYCWebpageGenerator.vue')
const MFA = () => import('./components/login/mfa/MFA.vue')
const SettingConfig = () => import('./views/SettingConfig.vue')
const Business = () => import('./views/playground/Business.vue')
const BusinessDetails = () => import('./views/playground/BusinessDetails.vue')
const GettingStarted = () => import('./views/GettingStarted.vue')
const ServiceConfig = () => import('./views/ServiceConfig.vue')
Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/studio',
    },
    {
      path: '/studio',
      redirect: '/studio/dashboard',
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
      path: '/studio/onboarding',
      name: 'Onboarding',
      component: OnboardingStepper
    },
    {
      path: '/studio/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/studio/getting-started/:appId',
      name: 'GettingStarted',
      component: GettingStarted,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - Getting Started`
      }
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
        requiresAuth: false,
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
      path: '/studio/service-config/:appId',
      name: 'ServiceConfig',
      component: ServiceConfig,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - Config`
      }
    },

    {
      path: '/studio/business/:appId/details/:companyId/:tab?',
      name: 'BusinessDetails',
      component: BusinessDetails,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - Business Details`
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
      path: '/studio/kyb-widget-config/:appId',
      name: 'KybWidgetConfig',
      component: () => import('./views/playground/KybWidgetConfig/Index.vue'),
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - KybWidgetConfig`
      }
    },

    {
      path: '/studio/developer/webhook/:appId',
      name: 'WebhookConfig',
      component: WebhookConfig,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - WebhookConfig`
      }
    },
    {
      path: '/studio/developer/api-key/:appId',
      name: 'APIKey',
      component: APIKey,
      meta: {
        requiresAuth: true,
        title: `${config.app.name} - API Key`
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
  const isAuthenticated = store.getters["mainStore/getIfAuthenticated"];

  if (to.matched.length < 1) {
    document.title = to.meta.title;
    next(false);
    return router.push("/404");
  }

  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }

  // console.log("BeforeEach →", {
  //   requiresAuth: to.meta.requiresAuth,
  //   isAuthenticated,
  //   check: to.meta.requiresAuth && !isAuthenticated,
  //   to: to.path
  // });

  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log("inside if to.path " + to.path);
    EventBus.$emit("logoutAll");
    if (to.path !== "/studio/login") {
      return next("/studio/login");
    } else {
      console.log('already on login page')
      return next()
    }
  }
  next();
});

export default router
