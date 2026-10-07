const emptyConfiguration = () => ({
    selectedFlowIds: [],
    selectedServiceIds: [],
    creditsPerVerification: 0,
    updatedAt: null
})

const uniqueStrings = (values) => Array.from(new Set(
    (Array.isArray(values) ? values : []).filter(value => typeof value === 'string')
))

const creditCalculatorStore = {
    namespaced: true,
    state: {
        configuration: emptyConfiguration()
    },
    getters: {
        getConfiguration: (state) => state.configuration
    },
    mutations: {
        saveConfiguration(state, payload = {}) {
            state.configuration = {
                selectedFlowIds: uniqueStrings(payload.selectedFlowIds),
                selectedServiceIds: uniqueStrings(payload.selectedServiceIds),
                creditsPerVerification: Number.isFinite(Number(payload.creditsPerVerification))
                    ? Math.max(Number(payload.creditsPerVerification), 0)
                    : 0,
                updatedAt: new Date().toISOString()
            }
        },
        clearConfiguration(state) {
            state.configuration = emptyConfiguration()
        }
    }
}

export default creditCalculatorStore
