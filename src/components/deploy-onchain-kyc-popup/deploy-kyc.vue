<template>
    <div class="container ">
        <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>


        <div class="row card-body card">
            <div class="col-md-12">
                <div class="form-group">
                    <label for="selectService"><strong>Select Blockchain Network<span style="color: red">*</span>:
                        </strong></label>
                    <b-form-select v-on:change="changeNetwork()" v-model="selectedChainId" :options="selectNetworks"
                        size=""></b-form-select>
                    <small v-if="selectedBlockchain">ChainId: {{ selectedBlockchain.chainId }}</small>
                </div>
            </div>
            <!-- <div class="col-md-12">
                <div class="form-group">
                    <label for="selectIssuer"><strong>Select Issuer Id<span style="color: red">*</span>:
                        </strong></label>
                    <b-form-select v-model="selectedIssuerDID" :options="selectIssuers" size=""></b-form-select>
                </div>
            </div> -->

            <div class="col-md-12" v-if="selectedBlockchain">
                <div class="form-group">
                    <label for="selectIssuer"><strong>Enter Issuer DID<span
                                style="color: red">*</span>:</strong></label>
                    <input type="text" class="form-control" id="" v-model="selectedIssuerDID"
                        placeholder="did:hid:testnet:..." />
                    <small>Make sure to use associated DID</small>
                </div>
            </div>


            <div class="col-md-12" v-if="Object.keys(getBlockchainUser).length > 0">
                <div class="form-group">
                    <!-- <tool-tip infoMessage="SSI Service Id"></tool-tip> -->
                    <label for=""><strong>Your Wallet Address: </strong></label>
                    <input type="text" class="form-control" id="" v-model="getBlockchainUser.walletAddress"
                        aria-describedby="orgNameHelp" disabled />
                </div>
            </div>

            <div class="col-md-12" v-if="Object.keys(onChainIssuer.issuer).length > 0">
                <div class="form-group">
                    <!-- <tool-tip infoMessage="SSI Service Id"></tool-tip> -->
                    <label for=""><strong>Kyc Contract Address: </strong></label>
                    <input type="text" class="form-control" id="" v-model="onChainIssuer.issuer.kyc_contract_address"
                        disabled />
                </div>
            </div>

            <div class="col-md-12">
                <div>
                    <ConnectWalletButton :ecosystem="selectedBlockchain.ecosystem"
                        :blockchain="selectedBlockchain.blockchain" :chainId="selectedBlockchain.chainId"
                        @authEvent="myEventListener" style="width:100%"
                        v-if="showConnectWallet && selectedBlockchain && selectedIssuerDID && !onChainIssuer.issuer.kyc_contract_address" />



                    <button class="btn btn-outline-dark btn-md" style="width:100%"
                        v-if="!showConnectWallet && selectedBlockchain && getBlockchainUser.walletAddress && !onChainIssuer.issuer.kyc_contract_address"
                        v-on:click="deployIssuer()">Deploy KYC Contract</button>

                    <!-- <button class="btn btn-primary btn-md" style="width:100%"
                        v-if="selectedIssuerDID && selectedBlockchain && !onChainIssuer.issuer.kyc_contract_address"
                        v-on:click="checkIfIssuerHasAlreadyDeployed()">Check If Already
                        Deployed</button> -->

                </div>
            </div>


        </div>


        <div class="row mt-2" v-if="onChainIssuer.issuer.kyc_contract_address">
            <div class="col">
                <div class="center">
                    <hf-buttons name="Next" class="btn btn-primary" iconClass="fa fa-chevron-right"
                        @executeAction="nextStep()"></hf-buttons>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ConnectWalletButton from "../element/authButtons/ConnectWalletButton.vue";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { getCosmosBlockchainLabel, getCosmosChainConfig } from '../../blockchains-metadata/cosmos/wallet/cosmos-wallet-utils'
import { getSupportedChains, } from '../../blockchains-metadata/wallet'
import { smartContractExecuteRPC } from '../../blockchains-metadata/cosmos/contract/execute'
import { smartContractQueryRPC } from '../../blockchains-metadata/cosmos/contract/query'
import UtilsMixin from '../../mixins/utils'
import { constructOnBoardIssuer, constructGetRegistredIssuerMsg } from '../../blockchains-metadata/cosmos/contract/msg';

export default {
    name: 'DeployKyc',
    components: {
        ConnectWalletButton,
    },
    watch: {
        async selectedIssuerDID() {
            const r = await this.checkIfIssuerHasAlreadyDeployed()
            if (r) {
                this.notifySuccess('Successfully fetched KYC contract for this issuer')
            } else {
                // this.notifyErr('Could not fetch kyc issuer')
                this.onChainIssuer = {
                    issuer: {}
                }
            }
        }
    },
    computed: {
        ...mapGetters("walletStore", ['getBlockchainUser', 'getCosmosConnection']),
        // ...mapState("mainStore", ['onchainconfigs']),
        ...mapGetters("mainStore", ['getOnChainConfig']),
        showConnectWallet() {
            if (this.getBlockchainUser && Object.keys(this.getBlockchainUser).length > 0) {
                return false
            } else return true
        },


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
        // const supportedChainsall = getSupportedChains()
        // Interchain 

        if (Object.keys(this.getOnChainConfig).length <= 0) {
            this.reset();

            const { interchain } = this.allSupportedChains
            const interchainOptions = []
            interchain.forEach(chain => {
                interchainOptions.push({
                    value: getCosmosBlockchainLabel(chain),
                    text: chain.chainName
                })
            })
            this.selectNetworks.push({
                label: 'Interchain',
                options: interchainOptions
            })
        }

        // this.bootstrap()
    },

    data() {
        return {
            isLoading: false,
            fullPage: true,
            selectedChainId: null,
            allSupportedChains: getSupportedChains(),
            selectNetworks: [
                { value: null, text: 'Please select a network' },
            ],
            chainConfig: {},

            selectedIssuerDID: "",
            // selectIssuers: [
            //     { value: null, text: 'Please select a issuer' },
            //     { value: 'did:hid:123123123123', text: 'did:hid:123123123123' },
            // ],

            onChainIssuer: {
                issuer: {}
            }
        }
    },
    methods: {
        ...mapMutations('walletStore', ['setBlockchainUser', 'nextStep', 'setOnChainIssuerData', 'updateAnAppOnServer']),
        ...mapActions("mainStore", [
            "updateAnAppOnServer",
        ]),
        ...mapMutations('mainStore', ['setOnChainConfig']),
        ...mapActions("mainStore", ['createAppsOnChainConfig']),
        bootstrap() {
            console.log('Inside bootstrap.....')
            if (Object.keys(this.getOnChainConfig).length > 0) {
                console.log(this.getOnChainConfig)
                this.selectedChainId = this.getOnChainConfig.blockchainLabel;
                this.selectedIssuerDID = this.getOnChainConfig.issuerDid;
                this.onChainIssuer.issuer['kyc_contract_address'] = this.getOnChainConfig.kycContractAddress;
                this.checkIfIssuerHasAlreadyDeployed()

            } else {
                console.log('no onChainConfig set')
                this.reset();
            }

        },
        async checkIfIssuerHasAlreadyDeployed() {
            try {
                this.isLoading = true;
                const { HYPERSIGN_KYC_FACTORY_CONTRACT_ADDRESS } = await import(`../../blockchains-metadata/${this.selectedBlockchain.ecosystem}/contract/${this.selectedBlockchain.blockchain}/config`)
                if (!this.selectedIssuerDID) {
                    this.isLoading = false
                    return
                }
                const msg = constructGetRegistredIssuerMsg(this.selectedIssuerDID)
                await this.queryContract(msg, HYPERSIGN_KYC_FACTORY_CONTRACT_ADDRESS)

                // TODO
                // const onchainConfig = this.onchainconfigs.find(x => x.kycContractAddress === this.onChainIssuer.issuer.kyc_contract_address)

                this.isLoading = false

                return true;

            } catch (e) {
                console.log(e.message)
                this.isLoading = false

                return false;
            }
        },
        async myEventListener(data) {
            console.log('Inside myEventListener')
            console.log(data)
            // this.nft.metadata = await this.getContractMetadata(this.getOnChainIssuerConfig.contractAddress)


        },

        changeNetwork() {
            try {
                if (!this.selectedChainId) {
                    this.reset()
                    return
                }
                console.log('netowrk change...')
                this.chainConfig = getCosmosChainConfig(this.selectedChainId)
                this.onChainIssuer.issuer = {}
                this.setBlockchainUser({})
            } catch (e) {
                this.notifyErr("Error ", e.message);
            }
        },
        async queryContract(msg, contractAddress) {
            console.log('queryContract.....')
            const result = await smartContractQueryRPC(
                this.getCosmosConnection.nonSigningClient,
                contractAddress, msg);

            console.log(result)
            this.onChainIssuer = result;
            this.setOnChainIssuerData(this.onChainIssuer)
            this.selectedIssuerDID = this.onChainIssuer.issuer.did
        },

        async deployIssuer() {
            try {


                if (!this.selectedIssuerDID) {
                    throw new Error('Issuer DID is required')
                }


                this.isLoading = true
                const { HYPERSIGN_KYC_FACTORY_CONTRACT_ADDRESS, ISSUER_KYC_CODE_ID } = await import(`../../blockchains-metadata/${this.selectedBlockchain.ecosystem}/contract/${this.selectedBlockchain.blockchain}/config`)
                console.log({
                    HYPERSIGN_KYC_FACTORY_CONTRACT_ADDRESS, ISSUER_KYC_CODE_ID
                })

                const smartContractMsg = constructOnBoardIssuer(
                    this.selectedIssuerDID,
                    ISSUER_KYC_CODE_ID
                );
                const chainConfig = this.chainConfig
                const chainCoinDenom = chainConfig["feeCurrencies"][0]["coinMinimalDenom"]
                const result = await smartContractExecuteRPC(
                    this.getCosmosConnection.signingClient,
                    chainCoinDenom,
                    this.getBlockchainUser.walletAddress,
                    HYPERSIGN_KYC_FACTORY_CONTRACT_ADDRESS,
                    smartContractMsg);

                if (result) {
                    console.log(result)
                    this.notifySuccess('Successfully minted your identity')
                    this.isLoading = false


                    const msg = constructGetRegistredIssuerMsg(this.selectedIssuerDID)
                    await this.queryContract(msg, HYPERSIGN_KYC_FACTORY_CONTRACT_ADDRESS)

                    this.createAppsOnChainConfig({
                        walletAddress: this.getBlockchainUser.walletAddress,
                        issuerDid: this.selectedIssuerDID,
                        blockchainLabel: this.selectedChainId,
                        kycContractAddress: this.onChainIssuer.issuer.kyc_contract_address,
                        kycContractTxHash: result.transactionHash
                    })

                    // if (resp) {
                    //     this.setOnChainConfigId(resp._id)
                    // }

                }

            } catch (e) {
                console.error(e.message)
                this.notifyErr(e.message);
                this.isLoading = false
            }
        },

        reset() {
            this.onChainIssuer = {
                issuer: {}
            }
            this.walletAddress = ""
            this.selectedIssuerDID = ""
            this.selectedChainId = null
            this.setBlockchainUser({})
        }

    },
    mixins: [UtilsMixin],
}
</script>