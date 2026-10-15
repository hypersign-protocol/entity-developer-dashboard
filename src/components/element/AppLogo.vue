<template>
  <span
    class="app-logo"
    :class="[`shape-${shape}`, { 'on-dark': isLightLogo, bordered }]"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <span v-if="stage === 'initials'" class="app-logo-initials" :style="{ fontSize: `${Math.round(size * 0.36)}px` }" aria-hidden="true">
      {{ initials }}
    </span>
    <img
      v-else
      :src="currentSrc"
      :alt="alt || `${name || 'App'} logo`"
      :class="`fit-${fit}`"
      :style="fit === 'contain' ? { padding: `${Math.round(size * 0.14)}px ${Math.round(size * 0.1)}px` } : null"
      @load="onLoad"
      @error="onError"
    />
  </span>
</template>

<script>
// Renders an app / organisation logo the same way everywhere:
// - square logos fill the shape; wide or tall ones (wordmarks) are shown whole inside it
// - white logos on a transparent background get a dark backdrop so they stay visible
// - if the logo fails to load: generated identicon, then initials (no network needed)
export default {
  name: 'AppLogo',
  props: {
    // Uploaded logo URL or data: URL
    src: { type: String, default: '' },
    // Used for the alt text and the initials fallback
    name: { type: String, default: '' },
    // Seed for the generated identicon; defaults to the name
    seed: { type: String, default: '' },
    size: { type: Number, default: 48 },
    // 'circle' | 'rounded'
    shape: { type: String, default: 'circle' },
    bordered: { type: Boolean, default: true },
    alt: { type: String, default: '' },
  },
  data() {
    return {
      // 'logo' -> 'identicon' -> 'initials'
      stage: this.src ? 'logo' : 'identicon',
      fit: 'contain',
      isLightLogo: false,
    };
  },
  computed: {
    currentSrc() {
      if (this.stage === 'logo') return this.src;
      const seed = this.seed || this.name || 'app';
      return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed)}`;
    },
    initials() {
      const words = (this.name || '').trim().split(/\s+/).filter(Boolean);
      return (words.slice(0, 2).map(word => word[0]).join('') || '?').toUpperCase();
    },
  },
  watch: {
    src(value) {
      this.stage = value ? 'logo' : 'identicon';
      this.fit = 'contain';
      this.isLightLogo = false;
    },
  },
  methods: {
    onLoad(event) {
      const { naturalWidth, naturalHeight } = event.target;
      if (!naturalWidth || !naturalHeight) return;
      const ratio = naturalWidth / naturalHeight;
      this.fit = ratio > 0.85 && ratio < 1.18 ? 'cover' : 'contain';
      this.isLightLogo = this.stage === 'logo' && this.isLightTransparent(event.target);
    },

    onError() {
      this.isLightLogo = false;
      this.stage = this.stage === 'logo' ? 'identicon' : 'initials';
    },

    // True for mostly white / very light logos with transparent areas. Only same-origin and
    // data: URLs can be sampled; for others the browser blocks it and the logo stays on white.
    isLightTransparent(img) {
      try {
        const sample = 32;
        const canvas = document.createElement('canvas');
        canvas.width = sample;
        canvas.height = sample;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0, sample, sample);
        const { data } = context.getImageData(0, 0, sample, sample);
        let transparent = 0;
        let visible = 0;
        let luminance = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 40) {
            transparent++;
            continue;
          }
          visible++;
          luminance += (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
        }
        return visible > 0 && transparent / (data.length / 4) > 0.15 && luminance / visible > 0.8;
      } catch (error) {
        return false;
      }
    },
  },
};
</script>

<style scoped>
.app-logo {
  align-items: center;
  background: #ffffff;
  display: inline-flex;
  flex: 0 0 auto;
  justify-content: center;
  overflow: hidden;
}

.app-logo.bordered {
  border: 1px solid #e2e8f0;
}

.app-logo.shape-circle {
  border-radius: 50%;
}

.app-logo.shape-rounded {
  border-radius: 22%;
}

.app-logo.on-dark {
  background: #1e293b;
  border-color: #1e293b;
}

.app-logo img {
  display: block;
  height: 100%;
  width: 100%;
}

.app-logo img.fit-cover {
  object-fit: cover;
}

.app-logo img.fit-contain {
  object-fit: contain;
}

.app-logo-initials {
  align-items: center;
  background: #e8edf5;
  color: #52658a;
  display: flex;
  font-weight: 700;
  height: 100%;
  justify-content: center;
  width: 100%;
}
</style>
