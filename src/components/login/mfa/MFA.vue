<template>
    <div class="mt-3">
        <VerifyMFA :setAuthenticatorType="setAuthenticatorType" :sessionId="sessionId" />
    </div>
</template>

<script>

import { mapMutations } from 'vuex/dist/vuex.common.js';
import VerifyMFA from './VerifyMfa.vue';
import { mapGetters } from 'vuex';
export default {
    name: 'MfaPage',
    computed: {
        ...mapGetters('mainStore', ['getAuthToken']),
    },
    data() {
        return {
            setAuthenticatorType: "google",
            sessionId: ""
        }
    },
    mounted() {
        console.log('Inside mounted MFA.vue')
        this.setSelectedAppId("")
        const authenticatorsRaw = this.$route.query.authenticators;
        this.sessionId = this.$route.query.sessionId;
        let authenticators = [];
        if (authenticatorsRaw) {
            try {
                // decode → JSON.parse → array
                authenticators = JSON.parse(decodeURIComponent(authenticatorsRaw));
            } catch (err) {
                console.error("Failed to decode authenticators:", err);
            }
        }
        this.setAuthenticatorType = authenticators.length > 0 ? authenticators[0] : "";
    },
    components: {
        VerifyMFA,
    },
    methods: {
        ...mapMutations('mainStore', ['setSelectedAppId']),
    }
}

</script>