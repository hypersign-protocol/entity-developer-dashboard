const emptyConfiguration = () => ({
    selectedFlowIds: [],
    selectedServiceIds: [],
    serviceQuantities: {},
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
            const selectedServiceIds = uniqueStrings(payload.selectedServiceIds)
            const rawQuantities = payload.serviceQuantities && typeof payload.serviceQuantities === 'object'
                ? payload.serviceQuantities
                : {}
            const serviceQuantities = Object.keys(rawQuantities).reduce((quantities, serviceId) => {
                if (!selectedServiceIds.includes(serviceId)) return quantities
                quantities[serviceId] = Math.max(Math.floor(Number(rawQuantities[serviceId]) || 1), 1)
                return quantities
            }, {})

            state.configuration = {
                selectedFlowIds: uniqueStrings(payload.selectedFlowIds),
                selectedServiceIds,
                serviceQuantities,
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
