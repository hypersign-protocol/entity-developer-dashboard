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
            // const authToken = this.getAuthToken;
            const payload = localStorage.getItem('user') //this.parseJwt({ token: authToken });
            if (payload) {
                return JSON.parse(payload)
            }
            // if (payload) {
            //     this.setAuthenticatorType = payload.authenticatorType
            //     if (payload.isTwoFactorAuthenticated) {
            //         return payload.isTwoFactorAuthenticated
            //     }
            // }
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
        ...mapMutations('mainStore', 'setSelectedAppId'),
        parseJwt: (payload) => {
            const { token } = payload;
            if (!token) throw new Error('JWT token must be provided')

            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        },
    }
}

</script>