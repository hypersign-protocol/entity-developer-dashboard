<style>
.button-theme:hover {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    background: aliceblue !important;
    border: 1px solid #905ab0 !important;
    color: #905ab0 !important;
}
</style>
<template>

    <v-btn @click="login" class="btn btn-outline-secondary" style="width: 340px;">
        <i class="fab fa-google"></i> Sign In with Google
    </v-btn>

    <!-- <hf-buttons :name="getButtonText()" @executeAction="login" class="btn btn-primary btn-hypersign"></hf-buttons> -->
</template>


<script>

export default {
    name: "GoogleLogin",

    mounted() {
        const authorizationToken = this.$route.query.token
        if (authorizationToken) {
            localStorage.setItem("authToken", authorizationToken);
            this.$router.push("mfa");
        }
    },
    methods: {
        getButtonText() {
            return `<i class="fab fa-google"></i> Continue with Google`
        },
        login() {
            const socialLoginAPI = `${this.$config.studioServer.BASE_URL}api/v1/login?provider=google`;
            fetch(socialLoginAPI).then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    console.log(response.statusText)
                }
            })
                .then((json) => {
                    window.location.href = json.authUrl
                })
                .catch((e) => {
                    throw new Error(`${e.message}`)
                })
        },
    }
}



</script>