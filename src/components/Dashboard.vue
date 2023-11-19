<style scoped>
.leftAlign{
  text-align: left;
}
.centerAlign{
  align-content: center;
}

.dot {
  height: 15px;
  width: 15px;
  background-color: green;
  border-radius: 50%;
  display: inline-block;
  margin-top:5px;
  float:right;
}

.fVal{
  font-size: small;
color: gray;
word-wrap: break-word
}
.card{
  border-radius: 10px;
}

</style>
<template>
    <div class="row" style="padding:10px">
      <div class="col-md-6" style="margin-left:40%">
          <div class="card">
              <div class="card-header">
                NETWORK DETAILS <span class="dot" v-if="networkStatus.result.listening === true"></span>
              </div>
              <div class="card-body leftAlign">
                <p >NETWORK
                </p><p class="fVal">{{ (networkStatus.result.peers[0].node_info.network).toUpperCase() + '  NETWORK'}}</p>  
                <p>NODE URL
                </p><p class="fVal"><a :href="networkStatus.nodeUrl" target="_blank">{{this.$config.nodeServer.BASE_URL}}</a></p>  
                <p>EXPLORER URL
                </p><p class="fVal"><a :href="networkStatus.explorerUrl" target="_blank">{{this.$config.explorer.BASE_URL}}</a></p> 
              </div>
            </div> 
        </div>
      </div>
</template>

<script>
export default {
  name: "PanelPage",
  mounted() {
  },
  components: {
  },
  data() {
    return {
      active: 0,
      networkStatus: {
        result:{
          listening:'false',
          listeners:[],
          n_peers:'',
          peers:[{}]
        },
        status: "DOWN",
        nodeUrl: "",
        explorerUrl: this.$config.explorer.BASE_URL,
        schemaCount: "0",
        didCount: "0"
      },
    };
  },
  async created() {
    const url = `${this.$config.nodeServer.BASE_URL}${this.$config.nodeServer.NETWORK_STATUS_EP}`;
   await fetch(url)
    .then(res => res.json())
    .then(json => {
      this.networkStatus = { ...json }
      console.log(this.networkStatus.result.peers[0])
    })
    .catch(e => alert(`Error: ${e.message}`))
  },
};
</script>
