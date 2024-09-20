<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
}

.container {
  width: 80vw;
}

.UI--c-kbgiPT-iehgGlf-css {
  background-color: #9cb5f9;
}

.step-notStarted {
  background-color: #afb8cc;
}

.step-finished {
  background-color: #9cb5f9;
}


.UI--c-dhzjXW-iexswVt-css {
  align-items: center;
  justify-content: center;
}

.UI--c-kbgiPT-bUORwj-isFirst-true {
  padding: 0px 0.4rem 0px 0px;
  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0% 100%, 0% 0%);
}

.UI--c-kbgiPT {
  height: 100%;
  width: 4.8rem;
  clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);
  margin-left: -0.9rem;
  padding: 0px 0.4rem 0px 0.8rem;
}

.UI--c-dhzjXW {
  display: flex;
}

.stepSpan {
  cursor: pointer;
  margin: 3px;
  padding: 0px;
  border: 0px;
  font: inherit;
  vertical-align: baseline;
  float: left
}

.step {
  height: 32px;
  width: 50px;
}

.card-header {
  background: aliceblue;
  padding: 0px;
}

.goschema {
  color: #339af0;
}

.goschema:hover {
  text-decoration: underline;
  cursor: pointer;
}

.far {
  color: gray;
  font-size: 1.5em;
  display: inline;
  cursor: pointer;
}

.datetime-picker {
  background-color: #fff;
  background-clip: content-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
}

.linkdiv {
  background-clip: content-box;
  background-color: rgba(173, 232, 255, .5607843137254902);
  border-radius: 0.25rem;
  height: 50px;
  text-align: left;
}

h5 {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #80808045;
  line-height: 0.1em;
  margin: 10px 0 20px;
}

h5 span {
  background: #fff;
  padding: 0 10px;
}

.scrollit {
  overflow: hidden;
  height: 600px;
}

.scrollit:hover {
  overflow-y: auto;
}
</style>

<style scoped>
.badge {
  padding: 5px;
  float: right;
  background-color: rgb(236, 232, 200);
  /* border-radius: 40%; */
  font-size: x-small;
  font-weight: bold;
  /* font-weight: bold; */
  color: black;
  width: auto;
  text-align: center;
  align-content: center;
  margin-left: 5px;
}
</style>
<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
    <!-- <div class="row mb-1">
      <div class="col-12 bg-warning">
        <b-navbar style="border-radius: 5px;">
          <b-navbar-nav><b-nav-item href="#">This is an experimental feature!</b-nav-item></b-navbar-nav>
        </b-navbar>
      </div>
    </div> -->
    <div class="row">
      <div class="col-6" style="text-align: left">
        <div class="form-group" style="display:flex">
          <h3 v-if="onchainconfigs.length > 0" style="text-align: left;" class="position-relative">

            OnChain KYC Configuration
            <span class="badge position-absolute  rounded">
              Beta
            </span>

          </h3>
          <h3 v-else style="text-align: left;">No onchain kyc configuration found!</h3>
        </div>
      </div>
      <div class="col-6">
        <hf-buttons name=" Deploy OnChain KYC" iconClass="fa fa-plus" class="ml-auto " @executeAction="openSlider()"
          style="float: right;">
        </hf-buttons>
      </div>
    </div>

    <div class="row scrollit" v-if="onchainconfigs.length > 0">
      <div class="col-md-12">
        <table class="table table-hover event-card" style="background:#FFFF">
          <thead class="thead-light">
            <tr>
              <th class="sticky-header">Blockchain</th>
              <th class="sticky-header">ID</th>
              <th class="sticky-header">Date</th>
              <th class="sticky-header">Issuer DID</th>
              <!-- <th class="sticky-header">Owner's Wallet</th> -->
              <th class="sticky-header">KYC Contract</th>
              <!-- <th class="sticky-header">KYC Tx Hash</th> -->
              <th class="sticky-header">SBT Contract</th>
              <th class="sticky-header"></th>
              <!-- <th></th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in onchainconfigs" :key="row._id">
              <td>
                <span>

                  <b-avatar :src="getChainDetail(row.blockchainLabel).logoUrl" size="30"></b-avatar>
                  <!-- <img :src="getChainDetail(row.blockchainLabel).logoUrl" width="20" height="20"> -->
                </span>
                {{ getChainDetail(row.blockchainLabel).chainName }}
              </td>


              <td @click="copyToClip(row._id, 'Onchain Configuration Id')" style="cursor: pointer;">{{
                stringShortner(row._id, 15) }}</td>
              <td>{{ toDateTime(row.createdAt) }}
              </td>
              <td @click="copyToClip(row.issuerDid, 'Issuer DID')" style="cursor: pointer;">{{
                stringShortner(row.issuerDid, 15) }}</td>
              <!-- <td @click="copyToClip(row.walletAddress, 'Wallet Address')" style="cursor: pointer;">{{
                stringShortner(row.walletAddress, 15) }}</td> -->
              <td @click="copyToClip(row.kycContractAddress, 'Kyc Contract Address')" style="cursor: pointer;">{{
                stringShortner(row.kycContractAddress, 20) }}</td>
              <!-- <td @click="copyToClip(row.kycContractTxHash, 'Kyc Contract Tx Hash')" style="cursor: pointer;"><a
                  href="#" target="_blank"> {{
                    row.kycContractTxHash ? stringShortner(row.kycContractTxHash, 15) : "-" }}</a></td> -->

              <td @click="copyToClip(row.sbtContractAddress, 'SBT Contract Address')" style="cursor: pointer;">{{
                stringShortner(row.sbtContractAddress, 20) }}</td>
              <!--<td v-if="!row.sbtContractAddress">
                <span @click="editOnChainConfiguration(row)"><i class="fas fa-feather"></i></span>
              </td>
              <td v-else></td>-->
              <td>
                <span @click="deleteConfiguration(row._id)" class="ml-2" style="cursor:grab; color:grey"><i
                    class="fa fa-trash"></i></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


    <StudioSideBar title="OnChain KYC">
      <div class="container" style="width: 100%;">
        <DeployOnChainKYC />
      </div>
    </StudioSideBar>
  </div>
</template>

<script>
// import fetch from "node-fetch";
import UtilsMixin from '../../mixins/utils';
import Loading from "vue-loading-overlay";
import HfButtons from "../../components/element/HfButtons.vue"
import StudioSideBar from "../../components/element/StudioSideBar.vue";
import DeployOnChainKYC from "../../components/deploy-onchain-kyc-popup/deploy.vue";
import { getCosmosChainConfig } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/cosmos-wallet-utils'

import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "UsageS",
  components: { Loading, HfButtons, StudioSideBar, DeployOnChainKYC },
  computed: {
    ...mapState({
      containerShift: state => state.playgroundStore.containerShift,
      onchainconfigs: state => state.mainStore.onchainconfigs
    }),
    isContainerShift() {
      return this.containerShift
    },


  },
  data() {
    return {
      authToken: localStorage.getItem('authToken'),
      user: {},
      fullPage: true,
      isLoading: false,
    }
  },

  async created() {
    try {
      const usrStr = localStorage.getItem("user");
      this.user = JSON.parse(usrStr);
      this.updateSideNavStatus(true)

      // appId
      this.isLoading = true
      await this.fetchAppsOnChainConfigs()
      this.isLoading = false

    } catch (e) {
      this.isLoading = false
      this.notifyErr(e.message)
      this.$router.push({ path: '/studio/dashboard' });
    } finally {
      this.warnUsers('b-toaster-top-full')
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {

    warnUsers(toaster, variant = 'warning', append = false) {
      this.$bvToast.toast(`This is an experimental feature. Kindly use only for testing purposes.`, {
        title: `⚠️ Warning!`,
        toaster: toaster,
        solid: false,
        variant,
        appendToast: append,
      })
    },
    ...mapActions('mainStore', ['fetchAppsOnChainConfigs', 'deleteAppOnChainConfig']),
    ...mapMutations('playgroundStore', ['updateSideNavStatus', 'shiftContainer']),
    ...mapMutations('mainStore', ['setOnChainConfig']),



    async deleteConfiguration(id) {
      this.isLoading = true
      await this.deleteAppOnChainConfig({ _id: id })
      this.isLoading = false
      this.notifySuccess('Configuration deleted successfully')
      return
    },

    editOnChainConfiguration(row) {
      this.setOnChainConfig({
        ...row
      })
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    openSlider() {
      this.edit = false;
      this.setOnChainConfig({});
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    getChainDetail(blockchainlabel = 'cosmos:comdex:test') {
      const config = getCosmosChainConfig(blockchainlabel)
      return {
        chainName: config.chainName,
        chainId: config.chainId,
        logoUrl: config.stakeCurrency.coinImageUrl,
        tx_explorer: config.txExplorer.txUrl
      }
    },


  },
  mixins: [UtilsMixin],

};
</script>
