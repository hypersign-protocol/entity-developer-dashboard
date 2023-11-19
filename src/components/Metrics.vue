<style scoped>
.addmargin {
  margin-top: 10px;
  margin-bottom: 10px;
}

.vue-logo-back {
  background-color: black;
}

.logo {
  width: 144px;
}

.fullbody {
  width: 100%;
}
.floatLeft {
  float: left;
}

.floatRight {
  float: right;
}

.noBullet {
  list-style-type: none;
}

.title {
  color: grey;
  font-size: 18px;
}
.dot {
  height: 15px;
  width: 15px;
  background-color: green;
  border-radius: 50%;
  display: inline-block;
  margin-top: 5px;
  float: right;
}

.tile {
  font-size: xxx-large;
  background: aliceblue;
}
.fVal {
  font-size: small;
  color: gray;
  word-wrap: break-word;
}
.col-md-12{
  /* justify-items: center; */
display: flex;
}
.col-md-3 {
  width: 400px;
  margin: 10px;
}
.card{
  height: 100%;
  border-radius: 10px;
}

.card-header{
  height: 30%;
}

</style>

<template>  
  <div class="row">
     
        <div class="col-lg-3">
          <div class="card event-card">
            <div class="card-body tile-number">{{allMetricsData.schemasCount}}</div>            
            <div class="card-header card-head"><i class="fa fa-table mr-2"></i>AUTHORED SCHEMAS</div>
          </div>
        </div>
        <div class="col-lg-3">
          <div class="card event-card">
            <div class="card-body tile-number">{{ allMetricsData.credentialsCount }}</div>
            <div class="card-header card-head"><i class="fa fa-id-card mr-2"></i>ISSUED CREDENTIALS</div>
          </div>
        </div>
        <div class="col-lg-3">
          <div class="card event-card">
            <div class="card-body tile-number">{{ allMetricsData.orgsCount }}</div>
            <div class="card-header card-head"><i style="font-size:1.2em" class="fa fa-university mr-2"></i>ORGANIZATIONS</div>
          </div>
        </div>
        
        <div class="col-lg-3">
          <div class="card event-card">
            <div class="card-body tile-number">{{ allMetricsData.templatesCount }}</div>
            <div class="card-header card-head"><i class="fa fa-desktop mr-2"></i>PRESENTATION TEMPLATES</div>
          </div>
        </div>
      </div>  
</template>


<script>
import { mapGetters } from 'vuex';
export default {
  name: "Metrics",
  mounted() {},
  components: {},
  computed:{
    ...mapGetters("playgroundStore", ["allMetricsData"]),
  },
  data() {
    return {
      active: 0,
      userKeys: [],
      appList: [],
      user: {
        id: "",
        publicKey: "",
        email: "",
        phoneNumber: "",
        fname: "",
      },
      authToken: localStorage.getItem("authToken"),
    };
  },
  created() {
    const usrStr = localStorage.getItem("user");
    this.user = { ...JSON.parse(usrStr) };
    this.userKeys = Object.keys(this.user);
    if(this.authToken) {
      this.profile();
    }
  },
  methods: {
    async profile() {
      let url = "";
      let options = {}
        url = `${this.$config.studioServer.BASE_URL}api/v1/user/profile`
        options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.authToken}`
          }
        }
      const resp = await fetch(url, options);
      const j = await resp.json();
     this.$store.commit('playgroundStore/addCountDataToProfile',j.data)
    },
  },
};
</script>
