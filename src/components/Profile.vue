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
  border-bottom: 1px solid #8080802b;
}
.fVal {
  font-size: small;
  color: gray;
  word-wrap: break-word;
}

.card{
  border-radius: 10px;
}

</style>

<template>  
  <div class="row">
    <div class="col-md-12" style="margin-top:2%; margin-bottom:7%">
      <div class="row">
        <div class="col-md-5">
          <div class="card">
            <div class="card-body tile">{{schemaCount}}</div>
            <div class="card-header">AUTHORED SCHEMAS</div>
          </div>
        </div>
        <div class="col-md-5">
          <div class="card">
            <div class="card-body tile">{{ credentialCount}}</div>
            <div class="card-header">ISSUED CREDENTIALS</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-10 leftAlign">
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <img
                src="https://cdn1.iconfinder.com/data/icons/female-avatars-vol-1/256/female-portrait-avatar-profile-woman-sexy-afro-2-512.png"
                alt="John"
                style="width:100%;height: 100%;"
              />
            </div>
            <div class="col-md-8" style="flex-wrap: wrap; padding:20px">
              <p>DID</p>
              <p class="fVal"><a :href="`${$config.nodeServer.BASE_URL_REST}${$config.nodeServer.DID_RESOLVE_EP}${user.id}:`" target="_blank">{{user.id}}</a></p>
              <p>EMAIL</p>
              <p class="fVal">{{user.email}}</p>
              <p v-if="user.phoneNumber">Phone Number: {{user.phoneNumber}}</p>
              <!-- <p>PUBLIC KEY</p>
              <p class="fVal">{{user.publicKey}}</p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "Profile",
  mounted() {},
  components: {},
  computed:{
    credentialCount(){
      return this.$store.getters.playgroundStore.totalCredentials;
    },
    schemaCount(){
      return this.$store.getters.playgroundStore.totalSchemas;
    }
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
  },
  methods: {
    fetchData(url,options){
      return fetch(url, options)
            .then((res) => res.json())
            .then((j) => {              
              return j.message
            })
            .catch((e) => alert(`Error: ${e.message}`));
    },
    pollData(){
      let url = `${this.$config.nodeServer.BASE_URL}${this.$config.nodeServer.SCHEMA_LIST_EP}`;
      let options = {}
      this.fetchData(url).then(data => {
        if (data && data.length > 0) {
          data = data.filter(
            (x) => x.owner === this.user.id
          );
          this.schemaCount = data.length;
        }
      })

      url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.CRED_LIST_EP}`;
      options  = {
          method: "GET",
          headers: {'x-auth-token': this.authToken}
        }
      this.fetchData(url,options).then(data => {
        if (data) {
          this.credentialCount = data.count;
        }
      })
    },
  },
};
</script>
