export async function smartContractCodeInstantiateRPC(
    client,
    coinDenom,
    userAddress,
    codeId,
    instantiateMsg,
    smartContractlabel,
) {
    // Set the inital fee
    const fee = {
        amount: [
            {
                denom: coinDenom,
                amount: "4000",
            },
        ],
        gas: "200000",
    };

    // Instantitate the smart contract code
    try {
        const txResult = await client.instantiate(
            userAddress,
            parseInt(codeId),
            instantiateMsg,
            smartContractlabel,
            fee
        )
        console.log("Transaction hash: ", txResult["transactionHash"]);
        alert("Transaction Successful: " + txResult["transactionHash"]);
        const contractAddress = txResult["contractAddress"]
        return contractAddress
    } catch (err) {
        console.log(err.message)
        alert("Transaction has failed, Error Log below \n\n " + err.message)
        return null
    }
}

