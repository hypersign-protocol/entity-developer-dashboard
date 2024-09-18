<template>
    <div>
        <button type="button" class="btn btn-outline-dark btn-lg mb-2" style="width: 100%;" @click="connectWallet()"
            :disabled="isDisable">
            <b-avatar
                src="data:image/jpeg;base64,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"
                rounded size="30"></b-avatar> Connect Keplr</button>
    </div>
</template>
<script>
import { mapMutations } from "vuex";
import { getUserAddressFromOfflineSigner, createClient, createNonSigningClient } from '../../../blockchains-metadata/cosmos/wallet/cosmos-wallet-utils'
import { getCosmosCoinLogo } from '../../../blockchains-metadata/cosmos/wallet/cosmos-wallet-utils'
export const AUTH_PROVIDERS = Object.freeze({
    GOOGLE: 'google',
    KEPLR: 'keplr',
    METAMASK: 'metamask',
})

export default {
    props: {
        isDisable: {
            type: Boolean,
            default: false
        },
        ecosystem: {
            type: String,
            default: "cosmos"
        },
        blockchain: {
            type: String,
            default: "nibiru"
        },
        chainId: {
            type: String,
            default: "nibiru-localnet-0"
        }
    },
    computed: {
        selectedBlockchainLogo() {
            return getCosmosCoinLogo(`${this.ecosystem}:${this.blockchain}:${this.chainId}`)
        }
    },
    methods: {
        ...mapMutations("walletStore", ['setCosmosConnection', 'setBlockchainUser']),
        async connectWallet() {
            // const { ecosystem, blockchain } = this.getOnChainIssuerConfig
            const { default: SupportedChains } = await import(`../../../blockchains-metadata/${this.ecosystem}/wallet/${this.blockchain}/${this.chainId}/chains`)

            if (!SupportedChains) {
                throw new Error('Ecosysem or blockchain is not supported')
            }

            const requestedChainId = this.chainId// this.getOnChainIssuerConfig.chainId
            const chainConfig = SupportedChains.find(x => x.chainId == requestedChainId);
            if (!chainConfig) {
                throw new Error('Chain not supported for chainId requestedChainId ' + requestedChainId)
            }

            const chainId = chainConfig["chainId"];

            if (!window.getOfflineSigner || !window.keplr) {
                console.error("Please install keplr extension");
            } else {
                if (window.keplr.experimentalSuggestChain) {
                    try {
                        await window.keplr.experimentalSuggestChain(
                            chainConfig
                        );
                    } catch {
                        console.error("Failed to suggest the chain");
                    }
                } else {
                    console.error("Please use the recent version of keplr extension");
                }
            }

            await window.keplr.enable(chainId);
            const offlineSigner = window.getOfflineSigner(chainId)
            const userAddress = await getUserAddressFromOfflineSigner(offlineSigner);
            console.log("User Address: ", userAddress)

            if (userAddress != "") {
                const chainRPC = chainConfig["rpc"]
                const signingClient = await createClient(chainRPC, offlineSigner);
                const nonSigningClient = await createNonSigningClient(chainRPC);

                this.setCosmosConnection({
                    signingClient,
                    nonSigningClient,
                    offlineSigner,
                })
                this.setBlockchainUser({
                    walletAddress: userAddress,
                    chainId,
                    ecosystem: this.ecosystem,
                    blockchain: this.blockchain
                })

                this.$emit('authEvent', {
                    provider: AUTH_PROVIDERS.KEPLR,
                    user: {
                        walletAddress: userAddress
                    },
                    status: 'success'
                })
            }

        }
    }

}


</script>
