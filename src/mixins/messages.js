const ORGANIZATION = {
    ORGANIZATION_NAME_EMPTY: "Please enter Organization name",
    INVALID_ORG_NAME: "Enter valid Organization name",
    DOMAIN_NAME_EMPTY: "Please enter Domain name",
    INVALID_DOMAIN_NAME: "Enter valid Domain name"
}

const APPLICATION = {
    INVALID_APP_NAME: "Please enter a valid application name",
    APP_CREATE_SUCCESS: "App created successfully",    
    APP_UPDATE_SUCCESS: "App updated successfully",
    APP_NEW_SECRET_KEY_SUCCESS: "API secret key is generated successfully",
    CHAR_EXCEED_APP_NAME: "App name cannot be greater than 50 characters",
    CHAR_LESS_APP_NAME: "App name cannot be less than 5 characters",
    CHAR_EXCEED_APP_DES: "Description cannot be greater than 100 characters",
    CHAR_LESS_APP_DES: "Description can not be less than 20 characters",
    VALID_ID: "Enter Valid Application Id",
    ENTER_APP_ID: "Enter Application Id",
    INVALID_CORS: "Invalid origins values, use valid url or *",
    DUPLICATE_ORIGIN_VALUES: "Duplicate origin values are not allowed"
}

const SCHEMA = {
    DUPLICATE_ATTRIBUTE_UPDATE: "Duplicate attribute, change name or type while updating",
    DUPLICATE_ATTRIBUTE: "Duplicate attribute name not allowed",
    PROTECTED_TERM: "is protected field",
    NO_SPACE: "There should not be space in attribute name",
    NAME_CAMELCASE: "Name should be camelCase",
    EMPTY_SCHEMA_NAME: "Please enter Schema name",
    INVALID_SCHEMA_NAME: " Enter valid Schema name",
    EMPTY_SCHEMA_ATTRIBUTE: "Atleast one attribute is required",
    EMPTY_SCHEMA_ATTRIBUTE_NAME: "Please provide attribute name",
    INVALID_ATTRIBUTE_NAME: "Enter valid attribute name",
    EMPTY_ATTRIBUTE_TYPE: "Please select attribute type",
    INVALID_FORMAT: "Enter a valid format value"
}

const CREDENTIAL = {
    EMPTY_ISSUER_DID: "Please enter Issuer DID",
    EMPTY_HOLDER_DID: "Please enter Subject Did",
    SELECT_SCHEMA: "Please select atleat one schema",
    INVALID_DID: "Please enter a valid did"
}

const PRESENTATION = {
    VALID_NAME: "Enter valid Name",
    NAME_LIMIT_EXCEED: "Name should be less than 30 characters",
    REASON_LIMIT_EXCEED: "Reason should be less than 105 characters",
    ISSUER_DID_EMPTY: "Please enter Issuer DID",
    REASON: "Please enter reason for creating template",
    CALLBACK_URL: "Please enter callback URI",
    INVALID_URL: "Please enter a valid callback URI"
}
module.exports = {
    ORGANIZATION,
    SCHEMA,
    CREDENTIAL,
    PRESENTATION,
    APPLICATION
}