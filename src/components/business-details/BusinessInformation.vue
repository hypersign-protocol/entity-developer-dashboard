<template>
  <div class="business-information">
    <section v-for="section in sections" :key="section.title" class="info-section">
      <header class="section-header">
        <v-icon small>{{ section.icon }}</v-icon>
        <h3>{{ section.title }}</h3>
      </header>

      <dl class="field-grid">
        <div v-for="field in section.fields" :key="field.label" class="field" :class="{ 'span-2': field.wide }">
          <dt class="field-label">{{ field.label }}</dt>
          <dd v-if="!hasValue(field.value)" class="field-value is-missing">Not provided</dd>
          <dd v-else-if="field.kind === 'copy'" class="field-value mono copy-value">
            <span class="truncate" :title="field.value">{{ field.value }}</span>
            <button type="button" class="copy-btn" :aria-label="`Copy ${field.label}`" @click="copyToClipboard(field.value)">
              <v-icon x-small>mdi-content-copy</v-icon>
            </button>
          </dd>
          <dd v-else-if="field.kind === 'link'" class="field-value">
            <a :href="toUrl(field.value)" target="_blank" rel="noopener noreferrer" class="field-link">
              {{ field.value }} <v-icon x-small>mdi-open-in-new</v-icon>
            </a>
          </dd>
          <dd v-else-if="field.kind === 'country'" class="field-value">
            <span class="country-flag" aria-hidden="true">{{ countryCodeToFlag(field.value) }}</span>
            {{ countryCodeToName(field.value) }}
          </dd>
          <dd v-else class="field-value" :class="{ mono: field.mono }">{{ field.value }}</dd>
        </div>
      </dl>
    </section>
  </div>
</template>

<script>
import UtilsMixin from "../../mixins/utils.js";

// Placeholders the store uses for missing values
const EMPTY_VALUES = ['', 'N/A', 'Unknown'];

export default {
  name: "BusinessInformation",
  props: {
    company: {
      type: Object,
      default: () => ({})
    }
  },
  mixins: [UtilsMixin],
  computed: {
    sections() {
      const company = this.company || {};
      const address = company.address || {};
      return [
        {
          title: 'Company',
          icon: 'mdi-office-building-outline',
          fields: [
            { label: 'Legal name', value: company.companyName },
            { label: 'Company ID', value: company.companyId, kind: 'copy' },
            { label: 'Website', value: company.domain, kind: 'link' },
            { label: 'Representative', value: company.representative },
            { label: 'Country of registration', value: company.countryCode, kind: 'country' },
            { label: 'Region', value: company.region },
          ]
        },
        {
          title: 'Identifiers',
          icon: 'mdi-card-account-details-outline',
          fields: [
            { label: 'Registration number', value: company.registrationNumber, mono: true },
            { label: 'Registration type', value: company.registrationNumberType },
            { label: 'Tax ID', value: company.taxIdNumber, mono: true },
            { label: 'Tax ID type', value: company.taxIdType },
          ]
        },
        {
          title: 'Registered address',
          icon: 'mdi-map-marker-outline',
          fields: [
            { label: 'Street', value: address.street, wide: true },
            { label: 'City', value: address.city },
            { label: 'State / Province', value: address.province },
            { label: 'Postal code', value: address.postalCode },
            { label: 'Country', value: address.country, kind: 'country' },
          ]
        }
      ];
    }
  },
  methods: {
    hasValue(value) {
      if (value === undefined || value === null) return false;
      return !EMPTY_VALUES.includes(String(value).trim());
    },

    toUrl(domain) {
      return /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;
    },

    countryCodeToFlag(countryCode) {
      if (!countryCode || countryCode.length !== 2) return '';
      return countryCode
        .toUpperCase()
        .replace(/./g, char =>
          String.fromCodePoint(127397 + char.charCodeAt(0))
        );
    },

    countryCodeToName(countryCode) {
      if (!countryCode) return '';
      try {
        if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
          const dn = new Intl.DisplayNames(['en'], { type: 'region' });
          return dn.of(countryCode.toUpperCase());
        }
      } catch (e) {
        // fall through to fallback
      }
      return countryCode.toUpperCase();
    },

    formatDate(dateString) {
      if (!dateString) return 'Not available';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    copyToClipboard(value) {
      if (!value) return;
      navigator.clipboard.writeText(value)
        .then(() => this.notifySuccess('Copied to clipboard!'))
        .catch(() => this.notifyErr('Could not copy to clipboard.'));
    }
  }
}
</script>

<style scoped>
.business-information {
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 1100px;
}

/* Shared label / value styles */
.field-label {
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.field-value {
  color: #111827;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
  overflow-wrap: anywhere;
}

.field-value.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.8125rem;
}

.field-value.is-missing {
  color: #94a3b8;
  font-style: italic;
  font-weight: 400;
}

/* Sections */
.section-header {
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 10px;
}

.section-header >>> .v-icon {
  color: #64748b !important;
}

.section-header h3 {
  color: #111827;
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
}

.field-grid {
  display: grid;
  gap: 18px 24px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.field.span-2 {
  grid-column: span 2;
}

.copy-value {
  align-items: center;
  display: flex;
  gap: 6px;
  min-width: 0;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copy-btn {
  background: transparent;
  border: 0;
  border-radius: 4px;
  color: #64748b;
  flex: 0 0 auto;
  line-height: 1;
  padding: 4px;
}

.copy-btn:hover {
  background: #f1f5f9;
  color: #111827;
}

.copy-btn >>> .v-icon {
  color: inherit !important;
}

.field-link {
  color: #2563eb;
  text-decoration: none;
}

.field-link:hover {
  text-decoration: underline;
}

.field-link >>> .v-icon {
  color: inherit !important;
}

.country-flag {
  margin-right: 4px;
}

@media (max-width: 960px) {
  .field-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .field-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .field.span-2 {
    grid-column: auto;
  }
}
</style>
