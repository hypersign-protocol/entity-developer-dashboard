<template>
    <div class="mfa-page">
        <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>

        <!-- Same logo, frame and card as the login page (PKIIdLogin), so moving from
             sign-in to MFA feels like the same page with a new step in the card -->
        <img class="mfa-logo" height="60px" src="../../../assets/Entity_full.png" alt="Hypersign" />

        <section class="mfa-card">
            <header class="mfa-header">
                <span class="mfa-step"><i class="mdi mdi-shield-lock-outline" aria-hidden="true"></i> Two-step verification</span>
                <h1>Verify your identity</h1>
                <p>Enter the 6-digit code from your authenticator app to continue.</p>
            </header>

            <!-- Only ask which app when the account has more than one set up -->
            <div v-if="availableMethods.length > 1" class="mfa-field">
                <label class="mfa-label">Authenticator app</label>
                <AuthenticatorPicker v-model="authenticationMethod" :options="availableMethods" />
            </div>
            <p v-else-if="selectedMethod" class="mfa-using">
                Using <strong>{{ selectedMethod.name }}</strong>
            </p>

            <div v-if="authenticationMethod" class="mfa-field">
                <label class="mfa-label">Authentication code</label>
                <div class="mfa-pin">
                    <PIN :key="authenticationMethod" inputType="number" @pinTakenEvent="pinTakenEventHandler"></PIN>
                </div>
                <p v-if="error" class="mfa-error" role="alert">
                    <i class="mdi mdi-alert-circle-outline" aria-hidden="true"></i>{{ error }}
                </p>
            </div>
        </section>

        <footer class="mfa-footer">
            <p>
                Lost access to your authenticator app?
                <a :href="supportMailto" target="_blank" rel="noopener noreferrer">Contact support</a>
            </p>
            <button type="button" class="mfa-back" @click="logout()">
                <i class="mdi mdi-arrow-left" aria-hidden="true"></i> Sign in with a different account
            </button>
        </footer>
    </div>
</template>

<script>
import PIN from './PIN.vue'
import AuthenticatorPicker from './AuthenticatorPicker.vue'
import { mapMutations, mapActions } from 'vuex/dist/vuex.common.js';
import UtilsMixin from "../../../mixins/utils";
import EventBus from "../../../eventbus";
import { AUTHENTICATION_METHODS_LIST } from "../../../constants/authenticators";
import config from "../../../config";

export default {
    name: 'VerifyMfa',
    data() {
        return {
            isLoading: false,
            authenticationMethodsList: AUTHENTICATION_METHODS_LIST,
            authenticationMethod: '',
            error: "",
        }
    },
    components: {
        PIN,
        AuthenticatorPicker
    },

    props: {
        setAuthenticatorType: {
            type: String
        },
        sessionId: {
            type: String
        } 
    },

    computed: {
        // Authenticators this account has set up (from the login redirect); all of them if unknown
        availableMethods() {
            const configured = this.authenticatorsFromUrl();
            const methods = this.authenticationMethodsList.filter(method => configured.includes(method.value));
            return methods.length ? methods : this.authenticationMethodsList;
        },
        selectedMethod() {
            return this.authenticationMethodsList.find(method => method.value === this.authenticationMethod);
        },
        supportMailto() {
            return `mailto:${config.app.supportEmails}`;
        }
    },

    watch: {
        authenticationMethod: function () {
            this.error = ""
        },
        // The MFA page resolves the account's authenticator after this component mounts
        setAuthenticatorType(value) {
            this.selectAuthenticator(value)
        }
    },
    mounted() {
        this.selectAuthenticator(this.setAuthenticatorType)
    },
    methods: {

        ...mapActions('mainStore', ['mfaVerify', 'getMyUserDetails']),
        ...mapMutations('mainStore', ['setAuthToken' , 'setIfAuthenticated']),
        authenticatorsFromUrl() {
            const authenticatorsParam = this.$route.query.authenticators
            if (!authenticatorsParam) return []
            try {
                const authenticators = JSON.parse(decodeURIComponent(authenticatorsParam))
                return Array.isArray(authenticators) ? authenticators : []
            } catch (err) {
                console.error('Invalid authenticators query param', err)
                return []
            }
        },
        // Use the requested authenticator if the account has it, else the first one it has
        selectAuthenticator(requested) {
            const values = this.availableMethods.map(method => method.value)
            const [fromUrl] = this.authenticatorsFromUrl()
            const choice = [requested, fromUrl].find(value => value && values.includes(value))
            this.authenticationMethod = choice || values[0] || ''
        },
        logout(){
            EventBus.$emit("logoutAll");
        },
        async pinTakenEventHandler(pin) {
            try {
                const payload = {
                    authenticatorType: this.authenticationMethod,
                    twoFactorAuthenticationCode: pin,
                    sessionId: this.sessionId
                }
                this.isLoading = true
                const r = await this.mfaVerify(payload)


                if (!r.isVerified) {
                    this.error = "Invalid code or expired, please try again"
                } else {
                    this.notifySuccess(`Identity verified successfully`);
                    await this.getMyUserDetails()
                    this.setIfAuthenticated(true)
                    this.$root.$emit("initializeStore", "login");
                }

                this.isLoading = false


            } catch (e) {
                this.isLoading = false
                this.notifyErr(e.message)
            }
        },

    },
    mixins: [UtilsMixin],

}

</script>

<style scoped>
.mfa-page {
    /* Same frame as .login-page-container on the login page */
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
}

.mfa-logo {
    margin-bottom: 24px;
}

.mfa-card {
    /* Same size and look as .auth-portal-card on the login page */
    animation: mfa-card-in 0.25s ease-out;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
    max-width: 400px;
    padding: 40px 30px;
    width: 100%;
}

/* The card's content changes, the frame doesn't: a short fade marks the new step */
@keyframes mfa-card-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
    .mfa-card { animation: none; }
}

.mfa-header {
    margin-bottom: 28px;
    text-align: center;
}

.mfa-step {
    align-items: center;
    background: #eff6ff;
    border-radius: 999px;
    color: #1d4ed8;
    display: inline-flex;
    font-size: 11px;
    font-weight: 700;
    gap: 4px;
    letter-spacing: 0.02em;
    margin-bottom: 12px;
    padding: 3px 10px;
}


.mfa-header h1 {
    /* Same as .portal-title on the login page */
    color: #111827;
    font-size: 1.5rem;
    font-weight: 800;
    margin: 0 0 4px;
}

.mfa-header p {
    color: #64748b;
    font-size: 0.875rem;
    margin: 0;
}

.mfa-field + .mfa-field,
.mfa-using + .mfa-field {
    margin-top: 20px;
}

.mfa-label {
    color: #344054;
    display: block;
    font-size: 0.8125rem;
    font-weight: 600;
    margin-bottom: 8px;
}

.mfa-using {
    background: #f8fafc;
    border-radius: 8px;
    color: #475569;
    font-size: 0.8125rem;
    margin: 0;
    padding: 8px 12px;
    text-align: center;
}

.mfa-pin {
    margin: 0 auto;
    max-width: 320px;
}

.mfa-error {
    align-items: center;
    color: #b91c1c;
    display: flex;
    font-size: 0.8125rem;
    gap: 6px;
    justify-content: center;
    margin: 8px 0 0;
}

.mfa-footer {
    /* Same spot and text style as the login page's terms line */
    align-items: center;
    color: #94a3b8;
    display: flex;
    flex-direction: column;
    font-size: 0.75rem;
    gap: 8px;
    margin-top: 24px;
    max-width: 320px;
    text-align: center;
}

.mfa-footer p {
    margin: 0;
}

.mfa-back {
    align-items: center;
    display: inline-flex;
    gap: 4px;
}

.mfa-footer a,
.mfa-footer button {
    background: none;
    border: 0;
    color: #2563eb;
    font-weight: 600;
    padding: 0;
    text-decoration: none;
}

.mfa-footer a:hover,
.mfa-footer button:hover {
    text-decoration: underline;
}

</style>
