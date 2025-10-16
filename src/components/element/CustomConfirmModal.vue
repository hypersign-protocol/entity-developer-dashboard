<template>
  <div v-if="isVisible" class="custom-modal-overlay" @click="handleOverlayClick">
    <div class="custom-modal" @click.stop>
      <div class="modal-header">
        <h4 class="modal-title">
          <i :class="iconClass" v-if="iconClass"></i>
          {{ title }}
        </h4>
        <button @click="cancel" class="close-btn" type="button">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="message-content">
          <div v-if="type === 'warning'" class="warning-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div v-else-if="type === 'danger'" class="danger-icon">
            <i class="fas fa-exclamation-circle"></i>
          </div>
          <div v-else-if="type === 'success'" class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <p class="message-text">{{ message }}</p>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="cancel" class="btn btn-secondary">
          <i class="fas fa-times"></i>
          {{ cancelText }}
        </button>
        <button @click="confirm" class="btn" :class="confirmButtonClass">
          <i :class="confirmIconClass"></i>
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomConfirmModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirm Action'
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'warning', // warning, danger, success, info
      validator: value => ['warning', 'danger', 'success', 'info'].includes(value)
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    iconClass: {
      type: String,
      default: ''
    },
    confirmIconClass: {
      type: String,
      default: 'fas fa-check'
    }
  },
  computed: {
    confirmButtonClass() {
      const typeMap = {
        warning: 'btn-warning',
        danger: 'btn-danger',
        success: 'btn-success',
        info: 'btn-primary'
      };
      return typeMap[this.type] || 'btn-primary';
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    cancel() {
      this.$emit('cancel');
    },
    handleOverlayClick() {
      this.cancel();
    }
  }
};
</script>

<style scoped>
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.custom-modal {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.modal-header {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  color: white;
  /* padding: 1.25rem 1.5rem; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-title i {
  font-size: 1rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  /* width: 2rem; */
  /* height: 2rem; */
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 1.5rem;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.warning-icon {
  color: #f59e0b;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.danger-icon {
  color: #ef4444;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.success-icon {
  color: #10b981;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.message-text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: #374151;
}

.modal-footer {
  /* padding: 1.25rem 1.5rem; */
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  /* gap: 0.75rem; */
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  font-family: inherit;
  min-width: 100px;
  justify-content: center;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
  border-color: #6b7280;
}

.btn-secondary:hover {
  background-color: #4b5563;
  border-color: #4b5563;
  transform: translateY(-1px);
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.btn-primary:hover {
  background-color: #2563eb;
  border-color: #2563eb;
  transform: translateY(-1px);
}

.btn-success {
  background-color: #10b981;
  color: white;
  border-color: #10b981;
}

.btn-success:hover {
  background-color: #059669;
  border-color: #059669;
  transform: translateY(-1px);
}

.btn-warning {
  background-color: #f59e0b;
  color: white;
  border-color: #f59e0b;
}

.btn-warning:hover {
  background-color: #d97706;
  border-color: #d97706;
  transform: translateY(-1px);
}

.btn-danger {
  background-color: #ef4444;
  color: white;
  border-color: #ef4444;
}

.btn-danger:hover {
  background-color: #dc2626;
  border-color: #dc2626;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 640px) {
  .custom-modal {
    margin: 1rem;
    width: calc(100% - 2rem);
  }
  
  .modal-header {
    padding: 1rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .modal-footer {
    padding: 1rem;
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>