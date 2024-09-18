<template>
    <div class="container ">
        <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>


        <div class="row card-body card">
            <div class="col-md-12">
                <div>
                    <label for="selectService"><strong>Blockchain Network<span style="color: red">*</span>:
                        </strong></label>
                    <!--               
                    <b-dropdown id="dropdown-custom" size="sm" variant="outline-secondary"
                        text="Select Blockchain Network" block class="m-2">
                        <b-dropdown-group v-for="option in selectNetworks" :key="option.label" id="dropdown-group-2"
                            :header="option.label">
                            <b-dropdown-item v-for="eachOption in option.options" :key="eachOption.text"
                                v-model="selectedChainId" @click="changeNetwork()"><b-avatar :src="eachOption.icon"
                                    size="20"></b-avatar> {{
                                        eachOption.text
                                    }}</b-dropdown-item>
                        </b-dropdown-group>
                    </b-dropdown> -->

                    <b-form-select v-on:change="changeNetwork()" v-model="selectedChainId" :options="selectNetworks"
                        size="" text="Select"></b-form-select>
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

            <div class="col-md-12 mt-1" v-if="selectedBlockchain">
                <div class="form-group">
                    <label for="selectIssuer"><strong>Issuer DID<span style="color: red">*</span>:</strong></label>
                    <!-- <input type="text" class="form-control" id="" v-model="selectedIssuerDID"
                        placeholder="Enter a DID (e.g did:hid:testnet:..)" /> -->
                    <select class="custom-select" id="selectService" v-model="selectedIssuerDID">
                        <option value="" selected>Select a DID</option>
                        <option v-for="did in associatedSSIServiceDIDs" :value="did" :key="did">
                            {{ did }}
                        </option>
                    </select>
                    <!-- <small>Make sure to use associated DID</small> -->
                </div>
            </div>


            <div class="col-md-12" v-if="Object.keys(getBlockchainUser).length > 0">
                <div class="form-group">
                    <!-- <tool-tip infoMessage="SSI Service Id"></tool-tip> -->
                    <label for=""><strong>Wallet Address: </strong></label>
                    <!-- <input type="text" class="form-control" id="" v-model="getBlockchainUser.walletAddress"
                        aria-describedby="orgNameHelp" disabled /> -->

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
                    <!-- <tool-tip infoMessage="SSI Service Id"></tool-tip> -->
                    <label for=""><strong>KYC Contract Address: </strong></label>
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
                        v-on:click="deployIssuer()">
                        <b-avatar :src="chainConfig.currencies[0].coinImageUrl" size="30"></b-avatar> Deploy KYC
                        Contract
                    </button>

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
import { getCosmosBlockchainLabel, getCosmosChainConfig, createNonSigningClient, getCosmosCoinLogo } from '../../blockchains-metadata/cosmos/wallet/cosmos-wallet-utils'
import { getSupportedChains } from '../../blockchains-metadata/wallet'
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
        // const supportedChainsall = getSupportedChains()
        // Interchain 

        if (Object.keys(this.getOnChainConfig).length <= 0) {
            this.reset();

            const { interchain } = this.allSupportedChains
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

            this.isLoading = true
            await this.prepareDIDList()
            this.isLoading = false

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
            associatedSSIServiceDIDs: []
        }
    },
    methods: {
        ...mapMutations('walletStore', ['setBlockchainUser',
            "setCosmosConnection", 'nextStep', 'setOnChainIssuerData', 'updateAnAppOnServer']),
        ...mapActions("mainStore", [
            "updateAnAppOnServer",
            "fetchDIDsForAService",

        ]),
        ...mapMutations('mainStore', ['setOnChainConfig']),
        ...mapActions("mainStore", ['createAppsOnChainConfig']),

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
            await window.keplr.disable()
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
                const { HYPERSIGN_KYC_FACTORY_CONTRACT_ADDRESS } = await import(`../../blockchains-metadata/${this.selectedBlockchain.ecosystem}/contract/${this.selectedBlockchain.blockchain}/config`)
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

        async changeNetwork() {
            try {
                if (!this.selectedChainId) {
                    this.reset()
                    return
                }
                console.log('netowrk change...')
                // TODO remove this
                // this.selectedIssuerDID = `did:hid:testnet:` + crypto.randomUUID()

                this.chainConfig = getCosmosChainConfig(this.selectedChainId)
                this.onChainIssuer.issuer = {}
                this.setBlockchainUser({})
                this.nonSigningClient = await createNonSigningClient(this.chainConfig["rpc"]);



            } catch (e) {
                this.notifyErr("Error ", e.message);
            }
        },
        async queryContract(msg, contractAddress) {
            console.log('queryContract:: Before calling  smartContractQueryRPC(), contractAddress ' + contractAddress)
            const result = await smartContractQueryRPC(
                this.getCosmosConnection.nonSigningClient || this.nonSigningClient,
                contractAddress, msg);
            console.log('queryContract:: After calling  smartContractQueryRPC(), contractAddress ' + contractAddress)
            this.onChainIssuer = result;
            this.setOnChainIssuerData(this.onChainIssuer)
            this.selectedIssuerDID = this.onChainIssuer.issuer.did
        },

        dummyGetDidDocAndProofs() {
            const did_doc = [
                {
                    "https://www.w3.org/ns/activitystreams#alsoKnownAs": [
                        {
                            "@id": "did:hid:testnet:z6Mkk8qQLgMmLKDq6ER9BYGycFEdSaPqy9JPWKUaPGWzJeNp"
                        }
                    ],
                    "https://w3id.org/security#assertionMethod": [
                        {
                            "@id": "did:hid:testnet:z6Mkk8qQLgMmLKDq6ER9BYGycFEdSaPqy9JPWKUaPGWzJeNp#key-1"
                        }
                    ],
                    "https://w3id.org/security#authenticationMethod": [
                        {
                            "@id": "did:hid:testnet:z6Mkk8qQLgMmLKDq6ER9BYGycFEdSaPqy9JPWKUaPGWzJeNp#key-1"
                        }
                    ],
                    "https://w3id.org/security#capabilityDelegationMethod": [
                        {
                            "@id": "did:hid:testnet:z6Mkk8qQLgMmLKDq6ER9BYGycFEdSaPqy9JPWKUaPGWzJeNp#key-1"
                        }
                    ],
                    "https://w3id.org/security#capabilityInvocationMethod": [
                        {
                            "@id": "did:hid:testnet:z6Mkk8qQLgMmLKDq6ER9BYGycFEdSaPqy9JPWKUaPGWzJeNp#key-1"
                        }
                    ],
                    "https://w3id.org/security#controller": [
                        {
                            "@id": "did:hid:testnet:z6Mkk8qQLgMmLKDq6ER9BYGycFEdSaPqy9JPWKUaPGWzJeNp"
                        }
                    ],
                    "@id": this.selectedIssuerDID,
                    "https://w3id.org/security#keyAgreementMethod": [],
                    "https://www.w3.org/ns/did#service": [],
                    "https://w3id.org/security#verificationMethod": [
                        {
                            "https://w3id.org/security#controller": [
                                {
                                    "@id": "did:hid:testnet:z6Mkk8qQLgMmLKDq6ER9BYGycFEdSaPqy9JPWKUaPGWzJeNp"
                                }
                            ],
                            "@id": "did:hid:testnet:z6Mkk8qQLgMmLKDq6ER9BYGycFEdSaPqy9JPWKUaPGWzJeNp#key-1",
                            "https://w3id.org/security#publicKeyMultibase": [
                                {
                                    "@type": "https://w3id.org/security#multibase",
                                    "@value": "z6Mkk8qQLgMmLKDq6ER9BYGycFEdSaPqy9JPWKUaPGWzJeNp"
                                }
                            ],
                            "@type": [
                                "https://w3id.org/security#Ed25519VerificationKey2020"
                            ]
                        }
                    ]
                }
            ]

            const did_doc_proof = [
                {
                    "https://w3id.org/security#challenge": [
                        {
                            "@value": "123123"
                        }
                    ],
                    "http://purl.org/dc/terms/created": [
                        {
                            "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
                            "@value": "2024-09-01T17:44:11Z"
                        }
                    ],
                    "https://w3id.org/security#domain": [
                        {
                            "@value": "http:adsasd"
                        }
                    ],
                    "https://w3id.org/security#proofPurpose": [
                        {
                            "@id": "https://w3id.org/security#authenticationMethod"
                        }
                    ],
                    "@type": [
                        "https://w3id.org/security#Ed25519Signature2020"
                    ],
                    "https://w3id.org/security#verificationMethod": [
                        {
                            "@id": "did:hid:testnet:z6Mkk8qQLgMmLKDq6ER9BYGycFEdSaPqy9JPWKUaPGWzJeNp#key-1"
                        }
                    ]
                }
            ]

            const signature = "z3aY71DPQAqiiV5Q4UYZ6EYeWYa3MjeEHeEZMxcNfYxTqyn6r14yy1K3eYpuNuPQDX2mjh2BJ8VaPj5UKKMcAjtSq"

            return {
                did_doc, did_doc_proof, signature
            }
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

                const smartContractMsg = constructOnBoardIssuer({
                    ...this.dummyGetDidDocAndProofs()
                });

                console.log(smartContractMsg)


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
            // this.selectedIssuerDID = "did:hid:testnet:z6Mkk8qQLgMmLKDq6ER9BYGycFEdSaPqy9JPWKUaPGWzJeNp"
            this.selectedChainId = null
            this.setBlockchainUser({})
        }

    },
    mixins: [UtilsMixin],
}
</script>