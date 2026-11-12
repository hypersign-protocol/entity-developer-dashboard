<template>
  <div ref="root" class="hf-select" :class="{ open, disabled, multiple }" @focusout="onFocusOut">
    <!-- The box: same look as .hf-input. Multiple shows chips; single shows the chosen text -->
    <div class="hs-box" :class="{ 'is-invalid': invalid }" @mousedown="onBoxMouseDown">
      <template v-if="multiple">
        <span v-for="option in selectedOptions" :key="String(option.value)" class="hs-chip">
          <slot name="chip" :option="option">{{ option.text }}</slot>
          <button
            v-if="!disabled"
            type="button"
            class="hs-chip-remove"
            :aria-label="`Remove ${option.text}`"
            @mousedown.prevent.stop
            @click.stop="remove(option.value)"
          >
            <v-icon x-small>mdi-close</v-icon>
          </button>
        </span>
      </template>
      <span v-else-if="selectedOptions.length && !open" class="hs-value">
        <slot name="chip" :option="selectedOptions[0]">{{ selectedOptions[0].text }}</slot>
      </span>

      <input
        :id="id"
        ref="input"
        v-model="query"
        class="hs-search"
        :class="{ collapsed: !multiple && selectedOptions.length && !open }"
        type="text"
        role="combobox"
        autocomplete="off"
        :aria-label="ariaLabel"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-controls="listId"
        :aria-activedescendant="open && activeIndex > -1 ? optionId(activeIndex) : undefined"
        :placeholder="inputPlaceholder"
        :readonly="!searchable"
        :disabled="disabled"
        @focus="openMenu"
        @input="onQueryInput"
        @keydown="onKeydown"
      />

      <button
        v-if="multiple && selectedOptions.length && !disabled"
        type="button"
        class="hs-icon-btn"
        aria-label="Clear all"
        title="Clear all"
        @mousedown.prevent.stop
        @click.stop="clearAll"
      >
        <v-icon x-small>mdi-close</v-icon>
      </button>
      <v-icon small class="hs-chevron" aria-hidden="true">mdi-chevron-down</v-icon>
    </div>

    <ul
      v-show="open"
      :id="listId"
      ref="list"
      class="hs-menu"
      role="listbox"
      :aria-multiselectable="multiple ? 'true' : undefined"
      @mousedown.prevent
      @scroll="onListScroll"
    >
      <li
        v-for="(option, index) in filteredOptions"
        :id="optionId(index)"
        :key="String(option.value)"
        class="hs-option"
        :class="{ active: index === activeIndex, selected: isSelected(option.value) }"
        role="option"
        :aria-selected="isSelected(option.value) ? 'true' : 'false'"
        @mouseenter="activeIndex = index"
        @click="choose(option.value)"
      >
        <span class="hs-option-label">
          <slot name="option" :option="option" :selected="isSelected(option.value)">{{ option.text }}</slot>
        </span>
        <v-icon v-if="isSelected(option.value)" small class="hs-check" aria-hidden="true">mdi-check</v-icon>
      </li>
      <li v-if="!filteredOptions.length && !loading" class="hs-note">{{ query ? 'No matches' : emptyText }}</li>
      <li v-if="loading" class="hs-note" role="status">Loading…</li>
      <li v-else-if="hasMore" class="hs-more" @click="$emit('load-more')">Load more</li>
    </ul>
  </div>
</template>

<script>
let uid = 0;

/**
 * Dropdown in the .hf-input look (vue2-ui-design-system skill §3b), with search and an optional
 * paged list. Plain single-choice lists stay a native select.hf-input; use this when the list
 * needs search, chips (`multiple`) or loading more.
 * - v-model: one value, or an array of values with `multiple`.
 * - options: strings or { value, text, …anything else }; extra fields reach the `option` and
 *   `chip` slots (e.g. a flag). A selected value missing from `options` shows its raw value.
 * - Paging: pass `has-more` and `loading`, and load the next page on `load-more` (emitted near
 *   the end of the list, or from the "Load more" row).
 */
export default {
  name: 'HfSelect',
  props: {
    value: { type: [Array, String, Number], default: undefined },
    options: { type: Array, default: () => [] },
    multiple: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Select…' },
    searchable: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    hasMore: { type: Boolean, default: false },
    emptyText: { type: String, default: 'No options' },
    id: { type: String, default: undefined },
    ariaLabel: { type: String, default: undefined },
  },
  data() {
    uid += 1;
    return { uid, open: false, query: '', activeIndex: -1 };
  },
  computed: {
    listId() {
      return `hf-select-${this.uid}-list`;
    },
    selectedValues() {
      if (this.multiple) return Array.isArray(this.value) ? this.value : [];
      return this.value === undefined || this.value === null || this.value === '' ? [] : [this.value];
    },
    normalizedOptions() {
      return this.options.map(option => (option !== null && typeof option === 'object'
        ? { ...option, text: option.text != null ? String(option.text) : String(option.value) }
        : { value: option, text: String(option) }));
    },
    optionByValue() {
      const map = new Map();
      this.normalizedOptions.forEach(option => map.set(option.value, option));
      return map;
    },
    selectedSet() {
      return new Set(this.selectedValues);
    },
    selectedOptions() {
      return this.selectedValues.map(value => this.optionByValue.get(value) || { value, text: String(value) });
    },
    filteredOptions() {
      const query = this.query.trim().toLowerCase();
      if (!query) return this.normalizedOptions;
      return this.normalizedOptions.filter(option => option.text.toLowerCase().includes(query)
        || String(option.value).toLowerCase().includes(query));
    },
    inputPlaceholder() {
      if (this.multiple) return this.selectedOptions.length ? '' : this.placeholder;
      // Single: while open, the chosen text shows as the placeholder so typing can search
      if (this.selectedOptions.length) return this.open ? this.selectedOptions[0].text : '';
      return this.placeholder;
    },
  },
  watch: {
    // A page that arrives while the list can't scroll yet: offer the next one straight away
    options() {
      if (this.open) this.$nextTick(this.onListScroll);
    },
  },
  methods: {
    optionId(index) {
      return `${this.listId}-${index}`;
    },
    isSelected(value) {
      return this.selectedSet.has(value);
    },
    emit(value) {
      this.$emit('input', value);
      this.$emit('change', value);
    },
    choose(value) {
      if (this.disabled) return;
      if (!this.multiple) {
        if (value !== this.value) this.emit(value);
        this.closeMenu();
        return;
      }
      const current = this.selectedValues;
      this.emit(this.isSelected(value) ? current.filter(v => v !== value) : [...current, value]);
      this.query = '';
      this.$refs.input.focus();
    },
    remove(value) {
      this.emit(this.selectedValues.filter(v => v !== value));
    },
    clearAll() {
      this.emit([]);
      this.$refs.input.focus();
    },
    openMenu() {
      if (this.disabled || this.open) return;
      this.open = true;
      const selectedIndex = this.multiple ? -1 : this.filteredOptions.findIndex(o => this.isSelected(o.value));
      this.activeIndex = selectedIndex > -1 ? selectedIndex : (this.filteredOptions.length ? 0 : -1);
      this.$nextTick(this.onListScroll);
    },
    closeMenu() {
      this.open = false;
      this.query = '';
      this.activeIndex = -1;
    },
    onBoxMouseDown(event) {
      if (this.disabled) return;
      // Clicking the box (not the input itself) toggles the menu and keeps focus in the input
      if (event.target !== this.$refs.input) event.preventDefault();
      if (this.open && event.target !== this.$refs.input) {
        this.closeMenu();
      } else {
        this.$refs.input.focus();
        this.openMenu();
      }
    },
    onFocusOut(event) {
      if (!this.$refs.root.contains(event.relatedTarget)) {
        this.closeMenu();
        this.$emit('blur');
      }
    },
    onQueryInput() {
      this.open = true;
      this.activeIndex = this.filteredOptions.length ? 0 : -1;
    },
    onListScroll() {
      const list = this.$refs.list;
      if (!list || !this.open || !this.hasMore || this.loading) return;
      if (list.scrollTop + list.clientHeight >= list.scrollHeight - 40) this.$emit('load-more');
    },
    moveActive(step) {
      const count = this.filteredOptions.length;
      if (!count) return;
      if (!this.open) this.openMenu();
      this.activeIndex = (this.activeIndex + step + count) % count;
      this.$nextTick(() => {
        const el = this.$refs.list && this.$refs.list.children[this.activeIndex];
        if (el) el.scrollIntoView({ block: 'nearest' });
      });
    },
    onKeydown(event) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          this.moveActive(1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.moveActive(-1);
          break;
        case 'Enter':
          if (this.open && this.filteredOptions[this.activeIndex]) {
            event.preventDefault();
            this.choose(this.filteredOptions[this.activeIndex].value);
          }
          break;
        case 'Escape':
          if (this.open) {
            event.preventDefault();
            event.stopPropagation();
            this.closeMenu();
          }
          break;
        case 'Backspace':
          if (this.multiple && !this.query && this.selectedValues.length) {
            this.remove(this.selectedValues[this.selectedValues.length - 1]);
          }
          break;
        default:
      }
    },
  },
};
</script>

<style scoped>
.hf-select {
  position: relative;
  width: 100%;
}

/* Same box as .hf-input (src/assets/css/gblStyle.css); with chips it grows as they wrap */
.hs-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  min-height: 38px;
  padding: 4px 8px 4px 6px;
  border: 1px solid #d5dde7;
  border-radius: 6px;
  background: #fff;
  cursor: text;
}

.hf-select:not(.multiple) .hs-box {
  flex-wrap: nowrap;
  cursor: pointer;
}

.open .hs-box,
.hs-box:focus-within {
  border-color: #2f6fec;
  box-shadow: 0 0 0 2px rgba(47, 111, 236, .12);
}

.hs-box.is-invalid { border-color: #f04438; }

.disabled .hs-box {
  background: #f8fafc;
  cursor: not-allowed;
}

.hs-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  height: 26px;
  padding: 0 4px 0 8px;
  border: 1px solid #e1e6ed;
  border-radius: 6px;
  background: #f1f5f9;
  color: #273448;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.disabled .hs-chip {
  padding-right: 8px;
  color: #667085;
}

.hs-value {
  display: inline-flex;
  flex: 1 1 auto;
  align-items: center;
  gap: 6px;
  min-width: 0;
  padding-left: 5px;
  overflow: hidden;
  color: #27364a;
  font-size: 13px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.disabled .hs-value { color: #667085; }

.hs-chip-remove,
.hs-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #8793a5;
  cursor: pointer;
}

.hs-chip-remove:hover,
.hs-icon-btn:hover {
  background: #e2e8f0;
  color: #273448;
}

.hs-chip-remove:focus-visible,
.hs-icon-btn:focus-visible {
  outline: 2px solid #2f6fec;
  outline-offset: 1px;
}

.hs-chip-remove .v-icon,
.hs-icon-btn .v-icon,
.hs-check,
.hs-chevron { color: inherit; }

.hs-search {
  flex: 1 1 80px;
  min-width: 80px;
  height: 28px;
  padding: 0 0 0 5px;
  border: 0;
  outline: none;
  background: transparent;
  color: #27364a;
  font-family: inherit;
  font-size: 13px;
}

/* Single, closed, with a value: the text span shows instead; the input stays focusable */
.hs-search.collapsed {
  flex: 0 0 0;
  width: 0;
  min-width: 0;
  padding: 0;
}

.hs-search::placeholder { color: #8793a5; opacity: 1; }
.hs-search:disabled { cursor: not-allowed; }
.hs-search[readonly] { cursor: pointer; }

.hs-chevron {
  flex: 0 0 auto;
  margin-left: auto;
  color: #8793a5;
  transition: transform .15s ease;
}

.open .hs-chevron { transform: rotate(180deg); }

.hs-menu {
  position: absolute;
  z-index: 30;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 280px;
  margin: 0;
  padding: 4px;
  overflow-y: auto;
  list-style: none;
  border: 1px solid #d7e0ea;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 12px 28px -8px rgba(23, 37, 84, .18);
}

.hs-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 34px;
  padding: 6px 10px;
  border-radius: 6px;
  color: #273448;
  font-size: 13px;
  cursor: pointer;
}

.hs-option.active { background: #f1f5f9; }
.hs-option.selected { color: #2563dc; font-weight: 600; }
.hs-option-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.hs-check { flex: 0 0 auto; color: #2563dc; }

.hs-note,
.hs-more {
  padding: 8px 10px;
  color: #8793a5;
  font-size: 12px;
}

.hs-more {
  border-radius: 6px;
  color: #2563dc;
  font-weight: 600;
  cursor: pointer;
}

.hs-more:hover { background: #f1f5f9; }
</style>
