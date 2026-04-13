<template>
  <div class="row">
    <div v-if="isLoading" class="col-12 d-flex justify-content-center py-5">
      <b-spinner variant="primary"></b-spinner>
    </div>
    <div v-else class="col-12">
      <div class="row">
        <div
          class="col-12 col-md-6 col-lg-4 mb-2"
          v-for="eachOrg in services"
          :key="eachOrg.appId"
        >
      <b-card class="issuer-card h-100 shadow-sm border-0">
        <div class="d-flex align-items-center px-0 pb-0">
          <div class="rounded-circle border shadow-sm overflow-hidden" style="width:48px;height:48px;flex-shrink:0">
            <img
              :src="eachOrg.logoUrl || getProfileIcon(formattedAppName(eachOrg.appId))"
              alt="Issuer Logo"
              class="w-100 h-100"
              style="object-fit:cover"
            />
          </div>

          <div class="ml-auto">
            <div v-if="isSelection" class="selection-area">
              <b-form-checkbox
                :checked="eachOrg.selected"
                @change="onIssuerToggle(eachOrg)"
                class="m-0"
              ></b-form-checkbox>
            </div>
            <div v-else>
              <span class="verified-badge">
                <i class="mdi mdi-check-decagram mr-1"></i>Verified
              </span>
            </div>
          </div>
        </div>

        <div class="pt-2 pb-1">
          <span class="issuer-title">
            {{ formattedAppName(eachOrg.appName) }}
          </span>
        </div>

        <div>
          <div class="issuer-domain text-truncate">
            <i class="mdi mdi-link-variant mr-1"></i>
            {{ domainFromOrigin(eachOrg.domain) }}
          </div>

          <div class="issuer-did-box mt-3">
            <label class="did-label">Issuer DID</label>
            <div class="did-value">{{ eachOrg.issuerDid }}</div>
          </div>
        </div>
        </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.issuer-card {
  border-radius: 0.75rem !important; /* 12px per your design spec */
  transition: all 0.25s ease-in-out;
  border: 1px solid #e5e7eb !important;
  background-color: #ffffff !important;
}

.issuer-card:hover {
  transform: translateY(-4px);
  border-color: #3b82f6 !important; /* Primary Blue */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
}

.issuer-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: -0.01em;
}

.issuer-domain {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

.verified-badge {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #059669;
  background: #ecfdf5;
  padding: 4px 8px;
  border-radius: 6px;
}

.issuer-did-box {
  background: #f8fafc;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
}

.did-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 2px;
  letter-spacing: 0.05em;
}

.did-value {
  font-family: "Monaco", "Consolas", monospace;
  font-size: 0.7rem;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Custom Vuetify Overrides */
.v-list-item-avatar {
  margin-right: 0 !important;
}
</style>

<script>
import UtilsMixin from "../mixins/utils";
import { mapGetters, mapMutations, mapActions } from "vuex/dist/vuex.common.js";

export default {
  name: "MarketplaceList",
  props: {
    isSelection: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  async mounted() {
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
      return this.getMarketPlaceApps.filter((app) => !!app.issuerDid);
    },
  },
  methods: {
    ...mapActions("mainStore", ["fetchMarketPlaceAppsFromServer"]),
    ...mapMutations("mainStore", ["insertMarketplaceApps"]),
    onIssuerToggle(eachOrg) {
      // Toggle selected state and commit to the store
      const updated = this.getMarketPlaceApps.map((x) =>
        x.appId === eachOrg.appId ? { ...x, selected: !x.selected } : x
      );
      this.insertMarketplaceApps(updated);
      const updatedOrg = updated.find((x) => x.appId === eachOrg.appId);
      this.$emit("selectedServiceEvent", {
        issuerDid: updatedOrg.issuerDid,
        selected: updatedOrg.selected,
        appId: updatedOrg.appId,
      });
    },
    formattedAppName(appName) {
      if (appName == "" || appName == undefined) appName = "No app name";
      return this.truncate(appName, 25);
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
