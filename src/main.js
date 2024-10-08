import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import Notifications from 'vue-notification'
import config from './config'
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "@mdi/font/css/materialdesignicons.css";
import "@mdi/light-font/css/materialdesignicons-light.css";
import './assets/css/gblStyle.css';
import store from './store';
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import Loading from "vue-loading-overlay";
import HfButtons from './components/element/HfButtons.vue'
import HFUpgradePlan from './components/element/UpgradePlan.vue'
import HFComingSoon from './components/element/FeatureCommingSoon.vue'
Vue.config.productionTip = false
Vue.use(VueSidebarMenu);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(Notifications)
Vue.config.devtools = true;
Vue.prototype.$config = config
Vue.component("multiSelect", Multiselect);
Vue.component("load-ing", Loading);
Vue.component("hf-buttons", HfButtons);
Vue.component("hf-upgrade-plan", HFUpgradePlan)
Vue.component("hf-feature-soon", HFComingSoon)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
