<template>
  <!-- The company details printed on invoices (contract §2). Used in Settings, from the top-up popup,
       and by super admins (admin mode) to complete a customer's details before invoicing. -->
  <div class="billing-details" :class="{ embedded }">
    <header v-if="!embedded" class="billing-header">
      <div>
        <h2>Billing details</h2>
        <p>Printed on your invoices. Invoices and payment links are sent to the billing email.</p>
      </div>
      <span v-if="profile" class="status-pill" :class="profile.complete ? 'is-success' : 'is-muted'">
        <v-icon x-small>{{ profile.complete ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' }}</v-icon>
        {{ profile.complete ? 'Complete' : 'Needs confirmation' }}
      </span>
    </header>

    <p v-if="!canRead" class="notice notice-muted">You don't have permission to view billing details. Ask your account owner for access.</p>

    <p v-else-if="loading" class="muted-note">Loading billing details…</p>

    <empty-container
      v-else-if="notOnboarded"
      icon="mdi mdi-domain"
      title="No organization yet"
      description="Complete onboarding to add billing details."
    >
      <button type="button" class="primary-button" @click="$router.push('/studio/onboarding')">Start onboarding</button>
    </empty-container>

    <div v-else-if="loadError" class="notice notice-error" role="alert">
      <v-icon small>mdi-alert-circle-outline</v-icon>
      <div>
        <p>{{ loadError }}</p>
        <button type="button" class="link-button" @click="load">Try again</button>
      </div>
    </div>

    <template v-else-if="profile">
      <!-- Saved: read-only summary with Edit -->
      <div v-if="!editing" class="billing-summary">
        <dl>
          <div><dt>Legal name</dt><dd>{{ profile.legalName }}</dd></div>
          <div><dt>Billing email</dt><dd>{{ profile.email }}</dd></div>
          <div><dt>Phone</dt><dd>{{ profile.phone || '—' }}</dd></div>
          <div><dt>Address</dt><dd>{{ addressText }}</dd></div>
          <div v-if="isIndia"><dt>GST state</dt><dd>{{ stateText }}</dd></div>
          <div>
            <dt>Tax IDs</dt>
            <dd>
              <span v-if="!profile.taxIds.length && !profile.personalTaxId">None</span>
              <span v-for="taxId in profile.taxIds" :key="taxId.type + taxId.number" class="tax-id">{{ taxId.type }} {{ taxId.number }}</span>
              <span v-if="profile.personalTaxId" class="tax-id">{{ personalTaxIdText }}</span>
            </dd>
          </div>
          <div><dt>Billing region</dt><dd>{{ regionText }}</dd></div>
        </dl>
        <button v-if="canWrite" type="button" class="secondary-button" @click="startEdit">Edit</button>
      </div>

      <form v-else class="billing-form" novalidate @submit.prevent="save">
        <div v-if="profile.source === 'PREFILLED'" class="notice notice-info">
          <v-icon small>mdi-information-outline</v-icon>
          <p v-if="admin">The customer hasn't confirmed these details. They're prefilled from onboarding and company verification.</p>
          <p v-else>Please confirm your billing details. We've filled in what we know from onboarding and company verification.</p>
        </div>
        <div v-if="saveError" class="notice notice-error" role="alert">
          <v-icon small>mdi-alert-circle-outline</v-icon>
          <p>{{ saveError }}</p>
        </div>

        <div class="field-grid">
          <label class="field full" :class="fieldClass('legalName')">
            <span>Legal name</span>
            <input v-model.trim="form.legalName" type="text" maxlength="200" autocomplete="organization" :disabled="!canWrite" />
            <small v-if="errorFor('legalName')" class="field-error">{{ errorFor('legalName') }}</small>
          </label>

          <label class="field full" :class="fieldClass('email')">
            <span>Billing email</span>
            <input v-model.trim="form.email" type="email" autocomplete="email" :disabled="!canWrite" />
            <small v-if="errorFor('email')" class="field-error">{{ errorFor('email') }}</small>
            <small v-else class="field-help">Invoices are sent to this address.</small>
          </label>

          <!-- A div, not a label: the dialling-code chip is a control of its own -->
          <div class="field full" :class="fieldClass('phone')">
            <span>Phone</span>
            <PhoneInput
              v-model="form.phone"
              :dial.sync="form.phoneDial"
              :invalid="Boolean(errorFor('phone'))"
              :disabled="!canWrite"
              @blur="checkPhone"
            />
            <small v-if="errorFor('phone')" class="field-error">{{ errorFor('phone') }}</small>
            <small v-else-if="phoneIsSuggestion" class="field-help">From your onboarding details. Check it, then save to keep it.</small>
            <small v-else class="field-help">Needed to pay online from outside India.</small>
          </div>

          <label class="field full" :class="fieldClass('address.street')">
            <span>Street address</span>
            <input v-model.trim="form.address.street" type="text" maxlength="300" autocomplete="street-address" :disabled="!canWrite" />
            <small v-if="errorFor('address.street')" class="field-error">{{ errorFor('address.street') }}</small>
          </label>

          <label class="field" :class="fieldClass('address.city')">
            <span>City</span>
            <input v-model.trim="form.address.city" type="text" maxlength="100" autocomplete="address-level2" :disabled="!canWrite" />
            <small v-if="errorFor('address.city')" class="field-error">{{ errorFor('address.city') }}</small>
          </label>

          <label class="field" :class="fieldClass('address.province')">
            <span>State / province</span>
            <input v-model.trim="form.address.province" type="text" maxlength="100" autocomplete="address-level1" :disabled="!canWrite" />
            <small v-if="errorFor('address.province')" class="field-error">{{ errorFor('address.province') }}</small>
          </label>

          <label class="field" :class="fieldClass('address.postalCode')">
            <span>Postal code</span>
            <input v-model.trim="form.address.postalCode" type="text" maxlength="20" autocomplete="postal-code" :disabled="!canWrite" />
            <small v-if="errorFor('address.postalCode')" class="field-error">{{ errorFor('address.postalCode') }}</small>
          </label>

          <label class="field" :class="fieldClass('address.country')">
            <span>Country</span>
            <select v-model="form.address.country" @change="onCountryChange" :disabled="!canWrite">
              <option value="" disabled>Select a country</option>
              <option v-for="country in countryOptions" :key="country.value" :value="country.value">{{ country.label }}</option>
            </select>
            <small v-if="errorFor('address.country')" class="field-error">{{ errorFor('address.country') }}</small>
          </label>
        </div>

        <section class="tax-section">
          <div class="tax-heading">
            <h3>Tax IDs</h3>
            <span v-if="profile.locked" class="locked-note">
              <v-icon x-small>mdi-lock-outline</v-icon> {{ admin ? 'Locked by the first invoice' : 'Contact support to change' }}
            </span>
          </div>

          <!-- A personal tax ID from company verification: only its last 4 characters are stored,
               so it is shown masked and can't be edited here -->
          <p v-if="profile.personalTaxId" class="personal-tax-id">
            <span class="tax-id">{{ personalTaxIdText }}</span>
            <small class="field-help">From company verification. Only the last 4 characters are kept.</small>
          </p>

          <p v-if="!taxIdTypes.length && !form.taxIds.length && !profile.personalTaxId" class="field-help">No tax ID is needed for this country.</p>

          <div v-for="(taxId, index) in form.taxIds" :key="index" class="tax-row" :class="{ invalid: errorFor(`taxIds[${index}].number`) }">
            <select v-model="taxId.type" :disabled="taxIdsReadOnly" aria-label="Tax ID type">
              <option v-for="type in taxIdTypesFor(taxId)" :key="type.code" :value="type.code">{{ type.code }} · {{ type.label }}</option>
            </select>
            <input
              :value="taxId.number"
              type="text"
              maxlength="50"
              aria-label="Tax ID number"
              :placeholder="taxId.type === 'GSTIN' ? '29ABCDE1234F1Z5' : 'Number'"
              :disabled="taxIdsReadOnly"
              @input="setTaxIdNumber(taxId, $event.target.value)"
            />
            <button v-if="!taxIdsReadOnly" type="button" class="icon-button" aria-label="Remove tax ID" @click="form.taxIds.splice(index, 1)">
              <v-icon small>mdi-close</v-icon>
            </button>
            <small v-if="errorFor(`taxIds[${index}].number`)" class="field-error">{{ errorFor(`taxIds[${index}].number`) }}</small>
          </div>

          <button
            v-if="!taxIdsReadOnly && taxIdTypes.length && form.taxIds.length < 5"
            type="button"
            class="link-button"
            @click="addTaxId"
          >
            <v-icon x-small>mdi-plus</v-icon> Add tax ID
          </button>
          <p><small v-if="errorFor('taxIds')" class="field-error">{{errorFor('taxIds')}}</small></p>
          
        </section>

        <!-- India without a GSTIN: the customer picks the state; with one, the server reads it from the GSTIN -->
        <label v-if="needsStateSelect" class="field state-field" :class="fieldClass('gstStateCode')">
          <span>GST state</span>
          <select v-model="form.gstStateCode" :disabled="!canWrite">
            <option value="" disabled>Select a state</option>
            <option v-for="state in gstStates" :key="state.code" :value="state.code">{{ state.label }} ({{ state.code }})</option>
          </select>
          <small v-if="errorFor('gstStateCode')" class="field-error">{{ errorFor('gstStateCode') }}</small>
          <small v-else class="field-help">Decides whether CGST + SGST or IGST applies.</small>
        </label>
        <p v-else-if="isIndia && gstinState" class="field-help">GST state: {{ gstinState }}, from {{ admin ? 'the' : 'your' }} GSTIN.</p>

        <!-- Super admin only: region, unlocking the tax details, and the audit reason -->
        <section v-if="admin" class="admin-section">
          <label class="field region-field">
            <span>Billing region</span>
            <select v-model="form.region">
              <option value="IN">India · INR</option>
              <option value="GLOBAL">Global · USD</option>
            </select>
            <small class="field-help">Follows the country. Change it only to override.</small>
          </label>
          <label v-if="profile.locked" class="check-field">
            <input v-model="form.unlock" type="checkbox" />
            <span>Unlock tax details</span>
          </label>
          <label class="field full" :class="fieldClass('reason')">
            <span>Reason</span>
            <input v-model.trim="form.reason" type="text" maxlength="300" placeholder="e.g. Details confirmed with the customer by email" />
            <small v-if="errorFor('reason')" class="field-error">{{ errorFor('reason') }}</small>
            <small v-else class="field-help">Recorded in the audit log with your name.</small>
          </label>
        </section>
        <!-- The billing country decides the region and currency (contract §2) -->
        <div v-else-if="regionChanges" class="notice notice-info region-notice">
          <v-icon small>mdi-swap-horizontal</v-icon>
          <p>
            Saving moves your billing region from {{ regionLabel(profile.region) }} to {{ regionLabel(formRegion) }}.
            New orders will be priced and taxed in {{ formRegion === 'IN' ? 'INR, with GST' : 'USD' }}.
          </p>
        </div>
        <p v-else class="field-help">{{ regionHelp }}</p>

        <div v-if="canWrite" class="form-actions">
          <button type="submit" class="primary-button" :disabled="saving">{{ saving ? 'Saving…' : 'Save billing details' }}</button>
          <button v-if="admin" type="button" class="secondary-button" :disabled="saving" @click="$emit('cancel')">Cancel</button>
          <button v-else-if="profile.source === 'SAVED'" type="button" class="secondary-button" :disabled="saving" @click="cancelEdit">Cancel</button>
        </div>
        <p v-else class="field-help">You can view these details but not change them.</p>
      </form>
    </template>
  </div>
</template>

<script>
import isoCountries from 'i18n-iso-countries';
import UtilsMixin from '../../mixins/utils';
import { getBillingProfile, saveBillingProfile, updateAdminBillingProfile } from '../../utils/billingApi';
import { COUNTRY_OPTIONS, countryOptionLabel } from '../../utils/countries';
import { TAX_ID_TYPES } from '../../utils/kybIdentifierTypes';
import { GST_STATES, gstStateLabel } from '../../utils/gstStates';
import { invalidatePromotions } from '../credit/promotion/promotionState';
import PhoneInput from '../element/PhoneInput.vue';
import { phoneFieldProblem, toInternationalPhone, splitInternational, phoneFromOnboarding } from '../../utils/phone';
import { toAcceptedCountryCode } from '../../utils/countries';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIA_TAX_ID_TYPES = ['GSTIN', 'PAN'];
const OTHER_TAX_ID = 'OTHER';

// Same rule as the server: India is IN, every other country is GLOBAL
const regionForCountry = country => (country === 'IN' ? 'IN' : 'GLOBAL');

const emptyForm = () => ({
  legalName: '',
  email: '',
  // What was typed, and the alpha-2 country of its dialling-code chip
  phone: '',
  phoneDial: '',
  address: { street: '', city: '', province: '', postalCode: '', country: '' },
  gstStateCode: '',
  taxIds: [],
  // Admin mode only
  region: '',
  unlock: false,
  reason: ''
});

// Alpha-2 countries for the select; the onboarding list is keyed by alpha-3
const COUNTRIES = Object.entries(COUNTRY_OPTIONS)
  .map(([alpha3, name]) => ({
    value: alpha3 === 'XXX' ? 'XX' : isoCountries.alpha3ToAlpha2(alpha3),
    label: countryOptionLabel(alpha3, name)
  }))
  .filter(country => country.value);

// A number is valid when any pattern registered for its type matches, as on the server
function taxIdNumberProblem({ type, number }) {
  if (!number) return 'Enter the number';
  const patterns = TAX_ID_TYPES.filter(t => t.code === type && t.regex).map(t => t.regex);
  if (patterns.length && !patterns.some(re => re.test(number))) return `Not a valid ${type}`;
  return '';
}

export default {
  name: 'BillingDetails',
  components: { PhoneInput },
  mixins: [UtilsMixin],
  props: {
    // Inside the top-up popup or a dialog: no section header
    embedded: { type: Boolean, default: false },
    // Super admin editing another organisation's profile (PATCH /admin/billing/profiles/:orgId)
    admin: { type: Boolean, default: false },
    // Admin mode: the profile from GET /admin/billing/profiles, and its organisation
    adminProfile: { type: Object, default: null },
    orgId: { type: String, default: '' }
  },
  data() {
    return {
      loading: false,
      loadError: '',
      notOnboarded: false,
      profile: null,
      editing: false,
      form: emptyForm(),
      // Field path → message, from the client check or the server's details.fields
      fieldErrors: {},
      // Field path → its value when the error was set; editing the field clears the error
      errorValues: {},
      // The country the dialling code last followed
      lastCountry: '',
      // Onboarding's phone, in international form, offered when no billing phone is saved
      suggestedPhone: '',
      saveError: '',
      saving: false,
      gstStates: GST_STATES,
      countryOptions: COUNTRIES
    };
  },
  computed: {
    // Super admin routes are checked by the server's super-admin guard instead
    canRead() {
      return this.admin || this.$store.getters['mainStore/hasAccess']('DASHBOARD', 'READ_BILLING');
    },
    // The phone shown is the onboarding suggestion, not yet saved
    phoneIsSuggestion() {
      if (!this.profile || this.profile.phone || !this.suggestedPhone) return false;
      return toInternationalPhone(this.form.phone, this.form.phoneDial) === this.suggestedPhone;
    },
    canWrite() {
      return this.admin || this.$store.getters['mainStore/hasAccess']('DASHBOARD', 'WRITE_BILLING');
    },
    // The region a save would store: from the country, or a super admin's choice
    formRegion() {
      if (this.admin) return this.form.region;
      return regionForCountry(this.form.address.country);
    },
    // The customer picked a country in another region (allowed until the first invoice)
    regionChanges() {
      return Boolean(!this.admin && this.profile && this.form.address.country && this.formRegion !== this.profile.region);
    },
    regionHelp() {
      if (this.profile && this.profile.locked) {
        return `Billing region: ${this.regionLabel(this.profile.region)}. It's fixed by your first invoice. Contact support to move to a country in another region.`;
      }
      if (!this.form.address.country) return 'Your billing region and currency follow the country you select.';
      return `Billing region: ${this.regionLabel(this.formRegion)}, from the country above.`;
    },
    isIndia() {
      if (this.admin) return this.form.address.country === 'IN';
      return Boolean(this.profile && this.form.address.country === 'IN');
    },
    // Unlike the customer, a super admin may change tax IDs on a locked profile
    taxIdsReadOnly() {
      if (this.admin) return false;
      return !this.canWrite || Boolean(this.profile && this.profile.locked);
    },
    // India: GSTIN and PAN. Elsewhere: the types for the address country, plus Other.
    taxIdTypes() {
      if (this.isIndia) return TAX_ID_TYPES.filter(t => t.country === 'IN' && INDIA_TAX_ID_TYPES.includes(t.code));
      const country = this.form.address.country;
      const forCountry = TAX_ID_TYPES.filter(t => t.country === country && t.code !== OTHER_TAX_ID);
      const other = TAX_ID_TYPES.find(t => t.code === OTHER_TAX_ID);
      return country ? [...forCountry, ...(other ? [other] : [])] : [];
    },
    gstin() {
      const row = this.form.taxIds.find(t => t.type === 'GSTIN' && t.number);
      return row ? row.number : '';
    },
    gstinState() {
      return this.gstin ? gstStateLabel(this.gstin.slice(0, 2)) : '';
    },
    needsStateSelect() {
      return this.isIndia && !this.gstin;
    },
    addressText() {
      const a = this.profile.address || {};
      return [a.street, a.city, a.province, a.postalCode, a.country].filter(Boolean).join(', ') || '—';
    },
    // The server sends it masked already: { type: 'PAN', number: 'XXXXXX234F' }
    personalTaxIdText() {
      const personal = this.profile && this.profile.personalTaxId;
      if (!personal) return '';
      return `${personal.type === 'OTHER' ? 'Tax ID' : personal.type} ${personal.number} (personal)`;
    },
    stateText() {
      return this.profile.gstStateCode ? gstStateLabel(this.profile.gstStateCode) : '—';
    },
    regionText() {
      if (!this.profile) return '';
      return `${this.profile.region === 'IN' ? 'India' : 'Global'} · ${this.profile.currency}`;
    }
  },
  watch: {
    adminProfile(profile) {
      if (this.admin && profile) this.setProfile(profile);
    },

    form: {
      deep: true,
      handler() {
        const remaining = {};
        Object.keys(this.fieldErrors).forEach(path => {
          if (this.valueAt(path) === this.errorValues[path]) remaining[path] = this.fieldErrors[path];
        });
        if (Object.keys(remaining).length !== Object.keys(this.fieldErrors).length) this.fieldErrors = remaining;
      }
    }
  },
  mounted() {
    if (this.admin) {
      if (this.adminProfile) this.setProfile(this.adminProfile);
    } else {
      this.load();
    }
  },
  methods: {
    async load() {
      if (!this.canRead) return;
      this.loading = true;
      this.loadError = '';
      this.notOnboarded = false;
      try {
        const profile = await getBillingProfile();
        // The server doesn't prefill the phone: suggest the onboarding one for the customer to confirm
        if (!profile.phone) this.suggestedPhone = await this.onboardingPhone();
        this.setProfile(profile);
      } catch (error) {
        if (error.code === 'ONBOARDING_NOT_FOUND') this.notOnboarded = true;
        else if (error.status === 403) this.loadError = 'You don\'t have permission to view billing details.';
        else this.loadError = 'We couldn\'t load your billing details.';
      } finally {
        this.loading = false;
      }
    },
    // Prefilled details open as a form to confirm; saved ones as a summary with Edit
    setProfile(profile) {
      this.profile = profile;
      this.editing = this.admin || profile.source !== 'SAVED';
      this.resetForm();
      // Highlight what the server says is missing until the customer fills it
      // (a phone filled in from onboarding isn't missing: its hint asks the customer to confirm it)
      const missing = (profile.missingFields || []).filter(path => path !== 'phone' || !this.form.phone);
      this.setErrors(Object.fromEntries(missing.map(path => [path, 'Required'])));
    },
    resetForm() {
      const p = this.profile;
      const address = p.address || {};
      const country = address.country || (p.region === 'IN' ? 'IN' : '');
      // A saved "+493012345678" opens as the +49 chip and "30 12345678"
      const phone = splitInternational(p.phone || this.suggestedPhone);
      this.lastCountry = country;
      this.form = {
        legalName: p.legalName || '',
        email: p.email || '',
        phone: phone ? phone.phone : (p.phone || ''),
        // Only stored when the customer saves the form
        phoneDial: phone ? phone.dialCountry : (country === 'XX' ? '' : country),
        address: {
          street: address.street || '',
          city: address.city || '',
          province: address.province || '',
          postalCode: address.postalCode || '',
          country: address.country || (p.region === 'IN' ? 'IN' : '')
        },
        gstStateCode: p.gstStateCode || '',
        taxIds: (p.taxIds || []).map(({ type, number }) => ({ type, number })),
        region: p.region || 'GLOBAL',
        unlock: false,
        reason: ''
      };
      this.saveError = '';
    },
    startEdit() {
      this.resetForm();
      this.setErrors({});
      this.editing = true;
    },
    cancelEdit() {
      this.resetForm();
      this.setErrors({});
      this.editing = false;
    },
    regionLabel(region) {
      return region === 'IN' ? 'India · INR' : 'Global · USD';
    },
    // A row keeps its saved type even if the country no longer lists it
    taxIdTypesFor(taxId) {
      if (this.taxIdTypes.some(t => t.code === taxId.type)) return this.taxIdTypes;
      return [{ code: taxId.type, label: 'Saved type' }, ...this.taxIdTypes];
    },
    addTaxId() {
      const used = this.form.taxIds.map(t => t.type);
      const next = this.taxIdTypes.find(t => !used.includes(t.code)) || this.taxIdTypes[0];
      this.form.taxIds.push({ type: next.code, number: '' });
    },
    // Tax IDs are stored in upper case without spaces
    setTaxIdNumber(taxId, value) {
      taxId.number = String(value || '').replace(/\s+/g, '').toUpperCase();
    },
    setErrors(errors) {
      this.fieldErrors = errors;
      this.errorValues = Object.fromEntries(Object.keys(errors).map(path => [path, this.valueAt(path)]));
    },
    // 'address.city', 'taxIds[0].number' → the form value at that path
    valueAt(path) {
      return path.replace(/\[(\d+)\]/g, '.$1').split('.')
        .reduce((value, key) => (value == null ? undefined : value[key]), this.form);
    },
    // Onboarding's phone as +493012345678, or '' (none, it doesn't parse, or it can't be loaded)
    async onboardingPhone() {
      try {
        const onboarding = await this.$store.dispatch('mainStore/checkIfAlreadyExistOnBoarding');
        if (!onboarding || !onboarding.phoneNumber) return '';
        return phoneFromOnboarding(onboarding.phoneNumber, toAcceptedCountryCode(onboarding.country));
      } catch (e) {
        return '';
      }
    },
    // The user picked another country: the dialling code follows it unless they chose one
    // themselves, and the typed digits are checked again
    onCountryChange() {
      const country = this.form.address.country;
      // A super admin's region follows the country too, and can then be overridden
      if (this.admin) this.form.region = regionForCountry(country);
      if (!this.form.phoneDial || this.form.phoneDial === this.lastCountry) this.form.phoneDial = country === 'XX' ? '' : country;
      this.lastCountry = country;
      if (this.form.phone) this.checkPhone();
    },
    // On blur: show a phone problem straight away (the other fields are checked on save)
    checkPhone() {
      const problem = phoneFieldProblem(this.form.phone, this.form.phoneDial);
      const errors = { ...this.fieldErrors };
      if (problem) errors.phone = problem;
      else delete errors.phone;
      this.setErrors(errors);
    },
    errorFor(path) {
      return this.fieldErrors[path] || '';
    },
    fieldClass(path) {
      return { invalid: Boolean(this.fieldErrors[path]) };
    },
    validate() {
      const errors = {};
      const f = this.form;
      if (!f.legalName) errors.legalName = 'Enter the legal name';
      if (!f.email) errors.email = 'Enter the billing email';
      else if (!EMAIL_PATTERN.test(f.email)) errors.email = 'Enter a valid email address';
      const phoneProblem = phoneFieldProblem(f.phone, f.phoneDial);
      if (phoneProblem) errors.phone = phoneProblem;
      ['street', 'city', 'province', 'postalCode'].forEach(field => {
        if (!f.address[field]) errors[`address.${field}`] = 'Required';
      });
      if (!f.address.country) errors['address.country'] = 'Select a country';
      // A business not registered for tax has its personal tax ID instead
      if (this.isIndia && f.taxIds.length == 0 && !(this.profile && this.profile.personalTaxId)) errors['taxIds']= 'Enter tax ID'
      // A locked profile keeps its region: only a country in the same region is accepted
      if (!this.admin && this.profile && this.profile.locked && f.address.country && this.regionChanges) {
        errors['address.country'] = 'This country is in another billing region, which is fixed by your first invoice. Contact support to change it.';
      }
      f.taxIds.forEach((taxId, index) => {
        const problem = taxIdNumberProblem(taxId) ||
          (taxId.type === 'GSTIN' && f.address.country && this.formRegion !== 'IN'
            ? 'A GSTIN can only be used with a billing address in India'
            : '');
        if (problem) errors[`taxIds[${index}].number`] = problem;
      });
      if (this.needsStateSelect && !f.gstStateCode) errors.gstStateCode = 'Select your state, or add a GSTIN';
      if (this.admin && !f.reason) errors.reason = 'Enter the reason for this change';
      return errors;
    },
    // The PUT body of contract §2. Region and currency are never sent.
    body() {
      const f = this.form;
      const body = {
        legalName: f.legalName,
        email: f.email,
        // Always sent: a save without it would remove the saved phone (full save, contract §2)
        phone: toInternationalPhone(f.phone, f.phoneDial),
        address: { ...f.address },
        taxIds: f.taxIds.map(({ type, number }) => ({ type, number }))
      };
      if (this.needsStateSelect) body.gstStateCode = f.gstStateCode;
      if (this.admin) {
        body.region = f.region;
        if (f.unlock) body.unlock = true;
        body.reason = f.reason;
      }
      return body;
    },
    async save() {
      if (this.saving || !this.canWrite) return;
      this.saveError = '';
      this.setErrors(this.validate());
      if (Object.keys(this.fieldErrors).length) return;
      this.saving = true;
      try {
        const profile = this.admin
          ? await updateAdminBillingProfile(this.orgId, this.body())
          : await saveBillingProfile(this.body());
        this.setProfile(profile);
        // A complete profile can make the free credits claimable
        if (!this.admin) invalidatePromotions();
        this.$emit('saved', profile);
        this.notifySuccess(this.admin ? 'Customer billing details updated' : 'Billing details saved');
      } catch (error) {
        if (error.code === 'VALIDATION_FAILED' && error.details && error.details.fields) {
          this.setErrors({ ...error.details.fields });
          this.saveError = 'Please fix the highlighted fields.';
        } else if (error.code === 'BILLING_PROFILE_LOCKED') {
          this.saveError = error.message;
        } else if (error.code === 'REGION_CHANGE_BLOCKED') {
          // An open order was priced in the old region: finish or cancel it first
          const orders = (error.details && error.details.orders) || [];
          this.saveError = orders.length ? `${error.message} Open: ${orders.join(', ')}.` : error.message;
        } else if (error.code === 'ONBOARDING_NOT_FOUND') {
          if (this.admin) this.saveError = 'The app\'s owner hasn\'t completed onboarding.';
          else this.notOnboarded = true;
        } else if (error.status === 403) {
          this.saveError = 'You don\'t have permission to change billing details.';
        } else if (error.status === 429) {
          this.saveError = 'Please try again in a moment.';
        } else {
          this.saveError = 'We couldn\'t save your billing details. Please try again.';
        }
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
.billing-details { color: #273448; }
.billing-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
.billing-header h2 { margin: 0 0 4px; color: #263244; font-size: 17px; font-weight: 700; }
.billing-header p { margin: 0; color: #718198; font-size: 12px; line-height: 1.5; }
.muted-note { margin: 6px 0 0; color: #8793a5; font-size: 11px; }

.status-pill { display: inline-flex; flex: 0 0 auto; align-items: center; gap: 4px; padding: 2px 10px; border-radius: 10px; font-size: 11px; font-weight: 700; }
.status-pill >>> .v-icon { color: inherit !important; }
.is-success { background: #eaf8f0; color: #218459; }
.is-muted { background: #f1f5f9; color: #64748b; }

.notice { display: flex; gap: 10px; margin-bottom: 16px; padding: 12px 14px; border-radius: 8px; font-size: 12px; line-height: 1.55; }
.notice p { margin: 0; }
.notice-error { border: 1px solid #fecdca; background: #fef3f2; color: #b42318; }
.notice-error > .v-icon { color: #d92d20 !important; }
.notice-info { border: 1px solid #c7d7fe; background: #eef4ff; color: #3538cd; }
.notice-info > .v-icon { color: #444ce7 !important; }
.notice-muted { border: 1px solid #e4e7ec; background: #f8fafc; color: #475467; }

.billing-summary { max-width: 640px; }
.billing-summary dl { margin: 0 0 16px; }
.billing-summary dl > div { display: grid; grid-template-columns: 160px minmax(0, 1fr); gap: 12px; padding: 9px 0; border-bottom: 1px solid #eef2f6; font-size: 13px; }
.billing-summary dt { color: #718198; font-weight: 500; }
.billing-summary dd { margin: 0; color: #263244; font-weight: 600; }
.tax-id { display: inline-block; margin-right: 10px; font-variant-numeric: tabular-nums; }

.billing-form { max-width: 640px; }
.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 16px; }
.field { display: flex; flex-direction: column; gap: 5px; margin: 0; }
.field.full { grid-column: 1 / -1; }
.field > span { color: #475467; font-size: 12px; font-weight: 600; }
.field input,
.field select,
.tax-row input,
.tax-row select {
  height: 38px;
  padding: 0 11px;
  border: 1px solid #d5dde7;
  border-radius: 6px;
  background: #fff;
  color: #27364a;
  font-size: 13px;
}
.field input:focus,
.field select:focus,
.tax-row input:focus,
.tax-row select:focus { border-color: #2f6fec; outline: none; box-shadow: 0 0 0 2px rgba(47, 111, 236, .12); }
.field input:disabled,
.field select:disabled,
.tax-row input:disabled,
.tax-row select:disabled { background: #f8fafc; color: #667085; cursor: not-allowed; }
.field.invalid input,
.field.invalid select,
.tax-row.invalid input { border-color: #f04438; }
.field-error { color: #b42318; font-size: 11px; }
.field-help { margin: 0; color: #8793a5; font-size: 11px; }

.tax-section { margin-top: 20px; }
.tax-heading { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.tax-heading h3 { margin: 0; color: #263244; font-size: 13px; font-weight: 700; }
.locked-note { display: inline-flex; align-items: center; gap: 3px; color: #718198; font-size: 11px; }
.locked-note .v-icon { color: inherit; }
.tax-row { display: grid; grid-template-columns: minmax(0, 220px) minmax(0, 1fr) auto; gap: 8px; align-items: center; margin-bottom: 8px; }
.tax-row input { font-variant-numeric: tabular-nums; letter-spacing: .02em; text-transform: uppercase; }
.tax-row .field-error { grid-column: 1 / -1; }
.state-field { max-width: 312px; margin-top: 16px; }
.region-notice { margin: 16px 0 0; }
.personal-tax-id { display: flex; flex-direction: column; gap: 2px; margin: 0 0 10px; font-size: 13px; font-weight: 600; }
.billing-form > .field-help { margin-top: 12px; }

.icon-button { display: inline-flex; width: 32px; height: 32px; align-items: center; justify-content: center; border-radius: 6px; color: #8793a5; }
.icon-button:hover { background: #f1f5f9; }
.link-button { display: inline-flex; align-items: center; gap: 3px; padding: 0; color: #2563dc; font-size: 12px; font-weight: 600; }
.link-button:hover { text-decoration: underline; }
.link-button .v-icon { color: inherit; }

.form-actions { display: flex; gap: 8px; margin-top: 20px; }
.primary-button, .secondary-button { min-height: 36px; padding: 0 16px; border-radius: 6px; font-size: 12px; font-weight: 700; }
.primary-button { border: 1px solid #6c757d; background: #6c757d; color: #fff; }
.primary-button:hover:not(:disabled) { border-color: #545b62; background: #5a6268; }
.primary-button:disabled, .secondary-button:disabled { cursor: not-allowed; opacity: .6; }
.secondary-button { border: 1px solid #6c757d; background: #fff; color: #6c757d; }
.secondary-button:hover:not(:disabled) { background: #6c757d; color: #fff; }

.admin-section { display: grid; grid-template-columns: minmax(0, 220px) minmax(0, 1fr); gap: 14px 16px; align-items: end; margin-top: 20px; padding-top: 16px; border-top: 1px solid #eef2f6; }
.admin-section .full { grid-column: 1 / -1; }
.check-field { display: inline-flex; align-items: center; gap: 6px; margin: 0 0 10px; color: #344054; font-size: 12px; font-weight: 600; }

.embedded .billing-form,
.embedded .billing-summary { max-width: none; }

@media (max-width: 650px) {
  .billing-header { flex-direction: column; }
  .field-grid { grid-template-columns: 1fr; }
  .tax-row { grid-template-columns: 1fr auto; }
  .tax-row select { grid-column: 1 / -1; }
}
</style>
