<template>
    <div>
        <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></load-ing>
        <h3>Verify Your Identity</h3>
        <div class="card" style="width: 50%;">
            <div class="card-body">
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <tool-tip infoMessage="Select issuer DID for this app"></tool-tip>
                            <label for="selectService"><strong>Select An Authentication Method<span
                                        style="color: red">*</span>:
                                </strong></label>
                            <select class="custom-select" id="selectService" v-model="authenticationMethod">
                                <option value="" selected disabled>Authenticator App</option>
                                <option v-for="method in authenticationMethodsList" :value="method.value"
                                    :key="method.name">{{
                                        method.name.toUpperCase() }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row" v-if="authenticationMethod">
                    <div class="col">
                        <div class="form-group">
                            <tool-tip infoMessage="Select issuer DID for this app"></tool-tip>
                            <label for="selectService"><strong>A 6-digit authentication code has been sent to your
                                    device.
                                    Enter the code to
                                    continue:
                                </strong></label>
                            <div class="mx-1">

                                <div class="px-2 mx-1">
                                    <PIN inputType="number" @pinTakenEvent="pinTakenEventHandler"></PIN>
                                </div>
                                <small v-if="error" style="color:red">{{ error }}</small>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>

<script>
import ToolTip from "../../element/ToolTip.vue";
import PIN from './PIN.vue'
import { mapMutations, mapActions } from 'vuex/dist/vuex.common.js';
import UtilsMixin from "../../../mixins/utils";

export default {
    name: 'VerifyMfa',
    data() {
        return {
            isLoading: false,
            authenticationMethodsList: [
                {
                    name: 'Google Authenticator',
                    value: 'google',
                    selected: true,
                },
                {
                    name: 'Okta Authenticator',
                    value: 'okta',
                    selected: false
                }
            ],
            authenticationMethod: "",
            error: "",
        }
    },
    components: {
        ToolTip,
        PIN
    },

    watch: {
        authenticationMethod: function () {
            // this.
            this.error = ""

        }
    },
    methods: {

        ...mapActions('mainStore', ['mfaVerify']),
        ...mapMutations('mainStore', ['setAuthToken']),
        async pinTakenEventHandler(pin) {
            try {
                const payload = {
                    authenticatorType: this.authenticationMethod,
                    twoFactorAuthenticationCode: pin
                }
                this.isLoading = true
                const r = await this.mfaVerify(payload)

                if (!r.isVerified) {
                    this.error = "Invalid code or expired, please try again"
                } else {
                    this.notifySuccess(`Identity verified successfully`);
                    this.setAuthToken(r.authToken)
                    this.$router.push("dashboard");
                }

                this.isLoading = false


            } catch (e) {
                this.isLoading = false
                this.notifyErr(e.message)
            }
        }
    },
    mixins: [UtilsMixin],

}

</script>