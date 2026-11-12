<template>
  <!-- The dashboard's one modal. Open it either with v-model, or by id:
       this.$root.$emit('bv::show::modal', id) / 'bv::hide::modal'. -->
  <b-modal
    :id="id"
    :visible="Boolean(value)"
    :size="size"
    centered
    scrollable
    :hide-footer="!$slots.footer"
    :aria-label="heading"
    modal-class="hf-popup-modal"
    @change="$emit('input', $event)"
    @hide="$emit('hide', $event)"
    @hidden="$emit('hidden', $event)"
  >
    <template #modal-header="{ close }">
      <div class="hf-popup-header">
        <span v-if="icon" class="hf-popup-icon" aria-hidden="true"><v-icon small>{{ icon }}</v-icon></span>
        <div class="hf-popup-heading">
          <h2>{{ heading }}</h2>
          <p v-if="description">{{ description }}</p>
        </div>
        <button v-if="!hideHeaderClose" type="button" class="hf-popup-close" aria-label="Close" @click="close()">
          <v-icon small>mdi-close</v-icon>
        </button>
      </div>
    </template>

    <slot />

    <!-- Actions, right-aligned with the primary action last (use <hf-buttons>) -->
    <template v-if="$slots.footer" #modal-footer>
      <div class="hf-btn-group hf-popup-footer"><slot name="footer" /></div>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: 'HfPopUp',
  props: {
    // v-model. Leave unset when opening by id.
    value: { type: Boolean, default: false },
    id: { type: String, default: undefined },
    title: { type: String, default: '' },
    // Older name for title, still used by most call sites
    Header: { type: String, default: '' },
    // Optional one-line subtitle under the title
    description: { type: String, default: '' },
    // Optional MDI icon for the header tile, e.g. "mdi-shield-key-outline"
    icon: { type: String, default: '' },
    // b-modal size: sm | md (default) | lg | xl
    size: { type: String, default: '' },
    hideHeaderClose: { type: Boolean, default: false },
  },
  computed: {
    heading() {
      return this.title || this.Header;
    },
  },
};
</script>

<style>
/* Modal chrome (see the vue2-ui-design-system skill). Unscoped because b-modal renders outside
   this component, so every rule is keyed on the modal-class. */
.hf-popup-modal .modal-content {
  overflow: hidden;
  border: 1px solid #dbe3ef;
  border-radius: 14px;
  box-shadow: 0 24px 60px -12px rgba(23, 37, 84, .22);
  color: #273448;
  font-size: 13px;
}

.hf-popup-modal .modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #edf1f6;
  background: #fff;
}

.hf-popup-modal .modal-body {
  padding: 20px;
  background: #f8fafc;
}

.hf-popup-modal .modal-footer {
  padding: 12px 20px;
  border-top: 1px solid #edf1f6;
  background: #fff;
}

.hf-popup-modal .modal-footer > * { margin: 0; }

.hf-popup-header { display: flex; align-items: center; gap: 12px; width: 100%; }

.hf-popup-icon {
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

.hf-popup-icon .v-icon { color: #2563dc; }

.hf-popup-heading { flex: 1 1 auto; min-width: 0; }
.hf-popup-heading h2 { margin: 0; color: #172554; font-size: 16px; font-weight: 700; letter-spacing: -0.01em; line-height: 1.3; }
.hf-popup-heading p { margin: 2px 0 0; color: #8793a5; font-size: 12px; line-height: 1.45; }

.hf-popup-close {
  display: inline-flex;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #8793a5;
}

.hf-popup-close:hover { background: #f1f5f9; color: #263244; }
.hf-popup-close:focus { outline: none; }
.hf-popup-close:focus-visible { box-shadow: 0 0 0 2px rgba(47, 111, 236, .12); border: 1px solid #2f6fec; }
.hf-popup-close .v-icon { color: inherit; }

.hf-popup-footer { width: 100%; }
</style>
