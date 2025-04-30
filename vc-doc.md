```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImM4ZjM3ODhkZjEzMTRlNWJiZmI0NTkzZGM3NzJmYWM2ODBmZSIsInVzZXJJZCI6ImNjZWJlOWNlLWM1MzItNDVmNS1hNzlhLWZkZDRjMzAxYTljOCIsImdyYW50VHlwZSI6ImFjY2Vzc19zZXJ2aWNlX3NzaSIsImttc0lkIjoiaHM6ZG9jOng2NF9ucWVtbXpmY3c2Y3NkdG8wd29yYzRqa2pueGt6ZmkwbXBfZWxndWciLCJ3aGl0ZWxpc3RlZENvcnMiOlsiKiIsImh0dHBzOi8vZW50aXR5LmRhc2hib2FyZC5oeXBlcnNpZ24uaWQiLCJodHRwczovL3ZlcmlmeS5oeXBlcnNpZ24uaWQiXSwic3ViZG9tYWluIjoiZW50LThlZTgzY2MiLCJlZHZJZCI6ImhzOmRldmVsb3Blci1kYXNoYm9hcmQ6YXBwOmM4ZjM3ODhkZjEzMTRlNWJiZmI0NTkzZGM3NzJmYWM2ODBmZSIsImFjY2Vzc0xpc3QiOlsiQUxMIl0sImVudiI6ImRldiIsImFwcE5hbWUiOiJOZXh0dXMgU1NJIEFwcCIsImlhdCI6MTczNzAwMjEyMCwiZXhwIjoxNzM3MDQ1MzIwfQ.Mg8BbQ3VeI3wcnbg4likl1w7O4jSGwB9lVIxGf9qS1k
```

## Issuer Issues Credential
API: 
```js
POST /api/v1/credential/issue
```
Request Body: 
```js
{
  "schemaId": "sch:hid:testnet:z6MkoU8LrWVKbMzzSrfkpUw3GVJSMUgWoHfLbZnpuFrFu2k3:1.0",
  "subjectDid": "did:hid:testnet:17260864-6480-467c-b399-dfe090f5a014",
  "issuerDid": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907",
  "expirationDate": "2027-12-10T18:30:00.000Z",
  "fields": {
    "name": "Random name"
  },
  "namespace": "testnet",
  "verificationMethodId": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907#key-1",
  "persist": false,
  "registerCredentialStatus": false
}
```

Response: 
```js
{
  "credentialDocument": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/HypersignCredentialStatus2023.jsonld",
      {
        "@context": {
          "@protected": true,
          "@version": 1.1,
          "id": "@id",
          "type": "@type",
          "NewSchema1232": {
            "@context": {
              "@propagate": true,
              "@protected": true,
              "xsd": "http://www.w3.org/2001/XMLSchema#",
              "name": {
                "@id": "https://hypersign-schema.org/name",
                "@type": "xsd:string"
              }
            },
            "@id": "https://hypersign-schema.org"
          }
        }
      },
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "id": "vc:hid:testnet:z6Mks1knjJTYk6g6Euv8enrdoV3Ha3tbJJZcHzyaz8ZiW19T",
    "type": [
      "VerifiableCredential",
      "NewSchema1232"
    ],
    "expirationDate": "2027-12-10T18:30:00Z",
    "issuanceDate": "2025-01-16T07:42:48Z",
    "issuer": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907",
    "credentialSubject": {
      "name": "Random name",
      "id": "did:hid:testnet:17260864-6480-467c-b399-dfe090f5a014"
    },
    "credentialSchema": {
      "id": "sch:hid:testnet:z6MkoU8LrWVKbMzzSrfkpUw3GVJSMUgWoHfLbZnpuFrFu2k3:1.0",
      "type": "JsonSchemaValidator2018"
    },
    "credentialStatus": {
      "id": "https://api.prajna.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:z6Mks1knjJTYk6g6Euv8enrdoV3Ha3tbJJZcHzyaz8ZiW19T",
      "type": "HypersignCredentialStatus2023"
    },
    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2025-01-16T07:44:29Z",
      "verificationMethod": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907#key-1",
      "proofPurpose": "assertionMethod",
      "proofValue": "zNQVMAvaDQPe2kZo5adeBZFjS1uTiFCNvVGcVVHEWUEQxX7HGDJpY4ZRaQWASEeLPBfiXHD6y495auvPHebBVoA8"
    }
  },
  "credentialStatus": {
    "@context": [
      "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/CredentialStatus.jsonld",
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "id": "vc:hid:testnet:z6Mks1knjJTYk6g6Euv8enrdoV3Ha3tbJJZcHzyaz8ZiW19T",
    "issuer": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907",
    "issuanceDate": "2025-01-16T07:42:48Z",
    "remarks": "Credential is active",
    "credentialMerkleRootHash": "6f6071d1da023301b58ffc069715eb935d014819cd44d152c3c51bb0021aad01",
    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2025-01-16T07:44:29Z",
      "verificationMethod": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907#key-1",
      "proofPurpose": "assertionMethod",
      "proofValue": "zShbbL6fnRPLXY8EohgTfrZJU7Fui2tVFUALafVBLf3owPyS8tR48o42ENyBvoRSpofJbYBRpeRm5b47QkfpqiXF"
    }
  },
  "metadata": {
    "credentialId": "vc:hid:testnet:z6Mks1knjJTYk6g6Euv8enrdoV3Ha3tbJJZcHzyaz8ZiW19T",
    "persist": false,
    "type": {
      "schemaType": "NewSchema1232",
      "schemaId": "sch:hid:testnet:z6MkoU8LrWVKbMzzSrfkpUw3GVJSMUgWoHfLbZnpuFrFu2k3:1.0"
    },
    "issuerDid": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907",
    "registerCredentialStatus": false
  }
}

```

## Fetch list of all credentials 

API
```
GET /credential
```

REsponse: 
```js
{
  "totalCount": 5,
  "data": [
    "vc:hid:testnet:z6MkhQBik3TJfEtWjuEmZjJ11vNJaK1auAe1cNUup6bt2mGK",
    "vc:hid:testnet:z6MkiomTAUCon7D5ohs7FTuYfLLM3PLBZBQPAi71wwFg2NQ7",
    "vc:hid:testnet:z6MkqexphEhpi9jKZi8XLYiwCEsSWMdUt6YzjCfqdxKecJXM",
    "vc:hid:testnet:z6Mks2gUPR2FQ1UqLLpefMFJUC3bzWHxkNxhty2VrBnPMvgE",
    "vc:hid:testnet:z6Mku7dio8kgyGttPtddgZWJgJtRBj5UGUpmVmQ6Z5sZ1SQj"
  ]
}
```

## Resolve each credential 

### Scenario 1: {persist: false, registerCredentialStatus: false}
API 
```
GET /credential/vc:hid:testnet:z6Mks1knjJTYk6g6Euv8enrdoV3Ha3tbJJZcHzyaz8ZiW19T
```
Response
```js
{
  "metadata": {
    "credentialId": "vc:hid:testnet:z6Mks1knjJTYk6g6Euv8enrdoV3Ha3tbJJZcHzyaz8ZiW19T",
    "persist": false,
    "type": {
      "schemaType": "NewSchema1232",
      "schemaId": "sch:hid:testnet:z6MkoU8LrWVKbMzzSrfkpUw3GVJSMUgWoHfLbZnpuFrFu2k3:1.0"
    },
    "issuerDid": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907",
    "registerCredentialStatus": false
  }
}
```
### Scenario 2: {persist: true, registerCredentialStatus: false}

API 
```
GET /credential/vc:hid:testnet:z6Mkt817PjaEzPSe5X81T1v3dTVZE7XYK4CZecE6kuxE6NAG
```
Response
```js
{
  "credentialDocument": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/HypersignCredentialStatus2023.jsonld",
      {
        "@context": {
          "@protected": true,
          "@version": 1.1,
          "id": "@id",
          "type": "@type",
          "NewSchema1232": {
            "@context": {
              "@propagate": true,
              "@protected": true,
              "xsd": "http://www.w3.org/2001/XMLSchema#",
              "name": {
                "@id": "https://hypersign-schema.org/name",
                "@type": "xsd:string"
              }
            },
            "@id": "https://hypersign-schema.org"
          }
        }
      },
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "id": "vc:hid:testnet:z6Mkt817PjaEzPSe5X81T1v3dTVZE7XYK4CZecE6kuxE6NAG",
    "type": [
      "VerifiableCredential",
      "NewSchema1232"
    ],
    "expirationDate": "2027-12-10T18:30:00Z",
    "issuanceDate": "2025-01-16T12:07:13Z",
    "issuer": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907",
    "credentialSubject": {
      "name": "Random name",
      "id": "did:hid:testnet:17260864-6480-467c-b399-dfe090f5a014"
    },
    "credentialSchema": {
      "id": "sch:hid:testnet:z6MkoU8LrWVKbMzzSrfkpUw3GVJSMUgWoHfLbZnpuFrFu2k3:1.0",
      "type": "JsonSchemaValidator2018"
    },
    "credentialStatus": {
      "id": "https://api.prajna.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:z6Mkt817PjaEzPSe5X81T1v3dTVZE7XYK4CZecE6kuxE6NAG",
      "type": "HypersignCredentialStatus2023"
    },
    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2025-01-16T12:08:53Z",
      "verificationMethod": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907#key-1",
      "proofPurpose": "assertionMethod",
      "proofValue": "z3WUBFzh7QXC4w23Tx91Cw5Gt9YtfACK1nZk5RfXSBex63wqGFpyemZokN2NXkiQFGoYq9rApWUDq1j5av81n9CEs"
    }
  },
  "credentialStatus": {
    "context": [
      "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/CredentialStatus.jsonld",
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "id": "vc:hid:testnet:z6Mkt817PjaEzPSe5X81T1v3dTVZE7XYK4CZecE6kuxE6NAG",
    "revoked": false,
    "suspended": false,
    "remarks": "Credential is active",
    "issuer": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907",
    "issuanceDate": "2025-01-16T12:07:13Z",
    "credentialMerkleRootHash": "f4df84c2eba085833c083bb9296f768574abbe2c7b7fea336c34670fa2b76c27",
    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2025-01-16T12:08:53Z",
      "verificationMethod": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907#key-1",
      "proofPurpose": "assertionMethod",
      "proofValue": "z5KZWaL88WXNqTrh5UygLmHDLC6c4PaQHYE647Bt8NzDCT7M8TVerAEvziu1gc3aobTm6N7GZcm1cAhsuQecYRz48",
      "clientSpecType": "CLIENT_SPEC_TYPE_NONE"
    }
  },
  "metadata": {
    "credentialId": "vc:hid:testnet:z6Mkt817PjaEzPSe5X81T1v3dTVZE7XYK4CZecE6kuxE6NAG",
    "persist": true,
    "type": {
      "schemaType": "NewSchema1232",
      "schemaId": "sch:hid:testnet:z6MkoU8LrWVKbMzzSrfkpUw3GVJSMUgWoHfLbZnpuFrFu2k3:1.0"
    },
    "issuerDid": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907",
    "registerCredentialStatus": true,
    "transactionStatus": [
      {
        "txnHash": "BC3923DE0BB0CD64E8EE5FEAFA8DCA86826978D01C6FE6BA72FBD59ACFB16442",
        "status": 0,
        "id": "vc:hid:testnet:z6Mkt817PjaEzPSe5X81T1v3dTVZE7XYK4CZecE6kuxE6NAG",
        "type": "/hypersign.ssi.v1.MsgRegisterCredentialStatus",
        "message": "[{\"msg_index\":0,\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/cosmos.authz.v1beta1.MsgExec\"},{\"key\":\"sender\",\"value\":\"hid195dg5vsggyvnrepzg9vk7lp3fvnqhtzq88873y\"},{\"key\":\"module\",\"value\":\"authz\"}]},{\"type\":\"create_credential_status\",\"attributes\":[{\"key\":\"tx_author\",\"value\":\"hid195dg5vsggyvnrepzg9vk7lp3fvnqhtzq88873y\"},{\"key\":\"authz_msg_index\",\"value\":\"0\"}]}]}]",
        "__v": 0,
        "createdAt": "2025-01-16T12:09:16.244Z",
        "updatedAt": "2025-01-16T12:09:16.244Z"
      }
    ]
  }
}
```

### Scenario 3: {persist: true, registerCredentialStatus: true}

API:  
```
GET /credential/vc:hid:testnet:z6Mku7dio8kgyGttPtddgZWJgJtRBj5UGUpmVmQ6Z5sZ1SQj
```
Request body: 
```js
{
  "credentialDocument": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/HypersignCredentialStatus2023.jsonld",
      {
        "@context": {
          "@protected": true,
          "@version": 1.1,
          "id": "@id",
          "type": "@type",
          "NewSchema1232": {
            "@context": {
              "@propagate": true,
              "@protected": true,
              "xsd": "http://www.w3.org/2001/XMLSchema#",
              "name": {
                "@id": "https://hypersign-schema.org/name",
                "@type": "xsd:string"
              }
            },
            "@id": "https://hypersign-schema.org"
          }
        }
      },
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "id": "vc:hid:testnet:z6MkgjSZv9VvtGu38FZyZdxYbHi1knRdwrfeJAqEyM6HWi9H",
    "type": [
      "VerifiableCredential",
      "NewSchema1232"
    ],
    "expirationDate": "2027-12-10T18:30:00Z",
    "issuanceDate": "2025-01-16T05:05:56Z",
    "issuer": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907",
    "credentialSubject": {
      "name": "Random name",
      "id": "did:hid:testnet:17260864-6480-467c-b399-dfe090f5a014"
    },
    "credentialSchema": {
      "id": "sch:hid:testnet:z6MkoU8LrWVKbMzzSrfkpUw3GVJSMUgWoHfLbZnpuFrFu2k3:1.0",
      "type": "JsonSchemaValidator2018"
    },
    "credentialStatus": {
      "id": "https://api.prajna.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:z6MkgjSZv9VvtGu38FZyZdxYbHi1knRdwrfeJAqEyM6HWi9H",
      "type": "HypersignCredentialStatus2023"
    },
    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2025-01-16T05:07:36Z",
      "verificationMethod": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907#key-1",
      "proofPurpose": "assertionMethod",
      "proofValue": "z5dngFoHPaquVQfU9CacUPF3WewWNDoDpUEwVHhpjD8RfjTqGknqrBzkzBS5n7qxM36kkD49RbuiccSJ2J9HJSdLx"
    }
  },
  "credentialStatus": {
    "@context": [
      "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/CredentialStatus.jsonld",
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "id": "vc:hid:testnet:z6MkgjSZv9VvtGu38FZyZdxYbHi1knRdwrfeJAqEyM6HWi9H",
    "issuer": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907",
    "issuanceDate": "2025-01-16T05:05:56Z",
    "remarks": "Credential is active",
    "credentialMerkleRootHash": "cd9b19e921f88ff43a1e98fbe02280d625da0bbf0690cd8ef2f2082c4d2d5518",
    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2025-01-16T05:07:36Z",
      "verificationMethod": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907#key-1",
      "proofPurpose": "assertionMethod",
      "proofValue": "z2hNEaKAaqCgwjBpRu6cgR91K4bcnfXUuz1SJpxPcoytnJCSYENMCj5CbSnBcMQEnxN4wTJEBbqFpDseJX313mSmL"
    }
  },
  "persist": true
}
```

### Scenario 3: {persist: false, registerCredentialStatus: true}

API:  
```
GET /credential/vc:hid:testnet:z6Mku7dio8kgyGttPtddgZWJgJtRBj5UGUpmVmQ6Z5sZ1SQj
```

Response: 
```js
{
  "credentialStatus": {
    "context": [
      "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/CredentialStatus.jsonld",
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "id": "vc:hid:testnet:z6Mku7dio8kgyGttPtddgZWJgJtRBj5UGUpmVmQ6Z5sZ1SQj",
    "revoked": false,
    "suspended": false,
    "remarks": "Credential is active",
    "issuer": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907",
    "issuanceDate": "2025-01-16T04:38:06Z",
    "credentialMerkleRootHash": "e83c580a8d0ff51179ec1b1156aa9e07664455c75529cb2b868ad8282b389024",
    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2025-01-16T04:39:46Z",
      "verificationMethod": "did:hid:testnet:06be67a7-e2a0-4724-9958-3a78a2a96907#key-1",
      "proofPurpose": "assertionMethod",
      "proofValue": "z55JF4kvjmv7kAm2Me9qhKHgdcDVQ9Kbm3jLdh1nc7gHR7ozMXovsrWsBxaL94msVea3obKRXG1gxmYbUMgj9h8nS",
      "clientSpecType": "CLIENT_SPEC_TYPE_NONE"
    }
  },
  "persist": false,
  "retrieveCredential": true
}
```













## Notes / Observation:

- What is the use of /api/v1/credential/status/register
- In `/issue` API is we pass `registerCredentialStatus=false` then why we are getting `credentialStatus` propert in the response? What's its use if its not getting registered?
- Add metadata in the POST /credential API as well