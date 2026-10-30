<template>
  <b-modal
    :id="popupId"
    :visible="value"
    size="lg"
    centered
    scrollable
    hide-footer
    modal-class="credit-topup-modal"
    @show="reset"
    @change="$emit('input', $event)"
  >
    <template #modal-header="{ close }">
      <div class="topup-header">
        <span class="topup-header-icon"><v-icon small>mdi-wallet-plus-outline</v-icon></span>
        <div class="topup-header-text">
          <h2>Top up credits</h2>
          <!-- <p>{{ pricing.label }} pricing · All amounts in {{ pricing.currency }}</p> -->
        </div>
        <button type="button" class="topup-close" aria-label="Close" @click="close()">
          <v-icon small>mdi-close</v-icon>
        </button>
      </div>
    </template>

    <div v-if="allowRegionPreview" class="region-preview" role="group" aria-label="Preview pricing region">
      <span class="region-preview-label">Preview as</span>
      <button
        v-for="option in regionOptions"
        :key="option.value"
        type="button"
        class="region-preview-option"
        :class="{ active: activeRegion === option.value }"
        :aria-pressed="activeRegion === option.value"
        @click="setRegion(option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <div class="topup-layout">
      <div class="topup-main">
        <section class="topup-card">
          <header class="topup-card-header">
            <h3>Choose an amount</h3>
            <p>Bigger plans get a bigger discount.</p>
          </header>

          <div class="plan-grid" :style="{ '--plan-count': planAmounts.length }">
            <button
              v-for="amount in planAmounts"
              :key="amount"
              type="button"
              class="plan-option"
              :class="{ selected: selectedPlan === amount }"
              :aria-pressed="selectedPlan === amount"
              @click="selectPlan(amount)"
            >
              <span class="plan-amount">{{ formatMoney(amount) }}</span>
              <span v-if="discountPercentFor(amount)" class="plan-save">Save {{ formatPercent(discountPercentFor(amount)) }}</span>
              <span class="plan-check" aria-hidden="true"><v-icon x-small>mdi-check</v-icon></span>
            </button>
          </div>

          <button
            v-if="selectedPlan !== 'custom'"
            type="button"
            class="custom-toggle"
            @click="selectCustom"
          >
            <v-icon x-small>mdi-pencil-outline</v-icon>
            Custom amount
          </button>
          <div v-else class="custom-field" :class="{ invalid: customError }">
            <label :for="customInputId">Custom amount</label>
            <div class="custom-control">
              <span class="currency-symbol">{{ currencySymbol }}</span>
              <input
                :id="customInputId"
                ref="customInput"
                v-model="customInput"
                type="number"
                inputmode="decimal"
                :min="customMin"
                :max="customMax"
                placeholder="Enter amount"
              />
            </div>
            <small v-if="customError" class="field-error">{{ customError }}</small>
          </div>

          <p class="sales-note">
            Need higher volume?
            <a href="mailto:sales@hypersign.id">Talk to sales <v-icon x-small>mdi-arrow-right</v-icon></a>
          </p>
        </section>

        <section class="topup-card addons-card" :class="{ open: addOnsOpen }">
          <button
            type="button"
            class="addons-toggle"
            :aria-expanded="addOnsOpen ? 'true' : 'false'"
            aria-controls="credit-top-up-addons"
            @click="addOnsOpen = !addOnsOpen"
          >
            <span class="addons-heading">
              <span class="addons-title">Included with every top-up</span>
              <span class="addons-summary">{{ addOnsSummary }}</span>
            </span>
            <span class="addon-tag">Free</span>
            <v-icon small class="addons-chevron">mdi-chevron-down</v-icon>
          </button>
          <ul v-show="addOnsOpen" id="credit-top-up-addons" class="addon-list">
            <li v-for="addOn in pricing.addOns" :key="addOn.id" class="addon-item">
              <span class="addon-icon"><v-icon x-small>{{ addOn.icon }}</v-icon></span>
              <span class="addon-copy">
                <strong>{{ addOn.title }}</strong>
                <small>{{ addOn.detail }}</small>
              </span>
            </li>
          </ul>
        </section>
      </div>

      <aside class="topup-summary" aria-live="polite">
        <div class="credits-highlight">
          <span class="eyebrow">You'll get</span>
          <div class="credits-value">
            <strong>{{ numberFormat(credits) }}</strong>
            <small>credits</small>
          </div>
          <button type="button" class="credits-help" :disabled="!credits" @click="calculatorOpen = true">
            <v-icon x-small>mdi-help-circle-outline</v-icon>
            Understand your credits
          </button>
        </div>

        <dl class="summary-lines">
          <div class="summary-line">
            <dt>Top-up amount</dt>
            <dd>{{ formatMoney(baseAmount) }}</dd>
          </div>
          <div v-if="volumeDiscount > 0" class="summary-line saving">
            <dt>Plan discount · {{ formatPercent(volumePercent) }}</dt>
            <dd>− {{ formatMoney(volumeDiscount) }}</dd>
          </div>
          <div class="summary-line">
            <dt>Add-ons · {{ pricing.addOns.length }}</dt>
            <dd class="saving-text">Free</dd>
          </div>
          <div v-if="appliedCoupon" class="summary-line saving">
            <dt>
              <span class="coupon-chip" :title="appliedCoupon.eligibility">
                {{ appliedCoupon.code }}
                <button type="button" aria-label="Remove coupon" @click="removeCoupon">
                  <v-icon x-small>mdi-close</v-icon>
                </button>
              </span>
            </dt>
            <dd>− {{ formatMoney(couponDiscount) }}</dd>
          </div>
        </dl>

        <div v-if="!appliedCoupon" class="coupon-area">
          <button type="button" class="coupon-toggle" @click="openCouponDialog">
            <v-icon x-small>mdi-tag-outline</v-icon>
            Apply coupon
            <span v-if="listedCoupons.length" class="coupon-count">· {{ listedCoupons.length }} available</span>
          </button>
        </div>

        <div class="total-line">
          <span>Total due</span>
          <strong>{{ formatMoney(totalDue) }}</strong>
        </div>
        <p v-if="totalSavings > 0" class="savings-note">You save {{ formatMoney(totalSavings) }}</p>

        <button type="button" class="pay-button" :disabled="!canPay" @click="checkout">
          <v-icon x-small>mdi-lock-outline</v-icon>
          <span>Pay {{ formatMoney(totalDue) }}</span>
          <v-icon x-small class="pay-arrow">mdi-arrow-right</v-icon>
        </button>

        <p class="tax-note">
          Excludes tax. Final tax is calculated on the secure payment page based on your billing jurisdiction.
        </p>
      </aside>
    </div>

    <b-modal
      :id="couponDialogId"
      :visible="couponDialogOpen"
      centered
      hide-footer
      modal-class="credit-topup-modal credit-coupon-modal"
      @shown="focusCouponInput"
      @change="couponDialogOpen = $event"
    >
      <template #modal-header="{ close }">
        <div class="topup-header">
          <span class="topup-header-icon"><v-icon small>mdi-tag-outline</v-icon></span>
          <div class="topup-header-text">
            <h2>Apply a coupon</h2>
            <p>Enter a code or pick one of the offers below.</p>
          </div>
          <button type="button" class="topup-close" aria-label="Close" @click="close()">
            <v-icon small>mdi-close</v-icon>
          </button>
        </div>
      </template>

      <form class="coupon-form" @submit.prevent="applyCoupon(couponInput)">
        <label :for="couponInputId">Coupon code</label>
        <div class="coupon-form-row">
          <input
            :id="couponInputId"
            ref="couponInput"
            v-model="couponInput"
            type="text"
            placeholder="Enter code"
            autocomplete="off"
            :class="{ invalid: couponError }"
            @input="couponError = ''"
          />
          <button type="submit" :disabled="!couponInput.trim()">Apply</button>
        </div>
        <small v-if="couponError" class="field-error">{{ couponError }}</small>
      </form>

      <template v-if="listedCoupons.length">
        <div class="coupon-divider"><span>Available offers</span></div>
        <ul class="coupon-list">
          <li v-for="coupon in listedCoupons" :key="coupon.code" class="coupon-offer">
            <div class="coupon-offer-main">
              <div class="coupon-offer-top">
                <span class="coupon-code">{{ coupon.code }}</span>
                <span class="coupon-percent">{{ formatPercent(coupon.percent) }} off</span>
              </div>
              <strong>{{ coupon.title }}</strong>
              <small>{{ coupon.description }}</small>
              <small v-if="couponSavingFor(coupon) > 0" class="coupon-saving">
                Saves {{ formatMoney(couponSavingFor(coupon)) }} on this top-up
              </small>
            </div>
            <button type="button" class="coupon-apply" @click="applyCoupon(coupon.code)">Apply</button>
          </li>
        </ul>
      </template>
    </b-modal>

    <KycCreditCalculator
      v-model="calculatorOpen"
      mode="topup"
      :remaining-credits="credits"
      :visible-flow-ids="pricing.calculatorFlowIds"
      back-label="Back to Top up credits"
    />
  </b-modal>
</template>

<script>
import KycCreditCalculator from './KycCreditCalculator.vue';
import { REGIONS, coupons, getRegionPricing, discountPercentFor } from './creditTopUpPricing';

const roundMoney = value => Math.round((Number(value) || 0) * 100) / 100;

export default {
  name: 'CreditTopUpPopup',
  components: { KycCreditCalculator },
  props: {
    value: { type: Boolean, default: false },
    // Billing region, taken from where the customer is taxed (onboarding form)
    region: { type: String, default: REGIONS.IN },
    // Sign-off builds only: lets reviewers switch between India and Global pricing
    allowRegionPreview: { type: Boolean, default: false }
  },
  data() {
    return {
      popupId: 'credit-top-up-popup',
      customInputId: 'credit-top-up-custom-amount',
      regionOptions: [
        { value: REGIONS.IN, label: 'India (₹)' },
        { value: REGIONS.GLOBAL, label: 'Global ($)' }
      ],
      activeRegion: this.region,
      selectedPlan: null,
      customInput: '',
      couponDialogId: 'credit-top-up-coupon-popup',
      couponInputId: 'credit-top-up-coupon-code',
      couponDialogOpen: false,
      calculatorOpen: false,
      couponInput: '',
      couponError: '',
      appliedCoupon: null,
      addOnsOpen: false
    };
  },
  computed: {
    pricing() {
      return getRegionPricing(this.activeRegion);
    },
    currencySymbol() {
      const part = new Intl.NumberFormat(this.pricing.locale, { style: 'currency', currency: this.pricing.currency })
        .formatToParts(0)
        .find(p => p.type === 'currency');
      return part ? part.value : '';
    },
    listedCoupons() {
      return Object.entries(coupons)
        .filter(([, coupon]) => coupon.listed && coupon.region === this.activeRegion)
        .map(([code, coupon]) => ({ code, ...coupon }));
    },
    addOnsSummary() {
      return this.pricing.addOns.map(addOn => addOn.short).join(' · ');
    },
    planAmounts() {
      return this.pricing.plans.map(plan => plan.amount);
    },
    customMin() {
      return Math.min(...this.planAmounts);
    },
    customMax() {
      return Math.max(...this.planAmounts);
    },
    customAmount() {
      return roundMoney(this.customInput);
    },
    customError() {
      if (this.selectedPlan !== 'custom' || this.customInput === '') return '';
      if (this.customAmount < this.customMin) return `Minimum top-up is ${this.formatMoney(this.customMin)}.`;
      if (this.customAmount > this.customMax) return `For more than ${this.formatMoney(this.customMax)}, please contact sales.`;
      return '';
    },
    baseAmount() {
      if (this.selectedPlan === 'custom') return this.customError ? 0 : this.customAmount;
      return this.selectedPlan || 0;
    },
    credits() {
      return this.creditsFor(this.baseAmount);
    },
    volumePercent() {
      return this.discountPercentFor(this.baseAmount);
    },
    volumeDiscount() {
      return roundMoney(this.baseAmount * this.volumePercent / 100);
    },
    couponDiscount() {
      if (!this.appliedCoupon) return 0;
      return roundMoney((this.baseAmount - this.volumeDiscount) * this.appliedCoupon.percent / 100);
    },
    totalSavings() {
      return roundMoney(this.volumeDiscount + this.couponDiscount);
    },
    totalDue() {
      return Math.max(roundMoney(this.baseAmount - this.totalSavings), 0);
    },
    canPay() {
      return this.baseAmount > 0 && this.totalDue > 0;
    }
  },
  watch: {
    region(region) {
      this.setRegion(region);
    }
  },
  methods: {
    reset() {
      this.selectedPlan = this.planAmounts[1] || this.planAmounts[0];
      this.customInput = '';
      this.couponDialogOpen = false;
      this.couponInput = '';
      this.couponError = '';
      this.appliedCoupon = null;
    },
    setRegion(region) {
      if (region === this.activeRegion) return;
      this.activeRegion = region;
      // Amounts and coupons are per region, so start over
      this.reset();
    },
    selectCustom() {
      this.selectedPlan = 'custom';
      this.$nextTick(() => this.$refs.customInput && this.$refs.customInput.focus());
    },
    selectPlan(amount) {
      this.selectedPlan = amount;
      this.customInput = '';
    },
    discountPercentFor(amount) {
      return discountPercentFor(amount, this.pricing.plans);
    },
    creditsFor(amount) {
      return Math.floor((Number(amount) || 0) * this.pricing.creditsPerUnit);
    },
    openCouponDialog() {
      this.couponInput = '';
      this.couponError = '';
      this.couponDialogOpen = true;
    },
    focusCouponInput() {
      if (this.$refs.couponInput) this.$refs.couponInput.focus();
    },
    couponSavingFor(coupon) {
      return roundMoney((this.baseAmount - this.volumeDiscount) * coupon.percent / 100);
    },
    applyCoupon(input) {
      const code = String(input || '').trim().toUpperCase();
      if (!code) return;
      const coupon = coupons[code];
      // A code from the other region gets the same message as an unknown code
      if (!coupon || coupon.region !== this.activeRegion) {
        this.couponError = 'This coupon code is not valid.';
        return;
      }
      this.appliedCoupon = { code, ...coupon };
      this.couponInput = '';
      this.couponDialogOpen = false;
    },
    removeCoupon() {
      this.appliedCoupon = null;
    },
    checkout() {
      if (!this.canPay) return;
      this.$emit('checkout', {
        region: this.activeRegion,
        currency: this.pricing.currency,
        amount: this.baseAmount,
        credits: this.credits,
        volumeDiscountPercent: this.volumePercent,
        volumeDiscount: this.volumeDiscount,
        couponCode: this.appliedCoupon ? this.appliedCoupon.code : null,
        couponDiscount: this.couponDiscount,
        totalDue: this.totalDue
      });
    },
    formatPercent(value) {
      return `${new Intl.NumberFormat(this.pricing.locale, { maximumFractionDigits: 1 }).format(value)}%`;
    },
    numberFormat(value) {
      return new Intl.NumberFormat(this.pricing.locale).format(Number(value || 0));
    },
    formatMoney(value) {
      return new Intl.NumberFormat(this.pricing.locale, {
        style: 'currency',
        currency: this.pricing.currency,
        minimumFractionDigits: Number.isInteger(Number(value)) ? 0 : 2,
        maximumFractionDigits: 2
      }).format(Number(value || 0));
    }
  }
};
</script>

<style>
/* Modal chrome: same light header/body treatment as the manual review modal */
.credit-topup-modal .modal-dialog { max-width: 920px; }
.credit-topup-modal.credit-coupon-modal .modal-dialog { max-width: 460px; }

.credit-topup-modal .modal-content {
  overflow: hidden;
  border: 1px solid #dbe3ef;
  border-radius: 14px;
  box-shadow: 0 24px 60px -12px rgba(23, 37, 84, .22);
  font-size: 13px;
}

.credit-topup-modal .modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #edf1f6;
  background: #fff;
}

.credit-topup-modal .modal-body {
  padding: 20px;
  background: #f8fafc;
}
</style>

<style scoped>
/* Header */
.topup-header { display: flex; align-items: center; gap: 12px; width: 100%; }

.topup-header-icon {
  display: inline-flex;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border: 1px solid #dbe7fb;
  border-radius: 10px;
  background: linear-gradient(135deg, #f1f6ff, #e6efff);
}

.topup-header-icon .v-icon { color: #2563dc; }

.topup-header-text { flex: 1 1 auto; min-width: 0; }
.topup-header-text h2 { margin: 0; color: #172554; font-size: 16px; font-weight: 700; letter-spacing: -0.01em; }
.topup-header-text p { margin: 2px 0 0; color: #8793a5; font-size: 12px; }

.topup-close {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #8793a5;
}

.topup-close:hover { background: #f1f5f9; }
.topup-close .v-icon { color: inherit; }

/* Sign-off preview switch */
.region-preview {
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 2px;
  margin: 0 0 14px auto;
  padding: 3px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  background: #fff;
}

.region-preview-label {
  padding: 0 8px;
  color: #8793a5;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.region-preview-option {
  padding: 4px 10px;
  border-radius: 6px;
  color: #718198;
  font-size: 12px;
  font-weight: 600;
}

.region-preview-option.active { background: #f1f6ff; color: #2563dc; }

/* Layout */
.topup-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(260px, 1fr);
  gap: 16px;
  color: #273448;
}

.topup-main { display: flex; min-width: 0; flex-direction: column; gap: 16px; }

.topup-card {
  padding: 16px 18px;
  border: 1px solid #e1e6ed;
  border-radius: 10px;
  background: #fff;
}

.topup-card-header { margin-bottom: 14px; }
.topup-card-header h3 { margin: 0 0 2px; color: #263244; font-size: 14px; font-weight: 700; }
.topup-card-header p { margin: 0; color: #8793a5; font-size: 11px; }

/* Plans */
.plan-grid { display: grid; grid-template-columns: repeat(var(--plan-count, 4), minmax(0, 1fr)); gap: 8px; }

.plan-option {
  position: relative;
  display: flex;
  min-height: 72px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid #d5dde7;
  border-radius: 8px;
  background: #fff;
  text-align: left;
  transition: border-color .15s ease, background-color .15s ease, box-shadow .15s ease;
}

.plan-option:hover { border-color: #a9b8cc; }

.plan-option.selected {
  border-color: #2f6fec;
  background: #f7faff;
  box-shadow: 0 0 0 3px rgba(47, 111, 236, .12);
}

.plan-amount {
  color: #172554;
  font-size: 15px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

.plan-save {
  padding: 1px 7px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.plan-option.selected .plan-save { background: #e6efff; color: #2563dc; }

.plan-check {
  position: absolute;
  top: 8px;
  right: 8px;
  display: none;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #2563dc;
}

.plan-check .v-icon { color: #fff; font-size: 11px !important; }
.plan-option.selected .plan-check { display: inline-flex; }

/* Custom amount: hidden behind a toggle until asked for */
.custom-toggle {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 12px;
  padding: 5px 10px;
  border: 1px dashed #c3cedc;
  border-radius: 6px;
  color: #52627a;
  font-size: 12px;
  font-weight: 600;
  transition: border-color .15s ease, color .15s ease, background-color .15s ease;
}

.custom-toggle:hover { border-color: #2f6fec; background: #f7faff; color: #2563dc; }
.custom-toggle .v-icon { color: inherit; }

.custom-field { margin-top: 14px; }
.custom-field label { display: block; margin-bottom: 6px; color: #475467; font-size: 12px; font-weight: 600; }

.custom-control {
  display: flex;
  height: 38px;
  align-items: center;
  gap: 6px;
  padding: 0 11px;
  border: 1px solid #d5dde7;
  border-radius: 6px;
  background: #fff;
  transition: border-color .15s ease, box-shadow .15s ease;
}

.custom-field .custom-control { border-color: #2f6fec; box-shadow: 0 0 0 2px rgba(47, 111, 236, .12); }
.custom-field.invalid .custom-control { border-color: #f04438; box-shadow: none; }

.currency-symbol { color: #8793a5; font-weight: 600; }

.custom-control input {
  flex: 1 1 auto;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #27364a;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.custom-field small { display: block; margin-top: 4px; color: #8793a5; font-size: 11px; }
.field-error { display: block; margin-top: 4px; color: #b42318 !important; font-size: 11px; }

.sales-note {
  margin: 14px 0 0;
  padding-top: 12px;
  border-top: 1px solid #eef2f6;
  color: #8793a5;
  font-size: 12px;
}

.sales-note a { color: #2563dc; font-weight: 600; text-decoration: none; }
.sales-note a:hover { text-decoration: underline; }
.sales-note .v-icon { color: inherit; }

/* Add-ons: collapsed to one summary row by default */
.addons-card { padding-top: 12px; padding-bottom: 12px; }

.addons-toggle {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
  padding: 0;
  text-align: left;
}

.addons-heading { display: flex; flex: 1 1 auto; min-width: 0; flex-direction: column; }
.addons-title { color: #263244; font-size: 14px; font-weight: 700; }
.addons-summary { overflow: hidden; margin-top: 2px; color: #8793a5; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.addons-toggle:focus-visible { border-radius: 6px; outline: 3px solid rgba(47, 111, 236, .2); outline-offset: 4px; }

.addons-chevron { color: #8793a5 !important; transition: transform .2s ease; }
.addons-card.open .addons-chevron { transform: rotate(180deg); }

.addon-list { margin: 12px 0 0; padding: 12px 0 0; border-top: 1px solid #eef2f6; list-style: none; }

.addon-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  padding: 9px 0;
  border-top: 1px solid #eef2f6;
}

.addon-item:first-child { padding-top: 0; border-top: 0; }

.addon-icon {
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #f1f6ff;
}

.addon-icon .v-icon { color: #2563dc; font-size: 15px !important; }

.addon-copy { display: flex; min-width: 0; flex-direction: column; }
.addon-copy strong { color: #344054; font-size: 13px; font-weight: 600; }
.addon-copy small { color: #8793a5; font-size: 11px; }

.addon-tag {
  padding: 2px 8px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
}

/* Summary */
.topup-summary {
  position: sticky;
  top: 0;
  display: flex;
  align-self: start;
  flex-direction: column;
  padding: 16px 18px;
  border: 1px solid #e1e6ed;
  border-radius: 10px;
  background: #fff;
}

.credits-highlight {
  padding: 14px;
  border: 1px solid #dbe7fb;
  border-radius: 8px;
  background: linear-gradient(135deg, #f5f9ff 0%, #eaf1ff 100%);
}

.eyebrow {
  display: block;
  color: #718198;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.credits-value { display: flex; align-items: baseline; gap: 6px; margin-top: 4px; }

.credits-value strong {
  color: #2563dc;
  font-size: 28px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.credits-value small { color: #718198; font-size: 12px; font-weight: 600; }

.summary-lines { margin: 14px 0 0; }

.summary-line {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
  font-size: 12px;
}

.summary-line dt { display: flex; align-items: center; color: #718198; font-weight: 500; }
.summary-line dd { margin: 0; color: #263244; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
.summary-line.saving dd,
.summary-line dd.saving-text { color: #2563dc; }

.coupon-chip {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 1px 3px 1px 7px;
  border: 1px dashed #b9cdf5;
  border-radius: 6px;
  background: #f7faff;
  color: #2563dc;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.coupon-chip .v-icon { color: inherit; }

.coupon-area { margin-top: 6px; }

.coupon-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  color: #2563dc;
  font-size: 12px;
  font-weight: 600;
}

.coupon-toggle:hover { text-decoration: underline; }
.coupon-toggle .v-icon { color: inherit; }
.coupon-count { color: #8793a5; font-weight: 500; }

/* Coupon dialog */
.coupon-form label { display: block; margin-bottom: 6px; color: #475467; font-size: 12px; font-weight: 600; }
.coupon-form-row { display: flex; gap: 8px; }

.coupon-form input {
  flex: 1 1 auto;
  min-width: 0;
  height: 38px;
  padding: 0 11px;
  border: 1px solid #d5dde7;
  border-radius: 6px;
  background: #fff;
  color: #27364a;
  font-size: 13px;
  letter-spacing: 0.03em;
  outline: none;
  text-transform: uppercase;
}

.coupon-form input::placeholder { letter-spacing: normal; text-transform: none; }
.coupon-form input:focus { border-color: #2f6fec; box-shadow: 0 0 0 2px rgba(47, 111, 236, .12); }
.coupon-form input.invalid { border-color: #f04438; box-shadow: none; }

.coupon-form button,
.coupon-apply {
  height: 38px;
  padding: 0 14px;
  border: 1px solid #6c757d;
  border-radius: 8px;
  background: #6c757d;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.coupon-form button:hover:not(:disabled),
.coupon-apply:hover { border-color: #545b62; background: #5a6268; }
.coupon-form button:disabled { cursor: not-allowed; opacity: .55; }

.coupon-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 18px 0 12px;
  color: #8793a5;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.coupon-divider::before,
.coupon-divider::after { flex: 1; height: 1px; background: #e8edf3; content: ''; }

.coupon-list { display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 0; list-style: none; }

.coupon-offer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #e1e6ed;
  border-radius: 10px;
  background: #fff;
}

.coupon-offer-main { display: flex; flex: 1 1 auto; min-width: 0; flex-direction: column; gap: 2px; }
.coupon-offer-top { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }

.coupon-code {
  padding: 2px 8px;
  border: 1px dashed #b9cdf5;
  border-radius: 6px;
  background: #f7faff;
  color: #2563dc;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.coupon-percent { color: #172554; font-size: 12px; font-weight: 700; }
.coupon-offer-main strong { color: #344054; font-size: 13px; font-weight: 600; }
.coupon-offer-main small { color: #8793a5; font-size: 11px; line-height: 1.45; }
.coupon-offer-main small.coupon-saving { color: #2563dc; font-weight: 600; }

.coupon-apply { flex: 0 0 auto; height: 32px; padding: 0 12px; font-size: 12px; }

/* "Understand your credits": deliberately quiet */
.credits-help {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-top: 6px;
  padding: 0;
  color: #718198;
  font-size: 11px;
}

.credits-help:hover:not(:disabled) { color: #2563dc; text-decoration: underline; }
.credits-help:disabled { cursor: default; opacity: .5; }
.credits-help .v-icon { color: inherit; }

.total-line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eef2f6;
}

.total-line span { color: #344054; font-size: 13px; font-weight: 600; }

.total-line strong {
  color: #172554;
  font-size: 20px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

.savings-note { margin: 2px 0 0; color: #2563dc; font-size: 11px; font-weight: 600; text-align: right; }

/* Same filled action as the dashboard's other primary buttons */
.pay-button {
  display: flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 14px;
  padding: 0 16px;
  border: 1px solid #6c757d;
  border-radius: 8px;
  background: #6c757d;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  transition: background-color .15s ease, border-color .15s ease;
}

.pay-button .v-icon { color: #fff; }
.pay-button .pay-arrow { transition: transform .15s ease; }
.pay-button:hover:not(:disabled) { border-color: #545b62; background: #5a6268; }
.pay-button:hover:not(:disabled) .pay-arrow { transform: translateX(3px); }
.pay-button:focus-visible { outline: 3px solid rgba(108, 117, 125, .3); outline-offset: 2px; }
.pay-button:disabled { cursor: not-allowed; opacity: .55; }

.tax-note { margin: 10px 0 0; color: #8793a5; font-size: 11px; line-height: 1.45; text-align: center; }

@media (max-width: 767.98px) {
  .topup-layout { grid-template-columns: 1fr; }
  .plan-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .topup-summary { position: static; }
}
</style>
