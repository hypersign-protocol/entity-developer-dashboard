import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

const walletStore = {
    namespaced: true,
    state: {
        blockchainUser: {},
        cosmosConnection: {},
        steps: [
            {
                id: 0,
                isActive: true,
                stepName: 'DeployKyc',
                name: 'Deploy KYC Contract',
                previous: 0
            },
            {
                id: 1,
                isActive: false,
                stepName: 'DeploySbt',
                name: 'Deploy SBT Contract',
                previous: 0
            },
            {
                id: 2,
                isActive: false,
                stepName: 'FinishOnchainKyc',
                name: 'Finish',
                previous: 1
            }
        ],

        onChainIssuerConfig: {},
        onChainIssuerData: {}

    },
    getters: {
        getOnChainActiveStep: (state) => {
            const step = state.steps.find(x => x.isActive == true)
            if (!step) {
                const step = state.steps.find(x => x.isActive == true)
                return step
            }
            return step
        },
        getBlockchainUser: (state) => {
            return state.blockchainUser
        },
        getCosmosConnection: (state) => {
            return state.cosmosConnection
        },
        getOnChainIssuerConfig: (state) => {
            return state.onChainIssuerConfig
            // const t = localStorage.getItem("onChainIssuerConfig")
            // if (t) {
            //     return JSON.parse(t)
            // } else {
            //     return null
            // }
        },

        getOnChainIssuerData: (state) => {
            return state.onChainIssuerData
        }
    },
    mutations: {
        nextStep: (state, jumpToStepId = null) => {
            const activeStep = state.steps.find(x => x.isActive == true)
            const nextStepId = jumpToStepId ? jumpToStepId : activeStep.id + 1;
            state.steps[activeStep.id].isActive = false;
            state.steps[nextStepId].isActive = true;
        },

        setOnChainIssuerData(state, payload) {
            state.onChainIssuerData = { ...payload }
        },

        previousStep: (state) => {
            const activeStep = state.steps.find(x => x.isActive == true)
            const previousStepId = activeStep.previous
            state.steps[activeStep.id].isActive = false;
            state.steps[previousStepId].isActive = true;
        },
        setBlockchainUser: (state, payload) => {
            state.blockchainUser = { ...payload }
        },
        setCosmosConnection: (state, payload) => {
            state.cosmosConnection = { ...payload };
        },
        setOnChainIssuerConfig: (state, payload) => {
            // localStorage.setItem("onChainIssuerConfig", JSON.stringify(payload))
            state.onChainIssuerConfig = { ...payload }
        },
        resetAll: (state, payload) => {
            console.log(payload)
            console.log('resetting....')
            state.onChainIssuerConfig = {};
            state.blockchainUser = {};
            state.cosmosConnection = {};
            state.steps[0].isActive = true;
            state.steps[1].isActive = false;
            state.steps[2].isActive = false;
        }

        // nibi1zhhfwhuyyc88jdr5rncn75uf0lf3pta4lwk68d6y7vncyqxxllrqr0gz5w
    },
    actions: {

    }
}

export default walletStore;
