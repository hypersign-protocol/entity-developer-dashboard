<template>
    <b-container fluid class="py-3">
        <loadIng :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loadIng>
        <AccessDenied v-if="accessDenied" />
        <template v-if="!accessDenied">
        <v-row align="center" class="mb-6 ">
            <v-col cols="12" md="6">
                <h4 class="font-weight-bold mb-0">Credits Management</h4>
                <p class="text-subtitle-2 text-muted">Manage your API balance and subscription history</p>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-end">
                <div class="ml-auto">
                    <hf-buttons name="Refresh" iconClass="arrow-clockwise" :bIcon="true" outlined
                        @executeAction="reloadData()"></hf-buttons>
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" lg="5">
                <div class="overview-container h-100">
                    <div class="header-row">
                        <h2 class="title">Credit Allocation</h2>
                    </div>
                    <div class="chart-wrapper mt-2">
                        <canvas id="doughNutChat"></canvas>
                    </div>
                    <div class="text-center mt-n4">
                        <span class="badge" :class="timeRemaining === 'Expired' ? 'badge-expired' : 'badge-active'">
                            {{ timeRemaining === 'Expired' ? 'Expired' : 'Subscription Active' }}
                        </span>
                    </div>
                </div>
            </v-col>

            <v-col cols="12" lg="7">
                <div class="overview-container h-100">
                    <div class="header-row">
                        <h2 class="title">Balance Overview</h2>
                        <hf-buttons v-if="canTopUp" name="Top up" iconClass="mdi-wallet-plus-outline" variant="primary"
                            @executeAction="topUpOpen = true"></hf-buttons>
                    </div>

                    <div class="d-flex flex-column justify-center">
                        <div class="mb-4">
                            <p class="text-muted mb-0 font-weight-medium">Remaining Balance</p>
                            <div class="d-flex align-baseline">
                                <h1 class="display-1 font-weight-bold color-blue mb-0">
                                    {{ numberFormat(myKYCCredits.allRemainingCredits) }}
                                </h1>
                                <span class="ml-2 text-h6 text-muted">
                                    / {{ numberFormat(myKYCCredits.allAvailableCredits) }} Credits
                                </span>
                            </div>
                            <button type="button" class="calculator-callout mt-3" @click="calculatorOpen = true">
                                <span class="calculator-callout-icon" aria-hidden="true">
                                    <v-icon>{{ hasSavedCalculatorConfiguration ? 'mdi-chart-bar' : 'mdi-calculator-variant-outline' }}</v-icon>
                                </span>
                                <span class="calculator-callout-copy">
                                    <template v-if="hasSavedCalculatorConfiguration">
                                        <strong>{{ numberFormat(savedVerificationEstimate) }} verification flows available</strong>
                                        <small>
                                            Based on configurations you saved
                                        </small>
                                    </template>
                                    <template v-else>
                                        <strong>See how many verifications you can perform</strong>
                                        <small>Select your verification flow to get an estimate.</small>
                                    </template>
                                </span>
                                <span class="calculator-callout-action">
                                    {{ hasSavedCalculatorConfiguration ? 'Edit configuration' : 'Calculate now' }}
                                    <v-icon small>mdi-arrow-right</v-icon>
                                </span>
                            </button>
                        </div>

                        <div>
                            <v-divider class="mb-4"></v-divider>

                            <v-row no-gutters>
                                <v-col cols="6">
                                    <p class="text-muted mb-1 small uppercase font-weight-bold">Status</p>
                                    <p class="mb-0 font-weight-bold" :class="statusColorClass">
                                        {{ timeRemaining === 'Expired' || timeRemaining === 'InActive' ? timeRemaining :
                                        'Active' }}
                                    </p>
                                </v-col>
                                <v-col cols="6" class="text-right">
                                    <p class="text-muted mb-1 small uppercase font-weight-bold">Validity</p>
                                    <p class="mb-0 font-weight-bold">
                                        {{ timeRemaining === 'Expired' ? 'None' : timeRemaining }}
                                    </p>
                                </v-col>
                            </v-row>
                        </div>


                    </div>
                </div>
            </v-col>
        </v-row>

        <v-row v-if="getKYCCredits.length > 0 || paymentLinks.length > 0">
            <v-col cols="12">
                <div class="overview-container">
                    <div class="header-row">
                        <h2 class="title">Credit Purchase History</h2>
                        <div class="header-tools">
                            <template v-if="paymentLinks.length">
                                <span v-if="awaitingPaidLink" class="text-muted small">Payment received? It can take a few minutes to appear.</span>
                                <button type="button" class="invoice-btn" :disabled="refreshingLinks" @click="refreshAfterPayment">
                                    <v-icon x-small>mdi-refresh</v-icon> {{ refreshingLinks ? 'Refreshing…' : 'Refresh' }}
                                </button>
                            </template>
                            <span class="badge">{{ getKYCCredits.length }} Packages</span>
                        </div>
                    </div>

                    <!-- Collect payment links from Hypersign (contract §7.6) -->
                    <div v-if="paymentLinks.length" class="payment-request-banner">
                        <v-icon small>mdi-receipt-text-clock-outline</v-icon>
                        <span v-if="paymentLinks.length === 1">
                            You have a payment request from Hypersign for {{ numberFormat(paymentLinks[0].credits) }} credits.
                        </span>
                        <span v-else>You have {{ paymentLinks.length }} payment requests from Hypersign.</span>
                        <button v-if="paymentLinks.length === 1" type="button" class="pay-now-btn" @click="payNow(paymentLinks[0])">
                            Pay now <v-icon x-small>mdi-open-in-new</v-icon>
                        </button>
                    </div>

                    <div class="usage-table-wrapper">
                        <table class="usage-table">
                            <thead>
                                <tr>
                                    <th>Purchase Date</th>
                                    <th class="text-right">Total Credits</th>
                                    <th>Expiration / Status</th>
                                    <th width="20%">Usage</th>
                                    <th>Invoice</th>
                                    <th class="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- No invoice exists until the link is paid: no number, no Download -->
                                <tr v-for="link in paymentLinks" :key="link.orderId" class="awaiting-row">
                                    <td>
                                        <div class="font-weight-bold">{{ formatDate(link.createdAt) }}</div>
                                        <code class="small text-muted">{{ link.orderNumber }}</code>
                                    </td>
                                    <td class="text-right">
                                        <div class="font-weight-bold">{{ numberFormat(link.credits) }}</div>
                                        <div class="small text-muted">credits · valid {{ link.validityDays }} days</div>
                                    </td>
                                    <td>
                                        <span class="invoice-status is-due">Awaiting payment</span>
                                        <div class="small text-muted mt-1">Due by {{ shortDate(link.expiresAt) }}</div>
                                    </td>
                                    <td>
                                        <div class="font-weight-bold">{{ formatMinorAmount(link.totalMinor, link.currency) }}</div>
                                        <div class="small text-muted">To pay, incl. GST</div>
                                    </td>
                                    <td class="invoice-cell"><span class="text-muted small">Issued after payment</span></td>
                                    <td class="text-center">
                                        <button type="button" class="pay-now-btn" @click="payNow(link)">
                                            Pay now <v-icon x-small>mdi-open-in-new</v-icon>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-for="eachRow in getSortedKYCCredits" :key="eachRow._id">
                                    <td>
                                        <div class="font-weight-bold">{{ formatDate(eachRow.createdAt) }}</div>
                                        <code class="small text-muted">{{ eachRow._id.substring(0, 8) }}...</code>
                                    </td>
                                    <td class="text-right font-weight-bold">
                                        {{ numberFormat(eachRow.totalCredits) }}
                                    </td>
                                    <td>
                                        <div v-if="eachRow.used >= eachRow.totalCredits" class="text-muted small">
                                            <v-icon small color="grey">mdi-check-circle</v-icon> Fully Used
                                        </div>
                                        <div v-else-if="Date.now() > new Date(eachRow.expiresAt)"
                                            class="color-danger small">
                                            <v-icon small color="red">mdi-clock-alert</v-icon> Expired
                                        </div>
                                        <div v-else class="small font-weight-medium">
                                            {{ isValidDate(eachRow.expiresAt) ? formatTimeRemaining(eachRow.expiresAt) :
                                            'Pending Activation' }}
                                        </div>
                                    </td>
                                   <td :title="`Credit left: ${eachRow.totalCredits - eachRow.used}`">
                                        <div class="d-flex flex-column">
                                            <b-progress :max="eachRow.totalCredits" class="mt-1" height="12px">
                                                <b-progress-bar 
                                                    :value="eachRow.used >= eachRow.totalCredits ? eachRow.totalCredits : eachRow.used" 
                                                    :variant="getProgressVariant(eachRow)"
                                                    :class="{'progress-full': eachRow.used >= eachRow.totalCredits}"
                                                ></b-progress-bar>
                                            </b-progress>
                                            
                                            <span class="small text-muted mt-1">
                                                {{ eachRow.used >= eachRow.totalCredits ? '100% Used' : Math.round((eachRow.used / eachRow.totalCredits) * 100) + '% Used' }}
                                            </span>
                                        </div>
                                    </td>

                                    <td class="invoice-cell">
                                        <template v-if="invoicesById[eachRow._id]">
                                            <div class="invoice-ref">
                                                <span class="invoice-number">{{ invoicesById[eachRow._id].invoiceNumber }}</span>
                                                <span class="invoice-status" :class="invoiceStatus(invoicesById[eachRow._id]).className">
                                                    {{ invoiceStatus(invoicesById[eachRow._id]).label }}
                                                </span>
                                            </div>
                                            <div class="invoice-meta">
                                                {{ formatInvoiceTotal(invoicesById[eachRow._id]) }} · {{ invoiceStatus(invoicesById[eachRow._id]).detail }}
                                            </div>
                                            <div class="invoice-actions">
                                                <button
                                                    type="button"
                                                    class="invoice-btn"
                                                    :disabled="downloadingInvoice === invoicesById[eachRow._id].invoiceId"
                                                    @click="downloadInvoice(invoicesById[eachRow._id])"
                                                >
                                                    <v-icon x-small>mdi-tray-arrow-down</v-icon>
                                                    {{ downloadingInvoice === invoicesById[eachRow._id].invoiceId ? 'Preparing…' : 'Download' }}
                                                </button>
                                            </div>
                                        </template>
                                        <!-- Credits granted before invoicing (onboarding, older recharges) have no invoice -->
                                        <span v-else class="text-muted small">—</span>
                                    </td>

                                    <td class="text-center">
                                        <div
                                            v-if="eachRow.status === 'Active' && !(Date.now() > new Date(eachRow.expiresAt))">
                                            <v-chip small color="green lighten-5" text-color="green"
                                                class="font-weight-bold">ACTIVE</v-chip>
                                        </div>
                                        <hf-buttons
                                            v-else-if="$can('CAVACH_API', 'WRITE_CREDIT') && eachRow.used < eachRow.totalCredits && !(Date.now() > new Date(eachRow.expiresAt))"
                                            name="Activate" size="sm"
                                            @executeAction="activateThisCredit(eachRow)"></hf-buttons>
                                        <span v-else class="text-muted small">—</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </v-col>
        </v-row>
        </template>
        <KycCreditCalculator
            v-model="calculatorOpen"
            :remaining-credits="myKYCCredits.allRemainingCredits"
            :total-credits="myKYCCredits.allAvailableCredits"
        />
        <!-- Prices and the region come from GET /billing/catalog -->
        <CreditTopUpPopup
            v-model="topUpOpen"
            :app-id="selectedAppId"
            @paid="reloadData"
        />
    </b-container>
</template>

<script>
import Chart from 'chart.js/auto';
import { mapActions, mapGetters } from "vuex";
import UtilsMixin from '../../mixins/utils';
import HfButtons from "../../components/element/HfButtons.vue";
import AccessDenied from '../AccessDenied.vue';
import KycCreditCalculator from '../../components/credit/KycCreditCalculator.vue';
import { downloadInvoiceDocument } from '../../components/credit/invoice/downloadInvoice';
import CreditTopUpPopup from '../../components/credit/CreditTopUpPopup.vue';
import { getCatalog, getAllInvoices, getInvoice, getPaymentLinks } from '../../utils/billingApi';
import { formatMinor } from '../../utils/billingFormat';

// Offline methods (super admin) and Razorpay's methods (self-serve, lower case)
const PAYMENT_METHOD_LABELS = {
    BANK_TRANSFER: 'Bank transfer',
    UPI: 'UPI',
    CHEQUE: 'Cheque',
    CARD_OUTSIDE_DASHBOARD: 'Card',
    OTHER_SYSTEM: 'Other system',
    upi: 'UPI',
    card: 'Card',
    netbanking: 'Netbanking',
    wallet: 'Wallet',
    emi: 'EMI',
    paylater: 'Pay Later'
};

export default {
    name: "KYCDashboardCredit",
    components: { HfButtons, AccessDenied, KycCreditCalculator, CreditTopUpPopup },
    mixins: [UtilsMixin],
    data() {
        return {
            timeRemaining: '',
            timer: null,
            doughNutChart: null,
            isLoading: false,
            accessDenied: false,
            accessDeniedMsg: '',
            fullPage: true,
            doughNutChartLabel: ['Used', 'Remaining'],
            calculatorOpen: false,
            topUpOpen: false,
            downloadingInvoice: null,
            // InvoiceSummary list from GET /billing/invoices?appId; empty when it can't be loaded
            invoices: [],
            // Open payment links from GET /billing/payment-links?appId; empty without READ_BILLING
            paymentLinks: [],
            // Links the customer opened with Pay now in this visit
            openedLinks: [],
            refreshingLinks: false,
            // Off only when the catalog refuses the account (billing disabled or no permission)
            billingAvailable: true,
        }
    },
    computed: {
        ...mapGetters('mainStore', ['getKYCCredits']),

        selectedAppId() {
            const app = this.$store.getters['mainStore/getSelectedService'];
            return (app && app.appId) || '';
        },

        // READ_BILLING is a dashboard permission (DASHBOARD.ACCESS_TYPES in the service)
        canViewBilling() {
            return this.$store.getters['mainStore/hasAccess']('DASHBOARD', 'READ_BILLING');
        },

        canTopUp() {
            return this.canViewBilling && this.billingAvailable;
        },

        // Each invoice sits on the credit plan it granted (contract §4: creditPlanId = the plan's _id)
        invoicesById() {
            return this.invoices.reduce((byId, invoice) => {
                if (invoice.creditPlanId) byId[invoice.creditPlanId] = invoice;
                return byId;
            }, {});
        },

        // A link the customer opened is still listed: the payment may not have been seen yet
        awaitingPaidLink() {
            return this.paymentLinks.some(link => this.openedLinks.includes(link.orderId));
        },

        getSortedKYCCredits() {
            if (!Array.isArray(this.getKYCCredits)) return [];
            return [...this.getKYCCredits].sort((a, b) => new Date(b.expiresAt) - new Date(a.expiresAt));
        },

        statusColorClass() {
            if (this.timeRemaining === 'Expired') return 'text-danger';
            if (this.timeRemaining === 'InActive') return 'text-muted';
            return 'color-green';
        },

        savedCalculatorConfiguration() {
            return this.$store.getters['creditCalculatorStore/getConfiguration'] || {};
        },

        hasSavedCalculatorConfiguration() {
            const configuration = this.savedCalculatorConfiguration;
            return Array.isArray(configuration.selectedFlowIds)
                && configuration.selectedFlowIds.length > 0
                && Number(configuration.creditsPerVerification) > 0;
        },

        savedVerificationEstimate() {
            const cost = Number(this.savedCalculatorConfiguration.creditsPerVerification || 0);
            if (!cost) return 0;
            return Math.floor(Math.max(this.myKYCCredits.allRemainingCredits, 0) / cost);
        },

        myKYCCredits() {
            const empty = { allAvailableCredits: 0, allUsedCredits: 0, allRemainingCredits: 0, expiresAt: (new Date()).toISOString() };
            if (!Array.isArray(this.getKYCCredits) || this.getKYCCredits.length === 0) return empty;

            const now = new Date();
            let active_credits = this.getKYCCredits.filter(x => {
                if (x.expiresAt) {
                    const expirydate = new Date(x.expiresAt);
                    return (expirydate >= now) && (x.used < x.totalCredits);
                }
                return x.status === 'Active' || !x.expiresAt;
            });

            if (active_credits.length === 0) {
                return empty;
            }

            const total = active_credits.reduce((acc, curr) => ({
                allAvailableCredits: acc.allAvailableCredits + curr.totalCredits,
                allUsedCredits: acc.allUsedCredits + curr.used
            }), { allAvailableCredits: 0, allUsedCredits: 0 });

            active_credits.sort((a, b) => new Date(b.expiresAt) - new Date(a.expiresAt));
            return {
                ...total,
                allRemainingCredits: total.allAvailableCredits - total.allUsedCredits,
                expiresAt: active_credits[0].expiresAt
            };
        }
    },
    async mounted() {
        document.addEventListener('visibilitychange', this.onVisibilityChange);
        await this.reloadData();
    },
    beforeDestroy() {
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
        this.stopTimer();
    },
    methods: {
        ...mapActions('mainStore', ['fetchKYCCredits', 'activateCredit']),

        // Tag and settlement text (contract §4)
        invoiceStatus(invoice) {
            if (invoice.status === 'UNPAID') {
                const due = invoice.dueAt ? new Date(invoice.dueAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '';
                return { label: 'Due', className: 'is-due', detail: due ? `Due ${due}` : 'Payment due' };
            }
            if (invoice.status === 'VOID') return { label: 'Void', className: 'is-void', detail: 'Void' };
            if (invoice.settlement === 'COMPLIMENTARY') {
                return { label: 'Complimentary', className: 'is-complimentary', detail: 'No payment due' };
            }
            if (invoice.settlement === 'OFFLINE') return { label: 'Paid', className: 'is-paid', detail: 'Paid offline' };
            const method = invoice.payment && invoice.payment.method;
            return { label: 'Paid', className: 'is-paid', detail: method ? `Paid via ${PAYMENT_METHOD_LABELS[method] || method}` : 'Paid' };
        },

        formatInvoiceTotal(invoice) {
            return formatMinor(invoice.totalMinor, invoice.currency);
        },

        formatMinorAmount(minor, currency) {
            return formatMinor(minor, currency);
        },

        shortDate(value) {
            return new Date(value).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
        },

        // Always the url from the API; Razorpay's page opens in a new tab
        payNow(link) {
            if (!this.openedLinks.includes(link.orderId)) this.openedLinks.push(link.orderId);
            window.open(link.url, '_blank', 'noopener');
        },

        // Open links are extra information, like invoices: a 403 (no READ_BILLING) or any other
        // failure just hides the rows
        async loadPaymentLinks() {
            const appId = this.selectedAppId;
            if (!appId || !this.canViewBilling) {
                this.paymentLinks = [];
                return;
            }
            try {
                const links = await getPaymentLinks({ appId });
                if (appId === this.selectedAppId) this.paymentLinks = links;
            } catch (e) {
                this.paymentLinks = [];
                console.info(`Payment links not shown: ${e.code || e.status || ''} ${e.message}`);
            }
        },

        // The customer pays in another tab, so the dashboard isn't told. Once the server has seen
        // the payment the link leaves the list and its invoice and credit plan appear.
        async refreshAfterPayment() {
            if (this.refreshingLinks) return;
            this.refreshingLinks = true;
            try {
                await Promise.all([this.loadPaymentLinks(), this.loadInvoices(), this.fetchKYCCredits()]);
                this.updateTimer();
                this.renderChart();
            } catch (e) {
                console.info(`Refresh after payment failed: ${e.message}`);
            } finally {
                this.refreshingLinks = false;
            }
        },

        onVisibilityChange() {
            if (document.visibilityState !== 'visible' || this.accessDenied) return;
            // Only worth a full refresh while a payment request is open
            if (this.paymentLinks.length) this.refreshAfterPayment();
            else this.loadPaymentLinks();
        },

        // Invoices are rendered here from GET /billing/invoices/:id; nothing is stored as a file
        async downloadInvoice(invoice) {
            if (this.downloadingInvoice) return;
            this.downloadingInvoice = invoice.invoiceId;
            try {
                await downloadInvoiceDocument(await getInvoice(invoice.invoiceId));
            } catch (e) {
                this.notifyErr(e.code === 'INVOICE_NOT_FOUND' ? 'This invoice could not be found.' : `Could not prepare the invoice: ${e.message}`);
            } finally {
                this.downloadingInvoice = null;
            }
        },

        // Invoices are extra information: if they can't be loaded (no READ_BILLING, an older
        // backend without billing, a network error) the credit history still shows, with "—"
        async loadInvoices() {
            const appId = this.selectedAppId;
            if (!appId || !this.canViewBilling) {
                this.invoices = [];
                return;
            }
            try {
                const invoices = await getAllInvoices({ appId });
                if (appId === this.selectedAppId) this.invoices = invoices;
            } catch (e) {
                this.invoices = [];
                console.info(`Invoices not shown: ${e.code || e.status || ''} ${e.message}`);
            }
        },

        // Top up is hidden only when the catalog refuses the account: 503 BILLING_DISABLED for the
        // region, or 403 without READ_BILLING (contract §1.5). Other failures keep the button, and
        // the popup shows the error with a retry when opened.
        async checkBillingAvailable() {
            if (!this.canViewBilling) return;
            try {
                await getCatalog();
                this.billingAvailable = true;
            } catch (e) {
                const refused = e.code === 'BILLING_DISABLED' || e.status === 403;
                this.billingAvailable = !refused;
                if (refused) console.info(`Top up hidden: ${e.code || e.status} ${e.message}`);
            }
        },

        async reloadData() {
            try {
                this.isLoading = true;
                this.checkBillingAvailable();
                // In parallel with the credits; never blocks or fails the page
                this.loadInvoices();
                this.loadPaymentLinks();
                await this.fetchKYCCredits();

                this.startTimer();
                this.renderChart();
            } catch (e) {
                const msg = (e?.message || '').toLowerCase();
                if (msg.includes('permission denied') || msg.includes('forbidden') || msg.includes('access denied') || msg.includes('not authorized')) {
                    this.accessDenied = true;
                    this.accessDeniedMsg = e.message;
                } else {
                    this.notifyErr(e.message);
                }
            } finally {
                this.isLoading = false;
            }
        },
        getProgressVariant(row) {
                const isExpired = Date.now() > new Date(row.expiresAt);
                const isFull = row.used >= row.totalCredits;

                if (isExpired) return 'secondary'; // Grey for expired
                if (isFull) return 'success';      // Green for completely used/completed
                
                // Dynamic colors for active usage
                const ratio = row.used / row.totalCredits;
                if (ratio > 0.9) return 'warning'; // Orange if almost empty
                return 'primary';                  // Blue for normal active usage
            },

        updateTimer() {
            this.timeRemaining = this.formatTimeRemaining(this.myKYCCredits.expiresAt);
        },

        startTimer() {
            this.updateTimer();
            this.timer = setInterval(this.updateTimer, 1000);
        },

        stopTimer() {
            clearInterval(this.timer);
        },

        renderChart() {
            if (!Array.isArray(this.getKYCCredits)) return;
            const used = this.myKYCCredits.allUsedCredits || 0;
            const remaining = this.myKYCCredits.allRemainingCredits || 0;
            const hasNoRemainingCredits = remaining <= 0;

            const dataToRender = (this.getKYCCredits.length === 0 || (used + remaining === 0))
                ? [0, 1] : [used, remaining];

            const colors = hasNoRemainingCredits
                ? ['#cbd5e1', '#94a3b8']
                : ['#94a3b8', '#3b82f6'];

            this.doughNutChart?.destroy();
            const ctx = document.getElementById('doughNutChat');
            this.doughNutChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: this.doughNutChartLabel,
                    datasets: [{
                        data: dataToRender,
                        backgroundColor: colors,
                        borderWidth: 0,
                        hoverOffset: 4,
                        cutout: '70%',
                        circumference: 180,
                        rotation: 270,
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false
                }
            });
        },

        numberFormat(val) { return new Intl.NumberFormat().format(val) },

        async activateThisCredit(eachRow) {
            try {
                if (eachRow.used === eachRow.totalCredits) return this.notifyErr("Credit exhausted");
                this.isLoading = true;
                await this.activateCredit({ creditId: eachRow._id });
                await this.reloadData();
            } catch (e) {
                this.notifyErr(e.message);
            } finally {
                this.isLoading = false;
            }
        },

        isValidDate(date) { return !isNaN(new Date(date).getTime()); }
    }
};
</script>

<style scoped>
.py-3 {
    width: 80vw !important;
}
/* Unified Dashboard Styles */
.overview-container {
    padding:  1.5rem 1.5rem;
    background-color: #f9fafb;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    margin-top: -0.85rem;
}

.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
}

.chart-wrapper {
    height: 180px;
    position: relative;
}

.usage-table-wrapper {
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid #f3f4f6;
    margin-top: 1rem;
}

.usage-table {
    width: 100%;
    border-collapse: collapse;
}

.usage-table th {
    background-color: #f8fafc;
    padding: 1rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #64748b;
    border-bottom: 1px solid #e2e8f0;
    text-align: left;
}

.usage-table td {
    padding: 1rem;
    font-size: 0.875rem;
    border-bottom: 1px solid #f1f5f9;
}

.badge {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
}

.badge-active {
    background-color: #e0f2fe;
    color: #0369a1;
}

.badge-expired {
    background-color: #fee2e2;
    color: #991b1b;
}

.color-blue {
    color: #3b82f6;
}

.color-green {
    color: #10b981;
}

.text-danger {
    color: #ef4444;
}

.uppercase {
    text-transform: uppercase;
    letter-spacing: 0.05em;
    line-height: 1;
    /* Keeps label close to the value below it */
}

.calculator-callout {
    display: grid;
    width: 100%;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 0.85rem;
    align-items: center;
    padding: 0.75rem 0.9rem;
    border: 1px solid #d5dde7;
    border-radius: 0.65rem;
    background: #f8fafc;
    color: #495057;
    text-align: left;
    transition: border-color .15s ease, background-color .15s ease;
}

.calculator-callout:hover {
    border-color: #94a3b8;
    background: #f3f4f5;
}

.calculator-callout:focus-visible {
    outline: 3px solid rgba(108, 117, 125, .2);
    outline-offset: 2px;
}

.calculator-callout-icon {
    display: inline-flex;
    width: 2.5rem;
    height: 2.5rem;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #eceeef;
}

.calculator-callout-icon .v-icon,
.calculator-callout-action,
.calculator-callout-action .v-icon {
    color: #6c757d;
}

.calculator-callout-copy {
    display: flex;
    min-width: 0;
    flex-direction: column;
}

.calculator-callout-copy strong {
    color: #253454;
    font-size: 0.86rem;
}

.calculator-callout-copy small {
    margin-top: 0.1rem;
    color: #64748b;
    font-size: 0.76rem;
}

.calculator-callout-action {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.7rem 0.85rem;
    border-radius: 0.55rem;
    background: #e4e7e9;
    font-size: 0.78rem;
    font-weight: 700;
    white-space: nowrap;
}

/* Ensure the button doesn't have extra margin pushing it away from the edge */
.v-col.d-flex.justify-end {
    padding-right: 12px;
}

/* Custom Overrides */
.v-divider {
    border-color: #e5e7eb !important;
}
/* Styling for the progress container */
.progress {
    background-color: #e9ecef !important;
    border-radius: 10px;
    overflow: hidden;
}

/* Custom color for fully used credits if you prefer a specific shade */
.progress-full {
    box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
    transition: width .6s ease;
}

/* Invoice column */
.invoice-cell { min-width: 210px; }
.invoice-ref { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }

.invoice-number {
    color: #263244;
    font-size: 0.78rem;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
}

.invoice-status {
    padding: 1px 8px;
    border-radius: 10px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.03em;
}

.invoice-status.is-paid { background: #e6efff; color: #2563dc; }
.invoice-status.is-due { background: #fff4e5; color: #b45309; }
.invoice-status.is-complimentary,
.invoice-status.is-void { background: #f1f5f9; color: #64748b; }

.invoice-meta { margin-top: 2px; color: #8793a5; font-size: 0.72rem; font-variant-numeric: tabular-nums; }
.invoice-actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }

.invoice-btn {
    display: inline-flex;
    height: 26px;
    align-items: center;
    gap: 4px;
    padding: 0 9px;
    border: 1px solid #d5dde7;
    border-radius: 6px;
    background: #fff;
    color: #344054;
    font-size: 0.72rem;
    font-weight: 600;
    text-decoration: none;
    transition: border-color .15s ease, background-color .15s ease, color .15s ease;
}

.invoice-btn:hover:not(:disabled) { border-color: #2f6fec; background: #f7faff; color: #2563dc; text-decoration: none; }
.invoice-btn:disabled { cursor: progress; opacity: .6; }
.invoice-btn .v-icon { color: inherit; }

/* Collect payment: open links from Hypersign */
.header-tools { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 10px; }

.payment-request-banner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border: 1px solid #fedf89;
    border-radius: 8px;
    background: #fffaeb;
    color: #93370d;
    font-size: 0.82rem;
    font-weight: 600;
}

.payment-request-banner .v-icon { color: inherit; }
.payment-request-banner .pay-now-btn { margin-left: auto; }

.awaiting-row td { background: #fffcf5; }

.pay-now-btn {
    display: inline-flex;
    height: 28px;
    align-items: center;
    gap: 4px;
    padding: 0 12px;
    border: 1px solid #2563dc;
    border-radius: 6px;
    background: #2563dc;
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    white-space: nowrap;
}

.pay-now-btn:hover { background: #1d4ed8; }
.pay-now-btn .v-icon { color: inherit; }

/* Ensure the table cell doesn't squash the progress bar */
.usage-table td {
    vertical-align: middle;
}

@media (max-width: 767.98px) {
    .py-3 {
        width: 100% !important;
    }

    .calculator-callout {
        grid-template-columns: auto minmax(0, 1fr);
    }

    .calculator-callout-action {
        grid-column: 2;
        justify-self: start;
    }

    .usage-table-wrapper {
        overflow-x: auto;
    }

    .usage-table {
        min-width: 960px;
    }
}

</style>
