<template>
    <div></div>
</template>


<script>
// import EventBus from "../eventbus";
export default {
    name: "HomePage",
    created() {
        const authorizationToken = this.$route.query.token
        if (authorizationToken) {
            console.log('Redirecting to dashboard')
            localStorage.setItem("authToken", authorizationToken);
            // this.$emit("initializeStore", "login");

            console.log('Before emiting event bus event....')
            // EventBus.$emit('HelloEvent', 'hi');
            this.$router.push("mfa");


        } else {
            console.log('Redirecting to login')
            this.$router.push("login");
        }
    }
}
</script>