<template>
    <div class="container ">
        <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>


        <div class="row card-body card">
            <div class="col-md-12">
                <div>
                    <label for="selectService"><strong>Blockchain Network<span style="color: red">*</span>:
                        </strong></label>

                    <b-form-select v-on:change="changeNetwork()" v-model="selectedChainId" :options="selectNetworks"
                        size="" text="Select"></b-form-select>
                    <small v-if="selectedBlockchain">ChainId: {{ selectedBlockchain.chainId }}</small>
                </div>
            </div>

            <div class="col-md-12 mt-1" v-if="selectedBlockchain">
                <div class="form-group">
                    <label for="selectIssuer"><strong>Issuer DID<span style="color: red">*</span>:</strong></label>
                    <select class="custom-select" id="selectService" v-model="selectedIssuerDID">
                        <option value="" selected>Select a DID</option>
                        <option v-for="did in associatedSSIServiceDIDs" :value="did" :key="did">
                            {{ did }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="col-md-12" v-if="Object.keys(getBlockchainUser).length > 0">
                <div class="form-group">
                    <label for=""><strong>Your Wallet Address: </strong></label>
                    <b-input-group>
                        <b-form-input v-model="getBlockchainUser.walletAddress" disabled></b-form-input>
                        <b-input-group-append>
                            <b-button variant="outline-secondary btn-sm" @click="disconnectWallet()"><b-icon
                                    icon="box-arrow-in-right"></b-icon></b-button>
                        </b-input-group-append>
                    </b-input-group>
                </div>
            </div>

            <div class="col-md-12" v-if="Object.keys(onChainIssuer.issuer).length > 0">
                <div class="form-group">
                    <label for=""><strong>KYC Contract Address: </strong></label>
                    <input type="text" class="form-control" id="" v-model="onChainIssuer.issuer.kyc_contract_address"
                        disabled />
                </div>
            </div>

            <div class="col-md-12" v-if="masterWallet != ''">
                <div class="form-group">
                    <label for=""><strong>Issuer Wallet Address: </strong></label>
                    <b-input-group>
                        <b-form-input v-model="masterWallet" disabled></b-form-input>
                        <b-input-group-append v-if="masterWalletFundTxStatus?.status == 200">
                            <b-button variant="outline-success btn-sm"><b-icon icon="check2-all"
                                    disable></b-icon></b-button>
                        </b-input-group-append>
                    </b-input-group>
                    <!-- <input type="text" class="form-control" id="" v-model="masterWallet" disabled /> -->
                    <small>Fund the issuer wallet (hot) with 0.1000 DIAM to activate it on the blockchain</small>
                </div>

            </div>

            <div class="col-md-12">
                <div>
                    <ConnectWalletButtonKeplr :ecosystem="selectedBlockchain.ecosystem"
                        :blockchain="selectedBlockchain.blockchain" :chainId="selectedBlockchain.chainId"
                        @authEvent="myEventListener" style="width:100%"
                        v-if="showConnectWallet && selectedBlockchain && selectedIssuerDID && !onChainIssuer.issuer.kyc_contract_address && selectedBlockchain.ecosystem == 'cosmos'" />


                    <ConnectWalletButtonDiam :ecosystem="selectedBlockchain.ecosystem"
                        :blockchain="selectedBlockchain.blockchain" :chainId="selectedBlockchain.chainId"
                        @authEvent="myEventListener" style="width:100%"
                        v-if="showConnectWallet && selectedBlockchain && selectedIssuerDID && !onChainIssuer.issuer.kyc_contract_address && selectedBlockchain.ecosystem == 'stellar'" />


                    <button class="btn btn-outline-dark btn-md" style="width:100%"
                        v-if="!showConnectWallet && selectedBlockchain && getBlockchainUser.walletAddress && !onChainIssuer.issuer.kyc_contract_address && selectedBlockchain.ecosystem == 'cosmos'"
                        v-on:click="deployIssuer()">
                        <b-avatar :src="chainConfig.currencies[0].coinImageUrl" size="30"></b-avatar> Deploy KYC
                        Contract
                    </button>

                    <button class="btn btn-outline-dark btn-md" style="width:100%"
                        v-if="!showConnectWallet && selectedBlockchain && getBlockchainUser.walletAddress && !masterWalletFundTxStatus && masterWallet == '' && selectedBlockchain.ecosystem == 'stellar'"
                        v-on:click="deployMasterWallet()">
                        Deploy Issuer Wallet
                    </button>

                    <button class="btn btn-outline-dark btn-md" style="width:100%"
                        v-if="!showConnectWallet && selectedBlockchain && getBlockchainUser.walletAddress && !masterWalletFundTxStatus && masterWallet != '' && selectedBlockchain.ecosystem == 'stellar'"
                        v-on:click="fundMasterWallet()">
                        <b-avatar :src="chainConfig.currencies[0].coinImageUrl" size="30"></b-avatar> Fund
                        Issuer Wallet
                    </button>
                </div>
            </div>
        </div>

        <div class="row mt-2"
            v-if="onChainIssuer.issuer.kyc_contract_address && selectedBlockchain.ecosystem != 'stellar'">
            <div class="col">
                <div class="center">
                    <hf-buttons name="Next" class="btn btn-primary" iconClass="fa fa-chevron-right"
                        @executeAction="nextStep()"></hf-buttons>
                </div>
            </div>
        </div>

        <div class="row mt-2" v-if="masterWalletFundTxStatus">
            <div class="col">
                <div class="center">
                    <hf-buttons name="Next" class="btn btn-primary" iconClass="fa fa-chevron-right"
                        @executeAction="nextStep(2)"></hf-buttons>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import ConnectWalletButtonKeplr from "../element/authButtons/ConnectWalletButtonKeplr.vue";
import ConnectWalletButtonDiam from '../element/authButtons/ConnectWalletButtonDiam.vue';


import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import { getCosmosBlockchainLabel, getCosmosChainConfig, getCosmosCoinLogo } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/cosmos-wallet-utils'
import { getStellarBlockchainLabel, getStellarCoinLogo, getStellarChainConfig } from '@hypersign-protocol/hypersign-kyc-chains-metadata/stellar/wallet/stellar-wallet-utils'
import { createNonSigningClient, calculateFee } from '../../utils/wallet-client/cosmos-wallet-client'
import { getSupportedChains } from '@hypersign-protocol/hypersign-kyc-chains-metadata/blockchain'
import { smartContractExecuteRPC } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/contract/execute'
import { smartContractQueryRPC } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/contract/query'
import UtilsMixin from '../../mixins/utils'
import { constructOnBoardIssuer, constructGetRegistredIssuerMsg } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/contract/msg';

const jsonld = require('jsonld');
import customLoader from '../../utils/documentLoader';
export default {
    name: 'DeployKyc',
    components: {
        ConnectWalletButtonKeplr,
        ConnectWalletButtonDiam
    },
    watch: {
        async selectedIssuerDID() {
            console.log('Inside  selectedIssuerDID()')
            const r = await this.checkIfIssuerHasAlreadyDeployed()
            console.log(r)
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
        ...mapState('mainStore', ['didList']),
        ...mapGetters("walletStore", ['getBlockchainUser', 'getCosmosConnection',]),
        // ...mapState("mainStore", ['onchainconfigs']),
        ...mapGetters("mainStore", ['getOnChainConfig', 'getSelectedService', 'getAppsWithSSIServices']),
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
        await this.prepareBlockchainNetworks()
    },


    data() {
        return {
            isLoading: false,
            fullPage: true,
            selectedChainId: null,
            allSupportedChains: getSupportedChains(),
            selectNetworks: [
                { value: null, text: 'Please select a blockchain' },
            ],
            chainConfig: {},

            selectedIssuerDID: "",
            // selectIssuers: [
            //     { value: null, text: 'Please select a issuer' },
            //     { value: 'did:hid:123123123123', text: 'did:hid:123123123123' },
            // ],

            onChainIssuer: {
                issuer: {}
            },
            nonSigningClient: null,

            masterWalletXdr: "",
            masterWallet: "",
            masterWalletEdvDoc: "",
            masterWalletFundTxStatus: null,
            associatedSSIServiceDIDs: []
        }
    },
    methods: {
        ...mapMutations('walletStore', ['setBlockchainUser',
            "setCosmosConnection", 'nextStep', 'setOnChainIssuerData', 'updateAnAppOnServer', 'setOnChainBlockchainLabel']),
        ...mapActions("mainStore", [
            "updateAnAppOnServer",
            "fetchDIDsForAService",
            "generateDIDProof",
            "createMasterWallet"
        ]),
        ...mapMutations('mainStore', ['setOnChainConfig']),
        ...mapActions("mainStore", ['createAppsOnChainConfig']),

        async prepareBlockchainNetworks() {
            if (Object.keys(this.getOnChainConfig).length <= 0) {
                this.reset();

                const { interchain, stellar } = this.allSupportedChains

                { // Interchain
                    const interchainOptions = []
                    interchain.forEach(chain => {
                        const chainLabel = getCosmosBlockchainLabel(chain)
                        interchainOptions.push({
                            value: chainLabel,
                            text: chain.chainName,
                            icon: getCosmosCoinLogo(chainLabel)
                        })
                    })
                    this.selectNetworks.push({
                        label: 'Interchain', // let's keep this for future purposes when we have many networks.
                        options: interchainOptions
                    })
                }

                { // Stellar
                    const stellarOptions = []
                    stellar.forEach(chain => {
                        const chainLabel = getStellarBlockchainLabel(chain)
                        stellarOptions.push({
                            value: chainLabel,
                            text: chain.chainName,
                            icon: getStellarCoinLogo(chainLabel)
                        })
                    })
                    this.selectNetworks.push({
                        label: 'Stellar', // let's keep this for future purposes when we have many networks.
                        options: stellarOptions
                    })
                }

                this.isLoading = true
                await this.prepareDIDList()
                this.isLoading = false
            }
        },

        async prepareDIDList() {
            try {
                const ssiSserviceId = this.getSelectedService?.dependentServices[0]
                if (ssiSserviceId) {

                    const associatedSSIService = this.getAppsWithSSIServices.find(
                        (x) => x.appId === ssiSserviceId
                    );
                    if (associatedSSIService) {
                        const payload = {
                            tenantUrl: associatedSSIService.tenantUrl,
                            accessToken: associatedSSIService.access_token,
                        };
                        this.isLoading = true;
                        const allDIDs = await this.fetchDIDsForAService(payload);
                        this.associatedSSIServiceDIDs = allDIDs;
                        this.isLoading = false;
                    }
                }
            } catch (e) {
                this.isLoading = false;

                this.notifyErr(e.message);
            }
        },

        async disconnectWallet() {
            if (this.selectedBlockchain.ecosystem == 'cosmos') {
                await window.keplr.disable()
            }
            this.setCosmosConnection({})
            this.setBlockchainUser({})
        },

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
                const { HYPERSIGN_KYC_FACTORY_CONTRACT_ADDRESS } = await import(`@hypersign-protocol/hypersign-kyc-chains-metadata/${this.selectedBlockchain.ecosystem}/contract/${this.selectedBlockchain.blockchain}/${this.selectedBlockchain.chainId}/config`)
                if (!this.selectedIssuerDID) {
                    this.isLoading = false
                    return
                }

                // const msg = constructGetRegistredIssuerMsg("did:hid:testnet:z6Mkk8qQLgMmLKDq6ER9BYGycFEdSaPqy9JPWKUaPGWzJeNp")
                const msg = constructGetRegistredIssuerMsg(this.selectedIssuerDID)
                console.log('checkIfIssuerHasAlreadyDeployed:: Before querying kyc contract address = ' + HYPERSIGN_KYC_FACTORY_CONTRACT_ADDRESS)
                const resp = await this.queryContract(msg, HYPERSIGN_KYC_FACTORY_CONTRACT_ADDRESS)
                console.log('checkIfIssuerHasAlreadyDeployed:: After querying kyc contract address = ' + JSON.stringify(resp))

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

        async selectStellarNetwork() {
            this.chainConfig = getStellarChainConfig(this.selectedChainId)
            console.log(this.chainConfig)
            // TODO:

            // window.diam ? 

            this.nonSigningClient = null
        },

        async selectCosmosNetwork() {
            this.chainConfig = getCosmosChainConfig(this.selectedChainId)
            this.nonSigningClient = await createNonSigningClient(this.chainConfig["rpc"]);
        },

        async changeNetwork() {
            try {
                if (!this.selectedChainId) {
                    this.reset()
                    return
                }

                console.log(this.selectedChainId)
                this.onChainIssuer.issuer = {}
                this.setBlockchainUser({})

                if (this.selectedChainId.indexOf('stellar') >= 0) {
                    await this.selectStellarNetwork()
                } else if (this.selectedChainId.indexOf('cosmos') >= 0) {
                    await this.selectCosmosNetwork()
                }

            } catch (e) {
                this.notifyErr("Error ", e.message);
            }
        },

        async queryContract(msg, contractAddress) {
            this.setOnChainBlockchainLabel(this.selectedChainId)
            console.log('queryContract:: Before calling  smartContractQueryRPC(), contractAddress ' + contractAddress)
            const result = await smartContractQueryRPC(
                this.getCosmosConnection.nonSigningClient || this.nonSigningClient,
                contractAddress, msg);
            console.log('queryContract:: After calling  smartContractQueryRPC(), result ' + JSON.stringify(result, null, 2))
            this.onChainIssuer = result;
            this.setOnChainIssuerData(this.onChainIssuer)
            this.selectedIssuerDID = this.onChainIssuer.issuer.did

        },

        async dummyGetDidDocAndProofs() {
            const did = this.selectedIssuerDID;
            const didDocument = this.didList.find(x => x.did == did)?.didDocument;
            const verificationMethodId = didDocument?.verificationMethod[0]?.id

            this.isLoading = true;
            delete didDocument["verificationMethod"][0]["blockchainAccountId"]
            const proofdoc = await this.generateDIDProof({
                did,
                didDocument,
                verificationMethodId,
                options: {
                    challenge: uuidv4(),
                    domain: "entity.dashboard.hypersign.id",
                    purpose: 'authentication'
                }
            })

            this.isLoading = false;
            const tempproofdoc = proofdoc;

            // signature
            const signature = tempproofdoc['proof']['proofValue'];

            // expanded diddocproof
            delete tempproofdoc['proof']['proofValue'];
            const did_doc_proof_normal = {
                '@context': tempproofdoc['@context'],
                ...tempproofdoc['proof']
            }
            const did_doc_proof_expanded = await jsonld.expand(did_doc_proof_normal, { documentLoader: customLoader })

            // expanded diddoc
            delete tempproofdoc['proof']
            const did_doc_normal = tempproofdoc;
            const did_doc_expanded = await jsonld.expand(did_doc_normal, { documentLoader: customLoader })
            return {
                did_doc: did_doc_expanded, did_doc_proof: did_doc_proof_expanded, signature
            }
        },

        async fundMasterWallet() {
            try {
                this.isLoading = true
                this.masterWalletFundTxStatus = await this.getCosmosConnection.signingClient(this.masterWalletXdr)
                if (this.masterWalletFundTxStatus && this.masterWalletFundTxStatus.status == 200) {
                    this.notifySuccess('Successfully created master wallet')
                } else {
                    this.masterWalletFundTxStatus = null
                    throw new Error('Could fund issuer wallet account ')
                }
                await this.createAppsOnChainConfig({
                    walletAddress: this.getBlockchainUser.walletAddress,
                    issuerDid: this.selectedIssuerDID,
                    blockchainLabel: this.selectedChainId,
                    kycContractAddress: "-",
                    kycContractTxHash: "-",
                    options: {
                        "masterWalletAddress": this.masterWallet,
                        "edvDocId": this.masterWalletEdvDoc
                    }
                })
                this.isLoading = false

            } catch (e) {
                console.error(e.message)
                this.notifyErr(e.message);
                this.isLoading = false
            }
        },

        async deployMasterWallet() {
            try {
                this.isLoading = true
                const payload = {
                    "blockchainLabel": this.selectedChainId,
                    "walletAddress": this.getBlockchainUser.walletAddress
                }
                const result = await this.createMasterWallet(payload)
                if (!result) {
                    throw new Error('Could not create issuer wallet')
                }

                this.masterWallet = result.masterWalletAddress
                this.masterWalletXdr = result.xdr;
                this.masterWalletEdvDoc = result.edvDocId
                this.isLoading = false

            } catch (e) {
                console.error(e.message)
                this.notifyErr(e.message);
                this.isLoading = false
            }
        },

        async deployIssuer() {
            try {


                if (!this.selectedIssuerDID) {
                    throw new Error('Issuer DID is required')
                }


                this.isLoading = true
                const { HYPERSIGN_KYC_FACTORY_CONTRACT_ADDRESS } = await import(`@hypersign-protocol/hypersign-kyc-chains-metadata/${this.selectedBlockchain.ecosystem}/contract/${this.selectedBlockchain.blockchain}/${this.selectedBlockchain.chainId}/config`)

                const proof = await this.dummyGetDidDocAndProofs()

                const smartContractMsg = constructOnBoardIssuer({
                    ...proof
                });

                const chainConfig = this.chainConfig
                const chainCoinDenom = chainConfig["feeCurrencies"][0]["coinMinimalDenom"]
                const gasPriceAvg = chainConfig["gasPriceStep"]["average"]
                const fee = calculateFee(500_000, (gasPriceAvg + chainCoinDenom).toString())

                const result = await smartContractExecuteRPC(
                    this.getCosmosConnection.signingClient,
                    chainCoinDenom,
                    this.getBlockchainUser.walletAddress,
                    HYPERSIGN_KYC_FACTORY_CONTRACT_ADDRESS,
                    smartContractMsg,
                    fee
                );

                if (result) {
                    console.log(result)
                    this.notifySuccess('Successfully deployed your KYC Issuer Contract')
                    this.isLoading = false


                    const msg = constructGetRegistredIssuerMsg(this.selectedIssuerDID)
                    // const msg = constructGetRegistredIssuerMsg("did:hid:testnet:z6Mkk8qQLgMmLKDq6ER9BYGycFEdSaPqy9JPWKUaPGWzJeNp")
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
            this.masterWallet = ""
            this.masterWalletXdr = ""
            this.masterWalletFundTxStatus = null
            // this.selectedIssuerDID = "did:hid:testnet:z6Mkk8qQLgMmLKDq6ER9BYGycFEdSaPqy9JPWKUaPGWzJeNp"
            this.selectedChainId = null
            this.setBlockchainUser({})
        }

    },
    mixins: [UtilsMixin],
}
</script>