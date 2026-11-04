<template>
  <section class="links-card">
    <header class="links-header">
      <div>
        <h4>Payment links</h4>
        <p>Collect payment links, newest first. A payment shows here within about 15 minutes, or straight away with Refresh.</p>
      </div>
      <div class="links-tools">
        <v-text-field
          v-model="appFilter"
          placeholder="Filter by app ID"
          clearable
          outlined
          dense
          hide-details
          color="primary"
          class="app-filter mono-text"
        ></v-text-field>
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          outlined
          dense
          hide-details
          color="primary"
          class="status-filter"
        ></v-select>
        <button type="button" class="ghost-btn" :disabled="loading" @click="load()">
          <v-icon x-small>mdi-refresh</v-icon> {{ loading ? 'Loading…' : 'Refresh' }}
        </button>
      </div>
    </header>

    <p v-if="error" class="field-error mb-2">
      {{ error }}
      <button type="button" class="link-btn" @click="load()">Try again</button>
    </p>

    <div class="links-table-wrapper">
      <table class="links-table">
        <thead>
          <tr>
            <th>Created</th>
            <th>Order</th>
            <th>Customer</th>
            <th>App</th>
            <th class="text-right">Credits</th>
            <th class="text-right">Total</th>
            <th>Status</th>
            <th>Expires</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!links.length">
            <td colspan="9" class="empty-row">{{ loading ? 'Loading payment links…' : 'No payment links yet.' }}</td>
          </tr>
          <template v-for="link in links">
            <tr :key="link.orderId" class="link-row" :class="{ expanded: expanded === link.orderId }" @click="toggle(link)">
              <td>{{ dateTime(link.createdAt) }}</td>
              <td class="mono-text nowrap">{{ link.orderNumber }}</td>
              <td>{{ link.org && link.org.companyName }}</td>
              <td>
                <div>{{ link.appName }}</div>
                <button
                  v-if="link.appId"
                  type="button"
                  class="app-id mono-text"
                  title="Copy app ID"
                  @click.stop="copyAppId(link)"
                >{{ link.appId }}</button>
              </td>
              <td class="text-right">{{ count(link.credits, link.currency) }}</td>
              <td class="text-right">{{ money(link.totalMinor, link.currency) }}</td>
              <td>
                <span class="link-status" :class="badge(link).className" :title="badge(link).tooltip">{{ badge(link).label }}</span>
              </td>
              <td>{{ link.status === 'PENDING_PAYMENT' || link.status === 'EXPIRED' ? dateTime(link.expiresAt) : '—' }}</td>
              <td class="text-right" @click.stop>
                <div class="row-actions">
                  <template v-if="link.status === 'PENDING_PAYMENT'">
                    <button v-if="link.url" type="button" class="icon-btn" title="Copy link" @click="copyLink(link)">
                      <v-icon x-small>mdi-content-copy</v-icon>
                    </button>
                    <button type="button" class="icon-btn" title="Resend email" :disabled="!!busy[link.orderId]" @click="resend(link)">
                      <v-icon x-small>mdi-email-fast-outline</v-icon>
                    </button>
                    <button type="button" class="icon-btn danger" title="Void" :disabled="!!busy[link.orderId]" @click="openVoid(link)">
                      <v-icon x-small>mdi-cancel</v-icon>
                    </button>
                  </template>
                  <button
                    v-if="link.status === 'FULFILLED' && link.invoice"
                    type="button"
                    class="ghost-btn"
                    :disabled="!!busy[link.orderId]"
                    @click="downloadInvoice(link)"
                  >
                    <v-icon x-small>mdi-tray-arrow-down</v-icon>
                    {{ busy[link.orderId] === 'download' ? 'Preparing…' : 'Download invoice' }}
                  </button>
                  <button type="button" class="icon-btn" title="Refresh" :disabled="!!busy[link.orderId]" @click="refreshRow(link)">
                    <v-icon x-small :class="{ spinning: busy[link.orderId] === 'refresh' }">mdi-refresh</v-icon>
                  </button>
                </div>
                <div v-if="notes[link.orderId]" class="row-note" :class="{ 'is-error': notes[link.orderId].error }">
                  {{ notes[link.orderId].text }}
                </div>
                <div v-else-if="badge(link).hint" class="row-note">{{ badge(link).hint }}</div>
              </td>
            </tr>
            <tr v-if="expanded === link.orderId" :key="`${link.orderId}-details`" class="details-row">
              <td colspan="9">
                <dl class="details-grid">
                  <div><dt>Delivery</dt><dd>{{ link.sentTo ? `Emailed to ${link.sentTo}` : 'Not emailed' }}</dd></div>
                  <div v-if="link.lastSentAt"><dt>Last sent</dt><dd>{{ dateTime(link.lastSentAt) }}</dd></div>
                  <div><dt>Validity</dt><dd>{{ link.validityDays }} days from activation</dd></div>
                  <div v-if="link.totalBeforeTaxMinor !== undefined"><dt>Amount excl. tax</dt><dd>{{ money(link.totalBeforeTaxMinor, link.currency) }}</dd></div>
                  <div v-if="link.url"><dt>Link</dt><dd class="mono-text">{{ link.url }}</dd></div>
                  <div v-if="link.invoice"><dt>Invoice</dt><dd class="mono-text">{{ link.invoice.invoiceNumber }}</dd></div>
                  <div v-if="link.payment && link.payment.method"><dt>Paid via</dt><dd>{{ link.payment.method }}</dd></div>
                  <div v-if="link.cancelReason"><dt>Void reason</dt><dd>{{ link.cancelReason }}</dd></div>
                  <div v-if="link.failureReason"><dt>Problem</dt><dd>{{ link.failureReason }}</dd></div>
                  <div v-if="link.note"><dt>Internal note</dt><dd>{{ link.note }}</dd></div>
                </dl>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="pageCount > 1" class="links-pager">
      <button type="button" class="ghost-btn" :disabled="loading || page <= 1" @click="goTo(page - 1)">Previous</button>
      <span>Page {{ page }} of {{ pageCount }}</span>
      <button type="button" class="ghost-btn" :disabled="loading || page >= pageCount" @click="goTo(page + 1)">Next</button>
    </div>

    <b-modal v-model="voiding.open" centered hide-footer title="Void payment link" @hidden="voiding = emptyVoid()">
      <template v-if="voiding.link">
        <p class="small mb-2">
          {{ voiding.link.orderNumber }} · {{ voiding.link.org && voiding.link.org.companyName }} ·
          {{ money(voiding.link.totalMinor, voiding.link.currency) }}
        </p>
        <p class="field-hint text-muted mb-3">
          The customer won't be able to pay this link any more. If they paid another way, for example by bank
          transfer, void the link and then use Already paid.
        </p>
        <label class="input-label">Reason</label>
        <v-textarea
          v-model="voiding.reason"
          rows="2"
          maxlength="500"
          outlined
          dense
          hide-details
          color="primary"
          placeholder="e.g. Customer paid by bank transfer instead"
        ></v-textarea>
        <div v-if="voiding.error" class="confirm-error" role="alert">
          {{ voiding.error }}
        </div>
        <div class="d-flex justify-end mt-4" style="gap: 8px;">
          <v-btn outlined depressed :disabled="voiding.busy" @click="voiding.open = false">Cancel</v-btn>
          <v-btn color="#b42318" depressed :disabled="voiding.busy || !voiding.reason.trim()" :loading="voiding.busy" @click="confirmVoid">
            <span style="color: white;">{{ voiding.retry ? 'Retry' : 'Void link' }}</span>
          </v-btn>
        </div>
      </template>
    </b-modal>
  </section>
</template>

<script>
import UtilsMixin from '../../../mixins/utils.js';
import {
  BillingError,
  listAdminPaymentLinks,
  getAdminPaymentLink,
  resendAdminPaymentLink,
  cancelAdminPaymentLink,
  getAdminInvoice,
} from '../../../utils/billingApi';
import { formatMinor, formatCount } from '../../../utils/billingFormat';
import { downloadInvoiceDocument } from '../../../components/credit/invoice/downloadInvoice';

const LIMIT = 10;
const DEBOUNCE_MS = 400;

// PaymentLink.status → badge, actions hint (contract §7)
const BADGES = {
  PENDING_PAYMENT: { label: 'Awaiting payment', className: 'is-awaiting' },
  PAID: { label: 'Processing', className: 'is-processing', hint: 'Paid. Refresh shortly.' },
  FULFILLED: { label: 'Paid', className: 'is-paid' },
  EXPIRED: { label: 'Expired', className: 'is-muted', hint: 'Create a new link to collect again.' },
  CANCELLED: { label: 'Void', className: 'is-muted' },
  FAILED: { label: 'Failed', className: 'is-failed', hint: 'Create a new link.' },
  NEEDS_REVIEW: { label: 'Needs review', className: 'is-failed', hint: 'Amount mismatch, contact support.' },
  CREATED: { label: 'Creating…', className: 'is-muted' },
};

const emptyVoid = () => ({ open: false, link: null, reason: '', busy: false, error: '', retry: false });

function networkOr(error, fallback) {
  return error instanceof BillingError ? error.message || fallback : 'Could not reach the server. Please try again.';
}

export default {
  name: 'PaymentLinksTable',
  mixins: [UtilsMixin],
  data() {
    return {
      links: [],
      page: 1,
      total: 0,
      loading: false,
      error: '',
      listRequest: 0,
      appFilter: '',
      filterTimer: null,
      statusFilter: '',
      statusOptions: [
        { text: 'All statuses', value: '' },
        ...Object.entries(BADGES).filter(([status]) => status !== 'CREATED').map(([value, b]) => ({ text: b.label, value })),
      ],
      expanded: null,
      // orderId → 'refresh' | 'resend' | 'download' while a row action runs
      busy: {},
      // orderId → { text, error }: the last row action's outcome
      notes: {},
      voiding: emptyVoid(),
    };
  },
  computed: {
    pageCount() {
      return Math.max(1, Math.ceil(this.total / LIMIT));
    },
    appId() {
      return (this.appFilter || '').trim();
    },
  },
  watch: {
    appId() {
      clearTimeout(this.filterTimer);
      this.filterTimer = setTimeout(() => this.goTo(1), DEBOUNCE_MS);
    },
    statusFilter() {
      this.goTo(1);
    },
  },
  mounted() {
    this.load();
  },
  beforeDestroy() {
    clearTimeout(this.filterTimer);
  },
  methods: {
    emptyVoid,
    badge(link) {
      const b = BADGES[link.status] || { label: link.status, className: 'is-muted' };
      return link.status === 'CANCELLED' ? { ...b, tooltip: link.cancelReason || '' } : b;
    },
    money(minor, currency) {
      return formatMinor(minor, currency);
    },
    count(value, currency) {
      return formatCount(value, currency);
    },
    dateTime(value) {
      if (!value) return '—';
      return new Date(value).toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    goTo(page) {
      this.page = page;
      this.load();
    },
    // Also called by SettingConfig each time the Payment links tab opens
    async load() {
      const request = ++this.listRequest;
      this.loading = true;
      this.error = '';
      try {
        const json = await listAdminPaymentLinks({
          appId: this.appId || undefined,
          status: this.statusFilter || undefined,
          page: this.page,
          limit: LIMIT,
        });
        if (request !== this.listRequest) return;
        this.links = Array.isArray(json && json.data) ? json.data : [];
        this.total = Number(json && json.total) || 0;
      } catch (error) {
        if (request !== this.listRequest) return;
        this.error = error.status === 403 ? 'Only super admins can see payment links.' : networkOr(error, 'Could not load the payment links.');
      } finally {
        if (request === this.listRequest) this.loading = false;
      }
    },
    replaceRow(updated) {
      const index = this.links.findIndex(l => l.orderId === updated.orderId);
      if (index === -1) return;
      // Keep the list's org if an action's answer leaves it out
      this.links.splice(index, 1, { ...updated, org: updated.org || this.links[index].org });
    },
    setNote(orderId, text, error = false) {
      this.$set(this.notes, orderId, text ? { text, error } : null);
    },
    setBusy(orderId, value) {
      this.$set(this.busy, orderId, value);
    },
    toggle(link) {
      if (this.expanded === link.orderId) {
        this.expanded = null;
        return;
      }
      this.expanded = link.orderId;
      this.refreshRow(link);
    },
    // GET …/payment-links/:orderId checks Razorpay first, so a payment shows straight away
    async refreshRow(link, { quiet = false } = {}) {
      if (this.busy[link.orderId]) return;
      this.setBusy(link.orderId, 'refresh');
      if (!quiet) this.setNote(link.orderId, '');
      try {
        this.replaceRow(await getAdminPaymentLink(link.orderId));
      } catch (error) {
        if (!quiet) this.setNote(link.orderId, networkOr(error, 'Could not refresh this link.'), true);
      } finally {
        this.setBusy(link.orderId, null);
      }
    },
    async copyLink(link) {
      try {
        await navigator.clipboard.writeText(link.url);
        this.notifySuccess('Link copied');
      } catch (e) {
        this.notifyErr('Could not copy the link');
      }
    },
    async copyAppId(link) {
      try {
        await navigator.clipboard.writeText(link.appId);
        this.notifySuccess('App ID copied');
      } catch (e) {
        this.notifyErr('Could not copy the app ID');
      }
    },
    async resend(link) {
      if (this.busy[link.orderId]) return;
      this.setBusy(link.orderId, 'resend');
      this.setNote(link.orderId, '');
      try {
        const updated = await resendAdminPaymentLink(link.orderId);
        this.replaceRow(updated);
        this.setNote(link.orderId, `Sent again to ${updated.sentTo}`);
      } catch (error) {
        if (error.code === 'ORDER_NOT_PAYABLE') {
          this.setBusy(link.orderId, null);
          await this.refreshRow(link, { quiet: true });
          this.setNote(link.orderId, 'This link isn\'t open any more.', true);
          return;
        }
        const text = error.code === 'PAYMENTS_UNAVAILABLE'
          ? 'Razorpay didn\'t answer. Try Resend again.'
          : networkOr(error, 'Could not resend the link.');
        this.setNote(link.orderId, text, true);
      } finally {
        this.setBusy(link.orderId, null);
      }
    },
    openVoid(link) {
      this.voiding = { ...emptyVoid(), open: true, link };
    },
    async confirmVoid() {
      const { link } = this.voiding;
      const reason = this.voiding.reason.trim();
      if (!link || !reason || this.voiding.busy) return;
      this.voiding = { ...this.voiding, busy: true, error: '' };
      try {
        this.replaceRow(await cancelAdminPaymentLink(link.orderId, reason));
        this.setNote(link.orderId, '');
        this.voiding.open = false;
      } catch (error) {
        if (error.code === 'ORDER_NOT_CANCELLABLE') {
          this.voiding.open = false;
          await this.refreshRow(link, { quiet: true });
          this.setNote(link.orderId, 'This link has already been paid.');
          return;
        }
        const retry = error.code === 'PAYMENTS_UNAVAILABLE' || !(error instanceof BillingError);
        const text = error.code === 'PAYMENTS_UNAVAILABLE'
          ? 'Razorpay didn\'t answer, so the link is still open. Try again.'
          : networkOr(error, 'Could not void the link.');
        this.voiding = { ...this.voiding, busy: false, error: text, retry };
      }
    },
    // The invoice exists only once the link is FULFILLED (contract §7)
    async downloadInvoice(link) {
      if (this.busy[link.orderId]) return;
      this.setBusy(link.orderId, 'download');
      this.setNote(link.orderId, '');
      try {
        await downloadInvoiceDocument(await getAdminInvoice(link.invoice.invoiceId));
      } catch (error) {
        this.setNote(link.orderId, error.code === 'INVOICE_NOT_FOUND' ? 'This invoice could not be found.' : error.message || 'Could not prepare the invoice.', true);
      } finally {
        this.setBusy(link.orderId, null);
      }
    },
  },
};
</script>

<style scoped>
.links-card {
  padding: 16px 18px;
  border: 1px solid #e1e6ed;
  border-radius: 10px;
  background: #fff;
}

.links-header { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.links-header h4 { margin: 0; color: #263244; font-size: 14px; font-weight: 700; }
.links-header p { margin: 2px 0 0; color: #8793a5; font-size: 11px; }
.links-tools { display: flex; align-items: center; gap: 8px; }
.status-filter { width: 170px; }
.app-filter { width: 230px; }
/* Filters in the table's type size; Refresh as tall as the dense fields */
.links-tools ::v-deep .v-input input,
.links-tools ::v-deep .v-select__selection { font-size: 12px; }
.links-tools .ghost-btn { height: 40px; }

.links-table-wrapper { overflow-x: auto; }
.links-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.links-table th {
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}
.links-table td { padding: 8px; border-bottom: 1px solid #f1f5f9; color: #263244; vertical-align: top; }
.links-table .text-right { text-align: right; }
.link-row { cursor: pointer; }
.nowrap { white-space: nowrap; }
.link-row:hover, .link-row.expanded { background: #f8fafc; }
.empty-row { padding: 18px 8px !important; color: #8793a5 !important; text-align: center; }

.details-row td { background: #f8fafc; }
.details-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin: 0; }
.details-grid dt { color: #8793a5; font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
.details-grid dd { margin: 2px 0 0; color: #263244; font-size: 12px; word-break: break-all; }

.app-id { display: block; max-width: 220px; padding: 0; overflow: hidden; color: #8793a5; font-size: 10px; text-align: left; text-overflow: ellipsis; white-space: nowrap; }
.app-id:hover { color: #2563dc; }

.link-status {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}
.link-status.is-awaiting { background: #fff4e5; color: #b45309; }
.link-status.is-processing { background: #e6efff; color: #2563dc; }
.link-status.is-paid { background: #e7f6ec; color: #15803d; }
.link-status.is-muted { background: #f1f5f9; color: #64748b; }
.link-status.is-failed { background: #fef3f2; color: #b42318; }

.row-actions { display: inline-flex; align-items: center; justify-content: flex-end; gap: 4px; }
.row-note { margin-top: 4px; color: #52627a; font-size: 11px; white-space: normal; }
.row-note.is-error { color: #b42318; }

.icon-btn {
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border: 1px solid #d5dde7;
  border-radius: 6px;
  background: #fff;
  color: #344054;
}
.icon-btn:hover:not(:disabled) { border-color: #2f6fec; color: #2563dc; }
.icon-btn.danger:hover:not(:disabled) { border-color: #b42318; color: #b42318; }
.icon-btn:disabled { cursor: progress; opacity: .6; }
.icon-btn .v-icon { color: inherit; }

.ghost-btn {
  display: inline-flex;
  height: 30px;
  align-items: center;
  gap: 5px;
  padding: 0 11px;
  border: 1px solid #d5dde7;
  border-radius: 6px;
  background: #fff;
  color: #344054;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.ghost-btn:hover:not(:disabled) { border-color: #2f6fec; background: #f7faff; color: #2563dc; }
.ghost-btn:disabled { cursor: not-allowed; opacity: .6; }
.ghost-btn .v-icon { color: inherit; }

.links-pager { display: flex; align-items: center; justify-content: flex-end; gap: 10px; margin-top: 10px; color: #52627a; font-size: 12px; }

.spinning { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.mono-text { font-family: 'JetBrains Mono', monospace !important; }
.text-muted { color: #64748b !important; }
.small { font-size: 0.85rem; }
.field-hint { font-size: 0.75rem; }
.field-error { color: #b42318; font-size: 0.75rem; }
.link-btn { padding: 0; color: #2563dc; font-weight: 600; text-decoration: underline; }
.input-label { display: block; margin-bottom: 4px; color: #64748b; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
.confirm-error {
  margin-top: 12px;
  padding: 8px 10px;
  border: 1px solid #fecdca;
  border-radius: 8px;
  background: #fef3f2;
  color: #b42318;
  font-size: 12px;
}
</style>
