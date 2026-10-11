<template>
    <div class="mfa-setup">
        <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>

        <p class="intro">
            Add a second step to your sign-in. You'll need an authenticator app on your phone.
        </p>

        <ol class="steps">
            <li class="step" :class="{ done: Boolean(qrCodeDataUrl) }">
                <span class="step-marker">
                    <v-icon v-if="qrCodeDataUrl" x-small>mdi-check</v-icon>
                    <template v-else>1</template>
                </span>
                <div class="step-body">
                    <h4>Choose your authenticator app</h4>
                    <p>Install one on your phone if you haven't already.</p>
                    <div class="app-options">
                        <button
                            v-for="method in authenticationMethodsList"
                            :key="method.value"
                            type="button"
                            class="app-option"
                            :class="{ active: authenticationMethod === method.value }"
                            @click="selectMethod(method.value)"
                        >
                            <v-icon small>mdi-cellphone-key</v-icon>
                            <span>{{ method.name }}</span>
                        </button>
                    </div>
                </div>
            </li>

            <li class="step" :class="{ disabled: !qrCodeDataUrl }">
                <span class="step-marker">2</span>
                <div class="step-body">
                    <h4>Scan the QR code</h4>
                    <p>In the app, tap <strong>+</strong> and choose <strong>Scan QR code</strong>.</p>
                    <div v-if="qrCodeDataUrl" class="qr-frame">
                        <img :src="qrCodeDataUrl" alt="QR code for your authenticator app" />
                    </div>
                    <div v-else class="placeholder">Choose an app above to generate your QR code.</div>
                </div>
            </li>

            <li class="step" :class="{ disabled: !qrCodeDataUrl }">
                <span class="step-marker">3</span>
                <div class="step-body">
                    <h4>Enter the 6-digit code</h4>
                    <p>Type the code your app shows for this account.</p>
                    <div v-if="qrCodeDataUrl" class="pin-wrapper">
                        <PIN inputType="number" @pinTakenEvent="pinTakenEventHandler"></PIN>
                    </div>
                    <small v-if="error" class="field-error">{{ error }}</small>
                </div>
            </li>
        </ol>

        <footer class="popup-footer">
            <button type="button" class="ghost-button" @click="skip">Skip for now</button>
        </footer>
    </div>
</template>

<script>
import PIN from './PIN.vue'
import { mapActions } from 'vuex/dist/vuex.common.js';
import UtilsMixin from "../../../mixins/utils";
import { AUTHENTICATION_METHODS_LIST } from "../../../constants/authenticators";

export default {
    name: 'SetupMfa',
    data() {
        return {
            isLoading: false,

            qrCodeDataUrl: "",
            authenticationMethodsList: AUTHENTICATION_METHODS_LIST,
            authenticationMethod: "",
            error: ""
        }
    },
    components: {
        PIN
    },
    watch: {
        qrCodeDataUrl: function () {
            this.error = ""
        }
    },
    methods: {
        ...mapActions('mainStore', ['mfaGenerate', 'setupmfaVerify', 'getMyUserDetails']),
        selectMethod(method) {
            if (method === this.authenticationMethod && this.qrCodeDataUrl) return;
            this.authenticationMethod = method;
            this.onSelectedAuthenticatorMethod();
        },
        async onSelectedAuthenticatorMethod() {
            try {
                this.isLoading = true
                const payload = {
                    authenticatorType: this.authenticationMethod
                }

                const r = await this.mfaGenerate(payload);
                this.qrCodeDataUrl = r.twoFADataUrl

                this.isLoading = false

            } catch (e) {
                this.isLoading = false
                this.notifyErr(e.message)
            }

        },

        async pinTakenEventHandler(pin) {
            try {
                this.isLoading = true
                const payload = {
                    authenticatorType: this.authenticationMethod,
                    twoFactorAuthenticationCode: pin
                }
                const r = await this.setupmfaVerify(payload)

                if (!r.isVerified) {
                    this.error = "Invalid code or expired, please try again"
                } else {
                    this.notifySuccess(`Identity verified successfully`);
                    const user = await this.getMyUserDetails()
                    this.$emit("closePopup", user);
                }
                this.isLoading = false
            } catch (e) {
                this.isLoading = false
                this.notifyErr(e.message)
            }
        },
        skip() {
            this.$emit("closePopup");
        }
    },
    mixins: [UtilsMixin],
}

</script>

<style scoped>
.mfa-setup { color: #273448; }

.intro { margin: 0 0 18px; color: #718198; font-size: 13px; line-height: 1.5; }

.steps { margin: 0; padding: 0; list-style: none; }

.step {
    position: relative;
    display: flex;
    gap: 14px;
    padding-bottom: 22px;
}

/* Connector line between step markers */
.step:not(:last-child)::before {
    content: '';
    position: absolute;
    top: 30px;
    bottom: 4px;
    left: 13px;
    width: 1px;
    background: #e1e6ed;
}

.step-marker {
    display: inline-flex;
    flex: 0 0 27px;
    width: 27px;
    height: 27px;
    align-items: center;
    justify-content: center;
    border: 1px solid #2563dc;
    border-radius: 50%;
    background: #fff;
    color: #2563dc;
    font-size: 12px;
    font-weight: 700;
}

.step.done .step-marker { border-color: #b7e2cb; background: #eaf8f0; color: #218459; }
.step.done .step-marker >>> .v-icon { color: #218459 !important; }
.step.disabled .step-marker { border-color: #d5dde7; color: #94a3b8; }
.step.disabled .step-body h4 { color: #94a3b8; }

.step-body { flex: 1; min-width: 0; padding-top: 3px; }
.step-body h4 { margin: 0 0 3px; color: #263244; font-size: 14px; font-weight: 700; }
.step-body > p { margin: 0 0 12px; color: #718198; font-size: 12px; line-height: 1.5; }

.app-options { display: flex; flex-wrap: wrap; gap: 10px; }

.app-option {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 200px;
    padding: 10px 14px;
    border: 1px solid #d5dde7;
    border-radius: 8px;
    background: #fff;
    color: #344054;
    font-size: 13px;
    font-weight: 600;
}

.app-option:hover { border-color: #94a3b8; }
.app-option >>> .v-icon { color: #718198 !important; }
.app-option.active { border-color: #2563dc; background: #f1f6ff; color: #2563dc; }
.app-option.active >>> .v-icon { color: #2563dc !important; }

.qr-frame {
    display: inline-flex;
    padding: 12px;
    border: 1px solid #e1e6ed;
    border-radius: 10px;
    background: #fff;
}

.qr-frame img { display: block; width: 180px; height: 180px; }

.placeholder {
    padding: 12px 14px;
    border: 1px dashed #d5dde7;
    border-radius: 8px;
    background: #f8fafc;
    color: #8793a5;
    font-size: 12px;
}

.pin-wrapper { max-width: 320px; }
.pin-wrapper >>> form { margin: 0; }
.pin-wrapper >>> div { margin-top: 0; }

.field-error { display: block; margin-top: 6px; color: #b42318; font-size: 12px; }

.popup-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 14px;
    border-top: 1px solid #e8edf3;
}

.ghost-button {
    min-height: 36px;
    padding: 0 14px;
    border: 1px solid transparent;
    border-radius: 6px;
    background: transparent;
    color: #6c757d;
    font-size: 12px;
    font-weight: 700;
}

.ghost-button:hover { background: #f1f5f9; }
</style>
