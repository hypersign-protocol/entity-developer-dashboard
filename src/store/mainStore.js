/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuex from 'vuex';
import config from '../config'
import UtilsMixin from '../mixins/utils.js'
import { sanitizeUrl } from '../utils/common.js'
import { RequestHandler } from '../utils/utils.js'

const { apiServer, studioServer } = config;
const apiServerBaseUrl = sanitizeUrl(apiServer.host) + apiServer.basePath;
Vue.use(Vuex)

// const GRANT_TYPES_ENUM = Object.freeze({
//     'SSI_API': 'access_service_ssi',
//     'CAVACH_API': 'access_service_kyc'
// })

const mainStore = {
    namespaced: true,
    mixin: [UtilsMixin],
    state: {
        isAuthenticated: false,
        userDetails: {},
        appList: [],
        totalAppCount: 0,
        showMainSideNavBar: true,
        serviceList: [],
        sessionList: [],
        userList: [],
        totalUserCount: 0,
        selectedServiceId: "",
        didList: [],
        onchainconfigs: [],
        onChainConfig: {},
        isLoggedOut: false,
        totalSessionCount: 0,
        widgetConfig: {

        },
        kybWidgetConfig: {

        },
        webhookConfig: {},
        kycWebpageConfig: {},
        marketPlaceApps: [],
        adminMembers: [],
        myInvitions: [],
        allRoles: [],
        usageDetails: {},
        kycCredits: [],
        ssiCredits: [],

        schemaList: [],
        credentialList: [],
        totalCredentialCount: 0,
        companies: [],
        companyExecutives: [],
        complianceData: null
    },
    getters: {
        getIfAuthenticated: (state) => { return state.isAuthenticated },
        getIsLoggedOut: (state) => {
            return state.isLoggedOut
        },
        getAdminMembersgetter: (state) => {
            return state.adminMembers
        },
        getMyInvitions: (state) => {
            return state.myInvitions
        },
        getAllRoles: (state) => {
            return state.allRoles
        },
        getParseAuthToken() {
            const authTokne = localStorage.getItem('authToken');
            if (!authTokne) {
                return {};
            }
            var base64Url = authTokne.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        },
        getAuthToken() {
            return localStorage.getItem('authToken')
        },
        getPreparedMarketPlaceApps: (state) => {
            return state.preparedMarketPlaceApps
        },
        getAppByAppId: (state) => (appId) => {
            return state.appList.find(x => x.appId === appId);
        },
        getAllServices: (state) => {
            return state.serviceList;
        },
        getAppsWithSSIServices: (state) => {
            return state.appList.filter(x => x.services[0].id === config.SERVICE_TYPES.SSI_API)
        },
        getAppsWithKYCServices: (state) => {
            return state.appList.filter(x => x.services[0].id === config.SERVICE_TYPES.CAVACH_API)
        },
        getAppsWithQuestServices: (state) => {
            return state.appList.filter(x => x.services[0].id === config.SERVICE_TYPES.QUEST)
        },
        getServiceById: (state) => (serviceId) => {
            return state.serviceList.find(x => x.id === serviceId)
        },
        getSessionDetailsBySessionId: (state) => (sessionId) => {
            return state.sessionList.find(x => x.sessionId === sessionId)
        },
        getSelectedService: (state) => {
            return state.appList.find(x => x.appId === state.selectedServiceId)
        },

        // eslint-disable-next-line 
        getUserAccessList: (state) => (service) => {
            return state.userDetails.accessList ? state.userDetails.accessList.filter(access => access.serviceType === service) : []
        },

        getOnChainConfig: (state) => {
            return state.onChainConfig
        },
        getWidgetnConfig: (state) => {
            return state.widgetConfig
        },
        getKybWidgetConfig: (state) => {
            return state.kybWidgetConfig
        },
        getWebhookConfig: (state) => {
            return state.webhookConfig
        },
        getKYCWebpageConfig: (state) => {
            return state.kycWebpageConfig
        },
        getMarketPlaceApps: (state) => {
            return state.marketPlaceApps
        },

        getUsageDetails: (state) => {
            return state.usageDetails
        },

        getKYCCredits: (state) => {
            return state.kycCredits
        },
        getSsiCredits: (state) => {
            return state.ssiCredits
        },
        getCompanies: (state) => {
            return state.companies
        },
        getCompanyExecutives: (state) => {
            return state.companyExecutives
        },
        getComplianceData: (state) => {
            return state.complianceData
        },
        getUserDetails: (state) => {
            return state.userDetails
        }
    },
    mutations: {
        setIfAuthenticated: (state, payload = true) => {
            state.isAuthenticated = payload;
        },
        setIsLoggedOut: (state, payload = false) => {
            state.isLoggedOut = payload;
            // localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            localStorage.removeItem("credentials");
            localStorage.removeItem("userData");
            localStorage.removeItem("selectedOrg")
            localStorage.removeItem("vuex");
        },
        setAuthToken(state, payload) {
            console.log(state.namespaced)
            if (payload) {
                localStorage.setItem("authToken", payload);
            }
        },
        updateAnMarketPlaceApp(state, payload) {
            const tempToUpdateIndex = state.marketPlaceApps.findIndex(x => x.appId === payload.appId);
            Object.assign(state.marketPlaceApps[tempToUpdateIndex], { ...payload });
        },
        setOnChainConfig: (state, payload) => {
            state.onChainConfig = { ...payload }
        },
        setWidgetConfig: (state, payload) => {
            state.widgetConfig = { ...payload }
        },
        setKybWidgetConfig: (state, payload) => {
            state.kybWidgetConfig = { ...payload }
        },
        setWebhookConfig: (state, payload) => {
            state.webhookConfig = { ...payload }
        },
        setKYCWebpageConfig: (state, payload) => {
            state.kycWebpageConfig = { ...payload }
        },
        setMainSideNavBar: (state, payload) => {
            state.showMainSideNavBar = payload ? payload : false;
        },
        resetMainStore(state) {
            state.isAuthenticated = false
            state.userDetails = {}
            state.appList = []
            state.totalAppCount = 0
            state.showMainSideNavBar = true
            state.serviceList = []
            state.sessionList = []
            state.userList = []
            state.totalUserCount = 0
            state.selectedServiceId = ""
            state.didList = []
            state.onchainconfigs = []
            state.onChainConfig = {}
            state.isLoggedOut = false
            state.totalSessionCount = 0
            state.widgetConfig = {}
            state.kybWidgetConfig = {}
            state.webhookConfig = {}
            state.kycWebpageConfig = {}
            state.marketPlaceApps = []
            state.adminMembers = []
            state.myInvitions = []
            state.allRoles = []
            state.usageDetails = {}
            state.kycCredits = []
            state.ssiCredits = []
            state.schemaList = []
            state.credentialList = []
            state.totalCredentialCount = 0
            state.companies = []
            state.companyExecutives = []
            state.complianceData = null
        },
        insertAllApps(state, payload) {
            state.appList = payload.data;
            state.totalAppCount = payload.totalCount;
        },
        insertAllServices(state, payload) {
            state.serviceList = payload;
        },
        insertMarketplaceApps(state, payload) {
            state.marketPlaceApps = payload;
        },
        updateAnApp(state, payload) {
            const tempToUpdateIndex = state.appList.findIndex(x => x.appId === payload.appId);
            Object.assign(state.appList[tempToUpdateIndex], { ...payload });
        },
        insertAnApp(state, payload) {
            if (!state.appList.find(x => x.appId === payload.appId)) {
                state.appList.unshift(payload);
            }
            // else {
            //      this.commit('updateAnApp', payload);
            // }
        },
        insertSessions(state, payload) {
            state.sessionList = payload.sessionList;
            state.totalSessionCount = payload.totalCount
        },
        insertUsers(state, payload) {
            state.userList = payload.userList;
            state.totalUserCount = payload.totalCount
        },

        insertAppsOnChainConfigs(state, payload) {
            state.onchainconfigs = payload
        },

        updateSessionDetails(state, payload) {
            const sessionIndexToUpdate = state.sessionList.findIndex(x => x.sessionId = payload.sessionId)
            if (sessionIndexToUpdate > -1) {
                state.sessionList[sessionIndexToUpdate] = payload
            } else {
                state.sessionList.unshift(payload)
            }
        },
        setSelectedAppId: (state, payload) => {
            state.selectedServiceId = payload;
        },

        setDIDList(state, payload) {
            state.didList = payload;
        },
        setSchemaList(state, payload) {
            state.schemaList = payload;
        },
        setCredentialList(state, payload) {
            state.credentialList = payload.credentialList;
            state.totalCredentialCount = payload.totalCount;
        },
        insertDIDList(state, payload) {
            state.didList.unshift(payload);
        },
        insertSchemaList(state, payload) {
            state.schemaList.unshift(payload);
        },
        insertCredentialList(state, payload) {
            state.credentialList.unshift(payload);
        },
        updateADID(state, payload) {
            let index = state.didList.findIndex(x => x.did === payload.did);
            if (index >= 0) {
                Object.assign(state.didList[index], { ...payload });
            } else {
                state.didList.push(payload);
            }
        },
        updateASchema(state, payload) {
            let index = state.schemaList.findIndex(x => x.id === payload.id);
            if (index >= 0) {
                Object.assign(state.schemaList[index], { ...payload });
            } else {
                state.schemaList.push(payload);
            }
        },
        updateACredential(state, payload) {
            let index = state.credentialList.findIndex(x => x.id === payload.id);
            if (index >= 0) {
                Object.assign(state.credentialList[index], { ...payload });
            } else {
                state.credentialList.push(payload);
            }
        },
        setAdminMembers: (state, payload) => {
            state.adminMembers = payload
        },
        setMyInvitions: (state, payload) => {
            state.myInvitions = payload
        },

        setAllRoles: (state, payload) => {
            state.allRoles = payload
        },

        setUsageDetails: (state, payload) => {
            state.usageDetails = payload
        },

        setKYCCredits: (state, payload) => {
            state.kycCredits = payload
        },
        setSSICredits: (state, payload) => {
            state.ssiCredits = payload
        },
        setCompanies: (state, payload) => {
            state.companies = payload
        },
        clearCompanies: (state) => {
            state.companies = []
        },
        setCompanyExecutives: (state, payload) => {
            state.companyExecutives = payload
        },
        clearCompanyExecutives: (state) => {
            state.companyExecutives = []
        },
        setComplianceData: (state, payload) => {
            state.complianceData = payload
        },
        clearComplianceData: (state) => {
            state.complianceData = null
        },
        setUserDetails: (state, payload) => {
            state.userDetails = payload
        }
    },

    actions: {

        /// Member 

        // eslint-disable-next-line no-empty-pattern
        inviteMember: async ({ getters, dispatch }, payload) => {
            const url = `${apiServerBaseUrl}/people/invite`;
            const resp = await RequestHandler(url, 'POST', {
                emailId: payload
            },
                UtilsMixin.methods.getHeader(getters.getAuthToken))

            if (!resp || Array.isArray(resp.message)) {
                console.log(resp.message)
                throw new Error(resp?.message?.join(',') || resp?.message);
            } else if ('statusCode' in resp && resp.statusCode !== 200 && resp.statusCode !== 201) {
                throw new Error(resp.message)

            }

            dispatch('getPeopleMembers')
            return resp;

        },

        // eslint-disable-next-line no-empty-pattern
        acceptInvition: async ({ getters, dispatch }, payload) => {
            const url = `${apiServerBaseUrl}/people/invite/accept/${payload}`;
            const resp = await RequestHandler(url, 'POST', {}, UtilsMixin.methods.getHeader(getters.getAuthToken))


            if (!resp || Array.isArray(resp.message)) {
                throw new Error(resp?.message?.join(',') || resp?.message);
            } else if ('statusCode' in resp && resp.statusCode !== 200 && resp.statusCode !== 201) {
                throw new Error(resp.message)
            }
            await dispatch('getInvitions');
            return resp;

        },

        // eslint-disable-next-line no-empty-pattern
        deleteMember: async ({ getters, dispatch }, payload) => {
            const url = `${apiServerBaseUrl}/people/`;
            const resp = await RequestHandler(url,
                'DELETE',
                {
                    emailId: payload

                },
                UtilsMixin.methods.getHeader(getters.getAuthToken),
            )
            if (!resp || Array.isArray(resp.message)) {
                throw new Error(resp?.message?.join(',') || resp?.message);
            } else if ('statusCode' in resp && resp.statusCode !== 200 && resp.statusCode !== 201) {
                throw new Error(resp.message)

            }
            await dispatch('getPeopleMembers');
            return resp;

        },

        getPeopleMembers: async ({ getters, commit }) => {
            const url = `${apiServerBaseUrl}/people`;

            const response = await RequestHandler(url, 'GET', {},
                UtilsMixin.methods.getHeader(getters.getAuthToken)
            )
            if (Array.isArray(response)) {
                commit('setAdminMembers', response)
                return response;

            }
            const message = Array.isArray(response?.message)
                ? response.message.join(', ')
                : response?.message || 'Unknown error';

            throw new Error(message);

        },

        getInvitions: async ({ getters, commit }) => {
            const url = `${apiServerBaseUrl}/people/invites`;

            const resp = await RequestHandler(url, 'GET', {}, UtilsMixin.methods.getHeader(getters.getAuthToken))
            if (Array.isArray(resp)) {
                commit('setMyInvitions', resp)
                return resp;

            }

            const message = Array.isArray(resp?.message)
                ? resp.message.join(', ')
                : resp?.message || 'Unknown error';

            throw new Error(message);


        },

        attachMemberToARole: async ({ getters, dispatch }, payload) => {

            const url = `${apiServerBaseUrl}/people/roles/attach`;

            const resp = await RequestHandler(url,
                'POST',
                payload,
                UtilsMixin.methods.getHeader(getters.getAuthToken)
            )

            if (!resp && Array.isArray(resp.message)) {
                console.log(resp.message)
                throw new Error(resp?.message?.join(',') || resp?.message);
            } else if ('statusCode' in resp && resp?.statusCode !== 200 && resp?.statusCode !== 201) {
                throw new Error(resp.message)

            }

            dispatch('getPeopleMembers')
            return resp;

        },
        switchToAdmin: async ({ getters }, payload) => {

            const url = `${apiServerBaseUrl}/people/admin/login`;

            const resp = await RequestHandler(url,
                'POST',
                payload,
                UtilsMixin.methods.getHeader(getters.getAuthToken),
            )
            if (!resp || Array.isArray(resp.message)) {
                throw new Error(resp?.message?.join(',') || resp?.message);
            } else if ('statusCode' in resp && (resp.statusCode !== 200 || 201)) {
                throw new Error(resp.message)

            }
            return resp;
        },

        /// Roles

        getMyRolesAction: async ({ getters, commit }) => {
            const url = `${apiServerBaseUrl}/roles`;

            const resp = await RequestHandler(url,
                'GET',
                {},
                UtilsMixin.methods.getHeader(getters.getAuthToken)
            )
            if (Array.isArray(resp)) {
                commit('setAllRoles', resp)
                return resp;

            }
            const message = Array.isArray(resp?.message)
                ? resp.message.join(', ')
                : resp?.message || 'Unknown error';

            throw new Error(message);


        },

        createARole: async ({ getters, dispatch }, payload) => {

            const url = `${apiServerBaseUrl}/roles`;

            const resp = await RequestHandler(url,
                'POST',
                payload,
                UtilsMixin.methods.getHeader(getters.getAuthToken)
            )

            if (!resp || Array.isArray(resp.message)) {
                throw new Error(resp?.message?.join(',') || resp?.message);
            } else if ('statusCode' in resp && resp.statusCode !== 200 && resp.statusCode !== 201) {
                throw new Error(resp.message)

            }

            dispatch('getMyRolesAction')
            return resp;

        },

        deleteARole: async ({ getters, dispatch }, payload) => {
            const url = `${apiServerBaseUrl}/roles/${payload}`;
            const resp = await RequestHandler(url,
                'DELETE', {},
                UtilsMixin.methods.getHeader(getters.getAuthToken)
            )

            if (!resp && Array.isArray(resp.message)) {
                throw new Error(resp?.message?.join(',') || resp?.message);
            } else if ('statusCode' in resp && resp.statusCode !== 200 && resp.statusCode !== 201) {
                throw new Error(resp.message)
            }

            dispatch('getMyRolesAction')
            return resp;

        },

        updateARole: async ({ getters, dispatch }, payload) => {
            const url = `${apiServerBaseUrl}/roles/${payload._id}`;

            const resp = await RequestHandler(url, 'PATCH', payload, UtilsMixin.methods.getHeader(getters.getAuthToken))
            if (!resp && Array.isArray(resp.message)) {
                throw new Error(resp?.message?.join(',') || resp?.message);
            } else if ('statusCode' in resp && resp?.statusCode !== 200 && resp?.statusCode !== 201) {
                throw new Error(resp.message)

            }
            dispatch('getMyRolesAction')
            return resp;

        },





        /// Security

        login: () => {
            console.log('Inside action login')
            return new Promise((resolve, reject) => {
                const url = `${apiServerBaseUrl}/sa/login`;

                // const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
                fetch(url, {
                    method: 'POST',
                    // headers,
                    body: JSON.stringify({
                        username: "varsha",
                        password: "Var123@"
                    })
                })
                    .then(response => response.json())
                    .then(json => {

                        if (json.error) {
                            reject(json)
                        }
                        else {
                            resolve(json)
                        }
                    }).catch((e) => {
                        reject(new Error(`while updating an app  ${e}`))
                    })
            })
        },

        mfaGenerate: async ({ getters }, payload) => {
            try {
                const { authenticatorType } = payload
                if (!authenticatorType) throw new Error('Authenticator type must be provided')
                const url = `${apiServerBaseUrl}/auth/mfa/setup/generate`;
                const resp = await RequestHandler(url, 'POST', { authenticatorType }, UtilsMixin.methods.getHeader(getters.getAuthToken))
                if (!resp || Array.isArray(resp.message)) {
                    throw new Error(resp?.message?.join(',') || resp?.message);
                } else if ('statusCode' in resp && resp?.statusCode !== 200 && resp?.statusCode !== 201) {
                    throw new Error(resp.message)
                }
                return resp;
            } catch (e) {
                throw new Error(e)
            }
        },

        setupmfaVerify: async ({ getters }, payload) => {
            try {
                const { authenticatorType, twoFactorAuthenticationCode } = payload
                if (!authenticatorType) throw new Error('Authenticator type must be provided')

                if (!twoFactorAuthenticationCode) throw new Error('MFA PIN must be provided')

                const url = `${apiServerBaseUrl}/auth/mfa/setup/verify`;

                const resp = await RequestHandler(url, 'POST', {
                    authenticatorType,
                    twoFactorAuthenticationCode
                },
                    {}
                )

                if (!resp || Array.isArray(resp.message)) {
                    throw new Error(resp.message.join(','));

                }

                return resp;
            } catch (e) {
                throw new Error(e)
            }
        },

        // eslint-disable-next-line no-empty-pattern
        mfaVerify: async ({ getters }, payload) => {
            try {
                const { authenticatorType, twoFactorAuthenticationCode, sessionId } = payload
                if (!authenticatorType) throw new Error('Authenticator type must be provided')

                if (!twoFactorAuthenticationCode) throw new Error('MFA PIN must be provided')

                // if (!sessionId) throw new Error('Session ID is missing')

                const url = `${apiServerBaseUrl}/auth/mfa/login/verify`;

                const resp = await RequestHandler(url, 'POST', {
                    sessionId,
                    authenticatorType,
                    twoFactorAuthenticationCode
                },
                    UtilsMixin.methods.getHeader(getters.getAuthToken)
                )

                if (!resp || Array.isArray(resp.message)) {
                    throw new Error(resp.message.join(','));

                }

                return resp;
            } catch (e) {
                throw new Error(e)
            }
        },

        getMyUserDetails: async ({ commit }) => {
            const resp = await RequestHandler(`${apiServerBaseUrl}/users/me`, 'POST', {})
            commit('setUserDetails', resp?.message)
            return resp?.message
        },

        saveAnAppOnServer: ({ commit, dispatch }, payload) => {
            return new Promise((resolve, reject) => {
                const url = `${apiServerBaseUrl}/app`;

                const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
                fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload),
                    credentials: 'include',
                })
                    .then(response => response.json())
                    .then(json => {
                        if (json.statusCode && (json.statusCode != (200 || 201))) {
                            reject(json.message)
                        } else if (json.error) {
                            reject(json)
                        } else {
                            commit('insertAnApp', json);

                            if (json.services[0]?.id != config.SERVICE_TYPES.QUEST) {
                                dispatch('keepAccessTokenReadyForApp', {
                                    serviceId: json.appId,
                                    grant_type: config.GRANT_TYPES_ENUM[json.services[0].id]
                                })
                            }


                            resolve(json)
                        }
                    }).catch((e) => {
                        reject(new Error(`while updating an app  ${e}`))
                    })
            })
        },

        updateAnAppOnServer: ({ commit }, payload) => {
            return new Promise((resolve, reject) => {
                const { appId } = payload;
                if (!appId) {
                    reject(new Error(`appId is not specified`))
                }
                const url = `${apiServerBaseUrl}/app/${appId}`;
                const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
                delete payload.edvId
                delete payload.apiKeyScecret
                fetch(url, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(payload),
                    credentials: 'include',
                }).then(response => {
                    return response.json()
                }).then(json => {

                    if (json.error) {
                        reject(json)
                    }
                    else {
                        commit('updateAnApp', json);
                        resolve(json)
                    }
                }).catch(e => {
                    reject(new Error(`while updating an app   ${e}`))
                })
            })

        },

        deleteAnAppOnServer: ({ dispatch }, payload) => {
            return new Promise((resolve, reject) => {
                const { appId } = payload;
                if (!appId) {
                    reject(new Error(`appId is not specified`))
                }
                const url = `${apiServerBaseUrl}/app/${appId}`;
                const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
                fetch(url, {
                    method: 'DELETE',
                    headers,
                    credentials: 'include',
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(new Error(json.message.join(' ')))
                    }
                    dispatch('fetchAppsListFromServer')
                    resolve(json)
                }).catch((e) => {
                    return reject(`Error while deleting this service ${appId} ` + e.message);
                })
            })
        },


        fetchAppsListFromServer: async ({ commit, dispatch }) => {

            // TODO: Get list of orgs 
            const url = `${apiServerBaseUrl}/app?limit=50`;
            // TODO: // use proper authToken
            const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
            const json = await RequestHandler(url, 'GET', {}, headers)
            if (json) {
                commit('insertAllApps', json);
                json.data.map(x => {
                    if (x.services[0].id == config.SERVICE_TYPES.SSI_API) {
                        return dispatch('keepAccessTokenReadyForApp', {
                            serviceId: x.appId,
                            grant_type: config.GRANT_TYPES_ENUM[x.services[0].id]
                        })
                    }
                    // For CAVACH_API services, we need to set up tokens for both KYC and KYB operations
                    // KYC (Know Your Customer) and KYB (Know Your Business) are separate verification processes
                    if (x.services[0].id == config.SERVICE_TYPES.CAVACH_API) {
                        dispatch('keepAccessTokenReadyForApp', {
                            serviceId: x.appId,
                            grant_type: config.GRANT_TYPES_ENUM[x.services[0].id]
                        })
                        return dispatch('keepAccessTokenReadyForApp', {
                            serviceId: x.appId,
                            grant_type: config.GRANT_TYPES_ENUM["CAVACH_KYB_API"]
                        })

                    }
                })
            } else {
                return null
            }
        },


        fetchMarketPlaceAppsFromServer: async ({ commit }) => {
            const url = `${apiServerBaseUrl}/app/marketplace`;
            const json = await RequestHandler(url, 'GET', {}, {})
            if (json) {
                commit('insertMarketplaceApps', json);
            } else {
                return null
            }
        },


        keepAccessTokenReadyForApp: async ({ commit, getters }, payload) => {
            try {
                const { serviceId, grant_type } = payload
                const url = `${apiServerBaseUrl}/app/access-control/token?serviceId=${serviceId}&grant_type=${grant_type}`;
                const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
                const json = await RequestHandler(url, 'GET', {}, headers);
                if (json?.access_token) {
                    const app = getters.getAppByAppId(serviceId)
                    // Handle different access token types based on grant type:
                    // - For CAVACH_KYB_API grant type: store as 'kyb_access_token'
                    // - For all other grant types (SSI_API, CAVACH_API): store as 'access_token'
                    // This allows KYC services to have separate tokens for KYC and KYB operations
                    if (grant_type != config.GRANT_TYPES_ENUM.CAVACH_KYB_API) {
                        app['access_token'] = json.access_token
                    } else {
                        app['kyb_access_token'] = json.access_token
                    }
                    commit('insertAnApp', app);
                } else {
                    throw new Error(`Could not fetch accesstoken for service   ${serviceId}`)
                }


            } catch (e) {
                throw new Error(`Error while updating an app: ${e.message}`);
            }
        },

        fetchServicesList: async ({ commit }) => {
            // TODO: Get list of orgs 
            const url = `${apiServerBaseUrl}/services`;
            // TODO: // use proper authToken
            const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
            let resp = await RequestHandler(url, 'GET', {}, headers)

            if (resp) {
                resp = resp.filter(x => !(x.id == 'DASHBOARD'))
                commit('insertAllServices', resp);
            } else {
                return null
            }
        },

        // eslint-disable-next-line 
        generateAPISecretKey: ({ commit }, payload) => {
            return new Promise((resolve, reject) => {
                const { appId } = payload;
                if (!appId) {
                    return reject(new Error(`appId is not specified`))
                }
                const url = `${apiServerBaseUrl}/app/${appId}/secret/new`;

                // TODO: // use proper authToken
                const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
                fetch(url, {
                    method: 'POST',
                    headers,
                    credentials: 'include',
                })
                    .then(response => response.json())
                    .then(json => {

                        if (json.error) {
                            return reject(json)
                        }
                        resolve(json)
                    }).catch((e) => {
                        return reject(new Error(`while generating new secret key app  ${e}`))
                    })
            })
        },
        fetchAppKybs: ({ commit, getters }) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }

                let url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyb/verification/company`;
                const headers = UtilsMixin.methods.getKycServiceHeader(getters.getSelectedService.kyb_access_token);
                fetch(url, {
                    method: 'GET',
                    headers,
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(new Error(json.error?.details?.join(' ') || json.error?.join?.(' ') || json.error || 'Unknown error'))
                    }

                    const companiesData = json.data || json;

                    // Transform the data to match component structure
                    const transformedCompanies = Array.isArray(companiesData) ?
                        companiesData.map(company => ({
                            id: company._id || company.id,
                            companyId: company._id || company.id,
                            countryCode: company.countryOfRegistration || company.address?.country || 'IN',
                            companyName: company.name || 'Unknown Company',
                            registrationNumber: company.registrationNumber || 'N/A',
                            representative: company.representative?.name || 'N/A',
                            startDate: company.createdAt ? new Date(company.createdAt).toISOString().split('T')[0] : 'N/A',
                            status: company.status || 'Submitted',
                            statusReasons: company.statusReason || [],
                            steps: {
                                flag: true,
                                building: true,
                                document: company.documents && company.documents.length > 0,
                                user: ['Submitted', 'InProgress', 'Approved'].includes(company.status),
                                verification: ['Approved', 'Completed'].includes(company.status)
                            },
                            region: company.region || 'Unknown',
                            domain: company.domain || 'N/A',
                            registrationNumberType: company.registrationNumberType || 'Unknown',
                            address: company.address || {},
                            documents: company.documents || [],
                            createdAt: company.createdAt,
                            updatedAt: company.updatedAt
                        })) : [];

                    // Commit the transformed companies data to store
                    commit('setCompanies', transformedCompanies);
                    resolve(transformedCompanies);
                }).catch((e) => {
                    return reject(new Error(`Error while fetching KYB companies: ${e.message}`));
                })
            })
        },

        fetchAppsUsersSessions: ({ commit, getters }, payload) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }

                let url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyc/verification/session`;
                // let url = 'http://localhost:3001/api/v1/e-kyc/verification/session'

                const paramsObject = {}

                // page
                if (payload.page) {
                    paramsObject['page'] = payload.page
                }

                if (payload.limit) {
                    paramsObject['limit'] = payload.limit
                }

                if (payload.userId) {
                    paramsObject['userId'] = payload.userId
                }

                if (payload.sessionIds) {
                    paramsObject['sessionIds'] = payload.sessionIds
                }
                if (payload.status) {
                    paramsObject['status'] = payload.status

                }
                if (Object.keys(paramsObject).length > 0) {
                    const params = new URLSearchParams({ ...paramsObject });
                    url = url + '?' + params.toString();
                }

                // // limit
                // url = url + '&limit=' + (payload.limit ? payload.limit : 20)

                // const url = 'http://localhost:3001/api/v1/e-kyc/verification/session'
                const authToken = getters.getSelectedService.access_token
                if (!authToken) {
                    return reject(new Error('authToken is invalid, service is not selected'))
                }
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
                fetch(url, {
                    method: 'GET',
                    headers
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(new Error(json.error?.details.join(' ') || json.error.join(' ')))
                    }
                    commit('insertSessions', {
                        sessionList: json.data.sessionDetails,
                        totalCount: json.data.totalCount || 0
                    });
                    resolve(json.data.sessionDetails)
                }).catch((e) => {
                    return reject(`Error while fetching apps ` + e.message);
                })
            })

        },


        fetchAppsUsers: ({ commit, getters }, payload) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }

                let url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/user`;
                // let url = 'http://localhost:3001/api/v1/user'

                const paramsObject = {}
                if (payload.env) {
                    paramsObject['env'] = payload.env
                }
                // page
                if (payload.page) {
                    paramsObject['page'] = payload.page
                }

                if (payload.limit) {
                    paramsObject['limit'] = payload.limit
                }

                if (payload.userId) {
                    paramsObject['userId'] = payload.userId
                }

                if (payload.sessionIds) {
                    paramsObject['sessionIds'] = payload.sessionIds
                }

                if (payload.status) {
                    paramsObject['status'] = payload.status

                }

                if (Object.keys(paramsObject).length > 0) {
                    const params = new URLSearchParams({ ...paramsObject });
                    url = url + '?' + params.toString();
                }

                const authToken = getters.getSelectedService.access_token
                if (!authToken) {
                    return reject(new Error('authToken is invalid, service is not selected'))
                }
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
                fetch(url, {
                    method: 'GET',
                    headers
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(new Error(json.error?.details.join(' ') || json.error.join(' ')))
                    }

                    commit('insertUsers', {
                        userList: json.data.users,
                        totalCount: json.data.totalCount || 0
                    });
                    resolve(json.data.users)
                }).catch((e) => {
                    return reject(`Error while fetching apps ` + e.message);
                })
            })

        },

        // Onchain config --------------------------------
        fetchAppsOnChainConfigs: ({ commit, getters }) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyc/verification/onchainkyc-config`;
                // const url = `http://localhost:3001/api/v1/e-kyc/verification/onchainkyc-config`
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
                fetch(url, {
                    method: 'GET',
                    headers
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(json)
                    }
                    commit('insertAppsOnChainConfigs', json.data.reverse());
                    resolve()
                }).catch((e) => {
                    return reject(`Error while fetching apps ` + e.message);
                })
            })
        },

        createAppsOnChainConfig: ({ commit, getters }, payload) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyc/verification/onchainkyc-config`;
                //const url = `http://localhost:3001/api/v1/e-kyc/verification/onchainkyc-config`
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
                fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload),
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(new Error(json.error?.details.join(' ') || json.error.join(' ')))
                    }
                    commit('setOnChainConfig', json.data);
                    resolve(json.data)
                }).catch((e) => {
                    return reject(`Error while fetching apps ` + e.message);
                })
            })
        },

        onboardCustomer: ({ commit, getters }, payload) => {
            return new Promise((resolve, reject) => {

                const url = `${studioServer.BASE_URL}api/v1/customer-onboarding`;
                const headers = UtilsMixin.methods.getHeader(getters.getAuthToken);
                const resp = RequestHandler(url, 'POST', payload, headers);

                resp.then(json => {
                    if (json.error) {
                        let errorMessage = 'Unknown error';

                        // Handle different error response formats
                        if (typeof json.error === 'string') {
                            errorMessage = json.error;
                        } else if (json.error.details && Array.isArray(json.error.details)) {
                            errorMessage = json.error.details.join(' ');
                        } else if (Array.isArray(json.error)) {
                            errorMessage = json.error.join(' ');
                        } else if (json.error.message) {
                            errorMessage = json.error.message;
                        } else if (typeof json.error === 'object') {
                            errorMessage = JSON.stringify(json.error);
                        }

                        return reject(new Error(errorMessage));
                    }
                    resolve(json.data);
                }).catch((error) => {
                    return reject(`Error while onboarding customer: ` + error.message);
                });
            })
        },
        checkIfAlreadyExistOnBoarding: ({ commit, getters }, payload) => {
            return new Promise((resolve, reject) => {

                const url = `${studioServer.BASE_URL}api/v1/customer-onboarding`;
                const resp = RequestHandler(url, 'GET', {}, {});

                resp.then(json => {
                    if (json.error) {
                        let errorMessage = 'Unknown error';

                        // Handle different error response formats
                        if (typeof json.error === 'string') {
                            errorMessage = json.error;
                        } else if (json.error.details && Array.isArray(json.error.details)) {
                            errorMessage = json.error.details.join(' ');
                        } else if (Array.isArray(json.error)) {
                            errorMessage = json.error.join(' ');
                        } else if (json.error.message) {
                            errorMessage = json.error.message;
                        } else if (typeof json.error === 'object') {
                            errorMessage = JSON.stringify(json.error);
                        }

                        return reject(new Error(errorMessage));
                    }
                    resolve(json);
                }).catch((error) => {
                    return reject(`Error while checking if customer already exists: ` + error.message);
                });
            })
        },
        updateAppsOnChainConfig: ({ commit, getters, dispatch }, payload) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyc/verification/onchainkyc-config`;
                // const url = `http://localhost:3001/api/v1/e-kyc/verification/onchainkyc-config`
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
                fetch(url, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify(payload),
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(new Error(json.error?.details.join(' ') || json.error.join(' ')))
                    }
                    // restting
                    commit('setOnChainConfig', {});
                    dispatch('fetchAppsOnChainConfigs')
                    resolve(json.data)
                }).catch((e) => {
                    return reject(`Error while fetching apps ` + e.message);
                })
            })
        },

        deleteAppOnChainConfig: ({ getters, dispatch }, payload) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyc/verification/onchainkyc-config/${payload._id}`;
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
                fetch(url, {
                    method: 'DELETE',
                    headers,
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(new Error(json.error?.details.join(' ') || json.error.join(' ')))
                    }
                    dispatch('fetchAppsOnChainConfigs')
                    resolve(json)
                }).catch((e) => {
                    return reject(`Error while fetching apps ` + e.message);
                })
            })
        },



        // Widget Config --------------------------------
        createAppsWidgetConfig: ({ commit, getters }) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyc/verification/widget-config`;
                // const url = `http://localhost:3001/api/v1/e-kyc/verification/widget-config`
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
                const data = getters.getWidgetnConfig;
                data['issuerVerificationMethodId'] = getters.getWidgetnConfig.issuerDID + '#key-1';
                fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(data),
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(new Error(json.error?.details.join(' ') || json.error.join(' ')))
                    }
                    commit('setWidgetConfig', json.data);
                    resolve(json.data)
                }).catch((e) => {
                    return reject(`Error while fetching apps ` + e.message);
                })
            })
        },

        fetchAppsWidgetConfig: ({ commit, getters }) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyc/verification/widget-config`;
                // const url = `http://localhost:3001/api/v1/e-kyc/verification/widget-config/`
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
                return fetch(url, {
                    method: 'GET',
                    headers
                }).then(response => response.json()).then(json => {
                    if (json) {
                        if (json.error) {
                            return reject(new Error(json.error?.details.join(' ') || json.error.join(' ')))
                        } else {
                            commit('setWidgetConfig', json.data);
                            return resolve()
                        }
                    } else {
                        return resolve()
                    }

                }).catch((e) => {
                    return reject(`Error while fetching widget configuration ` + e.message);
                })
            })
        },

        updateAppsWidgetConfig: ({ commit, getters }) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyc/verification/widget-config`;
                // const url = `http://localhost:3001/api/v1/e-kyc/verification/widget-config`
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
                const data = getters.getWidgetnConfig;
                data['issuerVerificationMethodId'] = getters.getWidgetnConfig.issuerDID + '#key-1';
                fetch(url, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify(data),
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(new Error(json.error?.details.join(' ') || json.error.join(' ')))
                    }
                    // restting
                    commit('setWidgetConfig', json.data);
                    resolve(json)
                }).catch((e) => {
                    return reject(`Error while fetching apps ` + e.message);
                })
            })
        },

        createAppsKybWidgetConfig: ({ commit, getters }) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyb/verification/widget-config`;
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
                const data = getters.getKybWidgetConfig;
                data['issuerVerificationMethodId'] = getters.getKybWidgetConfig.issuerDID + '#key-1';
                fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(data),
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(new Error(json.error?.details.join(' ') || json.error.join(' ')))
                    }
                    commit('setKybWidgetConfig', json.data);
                    resolve(json.data)
                }).catch((e) => {
                    return reject(`Error while creating KYB widget config ` + e.message);
                })
            })
        },

        fetchAppsKybWidgetConfig: ({ commit, getters }) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyb/verification/widget-config`;
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
                return fetch(url, {
                    method: 'GET',
                    headers
                }).then(response => response.json()).then(json => {
                    if (json) {
                        if (json.error) {
                            return reject(new Error(json.error?.details.join(' ') || json.error.join(' ')))
                        } else {
                            commit('setKybWidgetConfig', json.data);
                            return resolve()
                        }
                    } else {
                        return resolve()
                    }
                }).catch((e) => {
                    return reject(`Error while fetching KYB widget configuration ` + e.message);
                })
            })
        },

        updateAppsKybWidgetConfig: ({ commit, getters }) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyb/verification/widget-config`;
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
                const data = getters.getKybWidgetConfig;
                data['issuerVerificationMethodId'] = getters.getKybWidgetConfig.issuerDID + '#key-1';
                fetch(url, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify(data),
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(new Error(json.error?.details.join(' ') || json.error.join(' ')))
                    }
                    commit('setKybWidgetConfig', json.data);
                    resolve(json)
                }).catch((e) => {
                    return reject(`Error while updating KYB widget config ` + e.message);
                })
            })
        },


        // webhook config
        createAppWebhookConfig: ({ commit, getters }, payload) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyc/verification/webhook-config`;
                // const url = `http://localhost:3001/api/v1/e-kyc/verification/webhook-config`
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);

                fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                }).then(response => response.json())
                    .then(json => {
                        if (json.error) {
                            return reject(new Error(json.error.details.join(' ')))
                        }
                        commit('setWebhookConfig', json.data);
                        resolve(json.data)
                    }).catch((e) => {
                        return reject(`Error while fetching apps ` + e.message);
                    })
            })
        },

        createMasterWallet: ({ getters }, payload) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/wallet`;
                // const url = `http://localhost:3001/api/v1/wallet`
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);

                fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                }).then(response => response.json())
                    .then(json => {
                        if (json.error) {
                            return reject(new Error(json.error.details.join(' ')))
                        }
                        // commit('setWebhookConfig', json.data);
                        resolve(json.data)
                    }).catch((e) => {
                        return reject(`Error while fetching apps ` + e.message);
                    })
            })
        },

        fetchAppWebhookConfig: ({ commit, getters }) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyc/verification/webhook-config`;
                // const url = `http://localhost:3001/api/v1/e-kyc/verification/webhook-config/`
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
                return fetch(url, {
                    method: 'GET',
                    headers
                }).then(response => response.json()).then(json => {
                    if (json) {
                        if (json.error) {
                            return reject(new Error(json.error.details.join(' ')))
                        } else {
                            commit('setWebhookConfig', json.data);
                            return resolve()
                        }
                    } else {
                        return resolve()
                    }

                }).catch((e) => {
                    return reject(`Error while fetching widget configuration ` + e.message);
                })
            })
        },

        updateAppWebhookConfig: ({ commit, getters }, payload) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyc/verification/webhook-config/${payload._id}`;
                // const url = `http://localhost:3001/api/v1/e-kyc/verification/webhook-config/${payload._id}`
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
                fetch(url, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify(payload),
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(new Error(json.error.details.join(' ')))
                    }
                    // restting
                    commit('setWebhookConfig', json.data);
                    resolve(json)
                }).catch((e) => {
                    return reject(`Error while fetching apps ` + e.message);
                })
            })
        },


        deleteAppWebhookConfig: ({ commit, getters }, payload) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyc/verification/webhook-config/${payload._id}`;
                // const url = `http://localhost:3001/api/v1/e-kyc/verification/webhook-config/${payload._id}`
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
                fetch(url, {
                    method: 'DELETE',
                    headers,
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(new Error(json.error.details.join(' ')))
                    }
                    // restting
                    commit('setWebhookConfig', {});
                    resolve(json)
                }).catch((e) => {
                    return reject(`Error while fetching apps ` + e.message);
                })
            })
        },

        // KYC webpage config - DUMMY IMPLEMENTATION (Backend calls commented out)
        createKYCWebpageConfig: ({ commit, getters }, payload) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.appId) {
                    return reject(new Error('App ID is not available, service is not selected'))
                }
                const url = `${apiServerBaseUrl}/app/${getters.getSelectedService.appId}/kyc-webpage-config`;
                const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));

                fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload),
                    credentials: 'include'
                }).then(response => response.json())
                    .then(json => {
                        if (json.error) {
                            return reject(new Error(json.message))
                        }
                        commit('setKYCWebpageConfig', json);
                        resolve(json)
                    }).catch((e) => {
                        return reject(`Error while creating KYC webpage configuration: ` + e.message);
                    })
            });
        },

        fetchKYCWebpageConfig: ({ commit, getters }) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.appId) {
                    return reject(new Error('App ID is not available, service is not selected'))
                }
                const url = `${apiServerBaseUrl}/app/${getters.getSelectedService.appId}/kyc-webpage-config`;
                const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));

                return fetch(url, {
                    method: 'GET',
                    headers,
                    credentials: 'include'
                }).then(response => response.json()).then(json => {
                    if (json) {
                        if (json.error) {
                            return reject(new Error(json.message))
                        } else {
                            if (json.expiryType === 'custom' && json.expiryDate) {
                                json.customExpiryDate = json.expiryDate.split('T')[0];
                            }
                            commit('setKYCWebpageConfig', json);
                            return resolve()
                        }
                    } else {
                        return resolve()
                    }
                }).catch((e) => {
                    return reject(`Error while fetching KYC webpage configuration: ` + e.message);
                })
            });
        },

        updateKYCWebpageConfig: ({ commit, getters }, payload) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.appId) {
                    return reject(new Error('App ID is not available, service is not selected'))
                }
                const url = `${apiServerBaseUrl}/app/${getters.getSelectedService.appId}/kyc-webpage-config/${payload._id}`;
                const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));

                fetch(url, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify(payload),
                    credentials: 'include'
                }).then(response => response.json())
                    .then(json => {
                        if (json.error) {
                            return reject(new Error(json.message))
                        }
                        commit('setKYCWebpageConfig', json);
                        resolve(json)
                    }).catch((e) => {
                        return reject(`Error while updating KYC webpage configuration: ` + e.message);
                    })
            });
        },

        deleteKYCWebpageConfig: ({ commit, getters }, payload) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.appId) {
                    return reject(new Error('App ID is not available, service is not selected'))
                }
                const url = `${apiServerBaseUrl}/app/${getters.getSelectedService.appId}/kyc-webpage-config/${payload._id}`;
                const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));

                fetch(url, {
                    method: 'DELETE',
                    headers,
                    credentials: 'include'
                }).then(response => response.json())
                    .then(json => {
                        if (json.error) {
                            return reject(new Error(json.message))
                        }
                        commit('setKYCWebpageConfig', {});
                        resolve({ success: true })
                    }).catch((e) => {
                        return reject(`Error while deleting KYC webpage configuration: ` + e.message);
                    })
            });
        },


        fetchSessionsDetailsById2: ({ commit, getters }, payload) => {
            return new Promise((resolve, reject) => {
                const { sessionId } = payload
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyc/verification/session/${sessionId}`;
                // const url = `http://localhost:3001/api/v1/e-kyc/verification/session/${sessionId}`;
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
                fetch(url, {
                    method: 'GET',
                    headers
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(new Error(json.error?.details.join(' ') || json.error.join(' ')))
                    }

                    if (json.data && Object.keys(json.data)?.length > 0) {
                        commit('updateSessionDetails', json.data);
                        return resolve(json.data)
                    } else {
                        return reject(new Error('Invalid session Id or details not found'))
                    }

                }).catch((e) => {
                    reject(new Error(`Error while fetching apps ` + e.message));
                })
            })
        },


        fetchSessionsDetailsById: ({ getters }, payload) => {
            return new Promise((resolve, reject) => {
                const { sessionId, env } = payload
                let envVal = env
                if (env === '' || env === null || env === undefined) {
                    envVal = 'prod'
                }
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/user/${sessionId}?env=${envVal}`;
                // let url = `http://localhost:3001/api/v1/user/${sessionId}`
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
                fetch(url, {
                    method: 'GET',
                    headers
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(new Error(json.error?.details.join(' ') || json.error.join(' ')))
                    }

                    if (json.data && Object.keys(json.data)?.length > 0) {
                        // commit('updateSessionDetails', json.data);
                        return resolve(json.data)
                    } else {
                        return reject(new Error('Invalid user Id or details not found'))
                    }

                }).catch((e) => {
                    reject(new Error(`Error while fetching userId ` + e.message));
                })
            })
        },
        async fetchUsageForASSIService({ getters }, payload) {
            const { startDate, endDate } = payload
            if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                throw new Error('Tenant url is null or empty, service is not selected')
            }
            const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/usage?serviceId=${getters.getSelectedService.appId}&startDate=${startDate}&endDate=${endDate}`;
            // const url = `http://localhost:3001/api/v1/usage?serviceId=${getters.getSelectedService.appId}&startDate=${startDate}&endDate=${endDate}`;            
            const authToken = getters.getSelectedService.access_token
            const headers = UtilsMixin.methods.getHeader(authToken);
            const resp = await fetch(url, {
                method: 'GET',
                headers
            })
            const json = await resp.json()
            if (json?.data) {
                return json?.data
            } else {
                return json
            }
        },


        async fetchUsageForAService({ getters }, payload) {
            const { startDate, endDate } = payload
            if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                throw new Error('Tenant url is null or empty, service is not selected')
            }
            const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/usage?serviceId=${getters.getSelectedService.appId}&startDate=${startDate}&endDate=${endDate}`;
            // const url = `http://localhost:3001/api/v1/usage?serviceId=${getters.getSelectedService.appId}&startDate=${startDate}&endDate=${endDate}`;            
            const authToken = getters.getSelectedService.access_token
            const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
            const resp = await fetch(url, {
                method: 'GET',
                headers
            })
            const json = await resp.json()
            if (json?.data) {
                return json?.data
            } else {
                return json
            }
        },
        async fetchUsageDetailsForASSIService({ getters, commit }, payload) {
            const { startDate, endDate } = payload
            if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                throw new Error('Tenant url is null or empty, service is not selected')
            }
            const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/usage/detail?serviceId=${getters.getSelectedService.appId}&startDate=${startDate}&endDate=${endDate}`;
            const authToken = getters.getSelectedService.access_token
            const headers = UtilsMixin.methods.getHeader(authToken);
            const resp = await fetch(url, {
                method: 'GET',
                headers
            })
            const json = await resp.json()
            if (json?.data) {
                commit('setUsageDetails', json?.data)
                return json?.data
            } else {
                commit('setUsageDetails', json)
                return json
            }
        },

        async downloadKybUploadedFile({ getters }, payload) {
            const { fileId } = payload
            if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                throw new Error('Tenant url is null or empty, service is not selected')
            }
            const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/document/download/${fileId}`;

            const headers = UtilsMixin.methods.getKycServiceHeader(getters.getSelectedService.kyb_access_token);



            const resp = await fetch(url, {
                method: 'GET',
                headers
            })

            if (!resp.ok) {
                const errorText = await resp.text();
                console.error('Download error response:', errorText);
                throw new Error(`Download failed: ${resp.status} ${resp.statusText} - ${errorText}`);
            }


            const blob = await resp.blob();


            return blob;

        },
        async fetchUsageDetailsForAService({ getters, commit }, payload) {
            const { startDate, endDate } = payload
            if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                throw new Error('Tenant url is null or empty, service is not selected')
            }
            const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/usage/detail?serviceId=${getters.getSelectedService.appId}&startDate=${startDate}&endDate=${endDate}`;
            const authToken = getters.getSelectedService.access_token
            const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
            const resp = await fetch(url, {
                method: 'GET',
                headers
            })
            const json = await resp.json()
            if (json?.data) {
                commit('setUsageDetails', json?.data)
                return json?.data
            } else {
                commit('setUsageDetails', json)
                return json
            }
        },
        async fetchCompanyExecutives({ getters, commit }, payload) {
            const { companyId } = payload
            if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                throw new Error('Tenant url is null or empty, service is not selected')
            }
            if (!companyId) {
                throw new Error('Company Id is null or empty')
            }
            const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyb/verification/company/${companyId}/company-executives`;
            const authToken = getters.getSelectedService.kyb_access_token
            const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
            const resp = await fetch(url, {
                method: 'GET',
                headers
            })
            const json = await resp.json()
            if (json?.data) {
                commit('setCompanyExecutives', json?.data)
                return json?.data
            } else {
                commit('setCompanyExecutives', [])
                return []
            }

        },
        async approveOrRejectVerification({ getters, dispatch }, payload) {
            return new Promise((resolve, reject) => {
                const { companyId, reason, status } = payload;
                if (reason) {
                    // For future use, currently not sent to backend
                    console.log('Reason for rejection:', reason);
                }


                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }

                if (!companyId) {
                    return reject(new Error('Company ID is required'))
                }

                if (!['Approved', 'Rejected'].includes(status)) {
                    return reject(new Error('Invalid status'))
                }

                let url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyb/verification/company/${companyId}`;
                let headers = UtilsMixin.methods.getKycServiceHeader(getters.getSelectedService.kyb_access_token);
                const requestBody = { status };

                const dependentServiceId = getters.getSelectedService.dependentServices[0];
                const ssiService = getters.getAppsWithSSIServices.find(s => s.appId === dependentServiceId);
                const ssiServiceAccessToken = ssiService.access_token
                headers = {
                    ...headers,
                    "X-Ssi-Access-Token": ssiServiceAccessToken
                }

                fetch(url, {
                    method: 'PATCH',
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(new Error(json.error?.details?.join(' ') || json.error?.join?.(' ') || json.error || 'Unknown error'))
                    }

                    // Refresh the companies list after approval/rejection
                    dispatch('fetchAppKybs').then(() => {
                        resolve(json);
                    }).catch((error) => {
                        console.warn('Failed to refresh companies list:', error);
                        resolve(json); // Still resolve the main action
                    });
                }).catch((e) => {
                    return reject(new Error(`Error while company verification: ${e.message}`));
                })
            })

        },
        async checkComplianceStatus({ getters, commit }, payload) {
            const { companyId } = payload
            if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                throw new Error('Tenant url is null or empty, service is not selected')
            }
            if (!companyId) {
                throw new Error('Company Id is null or empty')
            }
            const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/compliance?entityId=${companyId}`;
            const authToken = getters.getSelectedService.kyb_access_token
            const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
            const resp = await fetch(url, {
                method: 'GET',
                headers
            })
            const json = await resp.json()
            if (json?.data) {
                commit('setComplianceData', json?.data)
                return json?.data
            } else {
                commit('setComplianceData', null)
                return json
            }

        },
        // - KYC Credit
        async fetchKYCCredits({ getters, commit }) {

            if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                throw new Error('Tenant url is null or empty, service is not selected')
            }
            const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/credit`;
            const authToken = getters.getSelectedService.access_token
            const headers = UtilsMixin.methods.getKycServiceHeader(authToken);
            const resp = await fetch(url, {
                method: 'GET',
                headers
            })
            const json = await resp.json()
            if (json.data) {
                console.log('Before calling setKycCredits ')
                commit('setKYCCredits', json.data)
                return json.data
            }
            return []
        },


        activateCredit({ getters, dispatch }, payload) {
            return new Promise(function (resolve, reject) {
                const { creditId } = payload
                {
                    if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }

                    if (!creditId) {
                        return reject(new Error('Credit Id is null or empty'))
                    }
                    const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/credit/${creditId}/activate`;
                    const options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "x-kyc-access-token": `${getters.getSelectedService.access_token}`,
                            "Origin": '*'
                        }
                    }
                    fetch(url, {
                        ...options
                    })
                        .then(response => response.json())
                        .then(json => {
                            if (json) {
                                dispatch('fetchKYCCredits')
                                resolve()
                            } else {
                                reject(new Error('Could not register DID for this service'))
                            }
                        }).catch(e => {
                            reject(e)
                        })
                }
            })

        },


        // --- SSI
        fetchDIDsForAService({ commit, getters, dispatch }, payload = {}) {
            return new Promise(function (resolve, reject) {
                {
                    let tenantUrl = ''
                    let accessToken = ""
                    if (payload && payload.tenantUrl && payload.accessToken) {
                        tenantUrl = payload.tenantUrl
                        accessToken = payload.accessToken

                    } else if (getters.getSelectedService && getters.getSelectedService.tenantUrl && getters.getSelectedService.access_token) {
                        tenantUrl = getters.getSelectedService.tenantUrl;
                        accessToken = getters.getSelectedService.access_token
                    } else {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }

                    const url = `${sanitizeUrl(tenantUrl)}/api/v1/did?page=1&limit=100`;
                    const options = {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`,
                            "Origin": '*'
                        }
                    }
                    fetch(url, {
                        headers: options.headers
                    })
                        .then(response => response.json())
                        .then(json => {
                            if (json) {
                                if (json.error) {
                                    reject(new Error(json.message[0]))
                                }
                                if (json.data.length > 0) {
                                    const payload = json.data.map(x => {
                                        return {
                                            did: x,
                                            didDocument: {},
                                            status: ""
                                        }
                                    })

                                    if (getters.getSelectedService) {
                                        json.data.map(x => {
                                            return dispatch('resolveDIDForAService', x)
                                        })
                                        commit('setDIDList', payload)
                                    }

                                    resolve(json.data)
                                }
                                else {
                                    resolve([])
                                    commit('setDIDList', [])
                                }
                            } else {
                                reject(new Error('Could not fetch DID for this service'))
                            }

                        }).catch(e => {
                            reject(e)
                        })
                }
            })

        },



        resolveDIDForAKycService({ getters, }, payload = {}) {
            return new Promise(function (resolve, reject) {
                {
                    let tenantUrl = ""
                    let accessToken = ""
                    if (payload && payload.tenantUrl && payload.accessToken) {
                        tenantUrl = payload.tenantUrl
                        accessToken = payload.accessToken

                    } else if (getters.getSelectedService && getters.getSelectedService.tenantUrl && getters.getSelectedService.access_token) {
                        tenantUrl = getters.getSelectedService.tenantUrl;
                        accessToken = getters.getSelectedService.access_token
                    } else {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }
                    if (!payload.did) {
                        throw new Error("could not resolve did");

                    }
                    const url = `${sanitizeUrl(tenantUrl)}/api/v1/did/resolve/${payload.did}`;
                    const options = {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`,
                            "Origin": '*'
                        }
                    }
                    fetch(url, {
                        headers: options.headers
                    })
                        .then(response => response.json())
                        .then(json => {

                            if (json) {
                                if (json.error) {
                                    reject(new Error(json.message[0]))
                                }
                                resolve(json.didDocument)
                            } else {
                                reject(new Error('Could not resolve'))
                            }

                        }).catch(e => {
                            reject(e)
                        })
                }
            })

        },
        resolveDIDForAService({ commit, getters, }, payload) {
            return new Promise(function (resolve, reject) {
                {

                    let selectedService = {};
                    if (getters.getSelectedService.services[0].id === 'SSI_API') {
                        selectedService = getters.getSelectedService
                    } else if (getters.getSelectedService.services[0].id === 'CAVACH_API') {
                        const ssiSserviceId = getters.getSelectedService.dependentServices[0];
                        const associatedSSIService = getters.getAppsWithSSIServices.find(
                            (x) => x.appId === ssiSserviceId
                        );
                        selectedService = associatedSSIService
                    }

                    if (!selectedService || !selectedService.tenantUrl) {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }

                    const url = `${sanitizeUrl(selectedService.tenantUrl)}/api/v1/did/resolve/${payload}`;
                    // const url = `http://ent-8ee83cc.localhost:3003/api/v1/did/resolve/${payload}`;
                    const options = {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${selectedService.access_token}`,
                            "Origin": '*'
                        }
                    }
                    fetch(url, {
                        headers: options.headers
                    })
                        .then(response => response.json())
                        .then(json => {
                            if (json) {
                                if (json.error) {
                                    reject(new Error(json.message[0]))
                                }
                                const data = {
                                    did: payload,
                                    didDocument: json.didDocument,
                                    status: json.didDocumentMetadata && Object.keys(json.didDocumentMetadata).length > 0 ? 'Registered' : 'Created',
                                    name: json.name
                                }
                                commit('updateADID', data);
                                resolve()
                            } else {
                                reject(new Error('Could not fetch DID for this service'))
                            }

                        }).catch(e => {
                            reject(e)
                        })
                }
            })

        },
        createDIDsForAService({ commit, getters, dispatch }, payload) {
            return new Promise(function (resolve, reject) {
                {
                    // const payload = data.requestBody
                    if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }
                    const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/did/create`;
                    const options = {
                        method: "POST",
                        body: JSON.stringify(payload),
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${getters.getSelectedService.access_token}`,
                            "Origin": '*'
                        }
                    }
                    fetch(url, {
                        ...options
                    })
                        .then(response => response.json())
                        .then(async json => {
                            if (json.error) {
                                reject(new Error(json.message[0]))
                            }
                            if (json && json.did) {
                                commit('insertDIDList', {
                                    did: json.did,
                                    didDocument: {},
                                    status: 'Created'
                                })
                                dispatch('resolveDIDForAService', json.did)
                                resolve(json)
                            } else {
                                reject(new Error('Could not create DID for this service'))
                            }
                        }).catch(e => {
                            reject(e)
                        })
                }
            })

        },

        registerDIDsForAService({ commit, getters }, payload) {
            return new Promise(function (resolve, reject) {
                const body = {
                    didDocument: payload.didDocument,
                    signInfos: payload.signInfos,
                };
                {
                    if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }
                    const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/did/register/v2`;
                    const options = {
                        method: "POST",
                        body: JSON.stringify(body),
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${getters.getSelectedService.access_token}`,
                            "Origin": '*'
                        }
                    }
                    fetch(url, {
                        ...options
                    })
                        .then(response => response.json())
                        .then(async json => {
                            if (json) {
                                // dispatch('resolveDIDForAService', json.did)
                                const data = {
                                    did: json.did,
                                    didDocument: json?.metaData?.didDocument,
                                    status: json.didDocumentMetadata && Object.keys(json.didDocumentMetadata).length > 0 ? 'Registered' : 'Created',
                                    name: json.name
                                }
                                commit('updateADID', data)
                                resolve(json)
                            } else {
                                reject(new Error('Could not register DID for this service'))
                            }
                        }).catch(e => {
                            reject(e)
                        })
                }
            })

        },

        checkBlockchainStatusOfSSI({ getters }, payload) {
            return new Promise(function (resolve, reject) {
                {
                    if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }
                    const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/status/ssi/${payload}?page=1&limit=10`;
                    const options = {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${getters.getSelectedService.access_token}`,
                            "Origin": '*'
                        }
                    }
                    fetch(url, {
                        ...options
                    })
                        .then(response => response.json())
                        .then(json => {
                            if (json) {
                                resolve(json)
                            } else {
                                reject(new Error('Could not get SSI status of id ' + payload))
                            }
                        }).catch(e => {
                            reject(e)
                        })
                }
            })

        },

        updateDIDsForAService({ getters, }, payload) {
            return new Promise(function (resolve, reject) {
                let body;
                if (payload.didDocument) {
                    body = {
                        "didDocument": payload.didDocument,
                        "verificationMethodId": payload.verificationMethodId,
                        "deactivate": payload.deactivate
                    }
                } else {
                    if (!payload.name || payload.name == '') {
                        return reject(new Error('Please Provide name for the did'))
                    }
                    body = { ...payload }
                }
                //fetct all dids
                {
                    if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }
                    // const url = `http://ent-2af45c1.localhost:4001/api/v1/did/`;
                    const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/did/`;
                    const options = {
                        method: "PATCH",
                        body: JSON.stringify(body),
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${getters.getSelectedService.access_token}`,
                            "Origin": '*'
                        }
                    }
                    fetch(url, {
                        ...options
                    })
                        .then(response => response.json())
                        .then(json => {
                            if (json) {
                                //dispatch('resolveDIDForAService', json.did)
                                resolve()
                            } else {
                                reject(new Error('Could not register DID for this service'))
                            }
                        }).catch(e => {
                            reject(e)
                        })
                }
            })

        },

        // eslint-disable-next-line 
        async ssiDashboardTxStats({ getters }, payload) {

            if (!payload.wallet) {
                // throw new Error('Wallet must be passed to pull transactions')
                payload.wallet = getters.getSelectedService.walletAddress
            }

            const getDayKey = (date) => {
                const d = new Date(date);
                return d.toISOString().split('T')[0];
            };

            const groupByDay = (data) => {
                return data.reduce((acc, item) => {
                    const dayKey = getDayKey(item.timestamp);
                    if (!acc[dayKey]) {
                        acc[dayKey] = 0;
                    }
                    acc[dayKey]++;
                    return acc;
                }, {});
            };

            const getWeekStart = (date) => {
                const d = new Date(date);
                const day = d.getDay();
                const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
                return new Date(d.setDate(diff)).toISOString().split('T')[0];
            };

            const groupByWeek = (data) => {
                return data.reduce((acc, item) => {
                    const weekStart = getWeekStart(item.timestamp);
                    if (!acc[weekStart]) {
                        acc[weekStart] = 0;
                    }
                    acc[weekStart]++;
                    return acc;
                }, {});
            };

            const countByProperty = (array, property) => {
                return array.reduce((acc, obj) => {
                    const key = obj[property];
                    if (!acc[key]) {
                        acc[key] = 0;
                    }
                    acc[key]++;
                    return acc;
                }, {});
            };

            const sorted = (a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp)
            }

            async function callApi() {
                const wallet = payload.wallet
                let txApi = `https://api.prajna.hypersign.id/cosmos/tx/v1beta1/txs?order_by=2&events=message.sender='${wallet}'&pagination.limit=5000&pagination.offset=0`
                const resp = await fetch(txApi)
                const json = await resp.json()
                return json
            }


            const result = await callApi()
            const { tx_responses } = result

            let dids = []
            let credentials = []
            let schemas = []

            if (tx_responses && tx_responses.length > 0) {
                tx_responses.forEach(eachResp => {
                    const { timestamp, tx } = eachResp
                    const { body } = tx;
                    const { messages } = body;
                    if (messages && messages.length > 0) {
                        messages.forEach(eachMessage => {
                            const { msgs } = eachMessage
                            if (msgs && msgs.length > 0) {
                                const type = msgs[0]['@type']
                                if (type === ('/hypersign.ssi.v1.MsgRegisterDID' || '/hypersign.ssi.v1.MsgUpdateDID' || '/hypersign.ssi.v1.MsgDeactivateDID')) {
                                    dids.push({
                                        timestamp,
                                        type
                                    })
                                } else if (type === ('/hypersign.ssi.v1.MsgRegisterCredentialStatus' || '/hypersign.ssi.v1.MsgUpdateCredentialStatus')) {
                                    credentials.push({
                                        timestamp,
                                        type
                                    })
                                } else if (type === ('/hypersign.ssi.v1.MsgRegisterCredentialSchema')) {
                                    schemas.push({
                                        timestamp,
                                        type
                                    })
                                }
                            }
                        })
                    }
                });
            }


            let did_data = {};
            let cred_data = {};
            let schema_data = {};



            const sorted_did_data = dids.sort(sorted);
            const sorted_creds_data = credentials.sort(sorted);
            const sorted_schema_data = schemas.sort(sorted);



            if (!payload.groupBy) {
                payload.groupBy = 'daily'
            }

            if (payload.groupBy === 'daily') {
                did_data = groupByDay(sorted_did_data);
                cred_data = groupByDay(sorted_creds_data);
                schema_data = groupByDay(sorted_schema_data);

            } else if (payload.groupBy === 'weekly') {
                did_data = groupByWeek(sorted_did_data);
                cred_data = groupByWeek(sorted_creds_data);
                schema_data = groupByWeek(sorted_schema_data);

            } else if (payload.groupBy === 'count') {
                did_data = countByProperty(sorted_did_data, 'timestamp');
                cred_data = countByProperty(sorted_creds_data, 'timestamp');
                schema_data = countByProperty(sorted_schema_data, 'timestamp');
            }

            return {
                did_data,
                cred_data,
                schema_data
            }

        },

        // eslint-disable-next-line 
        async fetchSSICredits({ getters, commit }) {
            if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                throw new Error('Tenant url is null or empty, service is not selected')
            }
            const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/credit`;
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getters.getSelectedService.access_token}`,
                    "Origin": '*'

                }
            }

            const resp = await fetch(url, {
                ...options
            })
            const json = await resp.json()
            if (json) {
                commit('setSSICredits', json)
                return json
            }
            return []
        },

        activateSSICredit({ getters, dispatch }, payload) {
            return new Promise(function (resolve, reject) {
                const { creditId } = payload
                {
                    if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }

                    if (!creditId) {
                        return reject(new Error('Credit Id is null or empty'))
                    }
                    const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/credit/${creditId}/activate`;
                    const options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${getters.getSelectedService.access_token}`,
                            "Origin": '*'
                        }
                    }
                    fetch(url, {
                        ...options
                    })
                        .then(response => response.json())
                        .then(json => {
                            if (json) {
                                dispatch('fetchSSICredits')
                                resolve()
                            } else {
                                reject(new Error('Could not Activate credit for this service'))
                            }
                        }).catch(e => {
                            reject(e)
                        })
                }
            })

        },
        // eslint-disable-next-line 
        async ssiDashboardAllowanceStats({ getters }, payload) {

            if (!payload.wallet) {
                // throw new Error('Wallet must be passed to pull transactions')
                payload.wallet = getters.getSelectedService.walletAddress
            }

            async function callApi() {
                const wallet = payload.wallet
                const granterWallet = "hid10d36jvc7regxe6npw8gxvrzap7lcrnrpjfwmal"; //TODO need to take this variable in env
                let txApi = `https://api.prajna.hypersign.id/cosmos/feegrant/v1beta1/allowance/${granterWallet}/${wallet}`
                const resp = await fetch(txApi)
                const json = await resp.json()
                return json
            }

            const data = await callApi()

            if (data.code && data.code === 13) {
                throw new Error(data.message)
            }

            return data.allowance
        },

        // eslint-disable-next-line 
        async ssiDashboardGrantsStats({ getters }, payload) {

            if (!payload.wallet) {
                // throw new Error('Wallet must be passed to pull transactions')
                payload.wallet = getters.getSelectedService.walletAddress
            }

            async function callApi() {
                const wallet = payload.wallet
                let txApi = `https://api.prajna.hypersign.id/cosmos/authz/v1beta1/grants/grantee/${wallet}`
                const resp = await fetch(txApi)
                const json = await resp.json()
                return json
            }

            const data = await callApi()

            // const { allowance } = data;
            if (data.grants && data.grants.length == 0) {
                throw new Error('No grants found for this wallet')
            }

            return data.grants
        },

        // eslint-disable-next-line 
        generateDIDProof({ commit, getters, dispatch }, payload) {
            return new Promise(function (resolve, reject) {
                {

                    let selectedService = {};
                    if (getters.getSelectedService.services[0].id === 'SSI_API') {
                        selectedService = getters.getSelectedService
                    } else if (getters.getSelectedService.services[0].id === 'CAVACH_API') {
                        const ssiSserviceId = getters.getSelectedService.dependentServices[0];
                        const associatedSSIService = getters.getAppsWithSSIServices.find(
                            (x) => x.appId === ssiSserviceId
                        );
                        selectedService = associatedSSIService
                    } else {
                        throw new Error('Proof can not be generated for service')
                    }


                    if (!selectedService || !selectedService.tenantUrl) {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }

                    const url = `${sanitizeUrl(selectedService.tenantUrl)}/api/v1/did/auth/sign`;
                    const options = {
                        method: "POST",
                        body: JSON.stringify(payload),
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${selectedService.access_token}`,
                            "Origin": '*'
                        }
                    }
                    fetch(url, {
                        ...options
                    })
                        .then(response => response.json())
                        .then(async json => {
                            if (json) {
                                resolve(json)
                            } else {
                                reject(new Error('Could not generate DID proof for this service'))
                            }
                        }).catch(e => {
                            reject(e)
                        })
                }
            })
        },



        // schema

        fetchSchemaList({ commit, getters, dispatch }, payload = {}) {
            return new Promise(function (resolve, reject) {
                {
                    let tenantUrl = ''
                    let accessToken = ""
                    if (payload && payload.tenantUrl && payload.accessToken) {
                        tenantUrl = payload.tenantUrl
                        accessToken = payload.accessToken

                    } else if (getters.getSelectedService && getters.getSelectedService.tenantUrl && getters.getSelectedService.access_token) {
                        tenantUrl = getters.getSelectedService.tenantUrl;
                        accessToken = getters.getSelectedService.access_token
                    } else {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }

                    const url = `${sanitizeUrl(tenantUrl)}/api/v1/schema?page=1&limit=100`;
                    const options = {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`,
                            "Origin": '*'
                        }
                    }
                    fetch(url, {
                        headers: options.headers
                    })
                        .then(response => response.json())
                        .then(json => {
                            if (json) {
                                if (json.data.length > 0) {
                                    const payload = json.data.map(x => {
                                        return {
                                            id: x,
                                            schemaDocument: {},
                                            status: ""
                                        }
                                    })

                                    if (getters.getSelectedService) {
                                        json.data.map(x => {
                                            console.log({ x })
                                            dispatch('resolveSchema', x)
                                        })
                                        commit('setSchemaList', payload)
                                    }

                                    resolve(json.data)
                                } else {
                                    resolve([])
                                    commit('setSchemaList', [])
                                }
                            } else {
                                reject(new Error('Could not fetch DID for this service'))
                            }

                        }).catch(e => {
                            reject(e)
                        })
                }
            })

        },

        async resolveSchema({ commit, getters, }, payload) {
            try {
                let selectedService = {};
                if (getters.getSelectedService.services[0].id === 'SSI_API') {
                    selectedService = getters.getSelectedService
                } else if (getters.getSelectedService.services[0].id === 'CAVACH_API') {
                    const ssiSserviceId = getters.getSelectedService.dependentServices[0];
                    const associatedSSIService = getters.getAppsWithSSIServices.find(
                        (x) => x.appId === ssiSserviceId
                    );
                    selectedService = associatedSSIService
                }

                if (!selectedService || !selectedService.tenantUrl) {
                    throw new Error('Tenant url is null or empty, service is not selected')
                }

                const url = `${sanitizeUrl(selectedService.tenantUrl)}/api/v1/schema/${payload}`;
                // const url = `http://ent-8ee83cc.localhost:3003/api/v1/schema/${payload}`;

                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${selectedService.access_token}`,
                        "Origin": '*'
                    }
                }
                const response = await fetch(url, {
                    headers: options.headers
                })
                const json = await response.json()

                if (json && json.id) {
                    const data = {
                        id: payload,
                        schemaDocument: json,
                        status: json.proof && Object.keys(json.proof).length > 0 ? 'Registered' : 'Created',
                    }
                    commit('updateASchema', data);
                    return data;
                } else {
                    const data = {
                        id: payload,
                        schemaDocument: {},
                        status: 'Error',
                        error: json?.message[0].data
                    }
                    commit('updateASchema', data);
                    return data;
                    //   console.error('Could not fetch Schema for this service id = ' + payload)
                }
            } catch (e) {
                const data = {
                    id: payload,
                    schemaDocument: {},
                    status: 'Error',
                    error: e.message
                }
                commit('updateASchema', data);
                console.error(e)
            }
        },


        createSchemaForAService({ commit, getters }, payload) {
            return new Promise(function (resolve, reject) {
                {
                    // const payload = data.requestBody
                    if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }
                    const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/schema`;
                    const options = {
                        method: "POST",
                        body: JSON.stringify(payload),
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${getters.getSelectedService.access_token}`,
                            "Origin": '*'
                        }
                    }
                    fetch(url, {
                        ...options
                    })
                        .then(response => response.json())
                        .then(async json => {
                            if (json && json.schemaId) {
                                commit('insertSchemaList', {
                                    id: json.schemaId,
                                    schemaDocument: {},
                                    status: 'Please wait...'
                                })
                                //dispatch('resolveSchema', json.schemaId)
                                resolve(json)
                            } else {
                                const message = json?.message?.[0] || 'Could not create schema for this service'
                                reject(new Error(message))
                            }
                        }).catch(e => {
                            reject(e)
                        })
                }
            })

        },

        // credential 
        // eslint-disable-next-line
        fetchCredentialList({ commit, getters, dispatch }, payload = {}) {
            return new Promise(function (resolve, reject) {
                {
                    let tenantUrl = ''
                    let accessToken = ""
                    let page = 1
                    let limit = 20
                    if (payload && payload.tenantUrl && payload.accessToken) {
                        tenantUrl = payload.tenantUrl
                        accessToken = payload.accessToken
                    } else if (getters.getSelectedService && getters.getSelectedService.tenantUrl && getters.getSelectedService.access_token) {
                        tenantUrl = getters.getSelectedService.tenantUrl;
                        accessToken = getters.getSelectedService.access_token
                    } else {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }

                    if (payload && payload.page && payload.limit) {
                        page = payload.page
                        limit = payload.limit
                    }

                    const url = `${sanitizeUrl(tenantUrl)}/api/v1/credential?page=${page}&limit=${limit}`;
                    const options = {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`,
                            "Origin": '*'
                        }
                    }
                    fetch(url, {
                        headers: options.headers
                    })
                        .then(response => response.json())
                        .then(json => {
                            if (json) {
                                if (json.data.length > 0) {
                                    const payload = json.data.map(x => {
                                        return {
                                            id: x.credentialId,
                                            createdAt: x.createdAt,
                                            credentialDocument: {},
                                            credentialStatus: {},
                                            credentialMetadata: {},
                                            status: ""
                                        }
                                    })

                                    if (getters.getSelectedService) {
                                        json.data.map(x => {
                                            dispatch('resolveCredential', { credentialId: x.credentialId })
                                        })
                                        commit('setCredentialList', { credentialList: payload, totalCount: json.totalCount })
                                    }

                                    resolve(json.data)
                                } else {
                                    resolve({ credentialList: [], totalCount: 0 })
                                    commit('setCredentialList', { credentialList: [], totalCount: 0 })
                                }
                            } else {
                                reject(new Error('Could not fetch DID for this service'))
                            }

                        }).catch(e => {
                            reject(e)
                        })
                }
            })

        },


        async resolveCredential({ commit, getters, }, payload) {
            try {
                let selectedService = {};
                if (getters.getSelectedService.services[0].id === 'SSI_API') {
                    selectedService = getters.getSelectedService
                } else if (getters.getSelectedService.services[0].id === 'CAVACH_API') {
                    const ssiSserviceId = getters.getSelectedService.dependentServices[0];
                    const associatedSSIService = getters.getAppsWithSSIServices.find(
                        (x) => x.appId === ssiSserviceId
                    );
                    selectedService = associatedSSIService
                }

                if (!selectedService || !selectedService.tenantUrl) {
                    throw new Error('Tenant url is null or empty, service is not selected')
                }

                const url = `${sanitizeUrl(selectedService.tenantUrl)}/api/v1/credential/${payload.credentialId}?retrieveCredential=${payload.retrieveCredential ? payload.retrieveCredential : false}`;
                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${selectedService.access_token}`,
                        "Origin": '*'
                    }
                }
                const response = await fetch(url, {
                    headers: options.headers
                })
                let json = await response.json()


                if (json && json.metadata) {
                    let status = "";
                    let error = "";
                    if (json.metadata.transactionStatus) {
                        if (json.metadata.transactionStatus.findIndex((x) => x['status'] == 0) >= 0) {
                            status = 'Registered'
                        } else {
                            status = 'Error'
                            error = json.metadata.transactionStatus
                        }
                    } else if (json?.metadata?.registerCredentialStatus) { // this is temporary fix as our transaction server is down. This may lead to incorrect daat in case of registration failure
                        // make call to rpc and check if it is registered
                        const url = `${config.nodeServer.BASE_URL_REST}hypersign-protocol/hidnode/ssi/credential/${payload.credentialId}`
                        const res = await fetch(url);
                        if (!res.ok) {
                            status = 'Created'
                        } else {
                            const data = await res.json();
                            json = {
                                credentialDocument: json.credentialDocument,
                                credentialStatus: data?.credentialStatus?.credentialStatusDocument,
                                metadata: json?.metadata
                            }
                            if (data) status = 'Registered'

                        }
                    } else {
                        status = 'Created'
                    }


                    const data = {
                        id: payload.credentialId,
                        credentialDocument: json.credentialDocument,
                        credentialStatus: json.credentialStatus,
                        credentialMetadata: json.metadata,
                        status: status,
                        error
                    }
                    commit('updateACredential', data);
                }

                // else {
                //     const data = {
                //         id: payload,
                //         credentialDocument: {},
                //         credentialStatus: {},
                //         credentialMetadata: {},
                //         status: 'Error',
                //         error: json?.message[0].data
                //     }
                //     commit('updateACredential', data);

                // }
            } catch (e) {
                const data = {
                    id: payload.credentialId,
                    credentialDocument: {},
                    credentialStatus: {},
                    credentialMetadata: {},
                    status: 'Error',
                    error: e.message
                }
                commit('updateACredential', data);
                console.error(e)
            }
        },

        issueCredentialForAService({ commit, getters }, payload) {
            return new Promise(function (resolve, reject) {
                {
                    // const payload = data.requestBody
                    if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }
                    const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/credential/issue`;
                    const options = {
                        method: "POST",
                        body: JSON.stringify(payload),
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${getters.getSelectedService.access_token}`,
                            "Origin": '*'
                        }
                    }
                    fetch(url, {
                        ...options
                    })
                        .then(response => response.json())
                        .then(async json => {
                            if (json && json.metadata) {
                                const data = {
                                    id: json.metadata.credentialId,
                                    credentialDocument: json.credentialDocument,
                                    credentialStatus: json.credentialStatus,
                                    credentialMetadata: json.metadata,
                                    status: ''//json.proof && Object.keys(json.proof).length > 0 ? 'Registered' : 'Created',
                                }
                                commit('insertCredentialList', data)
                                resolve(data)
                            } else {
                                reject(new Error('Could not issue credential'))
                            }
                        }).catch(e => {
                            reject(e)
                        })
                }
            })

        },
        updateCredentialForAService({ getters }, payload) {
            return new Promise(function (resolve, reject) {
                {
                    if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }
                    const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/credential/status/${payload.credentialId}`;
                    const options = {
                        method: "PATCH",
                        body: JSON.stringify(payload),
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${getters.getSelectedService.access_token}`,
                            "Origin": '*'
                        }
                    }
                    fetch(url, {
                        ...options
                    })
                        .then(response => response.json())
                        .then(async json => {
                            if (json && !json.error) {
                                const data = {
                                    id: json.id,
                                    status: ''//json.proof && Object.keys(json.proof).length > 0 ? 'Registered' : 'Created',
                                }
                                resolve(data)
                            } else {
                                reject(new Error('Could not update credential'))
                            }
                        }).catch(e => {
                            reject(e)
                        })
                }
            })

        },
    }
}

export default mainStore;
