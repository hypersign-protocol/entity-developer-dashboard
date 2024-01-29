
<style>
.btn-hypersign {
    background-color: #3c82f7;
  border-color: #0f69ff;
  padding: 7px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  min-width: 300px;
}
</style>
<template>
        <button
            @click="login"
            class="btn btn-primary btn-hypersign"
        >
         <i class="fab fa-google"></i> Continue with google
        </button>
</template>


<script> 
import EventBus from "../../eventbus";
export default {
    name: "GoogleLogin",
    mounted() {
        const  authorizationToken = this.$route.query.token
        if(authorizationToken){
            localStorage.setItem("authToken", authorizationToken);
            EventBus.$emit("initializeStore", "login");
            this.$router.push("dashboard");
        }
    },
    methods: {
        login() {
          const socialLoginAPI = `${this.$config.studioServer.BASE_URL}api/v1/login?provider=google`;
          fetch(socialLoginAPI).then((response)=>{
                if(response.ok){
                    return response.json()
                }else{
                    console.log(response.statusText)
                }
                })
            .then((json) =>{
                window.location.href = json.authUrl
            })
            .catch((e)=>{
                throw new Error(`${e.message}`)})
                    },
    }
}



</script>