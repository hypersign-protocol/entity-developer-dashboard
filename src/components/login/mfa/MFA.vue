<template>
    <div class="mt-3">
        <VerifyMFA v-if="isTwoFactorEnabled.isTwoFactorEnabled"
            :setAuthenticatorType="isTwoFactorEnabled.authenticators[0].type" />
        <SetupMFA v-else />
    </div>
</template>

<script>

import { mapMutations } from 'vuex/dist/vuex.common.js';
import SetupMFA from './SetupMfa.vue';
import VerifyMFA from './VerifyMfa.vue';
import { mapGetters } from 'vuex';
export default {
    name: 'MfaPage',
    computed: {
        ...mapGetters('mainStore', ['getAuthToken']),
        isTwoFactorEnabled() {
            const payload = localStorage.getItem('user')
            if (payload) {
                return JSON.parse(payload)
            }
            return {};
        }
    },
    data() {
        return {
            setAuthenticatorType: "google"
        }
    },
    mounted() {
        console.log('Inside mounted MFA.vue')
        this.setSelectedAppId("")
    },
    components: {
        VerifyMFA,
        SetupMFA
    },
    methods: {
        ...mapMutations('mainStore', ['setSelectedAppId']),
    }
}

</script>