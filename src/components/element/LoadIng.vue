<template>
  <v-overlay v-model="localActive" :value="localActive" :absolute="!isFullPage" :opacity="0.7" :z-index="zIndex" :class="{ 'full-screen': isFullPage }" @click="handleCancel">
    <v-progress-circular :size="40" :width="4" color="primary" indeterminate></v-progress-circular>
    <div class="mt-3 text-subtitle-2 grey--text">Please wait...</div>
  </v-overlay>
</template>

<script>
export default {
  name: 'LoadIng',
  props: {
    active: {
      type: Boolean,
      required: true,
    },
    canCancel: {
      type: Boolean,
      default: false,
    },
    isFullPage: {
      type: Boolean,
      default: true,
    },
    zIndex: {
      type: Number,
      default: 9999,
    },
  },
  computed: {
    localActive: {
      get() {
        return this.active
      },
      set(val) {
        this.$emit('update:active', val)
      },
    },
  },
  methods: {
    handleCancel() {
      if (this.canCancel) {
        this.localActive = false
      }
    },
  },
}
</script>

<style scoped>
.full-screen {
  position: fixed !important;
  top: 0;
  left: 0;
}
</style>
