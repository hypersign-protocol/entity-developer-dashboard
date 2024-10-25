import Vue from 'vue';
import Vuex from 'vuex';
import playgroundStore from './playgroundStore';
import mainStore from './mainStore';
import globalStore from './globalStore';
import walletStore from './walletStore'
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        playgroundStore,
        mainStore,
        globalStore,
        walletStore
    },
    plugins: [createPersistedState()]
})

