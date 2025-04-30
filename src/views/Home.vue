<template>
    <div></div>
</template>


<script>
// import EventBus from "../eventbus";
import { checkAuth } from '../authService'
export default {
    name: "HomePage",
   async created() {
    try{
        const user=  await checkAuth()
        console.log("User is authenticated:", user);
          this.$router.push("mfa");

    }catch(e){
         console.log("User is not authenticated:", e.message);
         console.log('Redirecting to login')
         this.$router.push("login");
    }     
    }
}
</script>