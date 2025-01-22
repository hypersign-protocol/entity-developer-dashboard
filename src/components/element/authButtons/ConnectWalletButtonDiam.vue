<template>
    <div>
        <button type="button" class="btn btn-outline-dark btn-lg mb-2" style="width: 100%;" @click="connectWallet()"
            :disabled="isDisable || !ifDiamInstalled">
            <span><b-avatar :src="getChainDetail().logoUrl" :style="{ backgroundColor: 'white' }" size="30"></b-avatar>
                Connect DIAM Wallet</span>



        </button>
        <small style="color:indianred; text-decoration: underline;" v-if="!ifDiamInstalled"><a
                href="https://chromewebstore.google.com/detail/diam-wallet/oakkognifoojdbfjaccegangippipdmn?hl=en"
                target="_blank">DIAM Wallet extention</a> not installed in your browser</small>
    </div>
</template>
<script>
import { mapMutations } from "vuex";
// import { getUserAddressFromOfflineSigner } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/cosmos-wallet-utils'
// import { createClient, createNonSigningClient } from '../../../utils/wallet-client/cosmos-wallet-client'
import { getStellarCoinLogo, getStellarChainConfig } from '@hypersign-protocol/hypersign-kyc-chains-metadata/stellar/wallet/stellar-wallet-utils'
import Config from '../../../config';

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
        blockchainlabel() {
            return `${this.ecosystem}:${this.blockchain}:${this.chainId}`
        },
        selectedBlockchainLogo() {
            return getStellarCoinLogo(this.blockchainlabel)
        },
        ifDiamInstalled() {
            return window.diam ? true : false;
        },


    },
    methods: {
        ...mapMutations("walletStore", ['setCosmosConnection', 'setBlockchainUser']),
        getChainDetail() {
            console.log(this.blockchainlabel)
            const config = getStellarChainConfig(this.blockchainlabel)
            console.log(config.stakeCurrency.coinImageUrl)
            return {
                chainName: config.chainName,
                chainId: config.chainId,
                logoUrl: config.stakeCurrency.coinImageUrl,
                tx_explorer: config.txExplorer.txUrl
            }
        },
        async getSigningClient(chainId) {
            return (xdr) => {
                if (!window.diam) {
                    throw new Error('DIAM Wallet not installed')
                }
                return window.diam.sign(xdr, true, chainId)
            }
        },
        async connectWallet() {

            console.log('connectWallet() called...')

            // const { default: SupportedChains } = await import(`@hypersign-protocol/hypersign-kyc-chains-metadata/${this.ecosystem}/wallet/${this.blockchain}/${this.chainId}/chains`)

            // if (!SupportedChains) {
            //     throw new Error('Ecosysem or blockchain is not supported')
            // }

            // const requestedChainId = this.chainId// this.getOnChainIssuerConfig.chainId
            // const chainConfig = SupportedChains.find(x => x.chainId == requestedChainId);
            // if (!chainConfig) {
            //     throw new Error('Chain not supported for chainId requestedChainId ' + requestedChainId)
            // }

            // const chainId = chainConfig["chainId"];


            if (!window.diam) {
                throw new Error("Please install the DIAM wallet extension");
            }

            let result = await window.diam.connect()
            console.log(result);

            if (result && result.status == 404) {
                throw new Error(result.message)
            }

            const walletAddress = result.walletAddress ? result.walletAddress : result.message[0]?.diamPublicKey ? result.message[0].diamPublicKey : result.message.data[0].diamPublicKey;
            console.log({
                walletAddress,
                result
            })

            if (!walletAddress) {
                throw new Error('No wallet address found')
            }

            // await window.keplr.enable(chainId);
            // const offlineSigner = window.getOfflineSigner(chainId)
            // const userAddress = await getUserAddressFromOfflineSigner(offlineSigner);
            // console.log("User Address: ", userAddress)

            if (walletAddress != "") {
                // const chainRPC = chainConfig["rpc"]

                // const chainId = "Diamante Testnet 2024"
                // const chainId = "testnet"
                // window.diam
                //     .sign(xdr, true, "Diamante Testnet 2024")
                console.log({
                    chainId: this.chainId
                })
                const signingClient = await this.getSigningClient(this.chainId); // createClient(chainRPC, offlineSigner);
                const nonSigningClient = await this.getSigningClient(this.chainId);

                // console.log(signingClient)
                /// Usage...
                // await signingClient('AAAAAgAAAADnQe1c0mPWMcsias/JKXj9+LOaN6TpSSmer+tM9L9YIgAAArwAEF6hAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAABAAAAAARrgWTah39cp1XFq8V9twPrO4cbtwlEQRH9c5tVfEVdAAAAAQAAAADnQe1c0mPWMcsias/JKXj9+LOaN6TpSSmer+tM9L9YIgAAAAAAAAAAAAACWAAAAAEAAAAA50HtXNJj1jHLImrPySl4/fizmjek6Ukpnq/rTPS/WCIAAAAAAAAAADZihU/1kaxP59KjPQQFdIVYlloceck0k6CfwMOmRAldAAAAAAAAAAoAAAABAAAAAARrgWTah39cp1XFq8V9twPrO4cbtwlEQRH9c5tVfEVdAAAABgAAAAJreWNBc3NldAAAAAAAAAAANmKFT/WRrE/n0qM9BAV0hViWWhx5yTSToJ/Aw6ZECV1//////////wAAAAEAAAAABGuBZNqHf1ynVcWrxX23A+s7hxu3CURBEf1zm1V8RV0AAAAGAAAAAmt5Y0Fzc2V0AAAAAAAAAAA2YoVP9ZGsT+fSoz0EBXSFWJZaHHnJNJOgn8DDpkQJXX//////////AAAAAQAAAAA2YoVP9ZGsT+fSoz0EBXSFWJZaHHnJNJOgn8DDpkQJXQAAAAoAAAAIa3ljQXNzZXQAAAABAAAADkVuY3J5cHRlZCBkYXRhAAAAAAABAAAAADZihU/1kaxP59KjPQQFdIVYlloceck0k6CfwMOmRAldAAAAAQAAAAAEa4Fk2od/XKdVxavFfbcD6zuHG7cJREER/XObVXxFXQAAAAJreWNBc3NldAAAAAAAAAAANmKFT/WRrE/n0qM9BAV0hViWWhx5yTSToJ/Aw6ZECV0AAAAAAAAAAQAAAAEAAAAANmKFT/WRrE/n0qM9BAV0hViWWhx5yTSToJ/Aw6ZECV0AAAAFAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC9L9YIgAAAEDh7+7E103vH3o+uLOwzWw0IjU3Fs/MG9m+mEczwklASYFlENeBRsq53fbW1N6CkYEBnpbZd24P7sTh5eRKNpsMpkQJXQAAAEDc/YdrP5x9lF4DPTDXtRHYZ7Z5kqxtnzc4bp5rxaUYypjc0bO8NwAzPcEJKnrPI9D4ANDgCxlNevUbUU2xeYIM')

                this.setCosmosConnection({
                    signingClient,
                    nonSigningClient,
                    offlineSigner: null,
                })

                this.setBlockchainUser({
                    walletAddress: walletAddress,
                    chainId: this.chainId,
                    ecosystem: this.ecosystem,
                    blockchain: this.blockchain
                })

                this.$emit('authEvent', {
                    provider: Config.AUTH_PROVIDERS.STELLAR,
                    user: {
                        walletAddress: walletAddress
                    },
                    status: 'success'
                })
            }

        }
    }

}


</script>
