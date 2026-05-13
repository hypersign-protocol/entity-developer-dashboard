<template>
  <div class="chips-input-container">
    <div class="chips-display">
      <div
        v-for="(chip, index) in modelValue"
        :key="chip + index"
        class="chip"
      >
        {{ chip }}

        <button
          type="button"
          class="chip-remove"
          @click="removeChip(index)"
        >
          ×
        </button>
      </div>
    </div>

    <input
      v-model="newChip"
      type="text"
      class="chip-input"
      placeholder="Enter domain/origin"
      @keydown="addChip"
      @blur="processNewChip"
      @paste="handlePaste"
    />
  </div>
</template>

<script>
import { normalizeCorsOrigin } from "../../utils/utils";
export default {
  name: "CorsChipsInput",

  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      newChip: ""
    };
  },

  methods: {
    addChip(event) {
      const key = event.key;

      if (
        key === "Enter" ||
        key === "," ||
        key === ";" ||
        (key === " " && this.newChip.trim())
      ) {
        event.preventDefault();
        this.processNewChip();
      }
    },

    handlePaste(event) {
      event.preventDefault();

      const pastedText = event.clipboardData.getData("text");

      this.newChip += pastedText;

      this.processNewChip();
    },

    processNewChip() {
      const values = this.newChip
        .split(/[,\s;]+/)
        .map(v => v.trim())
        .filter(Boolean);

      const updated = [...this.modelValue];

      values.forEach(val => {
        const normalized = normalizeCorsOrigin(val);

        if (!normalized) return;

        if (!updated.includes(normalized)) {
          updated.push(normalized);
        }
      });

      this.$emit("update:modelValue", updated);

      this.newChip = "";
    },

    removeChip(index) {
      const updated = [...this.modelValue];

      updated.splice(index, 1);

      this.$emit("update:modelValue", updated);
    },
  }
};
</script>

<style scoped>
.chips-input-container {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
}

.chips-display {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  background: #f0f4ff;
  border: 1px solid #c9d8ff;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 0.78rem;
  color: #3b5bdb;
}

.chip-remove {
  background: none;
  border: none;
  color: #3b5bdb;
  cursor: pointer;
  margin-left: 4px;
  font-size: 1rem;
  line-height: 1;
}

.chip-input {
  border: none;
  outline: none;
  font-size: 0.9rem;
  padding: 0.25rem 0;
}
</style>