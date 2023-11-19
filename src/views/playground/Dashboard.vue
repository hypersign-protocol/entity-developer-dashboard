<template>
   <div class="home">
     <h2>Hi {{ user.name ? user.name.split(' ')[0]: ""}}, Welcome to SSI Playground !</h2>
     <Metrics/>
     <org-sidebar/>
   </div>
</template>


<script>
import Dashboard from '@/components/Dashboard.vue'
import Metrics from '@/components/Metrics.vue'
import OrgSidebar from './OrgSidebar.vue';
import EventBus from '../../eventbus';
import { mapMutations } from 'vuex';
export default {
  name: "playgroundDashboard",
  components: { 
    Dashboard,
    Metrics,
    OrgSidebar,
  },
  data() {
    return {
      appList: [],
      user: {},
      appName: "",
      authToken: localStorage.getItem('authToken')
    };
  },
  created() {
   this.setSelectedDashboard(this.$config.DashboardTypes.SSIPlayground)
    const usrStr = localStorage.getItem('user')
    this.user = JSON.parse(usrStr);
    this.updateSideNavStatus(false)
    this.selectAnOrg('')
    localStorage.removeItem('selectedOrg')
    EventBus.$emit('closeSideNav')
  },
  methods: {
    ...mapMutations('globalStore', ['setSelectedDashboard']),
    ...mapMutations('playgroundStore', ['updateSideNavStatus', 'selectAnOrg']),
    gotosubpage(id) {
      this.$router.push(`${id}`);
    },
    logout(){
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem("credentials")
      localStorage.removeItem("userData")
      
      if(this.$route.params.nextUrl != null){
                    this.$router.push(this.$route.params.nextUrl)
                }else{
        this.$router.push('/login')
                }
    },
  },
};
</script>
