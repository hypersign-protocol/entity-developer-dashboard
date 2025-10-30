<template>
  <div class="create-identity-step text-center">
    <!-- Step Title -->
    <h4 class="step-title mb-1">Create Business Identity</h4>
    <p class="text-muted mb-5">Set up a secure digital identity for your business. 
      This identity will be used to sign and verify your KYC credentials on the blockchain.</p>

    <!-- Form -->
    <b-form class="text-left mx-auto" style="max-width: 480px;">
      <b-form-group label="Business Identity Name *" label-for="businessName">
        <b-form-input
          id="businessName"
          v-model="businessName"
          placeholder="e.g. Acme Corp"
          required
        ></b-form-input>
        <small class="text-muted">
          You can use your company name or choose a unique name for your digital identity.
        </small>
      </b-form-group>

      <b-form-group label="Your Business DID">
        <div class="d-flex align-items-center">
          <b-form-input
            v-model="businessDID"
            readonly
            class="flex-grow-1 mr-2"
          ></b-form-input>
          <b-button size="sm" variant="secondary" @click="regenerateDID">Regenerate</b-button>
          <b-button size="sm" variant="outline-secondary" class="ml-2" @click="copyDID">Copy</b-button>
        </div>
      </b-form-group>

      <b-form-checkbox v-model="registerOnChain" class="mt-3">
        Register this identity on the blockchain
      </b-form-checkbox>

      <!-- Action Buttons -->
      <div class="mt-5 d-flex justify-content-center">
        <b-button variant="secondary" class="mr-3" @click="$emit('prev-step')">Skip for now</b-button>
        <b-button variant="primary" @click="createIdentity">Create Identity</b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "StepCreateBusinessIdentity",
  data() {
    return {
      businessName: "",
      businessDID: this.generateDID(),
      registerOnChain: false,
    };
  },
  methods: {
    generateDID() {
      const random = Math.random().toString(36).substring(2, 10);
      return `did:hid:${random}-${crypto.randomUUID().slice(0, 8)}`;
    },
    regenerateDID() {
      this.businessDID = this.generateDID();
    },
    copyDID() {
      navigator.clipboard.writeText(this.businessDID);
      this.$bvToast.toast("DID copied to clipboard!", {
        title: "Copied",
        variant: "success",
        solid: true,
        autoHideDelay: 2000,
      });
    },
    createIdentity() {
      if (!this.businessName) {
        this.$bvToast.toast("Please enter a business identity name.", {
          title: "Missing Info",
          variant: "danger",
          solid: true,
        });
        return;
      }
      // Simulate identity creation
      this.$emit("next-step");
    },
  },
};
</script>

<style scoped>
.create-identity-step {
  /* color: #fff; */
}

.step-title {
  font-weight: 600;
  font-size: 1.5rem;
}

.text-muted {
  color: #9ca3af !important;
}

.b-form-input {
  background-color: #111827;
  border: 1px solid #374151;
  color: #fff;
}

.b-form-input:focus {
  background-color: #1f2937;
  border-color: #3b82f6;
  box-shadow: none;
}

.b-button {
  border-radius: 6px;
  font-weight: 500;
}

.b-button.variant-primary {
  background-color: #3b82f6;
}

.b-button.variant-secondary {
  background-color: #374151;
  color: #fff;
}

.b-button.variant-outline-secondary {
  border-color: #4b5563;
  color: #d1d5db;
}

.b-form-checkbox {
  color: #d1d5db;
}
</style>
