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

    <div v-if="variant === 'dropzone'" class="logo-upload-dropzone" role="button" tabindex="0" @click="triggerUpload" @keydown.enter.prevent="triggerUpload" @keydown.space.prevent="triggerUpload">
      <div class="dropzone-copy">
        <span class="dropzone-icon">
          <img v-if="value" :src="value" alt="Selected organization logo" />
          <i v-else class="mdi mdi-image-outline" aria-hidden="true"></i>
        </span>
        <span>
          <strong>{{ value ? 'Organization logo selected' : 'Upload your organization logo' }}</strong>
          <small>PNG, JPG or SVG · Max 5MB</small>
        </span>
      </div>
      <button type="button" class="choose-file-button" @click.stop="triggerUpload">
        <i class="mdi mdi-cloud-upload-outline" aria-hidden="true"></i>
        {{ value ? 'Change file' : 'Choose file' }}
      </button>
    </div>

    <!-- If logo exists -->
    <div
        v-else-if="value"
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
    },
    variant: {
      type: String,
      default: "circle"
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

      const maxSizeMb = this.variant === "dropzone" ? 5 : 2;
      if (file.size > maxSizeMb * 1024 * 1024) {
        this.$bvToast?.toast(`File too large. Please upload below ${maxSizeMb}MB.`, {
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
  width: 100%;
  align-items: center;
}

.logo-upload-dropzone {
  display: flex;
  width: 100%;
  min-height: 62px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 12px;
  border: 1px dashed #bcd3f2;
  border-radius: 6px;
  background: #fbfdff;
  cursor: pointer;
  outline: none;
}

.logo-upload-dropzone:focus,
.logo-upload-dropzone:hover {
  border-color: #1769ff;
  background: #f7faff;
}

.dropzone-copy {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 11px;
}

.dropzone-copy > span:last-child,
.dropzone-copy strong,
.dropzone-copy small {
  display: block;
}

.dropzone-copy strong {
  color: #385278;
  font-size: 11px;
}

.dropzone-copy small {
  margin-top: 3px;
  color: #8290a5;
  font-size: 9px;
}

.dropzone-icon {
  display: inline-flex;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 5px;
  background: #eef4ff;
  color: #315fa9;
}

.dropzone-icon i { font-size: 18px; }
.dropzone-icon img { width: 100%; height: 100%; object-fit: cover; }

.choose-file-button {
  display: inline-flex;
  min-height: 34px;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  border: 1px solid #6c757d;
  border-radius: 5px;
  background: #fff;
  color: #6c757d;
  font-size: 10px;
  font-weight: 700;
}

.choose-file-button:hover { background: #6c757d; color: #fff; }

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

@media (max-width: 480px) {
  .logo-upload-dropzone { align-items: stretch; flex-direction: column; }
  .choose-file-button { justify-content: center; }
}
</style>
