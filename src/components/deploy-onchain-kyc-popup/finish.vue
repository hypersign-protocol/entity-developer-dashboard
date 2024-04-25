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


        <div class="row">
            <div class="col">
                <div class="center">
                    <button type="button" class="btn btn-link" @click="close()">Done</button>
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
import { mapMutations } from "vuex";

export default {
    name: 'FinishOnchainKyc',
    methods: {
        ...mapMutations('walletStore', ['resetAll', 'nextStep']),
        close() {
            this.resetAll();
            this.$root.$emit('modal-close')
        }
    }
}
</script>