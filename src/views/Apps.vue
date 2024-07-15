<template>
  <div>
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
    <div>
      <div v-if="appList.length > 0" class="row">
        <div class="col mt-1">
          <h3 style="float: left;">
            <i class="fa fa-cogs mr-2" aria-hidden="true"></i>Your Services
          </h3>
          <hf-buttons name=" Create" iconClass="fa fa-plus" class="ml-auto " @executeAction="openSlider('SSI_API')"
            style="float: right;">
          </hf-buttons>
        </div>
      </div>

      <div v-else>
        <h3 class="" style="text-align: left">
          Spin up your first service!
        </h3>
        <div>
          <div class="card" style="width:19rem; float: left;border-radius:20px; margin:10px">
            <img class="card-img-top card-image" src="../assets/ssi.png" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">SSI Service</h5>
              <p class="card-text">Spin up your self-sovereign identity and establish your issuer node. Take charge of
                your digital presence, ensuring privacy and security while managing and sharing your identity
                credentials. </p>
              <hf-buttons name=" Create" iconClass="fa fa-plus" style="text-align: right" class="ml-auto "
                @executeAction="openSlider('SSI_API')">
              </hf-buttons>
            </div>
          </div>

          <div class="card" style="width:20rem; float: left; border-radius:20px;margin:10px">
            <img class="card-img-top card-image" src="../assets/kyc2.png" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">KYC Service</h5>
              <p class="card-text">Take the hassle out of onboarding
                while prioritizing data integrity and user control. Welcome to the next level of KYC with self-sovereign
                identity.</p>
              <hf-buttons name=" Create" iconClass="fa fa-plus" style="text-align: right" class="ml-auto mt-4"
                @executeAction="openSlider('CAVACH_API')">
              </hf-buttons>
            </div>
          </div>

          <div class="card" style="width:20rem; float: left;border-radius:20px;margin:10px">
            <div class="overlay"></div>
            <img class="card-img-top card-image" src="../assets/edv.png" alt="Card image cap"
              style="height: 125px; width: 125px; opacity: 0.4;">
            <div class="card-body" style="color: #8080808a">
              <h5 class="card-title">EDV Service</h5>
              <p class="card-text">Easily spin up your encrypted data vault, leveraging the strength of decentralized
                identity to safeguard your sensitive information.</p>
              <hf-buttons name=" Create" iconClass="fa fa-plus" style="text-align: right" class="ml-auto mt-4"
                @executeAction="openSlider('EDV_API')" disabled>
              </hf-buttons>
            </div>
          </div>
        </div>
      </div>

    </div>

    <hf-pop-up id="entity-secret-confirmation-popup" Header="API Secret Key Confirmation">
      <div>
        <p style="color: #ff5400de">
          Warning: You are regenerating a new API Secret Key. The old key will
          no longer be valid.
        </p>
        <input type="text" class="form-control" id="appId" v-model="appIdToGenerateSecret"
          aria-describedby="selected App Id" placeholder="Enter Service Id" />
        <div class="text-center mt-3">
          <hf-buttons name="Continue" class="btn btn-primary text-center"
            @executeAction="reGenerateSecretKey"></hf-buttons>
        </div>
      </div>
    </hf-pop-up>

    <hf-pop-up id="domain-verificaiton-popup" Header="Verify Your Domain">
      <div class="border p-2">
        <div class="form-group">
          <tool-tip infoMessage="Your Domain Name"></tool-tip>
          <label for="orgDid"><strong>Your Domain Name: </strong></label>
          <input type="text" class="form-control" id="orgDid" placeholder="hypersign.id"
            v-model="domainFromOriginComputed" aria-describedby="orgNameHelp" disabled />
        </div>


        <div class="form-group" v-if="appModel.domain && appModel.dependentServices">
          <tool-tip infoMessage="Associated SSI Service Id"></tool-tip>
          <label for="orgDid"><strong>SSI Service Id: </strong></label>
          <input type="text" class="form-control" id="orgDid" v-model="appModel.dependentServices[0]" disabled
            aria-describedby="orgNameHelp" />
        </div>


        <div class="form-group" v-if="appModel.domain">
          <tool-tip infoMessage="Select issuer DID for this app"></tool-tip>
          <label for="selectService"><strong>Select Issuer DID<span style="color: red">*</span>: </strong></label>
          <select class="custom-select" id="selectService" v-model="appModel.issuerDid" v-if="!appModel.issuerDid">
            <option value="" selected>Select a DID</option>
            <option v-for="did in associatedSSIServiceDIDs" :value="did" :key="did">{{ did }}</option>
          </select>
          <input type="text" class="form-control" id="orgDid" v-model="appModel.issuerDid" disabled
            aria-describedby="orgNameHelp" />
        </div>

        <div class="form-group" v-if="appModel.domain && appModel.issuerDid">
          <tool-tip infoMessage="Txt Record"></tool-tip>
          <label for="tenant"><strong>TXT Record: </strong></label>
          <div class="input-group mb-1">
            <input type="text" class="form-control" id="tenant" v-model="txtRecord" aria-describedby="orgNameHelp"
              disabled />
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon2">
                <i class="far fa-copy mt-1" @click="copyToClip(txtRecord, 'TXT Record')">
                </i>
              </span>
            </div>
          </div>
          <small><a target="_blank">{{ `Please add the above TXT record in your domain (${domainFromOriginComputed}) for
              DNS-01
              validation. If you have any trouble setting the TXT record, contact your domain service provider for
              help. Once updated, kindly click on 'Verify' button to verify your domain.` }}
            </a></small>
        </div>
      </div>
      <div class="text-center mt-3" v-if="txtRecord">
        <hf-buttons name="Verify" class="btn btn-primary text-center" @executeAction="verifyDNS01"></hf-buttons>
      </div>
    </hf-pop-up>

    <hf-pop-up id="entity-secretKey-popup" Header="API Secret Key">
      <div class="mt-2" v-if="apiKeySecret != ''">
        <p>
          Make sure to copy and save it securely. If lost, this key can not be
          recovered. However, you can regenerate a new one.
        </p>
        <p>
          Use this key to authenticate your server. See '<a
            href="https://docs.hypersign.id/entity-studio/api-doc/authentication" target="_blank">API reference</a>'
          documentation for more.
        </p>
        <HfFlashNotification class="mt-2" v-if="apiKeySecret != ''" :text="`${apiKeySecret}`" type="API Secret Key"
          description="Your API Secret Key" @click="onHfFlashClick()"></HfFlashNotification>
      </div>
    </hf-pop-up>

    <StudioSideBar :title="edit ? 'Edit Service' : 'Add Service'">
      <div class="container">
        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Your Service Id"></tool-tip>
          <label for="orgDid"><strong>Service Id<span style="color: red">*</span>:
            </strong></label>

          <div class="input-group mb-3">
            <input type="text" class="form-control" id="orgDid" v-model="appModel.appId" aria-describedby="orgNameHelp"
              disabled />
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon2">
                <i class="far fa-copy mt-1" @click="copyToClip(appModel.appId, 'Service Id')">
                </i>
              </span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <tool-tip infoMessage="Name of the service, upto 20 chars"></tool-tip>
          <label for="orgName"><strong>Name<span style="color: red">*</span>:</strong></label>
          <input type="text" class="form-control" id="orgName" v-model="appModel.appName"
            placeholder="Enter name of your app" />
        </div>

        <div class="form-group">
          <tool-tip infoMessage="Give a description for application, upto 100 chars"></tool-tip>
          <label for="orgName"><strong>Description:</strong></label>
          <textarea class="form-control" v-model="appModel.description" rows="3"
            placeholder="Enter meaningful description for your app, max 100 chars"></textarea>
        </div>

        <div class="form-group">
          <tool-tip infoMessage="Monolog Url"></tool-tip>
          <label for="orgDid"><strong>Logo Url: </strong></label>
          <input type="text" class="form-control" id="orgDid" placeholder="https://yourdomain.com/assets/logo.png"
            v-model="appModel.logoUrl" aria-describedby="orgNameHelp" />
        </div>

        <div class="form-group">
          <tool-tip infoMessage="Your domain"></tool-tip>
          <label for="domain"><strong>Domain (Origin)<span style="color: red">*</span>: </strong></label>
          <div class="input-group mb-1">

            <input type="text" class="form-control" id="domain" placeholder="https://yourdomain.com"
              v-model="appModel.domain" aria-describedby="orgDomain"
              :disabled="appModel.hasDomainVerified && appModel.domainLinkageCredentialString" />
            <div class="input-group-append" v-if="appModel.hasDomainVerified">
              <span class="input-group-text" id="basic-addon2">
                <i class="fa fa-check p-1" style="color:green"></i> Verified
              </span>
            </div>
          </div>
          <small>{{ domainFromOriginComputed }}</small>
        </div>

        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Your Encrypted Data Vault id"></tool-tip>
          <label for="orgDid"><strong>Encrypted Data Vault Id: </strong></label>
          <input type="text" class="form-control" id="orgDid" v-model="appModel.edvId" aria-describedby="orgNameHelp"
            disabled />
        </div>

        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Your tenant URL"></tool-tip>
          <label for="tenant"><strong>Tenant URL: </strong></label>
          <div class="input-group mb-1">
            <input type="text" class="form-control" id="tenant" v-model="appModel.tenantUrl"
              aria-describedby="orgNameHelp" disabled />
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon2">
                <i class="far fa-copy mt-1" @click="copyToClip(appModel.tenantUrl, 'Tenant URL')">
                </i>
              </span>
            </div>
          </div>
          <small><a :href="`${swaggerAPIdoc}`" target="_blank">Open API Doc (Swagger)</a></small>
        </div>

        <div class="form-group"
          v-if="edit === true && ((appModel.services && appModel.services.length) > 0 && (appModel.services[0].id == 'SSI_API'))">
          <tool-tip infoMessage=" Your wallet address"></tool-tip>
          <label for="orgDid"><strong>Wallet Address: </strong></label>
          <div class="input-group mb-1">
            <input type="text" class="form-control" id="orgDid" v-model="appModel.walletAddress"
              aria-describedby="orgNameHelp" disabled />
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon2">
                <i class="far fa-copy mt-1" @click="copyToClip(appModel.walletAddress, 'Wallet address')">
                </i>
              </span>
            </div>
          </div>
          <small><a :href="`${$config.explorer.BASE_URL}/account/${appModel.walletAddress}`" target="_blank">Click here
              to view wallet
              balance</a></small>
        </div>

        <div class="form-group" v-if="edit === false">
          <tool-tip infoMessage="Select a service you want to associate with this app"></tool-tip>
          <label for="selectService"><strong>Select Service<span style="color: red">*</span>: </strong></label>
          <select class="custom-select" id="selectService" v-model="selectedServiceId">
            <option :value="eachService.id" v-for="eachService in selectServicesOptions" v-bind:key="eachService.id">{{
              eachService.name }}</option>
          </select>
          <small>{{ serviceDescrition }}</small>
        </div>

        <div class="form-group"
          v-if="selectedServiceId == 'CAVACH_API' || (appModel.services && appModel.services.length > 0 && (appModel.services[0].id == 'CAVACH_API'))">
          <tool-tip infoMessage="Associate your service"></tool-tip>
          <label for="selectService"><strong>Associate SSI Service<span style="color: red">*</span>: </strong></label>
          <select class="custom-select" id="selectSSIService" v-model="selectedAssociatedSSIAppId"
            @change="onSSIServiceChange($event)">
            <option value="" disabled>
              Select a service
            </option>
            <option :value="eachSSIApp.appId" v-for="eachSSIApp in getAppsWithSSIServices"
              v-bind:key="eachSSIApp.appId">
              <div>{{ eachSSIApp.appName }} ( {{ eachSSIApp.appId }} ) </div>
            </option>
          </select>
          <!-- <small>{{ serviceDescrition }}</small> -->
        </div>

        <div class="form-group"
          v-if="(selectedServiceId == 'CAVACH_API' || (appModel.services && appModel.services.length > 0 && (appModel.services[0].id == 'CAVACH_API'))) && selectedAssociatedSSIAppId">
          <tool-tip infoMessage="Select issuer DID for this app"></tool-tip>
          <label for="selectService"><strong>Select Issuer DID<span style="color: red">*</span>: </strong></label>
          <select class="custom-select" id="selectService" v-model="appModel.issuerDid">
            <option value="">Select a DID</option>
            <option v-for="did in associatedSSIServiceDIDs" :value="did" :key="did">{{ did }}</option>
          </select>
          <!-- <input type="text" class="form-control" id="orgDid" v-else v-model="appModel.issuerDid" disabled
            aria-describedby="orgNameHelp" /> -->
        </div>

        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Select an environment"></tool-tip>
          <label for="selectService"><strong>Select Environment<span style="color: red">*</span>: </strong></label>
          <select class="custom-select" id="selectService" v-model="appModel.env">
            <option value="dev">Development</option>
            <option value="prod">Production</option>
          </select>
        </div>

        <!-- <div class="form-group"
          v-if="edit === true && (appModel.services && appModel.services.length > 0 && (appModel.services[0].id == 'CAVACH_API'))">
          <tool-tip infoMessage="SSI Service Id"></tool-tip>
          <label for="orgDid"><strong>SSI Service Id: </strong></label>
          <input type="text" class="form-control" id="orgDid" v-model="appModel.dependentServices[0]"
            aria-describedby="orgNameHelp" disabled />
        </div> -->

        <!-- <div class="form-group"
          v-if="edit === true && (appModel.issuerDid) && (appModel.services[0].id == 'CAVACH_API')">
          <tool-tip infoMessage="Issuer DID"></tool-tip>
          <label for="orgDid"><strong>Issuer DID: </strong></label>
          <input type="text" class="form-control" id="orgDid" v-model="appModel.issuerDid"
            aria-describedby="orgNameHelp" disabled />
        </div> -->

        <div class="form-group">
          <tool-tip
            infoMessage="Listed origins allowed to make CORS requests. Enter comman seperated URLs to whitelist"></tool-tip>
          <label for="orgName"><strong>Allowed Origins (CORS):</strong></label>
          <textarea class="form-control" v-model="appModel.whitelistedCors" rows="3"
            placeholder="*,http://your-domain.com,http://test.com"></textarea>
        </div>

        <div class="form-group" v-if="edit">
          <hf-buttons name="Update" iconClass="fa fa-bookmark" class="btn btn-primary"
            @executeAction="updateAnAppAPIServer()"></hf-buttons>
        </div>
        <div class="form-group" v-else>
          <hf-buttons name="Save" iconClass="fa fa-bookmark" @executeAction="createAnApp()"></hf-buttons>
        </div>
      </div>

    </StudioSideBar>

    <div v-if="appList.length > 0" class="mt-2">
      <b-tabs content-class="mt-0">
        <b-tab :title="'SSI (' + getAppsWithSSIServices.length + ')'" active v-if="getAppsWithSSIServices.length > 0"
          class="bg-white p-3 ">
          <div class="row">
            <div class="col-md-4 mb-4" v-for="eachOrg in getAppsWithSSIServices" :key="eachOrg.appId">
              <div class="card" @click="switchOrg(eachOrg.appId, 'SSI_API')" style="cursor: grab">
                <div class="card-body">
                  <div class="row">
                    <div class="col-9">
                      <div class="row">
                        <div class="col-12">
                          <h5 class="card-title text-uppercase text-muted mb-0">
                            {{ formattedAppName(eachOrg.appName) }}
                          </h5>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-12 mt-1">
                          {{ truncate(
                            eachOrg.description || "No description for this app..",
                            70
                          ) }}
                        </div>
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="p-2">
                        <b-card-img :src="eachOrg.logoUrl ||
                          getProfileIcon(formattedAppName(eachOrg.appId))
                          " alt="logoImg" class="rounded-0" style="max-height: 60px; min-height: 60px">
                        </b-card-img>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <b-card-text>
                        <small class="card-field-label">Service Id:</small>
                        <div class="apiKeySecret" @click.stop="copyToClip(eachOrg.appId, 'Service Id')"
                          title="Copy Service Id">
                          {{ truncate(eachOrg.appId, 45) }}
                          <i class="far fa-copy" style="float: right"></i>
                        </div>
                      </b-card-text>
                    </div>
                  </div>
                  <div class="row" v-if="eachOrg.tenantUrl">
                    <div class="col mt-2">
                      <b-card-text>
                        <small class="card-field-label">Tenant Url:</small>
                        <div class="apiKeySecret" @click.stop="copyToClip(eachOrg.tenantUrl, 'Tenant Url')"
                          title="Copy Tenant Url">
                          {{ truncate(eachOrg.tenantUrl, 55) }}
                          <i class="far fa-copy" style="float: right"></i>
                        </div>
                      </b-card-text>
                    </div>
                  </div>
                  <div class="row mt-2">
                    <div class="col">
                      <span class=" " style="float: right">
                        <span class="badge rounded-pill bg-danger mx-1" title="Click to generate a new API Secret Key"
                          style="cursor: pointer; color: white" @click.stop="openSecretkeyPopUp(eachOrg.appId)">
                          <i class="fa fa-key"></i> Secret
                        </span>
                        <!-- <b-badge pill variant="danger" @click.stop="openSecretkeyPopUp(eachOrg.appId)"
                        title="Click to generate a new API Secret Key"  class="mr-2" style="cursor: pointer">
                          <i class="fa fa-key"></i>
                          Secret</b-badge> -->
                        <span class="badge rounded-pill bg-info mx-1" @click.stop="editOrg(eachOrg.appId)"
                          title="Click to edit the app" style="cursor: pointer; color: white">
                          <i class="fas fa-pencil-alt"></i>
                          Edit</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-tab>
        <b-tab :title="'KYC (' + getAppsWithKYCServices.length + ')'" v-if="getAppsWithKYCServices.length > 0"
          class="bg-white p-3">
          <div class="row">
            <div class="col-md-4 mb-4" v-for="eachOrg in getAppsWithKYCServices" :key="eachOrg.appId">
              <div class="card" @click="switchOrg(eachOrg.appId, 'CAVACH_API')" style="cursor: grab">
                <div class="card" style="cursor: grab">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-9">
                        <div class="row">
                          <div class="col-12">
                            <h5 class="card-title text-uppercase text-muted mb-0">
                              {{ formattedAppName(eachOrg.appName) }}
                              <img src="../assets/verified-success.png" style="max-height: 20px; min-height: 20px;"
                                v-if="eachOrg.hasDomainVerified" />
                            </h5>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-12 mt-1">
                            {{ truncate(
                              eachOrg.description || "No description for this app..",
                              70
                            ) }}
                          </div>
                        </div>
                      </div>
                      <div class="col-3">
                        <div class="p-2 logo-container"
                          style="border: 1px solid #303c3029;border-radius: 51px; overflow: hidden;">
                          <b-card-img :src="eachOrg.logoUrl ||
                            getProfileIcon(formattedAppName(eachOrg.appId))
                            " alt="logoImg" class="rounded-1 logo"
                            style="max-height: 60px; min-height: 60px; border-radius: 50%;">
                          </b-card-img>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col">
                        <b-card-text>
                          <small class="card-field-label">Service Id:</small>
                          <div class="apiKeySecret" @click.stop="copyToClip(eachOrg.appId, 'Service Id')"
                            title="Copy Service Id">
                            {{ truncate(eachOrg.appId, 45) }}
                            <i class="far fa-copy" style="float: right"></i>
                          </div>
                        </b-card-text>
                      </div>
                    </div>
                    <div class="row" v-if="eachOrg.tenantUrl">
                      <div class="col">
                        <b-card-text>
                          <small class="card-field-label">Tenant Url:</small>
                          <div class="apiKeySecret" @click.stop="copyToClip(eachOrg.tenantUrl, 'Tenant Url')"
                            title="Copy Tenant Url">
                            {{ truncate(eachOrg.tenantUrl, 55) }}
                            <i class="far fa-copy" style="float: right"></i>
                          </div>
                        </b-card-text>
                      </div>
                    </div>
                    <div class="row mt-2">
                      <div class="col">
                        <!-- <span class=" " style="cursor: pointer" @click.stop="switchOrg(eachOrg.appId,  'CAVACH_API')"><i
                          class="fas fa-tachometer-alt" aria-hidden="true"></i></span> -->
                        <span style="float:left">
                          <span class="badge bg-secondary text-white mx-1" v-if="eachOrg.env == 'dev'">{{ eachOrg.env
                            }}</span>
                          <span class="badge bg-success text-white mx-1" v-else>{{ eachOrg.env }}</span>

                          <span class="badge rounded bg-light mx-1" v-if="eachOrg.domain && eachOrg.hasDomainVerified">
                            <a @click.stop :href="eachOrg.domain" target="_blank" style="text-decoration:none">{{
                              domainFromOrigin(eachOrg.domain) }}</a>
                          </span>
                        </span>
                        <span class=" " style="float: right">
                          <span class="badge rounded-pill bg-warning  text-dark mx-1"
                            @click.stop="verifyDomainOpenPopup(eachOrg)" title="Click to verify your domain"
                            v-if="!eachOrg.hasDomainVerified && eachOrg.dependentServices[0]">
                            <i class="fa fa-check"></i>
                            Domain</span>



                          <span class="badge rounded-pill bg-danger mx-1"
                            @click.stop="openSecretkeyPopUp(eachOrg.appId)"
                            title="Click to generate a new API Secret Key" style="cursor: pointer; color:white">
                            <i class="fa fa-key"></i>
                            Secret</span>

                          <span class="badge rounded-pill bg-info mx-1" @click.stop="editOrg(eachOrg.appId)"
                            title="Click to edit the app" style="cursor: pointer; color:white">
                            <i class="fas fa-pencil-alt"></i>
                            Edit
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-tab>
      </b-tabs>

    </div>


    <!-- <hf-pop-up id="onchain-kyc-deploy" Header="Deploy Your OnChain KYC">
      <DeployOnChainKYC />
    </hf-pop-up> -->
  </div>
</template>

<style scoped>
.nav-tabs .nav-link.active {
  border-radius: 0px 20px 0px 0px;
  border-bottom: 1px solid white;
}


.overlay {
  background: rgba(0, 0, 0, 0.323);
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.card-image {
  border-radius: 20px 20px 0px 0px;
  height: 120px;
  width: 120px;
  margin-left: 27%;
  opacity: 0.7;
  margin: 20px;
  cursor: grab;

}

.card {
  box-shadow: 0 0 2rem 0 rgb(136 152 170 / 15%);
  border-radius: 20px;
}

.icons {
  cursor: pointer;
  padding: 4px;
}

.icons.danger {
  color: rgba(255, 0, 0, 0.589);
}

.icons:hover {
  border-radius: 10px;
  font-weight: bold;
  background-color: rgb(155, 153, 153);
  color: white;
}

.card-field-label {
  color: grey;
  font-weight: bold;
}

.bcard {
  min-height: 210px;
  max-height: 200px;
  min-width: 400px;
  max-width: 450px;
  float: left;
  margin: 10px;
}

.bcard:hover {
  box-shadow: 0 0 2px 5px rgba(251, 161, 82, 0.268);
  cursor: pointer;
}

.logoImg {
  width: 60px;
  height: 60px;
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.appCard {
  max-width: 30rem;
  margin-top: 10px;
  height: 13rem;
  min-height: 100px;
}

.apiKeySecret {
  cursor: pointer;
  padding: 5px;
  font-size: larger;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #99caff;
  padding-right: 10px;
}

.apiKeySecret:hover {
  font-weight: bolder;
  background: #f1f1f1;
  border: 1px solid #007bff;
}

.far {
  cursor: pointer;
  color: grey;
  display: inline;
  padding-left: 5px;
}

.container {
  padding: 20px;
  text-align: left;
}

.eventCard {
  border-left: 10px solid var(--ds-background-accent-red-subtler, #905ab029);
}

.eventCard:hover {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 10px;
  cursor: pointer;
}

.scroll {
  padding-top: 1em;
  overflow: auto;
  height: 490px;
}
</style>

<script>
import HfPopUp from "../components/element/hfPopup.vue";
import StudioSideBar from "../components/element/StudioSideBar.vue";
import UtilsMixin from "../mixins/utils";
import { isEmpty, isValidOrigin } from "../mixins/fieldValidation";
import "vue-loading-overlay/dist/vue-loading.css";
import Loading from "vue-loading-overlay";
import HfButtons from "../components/element/HfButtons.vue";
import ToolTip from "../components/element/ToolTip.vue";
import messages from "../mixins/messages";
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import HfFlashNotification from "../components/element/HfFlashNotification.vue";
import { sanitizeUrl } from '../utils/common'
// import DeployOnChainKYC from "../components/deploy-onchain-kyc-popup/deploy.vue";
import DomainLinkage from '@hypersign-protocol/domain-linkage-verifier'
import config from '../config';
export default {
  name: "AppList",
  computed: {
    ...mapState({
      appList: (state) => state.mainStore.appList,
      totalAppCount: (state) => state.mainStore.totalAppCount,
    }),
    ...mapGetters("mainStore", ["getAppByAppId", "getAllServices", "getServiceById", 'getAppsWithSSIServices', 'getAppsWithKYCServices', 'getUserAccessList']),
    domainFromOriginComputed() {
      try {
        const url = new URL(this.appModel.domain)
        return url.host
      } catch (e) {
        return this.appModel.domain
      }
    },

    txtRecord() {
      return this.appModel.issuerDid ? "hypersign-domain-verification.did=" + this.appModel.issuerDid : null;
    },
    pages() {
      return Math.ceil(parseInt(this.totalAppCount) / 10);
    },
    selectServicesOptions() {
      return this.getAllServices
    },
    serviceDescrition() {
      if (this.getServiceById(this.selectedServiceId)) {
        return this.getServiceById(this.selectedServiceId).description
      } else {
        return ""
      }
    },
    swaggerAPIdoc() {
      if (this.appModel.tenantUrl) {
        if (this.appModel.services) {
          const service = this.appModel.services.length > 0 ? this.appModel.services[0] : null
          if (service) {
            if (service.swaggerAPIDocPath) {
              return sanitizeUrl(this.appModel.tenantUrl) + service.swaggerAPIDocPath
            }
          }
        }
        return sanitizeUrl(this.appModel.tenantUrl)
      } else {
        return ""
      }
    },
  },
  mounted() {
    this.setMainSideNavBar(false);
    this.initializeStore()
    this.$root.$emit('recomputeParseAuthTokenEvent')
  },
  data() {
    return {
      selectedServiceId: "SSI_API",
      selectedAssociatedSSIAppId: "",
      edit: false,
      flash: null,
      isAdd: true,
      controllerValue: "",
      appIdToGenerateSecret: "",
      fullPage: true,
      isLoading: false,
      isProcessFinished: true,
      apiKeySecret: "",
      selectedAppId: "",
      appModel: {
        appId: "",
        apiKeySecret: "",
        appName: "",
        walletAddress: "",
        edvId: "",
        description: "",
        whitelistedCors: "",
        logoUrl: "",
        tenantUrl: "",
        services: [],
        dependentServices: [],
        env: "dev",
        issuerDid: null,
        domain: "",
        hasDomainVerified: false,
        domainLinkageCredentialString: ""
      },
      authToken: localStorage.getItem("authToken"),
      domain: "",
      associatedSSIServiceDIDs: []
    };
  },
  components: {
    HfPopUp,
    Loading,
    StudioSideBar,
    HfButtons,
    ToolTip,
    HfFlashNotification,
    // DeployOnChainKYC
  },
  methods: {
    ...mapMutations("mainStore", ["updateAnApp", "setMainSideNavBar"]),
    ...mapMutations("mainStore", ["setSelectedAppId"]),
    ...mapActions("mainStore", [
      "saveAnAppOnServer",
      "updateAnAppOnServer",
      "generateAPISecretKey",
      "keepAccessTokenReadyForApp",
      "fetchDIDsForAService",
      "fetchAppsListFromServer",
      "fetchServicesList"
    ]),

    async initializeStore() {
      try {
        this.authToken = localStorage.getItem("authToken");
        if (this.authToken) {
          // this.showIcon = true;
          this.isLoading = true;
          await this.fetchAppsListFromServer();
          await this.fetchServicesList()
          this.isLoading = false;
        } else {
          throw new Error("No auth token")
        }
      } catch (e) {
        // this.showIcon = false
        this.isLoading = false;
        this.notifyErr(`Error:  ${e.message}`);
      }

    },

    ...mapMutations("playgroundStore", [
      "shiftContainer",
    ]),

    domainFromOrigin(domain = this.appModel.domain) {
      try {
        const url = new URL(domain)
        return url.host
      } catch (e) {
        return domain
      }
    },

    async switchOrg(appId, serviceType = 'SSI_API') {
      // 
      this.setSelectedAppId(appId)
      switch (serviceType) {
        case 'SSI_API': {
          this.$router.push({ name: "DIDs", params: { appId } });
          break;
        }
        case 'CAVACH_API': {
          // // Remo this once  this feature is complet
          // this.notifyErr('Feature coming soon..')
          const accessList = this.getUserAccessList('CAVACH_API')
          if (accessList && accessList.length > 0) {
            const allAccess = accessList.find(x => x.access == 'ALL')
            if (!allAccess) {
              // Check if he has dashboard access
              const readSessionAccess = accessList.find(x => x.access == 'READ_SESSION')
              if (!readSessionAccess) {
                return this.notifyErr('You do not have access to KYC dashboard, kindly contact the Hypersign Team')
              }
            }
            this.$router.push({ name: "playgroundCredential", params: { appId } });
          } else {
            return this.notifyErr('You do not have access to KYC dashboard, kindly contact the admin')
          }
          break;
        }
        default: {
          this.$router.push({ name: "playgroundCredential", params: { appId } });
        }
      }

      this.shiftContainer(false);

    },

    onServicesSelected() {
      console.log('ononServicesSelected() got calledsuccessfully')

      if (this.selectedServicesInMultiSelect.length > 0) {
        console.log('Added')
      }
    },
    async onSSIServiceChange(event) {
      const ssiServiceId = event.target.value;
      if (ssiServiceId) {
        await this.prepareDIDList(ssiServiceId)
      }
    },
    formattedAppName(appName) {
      if (appName == "" || appName == undefined) appName = "No app name";
      return this.truncate(appName, 25);
    },
    getProfileIcon(name) {
      return "https://api.dicebear.com/7.x/identicon/svg?seed=" + name;
    },
    onHfFlashClick() {
      this.apiKeySecret = "";
    },
    copyToClip(textToCopy, contentType) {
      if (textToCopy) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            this.notifySuccess(`${contentType} copied!`);
          })
          .catch((err) => {
            this.notifyErr("Error while copying", err);
          });
      }
    },
    openSlider(selectedServiceType = 'SSI_API') {
      this.edit = false;
      this.clearAll();
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
      this.selectedServiceId = selectedServiceType;
    },
    closeSlider() {
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    async editOrg(appId) {
      this.edit = true;
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
      const appModel = this.getAppByAppId(appId);
      appModel.whitelistedCors = appModel.whitelistedCors.toString();
      Object.assign(this.appModel, { ...appModel });
      this.selectedAssociatedSSIAppId = appModel.dependentServices[0]
      console.log('Edit org this.selectedAssociatedSSIAppId ' + this.selectedAssociatedSSIAppId)
      await this.prepareDIDList(this.selectedAssociatedSSIAppId)
    },
    validateFields() {
      const m = [];
      const isAppNameEmpty = isEmpty(this.appModel.appName);
      if (isAppNameEmpty) {
        m.push(messages.APPLICATION.INVALID_APP_NAME);
      }

      if (!isAppNameEmpty && this.appModel.appName.length < 5) {
        m.push(messages.APPLICATION.CHAR_LESS_APP_NAME);
      }

      if (!isAppNameEmpty && this.appModel.appName.length > 50) {
        m.push(messages.APPLICATION.CHAR_EXCEED_APP_NAME);
      }

      const isAppDescriptionEmpty = isEmpty(this.appModel.description);
      if (!isAppDescriptionEmpty && this.appModel.description.length < 20) {
        m.push(messages.APPLICATION.CHAR_LESS_APP_DES);
      }

      if (!isAppDescriptionEmpty && this.appModel.description.length > 100) {
        m.push(messages.APPLICATION.CHAR_EXCEED_APP_DES);
      }


      if (this.selectedServiceId === 'CAVACH_API') {
        if (this.selectedAssociatedSSIAppId === "") {
          m.push(messages.APPLICATION.SSI_SERVICE_NOT_SELECTED)
        }
      }

      if (!Array.isArray(this.appModel.whitelistedCors)) {
        const newArray = this.appModel.whitelistedCors
          .split(",")
          .filter((x) => x != " ")
          .map((x) => x.trim());
        for (let i = 0; i < newArray.length; i++) {
          if (!isValidOrigin(newArray[i])) {
            m.push(messages.APPLICATION.INVALID_CORS);
            break;
          }
        }
      }

      if (!this.appModel.domain) {
        m.push(messages.APPLICATION.ENTER_DOMAIN_ORGIN)
      } else {
        try {
          const t = new URL(this.appModel.domain)
          if (!t.origin || t.host == '') {
            throw new Error()
          }
        } catch (e) {
          m.push(messages.APPLICATION.INVALID_DOMAIN_ORGIN)
        }
      }

      if (this.appModel.env == 'prod') {
        if (!this.appModel.hasDomainVerified) {
          m.push(messages.APPLICATION.CANT_GO_PROD_BEFORE_DOMAIN_VERIFICATION)
        }

        if (!this.appModel.logoUrl) {
          m.push(messages.APPLICATION.CANT_GO_PROD_BEFORE_SETTING_LOGO)
        }
      }

      return {
        message: m,
      }
    },
    async createAnApp() {
      try {
        const errorMessages = this.validateFields();
        if (errorMessages && errorMessages.message.length > 0) {
          throw errorMessages;
        }

        this.isLoading = true;
        let whitelistCors = [];
        if (!isEmpty(this.appModel.whitelistedCors)) {
          whitelistCors = this.appModel.whitelistedCors
            .split(",")
            .filter((x) => x != " ")
            .map((x) => x.trim());
          const s = new Set(whitelistCors);
          if (whitelistCors.length !== s.size) {
            throw new Error(messages.APPLICATION.DUPLICATE_ORIGIN_VALUES);
          }
        }

        const t = await this.saveAnAppOnServer({
          appName: this.appModel.appName,
          whitelistedCors: whitelistCors,
          description: this.appModel.description,
          logoUrl: this.appModel.logoUrl,
          serviceIds: [this.selectedServiceId],
          dependentServices: [this.selectedAssociatedSSIAppId],
          env: this.appModel.env,
          domain: this.appModel.domain,
          issuerDid: this.appModel.issuerDid,
          hasDomainVerified: this.appModel.hasDomainVerified
        });



        if (t && t.apiSecretKey && t.tenantUrl) {

          this.keepAccessTokenReadyForApp({
            serviceId: t.appId,
            grant_type: config.GRANT_TYPES_ENUM[t.services[0].id]
          })

          this.apiKeySecret = t.apiSecretKey;
          this.appModel.tenantUrl = t.tenantUrl;
          // Object.assign(this.appModel, { ...t })
          // this.edit = true;
          this.closeSlider();
          this.$root.$emit("bv::show::modal", "entity-secretKey-popup");
          this.notifySuccess(messages.APPLICATION.APP_CREATE_SUCCESS);
        } else {
          throw new Error("App creation error: something went wrong");
        }
      } catch (e) {
        if (Array.isArray(e.message)) {
          e.message.forEach((m) => {
            this.notifyErr(m);
          });
        } else {
          this.notifyErr(e.message);
        }
      } finally {
        this.isLoading = false;
      }
    },


    async prepareDIDList(ssiSserviceId) {
      try {
        if (ssiSserviceId) {
          const associatedSSIService = this.getAppsWithSSIServices.find(x => x.appId === ssiSserviceId)
          if (associatedSSIService) {
            const payload = {
              tenantUrl: associatedSSIService.tenantUrl,
              accessToken: associatedSSIService.access_token
            }
            this.isLoading = true
            const allDIDs = await this.fetchDIDsForAService(payload)
            this.associatedSSIServiceDIDs = allDIDs;
            this.isLoading = false
          }
        }
      } catch (e) {
        this.isLoading = false

        this.notifyErr(e.message)
      }
    },

    async verifyDomainOpenPopup(app) {
      // Make API call to retrive all DIDs for this SSI service..
      // Add them the select dropdown list
      // getAppsWithSSIServices
      this.appModel = { ...app }
      const ssiSserviceId = app.dependentServices[0]

      await this.prepareDIDList(ssiSserviceId);
      this.$root.$emit("bv::show::modal", "domain-verificaiton-popup");
    },

    closeDomainPopup() {
      this.$root.$emit("bv::hide::modal", "domain-verificaiton-popup");
    },

    async verifyDNS01() {
      try {
        if (!this.appModel.domain) {
          throw new Error('Please enter a domain')
        }

        if (!this.txtRecord) {
          throw new Error('Please select a DID')
        }

        if (this.appModel.domain.includes('localhost') || this.appModel.domain.includes('127.0.0.1')) {
          throw new Error('Domain can not be localhost or 127.0.0.1')
        }

        this.isLoading = true
        const domainLinkage = new DomainLinkage(this.appModel.domain)
        const txtRecord = await domainLinkage.verifyDnsTxtRecord(this.appModel.domain.includes('http') ? this.appModel.domain : new URL('https://' + this.appModel.domain), this.txtRecord)

        if (txtRecord && txtRecord.error) {
          throw new Error(txtRecord.error?.message + '. If you have already added then it may take a while to complete. Please try again in sometime.')
        }

        if (txtRecord && txtRecord.verified) {
          this.notifySuccess('Domain verified successfully')
          this.notifySuccess('Proceeing to update the service')
          this.appModel.hasDomainVerified = true;
          await this.updateAnAppAPIServer("domainUpdate")
        }
        this.isLoading = false
      } catch (e) {
        console.log(e)
        this.isLoading = false
        this.notifyErr(e.message)
      }

    },
    async updateAnAppAPIServer(type) {
      try {
        const errorMessages = this.validateFields();
        if (errorMessages && errorMessages.message.length > 0) {
          throw errorMessages;
        }

        this.isLoading = true;
        let whitelistCors = [];
        console.log(this.appModel.whitelistedCors)
        if (!Array.isArray(this.appModel.whitelistedCors)) {
          whitelistCors = this.appModel.whitelistedCors.split(",").filter((x) => x != " ").map((x) => x.trim());
          const s = new Set(whitelistCors);
          if (whitelistCors.length !== s.size) {
            throw new Error(messages.APPLICATION.DUPLICATE_ORIGIN_VALUES);
          }
        } else {
          whitelistCors = this.appModel.whitelistedCors
        }
        const t = await this.updateAnAppOnServer({
          appId: this.appModel.appId,
          appName: this.appModel.appName,
          whitelistedCors: whitelistCors,
          description: this.appModel.description,
          logoUrl: this.appModel.logoUrl,
          env: this.appModel.env,
          domain: this.appModel.domain,
          issuerDid: this.appModel.issuerDid, // on this did linkedDomain credential will be issued
          hasDomainVerified: this.appModel.hasDomainVerified,
          dependentServices: [this.selectedAssociatedSSIAppId],
        });
        if (t) {
          if (type == "domainUpdate") {
            this.closeDomainPopup()
          } else {
            this.closeSlider();
          }
          this.clearAll();

          this.notifySuccess(messages.APPLICATION.APP_UPDATE_SUCCESS);
          this.isLoading = true;

        } else {
          throw new Error("Something went wrong");
        }
      } catch (e) {
        console.log(e.message)
        if (Array.isArray(e.message)) {
          e.message.forEach((m) => {
            this.notifyErr(m);
          });
          return;
        }
        this.isLoading = true;

        this.notifyErr(e.message);
      } finally {
        this.isLoading = false;
      }
    },
    openSecretkeyPopUp(appId) {
      this.appIdToGenerateSecret = "";
      this.apiKeySecret = "";
      this.selectedAppId = appId;
      this.$root.$emit("bv::show::modal", "entity-secret-confirmation-popup");
    },

    // openOnChainDeployPopup(appId) {
    //   console.log('Inside openOnChainDeployPopup() appId' + appId)
    //   this.$root.$emit("bv::show::modal", "onchain-kyc-deploy");
    // },
    async reGenerateSecretKey() {
      if (this.appIdToGenerateSecret === "") {
        return this.notifyErr(messages.APPLICATION.ENTER_APP_ID);
      }

      if (this.appIdToGenerateSecret !== this.selectedAppId) {
        return this.notifyErr(messages.APPLICATION.VALID_ID);
      }
      this.$root.$emit("bv::hide::modal", "entity-secret-confirmation-popup");
      try {
        const appId = this.selectedAppId;
        this.isLoading = true;
        const resp = await this.generateAPISecretKey({ appId });
        if (resp) {
          this.apiKeySecret = resp.apiSecretKey;
          this.$root.$emit("bv::show::modal", "entity-secretKey-popup");
          this.notifySuccess(messages.APPLICATION.APP_NEW_SECRET_KEY_SUCCESS);
        } else {
          throw new Error("Something went wrong");
        }
      } catch (e) {
        if (Array.isArray(e.message)) {
          e.message.forEach((m) => {
            this.notifyErr(m);
          });
          return;
        }
        this.notifyErr(e.message);
      } finally {
        this.isLoading = false;
      }
    },
    clearAll() {
      this.appModel = {
        appId: "",
        appName: "",
        apiKeySecret: "",
        tenantUrl: "",
        walletAddress: "",
        edvId: "",
        logoUrl: "",
        services: [],
        dependentServices: [],
        env: "dev",
        issuerDid: null,
        domain: "",
        hasDomainVerified: false,
        domainLinkageCredentialString: ""
      };
      this.selectedAssociatedSSIAppId = ""
      this.domain = ""
      this.associatedSSIServiceDIDs = []
    },
  },
  beforeDestroy() {
    this.setMainSideNavBar(true);
  },
  mixins: [UtilsMixin],
};
</script>
