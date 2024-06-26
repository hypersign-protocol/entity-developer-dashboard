<template>
    <div class="container card">
        <div class="card-body ">

            <div class="row ">
                <div class="col">
                    <h5>Select Network</h5>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="selectService"><strong>Select Blockchain Network<span style="color: red">*</span>:
                            </strong></label>
                        <b-form-select v-model="selectedChainId" :options="selectNetworks" size=""></b-form-select>
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="selectIssuer"><strong>Select Issuer Id<span style="color: red">*</span>:
                            </strong></label>
                        <b-form-select v-model="selectedIssuerDID" :options="selectIssuers" size=""></b-form-select>
                    </div>
                </div>
                <div class="col-md-12">
                    <div>
                        <button class="btn btn-primary btn-md">Deploy</button>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="center">
                        <button type="button" class="btn btn-link">Previous</button>
                        <button type="button" class="btn btn-link">Next</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'DeployKyc',
    data() {
        return {
            selectedChainId: null,
            selectNetworks: [
                { value: null, text: 'Please select a network' },
                {
                    label: 'Interchain',
                    options: [
                        { value: 'cosmos::testnet::chainId-1', text: 'Cosmos' },
                        { value: 'cosmos::testnet::chainId-2', text: 'Comdex' },
                    ]
                },
                {
                    label: 'Evm',
                    options: [
                        { value: 'evm::ethereum::chainId-1', text: 'Ethereum' },
                        { value: 'evm::testnet::chainId-2', text: 'Cosmos Localnet' },
                    ]
                },
            ],

            selectedIssuerDID: null,
            selectIssuers: [
                { value: null, text: 'Please select a issuer' },
                { value: 'did:hid:123123123123', text: 'did:hid:123123123123' },
                { value: 'did:hid:123123123123', text: 'did:hid:123123123123' },
                { value: 'did:hid:123123123123', text: 'did:hid:123123123123' },
            ]
        }
    }
}
</script>