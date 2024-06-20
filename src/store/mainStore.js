import Vue from 'vue';
import Vuex from 'vuex';
import config from '../config'
import UtilsMixin from '../mixins/utils.js'
import { sanitizeUrl } from '../utils/common.js'

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
    },
    getters: {
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
                const { userAccessList } = userParse;
                return userAccessList ? userAccessList.filter(access => access.serviceType === service) : []
            }
        }
    },
    mutations: {
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
        insertAnApp(state, payload) {
            if (!state.appList.find(x => x.appId === payload.appId)) {
                state.appList.unshift(payload);
            } else {
                this.commit('updateAnApp', payload);
            }
        },
        updateAnApp(state, payload) {
            const tempToUpdateIndex = state.appList.findIndex(x => x.appId === payload.appId);
            Object.assign(state.appList[tempToUpdateIndex], { ...payload });
        },

        insertSessions(state, payload) {
            state.sessionList = payload
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
            console.log('inside setSelectedAppId ' + payload);
            state.selectedServiceId = payload;
        },

        setDIDList(state, payload) {
            state.didList = payload;
        },
        insertDIDList(state, payload) {
            state.didList.push(payload);
        },
        updateADID(state, payload) {
            let index = state.didList.findIndex(x => x.did === payload.did);
            if (index >= 0) {
                Object.assign(state.didList[index], { ...payload });
            } else {
                state.didList.push(payload);
            }
        },
    },
    actions: {

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

        saveAnAppOnServer: ({ commit }, payload) => {
            return new Promise((resolve, reject) => {
                const url = `${apiServerBaseUrl}/app`;

                const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
                fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                })
                    .then(response => response.json())
                    .then(json => {
                        if (json.statusCode && (json.statusCode != (200 || 201))) {
                            reject(json.message)
                        } else if (json.error) {
                            reject(json)
                        } else {
                            commit('insertAnApp', json);
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
                    body: JSON.stringify(payload)
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

        fetchAppsListFromServer: ({ commit, dispatch }) => {

            // TODO: Get list of orgs 
            const url = `${apiServerBaseUrl}/app`;
            // TODO: // use proper authToken
            const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
            return fetch(url, {
                headers
            }).then(response => response.json()).then(json => {
                if (json.error) {
                    throw new Error(json)
                }
                commit('insertAllApps', json);
                json.data.map(x => {
                    return dispatch('keepAccessTokenReadyForApp', {
                        serviceId: x.appId,
                        grant_type: config.GRANT_TYPES_ENUM[x.services[0].id]
                    })
                })
            }).catch((e) => {
                console.error(`Error while fetching apps ` + e.message);
            })

        },

        keepAccessTokenReadyForApp: ({ commit, getters }, payload) => {
            return new Promise((resolve, reject) => {
                const { serviceId, grant_type } = payload
                const url = `${apiServerBaseUrl}/app/access-control/token?serviceId=${serviceId}&grant_type=${grant_type}`;

                const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
                fetch(url, {
                    method: 'GET',
                    headers,
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

        fetchServicesList: ({ commit }) => {
            // TODO: Get list of orgs 
            const url = `${apiServerBaseUrl}/services`;
            // TODO: // use proper authToken
            const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
            fetch(url, {
                headers
            }).then(response => response.json()).then(json => {
                if (json.error) {
                    throw new Error(json)
                }
                console.log(json)
                commit('insertAllServices', json);
            }).catch((e) => {
                console.error(`Error while fetching apps ` + e.message);
            })
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

        fetchAppsUsersSessions: ({ commit, getters }) => {
            return new Promise((resolve, reject) => {
                if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                    return reject(new Error('Tenant url is null or empty, service is not selected'))
                }
                const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/e-kyc/verification/session`;
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getHeader(authToken);
                fetch(url, {
                    method: 'GET',
                    headers
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(json)
                    }
                    commit('insertSessions', json.sessionDetails.reverse());
                    resolve()
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
                const authToken = getters.getSelectedService.access_token
                const headers = UtilsMixin.methods.getHeader(authToken);
                fetch(url, {
                    method: 'GET',
                    headers
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(json)
                    }
                    commit('updateSessionDetails', json);
                    return resolve(json)
                }).catch((e) => {
                    console.error(`Error while fetching apps ` + e.message);
                })
            })
        },

        async fetchUsageForAService({ getters }, payload) {
            const { startDate, endDate } = payload
            if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                throw new Error('Tenant url is null or empty, service is not selected')
            }
            const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/usage?serviceId=${getters.getSelectedService.appId}&startDate=${startDate}&endDate=${endDate}`;
            const authToken = getters.getSelectedService.access_token
            const headers = UtilsMixin.methods.getHeader(authToken);
            const resp = await fetch(url, {
                method: 'GET',
                headers
            })

            console.log(resp)
            const json = await resp.json()
            return json
        },

        // --- SSI
        fetchDIDsForAService({ commit, getters, dispatch }) {
            return new Promise(function (resolve, reject) {
                {
                    if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }
                    const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/did?page=1&limit=10`;
                    const options = {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${getters.getSelectedService.access_token}`,
                            "Origin": '*'
                        }
                    }
                    fetch(url, {
                        headers: options.headers
                    })
                        .then(response => response.json())
                        .then(json => {
                            if (json) {
                                const payload = json.data.map(x => {
                                    return {
                                        did: x,
                                        didDocument: {},
                                        status: ""
                                    }
                                })

                                json.data.map(x => {
                                    return dispatch('resolveDIDForAService', x)
                                })
                                commit('setDIDList', payload)
                                // allPromises();
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

        resolveDIDForAService({ commit, getters, }, payload) {
            return new Promise(function (resolve, reject) {
                {

                    if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }
                    const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/did/resolve/${payload}`;
                    const options = {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${getters.getSelectedService.access_token}`,
                            "Origin": '*'
                        }
                    }
                    fetch(url, {
                        headers: options.headers
                    })
                        .then(response => response.json())
                        .then(json => {
                            if (json) {
                                const data = {
                                    did: payload,
                                    didDocument: json.didDocument,
                                    status: Object.keys(json.didDocumentMetadata).length > 0 ? 'Registered' : 'Created',
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
                            if (json && json.did) {
                                commit('insertDIDList', {
                                    did: json.did,
                                    didDocument: {},
                                    status: 'Created'
                                })
                                const payload = {
                                    didDocument: json.metaData.didDocument,
                                    verificationMethodId: json.metaData.didDocument.verificationMethod[0].id
                                }
                                await dispatch('registerDIDsForAService', payload)
                                resolve()
                            } else {
                                reject(new Error('Could not create DID for this service'))
                            }
                        }).catch(e => {
                            reject(e)
                        })
                }
            })

        },

        registerDIDsForAService({ getters, dispatch }, payload) {
            return new Promise(function (resolve, reject) {
                const body = {
                    "didDocument": payload.didDocument,
                    "verificationMethodId": payload.verificationMethodId
                }
                //fetct all dids
                {
                    if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }
                    const url = `${sanitizeUrl(getters.getSelectedService.tenantUrl)}/api/v1/did/register`;
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
                        .then(json => {
                            if (json) {
                                dispatch('resolveDIDForAService', json.did)
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

        updateDIDsForAService({ getters, }, payload) {
            return new Promise(function (resolve, reject) {
                const body = {
                    "didDocument": payload.didDocument,
                    "verificationMethodId": payload.verificationMethodId,
                    "deactivate": payload.deactivate
                }
                //fetct all dids
                {
                    if (!getters.getSelectedService || !getters.getSelectedService.tenantUrl) {
                        return reject(new Error('Tenant url is null or empty, service is not selected'))
                    }
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

        }
    }
}

export default mainStore;
