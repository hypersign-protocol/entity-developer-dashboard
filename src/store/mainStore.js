import Vue from 'vue';
import Vuex from 'vuex';
import config from '../config'
import UtilsMixin from '../mixins/utils.js'
import { sanitizeUrl } from '../utils/common.js'

const { apiServer } = config;
const apiServerBaseUrl = sanitizeUrl(apiServer.host) + apiServer.basePath;
Vue.use(Vuex)

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
            console.log({ sessionIndexToUpdate });
            if (sessionIndexToUpdate > -1) {
                console.log('updating sessionList')
                state.sessionList[sessionIndexToUpdate] = payload
            } else {
                state.sessionList.unshift(payload)
            }
        }


    },
    actions: {

        login: ({ commit }, payload) => {
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
        fetchAppsListFromServer: ({ commit }) => {
            // TODO: Get list of orgs 
            const url = `${apiServerBaseUrl}/app`;
            // TODO: // use proper authToken
            const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
            fetch(url, {
                headers
            }).then(response => response.json()).then(json => {
                if (json.error) {
                    reject(json)
                }
                commit('insertAllApps', json);
            }).catch((e) => {
                console.error(`Error while fetching apps ` + e.message);
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
                    reject(json)
                }
                console.log(json)
                commit('insertAllServices', json);
            }).catch((e) => {
                console.error(`Error while fetching apps ` + e.message);
            })
        },
        generateAPISecretKey: ({ commit }, payload) => {
            return new Promise((resolve, reject) => {
                const { appId } = payload;
                if (!appId) {
                    reject(new Error(`appId is not specified`))
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
                            reject(json)
                        }
                        resolve(json)
                    }).catch((e) => {
                        reject(new Error(`while generating new secret key app  ${e}`))
                    })
            })
        },

        fetchAppsUsersSessions: ({ commit }, payload) => {
            // TODO: Get list of orgs 
            const url = `http://ent-0b22db9.localhost:3001/api/v1/e-kyc/verification/session`;
            // TODO: // use proper authToken
            const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjA3ZjE4Zjg2MTk0MmRmNzM2NDQzZmM0MDg1MDUwMTliMDYwMSIsInVzZXJJZCI6ImI2ZDQyMWNkLThkNGQtNDhmZC05ZTQ4LTA0NjQ0MWM0M2RhNCIsImdyYW50VHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsImttc0lkIjoiaHM6ZG9jOmpuZm05ZzV6bzNmLXhqN3hiN3c4cGNybHFrN2lhZWpxem52N2NkbnpiZm8iLCJ3aGl0ZWxpc3RlZENvcnMiOlsiKiJdLCJzdWJkb21haW4iOiJlbnQtMGIyMmRiOSIsImVkdklkIjoiaHM6ZGV2ZWxvcGVyLWRhc2hib2FyZDphcHA6MDdmMThmODYxOTQyZGY3MzY0NDNmYzQwODUwNTAxOWIwNjAxIiwiaWF0IjoxNzA2ODQ5ODUyLCJleHAiOjE3NjY4NjQyNzJ9.4hhaA9UP3nZ2bI4TiRXrjLqXYZVeqKvJG9BUHWH515g'
            const headers = UtilsMixin.methods.getHeader(authToken);
            fetch(url, {
                method: 'GET',
                headers
            }).then(response => response.json()).then(json => {
                if (json.error) {
                    reject(json)
                }
                commit('insertSessions', json.sessionDetails);
            }).catch((e) => {
                console.error(`Error while fetching apps ` + e.message);
            })
        },


        fetchSessionsDetailsById: ({ commit }, payload) => {
            return new Promise((resolve, reject) => {
                // TODO: Get list of orgs 
                const { sessionId } = payload
                const url = `http://ent-0b22db9.localhost:3001/api/v1/e-kyc/verification/session/${sessionId}`;
                // TODO: // use proper authToken
                const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjA3ZjE4Zjg2MTk0MmRmNzM2NDQzZmM0MDg1MDUwMTliMDYwMSIsInVzZXJJZCI6ImI2ZDQyMWNkLThkNGQtNDhmZC05ZTQ4LTA0NjQ0MWM0M2RhNCIsImdyYW50VHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsImttc0lkIjoiaHM6ZG9jOmpuZm05ZzV6bzNmLXhqN3hiN3c4cGNybHFrN2lhZWpxem52N2NkbnpiZm8iLCJ3aGl0ZWxpc3RlZENvcnMiOlsiKiJdLCJzdWJkb21haW4iOiJlbnQtMGIyMmRiOSIsImVkdklkIjoiaHM6ZGV2ZWxvcGVyLWRhc2hib2FyZDphcHA6MDdmMThmODYxOTQyZGY3MzY0NDNmYzQwODUwNTAxOWIwNjAxIiwiaWF0IjoxNzA2ODQ5ODUyLCJleHAiOjE3NjY4NjQyNzJ9.4hhaA9UP3nZ2bI4TiRXrjLqXYZVeqKvJG9BUHWH515g'
                const headers = UtilsMixin.methods.getHeader(authToken);
                fetch(url, {
                    method: 'GET',
                    headers
                }).then(response => response.json()).then(json => {
                    if (json.error) {
                        return reject(json)
                    }
                    commit('updateSessionDetails', json);
                    resolve(json)
                }).catch((e) => {
                    console.error(`Error while fetching apps ` + e.message);
                })
            })
        },
    }
}

export default mainStore;
