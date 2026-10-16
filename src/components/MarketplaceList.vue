<template>
  <div class="row marketplace-list" :class="{ horizontal: horizontal }">
    <div v-if="isLoading" class="col-12">
      <SectionLoader label="Loading services" />
    </div>
    <div v-else class="col-12">
      <div class="row issuer-grid">
        <div
          class="issuer-item col-12 col-md-6 col-lg-4"
          v-for="eachOrg in services"
          :key="eachOrg.appId"
        >
          <!-- In selection mode (Trusted Issuer picker) the whole card toggles the issuer -->
          <article
            class="issuer-card"
            :class="{ 'is-selectable': isSelection, 'is-selected': isSelection && eachOrg.selected }"
            @click="isSelection && onIssuerToggle(eachOrg)"
          >
            <header class="issuer-head">
              <AppLogo
                class="issuer-logo"
                :src="eachOrg.logoUrl"
                :name="appName(eachOrg)"
                :seed="formattedAppName(eachOrg.appId)"
                :size="48"
              />
              <div class="issuer-identity">
                <h3 class="issuer-title" :title="appName(eachOrg)">{{ appName(eachOrg) }}</h3>
                <a
                  v-if="eachOrg.domain"
                  class="issuer-domain"
                  :href="domainHref(eachOrg.domain)"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click.stop
                >
                  {{ domainFromOrigin(eachOrg.domain) }}<i class="mdi mdi-open-in-new" aria-hidden="true"></i>
                </a>
              </div>
              <v-checkbox
                v-if="isSelection"
                :input-value="eachOrg.selected"
                @change="onIssuerToggle(eachOrg)"
                color="primary"
                hide-details
                class="issuer-select ma-0 pa-0"
                :aria-label="`Trust ${appName(eachOrg)}`"
                @click.native.stop
              ></v-checkbox>
              <span v-else class="verified-badge" title="Verified issuer">
                <i class="mdi mdi-check-decagram" aria-hidden="true"></i>Verified
              </span>
            </header>

            <div class="issuer-did">
              <span class="did-label">Issuer DID</span>
              <span class="did-value" :title="eachOrg.issuerDid">{{ eachOrg.issuerDid }}</span>
              <button type="button" class="did-copy" title="Copy issuer DID" @click.stop="copyToClip(eachOrg.issuerDid, 'Issuer DID')">
                <i class="mdi mdi-content-copy" aria-hidden="true"></i>
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marketplace-list.horizontal {
  margin-left: 0;
  margin-right: 0;
}

.marketplace-list.horizontal > .col-12 {
  padding-left: 0;
  padding-right: 0;
}

.marketplace-list.horizontal .issuer-grid {
  flex-wrap: nowrap;
  margin-left: 0;
  margin-right: 0;
  width: max-content;
}

.marketplace-list.horizontal .issuer-item {
  flex: 0 0 280px;
  max-width: 280px;
}

.issuer-item {
  padding-bottom: 12px;
}

/* Card */
.issuer-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  padding: 16px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.issuer-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
}

.issuer-card.is-selectable {
  cursor: pointer;
}

.issuer-card.is-selected {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px #2563eb;
}

.issuer-head {
  align-items: flex-start;
  display: flex;
  gap: 12px;
}

.issuer-identity {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

/* Full name, wrapped onto at most two lines */
.issuer-title {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #111827;
  display: -webkit-box;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
  overflow: hidden;
  overflow-wrap: anywhere;
}

.issuer-domain {
  align-items: center;
  align-self: flex-start;
  color: #64748b;
  display: inline-flex;
  font-size: 0.8rem;
  gap: 3px;
  max-width: 100%;
  overflow: hidden;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.issuer-domain:hover {
  color: #2563eb;
  text-decoration: underline;
}

.issuer-domain .mdi {
  font-size: 0.8rem;
}

.verified-badge {
  align-items: center;
  background: #ecfdf5;
  border-radius: 999px;
  color: #047857;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 0.7rem;
  font-weight: 700;
  gap: 3px;
  padding: 3px 8px;
}

.issuer-select {
  flex: 0 0 auto;
}

/* DID row */
.issuer-did {
  align-items: center;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding: 6px 6px 6px 10px;
}

.did-label {
  color: #94a3b8;
  flex: 0 0 auto;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.did-value {
  color: #475569;
  flex: 1;
  font-family: "Monaco", "Consolas", monospace;
  font-size: 0.7rem;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.did-copy {
  background: transparent;
  border: 0;
  border-radius: 4px;
  color: #64748b;
  flex: 0 0 auto;
  line-height: 1;
  padding: 4px;
}

.did-copy:hover {
  background: #e2e8f0;
  color: #111827;
}

/* Logo rendering lives in AppLogo; this only adds the card's soft shadow */
.issuer-logo {
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
}
</style>

<script>
import UtilsMixin from "../mixins/utils";
import { mapGetters, mapActions } from "vuex/dist/vuex.common.js";
import SectionLoader from "./element/SectionLoader.vue";
import AppLogo from "./element/AppLogo.vue";

export default {
  name: "MarketplaceList",
  components: { SectionLoader, AppLogo },
  props: {
    isSelection: {
      type: Boolean,
      default: true,
    },
    selectedIssuerDids: {
      type: Array,
      default: () => [],
    },
    fetchOnMount: {
      type: Boolean,
      default: true,
    },
    items: {
      type: Array,
      default: null,
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  async mounted() {
    if (!this.fetchOnMount) return;

    try {
      this.isLoading = true;
      await this.fetchMarketPlaceAppsFromServer();
    } catch (e) {
      console.error('Error fetching marketplace apps', e);
    } finally {
      this.isLoading = false;
    }
  },
  computed: {
    ...mapGetters("mainStore", ["getMarketPlaceApps"]),
    services() {
      return (this.items || this.getMarketPlaceApps)
        .filter((app) => !!app.issuerDid)
        .map((app) => ({
          ...app,
          selected: this.selectedIssuerDids.includes(app.issuerDid),
        }));
    },
  },
  methods: {
    ...mapActions("mainStore", ["fetchMarketPlaceAppsFromServer"]),

    onIssuerToggle(eachOrg) {
      this.$emit("selectedServiceEvent", {
        issuerDid: eachOrg.issuerDid,
        selected: !eachOrg.selected,
        appId: eachOrg.appId,
      });
    },
    formattedAppName(appName) {
      if (appName == "" || appName == undefined) appName = "No app name";
      return this.truncate(appName, 25);
    },
    // Full name; the card wraps it onto two lines instead of cutting out the middle
    appName(app) {
      return (app.appName || '').trim() || 'Unnamed issuer';
    },
    domainHref(domain) {
      return /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;
    },
    domainFromOrigin(domain) {
      try {
        const url = new URL(domain);
        return url.host;
      } catch (e) {
        return domain;
      }
    },
  },
  mixins: [UtilsMixin],
};
</script>
