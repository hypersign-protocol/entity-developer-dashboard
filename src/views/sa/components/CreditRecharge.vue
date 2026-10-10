<template>
  <v-container pa-0>
    <load-ing :active.sync="isLoading" :can-cancel="false" :is-full-page="false"></load-ing>
    <div class="overview-container">
      <div class="header-row">
        <h2 class="title">Service Credit Recharge</h2>
      </div>

      <AccessDenied v-if="accessDenied" />

      <div v-else class="pa-2">
        <p class="text-subtitle-2 text-muted mb-6">
          Allocate credits and set validity periods for your registered backend services.
        </p>

        <label class="input-label">Service Type</label>
        <div class="service-type-row mb-10">
          <div
            v-for="type in serviceTypes"
            :key="type.value"
            class="service-type-card"
            :class="{ selected: serviceType === type.value }"
            @click="selectServiceType(type.value)"
          >
            <v-icon small :color="serviceType === type.value ? 'primary' : '#94a3b8'" class="mr-2">
              {{ serviceType === type.value ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank' }}
            </v-icon>
            <div>
              <div class="service-type-title">{{ type.label }}</div>
              <div class="field-hint text-muted">{{ type.description }}</div>
            </div>
          </div>
        </div>

        <template v-if="serviceType">
          <v-row dense class="mt-4">
            <v-col cols="12" md="5" class="mb-2">
              <label class="input-label">Application ID</label>
              <v-text-field
                v-model="form.serviceId"
                placeholder="e.g. 69afa3d8a4976d9c9e4671a7"
                outlined
                dense
                hide-details
                color="primary"
                class="mono-text"
              ></v-text-field>
              <div class="field-hint text-muted mt-1">
                Enter the {{ selectedServiceType.label }} application ID.
              </div>
            </v-col>

            <v-col cols="12" md="3" class="mb-2">
              <label class="input-label"># Of Credits</label>
              <v-text-field
                v-model="form.amount"
                type="number"
                outlined
                dense
                hide-details
                color="primary"
              ></v-text-field>
              <v-btn
                v-if="serviceType === 'ID_SERVICE'"
                text
                x-small
                color="primary"
                class="px-0 mt-1 text-none"
                @click="showCreditInfo = true"
              >
                Understand Credit?
              </v-btn>
            </v-col>

            <v-col cols="12" md="4" class="mb-2">
              <label class="input-label">Validity</label>
              <div class="d-flex" style="gap: 8px;">
                <v-text-field
                  v-model="form.validityMonths"
                  type="number"
                  min="0"
                  step="1"
                  suffix="months"
                  outlined
                  dense
                  hide-details
                  color="primary"
                ></v-text-field>
                <v-text-field
                  v-model="form.validityDays"
                  type="number"
                  min="0"
                  step="1"
                  suffix="days"
                  outlined
                  dense
                  hide-details
                  color="primary"
                ></v-text-field>
              </div>
              <div v-if="validityInDays > 0" class="field-hint text-muted mt-1">
                = <strong>{{ validityInDays }} days</strong>, expires on {{ validityExpiryDate }}
              </div>
            </v-col>
          </v-row>

          <KycCreditCalculator
            v-if="serviceType === 'ID_SERVICE'"
            v-model="showCreditInfo"
            mode="allocate"
            :remaining-credits="Number(form.amount) || 0"
            @update:remainingCredits="form.amount = String($event)"
          />

          <div class="d-flex justify-start mt-6">
            <v-btn
              :loading="loading"
              :disabled="loading"
              color="#111827"
              class="px-8 font-weight-bold"
              depressed
              height="42"
              @click="handleRecharge"
            >
            <span style="color: white;">Execute Recharge</span>
            </v-btn>
          </div>
        </template>

        <v-fade-transition></v-fade-transition>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
/* Access denied state */
.access-denied-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem;
  text-align: center;
  background: #fff5f5;
  border: 1px solid #fecaca;
  border-radius: 10px;
  margin: 0.5rem 0;
}

.access-denied-title {
  font-size: 1rem;
  font-weight: 700;
  color: #dc2626;
  margin-bottom: 6px;
}

.access-denied-msg {
  font-size: 0.85rem;
  color: #6b7280;
  max-width: 360px;
  margin: 0;
}
.overview-container {
  padding: 1.0rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.header-row {
  margin-bottom: 0.5rem;
}

.title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.mono-text {
  font-family: 'JetBrains Mono', monospace !important;
}

/* Feedback Box Styles following your Warning Box pattern */
.feedback-box {
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid;
}

.error-style {
  background-color: #fef2f2;
  border-color: #fecaca;
  color: #991b1b;
}

.success-style {
  background-color: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
}

.text-muted {
  color: #64748b !important;
}

.small {
  font-size: 0.85rem;
}

.service-type-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.service-type-card {
  display: flex;
  align-items: flex-start;
  flex: 1 1 220px;
  max-width: 320px;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.service-type-card:hover {
  border-color: #94a3b8;
}

.service-type-card.selected {
  border-color: var(--v-primary-base);
}

.service-type-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #111827;
}

.field-hint {
  font-size: 0.75rem;
}
</style>
<script>
import { mapActions } from 'vuex/dist/vuex.common.js';
import loadIng from '../../../components/element/LoadIng.vue';
import UtilsMixin from '../../../mixins/utils.js';
import AccessDenied from '../../AccessDenied.vue';
import KycCreditCalculator from '../../../components/credit/KycCreditCalculator.vue';

const defaultForm = () => ({
  serviceId: '',
  amount: '100',
  validityMonths: '12',
  validityDays: '0',
  amountDenom: 'uHID',
});

export default {
  name: 'CreditRecharge',
  components: { loadIng, AccessDenied, KycCreditCalculator },
  mixins: [UtilsMixin],
  data() {
    return {
      loading: false,
      isLoading: false,
      accessDenied: false,
      serviceType: 'ID_SERVICE',
      serviceTypes: [
        { value: 'ID_SERVICE', label: 'ID Service', description: 'Recharge credits for an ID Service application.' },
        { value: 'SSI_SERVICE', label: 'SSI Service', description: 'Recharge credits for an SSI application.' },
      ],
      showCreditInfo: false,
      form: defaultForm(),
    };
  },
  computed: {
    selectedServiceType() {
      return this.serviceTypes.find((t) => t.value === this.serviceType);
    },
    // Expiry date = today + X months + Y days, using calendar months
    // (so 1 month from Jan 31 lands on Mar 2/3, matching Date rollover).
    validityRange() {
      const months = Number(this.form.validityMonths) || 0;
      const days = Number(this.form.validityDays) || 0;
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setMonth(end.getMonth() + months);
      end.setDate(end.getDate() + days);
      return { start, end };
    },
    validityInDays() {
      const { start, end } = this.validityRange;
      // Math.round absorbs the DST hour shift between the two midnights
      return Math.round((end - start) / (24 * 60 * 60 * 1000));
    },
    validityExpiryDate() {
      return this.validityRange.end.toDateString();
    },
  },
  methods: {
    ...mapActions('mainStore', ['creditRecharge']),
    selectServiceType(type) {
      if (type === this.serviceType) return;
      this.serviceType = type;
      this.form = defaultForm();
    },
    async handleRecharge() {
      if (!this.form.serviceId) {
        this.notifyErr("Please provide a Application ID.");
        return;
      }
      if (!this.form.amount || Number(this.form.amount) <= 0) {
        this.notifyErr("Amount must be greater than 0.");
        return;
      }
      const months = Number(this.form.validityMonths || 0);
      const days = Number(this.form.validityDays || 0);
      if (!Number.isInteger(months) || !Number.isInteger(days) || months < 0 || days < 0) {
        this.notifyErr("Validity months and days must be whole numbers (0 or more).");
        return;
      }
      if (this.validityInDays <= 0) {
        this.notifyErr("Validity period must be greater than 0.");
        return;
      }

      this.loading = true;
      this.isLoading = true;

      try {
        await this.creditRecharge({
          serviceId: this.form.serviceId,
          amount: this.form.amount,
          amountDenom: this.form.amountDenom,
          validityPeriod: this.validityInDays,
          validityPeriodUnit: 'Days',
        });
        this.notifySuccess(`Credits recharged successfully for service ${this.form.serviceId}.`);
        this.form = defaultForm();
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || "Recharge failed.";
        const isPermissionDenied = errorMsg.toLowerCase().includes('permission denied') ||
          errorMsg.toLowerCase().includes('forbidden') ||
          errorMsg.toLowerCase().includes('access denied') ||
          errorMsg.toLowerCase().includes('not authorized');
        if (isPermissionDenied) {
          this.accessDenied = true;
        } else {
          this.notifyErr(errorMsg);
        }
      } finally {
        this.loading = false;
        this.isLoading = false;
      }
    }
  }
};
</script>
