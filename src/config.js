
import { sanitizeUrl } from './utils/common'
const hsdk = require('lds-sdk')
const config = {
    studioServer: {
        SCHEMA_SSE: `${process.env.VUE_APP_SSE}api/v1/schema/sse/`,
        CRED_SSE: `${process.env.VUE_APP_SSE}api/v1/credential/sse/`,
        ORG_SSE: `${process.env.VUE_APP_SSE}api/v1/org/sse/`,
        BASE_URL: sanitizeUrl(process.env.VUE_APP_STUDIO_SERVER_BASE_URL, true),
        WHITELIST_CORS: process.env.VUE_APP_ORIGINS || 'https://entity.dashboard.hypersign.id, https://verify.hypersign.id',
        ACCPCT_CRED_EP: process.env.VUE_APP_ACCPCT_CRED_EP || "api/v1/credential/send",
        SAVE_SCHEMA_EP: process.env.VUE_APP_STUDIO_SERVER_SAVE_SCHEMA || "api/v1/schema",
        CRED_LIST_EP: process.env.VUE_APP_STUDIO_SERVER_CRED_LIST_EP || "api/v1/credential/org",
        SCHEMA_LIST_EP: process.env.VUE_APP_SCHEMA_LIST_EP || 'api/v1/schema',
        CRED_ISSUE_EP: process.env.VUE_APP_STUDIO_SERVER_CRED_ISSUE_EP || "api/v1/credential",
        AUTH_CHALLENGE_EP: process.env.STUDIO_SERVER_AUTH_CHALLENGE_EP || "api/auth/challenge",
        AUTH_LOGIN_EP: process.env.STUDIO_SERVER_AUTH_LOGIN_EP || "api/auth/login",
        PRESENTATION_TEMPLATE_EP: process.env.VUE_APP_PRESENTATION_TEMPLATE_EP || "api/v1/presentation/template"
    },
    nodeServer: {
        BASE_URL: process.env.VUE_APP_NODE_SERVER_BASE_URL,
        BASE_URL_REST: sanitizeUrl(process.env.VUE_APP_NODE_SERVER_BASE_URL_REST || 'https://api.jagrat.hypersign.id/', true),
        SCHEMA_GET_REST: process.env.VUE_APP_SCHEMA_GET_EP_REST || 'hypersign-protocol/hidnode/ssi/schema/',
        NETWORK_STATUS_EP: process.env.NODE_SERVER_NETWORK_STATUS_EP || "net_info",
        SCHEMA_LIST_EP: process.env.NODE_SERVER_SCHEMA_LIST_EP || "api/schema/list",
        SCHEMA_GET_EP: process.env.NODE_SERVER_SCHEMA_GET_EP || "api/schema/get",
        SCHEMA_CREATE_EP: process.env.NODE_SERVER_SCHEMA_CREATE_EP || "api/schema/create",
        DID_RESOLVE_EP: process.env.NODE_SERVER_DID_RERSOLVE_EP || "hypersign-protocol/hidnode/ssi/did/"
    },
    explorer: {
        BASE_URL: process.env.EXPLORER_BASE_URL || 'https://explorer.hypersign.id/hypersign-prajna-testnet',
        NEW_DID_EP: process.env.EXPLORER_NEW_DID_EP || "newdid"
    },
    app: {
        name: process.env.VUE_APP_TITLE || "Hypersign Studio",
        decription: process.env.VUE_APP_DESC || '',
        version: process.env.VUE_APP_VERSION || "v1.0.0",
        buttonBgColor: process.env.VUE_APP_BTN_BACKGROUND || "#f1b319",
        buttonTextColor: process.env.VUE_APP_BTN_TXT_COLOR || "black",
        url: sanitizeUrl(process.env.VUE_APP_URL || "https://entity.dashboard.hypersign.id", false),
    },
    apiServer: {
        host: sanitizeUrl(process.env.VUE_APP_STUDIO_SERVER_BASE_URL || 'http://localhost:3001', false),
        basePath: '/api/v1',
    }

}
const websocketUrl = process.env.VUE_APP_STUDIO_SERVER_BASE_WS
const webWalletAddress = process.env.VUE_APP_WEB_WALLET_ADDRESS;//"http://localhost:4999/chrome/popup/popup#"
const options = { nodeUrl: config.nodeServer.BASE_URL, didScheme: "did:hs" }
const hypersignSDK = {
    did: hsdk.did(options),
    credential: hsdk.credential(options)
}
config['appName'] = 'Studio'
config['hypersignSDK'] = hypersignSDK
config['websocketUrl'] = websocketUrl
config['webWalletAddress'] = webWalletAddress

const DashboardTypes = Object.freeze({
    SSIPlayground: "SSIPlayground",
    DeveloperDashboard: "DeveloperDashboard",
})

config['DashboardTypes'] = DashboardTypes
config['SERVICE_TYPES'] = Object.freeze({
    SSI_API: 'SSI_API',
    CAVACH_API: 'CAVACH_API',
    QUEST: 'QUEST',
})

config['GRANT_TYPES_ENUM'] = Object.freeze({
    'SSI_API': 'access_service_ssi',
    'CAVACH_API': 'access_service_kyc'
})

config['AUTH_PROVIDERS'] = Object.freeze({
    GOOGLE: 'google',
    KEPLR: 'keplr',
    METAMASK: 'metamask',
})

config['LivelinessError'] = {
    4: 'Bad quality of image detected.',
    5: 'Face is too close to the camera.',
    6: 'Face not found in the image.',
    7: 'Face size is too small in image used.',
    8: 'Face angle is too large.',
    9: 'Could not  evaluate due to the format of the images used.',
    10: 'Could not evalute due to internal error',
    11: 'Error occurred during image preprocessing.',
    12: 'Multiple faces detected, only one is allowed.',
    0: 'Proof of life could not be assessed.',
    1: 'Face appears to be a spoof.',
    2: 'Uncertain error message in a particular field.',
    17: 'No life has been detected.',
    18: 'The person has his eyes closed',
    16: 'The face is obstructed',
    15: 'The license error occurred',
    14: 'The face is cropped',
    13: 'The face is too close to border',
};

config['FaicalAuthenticationError'] = {
    0: 'Face check could not be performed',
    1: 'Faces does not match',
    2: 'Face not found in the image',
    4: 'Rejected, to perform face check due to the pose of the face',
    5: 'Rejected, due to problems in the extraction of the facial pattern',
    6: 'Rejected, because document has already been verified in some other account with this service',
}

export default config