<template>
    <div>
        <DeployOnchainHeader class="mb-2" />
        <component :is="getOnChainActiveStep.stepName">
        </component>
    </div>
</template>

<script>
import DeploySbt from './deploy-sbt.vue';
import DeployKyc from './deploy-kyc.vue';
import FinishOnchainKyc from './finish.vue';
import DeployOnchainHeader from './deploy-header.vue'
import { mapGetters } from "vuex";

export default {
    name: 'DeployOnChainKYC',
    components: {
        DeploySbt,
        DeployKyc,
        FinishOnchainKyc,
        DeployOnchainHeader
    },
    computed: {
        ...mapGetters('walletStore', ["getOnChainActiveStep"]),
    },
}
</script>