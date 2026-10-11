<template>
  <hf-pop-up :id="popupId" Header="Domain verification" size="lg" @hidden="onHidden">
    <div class="domain-verification">
      <section class="block">
        <div class="block-header">
          <div>
            <label class="block-label">Domain</label>
            <div class="domain-row">
              <strong>{{ app.domain || 'No domain configured' }}</strong>
              <span class="verification-badge" :class="app.hasDomainVerified ? 'verified' : 'unverified'">
                {{ app.hasDomainVerified ? '✓ Verified' : 'Unverified' }}
              </span>
            </div>
          </div>
          <button v-if="!isEditing" type="button" class="secondary-button" :disabled="busy" @click="startEdit">Change</button>
        </div>

        <div v-if="isEditing" class="domain-editor">
          <label class="block-label">New domain <span class="required-marker">*</span></label>
          <input v-model.trim="newDomain" type="text" placeholder="example.com" />
          <small>Changing the domain starts a new ownership check. The new domain will be unverified after it is saved.</small>
          <div class="editor-actions">
            <button type="button" class="ghost-button" :disabled="busy" @click="isEditing = false">Cancel</button>
            <button type="button" class="primary-button" :disabled="busy" @click="saveDomain">
              {{ busy ? 'Saving…' : 'Save domain' }}
            </button>
          </div>
        </div>
      </section>

      <section class="block">
        <label class="block-label">DNS record to add</label>
        <div v-if="!txtRecord" class="prerequisite">
          Configure an Issuer DID in the Issuer Configuration tab first to generate the domain verification TXT record.
        </div>
        <template v-else>
          <div class="record-table">
            <div class="record-row">
              <span class="record-key">Type</span>
              <code class="record-value">TXT</code>
            </div>
            <div class="record-row">
              <span class="record-key">Host / Name</span>
              <code class="record-value">{{ hostField }}</code>
              <button type="button" class="copy-icon-button" title="Copy host" aria-label="Copy host" @click="copyToClip(hostField, 'Host')">
                <i class="mdi mdi-content-copy"></i>
              </button>
            </div>
            <div class="record-row">
              <span class="record-key">Value</span>
              <code class="record-value">{{ txtRecord }}</code>
              <button type="button" class="copy-icon-button" title="Copy TXT value" aria-label="Copy TXT value" @click="copyToClip(txtRecord, 'TXT value')">
                <i class="mdi mdi-content-copy"></i>
              </button>
            </div>
            <div class="record-row">
              <span class="record-key">TTL</span>
              <span class="record-value plain">Default (e.g. 1 hour)</span>
            </div>
          </div>

          <div v-if="isRootDomain" class="host-warning">
            <v-icon x-small>mdi-alert-outline</v-icon>
            <span>
              Use <strong>@</strong> as the host. It means the domain itself ({{ verificationHost }}).
              Don't enter a prefix like <code>hypersign</code> or <code>_hypersign</code>: that creates a record on a subdomain
              (e.g. hypersign.{{ verificationHost }}), which we don't check.
            </span>
          </div>
          <div v-else class="host-warning">
            <v-icon x-small>mdi-alert-outline</v-icon>
            <span>
              We check TXT records on <strong>{{ verificationHost }}</strong> exactly. Most DNS providers want only the part before
              your main domain as the host, here <strong>{{ hostField }}</strong>.
            </span>
          </div>

          <ol class="guide">
            <li>Sign in where you manage your domain's DNS (e.g. GoDaddy, Namecheap, Cloudflare) and open the DNS settings for <strong>{{ verificationHost }}</strong>.</li>
            <li>
              Add a <strong>new</strong> TXT record with the host and value above. Paste the value exactly, without extra quotes or spaces.
              Keep any existing TXT records (such as SPF); a domain can have several.
            </li>
            <li>
              Save the record. It usually becomes visible within 5–30 minutes, but some providers take up to 48 hours.
            </li>
            <li>
              Come back here and click <strong>Verify domain</strong>. Verification runs only when you click it; it doesn't happen automatically.
            </li>
          </ol>

          <p class="troubleshoot">
            Verification failing? <a :href="dnsCheckUrl" target="_blank" rel="noopener">See what public DNS currently returns for {{ verificationHost }}</a>.
            If our value isn't listed there yet, the record hasn't propagated or was added under a different host.
          </p>
        </template>
      </section>

      <footer class="popup-footer">
        <button type="button" class="ghost-button" :disabled="busy" @click="close">Close</button>
        <button
          v-if="!app.hasDomainVerified"
          type="button"
          class="primary-button"
          :disabled="busy || isEditing || !txtRecord || !app.domain"
          @click="verifyDomain"
        >
          {{ busy ? 'Verifying…' : 'Verify domain' }}
        </button>
      </footer>
    </div>
  </hf-pop-up>
</template>

<script>
import HfPopUp from '../element/hfPopup.vue';
import UtilsMixin from '../../mixins/utils';

export default {
  name: 'DomainVerificationPopup',
  components: { HfPopUp },
  mixins: [UtilsMixin],
  props: {
    value: { type: Boolean, default: false },
    // The app (service) whose domain is verified; changes are saved on it directly
    app: { type: Object, required: true },
  },
  data() {
    return {
      popupId: 'domain-verification-popup',
      isEditing: false,
      newDomain: '',
      busy: false,
    };
  },
  computed: {
    txtRecord() {
      return this.app.issuerDid ? `hypersign-domain-verification.did=${this.app.issuerDid}` : null;
    },
    // The exact DNS name the verifier queries: the domain's hostname without "www."
    verificationHost() {
      const domain = (this.app.domain || '').trim();
      if (!domain) return '';
      try {
        const { hostname } = new URL(/^https?:\/\//.test(domain) ? domain : `https://${domain}`);
        return hostname.startsWith('www.') ? hostname.substring(4) : hostname;
      } catch {
        return domain;
      }
    },
    // Two labels (example.com) is treated as the root domain. Multi-part suffixes like
    // example.co.uk count as a subdomain here, so the hint for those shows the full prefix.
    isRootDomain() {
      return this.verificationHost.split('.').length <= 2;
    },
    hostField() {
      if (this.isRootDomain) return '@';
      return this.verificationHost.split('.').slice(0, -2).join('.');
    },
    dnsCheckUrl() {
      return `https://dns.google/resolve?name=${encodeURIComponent(this.verificationHost)}&type=TXT`;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(open) {
        if (open) this.isEditing = false;
        this.$nextTick(() => {
          this.$root.$emit(open ? 'bv::show::modal' : 'bv::hide::modal', this.popupId);
        });
      },
    },
  },
  methods: {
    startEdit() {
      this.newDomain = this.app.domain || '';
      this.isEditing = true;
    },
    async saveApp(changes) {
      const updated = await this.$store.dispatch('mainStore/updateAnAppOnServer', { ...this.app, ...changes });
      this.$emit('updated', { ...this.app, ...changes, ...(updated || {}) });
    },
    async saveDomain() {
      if (!this.newDomain) return this.notifyErr('Domain cannot be empty.');
      if (this.newDomain === (this.app.domain || '').trim()) {
        this.isEditing = false;
        return;
      }
      this.busy = true;
      try {
        await this.saveApp({ domain: this.newDomain, hasDomainVerified: false });
        this.isEditing = false;
        this.notifySuccess('Domain updated. Please verify the new domain.');
      } catch (error) {
        this.notifyErr(error.message || error);
      } finally {
        this.busy = false;
      }
    },
    async verifyDomain() {
      this.busy = true;
      try {
        const domain = (this.app.domain || '').trim();
        if (!domain) throw new Error('Please enter a domain');
        if (!this.txtRecord) throw new Error('Please set an Issuer DID first');
        if (domain.includes('localhost') || domain.includes('127.0.0.1')) throw new Error('Domain cannot be localhost or 127.0.0.1');
        const cleanDomainUrl = `https://${this.verificationHost}`;
        const DomainLinkage = (await import('@hypersign-protocol/domain-linkage-verifier')).default;
        let result;
        try {
          result = await new DomainLinkage(cleanDomainUrl).verifyDnsTxtRecord(new URL(cleanDomainUrl), this.txtRecord);
        } catch {
          throw new Error(`No TXT records found on ${this.verificationHost}. Check the host is "${this.hostField}" and try again after DNS propagation.`);
        }
        if (result?.error) throw new Error(`Our TXT value wasn't found on ${this.verificationHost}. Check the host is "${this.hostField}" and the value is pasted exactly. DNS changes may take time to propagate.`);
        if (!result?.verified) throw new Error('Domain verification failed. Check your DNS records and try again.');
        await this.saveApp({ hasDomainVerified: true });
        this.notifySuccess('Domain verified successfully!');
        this.close();
      } catch (error) {
        this.notifyErr(error.message);
      } finally {
        this.busy = false;
      }
    },
    copyToClip(text, label) {
      navigator.clipboard.writeText(text)
        .then(() => this.notifySuccess(`${label} copied!`))
        .catch(() => this.notifyErr('Error while copying'));
    },
    onHidden() {
      this.isEditing = false;
      this.$emit('input', false);
    },
    close() {
      this.$emit('input', false);
    },
  },
};
</script>

<style scoped>
.domain-verification { color: #273448; }

.block { padding: 18px 0; border-bottom: 1px solid #e8edf3; }
.block:first-child { padding-top: 4px; }

.block-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }

.block-label {
  display: block;
  margin-bottom: 8px;
  color: #718096;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .09em;
  text-transform: uppercase;
}

.domain-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.domain-row strong { color: #344054; font-size: 14px; }

.verification-badge { display: inline-flex; padding: 4px 9px; border-radius: 14px; font-size: 11px; font-weight: 700; }
.verified { background: #eaf8f0; color: #218459; }
.unverified { background: #fff4e5; color: #9a641c; }

.domain-editor { margin-top: 16px; }
.domain-editor input {
  width: 100%;
  height: 38px;
  padding: 0 11px;
  border: 1px solid #d5dde7;
  border-radius: 6px;
  color: #27364a;
  font-size: 13px;
  outline: none;
}

.domain-editor input:focus { border-color: #2f6fec; box-shadow: 0 0 0 2px rgba(47,111,236,.12); }
.domain-editor small { display: block; margin-top: 6px; color: #8793a5; font-size: 11px; }
.required-marker { color: #dc3545; }
.editor-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }

.record-table { border: 1px solid #dfe6ef; border-radius: 7px; background: #f8fafc; }

.record-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 6px 12px 6px 14px;
  border-bottom: 1px solid #e8edf3;
}

.record-row:last-child { border-bottom: 0; }
.record-key { flex: 0 0 100px; color: #718096; font-size: 12px; font-weight: 600; }
.record-value { flex: 1; min-width: 0; color: #3e4b5e; font-size: 12px; overflow-wrap: anywhere; }
.record-value.plain { color: #657287; }

.host-warning {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 12px;
  border: 1px solid #f3e1bd;
  border-radius: 6px;
  background: #fff8e8;
  color: #8a611d;
  font-size: 12px;
  line-height: 1.5;
}

.host-warning > .v-icon { margin-top: 2px; color: #c08a2e !important; }
.host-warning code { padding: 0 4px; border-radius: 3px; background: #fdf0d2; color: #8a611d; font-size: 11px; }

.troubleshoot { margin: 12px 0 0; color: #8793a5; font-size: 12px; line-height: 1.5; }
.troubleshoot a { color: #2563dc; }

.copy-icon-button {
  display: inline-flex;
  flex: 0 0 auto;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border: 1px solid #d5dde7;
  border-radius: 5px;
  background: #fff;
  color: #2563dc;
  font-size: 16px;
}

.copy-icon-button:hover { background: #edf3ff; }

.prerequisite {
  padding: 12px 14px;
  border: 1px solid #dfe6ef;
  border-radius: 7px;
  background: #f8fafc;
  color: #657287;
  font-size: 12px;
}

.guide { margin: 14px 0 0; padding-left: 20px; color: #657287; font-size: 13px; line-height: 1.65; }

.popup-footer { display: flex; justify-content: flex-end; gap: 8px; padding-top: 16px; }

.primary-button, .secondary-button, .ghost-button {
  min-height: 36px;
  padding: 0 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}

.primary-button { border: 1px solid #6c757d; background: #6c757d; color: #fff; }
.primary-button:hover:not(:disabled) { border-color: #545b62; background: #5a6268; }
.primary-button:disabled, .secondary-button:disabled { cursor: not-allowed; opacity: .55; }
.secondary-button { border: 1px solid #6c757d; background: #fff; color: #6c757d; }
.secondary-button:hover:not(:disabled) { background: #6c757d; color: #fff; }
.ghost-button { border: 1px solid transparent; background: transparent; color: #6c757d; }
.ghost-button:hover:not(:disabled) { background: #f1f5f9; }
</style>
