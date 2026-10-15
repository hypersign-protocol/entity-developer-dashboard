<template>
  <!-- Empty state for "nothing here yet / not found": dashed outline, icon tile, title,
       optional description and an optional action passed in the default slot -->
  <div class="empty-container" role="status">
    <span v-if="icon" class="empty-icon" aria-hidden="true">
      <i :class="icon"></i>
    </span>
    <h3 class="empty-title">{{ title }}</h3>
    <p v-if="description" class="empty-description">{{ description }}</p>
    <div v-if="$slots.default" class="empty-actions">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyContainer',
  props: {
    title: { type: String, default: 'Nothing here yet' },
    // Icon class, e.g. "fa fa-users" or "mdi mdi-account-off-outline"
    icon: { type: String, default: '' },
    // Optional one-line explanation or next step under the title
    description: { type: String, default: '' },
  },
};
</script>

<style scoped>
.empty-container {
  align-items: center;
  background: #fafbfc;
  border: 1.5px dashed #cbd5e1;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 10px;
  padding: 48px 24px;
  text-align: center;
  width: 100%;
}

.empty-icon {
  align-items: center;
  background: #f1f5f9;
  border-radius: 50%;
  color: #94a3b8;
  display: inline-flex;
  font-size: 22px;
  height: 56px;
  justify-content: center;
  margin-bottom: 14px;
  width: 56px;
}

.empty-title {
  color: #1f2937;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.empty-description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 6px 0 0;
  max-width: 420px;
}

.empty-actions {
  margin-top: 18px;
}
</style>
