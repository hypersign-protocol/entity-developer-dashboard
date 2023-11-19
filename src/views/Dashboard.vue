<template>
  <div class="">
    <div class="row">
      <div class="col-md-12">
        <h2 class="mb-6 text-2xl">
          Hi {{ user.name ? user.name.split(" ")[0] : "" }}, Welcome to
          Developer Dashboard!
        </h2>
      </div>
    </div>
    <!-- <div class="row">
       <div class="col-md-4">
           <div class="card" >
               <div class="card-body">
                   <h2 class="card-title"><i class="fa fa-gamepad" style="font-size:36px;"></i></h2>
                   <p class="card-text">
                    Experience Self Sovereign Identity (SSI) concepts firsthand by using our Entity Studio playground.</p>
                   <a href="#" @click.prevent="gotosubpage('playgroundDashboard')" class="btn btn-outline-primary rounded-pill">SSI Playground <i class="fa fa-arrow-right"></i></a>
               </div>
           </div>
       </div>
       <div class="col-md-4">
           <div class="card" >
               <div class="card-body">
                   <h5 class="card-title"><i class="fa fa-graduation-cap" style="font-size:36px;"></i></h5>
                   <p class="card-text">
                    Dive into our API documentation to create innovative identity products on our infrastructure.
                    </p>
                   <a href="https://docs.hypersign.id/entity-studio/api-doc" target="_blank" class="btn btn-outline-primary rounded-pill">API Documentation <i class="fa fa-arrow-right"></i></a>
               </div>
           </div>
       </div>

       <div class="col-md-4">
           <div class="card" >
               <div class="card-body">
                   <h5 class="card-title">
                        <i class="fa fa-code" style="font-size:36px;"></i>                    
                    </h5>
                   <p class="card-text">Register your app on Entity Dashboard and get a head start with our SSI APIs</p>
                   <a :href="`${$config.apiServer.host}/api`" target="_blank" class="btn btn-outline-primary rounded-pill">API Playground <i class="fa fa-arrow-right"></i></a>
               </div>
           </div>
       </div>
     </div>
      -->
    <div class="row">
      <div class="col-md-12">
        <apps />
      </div>
    </div>
  </div>
</template>

<script>
import Apps from "./Apps.vue";
import { mapMutations } from "vuex";

export default {
  name: "dashboard",
  components: {
    Apps,
  },
  data() {
    return {
      user: {},
      authToken: localStorage.getItem("authToken"),
    };
  },
  created() {
    const usrStr = localStorage.getItem("user");
    this.user = JSON.parse(usrStr);
    this.setSelectedDashboard(this.$config.DashboardTypes.DeveloperDashboard);
  },
  methods: {
    ...mapMutations("globalStore", ["setSelectedDashboard"]),
    gotosubpage(name) {
      this.$router.push({ name });
    },
  },
};
</script>
