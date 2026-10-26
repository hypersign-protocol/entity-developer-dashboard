<template>
  <button
    type="button"
    :class="buttonClasses"
    :title="title"
    :aria-label="name ? undefined : title"
    @click="emitExecuteAction"
  >
    <i v-if="icon.mdi" class="mdi hf-btn-icon" :class="icon.mdi" aria-hidden="true"></i>
    <i v-else-if="icon.fa" class="hf-btn-icon hf-fa-icon" :class="icon.fa" aria-hidden="true"></i>
    <span v-if="name" class="hf-btn-text">{{ name }}</span>
  </button>
</template>

<script>
// Font Awesome / Bootstrap icon names still passed by older call sites, drawn with the
// Material Design icons the rest of the dashboard uses so every button looks the same
const ICON_ALIASES = {
  'fa-plus': 'mdi-plus',
  'fa-trash': 'mdi-trash-can-outline',
  'fa-trash-alt': 'mdi-trash-can-outline',
  'fa-sync-alt': 'mdi-refresh',
  'arrow-clockwise': 'mdi-refresh',
  'fa-chevron-right': 'mdi-chevron-right',
  'fa-envelope-open': 'mdi-email-open-outline',
  'fa-user-plus': 'mdi-account-plus-outline',
  'fa-google': 'mdi-google',
};

// The Bootstrap class a call site passes in customClass picks the variant
const VARIANT_BY_CLASS = {
  'btn-primary': 'primary',
  'btn-danger': 'danger',
  'btn-outline-danger': 'danger-outline',
  'btn-link': 'link',
};

export default {
  name: 'HfButtons',
  props: {
    // Kept for older call sites; icons are resolved from iconClass either way
    bIcon: { type: Boolean, default: false },
    animate: { type: String, default: '' },
    name: { type: String, default: '' },
    iconClass: { type: String, default: '' },
    customClass: { type: String, default: 'btn btn-outline-secondary' },
    title: { type: String, default: undefined },
    // primary | secondary | ghost | danger | danger-outline | link. Defaults from customClass.
    variant: { type: String, default: '' },
    // 'sm' for buttons inside table rows and cards (32px); default is 36px
    size: { type: String, default: '' },
  },
  computed: {
    classTokens() {
      return String(this.customClass || '').split(/\s+/).filter(Boolean);
    },
    resolvedVariant() {
      if (this.variant) return this.variant;
      const match = this.classTokens.find(token => VARIANT_BY_CLASS[token]);
      return match ? VARIANT_BY_CLASS[match] : 'secondary';
    },
    buttonClasses() {
      // Bootstrap btn classes are replaced by the variant; spacing helpers (ml-2 etc.) are kept
      const extras = this.classTokens.filter(token => token !== 'btn' && !token.startsWith('btn-'));
      return [
        'hf-btn',
        `hf-btn--${this.resolvedVariant}`,
        { 'hf-btn--icon': !this.name, 'hf-btn--sm': this.size === 'sm' },
        ...extras,
      ];
    },
    icon() {
      const tokens = String(this.iconClass || '').split(/\s+/).filter(Boolean);
      if (!tokens.length) return {};
      const mdi = tokens.find(token => token.startsWith('mdi-'));
      if (mdi) return { mdi };
      const alias = tokens.map(token => ICON_ALIASES[token]).find(Boolean);
      if (alias) return { mdi: alias };
      // Unknown Font Awesome icon: draw it as passed
      return { fa: this.iconClass };
    },
  },
  methods: {
    emitExecuteAction() {
      this.$emit('executeAction');
    },
  },
};
</script>

<style>
/* One button design for the whole dashboard. Selectors repeat .hf-btn so they win over the
   Bootstrap btn classes some call sites still pass through `class`. */
.hf-btn.hf-btn {
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: none;
  color: #64748b;
  cursor: pointer;
  display: inline-flex;
  font-size: 13px;
  font-weight: 600;
  gap: 6px;
  height: 36px;
  justify-content: center;
  letter-spacing: normal;
  line-height: 1;
  padding: 0 14px;
  text-transform: none;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
  vertical-align: middle;
  white-space: nowrap;
}
.hf-btn.hf-btn--icon { padding: 0; width: 36px; }
.hf-btn.hf-btn--sm { font-size: 12px; gap: 5px; height: 32px; padding: 0 12px; }
.hf-btn.hf-btn--sm.hf-btn--icon { padding: 0; width: 32px; }
.hf-btn.hf-btn--sm .hf-btn-icon { font-size: 15px; }
.hf-btn .hf-btn-icon { font-size: 16px; line-height: 1; }
.hf-btn .hf-fa-icon {
  display: inline-block;
  font-family: "Font Awesome 5 Free", "Font Awesome 5 Brands";
  font-size: 13px;
  font-style: normal;
  font-weight: 900;
}
.hf-btn.hf-btn:focus { outline: none; }
.hf-btn.hf-btn:focus-visible { box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.18) !important; }
.hf-btn.hf-btn:disabled { cursor: not-allowed; opacity: 0.55; }

/* Row of page actions, right-aligned: destructive / secondary first, primary action last */
.hf-btn-group { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }

/* Secondary (default): white, lighter border and muted text than primary (e.g. Cancel, Reload) */
.hf-btn.hf-btn--secondary:not(:disabled):hover { background: #f8fafc; border-color: #cbd5e1; color: #1f2937; }
.hf-btn.hf-btn--secondary:not(:disabled):active { background: #f1f5f9; border-color: #94a3b8; color: #111827; }

/* Primary: the outlined look of "+ New Configuration" (white, hairline border, dark text),
   a touch stronger than secondary. class="btn btn-primary" gets it too. */
.hf-btn.hf-btn--primary,
.hf-btn.hf-btn--secondary.btn-primary { background: #ffffff !important; border-color: #cbd5e1 !important; color: #1f2937 !important; }
.hf-btn.hf-btn--primary:not(:disabled):hover,
.hf-btn.hf-btn--secondary.btn-primary:not(:disabled):hover { background: #f8fafc !important; border-color: #94a3b8 !important; color: #111827 !important; }
.hf-btn.hf-btn--primary:not(:disabled):active,
.hf-btn.hf-btn--secondary.btn-primary:not(:disabled):active { background: #f1f5f9 !important; border-color: #94a3b8 !important; color: #111827 !important; }

/* Ghost: lowest emphasis (e.g. Cancel next to a primary action); no border until hovered */
.hf-btn.hf-btn--ghost { background: transparent !important; border-color: transparent !important; color: #64748b !important; }
.hf-btn.hf-btn--ghost:not(:disabled):hover { background: #f1f5f9 !important; color: #1f2937 !important; }
.hf-btn.hf-btn--ghost:not(:disabled):active { background: #e2e8f0 !important; color: #111827 !important; }

/* Danger: destructive confirmations */
.hf-btn.hf-btn--danger { background: #dc2626 !important; border-color: #dc2626 !important; color: #ffffff !important; }
.hf-btn.hf-btn--danger:not(:disabled):hover { background: #b91c1c !important; border-color: #b91c1c !important; }

/* Danger outline: e.g. Log out */
.hf-btn.hf-btn--danger-outline { background: #ffffff !important; border-color: #fecaca !important; color: #dc2626 !important; }
.hf-btn.hf-btn--danger-outline:not(:disabled):hover { background: #fef2f2 !important; border-color: #fca5a5 !important; }

/* Link: text only */
.hf-btn.hf-btn--link { background: transparent !important; border-color: transparent !important; color: #2563eb !important; padding: 0 8px; }
.hf-btn.hf-btn--link:not(:disabled):hover { background: #eff6ff !important; }
</style>
