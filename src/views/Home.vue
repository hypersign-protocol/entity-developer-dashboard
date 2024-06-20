<template>
    <div></div>
</template>


<script> 
import EventBus from "../eventbus";
export default {
    name: "HomePage",
    created() {
        const  authorizationToken = this.$route.query.token
        if(authorizationToken){
            console.log('Redirecting to dashboard')
            localStorage.setItem("authToken", authorizationToken);
            EventBus.$emit("initializeStore", "login");
            this.$router.push("dashboard");
        } else {
            console.log('Redirecting to login')
            this.$router.push("login");
        }
    }
}
</script>