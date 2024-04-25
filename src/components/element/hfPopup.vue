<template>
  <b-modal v-model="show" :id="id" hide-footer ref="modal-1" :title="Header" centered>
    <slot />
  </b-modal>

  <!-- <div :id="id" class="modal-dialog modal-dialog-centered fade" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">{{ Header }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </div> -->
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