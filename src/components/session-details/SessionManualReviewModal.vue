<template>
  <b-modal
    id="manual-review-decision-modal"
    ref="modal"
    size="lg"
    centered
    scrollable
    title="Review verification and take action"
    @show="addModalLayoutClass"
    @hidden="handleHidden"
  >
    <p class="text-muted mb-3">Decide to approve or reject this verification.</p>

    <div class="manual-review-panel">
      <div class="card-section-title">Take decision</div>

      <b-form-radio-group
        :checked="decision"
        name="manual-review-decision"
        @change="$emit('update:decision', $event)"
      >
        <b-form-radio value="APPROVED" class="font-weight-bold mb-2">
          Approve
        </b-form-radio>
        <b-form-radio value="REJECTED" class="font-weight-bold mb-3">
          Reject
        </b-form-radio>
      </b-form-radio-group>

      <b-alert v-if="decision === 'APPROVED'" show variant="success" class="py-2">
        This verification will be approved and the user can proceed.
      </b-alert>
      <b-alert v-else show variant="danger" class="py-2">
        This verification will be rejected and the user will not be able to proceed.
      </b-alert>

      <div v-if="decision === 'REJECTED'" class="form-group mt-4">
        <label class="font-weight-bold">
          Reason <span class="mandatory">*</span>
        </label>
        <div class="text-muted small mb-2">Common reasons</div>
        <b-form-radio-group
          :checked="reasonCode"
          name="manual-review-reason"
          @change="$emit('update:reasonCode', $event)"
        >
          <b-form-radio
            v-for="reason in reasonOptions"
            :key="reason.value"
            :value="reason.value"
            class="mb-2"
          >
            {{ reason.label }}
          </b-form-radio>
        </b-form-radio-group>
      </div>

      <div class="form-group mt-4 mb-0">
        <label class="font-weight-bold">
          Comments <small class="text-muted">(optional)</small>
        </label>
        <b-form-textarea
          :value="comments"
          maxlength="300"
          rows="5"
          no-resize
          placeholder="Add additional notes for the audit trail..."
          @input="$emit('update:comments', $event)"
        ></b-form-textarea>
        <div class="text-muted small text-right mt-1">
          {{ comments.length }} / 300
        </div>
      </div>
    </div>

    <template #modal-footer>
      <b-button
        variant="outline-secondary"
        class="mr-2"
        @click="$emit('cancel')"
      >
        Cancel
      </b-button>
      <HfButtons
        :name="submitting ? 'Submitting...' : 'Submit'"
        :class="{ 'manual-review-submit-disabled': submitting }"
        @executeAction="submitDecision"
      />
    </template>
  </b-modal>
</template>

<script>
import HfButtons from "../element/HfButtons.vue";

export default {
  name: "SessionManualReviewModal",
  components: { HfButtons },
  methods: {
    show() {
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    addModalLayoutClass() {
      document.body.classList.add("manual-review-modal-open");
    },
    handleHidden() {
      document.body.classList.remove("manual-review-modal-open");
      this.$emit("input", false);
    },
    submitDecision() {
      if (!this.submitting) this.$emit("submit");
    },
  },
  beforeDestroy() {
    document.body.classList.remove("manual-review-modal-open");
  },
  props: {
    decision: {
      type: String,
      default: "REJECTED",
    },
    reasonCode: {
      type: String,
      default: "",
    },
    comments: {
      type: String,
      default: "",
    },
    reasonOptions: {
      type: Array,
      default: () => [],
    },
    submitting: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
body.manual-review-modal-open {
  overflow-y: scroll !important;
  padding-right: 0 !important;
}

body.manual-review-modal-open .fixed-top,
body.manual-review-modal-open .fixed-bottom,
body.manual-review-modal-open .is-fixed {
  padding-right: 0 !important;
}

body.manual-review-modal-open .sticky-top {
  margin-right: 0 !important;
}

#manual-review-decision-modal .modal-content {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  box-shadow: 0 16px 40px rgba(23, 37, 84, 0.16);
  overflow: hidden;
  font-size: 13px;
}

#manual-review-decision-modal .modal-dialog {
  max-width: 640px;
}

#manual-review-decision-modal .modal-header {
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #edf1f6;
  color: #172554;
  padding: 16px 20px;
}

#manual-review-decision-modal .modal-title {
  font-size: 16px;
  font-weight: 700;
}

#manual-review-decision-modal .modal-body {
  background: #f8fafc;
  padding: 20px;
}

#manual-review-decision-modal .modal-footer {
  background: #fff;
  border-top: 1px solid #edf1f6;
  padding: 14px 20px;
}

.manual-review-panel {
  background: #fff;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 16px;
}

#manual-review-decision-modal .custom-control-label,
#manual-review-decision-modal .alert,
#manual-review-decision-modal .form-control,
#manual-review-decision-modal .btn {
  font-size: 13px;
}

#manual-review-decision-modal .custom-control-label {
  color: #26375f;
  font-weight: 600;
}

#manual-review-decision-modal .alert {
  border: 0;
  border-radius: 6px;
  line-height: 1.45;
  margin-bottom: 0;
}

#manual-review-decision-modal .form-control {
  border-color: #cbd5e1;
  border-radius: 6px;
  color: #26375f;
  padding: 10px 12px;
}

#manual-review-decision-modal .form-control:focus {
  border-color: #94a3b8;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.18);
}

.manual-review-submit-disabled {
  opacity: 0.65;
  pointer-events: none;
}

.card-section-title {
  border-bottom: 1px solid #edf1f6;
  color: #172554;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 14px;
  padding-bottom: 10px;
  text-transform: uppercase;
}
</style>
