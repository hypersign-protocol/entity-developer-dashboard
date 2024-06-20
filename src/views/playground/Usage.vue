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

.card {
  border-radius: 10px;
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
<template>
  <div :class="isContainerShift ? 'homeShift' : 'home'">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>


    <div class="row">
      <div class="col-md-12" style="text-align: left">
        <!-- <Info :message="description" /> -->
        <div class="form-group" style="display:flex">
          <h3 v-if="usageDetails.serviceDetails.length > 0" class="mt-4" style="text-align: left;">
           Usage </h3>
          <h3 v-else class="mt-4" style="text-align: left;">No usage found!</h3>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col">
            Start Date: <input type="datetime-local" class="form-control" placeholder="Start Date" v-model="startDate">
          </div>
          <div class="col">
            End Date: <input type="datetime-local" class="form-control" placeholder="End Date" v-model="endDate">
          </div>
          <div class="col" >
            <hf-buttons name="Search"  class="form-control" iconClass="fa fa-search" @executeAction="search()" style="margin-top:15px"></hf-buttons>
          </div>
        </div>
      </div>
    </div>

    <div class="row scrollit" style="margin-top: 2%;" v-if="usageDetails.serviceDetails.length > 0">
      <div class="col-md-12">
        <table class="table table-hover event-card" style="background:#FFFF">
          <thead class="thead-light">
            <tr>
              <th class="sticky-header">Path</th>
              <th class="sticky-header">From Date</th>
              <th class="sticky-header">To Date</th>
              <th class="sticky-header">Count</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in usageDetails.serviceDetails" :key="row">
              <td>{{ row.apiPath }}</td>
              <td>{{ usageDetails.startDate }}</td>
              <td>{{ usageDetails.endDate }}</td>
              <td>{{ row.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script>
// import fetch from "node-fetch";
import UtilsMixin from '../../mixins/utils';
import Loading from "vue-loading-overlay";
import HfButtons from "../../components/element/HfButtons.vue"

import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "UsageS",
  components: { Loading,HfButtons },
  computed: {
    ...mapState({
      containerShift: state => state.playgroundStore.containerShift,
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
      
      startDate: "" ,
      endDate: "",
      usageDetails: {
  "serviceId": "13f70faf7f5c5d03520b71181136b595f7c6",
  "startDate": "2024-01-01T18:30:00.000Z",
  "endDate": "2024-04-02T10:07:53.757Z",
  "serviceDetails": [
    {
      "apiPath": "/api/v1/e-kyc/verification/user-consent",
      "quantity": 4
    },
    {
      "apiPath": "/api/v1/e-kyc/verification/session",
      "quantity": 19
    },
    {
      "apiPath": "/api/v1/e-kyc/verification/passive-liveliness",
      "quantity": 17
    },
    {
      "apiPath": "/api/v1/e-kyc/verification/doc-ocr",
      "quantity": 3
    }
  ]
}
    }
  },
  async created() {
    try {
      const usrStr = localStorage.getItem("user");
      this.user = JSON.parse(usrStr);
      this.updateSideNavStatus(true)

      // appId
      this.isLoading = true

      
      

      
      this.setDate()
      this.usageDetails = await this.fetchUsageForAService({ startDate: this.startDate, endDate: this.endDate})
      this.isLoading = false
    
    } catch (e) {
      this.isLoading = false
      this.notifyErr(e.message)
      this.$router.push({path: '/studio/dashboard'});
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    ...mapActions('mainStore', ['fetchUsageForAService']),
    ...mapMutations('playgroundStore', ['updateSideNavStatus', 'shiftContainer']),
   

    copyToClip(textToCopy, contentType) {
      if (textToCopy) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            this.notifySuccess(`${contentType} copied!`);
          })
          .catch((err) => {
            this.notifyErr("Error while copying", err);
          });
      }
    },

    setDate() {
      const today = new Date();
      const day = 1;
      const month = today.getMonth();
      const year = today.getFullYear();
      
      this.startDate = (new Date(year, month, day));
      this.endDate = today;
    },

    async search(){
      try {
        if(!this.startDate) {
          throw new Error("Start date is not set")
        }

        if(!this.endDate) {
          this.endDate = (new Date());
        }

        this.startDate = (new Date(this.startDate));
        this.endDate = (new Date(this.endDate));

        this.isLoading = true
        this.usageDetails = await this.fetchUsageForAService({ startDate: this.startDate, endDate: this.endDate})
        this.isLoading = false
      }catch(e){
        this.isLoading = false
        this.notifyErr(e.message)
      }
    }

  },
  mixins: [UtilsMixin],

};
</script>
