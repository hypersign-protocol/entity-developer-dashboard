<style>
.card .selected {
    position: absolute;
    top: -10px;
    right: 10px;
    font-size: 1.5em;
    color: green;
}
</style>
<template>
    <div class="row">
        <div class="col-md-6 mb-2" v-for="eachOrg in services" :key="eachOrg.appId">
            <v-card class="" max-width="400">
                <v-card-actions>
                    <v-list-item class="grow">
                        <v-list-item-avatar color="grey darken-3">
                            <v-img class="elevation-6" alt=""
                                :src="eachOrg.logoUrl || getProfileIcon(formattedAppName(eachOrg.appId))"></v-img>
                        </v-list-item-avatar>
                        <v-row align="center" justify="end" class="justify-content-end">
                            <div class="d-flex align-items-start">
                                <v-checkbox v-model="eachOrg.selected"></v-checkbox>
                            </div>
                        </v-row>
                    </v-list-item>
                </v-card-actions>
                <v-card-title>
                    <span class="text-h6 font-weight-light">
                        {{ formattedAppName(eachOrg.appName) }}
                    </span>
                </v-card-title>
                <v-card-text class="text-h5 font-weight-bold">
                    {{ domainFromOrigin(eachOrg.domain) }}
                </v-card-text>
            </v-card>


            <!-- <div class="card" style="cursor: grab; border-radius: 20px" @click="serviceSelected(eachOrg)"
                :style="{ 'box-shadow': eachOrg.selected ? '0 0 2rem 0 rgb(136 152 170 / 15%)' : '' }">
                <div class="card-body">
                    <div class="row">
                        <div class="col">
                            <div class="form-check selected">
                                <input class="form-check-input" type="checkbox" v-model="eachOrg.selected"
                                    id="flexCheckDefault">
                            </div>
                        </div>
                    </div>
                    <div class="row center">
                        <div class="col-5">
                            <div class="p-2  center">
                                <b-avatar :src="eachOrg.logoUrl || getProfileIcon(formattedAppName(eachOrg.appId))"
                                    variant="info"></b-avatar>
                            </div>
                        </div>
                    </div>

                    <div class="row ">

                        <div class="col center">
                            <h5 class="card-title text-uppercase text-muted mb-0">
                                {{ formattedAppName(eachOrg.appName) }}
                                <img src="../assets/verified-success.png" style="max-height: 20px; min-height: 20px;"
                                    v-if="eachOrg.domainLinkageCredentialString" />
                            </h5>
                        </div>
                    </div>

                    <div class="row center mt-1 mb-1 center"
                        style="max-height: 30px;min-height: 30px;  text-align: center; word-wrap: break-word;">
                        <div class="col center" style="color:grey">
                            {{ truncate(
                                eachOrg.description || "No description for this app",
                                80
                            ) }}
                        </div>
                    </div>

                    <div class="row mt-2">
                        <div class="col center">
                            <span>
                                <span class="badge rounded bg-light" v-if="eachOrg.domain">
                                    <a :href="eachOrg.domain" target="_blank" style="text-decoration:none">{{
                                        domainFromOrigin(eachOrg.domain) }}</a>
                                </span>
                            </span>

                        </div>
                        <div class="col center">
                            <span>
                                <span class="badge rounded bg-light" v-if="eachOrg.issuerDid">
                                    {{ truncate(
                                        eachOrg.issuerDid,
                                        30
                                    ) }}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script>
import UtilsMixin from "../mixins/utils";
import { mapGetters, mapMutations } from 'vuex/dist/vuex.common.js';

export default {
    name: 'MarketplaceList',
    computed: {
        ...mapGetters('mainStore', ['getMarketPlaceApps']),
        services() {
            return this.getMarketPlaceApps
        }
    },
    beforeMount() {

    },
    methods: {
        ...mapMutations("mainStore", ["updateAnMarketPlaceApp", 'insertMarketplaceApps']),
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
        serviceSelected(eachOrg) {
            if (eachOrg) {
                const t = this.getMarketPlaceApps.map((x) => {
                    if (x.appId === eachOrg.appId) {
                        x['selected'] = x['selected'] && x['selected'] == true ? false : true;
                    }
                    return x
                })
                this.insertMarketplaceApps(t)
                this.$emit('selectedServiceEvent', eachOrg);
            }

        }
    },
    mixins: [UtilsMixin],


}

</script>