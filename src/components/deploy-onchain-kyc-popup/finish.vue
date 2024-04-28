<template>
    <div class="container">

        <div class="row card-body card">
            <div class="col mt-1">
                <div>
                    <div class="circleBase type1 mx-1"><i class="fa fa-check"></i></div> Wallet Connected
                </div>
            </div>
            <div class="col mt-1">
                <div>
                    <div class="circleBase type1 mx-1"><i class="fa fa-check"></i></div> KYC Contract deployed
                </div>
            </div>
            <div class="col mt-1">
                <div>
                    <div class="circleBase type1 mx-1"><i class="fa fa-check"></i></div> SBT Contract deployed
                </div>
            </div>
        </div>




        <div class="row mt-2">
            <div class="col">
                <div class="center">
                    <hf-buttons name="Done" class="btn btn-primary" @executeAction="close()"></hf-buttons>
                </div>
            </div>
        </div>
    </div>

</template>

<style>
.circleBase {
    border-radius: 50%;
}

.type1 {
    width: 25px;
    height: 25px;
    background: green;
    color: white;
    align-content: center;
    text-align: center;
    float: left;
    /* border: 3px solid red; */
}
</style>

<script>
import { mapMutations, mapActions } from "vuex";

export default {
    name: 'FinishOnchainKyc',
    methods: {
        ...mapMutations('walletStore', ['resetAll', 'nextStep']),
        ...mapActions('mainStore', ['fetchAppsOnChainConfigs']),
        close() {
            this.resetAll();
            this.$root.$emit('modal-close')
            this.fetchAppsOnChainConfigs();
            this.$root.$emit("bv::toggle::collapse", "sidebar-right");
        }
    }
}
</script>