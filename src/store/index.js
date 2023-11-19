import Vue from 'vue';
import Vuex from 'vuex';
import playgroundStore from './playgroundStore';
import mainStore from './mainStore';
import globalStore from './globalStore';
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        playgroundStore,
        mainStore,
        globalStore
    }
})

