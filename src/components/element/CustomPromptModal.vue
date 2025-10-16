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
          <div v-else-if="type === 'info'" class="info-icon">
            <i class="fas fa-info-circle"></i>
          </div>
          <div class="message-text">
            <p>{{ message }}</p>
            <div class="input-group">
              <label v-if="inputLabel" class="input-label">{{ inputLabel }}</label>
              <textarea 
                v-if="inputType === 'textarea'"
                v-model="inputValue"
                :placeholder="placeholder"
                :required="required"
                class="form-input textarea-input"
                rows="4"
                @keydown.enter.meta="submit"
                @keydown.enter.ctrl="submit"
                ref="input"
              ></textarea>
              <input 
                v-else
                v-model="inputValue"
                :type="inputType"
                :placeholder="placeholder"
                :required="required"
                class="form-input"
                @keydown.enter="submit"
                ref="input"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="cancel" class="btn btn-secondary">
          <i class="fas fa-times"></i>
          {{ cancelText }}
        </button>
        <button @click="submit" class="btn" :class="submitButtonClass" :disabled="required && !inputValue.trim()">
          <i :class="submitIconClass"></i>
          {{ submitText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomPromptModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Input Required'
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info', // warning, danger, info
      validator: value => ['warning', 'danger', 'info'].includes(value)
    },
    inputType: {
      type: String,
      default: 'text' // text, textarea, email, password, etc.
    },
    inputLabel: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Enter your input...'
    },
    required: {
      type: Boolean,
      default: true
    },
    submitText: {
      type: String,
      default: 'Submit'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    iconClass: {
      type: String,
      default: ''
    },
    submitIconClass: {
      type: String,
      default: 'fas fa-check'
    },
    defaultValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      inputValue: this.defaultValue
    };
  },
  computed: {
    submitButtonClass() {
      const typeMap = {
        warning: 'btn-warning',
        danger: 'btn-danger',
        info: 'btn-primary'
      };
      return typeMap[this.type] || 'btn-primary';
    }
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        this.inputValue = this.defaultValue;
        this.$nextTick(() => {
          if (this.$refs.input) {
            this.$refs.input.focus();
          }
        });
      }
    }
  },
  methods: {
    submit() {
      if (this.required && !this.inputValue.trim()) {
        return;
      }
      this.$emit('submit', this.inputValue);
    },
    cancel() {
      this.inputValue = this.defaultValue;
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
  max-width: 700px;
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
  margin-top: 0.25rem;
}

.danger-icon {
  color: #ef4444;
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.info-icon {
  color: #3b82f6;
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.message-text {
  flex: 1;
}

.message-text p {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  line-height: 1.5;
  color: #374151;
}

.input-group {
  margin-top: 1rem;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  font-family: inherit;
  background-color: #fff;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.textarea-input {
  resize: vertical;
  min-height: 100px;
}

.modal-footer {
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn:disabled:hover {
  transform: none !important;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
  border-color: #6b7280;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #4b5563;
  border-color: #4b5563;
  transform: translateY(-1px);
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
  border-color: #2563eb;
  transform: translateY(-1px);
}

.btn-warning {
  background-color: #f59e0b;
  color: white;
  border-color: #f59e0b;
}

.btn-warning:hover:not(:disabled) {
  background-color: #d97706;
  border-color: #d97706;
  transform: translateY(-1px);
}

.btn-danger {
  background-color: #ef4444;
  color: white;
  border-color: #ef4444;
}

.btn-danger:hover:not(:disabled) {
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
  
  .message-content {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .warning-icon,
  .danger-icon,
  .info-icon {
    margin-top: 0;
    align-self: flex-start;
  }
}
</style>