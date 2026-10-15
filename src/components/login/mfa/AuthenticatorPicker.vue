<template>
  <!-- Authenticator app choice as option cards (radio group) instead of a native select -->
  <div class="authenticator-picker" role="radiogroup" :aria-label="label">
    <button
      v-for="method in options"
      :key="method.value"
      type="button"
      role="radio"
      class="authenticator-option"
      :class="{ selected: value === method.value }"
      :aria-checked="value === method.value ? 'true' : 'false'"
      :disabled="disabled"
      @click="$emit('input', method.value)"
    >
      <span class="option-icon" aria-hidden="true"><i :class="iconFor(method.value)"></i></span>
      <span class="option-name">{{ method.name }}</span>
      <i v-if="value === method.value" class="mdi mdi-check-circle option-check" aria-hidden="true"></i>
    </button>
  </div>
</template>

<script>
import { AUTHENTICATION_METHODS_LIST } from '../../../constants/authenticators';

const ICONS = {
  google: 'mdi mdi-google',
  okta: 'mdi mdi-shield-key-outline',
};

export default {
  name: 'AuthenticatorPicker',
  props: {
    // v-model: selected authenticator value ('google' | 'okta')
    value: { type: String, default: '' },
    // Defaults to every supported authenticator
    options: { type: Array, default: () => AUTHENTICATION_METHODS_LIST },
    label: { type: String, default: 'Authenticator app' },
    disabled: { type: Boolean, default: false },
  },
  methods: {
    iconFor(value) {
      return ICONS[value] || 'mdi mdi-cellphone-key';
    },
  },
};
</script>

<style scoped>
.authenticator-picker {
  display: grid;
  gap: 8px;
}

.authenticator-option {
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #344054;
  display: flex;
  gap: 12px;
  padding: 10px 12px;
  text-align: left;
  transition: border-color 0.15s ease, background-color 0.15s ease;
  width: 100%;
}

.authenticator-option:hover:not(:disabled):not(.selected) {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.authenticator-option.selected {
  border-color: #2563eb;
  background: #eff6ff;
  box-shadow: 0 0 0 1px #2563eb;
}

.authenticator-option:focus {
  outline: none;
}

.authenticator-option:focus-visible {
  box-shadow: 0 0 0 2px #bfdbfe;
}

.authenticator-option:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.option-icon {
  align-items: center;
  background: #f1f5f9;
  border-radius: 8px;
  color: #475569;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 18px;
  height: 34px;
  justify-content: center;
  width: 34px;
}

.selected .option-icon {
  background: #ffffff;
  color: #2563eb;
}

.option-name {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
}

.option-check {
  color: #2563eb;
  font-size: 18px;
}
</style>
