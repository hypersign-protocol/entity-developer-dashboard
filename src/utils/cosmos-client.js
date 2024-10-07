import { SigningCosmWasmClient, CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { Uint53 } from "@cosmjs/math";
import {
    GasPrice, coins
} from "@cosmjs/stargate";
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


export function calculateFee(gasLimit, gasPrice) {
    const processedGasPrice = typeof gasPrice === "string" ? GasPrice.fromString(gasPrice) : gasPrice;
    const { denom, amount: gasPriceAmount } = processedGasPrice;
    // Note: Amount can exceed the safe integer range (https://github.com/cosmos/cosmjs/issues/1134),
    // which we handle by converting from Decimal to string without going through number.
    const t = gasPriceAmount.multiply(new Uint53(gasLimit))
    const amount = t.toString();
    return {
        amount: coins(amount, denom),
        gas: gasLimit.toString(),
    };
}


