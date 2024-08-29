// ```
hid17dfrp65fxvgve4w96mnclkc2kfjr9ncs8r7e8z
// ## Amount granted
// https://api.prajna.hypersign.id/cosmos/feegrant/v1beta1/allowance/hid10d36jvc7regxe6npw8gxvrzap7lcrnrpjfwmal/hid17dfrp65fxvgve4w96mnclkc2kfjr9ncs8r7e8z


// https://api.prajna.hypersign.id/cosmos/feegrant/v1beta1/allowance/hid197apvfzwq67h0jt8uv0f9lvppnfs0mlflv04yf

// https://api.prajna.hypersign.id/cosmos/feegrant/v1beta1/allowances/hid197apvfzwq67h0jt8uv0f9lvppnfs0mlflv04yf

// ## Messaged authorized and expiration
// https://api.prajna.hypersign.id/cosmos/authz/v1beta1/grants/grantee/hid197apvfzwq67h0jt8uv0f9lvppnfs0mlflv04yf

// https://api.prajna.hypersign.id/cosmos/authz/v1beta1/grants/granter/hid10d36jvc7regxe6npw8gxvrzap7lcrnrpjfwmal

// ## Cost of each tx.
// https://api.prajna.hypersign.id/hypersign-protocol/hidnode/ssi/fixedfee


// https://explorer.nodestake.org/hypersign-testnet/account/hid197apvfzwq67h0jt8uv0f9lvppnfs0mlflv04yf
// ```
// https://api.prajna.hypersign.id/cosmos/tx/v1beta1/txs?order_by=1&events=message.sender=%27hid17dfrp65fxvgve4w96mnclkc2kfjr9ncs8r7e8z%27&pagination.limit=2000&pagination.offset=0

// https://vue-chartjs.org/examples/#vue-3-charts

// const totalGrant = {
//     "allowance": {
//         "granter": "hid10d36jvc7regxe6npw8gxvrzap7lcrnrpjfwmal",
//         "grantee": "hid197apvfzwq67h0jt8uv0f9lvppnfs0mlflv04yf",
//         "allowance": {
//             "@type": "/cosmos.feegrant.v1beta1.BasicAllowance",
//             "spend_limit": [
//                 {
//                     "denom": "uhid",
//                     "amount": "5000000"
//                 }
//             ],
//             "expiration": null
//         }
//     }
// }

// const grants = [
//     {
//         "granter": "hid10d36jvc7regxe6npw8gxvrzap7lcrnrpjfwmal",
//         "grantee": "hid1cfs486vp3zkjx3lurmxvd0gjv9tckkjvwck795",
//         "authorization": {
//             "@type": "/cosmos.authz.v1beta1.GenericAuthorization",
//             "msg": "/hypersign.ssi.v1.MsgRegisterCredentialSchema"
//         },
//         "expiration": "2025-08-13T05:39:21Z"
//     },
//     {
//         "granter": "hid10d36jvc7regxe6npw8gxvrzap7lcrnrpjfwmal",
//         "grantee": "hid1cfs486vp3zkjx3lurmxvd0gjv9tckkjvwck795",
//         "authorization": {
//             "@type": "/cosmos.authz.v1beta1.GenericAuthorization",
//             "msg": "/hypersign.ssi.v1.MsgRegisterCredentialStatus"
//         },
//         "expiration": "2025-08-13T05:39:21Z"
//     },
//     {
//         "granter": "hid10d36jvc7regxe6npw8gxvrzap7lcrnrpjfwmal",
//         "grantee": "hid1cfs486vp3zkjx3lurmxvd0gjv9tckkjvwck795",
//         "authorization": {
//             "@type": "/cosmos.authz.v1beta1.GenericAuthorization",
//             "msg": "/hypersign.ssi.v1.MsgRegisterDID"
//         },
//         "expiration": "2025-08-13T05:39:21Z"
//     },
//     {
//         "granter": "hid10d36jvc7regxe6npw8gxvrzap7lcrnrpjfwmal",
//         "grantee": "hid1cfs486vp3zkjx3lurmxvd0gjv9tckkjvwck795",
//         "authorization": {
//             "@type": "/cosmos.authz.v1beta1.GenericAuthorization",
//             "msg": "/hypersign.ssi.v1.MsgUpdateCredentialStatus"
//         },
//         "expiration": "2025-08-13T05:39:21Z"
//     }
// ]
const fee = {
    "register_did_fee": {
        "denom": "uhid",
        "amount": "50" // 50 / 
    },
    "update_did_fee": {
        "denom": "uhid",
        "amount": "50"
    },
    "deactivate_did_fee": {
        "denom": "uhid",
        "amount": "50"
    },
    "register_credential_schema_fee": {
        "denom": "uhid",
        "amount": "50"
    },
    "update_credential_schema_fee": {
        "denom": "uhid",
        "amount": "50"
    },
    "register_credential_status_fee": {
        "denom": "uhid",
        "amount": "50"
    },
    "update_credential_status_fee": {
        "denom": "uhid",
        "amount": "50"
    }
}



// - 1. Test what will happen if we set `allowance.expiration` some value? will it override individual `grants[0].expiration`?
// - 2. Can we increase the allowance which is not yet expried? Will it increase `allowance.spend_limit[0].amount` ? or will it add a new object in `allowance`? 
// - 3. Implmenent backward compatibility otherwise it will break for customers who have been using sservice without grants buts balance 
// - 4. Test once with SSI old token to see backward compatibility works
// - 5. Deploy entire new system and test once again  




const wallet = 'hid1zsprdhv5e893hezt7sktjk4crsqpx69snfmvfu'
let txApi = `https://api.prajna.hypersign.id/cosmos/tx/v1beta1/txs?order_by=2&events=message.sender='${wallet}'&pagination.limit=5000&pagination.offset=0`
// https://api.prajna.hypersign.id/cosmos/tx/v1beta1/txs?order_by=2&events=message.sender='hid1zsprdhv5e893hezt7sktjk4crsqpx69snfmvfu'&pagination.limit=5&pagination.offset=0


async function callApi() {
    const resp = await fetch(txApi)
    const json = await resp.json()
    return json
}


const getDayKey = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};

const groupByDay = (data) => {
    return data.reduce((acc, item) => {
        const dayKey = getDayKey(item.timestamp);
        if (!acc[dayKey]) {
            acc[dayKey] = 0;
        }
        acc[dayKey]++;
        return acc;
    }, {});
};

const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
};

const groupByWeek = (data) => {
    return data.reduce((acc, item) => {
        const weekStart = getWeekStart(item.timestamp);
        if (!acc[weekStart]) {
            acc[weekStart] = 0;
        }
        acc[weekStart]++;
        return acc;
    }, {});
};

const countByProperty = (array, property) => {
    return array.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
            acc[key] = 0;
        }
        acc[key]++;
        return acc;
    }, {});
};

async function start() {
    // type t = { tx_responses: object[], txs: object[] }
    const result = await callApi()
    const { tx_responses, total } = result

    let dids = []
    let credentials = []
    let schemas = []

    if (tx_responses && tx_responses.length > 0) {
        tx_responses.forEach(eachResp => {
            const { timestamp, height, tx } = eachResp
            const { body } = tx;
            const { messages } = body;
            if (messages && messages.length > 0) {
                messages.forEach(eachMessage => {
                    const { msgs } = eachMessage
                    const type = msgs[0]['@type']
                    if (type === ('/hypersign.ssi.v1.MsgRegisterDID')) {
                        dids.push({
                            timestamp,
                            type
                        })
                    } else if (type === ('/hypersign.ssi.v1.MsgRegisterCredentialStatus' || '/hypersign.ssi.v1.MsgUpdateCredentialStatus')) {
                        credentials.push({
                            timestamp,
                            type
                        })
                    } else if (type === ('/hypersign.ssi.v1.MsgRegisterCredentialSchema')) {
                        schemas.push({
                            timestamp,
                            type
                        })
                    }

                })
            }
        });
    }

    const sorted_did_data = dids.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const sorted_creds_data = credentials.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const sorted_schema_data = schemas.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const did_data = groupByDay(dids);
    const cred_data = groupByDay(credentials);
    const schema_data = groupByDay(schemas);

    console.log({
        dids: Object.keys(did_data),
        value: Object.values(did_data),
        credentials: cred_data,
        schemas: schema_data
    })

}

start()
