<template>
  <div class="section-loader" :style="{ minHeight }" role="status" :aria-label="label">
    <v-progress-circular indeterminate color="primary" :size="size" :width="3"></v-progress-circular>
  </div>
</template>

<script>
// Inline loader for one section of a page (a tab, a card, a panel): a centred spinner with
// no backdrop. Use LoadIng only when the whole page has to be blocked.
export default {
  name: 'SectionLoader',
  props: {
    // Accessible name announced by screen readers
    label: {
      type: String,
      default: 'Loading',
    },
    // Height of the area the spinner is centred in; match the section it stands in for
    minHeight: {
      type: String,
      default: '240px',
    },
    size: {
      type: Number,
      default: 32,
    },
  },
};
</script>

<style scoped>
.section-loader {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
