import Vue from 'vue';
import Vuex from 'vuex';
import config from '../config'
import UtilsMixin from '../mixins/utils.js'
import { sanitizeUrl } from '../utils/common.js'
import { RequestHandler } from '../utils/utils.js'

const { apiServer } = config;
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
        appList: [],
        totalAppCount: 0,
        showMainSideNavBar: true,
        serviceList: [],
        sessionList: [],
        selectedServiceId: "",
        didList: [],
        onchainconfigs: [],
        onChainConfig: {},
        isLoggedOut: false,
        widgetConfig: {

        },
        webhookConfig: {},
        marketPlaceApps: [],
        adminMembers: [],
        myInvitions: [],
        allRoles: [],
        usageDetails: {},
        kycCredits: [],
        ssiCredits: [],

        schemaList: [],
        credentialList: []
    },
    getters: {
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
            const user = localStorage.getItem('user')
            if (user) {
                const userParse = JSON.parse(user)
                let { accessList, accessAccount } = userParse;
                if (accessAccount) {
                    accessList = accessAccount.accessList
                }

                return accessList ? accessList.filter(access => access.serviceType === service) : []
            }
        },

        getOnChainConfig: (state) => {
            return state.onChainConfig
        },
        getWidgetnConfig: (state) => {
            return state.widgetConfig
        },
        getWebhookConfig: (state) => {
            return state.webhookConfig
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
        }
    },
    mutations: {
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
            localStorage.setItem("authToken", payload);
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
        setWebhookConfig: (state, payload) => {
            state.webhookConfig = { ...payload }
        },
        setMainSideNavBar: (state, payload) => {
            state.showMainSideNavBar = payload ? payload : false;
        },
        resetMainStore(state) {
            state.appList = [];
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
            state.sessionList = payload
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
            state.credentialList = payload;
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
        }
    },

    actions: {

        /// Member 

        // eslint-disable-next-line no-empty-pattern
        inviteMember: async ({ getters, dispatch }, payload) => {

            const url = `${apiServerBaseUrl}/people/invite`;
            const resp = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    emailId: payload
                }),
                headers: UtilsMixin.methods.getHeader(getters.getAuthToken),
                credentials: 'include', 

            })
            const json = await resp.json();

            if (!resp.ok && Array.isArray(json.message)) {
                console.log(json.message)
                throw new Error(json.message.join(','));
            } else if (!resp.ok && (json.statusCode !== 200 || 201)) {
                throw new Error(json.message)
            }

            dispatch('getPeopleMembers')
            return json;

        },

        // eslint-disable-next-line no-empty-pattern
        acceptInvition: async ({ getters, dispatch }, payload) => {

            const url = `${apiServerBaseUrl}/people/invite/accept/${payload}`;
            const resp = await fetch(url, {
                method: 'POST',
                headers: UtilsMixin.methods.getHeader(getters.getAuthToken),
                credentials: 'include', 
            })
            const json = await resp.json();

            if (!resp.ok && Array.isArray(json.message)) {
                console.log(json.message)
                throw new Error(json.message.join(','));
            } else if (!resp.ok && (json.statusCode !== 200 || 201)) {
                throw new Error(json.message)
            }

            dispatch('getInvitions')
            return json;

        },

        // eslint-disable-next-line no-empty-pattern
        deleteMember: async ({ getters, dispatch }, payload) => {

            const url = `${apiServerBaseUrl}/people/`;
            const resp = await fetch(url, {
                method: 'DELETE',
                body: JSON.stringify({
                    emailId: payload
                }),
                headers: UtilsMixin.methods.getHeader(getters.getAuthToken),
                credentials: 'include', 
            })
            const json = await resp.json();

            if (!resp.ok && Array.isArray(json.message)) {
                console.log(json.message)
                throw new Error(json.message.join(','));
            } else if (!resp.ok && (json.statusCode !== 200 || 201)) {
                throw new Error(json.message)
            }

            dispatch('getPeopleMembers')
            return json;

        },

        getPeopleMembers: async ({ getters, commit }) => {
            const url = `${apiServerBaseUrl}/people`;
            const resp = await fetch(url, {
                method: 'GET',
                headers: UtilsMixin.methods.getHeader(getters.getAuthToken),
                credentials: 'include', 
            })
            const json = await resp.json();

            if (!resp.ok && Array.isArray(json.message)) {
                throw new Error(json.message.join(','));
            }
            commit('setAdminMembers', json)
            return json;

        },

        getInvitions: async ({ getters, commit }) => {
            const url = `${apiServerBaseUrl}/people/invites`;
            const resp = await fetch(url, {
                method: 'GET',
                headers: UtilsMixin.methods.getHeader(getters.getAuthToken),
                credentials: 'include', 
            })
            let json = await resp.json();

            if (!resp.ok && Array.isArray(json.message)) {
                throw new Error(json.message.join(','));
            }

            // sample invitions
            commit('setMyInvitions', json)
            return json;

        },

        attachMemberToARole: async ({ getters, dispatch }, payload) => {

            const url = `${apiServerBaseUrl}/people/roles/attach`;
            const resp = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: UtilsMixin.methods.getHeader(getters.getAuthToken),
                credentials: 'include', 
            })
            const json = await resp.json();

            if (!resp.ok && Array.isArray(json.message)) {
                console.log(json.message)
                throw new Error(json.message.join(','));
            } else if (!resp.ok && (json.statusCode !== 200 || 201)) {
                throw new Error(json.message)
            }

            dispatch('getPeopleMembers')
            return json;

        },

        switchToAdmin: async ({ getters, commit }, payload) => {

            const url = `${apiServerBaseUrl}/people/admin/login`;
            const resp = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: UtilsMixin.methods.getHeader(getters.getAuthToken),
                credentials: 'include', 
            })
            const json = await resp.json();

            if (!resp.ok && Array.isArray(json.message)) {
                console.log(json.message)
                throw new Error(json.message.join(','));
            } else if (!resp.ok && (json.statusCode !== 200 || 201)) {
                throw new Error(json.message)
            }

            //dispatch('getPeopleMembers')

            if (json.authToken) commit('setAuthToken', json.authToken)
            return json;

        },

        /// Roles

        getMyRolesAction: async ({ getters, commit }) => {
            const url = `${apiServerBaseUrl}/roles`;
            const resp = await fetch(url, {
                method: 'GET',
                headers: UtilsMixin.methods.getHeader(getters.getAuthToken),
                credentials: 'include', 
            })
            let json = await resp.json();

            if (!resp.ok && Array.isArray(json.message)) {
                throw new Error(json.message.join(','));
            }
            commit('setAllRoles', json)
            return json;

        },

        createARole: async ({ getters, dispatch }, payload) => {

            const url = `${apiServerBaseUrl}/roles`;
            const resp = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(payload),
                credentials: 'include',
                headers: UtilsMixin.methods.getHeader(getters.getAuthToken),
            })
            const json = await resp.json();

            if (!resp.ok && Array.isArray(json.message)) {
                console.log(json.message)
                throw new Error(json.message.join(','));
            } else if (!resp.ok && (json.statusCode !== 200 || 201)) {
                throw new Error(json.message)
            }

            dispatch('getMyRolesAction')
            return json;

        },

        deleteARole: async ({ getters, dispatch }, payload) => {
            const url = `${apiServerBaseUrl}/roles/${payload}`;
            const resp = await fetch(url, {
                method: 'DELETE',
                credentials: 'include',
                headers: UtilsMixin.methods.getHeader(getters.getAuthToken),
            })
            const json = await resp.json();

            if (!resp.ok && Array.isArray(json.message)) {
                console.log(json.message)
                throw new Error(json.message.join(','));
            } else if (!resp.ok && (json.statusCode !== 200 || 201)) {
                throw new Error(json.message)
            }

            dispatch('getMyRolesAction')
            return json;

        },

        updateARole: async ({ getters, dispatch }, payload) => {
            const url = `${apiServerBaseUrl}/roles/${payload._id}`;
            const resp = await fetch(url, {
                method: 'PATCH',
                body: JSON.stringify(payload),
                credentials: 'include',
                headers: UtilsMixin.methods.getHeader(getters.getAuthToken),
            })
            const json = await resp.json();

            if (!resp.ok && Array.isArray(json.message)) {
                console.log(json.message)
                throw new Error(json.message.join(','));
            } else if (!resp.ok && (json.statusCode !== 200 || 201)) {
                throw new Error(json.message)
            }

            dispatch('getMyRolesAction')
            return json;

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

                const url = `${apiServerBaseUrl}/auth/mfa/generate`;
                const resp = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        authenticatorType
                    }),
                    headers: UtilsMixin.methods.getHeader(getters.getAuthToken)
                })

                const json = await resp.json();

                if (!resp.ok && Array.isArray(json.message)) {
                    throw new Error(json.message.join(','));
                }

                return json;
            } catch (e) {
                throw new Error(e)
            }
        },

        mfaVerify: async ({ getters }, payload) => {
            try {
                const { authenticatorType, twoFactorAuthenticationCode } = payload
                if (!authenticatorType) throw new Error('Authenticator type must be provided')

                if (!twoFactorAuthenticationCode) throw new Error('MFA PIN must be provided')

                const url = `${apiServerBaseUrl}/auth/mfa/verify`;
                const resp = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        authenticatorType,
                        twoFactorAuthenticationCode
                    }),
                    headers: UtilsMixin.methods.getHeader(getters.getAuthToken),
                    credentials: "include"
                })

                const json = await resp.json();

                if (!resp.ok && Array.isArray(json.message)) {
                    throw new Error(json.message.join(','));
                }

                return json;
            } catch (e) {
                throw new Error(e)
            }
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
                    if (x.services[0].id != config.SERVICE_TYPES.QUEST) {
                        return dispatch('keepAccessTokenReadyForApp', {
                            serviceId: x.appId,
                            grant_type: config.GRANT_TYPES_ENUM[x.services[0].id]
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


        keepAccessTokenReadyForApp: ({ commit, getters }, payload) => {
            return new Promise((resolve, reject) => {
                const { serviceId, grant_type } = payload
                const url = `${apiServerBaseUrl}/app/access-control/token?serviceId=${serviceId}&grant_type=${grant_type}`;

                const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
                fetch(url, {
                    method: 'GET',
                    headers,
                    credentials: 'include',
                })
                    .then(response => response.json())
                    .then(json => {

                        if (json.access_token) {
                            const app = getters.getAppByAppId(serviceId)
                            app['access_token'] = json.access_token
                            commit('insertAnApp', app);
                            resolve()
                        } else {
                            reject(new Error(`Could not fetch accesstoken for service   ${serviceId}`))
                        }

                    }).catch((e) => {
                        reject(new Error(`while updating an app  ${e}`))
                    })
            })
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
                const headers = UtilsMixin.methods.getHeader(authToken);
                fetch(url, {
                    method: 'GET',
                    headers
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(new Error(json.error?.details.join(' ') || json.error.join(' ')))
                    }
                    commit('insertSessions', json.data.sessionDetails);
                    resolve()
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
                const headers = UtilsMixin.methods.getHeader(authToken);
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
                const headers = UtilsMixin.methods.getHeader(authToken);
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

        updateAppsOnChainConfig: ({ commit, getters, dispatch }, payload) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyc/verification/onchainkyc-config`;
                // const url = `http://localhost:3001/api/v1/e-kyc/verification/onchainkyc-config`
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getHeader(authToken);
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
                const headers = UtilsMixin.methods.getHeader(authToken);
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
                const headers = UtilsMixin.methods.getHeader(authToken);
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
                const headers = UtilsMixin.methods.getHeader(authToken);
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
                const headers = UtilsMixin.methods.getHeader(authToken);
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


        // webhook config
        createAppWebhookConfig: ({ commit, getters }, payload) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyc/verification/webhook-config`;
                // const url = `http://localhost:3001/api/v1/e-kyc/verification/webhook-config`
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getHeader(authToken);

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
                const headers = UtilsMixin.methods.getHeader(authToken);

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
                const headers = UtilsMixin.methods.getHeader(authToken);
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
                const headers = UtilsMixin.methods.getHeader(authToken);
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
                const headers = UtilsMixin.methods.getHeader(authToken);
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


        fetchSessionsDetailsById: ({ commit, getters }, payload) => {
            return new Promise((resolve, reject) => {
                const { sessionId } = payload
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyc/verification/session/${sessionId}`;
                // const url = `http://localhost:3001/api/v1/e-kyc/verification/session/${sessionId}`;
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getHeader(authToken);
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

        async fetchUsageForAService({ getters }, payload) {
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

        async fetchUsageDetailsForAService({ getters, commit }, payload) {
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

        // - KYC Credit
        async fetchKYCCredits({ getters, commit }) {

            if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                throw new Error('Tenant url is null or empty, service is not selected')
            }
            const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/credit`;
            const authToken = getters.getSelectedService.access_token
            const headers = UtilsMixin.methods.getHeader(authToken);
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
                    if (payload && payload.tenantUrl && payload.accessToken) {
                        tenantUrl = payload.tenantUrl
                        accessToken = payload.accessToken

                    } else if (getters.getSelectedService && getters.getSelectedService.tenantUrl && getters.getSelectedService.access_token) {
                        tenantUrl = getters.getSelectedService.tenantUrl;
                        accessToken = getters.getSelectedService.access_token
                    } else {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }

                    const url = `${sanitizeUrl(tenantUrl)}/api/v1/credential?page=1&limit=100`;
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
                                            credentialDocument: {},
                                            credentialStatus: {},
                                            credentialMetadata: {},
                                            status: ""
                                        }
                                    })

                                    if (getters.getSelectedService) {
                                        json.data.map(x => {
                                            dispatch('resolveCredential', { credentialId: x })
                                        })
                                        commit('setCredentialList', payload)
                                    }

                                    resolve(json.data)
                                } else {
                                    resolve([])
                                    commit('setCredentialList', [])
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
                const json = await response.json()


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
                    } else {
                        status = 'Created'
                    }


                    const data = {
                        id: payload.credentialId,
                        credentialDocument: json.credentialDocument,
                        credentialStatus: json.credentialStatus,
                        credentialMetadata: json.metadata,
                        status: status, //json.metadata.transactionStatus && Object.keys(json.metadata.transactionStatus).length > 0 ? 'Registered' : 'Created',
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
