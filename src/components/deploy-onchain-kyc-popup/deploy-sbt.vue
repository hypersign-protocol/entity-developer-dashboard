<template>
    <div class="container ">
        <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

        <div class="row card-body card">
            <div class="col-md-12" v-if="Object.keys(onChainIssuer.issuer).length > 0">
                <div class="form-group">
                    <!-- <tool-tip infoMessage="SSI Service Id"></tool-tip> -->
                    <label for=""><strong>Kyc Contract Address: </strong></label>
                    <input type="text" class="form-control" id="" v-model="onChainIssuer.issuer.kyc_contract_address"
                        disabled />
                </div>
            </div>


            <div class="col-md-12" v-if="onChainIssuer.issuer.sbt_contract_address != ''">
                <div class="form-group">
                    <label for=""><strong>SBT Contract Address: </strong></label>
                    <input type="text" class="form-control" id="" v-model="onChainIssuer.issuer.sbt_contract_address"
                        disabled />
                </div>
            </div>

            <div class="col-md-12"
                v-if="onChainIssuer.issuer.kyc_contract_address && (onChainIssuer.issuer.sbt_contract_address == '')">
                <div>
                    <button class="btn btn-primary btn-md" style="width:100%"
                        v-on:click="initSBTcontract()">Deploy</button>
                </div>
            </div>

        </div>

        <div class="row">
            <div class="col">
                <div class="center">
                    <button type="button" class="btn btn-link" @click="previousStep()">Previous</button>
                    <button type="button" class="btn btn-link" @click="nextStep()">Next</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>


import { mapGetters, mapMutations } from "vuex";
import { smartContractExecuteRPC } from '../../blockchains-metadata/cosmos/contract/execute'
import { smartContractQueryRPC } from '../../blockchains-metadata/cosmos/contract/query'
import { constructInitSbtMsg, constructGetRegistredSBTContractAddressMsg } from '../../blockchains-metadata/cosmos/contract/msg';
import { getCosmosChainConfig } from '../../blockchains-metadata/cosmos/wallet/cosmos-wallet-utils'
import UtilsMixin from '../../mixins/utils'
export default {
    name: 'DeploySbt',
    computed: {
        ...mapGetters("walletStore", ['getBlockchainUser', 'getCosmosConnection', 'getOnChainIssuerData']),
        selectedBlockchain() {
            if (this.selectedChainId) {
                const splits = this.selectedChainId.split(':')
                return {
                    ecosystem: splits[0],
                    blockchain: splits[1],
                    chainId: splits[2]
                }
            } else {
                return null
            }
        },
    },
    async mounted() {

        this.onChainIssuer = this.getOnChainIssuerData
        this.onChainIssuer['issuer']['sbt_contract_address'] = ""

        if (await this.checkIfalreadyDeployed()) {
            return;
        }
    },
    data() {
        return {
            isLoading: false,
            fullPage: true,
            onChainIssuer: {
                issuer: {
                    kyc_contract_address: "",
                    sbt_contract_address: ""

                }
            },
            selectedChainId: "cosmos:nibi:nibiru-localnet-0",

        }
    },
    methods: {
        ...mapMutations('walletStore', ['nextStep', 'previousStep']),
        async queryContract(msg, contractAddress) {
            const result = await smartContractQueryRPC(
                this.getCosmosConnection.signingClient,
                contractAddress, msg);
            this.onChainIssuer.issuer['sbt_contract_address'] = result.sbt_contract_address
        },
        async checkIfalreadyDeployed() {
            try {
                this.isLoading = true;
                const msg = constructGetRegistredSBTContractAddressMsg()
                await this.queryContract(msg, this.onChainIssuer.issuer.kyc_contract_address)
                this.isLoading = false
                if (this.onChainIssuer.issuer['sbt_contract_address'] != '') {
                    return true;
                } else {
                    return false
                }
            } catch (e) {
                this.notifyErr("Error ", e.message);
                this.isLoading = false;
            }
        },
        async initSBTcontract() {
            try {

                if (await this.checkIfalreadyDeployed()) {
                    // setTimeout(() => {
                    //     this.nextStep()
                    // }, 2000)
                    return;
                }

                this.isLoading = true
                const { SBT_TOKEN_CODE_ID } = await import(`../../blockchains-metadata/${this.selectedBlockchain.ecosystem}/contract/${this.selectedBlockchain.blockchain}/config`)

                const smartContractMsg = constructInitSbtMsg(
                    SBT_TOKEN_CODE_ID
                );

                const chainConfig = getCosmosChainConfig(this.selectedChainId)
                const chainCoinDenom = chainConfig["feeCurrencies"][0]["coinMinimalDenom"]
                const result = await smartContractExecuteRPC(
                    this.getCosmosConnection.signingClient,
                    chainCoinDenom,
                    this.getBlockchainUser.walletAddress,
                    this.onChainIssuer.issuer.kyc_contract_address,
                    smartContractMsg);

                if (result) {
                    console.log(result)
                    this.notifySuccess('Successfully minted your identity')
                    this.isLoading = false
                }


                const msg = constructGetRegistredSBTContractAddressMsg()
                this.queryContract(msg, this.onChainIssuer.issuer.kyc_contract_address)

            } catch (e) {
                console.error(e.message)
                this.notifyErr("Error ", e.message);
                this.isLoading = false
            }
        }
    },
    mixins: [UtilsMixin],
}
</script>