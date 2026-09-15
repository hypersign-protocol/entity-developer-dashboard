<template>
  <b-modal
    id="manual-review-decision-modal"
    ref="modal"
    size="xl"
    centered
    scrollable
    title="Review verification and take action"
    @hidden="$emit('input', false)"
  >
    <p class="text-muted mb-3">Decide to approve or reject this verification.</p>

    <div class="manual-review-panel">
      <div class="card-section-title">Take decision</div>

      <b-form-radio
        :checked="decision === 'APPROVED'"
        value="APPROVED"
        class="font-weight-bold mb-2"
        @change="$emit('update:decision', $event)"
      >
        Approve
      </b-form-radio>

      <b-form-radio
        :checked="decision === 'REJECTED'"
        value="REJECTED"
        class="font-weight-bold mb-3"
        @change="$emit('update:decision', $event)"
      >
        Reject
      </b-form-radio>

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
        <b-form-radio
          v-for="reason in reasonOptions"
          :key="reason.value"
          :checked="reasonCode === reason.value"
          :value="reason.value"
          class="mb-2"
          @change="$emit('update:reasonCode', $event)"
        >
          {{ reason.label }}
        </b-form-radio>
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
        class="manual-review-cancel-btn"
        @click="$emit('cancel')"
      >
        Cancel
      </b-button>
      <b-button
        variant="primary"
        class="manual-review-submit-btn"
        :disabled="submitting"
        @click="$emit('submit')"
      >
        {{ submitting ? "Submitting..." : "Submit" }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: "SessionManualReviewModal",
  methods: {
    show() {
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
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
html {
  overflow-y: scroll;
}

body.modal-open {
  overflow-y: scroll !important;
  padding-right: 0 !important;
}

body.modal-open .fixed-top,
body.modal-open .fixed-bottom,
body.modal-open .is-fixed {
  padding-right: 0 !important;
}

body.modal-open .sticky-top {
  margin-right: 0 !important;
}

#manual-review-decision-modal .modal-content {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  box-shadow: 0 16px 40px rgba(23, 37, 84, 0.16);
  overflow: hidden;
  font-size: 13px;
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

.manual-review-cancel-btn {
  background: #fff !important;
  border-color: #6c757d !important;
  color: #6c757d !important;
}

.manual-review-cancel-btn:hover,
.manual-review-cancel-btn:focus {
  background: #6c757d !important;
  color: #fff !important;
}

.manual-review-submit-btn {
  background: #6c757d !important;
  border-color: #6c757d !important;
  color: #fff !important;
}

.manual-review-submit-btn:hover,
.manual-review-submit-btn:focus {
  background: #5a6268 !important;
  border-color: #5a6268 !important;
  color: #fff !important;
}

.manual-review-submit-btn:disabled {
  background: #6c757d !important;
  border-color: #6c757d !important;
  color: #fff !important;
  opacity: 0.65;
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
