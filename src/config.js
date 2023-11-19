import EnvProvider from 'jvjr-docker-env'

const hsdk = require('lds-sdk')
const config = {
    studioServer: {
        SCHEMA_SSE: `${process.env.VUE_APP_SSE}api/v1/schema/sse/`,
        CRED_SSE: `${process.env.VUE_APP_SSE}api/v1/credential/sse/`,
        ORG_SSE: `${process.env.VUE_APP_SSE}api/v1/org/sse/`,
        BASE_URL: process.env.VUE_APP_STUDIO_SERVER_BASE_URL, // EnvProvider.value('STUDIO_SERVER_BASE_URL'),
        ACCPCT_CRED_EP: process.env.VUE_APP_ACCPCT_CRED_EP || "api/v1/credential/send",
        SAVE_SCHEMA_EP: process.env.VUE_APP_STUDIO_SERVER_SAVE_SCHEMA || "api/v1/schema",
        CRED_LIST_EP: process.env.VUE_APP_STUDIO_SERVER_CRED_LIST_EP || "api/v1/credential/org",
        SCHEMA_LIST_EP: process.env.VUE_APP_SCHEMA_LIST_EP || 'api/v1/schema',
        CRED_ISSUE_EP: process.env.VUE_APP_STUDIO_SERVER_CRED_ISSUE_EP || "api/v1/credential",
        AUTH_CHALLENGE_EP: EnvProvider.value('STUDIO_SERVER_AUTH_CHALLENGE_EP') || "api/auth/challenge",
        AUTH_LOGIN_EP: EnvProvider.value('STUDIO_SERVER_AUTH_LOGIN_EP') || "api/auth/login",
        PRESENTATION_TEMPLATE_EP: process.env.VUE_APP_PRESENTATION_TEMPLATE_EP
    },
    nodeServer: {
        BASE_URL: process.env.VUE_APP_NODE_SERVER_BASE_URL,
        BASE_URL_REST: process.env.VUE_APP_NODE_SERVER_BASE_URL_REST || 'https://api.jagrat.hypersign.id/',
        SCHEMA_GET_REST: process.env.VUE_APP_SCHEMA_GET_EP_REST || 'hypersign-protocol/hidnode/ssi/schema/',
        NETWORK_STATUS_EP: EnvProvider.value('NODE_SERVER_NETWORK_STATUS_EP') || "net_info",
        SCHEMA_LIST_EP: EnvProvider.value('NODE_SERVER_SCHEMA_LIST_EP') || "api/schema/list",
        SCHEMA_GET_EP: EnvProvider.value('NODE_SERVER_SCHEMA_GET_EP') || "api/schema/get",
        SCHEMA_CREATE_EP: EnvProvider.value('NODE_SERVER_SCHEMA_CREATE_EP') || "api/schema/create",
        DID_RESOLVE_EP: EnvProvider.value('NODE_SERVER_DID_RERSOLVE_EP') || "hypersign-protocol/hidnode/ssi/did/"
    },
    explorer: {
        BASE_URL: EnvProvider.value('EXPLORER_BASE_URL') || 'https://explorer.hypersign.id/hypersign-testnet/',
        NEW_DID_EP: EnvProvider.value('EXPLORER_NEW_DID_EP') || "newdid"
    },
    app: {
        name: EnvProvider.value('TITLE') || "Hypersign Studio",
        decription: EnvProvider.value('DESC'),
        version: EnvProvider.value('VERSION') || "v1.0.0",
        buttonBgColor: process.env.VUE_APP_BTN_BACKGROUND || "#f1b319",
        buttonTextColor: process.env.VUE_APP_BTN_TXT_COLOR || "black",
    },
    apiServer: {
        host: process.env.VUE_APP_STUDIO_SERVER_BASE_URL || 'http://localhost:3001',
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
export default config