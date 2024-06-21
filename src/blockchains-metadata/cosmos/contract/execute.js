export async function smartContractExecuteRPC(
    client,
    coinDenom,
    userAddress,
    contractAddress,
    executeMsg,
) {
    // Set the inital fee
    const fee = {
        amount: [
            {
                denom: coinDenom,
                amount: "200000000",
            },
        ],
        gas: "200000000",
    };

    const txResult = await client.execute(
        userAddress,
        contractAddress,
        executeMsg,
        fee
    )

    return txResult
}