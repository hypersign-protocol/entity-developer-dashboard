<template>
    <div class="row">
        <div 
            class="col-12 col-md-6 col-lg-4 mb-2" 
            v-for="eachOrg in services" 
            :key="eachOrg.appId"
        >
            <v-card class="issuer-card h-100 shadow-sm border-0">
                <v-card-actions class="pa-4 pb-0">
                    <v-list-item class="px-0">
                        <v-list-item-avatar size="48" class="elevation-2 border">
                            <v-img 
                                :src="eachOrg.logoUrl || getProfileIcon(formattedAppName(eachOrg.appId))"
                                alt="Issuer Logo"
                            ></v-img>
                        </v-list-item-avatar>
                        
                        <v-spacer></v-spacer>
                        
                        <div v-if="isSelection" class="selection-area">
                            <v-checkbox 
                                :input-value="eachOrg.selected"
                                @change="onIssuerToggle(eachOrg)"
                                color="primary"
                                hide-details
                                class="ma-0 pa-0"
                            ></v-checkbox>
                        </div>
                        <div v-else>
                            <span class="verified-badge">
                                <i class="mdi mdi-check-decagram mr-1"></i>Verified
                            </span>
                        </div>
                    </v-list-item>
                </v-card-actions>

                <v-card-title class="pt-2 pb-1">
                    <span class="issuer-title">
                        {{ formattedAppName(eachOrg.appName) }}
                    </span>
                </v-card-title>

                <v-card-text>
                    <div class="issuer-domain text-truncate">
                        <i class="mdi mdi-link-variant mr-1"></i>
                        {{ domainFromOrigin(eachOrg.domain) }}
                    </div>
                    
                    <div class="issuer-did-box mt-3">
                        <label class="did-label">Issuer DID</label>
                        <div class="did-value">{{ eachOrg.issuerDid }}</div>
                    </div>
                </v-card-text>
            </v-card>
        </div>
    </div>            
</template>

<style scoped>
.issuer-card {
    border-radius: 0.75rem !important; /* 12px per your design spec */
    transition: all 0.25s ease-in-out;
    border: 1px solid #e5e7eb !important;
    background-color: #ffffff !important;
}

.issuer-card:hover {
    transform: translateY(-4px);
    border-color: #3b82f6 !important; /* Primary Blue */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
}

.issuer-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1f2937;
    letter-spacing: -0.01em;
}

.issuer-domain {
    font-size: 0.85rem;
    color: #64748b;
    font-weight: 500;
}

.verified-badge {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    color: #059669;
    background: #ecfdf5;
    padding: 4px 8px;
    border-radius: 6px;
}

.issuer-did-box {
    background: #f8fafc;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #f1f5f9;
}

.did-label {
    display: block;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 2px;
    letter-spacing: 0.05em;
}

.did-value {
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 0.7rem;
    color: #475569;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Custom Vuetify Overrides */
.v-list-item-avatar {
    margin-right: 0 !important;
}
</style>

<script>
import UtilsMixin from "../mixins/utils";
import { mapGetters, mapMutations } from 'vuex/dist/vuex.common.js';

export default {
    name: 'MarketplaceList',
    props: {
        isSelection: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        ...mapGetters('mainStore', ['getMarketPlaceApps']),
        services() {
            return this.getMarketPlaceApps.filter(app => !!app.issuerDid)
        }
    },
    methods: {
        ...mapMutations("mainStore", ['insertMarketplaceApps']),
        onIssuerToggle(eachOrg) {
            // Toggle selected state and commit to the store
            const updated = this.getMarketPlaceApps.map(x =>
                x.appId === eachOrg.appId ? { ...x, selected: !x.selected } : x
            )
            this.insertMarketplaceApps(updated)
            const updatedOrg = updated.find(x => x.appId === eachOrg.appId)
            this.$emit('selectedServiceEvent', {
                issuerDid: updatedOrg.issuerDid,
                selected: updatedOrg.selected,
                appId: updatedOrg.appId
            })
        },
        formattedAppName(appName) {
            if (appName == "" || appName == undefined) appName = "No app name";
            return this.truncate(appName, 25);
        },
        domainFromOrigin(domain) {
            try {
                const url = new URL(domain)
                return url.host
            } catch (e) {
                return domain
            }
        },
    },
    mixins: [UtilsMixin],


}

</script>