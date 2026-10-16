<template>
  <!-- Title + one-line description on the left, actions (buttons) on the right.
       Used by the Settings sub-tabs so they all line up the same way. -->
  <header class="section-header">
    <div class="section-header-text">
      <h2>{{ title }}</h2>
      <p v-if="description">{{ description }}</p>
    </div>
    <div v-if="$slots.default" class="section-header-actions">
      <slot />
    </div>
  </header>
</template>

<script>
export default {
  name: 'SectionHeader',
  props: {
    title: { type: String, required: true },
    description: { type: String, default: '' },
  },
};
</script>

<style scoped>
.section-header {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-header-text {
  min-width: 0;
}

.section-header h2 {
  color: #111827;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 2px;
}

.section-header p {
  color: #64748b;
  font-size: 13px;
  line-height: 1.45;
  margin: 0;
}

.section-header-actions {
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  gap: 8px;
}

@media (max-width: 650px) {
  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
