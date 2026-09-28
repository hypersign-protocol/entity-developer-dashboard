<template>
  <div class="config-page">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage" />

    <header class="page-header app-page-header">
      <div>
        <h1 class="app-page-title">App configuration</h1>
        <p class="app-page-subtitle">Manage application details, domain verification, issuer settings, and browser access.</p>
      </div>
      <span class="environment-badge" :class="isProd ? 'is-production' : 'is-development'">
        <span></span>{{ isProd ? 'Production' : 'Development' }}
      </span>
    </header>

    <nav class="config-tabs" aria-label="Application configuration sections">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        :class="{ active: activeTab === tab.value }"
        :disabled="(isEditing || isEditingDomain) && activeTab !== tab.value"
        @click="selectTab(tab.value)"
      >
        {{ tab.label }}
      </button>
    </nav>

    <div class="config-layout">
      <main class="config-content">
        <template v-if="activeTab === 'general'">
          <section class="config-card">
            <div class="card-header-row">
              <div>
                <h2>Application details</h2>
                <p>The name and branding people see when they interact with this application.</p>
              </div>
              <div class="edit-actions">
                <button v-if="!isEditing" type="button" class="icon-button" title="Edit application" aria-label="Edit application details" @click="startEdit('details')">
                  <v-icon small>mdi-pencil-outline</v-icon>
                </button>
              </div>
            </div>

            <div class="details-grid">
              <div class="detail-field">
                <label>Application name <span class="required-marker" aria-hidden="true">*</span></label>
                <input v-if="isEditing && editingSection === 'details'" v-model.trim="formData.appName" type="text" required />
                <p v-else>{{ formData.appName || '—' }}</p>
              </div>
              <div class="detail-field">
                <label>Application ID</label>
                <div class="copy-value">
                  <code>{{ formData.appId || '—' }}</code>
                  <button v-if="formData.appId" type="button" class="copy-icon-button" title="Copy application ID" aria-label="Copy application ID" @click="copyToClip(formData.appId, 'App ID')">
                    <i class="mdi mdi-content-copy"></i>
                  </button>
                </div>
              </div>
              <div class="detail-field">
                <label>Description</label>
                <textarea v-if="isEditing && editingSection === 'details'" v-model.trim="formData.description" rows="3"></textarea>
                <p v-else>{{ formData.description || '—' }}</p>
              </div>
              <div class="detail-field">
                <label>Logo</label>
                <div class="logo-row">
                  <LogoUploader v-model="formData.logoUrl" :allow-reupload="isEditing && editingSection === 'details'" />
                </div>
              </div>
            </div>
            <div v-if="isEditing && editingSection === 'details'" class="card-footer-actions">
              <button type="button" class="secondary-button" @click="cancelEdit">Cancel</button>
              <button type="button" class="primary-button" @click="saveChanges">Save changes</button>
            </div>
          </section>

          <section class="config-card">
            <div class="card-header-row">
              <div>
                <h2>Allowed origins</h2>
                <p>Control which browser origins can call this application.</p>
              </div>
              <div class="edit-actions">
                <button v-if="!isEditing" type="button" class="icon-button" title="Edit allowed origins" aria-label="Edit allowed origins" @click="startEdit('origins')">
                  <v-icon small>mdi-pencil-outline</v-icon>
                </button>
              </div>
            </div>
            <div class="origins-editor">
              <label>Whitelisted CORS origins</label>
              <CorsChipsInput
                v-model="formData.whitelistedCors"
                :readonly="!(isEditing && editingSection === 'origins')"
                placeholder="Add an origin, for example https://app.example.com"
              />
              <p>Only HTTP or HTTPS origins are accepted. Paths, query strings, and fragments are removed.</p>
            </div>
            <div v-if="isEditing && editingSection === 'origins'" class="card-footer-actions">
              <button type="button" class="secondary-button" @click="cancelEdit">Cancel</button>
              <button type="button" class="primary-button" @click="saveChanges">Save changes</button>
            </div>
          </section>
        </template>

        <template v-else-if="activeTab === 'domain'">
          <section class="config-card">
            <div class="card-header-row compact">
              <div>
                <div class="domain-title-row">
                  <h2>Verify domain</h2>
                  <span class="verification-badge" :class="displayDomainVerified ? 'verified' : 'unverified'">
                    {{ displayDomainVerified ? '✓ Verified' : 'Unverified' }}
                  </span>
                </div>
                <p>Verify domain ownership to unlock Production access.</p>
              </div>
              <div class="edit-actions">
                <button v-if="!isEditing && !isEditingDomain" type="button" class="icon-button" title="Edit domain" aria-label="Edit domain" @click="startDomainEdit">
                  <v-icon small>mdi-pencil-outline</v-icon>
                </button>
              </div>
            </div>

            <div v-if="isEditingDomain" class="domain-editor">
              <strong class="current-domain">{{ currentDomain || 'No domain configured' }}</strong>
              <div class="detail-field domain-field">
                <label>New domain <span class="required-marker" aria-hidden="true">*</span></label>
                <input v-model.trim="formData.domain" type="text" placeholder="example.com" required />
                <small>Changing the domain starts a new ownership check. The new domain will be unverified after it is saved.</small>
              </div>
            </div>
            <div v-else class="domain-summary detail-field">
              <label>Domain <span class="required-marker" aria-hidden="true">*</span></label>
              <strong>{{ formData.domain || 'No domain configured' }}</strong>
            </div>
            <div v-if="isEditingDomain" class="card-footer-actions domain-footer-actions">
              <button type="button" class="secondary-button" @click="cancelDomainEdit">Cancel</button>
              <button type="button" class="primary-button" @click="saveDomainChange">Save domain</button>
            </div>
          </section>

          <section class="config-card">
            <div class="card-header-row">
              <div>
                <h2>TXT record</h2>
                <p>Add this record to your DNS provider before verifying the domain.</p>
              </div>
            </div>
            <div v-if="txtRecord" class="dns-record domain-record">
              <div>
                <label>DNS TXT value</label>
                <code>{{ txtRecord }}</code>
              </div>
              <button type="button" class="copy-icon-button bordered" title="Copy TXT record" aria-label="Copy TXT record" @click="copyToClip(txtRecord, 'TXT Record')">
                <i class="mdi mdi-content-copy"></i>
              </button>
            </div>
            <div v-else class="domain-prerequisite">
              Configure an Issuer DID first to generate the domain verification TXT record.
            </div>
            <ol class="verification-guide-list inline-guide">
              <li>Add the TXT record above in your domain provider's DNS settings.</li>
              <li>Wait for DNS propagation, which may take 5–30 minutes.</li>
              <li>Return here and verify the domain.</li>
            </ol>
            <div v-if="!displayDomainVerified" class="card-footer-actions">
              <button type="button" class="primary-button" :disabled="!txtRecord || !formData.domain" @click="verifyDomain">Verify domain</button>
            </div>
          </section>
        </template>

        <template v-else>
          <section class="config-card">
            <div class="card-header-row">
              <div>
                <h2>Issuer configuration</h2>
                <p>Configure the decentralized identity used to issue credentials.</p>
              </div>
              <div class="edit-actions">
                <button v-if="!isEditing" type="button" class="icon-button" title="Edit issuer configuration" aria-label="Edit issuer configuration" @click="startEdit('issuer')">
                  <v-icon small>mdi-pencil-outline</v-icon>
                </button>
              </div>
            </div>

            <div class="identity-fields">
              <div class="detail-field">
                <label>Issuer DID <span class="required-marker" aria-hidden="true">*</span></label>
                <select v-if="isEditing && editingSection === 'issuer'" v-model="formData.issuerDid" required @change="resolveDid($event)">
                  <option value="">Select a DID</option>
                  <option v-for="did in associatedSSIServiceDIDs" :key="did" :value="did">{{ did }}</option>
                </select>
                <div v-else class="copy-value read-only-value">
                  <code>{{ formData.issuerDid || 'Not configured' }}</code>
                  <button v-if="formData.issuerDid" type="button" class="copy-icon-button" title="Copy Issuer DID" aria-label="Copy Issuer DID" @click="copyToClip(formData.issuerDid, 'Issuer DID')">
                    <i class="mdi mdi-content-copy"></i>
                  </button>
                </div>
              </div>

              <div class="detail-field">
                <label>Verification Method ID <span class="required-marker" aria-hidden="true">*</span></label>
                <select v-if="isEditing && editingSection === 'issuer'" v-model="formData.issuerVerificationMethodId" :disabled="!formData.issuerDid" required>
                  <option value="">{{ formData.issuerDid ? 'Select a verification method' : 'Select a DID first' }}</option>
                  <option v-for="vm in issuerVerificationMethodIds" :key="vm.id" :value="vm.id">{{ vm.id }} ({{ vm.type }})</option>
                </select>
                <div v-else class="copy-value read-only-value">
                  <code>{{ formData.issuerVerificationMethodId || 'Not configured' }}</code>
                  <button v-if="formData.issuerVerificationMethodId" type="button" class="copy-icon-button" title="Copy Verification Method ID" aria-label="Copy Verification Method ID" @click="copyToClip(formData.issuerVerificationMethodId, 'Verification Method ID')">
                    <i class="mdi mdi-content-copy"></i>
                  </button>
                </div>
                <span v-if="selectedVerificationMethodType" class="key-type">{{ selectedVerificationMethodType }}</span>
              </div>
            </div>
            <div v-if="isEditing && editingSection === 'issuer'" class="card-footer-actions">
              <button type="button" class="secondary-button" @click="cancelEdit">Cancel</button>
              <button type="button" class="primary-button" @click="saveChanges">Save changes</button>
            </div>
          </section>
        </template>
      </main>

      <aside class="config-sidebar">
        <section class="side-card">
          <h2>About this app</h2>
          <dl>
            <div><dt>App name</dt><dd>{{ formData.appName || '—' }}</dd></div>
            <div><dt>Description</dt><dd>{{ formData.description || '—' }}</dd></div>
            <div>
              <dt>Domain</dt>
              <dd>{{ currentDomain || '—' }} <span v-if="displayDomainVerified" class="inline-verified">✓ Verified</span></dd>
            </div>
          </dl>
          <div class="about-note">Changes are saved to Hypersign only after you select Save changes.</div>
        </section>
        <section class="side-card environment-card">
          <div class="side-card-header">
            <div>
              <h2>Environment</h2>
              <p>Choose an environment the app uses.</p>
            </div>
            <button
              v-if="!isEditing && !isEditingDomain"
              type="button"
              class="side-edit-button"
              title="Edit environment"
              aria-label="Edit environment"
              @click="startEdit('environment')"
            >
              <v-icon small>mdi-pencil-outline</v-icon>
            </button>
          </div>
          <div class="environment-toggle side-environment-toggle" :class="{ disabled: !(isEditing && editingSection === 'environment') }">
            <button type="button" :class="{ active: !isProd }" :disabled="!(isEditing && editingSection === 'environment')" @click="setEnv(false)">Development</button>
            <button type="button" :class="{ active: isProd }" :disabled="!(isEditing && editingSection === 'environment')" @click="setEnv(true)">Production</button>
          </div>
          <p class="environment-help">Switching environments can affect credentials, integrations, and available services.</p>
          <p class="production-requirement">Your domain must be verified before moving to Production.</p>
          <p v-if="isEditing && editingSection === 'environment'" class="pending-message">The environment change will be applied when you save.</p>
          <div v-if="isEditing && editingSection === 'environment'" class="side-card-actions">
            <button type="button" class="secondary-button" @click="cancelEdit">Cancel</button>
            <button type="button" class="primary-button" @click="saveChanges">Save environment</button>
          </div>
        </section>
        <section class="side-card danger-card">
          <h2>Danger zone</h2>
          <p>Remove this application and its associated metadata.</p>
          <button type="button" class="danger-button" @click="openDeleteServicePopUp">Delete application</button>
        </section>
      </aside>
    </div>

    <hf-pop-up id="entity-linked-service-detail-popup" Header="Linked Service Detail">
      <div>
        <p class="modal-error" v-html="formattedErrorMessage"></p>
        <div class="text-center mt-3"><hf-buttons name="Ok" customClass="btn btn-danger" @executeAction="closeLinkedServiceDetailPopup" /></div>
      </div>
    </hf-pop-up>

    <hf-pop-up id="entity-delete-service-confirmation-popup" Header="Delete Confirmation">
      <div>
        <p class="modal-error">This permanently removes the application metadata and data vault. Enter the exact Application ID to continue.</p>
        <input id="appId" v-model="appIdToGenerateSecret" type="text" class="form-control" :placeholder="formData.appId" />
        <div class="text-center mt-3"><hf-buttons name="Delete" customClass="btn btn-danger" iconClass="fa fa-trash-alt" @executeAction="deleteOrg" /></div>
      </div>
    </hf-pop-up>

  </div>
</template>

<style scoped>
.config-page { padding: 16px 15px 64px; color: #273448; background: #fff; }
.app-page-header { min-height: 52px; margin-bottom: 24px; }
.app-page-title { margin: 0 0 4px; color: #263244; font-size: 24px; font-weight: 700; letter-spacing: -.02em; line-height: 1.25; }
.app-page-subtitle { margin: 0; color: #718198; font-size: 13px; font-weight: 400; line-height: 1.45; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.environment-badge { display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px; border: 1px solid; border-radius: 18px; font-size: 12px; font-weight: 700; }
.environment-badge span { width: 8px; height: 8px; border-radius: 50%; }
.is-development { border-color: #efd4a5; background: #fff9ee; color: #956625; }
.is-development span { background: #d99833; }
.is-production { border-color: #b7e2cb; background: #effaf4; color: #237d52; }
.is-production span { background: #2daf78; }
.config-tabs { display: flex; gap: 31px; border-bottom: 1px solid #dce4ed; }
.config-tabs button { padding: 12px 2px 12px; border: 0; border-bottom: 2px solid transparent; background: transparent; color: #5e6d82; font-size: 13px; font-weight: 700; }
.config-tabs button.active { border-color: #2563dc; color: #2563dc; }
.config-tabs button:disabled { cursor: default; opacity: .55; }
.config-tabs button.active:disabled { opacity: 1; }
.config-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, 320px); gap: 28px; width: 100%; margin-top: 29px; align-items: start; }
.config-content, .config-sidebar { display: grid; gap: 18px; }
.config-card, .side-card { border: 1px solid #d7e0ea; border-radius: 12px; background: #fff; box-shadow: 0 1px 2px rgba(15,23,42,.015); }
.config-card { padding: 28px 30px; }
.side-card { padding: 22px 22px; }
.card-header-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; }
.card-header-row.compact { margin-bottom: 20px; }
.card-header-row h2, .side-card h2 { margin: 0 0 5px; color: #263244; font-size: 17px; font-weight: 700; line-height: 1.25; }
.card-header-row p, .side-card > p { margin: 0; color: #718198; font-size: 12px; line-height: 1.45; }
.edit-actions { display: flex; gap: 8px; }
.icon-button { width: 42px; height: 42px; border: 1px solid #6c757d; border-radius: 8px; background: #fff; color: #6c757d; font-size: 17px; }
.icon-button:hover { background: #6c757d; color: #fff; }
.icon-button:hover >>> .v-icon { color: #fff !important; }
.primary-button, .secondary-button, .danger-button { min-height: 36px; padding: 0 14px; border-radius: 6px; font-size: 12px; font-weight: 700; }
.primary-button { border: 1px solid #6c757d; background: #6c757d; color: #fff; }
.primary-button:hover:not(:disabled) { border-color: #545b62; background: #5a6268; }
.primary-button:disabled { cursor: not-allowed; opacity: .55; }
.secondary-button { border: 1px solid #6c757d; background: #fff; color: #6c757d; }
.secondary-button:hover { border-color: #6c757d; background: #6c757d; color: #fff; }
.danger-button { border: 1px solid #dc3545; background: #fff; color: #dc3545; }
.danger-button:hover { background: #dc3545; color: #fff; }
.details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 27px 56px; margin-top: 27px; }
.detail-field { min-width: 0; }
.detail-field label, .origins-editor > label, .dns-record label { display: block; margin-bottom: 9px; color: #718096; font-size: 11px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; }
.detail-field > p { margin: 0; color: #344054; font-size: 13px; line-height: 1.45; }
.detail-field input, .detail-field textarea, .detail-field select { width: 100%; border: 1px solid #d5dde7; border-radius: 6px; background: #fff; color: #27364a; font-size: 13px; outline: none; }
.detail-field input, .detail-field select { height: 38px; padding: 0 11px; }
.detail-field textarea { padding: 10px 11px; resize: vertical; }
.detail-field input:focus, .detail-field textarea:focus, .detail-field select:focus { border-color: #2f6fec; box-shadow: 0 0 0 2px rgba(47,111,236,.12); }
.detail-field small { display: block; margin-top: 6px; color: #8793a5; font-size: 11px; }
.copy-value { display: flex; min-width: 0; align-items: center; gap: 10px; }
.copy-value code { overflow: hidden; color: #3e4b5e; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.required-marker { color: #dc3545; }
.copy-icon-button { display: inline-flex; flex: 0 0 auto; width: 30px; height: 30px; align-items: center; justify-content: center; padding: 0; border: 0; border-radius: 5px; background: transparent; color: #2563dc; font-size: 16px; }
.copy-icon-button:hover { background: #edf3ff; color: #1d4fc4; }
.copy-icon-button.bordered { border: 1px solid #d5dde7; background: #fff; }
.read-only-value { min-height: 38px; padding: 0 6px 0 10px; border: 1px solid #e1e6ed; border-radius: 6px; background: #f8fafc; }
.logo-row { display: flex; align-items: center; gap: 12px; color: #657287; font-size: 12px; }
.logo-row >>> .logo-upload-circle, .logo-row >>> .logo-preview-circle { width: 56px; height: 56px; border-radius: 9px; }
.logo-row >>> .logo-preview-circle img { border-radius: 9px; }
.domain-editor { display: grid; gap: 14px; }
.current-domain { color: #344054; font-size: 13px; }
.domain-title-row { display: flex; align-items: center; gap: 8px; }
.domain-title-row h2 { margin-bottom: 0; }
.verification-help-button { display: inline-flex; width: 24px; height: 24px; align-items: center; justify-content: center; padding: 0; border: 0; border-radius: 50%; background: transparent; color: #9a641c; }
.verification-help-button:hover { background: #fff4e5; }
.verification-help-button >>> .v-icon { color: inherit !important; }
.domain-summary { width: 100%; }
.domain-summary strong { font-size: 13px; }
.card-footer-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 22px; padding-top: 18px; border-top: 1px solid #e8edf3; }
.verification-badge, .inline-verified, .key-type { display: inline-flex; align-items: center; border-radius: 14px; font-size: 11px; font-weight: 700; }
.verification-badge { padding: 5px 10px; }
.verified, .inline-verified { background: #eaf8f0; color: #218459; }
.unverified { background: #fff4e5; color: #9a641c; }
.inline-verified { margin-left: 5px; padding: 3px 7px; }
.environment-toggle { display: inline-flex; padding: 4px; border: 1px solid #d8e0ea; border-radius: 9px; background: #edf2f7; }
.environment-toggle button { min-width: 126px; height: 37px; border: 1px solid transparent; border-radius: 6px; background: transparent; color: #64748b; font-size: 12px; font-weight: 700; }
.environment-toggle button.active { border-color: #c7d5e8; background: #fff; color: #2563dc; box-shadow: 0 1px 3px rgba(15,23,42,.08); }
.environment-toggle button:disabled { cursor: default; opacity: 1; }
.environment-help { margin: 14px 0 0; color: #7b8798; font-size: 11px; }
.pending-message { margin: 12px 0 0; color: #218459; font-size: 12px; }
.production-requirement { margin: 10px 0 0; padding: 9px 10px; border-radius: 6px; background: #fff8e8; color: #8a611d; font-size: 11px; line-height: 1.45; }
.identity-fields { display: grid; gap: 22px; margin-top: 24px; }
.key-type { margin-top: 7px; padding: 4px 8px; background: #f0f4ff; color: #315fba; }
.dns-record { display: flex; align-items: center; justify-content: space-between; gap: 15px; padding: 14px; border: 1px solid #dfe6ef; border-radius: 7px; background: #f8fafc; }
.dns-record code { color: #3e4b5e; font-size: 12px; overflow-wrap: anywhere; }
.domain-record { margin-top: 22px; }
.domain-prerequisite { margin-top: 22px; padding: 13px 14px; border: 1px solid #dfe6ef; border-radius: 7px; background: #f8fafc; color: #657287; font-size: 12px; }
.inline-guide { margin: 18px 0 0; color: #657287; line-height: 1.65; }
.origins-editor { margin-top: 22px; }
.origins-editor > p { margin: 9px 0 0; color: #7c899a; font-size: 11px; }
.side-card dl { margin: 20px 0 0; }
.side-card dl div { margin-bottom: 20px; }
.side-card dl div:last-child { margin-bottom: 0; }
.side-card dt { margin-bottom: 7px; color: #758399; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
.side-card dd { margin: 0; color: #344054; font-size: 13px; line-height: 1.45; overflow-wrap: anywhere; }
.about-note { margin-top: 24px; padding-top: 18px; border-top: 1px solid #e3e8ef; color: #8995a7; font-size: 11px; line-height: 1.45; }
.side-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.side-card-header p { margin: 0; color: #718198; font-size: 12px; line-height: 1.45; }
.side-edit-button { display: inline-flex; flex: 0 0 auto; width: 34px; height: 34px; align-items: center; justify-content: center; padding: 0; border: 1px solid #6c757d; border-radius: 7px; background: #fff; color: #6c757d; }
.side-edit-button:hover { background: #6c757d; color: #fff; }
.side-edit-button:hover >>> .v-icon { color: #fff !important; }
.side-environment-toggle { display: flex; width: 100%; margin-top: 18px; }
.side-environment-toggle button { min-width: 0; flex: 1 1 50%; padding: 0 8px; }
.side-card-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 17px; padding-top: 16px; border-top: 1px solid #e8edf3; }
.danger-card p { margin-bottom: 16px; }
.modal-error { color: #b42318; }
.verification-guide-list { padding-left: 20px; font-size: 13px; }
.modal-record { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px; border: 1px solid #dfe6ef; border-radius: 6px; background: #f8fafc; }
.modal-record code { overflow-wrap: anywhere; }
.modal-info { padding: 10px; border-radius: 5px; background: #f1f6ff; color: #52627a; font-size: 12px; }
.modal-footer-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
@media (max-width: 1100px) { .config-layout { grid-template-columns: 1fr; } .config-sidebar { grid-template-columns: 1fr 1fr; } }
@media (max-width: 650px) {
  .config-page { padding: 16px 15px 48px; }
  .app-page-header { min-height: 0; margin-bottom: 20px; }
  .app-page-title { font-size: 22px; }
  .page-header { align-items: flex-start; flex-wrap: wrap; }
  .config-tabs { gap: 16px; overflow-x: auto; }
  .details-grid, .config-sidebar { grid-template-columns: 1fr; }
  .domain-editor { grid-template-columns: 1fr; }
  .dns-record { align-items: flex-start; flex-direction: column; }
  .card-header-row { align-items: flex-start; flex-direction: column; }
}
</style>

<script>
import HfPopUp from '../components/element/hfPopup.vue';
import UtilsMixin from '../mixins/utils';
import messages from '../mixins/messages';
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex/dist/vuex.common.js';
import LogoUploader from '../components/element/LogoUploader.vue';
import CorsChipsInput from '../components/element/CorsChips.vue';
import LoadIng from '../components/element/LoadIng.vue';
import { normalizeCorsOrigin } from '../utils/utils.js';

export default {
  name: 'ServiceConfig',
  components: { HfPopUp, LogoUploader, CorsChipsInput, LoadIng },
  mixins: [UtilsMixin],
  data() {
    return {
      activeTab: 'general',
      tabs: [
        { value: 'general', label: 'General' },
        { value: 'domain', label: 'Domain Verification' },
        { value: 'issuer', label: 'Issuer Configuration' },
      ],
      isLoading: false,
      fullPage: true,
      isEditing: false,
      editingSection: null,
      isEditingDomain: false,
      domainBackup: null,
      isProd: false,
      appIdToGenerateSecret: '',
      linkedAppErrorMessage: '',
      associatedSSIServiceDIDs: [],
      issuerVerificationMethodIds: [],
      formData: { whitelistedCors: [] },
      backupData: null,
    };
  },
  computed: {
    ...mapGetters('mainStore', ['getSelectedService', 'getAppsWithSSIServices']),
    ...mapState({
      widgetConfig: state => state.mainStore.widgetConfig,
      kybWidgetConfig: state => state.mainStore.kybWidgetConfig,
    }),
    formattedErrorMessage() {
      return this.linkedAppErrorMessage.replace(/\n/g, '<br>');
    },
    currentDomain() {
      if (this.isEditingDomain && this.domainBackup) return this.domainBackup.domain;
      if (this.isEditing && this.backupData) return this.backupData.domain;
      return this.formData.domain;
    },
    displayDomainVerified() {
      if (this.isEditingDomain && this.domainBackup) return Boolean(this.domainBackup.hasDomainVerified);
      if (this.isEditing && this.backupData) return Boolean(this.backupData.hasDomainVerified);
      return Boolean(this.formData.hasDomainVerified);
    },
    txtRecord() {
      return this.formData.issuerDid ? `hypersign-domain-verification.did=${this.formData.issuerDid}` : null;
    },
    selectedVerificationMethodType() {
      if (!this.formData.issuerVerificationMethodId || !this.issuerVerificationMethodIds.length) return null;
      const method = this.issuerVerificationMethodIds.find(item => item.id === this.formData.issuerVerificationMethodId);
      return method ? method.type : null;
    },
  },
  created() {
    this.formData = { ...this.getSelectedService };
    this.isProd = this.formData.env === 'prod';
    const origins = Array.isArray(this.formData.whitelistedCors) ? this.formData.whitelistedCors : [];
    this.formData.whitelistedCors = origins
      .map(value => normalizeCorsOrigin(value))
      .filter(Boolean)
      .filter((origin, index, all) => all.indexOf(origin) === index);
    this.activeTab = this.isValidTab(this.$route.query.tab) ? this.$route.query.tab : 'general';
  },
  watch: {
    '$route.query.tab'(tab) {
      if (this.isEditing || this.isEditingDomain) return;
      this.activeTab = this.isValidTab(tab) ? tab : 'general';
    },
  },
  methods: {
    ...mapActions('mainStore', [
      'updateAnAppOnServer', 'deleteAnAppOnServer', 'fetchDIDsForAService',
      'resolveDIDForAKycService', 'updateAppsWidgetConfig', 'updateAllAppsWidgetConfigs',
      'updateAppsKybWidgetConfig', 'fetchAppsWidgetConfig', 'fetchAppsKybWidgetConfig',
    ]),
    ...mapMutations('mainStore', ['setWidgetConfig', 'setKybWidgetConfig']),
    getAssociatedSSIService() {
      const serviceId = this.formData.dependentServices?.[0];
      return serviceId ? this.getAppsWithSSIServices.find(item => item.appId === serviceId) : null;
    },
    async selectTab(tab) {
      if (!this.isValidTab(tab)) return;
      this.activeTab = tab;
      if (this.$route.query.tab !== tab) {
        await this.$router.replace({
          query: {
            ...this.$route.query,
            tab,
          },
        });
      }
      if (tab === 'issuer' && this.isEditing && this.editingSection === 'issuer') await this.prepareIdentityEditor();
    },
    isValidTab(tab) {
      return this.tabs.some(item => item.value === tab);
    },
    async prepareIdentityEditor() {
      await this.ensureWidgetConfigsLoaded();
      if (!this.associatedSSIServiceDIDs.length) await this.fetchDIDs();
      if (this.formData.issuerDid) await this.resolveDid(this.formData.issuerDid);
    },
    async fetchDIDs() {
      try {
        const service = this.getAssociatedSSIService();
        if (!service) throw new Error('No associated SSI service found');
        this.isLoading = true;
        const result = await this.fetchDIDsForAService({ tenantUrl: service.tenantUrl, accessToken: service.access_token, serviceId: service.appId });
        this.associatedSSIServiceDIDs = Array.isArray(result) ? result : [];
        if (!this.associatedSSIServiceDIDs.length) this.notifyErr('No DIDs found for the associated SSI service');
      } catch (error) {
        this.notifyErr(error.message);
      } finally {
        this.isLoading = false;
      }
    },
    async resolveDid(event) {
      try {
        const did = typeof event === 'string' ? event : event.target.value;
        if (!did) {
          this.issuerVerificationMethodIds = [];
          return;
        }
        const service = this.getAssociatedSSIService();
        if (!service) throw new Error('No associated SSI service found');
        this.isLoading = true;
        const document = await this.resolveDIDForAKycService({ tenantUrl: service.tenantUrl, accessToken: service.access_token, did, serviceId: service.appId });
        if (!document?.verificationMethod) throw new Error('DID document has no verification methods.');
        this.issuerVerificationMethodIds = document.verificationMethod.filter(Boolean);
      } catch (error) {
        this.notifyErr(error.message);
      } finally {
        this.isLoading = false;
      }
    },
    async startEdit(section) {
      if (this.isEditing) return;
      this.backupData = JSON.parse(JSON.stringify(this.formData));
      this.editingSection = section;
      this.isEditing = true;
      if (section === 'details') await this.ensureWidgetConfigsLoaded();
      if (section === 'issuer') await this.prepareIdentityEditor();
    },
    cancelEdit() {
      if (this.backupData) this.formData = JSON.parse(JSON.stringify(this.backupData));
      this.isProd = this.formData.env === 'prod';
      this.isEditing = false;
      this.editingSection = null;
      this.isEditingDomain = false;
      this.domainBackup = null;
    },
    setEnv(isProduction) {
      this.isProd = Boolean(isProduction);
      this.formData.env = this.isProd ? 'prod' : 'dev';
    },
    startDomainEdit() {
      this.domainBackup = { domain: this.formData.domain, hasDomainVerified: this.formData.hasDomainVerified };
      this.isEditingDomain = true;
    },
    cancelDomainEdit() {
      if (this.domainBackup) Object.assign(this.formData, this.domainBackup);
      this.domainBackup = null;
      this.isEditingDomain = false;
    },
    async saveDomainChange() {
      if (!this.formData.domain?.trim()) return this.notifyErr('Domain cannot be empty.');
      const previousDomain = (this.domainBackup?.domain || String()).trim();
      const domainChanged = this.formData.domain.trim() !== previousDomain;
      if (domainChanged) this.formData.hasDomainVerified = false;
      try {
        this.isLoading = true;
        await this.updateAnAppOnServer({ ...this.formData });
        this.isEditingDomain = false;
        this.domainBackup = null;
        this.notifySuccess('Domain updated. Please verify the domain to re-enable verification.');
      } catch (error) {
        if (this.domainBackup) Object.assign(this.formData, this.domainBackup);
        this.notifyErr(error.message || error);
      } finally {
        this.isLoading = false;
      }
    },
    async saveChanges() {
      if (this.editingSection === 'details' && !this.formData.appName?.trim()) {
        return this.notifyErr('Application name cannot be empty.');
      }
      if (this.editingSection === 'issuer' && !this.formData.issuerDid) {
        return this.notifyErr('Issuer DID is required.');
      }
      if (this.editingSection === 'issuer' && !this.formData.issuerVerificationMethodId) {
        return this.notifyErr('Verification Method ID is required.');
      }
      try {
        this.isLoading = true;
        const backup = this.backupData || {};
        const logoChanged = this.formData.logoUrl !== backup.logoUrl;
        const issuerChanged = this.formData.issuerDid !== backup.issuerDid;
        const methodChanged = this.formData.issuerVerificationMethodId !== backup.issuerVerificationMethodId;
        const nameChanged = this.formData.appName !== backup.appName;
        const domainChanged = this.formData.domain !== backup.domain;
        if (domainChanged) this.formData.hasDomainVerified = false;
        await this.updateAnAppOnServer({ ...this.formData });

        if (logoChanged && Object.keys(this.widgetConfig || {}).length) {
          this.setWidgetConfig({ ...this.widgetConfig, userConsent: { ...(this.widgetConfig.userConsent || {}), logoUrl: this.formData.logoUrl } });
          await this.updateAppsWidgetConfig();
        }
        const widgetUpdates = {};
        if ((issuerChanged || methodChanged) && this.formData.issuerDid) {
          widgetUpdates.issuerDID = this.formData.issuerDid;
          widgetUpdates.issuerVerificationMethodId = this.formData.issuerVerificationMethodId;
        }
        if (domainChanged) widgetUpdates.domain = this.formData.domain;
        if (Object.keys(widgetUpdates).length) await this.updateAllAppsWidgetConfigs(widgetUpdates);

        if (Object.keys(this.kybWidgetConfig || {}).length) {
          const kyb = { ...this.kybWidgetConfig };
          let updateKyb = false;
          if ((issuerChanged || methodChanged) && this.formData.issuerDid) {
            kyb.issuerDID = this.formData.issuerDid;
            kyb.issuerVerificationMethodId = this.formData.issuerVerificationMethodId || this.kybWidgetConfig.issuerVerificationMethodId;
            updateKyb = true;
          }
          if (logoChanged || nameChanged) {
            kyb.branding = {
              ...(kyb.branding || {}),
              ...(logoChanged ? { logoUrl: this.formData.logoUrl } : {}),
              ...(nameChanged ? { businessName: this.formData.appName } : {}),
            };
            updateKyb = true;
          }
          if (updateKyb) {
            this.setKybWidgetConfig(kyb);
            await this.updateAppsKybWidgetConfig();
          }
        }
        this.isEditing = false;
        this.editingSection = null;
        this.isEditingDomain = false;
        this.domainBackup = null;
        this.backupData = JSON.parse(JSON.stringify(this.formData));
        this.notifySuccess('Service configuration updated successfully!');
      } catch (error) {
        if (this.backupData) this.formData = JSON.parse(JSON.stringify(this.backupData));
        this.isProd = this.formData.env === 'prod';
        this.notifyErr(error.message || error);
      } finally {
        this.isLoading = false;
      }
    },
    async verifyDomain() {
      try {
        if (!this.formData.domain) throw new Error('Please enter a domain');
        if (!this.txtRecord) throw new Error('Please set an Issuer DID first');
        if (this.formData.domain.includes('localhost') || this.formData.domain.includes('127.0.0.1')) throw new Error('Domain cannot be localhost or 127.0.0.1');
        this.isLoading = true;
        let domainUrl = this.formData.domain.trim();
        if (!/^https?:\/\//.test(domainUrl)) domainUrl = `https://${domainUrl}`;
        const parsed = new URL(domainUrl);
        const hostname = parsed.hostname.startsWith('www.') ? parsed.hostname.substring(4) : parsed.hostname;
        const cleanDomainUrl = `${parsed.protocol}//${hostname}`;
        const DomainLinkage = (await import('@hypersign-protocol/domain-linkage-verifier')).default;
        let result;
        try {
          result = await new DomainLinkage(cleanDomainUrl).verifyDnsTxtRecord(new URL(cleanDomainUrl), this.txtRecord);
        } catch {
          throw new Error('No TXT record found for this domain. Add the TXT record and try again after DNS propagation.');
        }
        if (result?.error) throw new Error(`${result.error.message}. DNS changes may take time to propagate.`);
        if (!result?.verified) throw new Error('Domain verification failed. Check your DNS records and try again.');
        this.formData.hasDomainVerified = true;
        await this.updateAnAppOnServer({ ...this.formData });
        this.isEditingDomain = false;
        this.domainBackup = null;
        this.notifySuccess('Domain verified successfully!');
      } catch (error) {
        this.notifyErr(error.message);
      } finally {
        this.isLoading = false;
      }
    },
    openDeleteServicePopUp() {
      this.appIdToGenerateSecret = '';
      this.$root.$emit('bv::show::modal', 'entity-delete-service-confirmation-popup');
    },
    closeLinkedServiceDetailPopup() {
      this.linkedAppErrorMessage = '';
      this.$root.$emit('bv::hide::modal', 'entity-linked-service-detail-popup');
    },
    async deleteOrg() {
      if (!this.appIdToGenerateSecret) return this.notifyErr(messages.APPLICATION.ENTER_APP_ID);
      if (this.appIdToGenerateSecret !== this.formData.appId) return this.notifyErr(messages.APPLICATION.VALID_ID);
      try {
        this.$root.$emit('bv::hide::modal', 'entity-delete-service-confirmation-popup');
        this.isLoading = true;
        await this.deleteAnAppOnServer({ appId: this.formData.appId });
        await this.$router.push('/studio/onboarding');
      } catch (error) {
        const message = error?.message || error;
        if (message?.includes('This service is linked with')) {
          this.linkedAppErrorMessage = message;
          this.$root.$emit('bv::show::modal', 'entity-linked-service-detail-popup');
        } else {
          this.notifyErr(message);
        }
      } finally {
        this.isLoading = false;
      }
    },
    async ensureWidgetConfigsLoaded() {
      try {
        if (!this.widgetConfig || !Object.keys(this.widgetConfig).length) await this.fetchAppsWidgetConfig();
        if (!this.kybWidgetConfig || !Object.keys(this.kybWidgetConfig).length) await this.fetchAppsKybWidgetConfig();
      } catch (error) {
        console.warn('Widget config not found or failed to fetch:', error.message || error);
      }
    },
  },
};
</script>
