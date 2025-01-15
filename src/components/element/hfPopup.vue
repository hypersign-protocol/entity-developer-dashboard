<template>
  <b-modal 
    :size="size" 
    scrollable  
    v-model="show" 
    :id="id" 
    hide-footer 
    ref="modal-1" 
    :title="Header" 
    centered
    header-bg-variant="dark"
    header-text-variant='light'
    >
    <slot />
  </b-modal>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    };
  },
  props: {
    Header: {
      type: String,
      require: true,
    },
    id: {
      type: String,
    },
    size: {
      type: String, 
      default: ''
    }
  },
  created() {
    this.openModal();
    this.closeModal();
  },
  methods: {
    openModal() {
      this.$root.$on("modal-show", () => {
        this.show = true;
      });
    },
    closeModal() {
      this.$root.$on("modal-close", () => {
        this.show = false;
      });
    },
  },
};
</script>

<style></style>