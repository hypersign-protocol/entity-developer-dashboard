import config from '../config'
import UtilsMixin from '../mixins/utils.js'

const playgroundStore = {
    namespaced: true,
    mixin:[UtilsMixin],
    state: {
        containerShift:false,
        schemaList: [],
        vcList: [],
        templateList: [],
        orgList: [],
        selectedOrgDid: "",
        showSideNavbar:false,
        userProfile:{
            details:{
              name: '',
              email: '',
              did: '',
            },
            count: {
                credentialsCount:0,
                orgsCount:0,
                schemasCount:0,
                templatesCount:0,
            }
        }
    },
    getters: {
        vcList(state) {
            return state.vcList
        },
        userDetails(state) {
            return state.userProfile.details
        },
        allMetricsData(state) {
            return state.userProfile.count
        },
        sideNavStatus(state) {
            return state.showSideNavbar
        },
        isAnyOrgSelected(state) {
            return state.selectedOrgDid != "" ? true : false
        },
        totalSchemas(state) {
            return state.schemaList.length;
        },
        totalCredentials(state) {
            return state.vcList.length;
        },
        totalTemplateCount(state) {
            return state.templateList.length;
        },
        totalOrgList(state) {
            return state.orgList.length;
        },
        findSchemaBySchemaID: (state) => (schemaId) => {
            return state.schemaList.find(x => x.schemaId === schemaId);
        },
        findOrgByOrgID: (state) => (orgDid) => {
            return state.orgList.find(x => x._id === orgDid);
        },
        getSelectedOrg: (state) => {
            return state.orgList.find(x => x._id === state.selectedOrgDid)
        },
        listOfAllSchemaOptions(state) {
            let schemaIdnames = state.schemaList.map(x => {
                if (x.schemaId && x.schemaId !== undefined && x.status === 'Registered') {
                    return {
                        text: x.schemaDetails.name + ' '+ `{${UtilsMixin.methods.truncate(x.schemaId,60)}}`,
                        value: x.schemaId
                    }
                } else {
                    return null
                }
            })
            // filtering empty object
            schemaIdnames = schemaIdnames.filter(x => x)
            schemaIdnames.unshift({ value: null, text: "Please select a schema" })
            return schemaIdnames;
        },
        listOfPresentationTemplateOptions(state) {
            let schemaIdnames = state.templateList.map(x => {
                return { value: x._id, text: `${x.name} (${x._id})`  }
            })
            schemaIdnames.unshift({ value: null, text: "Please select a Presentation Template" })
            return schemaIdnames;
        }
    },
    mutations: {
        resetStore(state){
            state.orgList=[]
            state.schemaList=[]
            state.vcList=[]
            state.templateList=[]
            state.selectedOrgDid=""
            state.showSideNavbar=false
            state.userProfile = {
                details:{
                  name: '',
                  email: '',
                  did: '',
                },
                count: {
                    credentialsCount:0,
                    orgsCount:0,
                    schemasCount:0,
                    templatesCount:0,
                }
            }
        },
        increaseOrgDataCount(state,payload) {            
            state.orgList.find((x)=>{
                if(x._id === state.selectedOrgDid){                    
                    x[payload] += 1                    
                }
            })
        },
        DecreaseOrgTemplateCount(state,payload) {
            state.orgList.find((x)=>{
                if(x._id === state.selectedOrgDid){
                    if(x[payload]!==0){
                    x[payload] -= 1
                    }            
                                 
                }
            })
        },
        shiftContainer(state,payload) {
            state.containerShift = payload
        },
        increaseOrgCount(state) {
            state.userProfile.count.orgsCount +=1;
        },
        addUserDetailsToProfile(state,payload) {
            state.userProfile.details.name = payload.name;
            state.userProfile.details.email = payload.email;
            state.userProfile.details.did = payload.id
        },
        addCountDataToProfile(state,payload) {
            state.userProfile.count = { ...payload }
        },
        selectAnOrg(state, orgDid) {
            state.selectedOrgDid = orgDid;
        },
        updateSideNavStatus(state,payload) {
            state.showSideNavbar = payload
        },
        insertAschema(state, payload) {
            if (!state.schemaList.find(x => x._id === payload._id)) {
                state.schemaList.push(payload);
            } else {
                console.log('already exists scheme id =' + payload._id);
            }
        },
        insertAnOrg(state, payload) {
            if (!state.orgList.find(x => x._id === payload._id)) {
                state.orgList.push(payload);
            } 
        },
        updateAschema(state, payload) {
            let index = state.schemaList.findIndex(x => x._id === payload._id);
            if(index >= 0){
                Object.assign(state.schemaList[index], {...payload});
            } else {
                state.schemaList.push(payload);
            }
        },
        updateAnOrg(state, payload) {
            const orgToUpdateIndex = state.orgList.findIndex(x => x._id === payload._id);
            if(orgToUpdateIndex >= 0){
                Object.assign(state.orgList[orgToUpdateIndex], {...payload});
            } else {
                state.orgList.push(payload);
            }
        },
        insertApresentationTemplate(state, payload) {
            if (!state.templateList.find(x => x._id === payload._id)) {
                state.templateList.push(payload);
            } else {
                console.log('already exists template id =' + payload._id);
                this.commit('updateTemplate', payload);
            }
        },
        updateTemplate(state,payload) {
            const tempToUpdateIndex = state.templateList.findIndex(x => x._id === payload._id);
            Object.assign(state.templateList[tempToUpdateIndex], {...payload});
        },
        insertAcredential(state, payload) {
            if (!state.vcList.find(x => x._id === payload._id)) {
                state.vcList.push(payload);
            }
        },
        updateAcredential(state, payload) {
            let index = state.vcList.findIndex(x => x._id === payload._id);
            if(index >= 0){
                Object.assign(state.vcList[index], {...payload});
            } else {
                state.vcList.push(payload);
            }
        },
        updateSidebarStatus(state,payload) {
            state.showSideNavbar = payload
        },
        deleteTemplate(state,payload) {
            let index = state.templateList.findIndex(x => x._id === payload)
            if(index > -1) {
                state.templateList.splice(index,1)
            } else {
                console.log('template not found in tempList' + payload);
            }
        }
    },
    actions: {
        upsertAschemaAction({ commit }, payload) {
            const { schemaId } = payload;
            if (schemaId) {
                               
                const url = `${config.nodeServer.BASE_URL_REST}${config.nodeServer.SCHEMA_GET_REST}${schemaId}:`
                fetch(url).then(response => response.json()).then(json => {
                    const shcemaDetial = json.schema[0];
                    if (shcemaDetial.schema.properties) {
                        let propertiesStr = shcemaDetial.schema.properties;
                        const props = JSON.parse(propertiesStr)
                        shcemaDetial.schema.properties = props;
                    }
                    payload['schemaDetails'] = shcemaDetial;
                    commit('updateAschema', payload);
                }).catch(e => console.log(e))
            } else {
                commit('insertAschema', payload);
            }
        },
        
        upsertAcredentialAction({ commit }, payload) {
            const { vc_id } = payload;
            if (vc_id) {
                fetch(vc_id + ':').then(response => response.json()).then(json => {
                    Object.assign(payload, { ...json });
                    commit('updateAcredential', payload);
                }).catch(e => console.log(e))
            } else {
                commit('insertAcredential', payload);
            }
        },

        fetchAllOrgsAction({commit}){
            const authToken =  localStorage.getItem('authToken');
            const url = `${config.studioServer.BASE_URL}api/v1/org`
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
            fetch(url, {
                headers
            }).then(response => response.json()).then(json => {
                const data = json.data.org
                if (data) {
                    data.forEach(org => {
                        commit('insertAnOrg', org);
                    })
                }
            })
        },

        fetchSchemasForOrg({commit, getters, state, dispatch}){
            state.authToken = localStorage.getItem('authToken');
             // fetch all schemas
            {
                const url = `${config.studioServer.BASE_URL}${config.studioServer.SCHEMA_LIST_EP}/${state.selectedOrgDid}/?page=1&limit=10`

                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${state.authToken}`
                    }
                }
                fetch(url, {
                    headers: options.headers
                }).then(response => response.json()).then(json => {       
                    if (json && json.data.schemaList.length!==0) {
                        state.schemaList = []
                        json.data.schemaList.forEach(schema => {
                            dispatch('upsertAschemaAction', schema)
                        })
                    } else {
                        state.schemaList = []
                    }
                })


            }
        },

        fetchCredentialsForOrg({commit, getters, state, dispatch}){
            state.authToken = localStorage.getItem('authToken');
            //fetct all credentials
            {
                const url = `${config.studioServer.BASE_URL}${config.studioServer.CRED_LIST_EP}/${state.selectedOrgDid}`;
                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${state.authToken}`
                    }
                }
                fetch(url, {
                    headers: options.headers
                }).then(response => response.json()).then(json => {
                    if (json && json.data.credList.length!==0) {
                        state.vcList = []
                        json.data.credList.forEach(credential => {
                            dispatch('upsertAcredentialAction', credential)
                        })
                    }else{
                        state.vcList = []
                    }
                    
                })


            }
        },

        fetchTemplatesForOrg({commit, getters, state, dispatch}){
            state.authToken = localStorage.getItem('authToken');
            // fetch all templete   
            {
                let url = `${config.studioServer.BASE_URL}api/v1/presentation/template/org/${state.selectedOrgDid}/`
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${state.authToken}`

                }
                fetch(url, {
                    headers
                }).then(response => response.json()).then(json => {
                    
                    if (json.data.length!==0) {
                        state.templateList=[]
                        json.data.forEach(template => {
                            commit('insertApresentationTemplate', template)
                        })
                    }else{
                        state.templateList=[]
                    }
                })
            }
        },

        fetchAllOrgDataOnOrgSelect({ dispatch }) {        
            dispatch('fetchSchemasForOrg')
            dispatch('fetchCredentialsForOrg')
            dispatch('fetchTemplatesForOrg')
        }
    }
}

export default playgroundStore;

