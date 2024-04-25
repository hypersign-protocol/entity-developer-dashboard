<template>
    <div class="container">
        ({{ getOnChainActiveStep.id + 1 }}/{{ steps.length }}) {{ getOnChainActiveStep.name }}
    </div>
</template>
<script>

import { mapGetters, mapState } from "vuex";

export default {
    name: 'DeployOnChainHeader',
    computed: {
        ...mapGetters('walletStore', ["getOnChainActiveStep"]),
        ...mapState('walletStore', ['steps'])
    },
}
</script>