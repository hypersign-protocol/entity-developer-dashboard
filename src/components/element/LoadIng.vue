<template>
  <div v-if="localActive" :class="isFullPage ? 'loading-overlay full-screen' : 'loading-overlay'" :style="{ zIndex }" @click="handleCancel">
    <b-spinner variant="primary" style="width:40px;height:40px;border-width:4px"></b-spinner>
    <div class="mt-3 text-subtitle-2 grey--text">Please wait...</div>
  </div>
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
.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.7);
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
}
.loading-overlay.full-screen {
  position: fixed !important;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
