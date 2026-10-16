<template>
    <load-ing :active.sync="isLoading" :can-cancel="false" :is-full-page="true"></load-ing>
</template>


<script>
import { mapActions, mapMutations } from 'vuex/dist/vuex.common.js';
export default {
    name: "HomePage",
    data() {
        return {
            isLoading: false
        }
    },
    async created() {
        try {
            this.isFullPage = true;
            await this.getMyUserDetails()
            this.isFullPage = false;
            this.setIfAuthenticated(true)
            this.$root.$emit("initializeStore", "login");

        } catch (e) {
            this.isFullPage = false
           console.error("User is not authenticated:", e.message);
           this.$router.push("login");
        }
    },

    methods: {
        ...mapMutations('mainStore', ['setIfAuthenticated']),
        ...mapActions('mainStore', ['getMyUserDetails']),
    }
}
</script>
