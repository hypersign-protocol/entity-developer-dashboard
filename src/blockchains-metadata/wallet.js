import { getCosmosSupportedChains } from './cosmos/wallet/cosmos-wallet-utils';

export function getSupportedChains() {
    return {
        interchain: [...getCosmosSupportedChains()],
    }
}