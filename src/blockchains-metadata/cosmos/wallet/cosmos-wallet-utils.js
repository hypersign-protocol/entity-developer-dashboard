import { SigningCosmWasmClient, CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
// import ComdexSupportedChains from './comdex/chains.json'
import NibiruSupportedChains from './nibi/chains.json'

export async function getUserAddressFromOfflineSigner(offlineSigner) {
    const accounts = await offlineSigner.getAccounts();
    const userAddress = accounts[0].address;
    return userAddress
}

export async function createClient(rpcUrl, offlineSigner) {
    const client = SigningCosmWasmClient.connectWithSigner(
        rpcUrl,
        offlineSigner
    )
    return client
}

export async function createNonSigningClient(rpcUrl) {
    const client = CosmWasmClient.connect(rpcUrl)

    return client
}

export function getCosmosSupportedChains() {
    return [...NibiruSupportedChains]
}

// blockchainLabel
// cosmos:<bech32PrefixAccAddr>:<chainid>
export function getCosmosBlockchainLabel(chain) {
    return 'cosmos:' + chain.bech32Config.bech32PrefixAccAddr + ':' + chain.chainId
}

export function getCosmosChainConfig(blockchainLabel) {
    if (!blockchainLabel) {
        throw new Error('blockchainLabel must be passed')
    }
    const splits = blockchainLabel.split(':')
    const bech32PrefixAccAddr = splits[1];
    const chainId = splits[2];
    return getCosmosSupportedChains().find(x => (x.chainId === chainId) && (x.bech32Config.bech32PrefixAccAddr === bech32PrefixAccAddr))
}

export function getCosmosCoinLogo(blockchainLabel) {
    const slectedChain = getCosmosChainConfig(blockchainLabel)
    return slectedChain.stakeCurrency.coinImageUrl;
    // const { default: SupportedChains } = await import(`../../../blockchains-metadata/${this.ecosystem}/wallet/${this.blockchain}/chains`)
}

export function getCosmosBlockchainBech32Prefix(chain) {
    return chain.bech32Config.bech32PrefixAccAddr
}