<template>
  <div class="logo-upload-wrapper">

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="d-none"
      @change="handleUpload"
    />

    <!-- If logo exists -->
    <div
        v-if="value"
        class="logo-preview-circle hover-overlay"
        :class="{ 'no-pointer': !allowReupload }"
        @click="triggerUpload"
    >
      <img :src="value" alt="Logo" />
      <div v-if="allowReupload" class="hover-text">Re-upload</div>
    </div>

    <!-- If empty -->
    <div
      v-else
      class="logo-upload-circle"
      @click="triggerUpload"
    >
      Upload
    </div>

  </div>
</template>

<script>
export default {
  name: "LogoUploader",

  // Support v-model
  props: {
    value: {
      type: String,
      default: ""
    },
    allowReupload: {
        type: Boolean,
        default: true
    }
  },

  methods: {
    triggerUpload() {
      if (!this.allowReupload) return;  // <— prevent upload
      this.$refs.fileInput.click();
    },

    async handleUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        this.$bvToast?.toast("File too large. Please upload below 2MB.", {
          title: "Error",
          variant: "danger",
          solid: true
        });
        return;
      }

      const base64 = await this.compressAndConvertToBase64(file);
      this.$emit("input", base64); // v-model support
    },

    compressAndConvertToBase64(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = e => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_SIZE = 300;

            let { width, height } = img;

            // resize logic
            if (width > height) {
              if (width > MAX_SIZE) {
                height *= MAX_SIZE / width;
                width = MAX_SIZE;
              }
            } else {
              if (height > MAX_SIZE) {
                width *= MAX_SIZE / height;
                height = MAX_SIZE;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            const dataUrl = canvas.toDataURL("image/png", 0.85);
            resolve(dataUrl);
          };
          img.src = e.target.result;
        };

        reader.readAsDataURL(file);
      });
    }
  }
};
</script>

<style scoped>
.no-pointer {
  pointer-events: none; /* makes the logo purely static */
}
.logo-upload-wrapper {
  display: flex;
  align-items: center;
}

.logo-upload-circle,
.logo-preview-circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  cursor: pointer;
}

.logo-upload-circle {
  background: #f5f5f5;
  border: 2px dashed #bbb;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.logo-preview-circle {
  position: relative;
  overflow: hidden;
}

.logo-preview-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* hover overlay */
.hover-overlay .hover-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.55);
  border-radius: 50%;
  color: #fff;
  font-size: 14px;
  font-weight: 600;

  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 0;
  transition: opacity 0.2s ease;
}

.hover-overlay:hover .hover-text {
  opacity: 1;
}
</style>
