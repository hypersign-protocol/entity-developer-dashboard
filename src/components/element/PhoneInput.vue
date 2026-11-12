<template>
  <div class="phone-input" :class="{ 'has-error': invalid, disabled }">
    <!-- Dialling code chip: the native select sits invisibly over it, so the chip shows "+49"
         and the open list shows country names -->
    <label class="dial-chip" :class="{ muted: typedInternational }" :title="typedInternational ? 'Using the country code in the number' : 'Dialling code'">
      <span>{{ typedInternational ? '+' : (dialCode || 'Code') }}</span>
      <i class="mdi mdi-chevron-down" aria-hidden="true"></i>
      <select :value="dial" aria-label="Dialling code" :disabled="disabled || typedInternational" @change="onDialChange">
        <option value="">No dialling code</option>
        <option v-for="option in dialOptions" :key="option.value" :value="option.value">{{ option.flag }} {{ option.name }} ({{ option.code }})</option>
      </select>
    </label>
    <input
      :id="id"
      :value="value"
      type="tel"
      :placeholder="placeholder"
      autocomplete="tel"
      :disabled="disabled"
      @input="$emit('input', $event.target.value.trim())"
      @blur="onBlur"
    />
  </div>
</template>

<script>
import { dialCodeFor, dialCodeOptions, examplePlaceholder, splitInternational } from '../../utils/phone.js';

const DIAL_OPTIONS = dialCodeOptions();

/**
 * Phone number with a dialling-code chip. v-model is what the user typed; `dial` (.sync) is the
 * alpha-2 country of the chip. Build the number to send with toInternationalPhone(value, dial)
 * and check it with isValidPhone (utils/phone.js), as onboarding, billing details and company
 * verification do.
 */
export default {
  name: 'PhoneInput',
  props: {
    value: { type: String, default: '' },
    dial: { type: String, default: '' },
    invalid: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    id: { type: String, default: undefined },
  },
  data() {
    return { dialOptions: DIAL_OPTIONS };
  },
  computed: {
    dialCode() {
      return dialCodeFor(this.dial);
    },
    // A number typed or pasted with + carries its own country code; the chip is ignored
    typedInternational() {
      return (this.value || '').trim().startsWith('+');
    },
    placeholder() {
      return examplePlaceholder(this.typedInternational ? '' : this.dial);
    },
  },
  methods: {
    onDialChange(event) {
      this.$emit('update:dial', event.target.value);
      this.$nextTick(() => this.$emit('blur'));
    },
    // A pasted +number: its country goes to the chip and the rest stays in the input
    onBlur() {
      const split = splitInternational(this.value);
      if (split) {
        this.$emit('update:dial', split.dialCountry);
        this.$emit('input', split.phone);
      }
      this.$nextTick(() => this.$emit('blur'));
    },
  },
};
</script>

<style scoped>
/* Same box as the shared .hf-input (src/assets/css/gblStyle.css), around a chip and an input */
.phone-input {
  display: flex;
  width: 100%;
  height: 38px;
  align-items: center;
  gap: 7px;
  padding: 0 11px 0 6px;
  border: 1px solid #d5dde7;
  border-radius: 6px;
  background: #fff;
}

.phone-input:focus-within { border-color: #2f6fec; box-shadow: 0 0 0 2px rgba(47, 111, 236, .12); }
.phone-input.has-error { border-color: #f04438; }
.phone-input.disabled { background: #f8fafc; cursor: not-allowed; }

.phone-input input {
  min-width: 0;
  flex: 1 1 auto;
  height: 36px;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  box-shadow: none;
  color: #27364a;
  font-family: inherit;
  font-size: 13px;
}

.phone-input input::placeholder { color: #8793a5; opacity: 1; }
.phone-input input:disabled { color: #667085; cursor: not-allowed; }

.dial-chip {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 2px;
  height: 26px;
  margin: 0;
  padding: 0 6px 0 8px;
  border-radius: 4px;
  background: #eef2f6;
  color: #344054;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.dial-chip.muted { color: #94a3b8; cursor: default; }
.dial-chip i { font-size: 14px; }

.phone-input .dial-chip select {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  opacity: 0;
  cursor: pointer;
}

.phone-input .dial-chip select:disabled { cursor: default; }
</style>
