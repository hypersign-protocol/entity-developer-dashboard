// Prepares a message for `create_entry` RPC method
export function constructSBTMintMsg(owner, nftTokenId, nftTokenUri) {
    return {
        "mint": {
            "owner": owner,
            "token_id": nftTokenId,
            "token_uri": nftTokenUri,
        }
    }
}

export function constructKYCSBTMintMsg({ hypersign_proof }) {
    return {
        "mint": {
            hypersign_proof
        }
    }
}

export function constructOnBoardIssuer({ did_doc, did_doc_proof, signature }) {
    return {
        "onboard_issuer": {
            "did_doc": JSON.stringify(did_doc),
            "did_doc_proof": JSON.stringify(did_doc_proof),
            "signature": signature,
            // "issuer_did": issuer_did,
            // "issuer_kyc_code_id": issuer_kyc_code_id,
        }
    }
}

export function constructGetRegistredIssuerMsg(issuer_did) {
    return {
        "get_registered_issuer": {
            issuer_did
        }
    }
}

export function constructGetRegistredSBTContractAddressMsg() {
    return {
        "s_b_t_contract_address": {

        }
    }
}

// Message to get the list of SBT tokens for a user
export function constructQuerySBTTokensMsg() {
    return {
        "all_tokens": {
            "limit": 90,
        }
    }
}

export function constructQueryTokensByOwner(owner) {
    return {
        "tokens": {
            "owner": owner
        }
    }
}

// Message to get the details of an SBT token 
export function constructQuerySBTTokenDetailsMsg(tokenId) {
    return {
        "all_nft_info": {
            "token_id": tokenId
        }
    }
}

// Return owner for a token
export function constructQuerySBTTokenOwnerMsg(tokenId) {
    return {
        "owner_of": {
            "token_id": tokenId
        }
    }
}

export function constructInitSbtMsg(token_code_id) {
    return {
        "init":
        {
            token_code_id
        }
    }
}

// Execute SBT Transfer to new owner
export function constructExecuteSBTTransfer(nftTokenId, newOwner) {
    return {
        "transfer_nft": {
            "recipient": newOwner,
            "token_id": nftTokenId
        }
    }
}

// Query the top-level Smart Contract metadata
export function constructQuerySBTContractMetadata() {
    return {
        "contract_info": {}
    }
}
