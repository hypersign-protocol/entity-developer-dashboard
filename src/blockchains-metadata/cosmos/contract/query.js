export async function smartContractQueryRPC(
    client,
    contractAddress,
    queryMsg,
) {
    if (!client) {
        throw new Error('Connect your wallet to proceed')
    }
    // Exectute the contract message
    const queryResult = await client.queryContractSmart(
        contractAddress,
        queryMsg,
    );
    return queryResult;
}
