import Vue from 'vue';
import Vuex from 'vuex';
import UtilsMixin from '../mixins/utils.js'
import config from '../config'
const { DashboardTypes }  = config;
Vue.use(Vuex)

const globalStore = {
    namespaced: true,
    mixin: [UtilsMixin],
    state: {
        selectedDashboard: '',
        authToken: '' // not being used for time being, but we should  use it.
    },
    getters: {
        getAppByAppId: (state) => (appId) =>{
            console.log(appId);
            return state.appList.find(x => x.appId === appId);
        },
    },
    mutations: {
        setSelectedDashboard: (state, payload) => {
            switch(payload){
                case DashboardTypes.DeveloperDashboard: break;
                case DashboardTypes.SSIPlayground: break;
                default:  throw new Error(`Dashboard type is not supported`)
            }
            state.selectedDashboard = payload;
        },
    },
    actions: {

    }
}

export default globalStore;
