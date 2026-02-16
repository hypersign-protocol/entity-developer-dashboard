<template>
    <div></div>
</template>


<script>
import { mapActions, mapMutations } from 'vuex/dist/vuex.common.js';
export default {
    name: "HomePage",
    
    async created() {
        try {
            await this.getMyUserDetails()
            this.setIfAuthenticated(true)
            this.$root.$emit("initializeStore", "login");

        } catch (e) {
            console.log("User is not authenticated:", e.message);
            console.log('Redirecting to login')
            this.$router.push("login");
        }
    },

    methods: {
        ...mapMutations('mainStore', ['setIfAuthenticated']),
        ...mapActions('mainStore', ['getMyUserDetails']),
    }
}
</script>