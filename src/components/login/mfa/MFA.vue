<template>
    <div class="mt-3">
        <VerifyMFA v-if="isTwoFactorEnabled.isTwoFactorAuthenticated"
            :setAuthenticatorType="isTwoFactorEnabled.authenticatorType" />
        <SetupMFA v-else />
    </div>
</template>

<script>

import SetupMFA from './SetupMfa.vue';
import VerifyMFA from './VerifyMfa.vue';
import { mapGetters } from 'vuex';
export default {
    name: 'MfaPage',
    computed: {
        ...mapGetters('mainStore', ['getAuthToken']),
        isTwoFactorEnabled() {
            const authToken = this.getAuthToken;
            const payload = this.parseJwt({ token: authToken });
            // if (payload) {
            //     this.setAuthenticatorType = payload.authenticatorType
            //     if (payload.isTwoFactorAuthenticated) {
            //         return payload.isTwoFactorAuthenticated
            //     }
            // }
            return payload;
        }
    },
    data() {
        return {
            setAuthenticatorType: "google"
        }
    },
    mounted() {
        console.log('Inside mounted MFA.vue')
    },
    components: {
        VerifyMFA,
        SetupMFA
    },
    methods: {
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