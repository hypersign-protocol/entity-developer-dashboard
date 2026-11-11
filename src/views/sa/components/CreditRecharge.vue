<template>
  <!-- Plain root, like PaymentLinksTable: v-container brings .container width and centring rules -->
  <div>
    <load-ing :active.sync="isLoading" :can-cancel="false" :is-full-page="false"></load-ing>
    <div class="overview-container">
      <div class="header-row">
        <h4 class="section-title">Service credit recharge</h4>
        <p class="header-subtitle">
          {{ isIdService
            ? 'Add credits to an ID Service app. Every recharge issues an invoice, or a payment link for Collect payment.'
            : 'Allocate credits and set validity periods for your registered backend services.' }}
        </p>
      </div>

      <AccessDenied v-if="accessDenied" />

      <div v-else>

        <label class="input-label">Service Type</label>
        <div class="service-type-row">
          <div
            v-for="type in serviceTypes"
            :key="type.value"
            class="service-type-card"
            :class="{ selected: serviceType === type.value }"
            @click="selectServiceType(type.value)"
          >
            <v-icon small :color="serviceType === type.value ? 'primary' : '#94a3b8'" class="mr-2">
              {{ serviceType === type.value ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank' }}
            </v-icon>
            <div>
              <div class="service-type-title">{{ type.label }}</div>
              <div class="field-hint text-muted">{{ type.description }}</div>
            </div>
          </div>
        </div>

        <!-- 503 BILLING_NOT_CONFIGURED: our own company details are missing on the server -->
        <div v-if="isIdService && notConfigured" class="page-banner" role="alert">
          <v-icon small>mdi-alert-outline</v-icon>
          <span>Invoicing is not configured yet. Ask an engineer to set the company details.</span>
        </div>

        <!-- Result of the last ID Service invoice (InvoiceSummary from POST /admin/billing/invoices) -->
        <section v-if="isIdService && createdInvoice" class="result-card">
          <div class="result-head">
            <span class="result-icon"><v-icon small>mdi-check-circle-outline</v-icon></span>
            <div class="result-copy">
              <strong>{{ resultTitle }}</strong>
              <small>{{ resultDetail }}</small>
            </div>
            <span class="invoice-status" :class="settlementChip(createdInvoice.settlement).className">
              {{ settlementChip(createdInvoice.settlement).label }}
            </span>
          </div>

          <dl class="result-grid">
            <div><dt>Invoice no.</dt><dd class="mono-text">{{ createdInvoice.invoiceNumber }}</dd></div>
            <div><dt>Billed to</dt><dd>{{ createdCompany }}</dd></div>
            <div><dt>Credits</dt><dd>{{ numberFormat(createdInvoice.credits) }} · {{ createdInvoice.validityDays }} days</dd></div>
            <div><dt>Total</dt><dd>{{ money(createdInvoice.totalMinor, createdInvoice.currency) }}</dd></div>
          </dl>

          <p v-if="downloadError" class="field-error mb-0">{{ downloadError }}</p>

          <div class="result-actions">
            <button type="button" class="ghost-btn" :disabled="downloading" @click="downloadCreatedInvoice">
              <v-icon x-small>mdi-tray-arrow-down</v-icon>
              {{ downloading ? 'Preparing…' : 'Download invoice' }}
            </button>
            <button type="button" class="ghost-btn" @click="startOver">
              <v-icon x-small>mdi-plus</v-icon> Create another
            </button>
          </div>
        </section>

        <!-- Collect payment: POST /admin/billing/invoices answered with a PaymentLink and no invoice (contract §7.1) -->
        <section v-else-if="isIdService && createdLink" class="result-card">
          <div class="result-head">
            <span class="result-icon"><v-icon small>mdi-link-variant</v-icon></span>
            <div class="result-copy">
              <strong>Payment link created</strong>
              <small>{{ createdLink.sentTo ? `Sent to ${createdLink.sentTo}` : 'Copy the link and send it to the customer.' }}</small>
            </div>
            <span class="invoice-status is-due">Awaiting payment</span>
          </div>

          <dl class="result-grid">
            <div><dt>Customer</dt><dd>{{ createdLink.org && createdLink.org.companyName }}</dd></div>
            <div><dt>App</dt><dd>{{ createdLink.appName }}</dd></div>
            <div><dt>Credits</dt><dd>{{ numberFormat(createdLink.credits) }} · {{ createdLink.validityDays }} days</dd></div>
            <div><dt>Customer pays</dt><dd>{{ money(createdLink.totalMinor, createdLink.currency) }}</dd></div>
          </dl>

          <div v-if="createdLink.url" class="payment-link-row">
            <v-icon x-small>mdi-link-variant</v-icon>
            <input class="payment-link-url mono-text" :value="createdLink.url" readonly aria-label="Payment link" @focus="$event.target.select()" />
            <button type="button" class="ghost-btn" @click="copyCreatedLink">
              <v-icon x-small>mdi-content-copy</v-icon> Copy
            </button>
          </div>
          <p class="field-hint text-muted mt-2 mb-0">
            Valid until {{ dateTime(createdLink.expiresAt) }}. Credits are added when the customer pays; the invoice is issued then.
          </p>

          <div class="result-actions">
            <button type="button" class="ghost-btn" @click="viewPaymentLinks">
              <v-icon x-small>mdi-format-list-bulleted</v-icon> View payment links
            </button>
            <button type="button" class="ghost-btn" @click="startOver">
              <v-icon x-small>mdi-plus</v-icon> Create another
            </button>
          </div>
        </section>

        <!-- Same steps for both service types; ID Service adds billing and the invoice step -->
        <div v-else-if="serviceType" class="recharge-layout">
          <div class="recharge-main">
            <section class="form-card">
              <header class="form-card-header">
                <span class="step-badge">1</span>
                <div>
                  <h4>Application</h4>
                  <p>{{ isIdService ? 'The invoice is billed to the organisation that owns this app.' : 'The SSI app that receives the credits.' }}</p>
                </div>
              </header>
              <label class="input-label">Application ID</label>
              <v-text-field
                v-model="form.serviceId"
                placeholder="e.g. 69afa3d8a4976d9c9e4671a7"
                outlined
                dense
                hide-details
                color="primary"
                class="mono-text"
              ></v-text-field>

              <template v-if="isIdService">
                <div v-if="billed.loading" class="field-hint text-muted mt-1 d-flex align-center" style="gap: 6px;">
                  <v-progress-circular indeterminate size="12" width="2" color="primary"></v-progress-circular>
                  Loading billing details…
                </div>
                <div v-else-if="billed.error" class="field-error mt-1">{{ billed.error }}</div>
                <div v-else-if="!billed.data" class="field-hint text-muted mt-1">Enter the app ID to load its billing details.</div>

                <div v-if="billed.data" class="billing-card" :class="{ incomplete: profileIncomplete }">
                  <div class="billing-main">
                    <span class="input-label mb-1">Billed to</span>
                    <strong>{{ billedProfile.legalName || billed.data.org.companyName }}</strong>
                    <small v-if="billed.data.org.companyName && billed.data.org.companyName !== billedProfile.legalName">{{ billed.data.org.companyName }}</small>
                    <small v-for="line in billedAddressLines" :key="line">{{ line }}</small>
                    <small v-for="taxId in billedProfile.taxIds" :key="taxId.type + taxId.number">{{ taxId.type }} {{ taxId.number }}</small>
                    <small>App: {{ billed.data.app.appName }}</small>
                    <span v-if="profileIncomplete" class="incomplete-note">
                      <v-icon x-small>mdi-alert-circle-outline</v-icon>
                      Billing details incomplete ·
                      <button type="button" class="link-btn" @click="billingDialogOpen = true">Complete billing details</button>
                    </span>
                  </div>
                  <div class="billing-tags">
                    <span class="tag">{{ billedProfile.region === 'IN' ? 'India' : 'Global' }}</span>
                    <span class="tag">{{ billedProfile.currency }}</span>
                  </div>
                </div>
              </template>
              <div v-else class="field-hint text-muted mt-1">Enter the {{ selectedServiceType.label }} application ID.</div>
            </section>

            <section class="form-card">
              <header class="form-card-header">
                <span class="step-badge">2</span>
                <div>
                  <h4>Credits and validity</h4>
                  <p>{{ isIdService ? 'Validity starts when the credits become active.' : 'Credits are active as soon as they are recharged.' }}</p>
                </div>
              </header>
              <v-row dense>
                <v-col cols="12" md="5">
                  <label class="input-label"># Of Credits</label>
                  <v-text-field v-model="form.amount" type="number" min="1" step="1" outlined dense hide-details color="primary"></v-text-field>
                  <div v-if="serverError('credits')" class="field-error mt-1">{{ serverError('credits') }}</div>
                  <v-btn v-if="isIdService" text x-small color="primary" class="px-0 mt-1 text-none" @click="showCreditInfo = true">
                    Understand Credit?
                  </v-btn>
                </v-col>
                <v-col cols="12" md="7">
                  <label class="input-label">Validity</label>
                  <div class="d-flex" style="gap: 8px;">
                    <v-text-field v-model="form.validityMonths" type="number" min="0" step="1" suffix="months" outlined dense hide-details color="primary" @input="validityTouched = true"></v-text-field>
                    <v-text-field v-model="form.validityDays" type="number" min="0" step="1" suffix="days" outlined dense hide-details color="primary" @input="validityTouched = true"></v-text-field>
                  </div>
                  <div v-if="validityInDays > 0" class="field-hint text-muted mt-1">
                    = <strong>{{ validityInDays }} days</strong><template v-if="!isIdService">, expires on {{ validityExpiryDate }}</template>
                  </div>
                  <div v-if="serverError('validityDays')" class="field-error mt-1">{{ serverError('validityDays') }}</div>
                </v-col>
              </v-row>
            </section>

            <section v-if="isIdService" class="form-card">
              <header class="form-card-header">
                <span class="step-badge">3</span>
                <div>
                  <h4>Invoice</h4>
                  <p>How is this recharge being paid for?</p>
                </div>
              </header>

              <div class="invoice-type-grid" role="radiogroup" aria-label="Invoice type">
                <button
                  v-for="option in invoiceTypes"
                  :key="option.value"
                  type="button"
                  role="radio"
                  class="invoice-type"
                  :class="{ selected: invoice.type === option.value, disabled: option.disabled }"
                  :aria-checked="invoice.type === option.value ? 'true' : 'false'"
                  :aria-disabled="option.disabled ? 'true' : 'false'"
                  :title="option.disabled ? option.disabledReason : ''"
                  @click="selectInvoiceType(option)"
                >
                  <span class="invoice-type-icon"><v-icon small>{{ option.icon }}</v-icon></span>
                  <strong>{{ option.label }}</strong>
                  <small>{{ option.description }}</small>
                  <span class="invoice-type-check" aria-hidden="true"><v-icon x-small>mdi-check</v-icon></span>
                </button>
              </div>
              <div v-if="invoice.type === 'UNPAID' && collectBlockedReason" class="field-error mt-2">
                {{ collectBlockedReason }} Choose Free credits or Already paid.
              </div>

              <v-row v-if="invoice.type === 'OFFLINE' || invoice.type === 'UNPAID'" dense class="mt-3">
                <v-col cols="12" md="5">
                  <label class="input-label">Amount, excluding tax</label>
                  <v-text-field
                    v-model="invoice.price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    :prefix="currencySymbol"
                    outlined
                    dense
                    hide-details
                    color="primary"
                  ></v-text-field>
                  <div v-if="priceProblem" class="field-error mt-1">{{ priceProblem }}</div>
                  <div v-else-if="serverError('amountMinor')" class="field-error mt-1">{{ serverError('amountMinor') }}</div>
                </v-col>
                <template v-if="invoice.type === 'UNPAID'">
                  <v-col cols="12" md="7">
                    <label class="input-label">Link valid for</label>
                    <v-text-field v-model="invoice.linkExpiresInDays" type="number" min="1" max="30" step="1" suffix="days" outlined dense hide-details color="primary"></v-text-field>
                    <div v-if="linkDaysProblem" class="field-error mt-1">{{ linkDaysProblem }}</div>
                    <div v-else-if="serverError('linkExpiresInDays')" class="field-error mt-1">{{ serverError('linkExpiresInDays') }}</div>
                  </v-col>
                  <v-col cols="12">
                    <v-checkbox v-model="invoice.notifyByEmail" dense hide-details color="primary" class="mt-0" label="Email the link to the customer"></v-checkbox>
                    <div v-if="!invoice.notifyByEmail" class="field-hint text-muted">The link is only created. Copy it and send it yourself.</div>
                  </v-col>
                  <v-col v-if="invoice.notifyByEmail" cols="12" md="7">
                    <label class="input-label">Send to <span class="optional">optional</span></label>
                    <v-text-field
                      v-model="invoice.notifyEmail"
                      type="email"
                      placeholder="Defaults to the billing email"
                      maxlength="254"
                      outlined
                      dense
                      hide-details
                      color="primary"
                      @input="notifyEmailTouched = true"
                    ></v-text-field>
                    <div v-if="notifyEmailProblem" class="field-error mt-1">{{ notifyEmailProblem }}</div>
                    <div v-else-if="serverError('notifyEmail')" class="field-error mt-1">{{ serverError('notifyEmail') }}</div>
                  </v-col>
                </template>
                <template v-else>
                <v-col cols="12" md="7">
                  <label class="input-label">Payment method</label>
                  <v-select
                    v-model="invoice.paymentMethod"
                    :items="paymentMethods"
                    outlined
                    dense
                    hide-details
                    color="primary"
                  ></v-select>
                  <div v-if="serverError('payment.method')" class="field-error mt-1">{{ serverError('payment.method') }}</div>
                </v-col>
                <v-col cols="12" md="7">
                  <label class="input-label">Payment reference</label>
                  <v-text-field
                    v-model="invoice.paymentReference"
                    placeholder="UTR, cheque no. or receipt ID"
                    maxlength="100"
                    outlined
                    dense
                    hide-details
                    color="primary"
                    class="mono-text"
                  ></v-text-field>
                  <div v-if="serverError('payment.reference')" class="field-error mt-1">{{ serverError('payment.reference') }}</div>
                </v-col>
                <v-col cols="12" md="5">
                  <label class="input-label">Paid on</label>
                  <v-text-field v-model="invoice.paidOn" type="date" :max="today" outlined dense hide-details color="primary"></v-text-field>
                  <div v-if="paidOnInFuture" class="field-error mt-1">The payment date can't be in the future.</div>
                  <div v-else-if="serverError('payment.paidAt')" class="field-error mt-1">{{ serverError('payment.paidAt') }}</div>
                </v-col>
                </template>
              </v-row>

              <label class="input-label mt-4">Internal note <span class="optional">optional</span></label>
              <v-text-field
                v-model="invoice.note"
                placeholder="Why this recharge? Not printed on the invoice."
                maxlength="500"
                outlined
                dense
                hide-details
                color="primary"
              ></v-text-field>
              <div v-if="serverError('note')" class="field-error mt-1">{{ serverError('note') }}</div>
            </section>
          </div>

          <!-- Every amount comes from POST /admin/billing/invoices/preview -->
          <aside v-if="isIdService" class="summary-card" :class="{ pending: preview.loading }" aria-live="polite">
            <span class="input-label">Summary</span>
            <dl class="summary-lines">
              <div><dt>Credits</dt><dd>{{ numberFormat(form.amount) || '—' }}</dd></div>
              <div><dt>Validity</dt><dd>{{ validityInDays > 0 ? `${validityInDays} days` : '—' }}</dd></div>
              <div><dt>Amount</dt><dd>{{ currentPreview ? money(currentPreview.totalBeforeTaxMinor, currentPreview.currency) : '—' }}</dd></div>
              <div v-for="line in previewTaxLines" :key="line.type">
                <dt>{{ taxLabel(line) }}</dt><dd>{{ money(line.amountMinor, currentPreview.currency) }}</dd>
              </div>
            </dl>
            <div class="summary-total">
              <span>{{ totalLabel }}</span>
              <strong>{{ currentPreview ? money(currentPreview.totalMinor, currentPreview.currency) : '—' }}</strong>
            </div>

            <div v-if="summaryChip" class="summary-outcome">
              <div><span class="invoice-status" :class="summaryChip.className">{{ summaryChip.label }}</span></div>
              <p v-if="creditsActiveText">{{ creditsActiveText }}</p>
            </div>

            <p v-if="preview.error" class="field-error mt-2 mb-0">
              {{ preview.error }}
              <button type="button" class="link-btn" @click="runPreview">Try again</button>
            </p>

            <ul v-if="missingFields.length" class="missing-list">
              <li v-for="item in missingFields" :key="item">
                <button v-if="item === BILLING_DETAILS_ITEM" type="button" class="link-btn" @click="billingDialogOpen = true">{{ item }}</button>
                <template v-else>{{ item }}</template>
              </li>
            </ul>

            <button type="button" class="primary-btn" :disabled="!canSubmit" @click="handleRecharge">
              {{ submitLabel }}
            </button>
          </aside>

          <aside v-else class="summary-card" aria-live="polite">
            <span class="input-label">Summary</span>
            <dl class="summary-lines">
              <div><dt>Credits</dt><dd>{{ numberFormat(form.amount) || '—' }}</dd></div>
              <div><dt>Validity</dt><dd>{{ validityInDays > 0 ? `${validityInDays} days` : '—' }}</dd></div>
              <div><dt>Expires on</dt><dd>{{ validityInDays > 0 ? shortDate(validityRange.end) : '—' }}</dd></div>
            </dl>
            <div class="summary-outcome">
              <p class="mt-0">Credits become active immediately. SSI recharges don't issue an invoice.</p>
            </div>

            <ul v-if="missingFields.length" class="missing-list">
              <li v-for="item in missingFields" :key="item">{{ item }}</li>
            </ul>

            <button type="button" class="primary-btn" :disabled="!!missingFields.length || loading" @click="handleRecharge">
              Execute Recharge
            </button>
          </aside>
        </div>

        <KycCreditCalculator
          v-if="isIdService"
          v-model="showCreditInfo"
          mode="allocate"
          :remaining-credits="Number(form.amount) || 0"
          @update:remainingCredits="form.amount = String($event)"
        />

        <!-- "Complete billing details": the customer's profile, edited by the super admin -->
        <b-modal
          v-model="billingDialogOpen"
          size="lg"
          centered
          scrollable
          hide-footer
          title="Complete billing details"
        >
          <BillingDetails
            v-if="billingDialogOpen && billed.data"
            admin
            embedded
            :admin-profile="billed.data.profile"
            :org-id="billed.data.org.orgId"
            @saved="onBillingSaved"
            @cancel="billingDialogOpen = false"
          />
        </b-modal>

        <hf-pop-up :id="confirmPopupId" :Header="confirmHeader" size="md">
          <p class="small text-muted mb-3">{{ confirmIntro }}</p>
          <table class="confirm-summary">
            <tbody>
              <tr>
                <th>Service Type</th>
                <td>{{ selectedServiceType && selectedServiceType.label }}</td>
              </tr>
              <tr>
                <th>Application</th>
                <td>
                  <template v-if="isIdService && billed.data">{{ billed.data.app.appName }}<br /></template>
                  <span class="mono-text">{{ form.serviceId.trim() }}</span>
                </td>
              </tr>
              <tr v-if="isIdService && billed.data">
                <th>Billed to</th>
                <td>{{ billedProfile.legalName || billed.data.org.companyName }}</td>
              </tr>
              <tr>
                <th># Of Credits</th>
                <td><strong>{{ formattedAmount }}</strong></td>
              </tr>
              <tr>
                <th>Validity</th>
                <td>
                  {{ validityLabel }}
                  <div v-if="!isIdService" class="field-hint text-muted">= {{ validityInDays }} days, expires on {{ validityExpiryDate }}</div>
                  <div v-else class="field-hint text-muted">= {{ validityInDays }} days from activation</div>
                </td>
              </tr>
              <template v-if="isIdService && currentPreview">
                <tr>
                  <th>Amount</th>
                  <td>{{ money(currentPreview.totalBeforeTaxMinor, currentPreview.currency) }}</td>
                </tr>
                <tr v-for="line in previewTaxLines" :key="line.type">
                  <th>{{ taxLabel(line) }}</th>
                  <td>{{ money(line.amountMinor, currentPreview.currency) }}</td>
                </tr>
                <tr>
                  <th>{{ totalLabel }}</th>
                  <td><strong>{{ money(currentPreview.totalMinor, currentPreview.currency) }}</strong></td>
                </tr>
                <template v-if="invoice.type === 'UNPAID'">
                  <tr>
                    <th>Delivery</th>
                    <td>{{ deliveryLabel }}</td>
                  </tr>
                  <tr>
                    <th>Link valid for</th>
                    <td>{{ linkExpiresInDays }} days</td>
                  </tr>
                </template>
                <tr v-if="invoice.type === 'OFFLINE'">
                  <th>Payment</th>
                  <td>{{ paymentMethodLabel(invoice.paymentMethod) }} · <span class="mono-text">{{ invoice.paymentReference.trim() }}</span> · {{ invoice.paidOn }}</td>
                </tr>
                <tr>
                  <th>{{ invoice.type === 'UNPAID' ? 'Status' : 'Invoice' }}</th>
                  <td>
                    <span v-if="summaryChip" class="invoice-status" :class="summaryChip.className">{{ summaryChip.label }}</span>
                    <div v-if="creditsActiveText" class="field-hint text-muted mt-1">{{ creditsActiveText }}</div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>

          <div v-if="isIdService && create.error" class="confirm-error" role="alert">{{ create.error }}</div>

          <div class="d-flex justify-end mt-4" style="gap: 8px;">
            <v-btn outlined depressed :disabled="create.inFlight" @click="closeConfirm">Cancel</v-btn>
            <v-btn color="#111827" depressed :disabled="create.inFlight || (isIdService && create.blocked)" :loading="create.inFlight" @click="confirmRecharge">
              <span style="color: white;">{{ confirmLabel }}</span>
            </v-btn>
          </div>
        </hf-pop-up>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overview-container {
  /* Same card as the Payment links tab */
  padding: 16px 18px;
  border: 1px solid #e1e6ed;
  border-radius: 10px;
  background: #fff;
  color: #1e293b;
}

.header-row {
  margin-bottom: 12px;
}

.header-subtitle { margin: 2px 0 0; color: #8793a5; font-size: 11px; }

/* Not .title: Vuetify's .title typography class sets its own size with !important */
.section-title {
  margin: 0;
  color: #263244;
  font-size: 14px;
  font-weight: 700;
}

.input-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.input-label .optional { margin-left: 4px; color: #94a3b8; font-weight: 600; text-transform: none; }

.mono-text {
  font-family: 'JetBrains Mono', monospace !important;
}

.text-muted {
  color: #64748b !important;
}

.small {
  font-size: 0.85rem;
}

.service-type-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  /* Same rhythm as the gap between the step cards below */
  margin-bottom: 16px;
}

.service-type-card {
  display: flex;
  align-items: flex-start;
  flex: 1 1 220px;
  max-width: 320px;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.service-type-card:hover {
  border-color: #94a3b8;
}

.service-type-card.selected {
  border-color: var(--v-primary-base);
}

.service-type-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #111827;
}

.confirm-summary {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.confirm-summary th,
.confirm-summary td {
  padding: 10px 8px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: top;
  text-align: left;
}

.confirm-summary th {
  width: 40%;
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.confirm-summary td {
  color: #111827;
  word-break: break-all;
}

.field-hint {
  font-size: 0.75rem;
}

/* ID Service: recharge + invoice */
.recharge-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 16px;
  align-items: start;
}

.recharge-main { display: flex; min-width: 0; flex-direction: column; gap: 16px; }

.form-card {
  padding: 16px 18px;
  border: 1px solid #e1e6ed;
  border-radius: 10px;
  background: #fff;
}

/* Bootstrap's .row margin also applies to Vuetify's v-row here; keep fields aligned with the card */
.form-card .row { margin-right: -4px; margin-left: -4px; }

.form-card-header { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 14px; }
.form-card-header h4 { margin: 0; color: #263244; font-size: 14px; font-weight: 700; }
.form-card-header p { margin: 2px 0 0; color: #8793a5; font-size: 11px; }

.step-badge {
  display: inline-flex;
  flex: 0 0 22px;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f1f6ff;
  color: #2563dc;
  font-size: 11px;
  font-weight: 700;
}

.billing-card {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  padding: 10px 12px;
  border: 1px solid #dbe7fb;
  border-radius: 8px;
  background: #f7faff;
}

.billing-main { display: flex; min-width: 0; flex-direction: column; }
.billing-main strong { color: #172554; font-size: 13px; }
.billing-main small { color: #718198; font-size: 11px; }
.billing-tags { display: flex; flex: 0 0 auto; align-items: flex-start; gap: 4px; }

.tag {
  padding: 1px 8px;
  border-radius: 10px;
  background: #e6efff;
  color: #2563dc;
  font-size: 10px;
  font-weight: 700;
}

.invoice-type-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }

.invoice-type {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 12px 34px 12px 12px;
  border: 1px solid #d5dde7;
  border-radius: 8px;
  background: #fff;
  text-align: left;
  transition: border-color .15s ease, background-color .15s ease, box-shadow .15s ease;
}

.invoice-type:hover { border-color: #a9b8cc; }
.invoice-type.selected { border-color: #2f6fec; background: #f7faff; box-shadow: 0 0 0 3px rgba(47, 111, 236, .12); }

.invoice-type-icon {
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  border-radius: 8px;
  background: #f1f6ff;
}

.invoice-type-icon .v-icon { color: #2563dc; }
.invoice-type strong { color: #172554; font-size: 13px; }
.invoice-type small { color: #8793a5; font-size: 11px; line-height: 1.35; }

.invoice-type-check {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #a9b8cc;
  border-radius: 50%;
}

.invoice-type-check .v-icon { opacity: 0; color: #fff; font-size: 11px !important; }
.invoice-type.selected .invoice-type-check { border-color: #2563dc; background: #2563dc; }
.invoice-type.selected .invoice-type-check .v-icon { opacity: 1; }

.summary-card {
  position: sticky;
  top: 12px;
  display: flex;
  flex-direction: column;
  padding: 16px 18px;
  border: 1px solid #e1e6ed;
  border-radius: 10px;
  background: #fff;
}

.summary-lines { margin: 4px 0 0; }
.summary-lines > div { display: flex; justify-content: space-between; gap: 10px; padding: 3px 0; font-size: 12px; }
.summary-lines dt { color: #718198; font-weight: 500; }
.summary-lines dd { margin: 0; color: #263244; font-weight: 600; font-variant-numeric: tabular-nums; }

.summary-total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eef2f6;
}

.summary-total span { color: #344054; font-size: 13px; font-weight: 600; }
.summary-total strong { color: #172554; font-size: 20px; font-variant-numeric: tabular-nums; }

.summary-outcome { margin-top: 12px; padding: 10px 12px; border-radius: 8px; background: #f8fafc; }
.summary-outcome p { margin: 6px 0 0; color: #52627a; font-size: 12px; }

.missing-list { margin: 12px 0 0; padding-left: 16px; color: #8793a5; font-size: 11px; }

.primary-btn {
  width: 100%;
  min-height: 40px;
  margin-top: 14px;
  padding: 0 14px;
  border: 1px solid #6c757d;
  border-radius: 8px;
  background: #6c757d;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.primary-btn:hover:not(:disabled) { border-color: #545b62; background: #5a6268; }
.primary-btn:disabled { cursor: not-allowed; opacity: .55; }

.invoice-status {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.invoice-status.is-paid { background: #e6efff; color: #2563dc; }
.invoice-status.is-due { background: #fff4e5; color: #b45309; }
.invoice-status.is-complimentary { background: #f1f5f9; color: #64748b; }

/* Result */
.result-card {
  max-width: 720px;
  padding: 18px;
  border: 1px solid #e1e6ed;
  border-radius: 10px;
  background: #fff;
}

.result-head { display: flex; align-items: flex-start; gap: 12px; }

.result-icon {
  display: inline-flex;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #f1f6ff;
}

.result-icon .v-icon { color: #2563dc; }
.result-copy { display: flex; flex: 1 1 auto; flex-direction: column; }
.result-copy strong { color: #172554; font-size: 15px; }
.result-copy small { color: #718198; font-size: 12px; }

.result-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
  margin: 16px 0 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f8fafc;
}

.result-grid dt { color: #8793a5; font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
.result-grid dd { margin: 2px 0 0; color: #263244; font-size: 13px; font-weight: 600; word-break: break-word; }
.result-grid dd.mono-text { font-size: 12px; white-space: nowrap; }

.payment-link-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1px dashed #b9cdf5;
  border-radius: 8px;
  background: #f7faff;
  color: #2563dc;
}

.payment-link-row .v-icon { color: inherit; }
.payment-link-url { flex: 1 1 auto; min-width: 0; overflow: hidden; border: 0; outline: 0; background: transparent; color: #1e40af; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }

.preview-note {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 10px 0 0;
  padding: 8px 10px;
  border-radius: 8px;
  background: #fff4e5;
  color: #92400e;
  font-size: 12px;
}

.preview-note .v-icon { color: inherit; }
.result-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }

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
}

.ghost-btn:hover:not(:disabled) { border-color: #2f6fec; background: #f7faff; color: #2563dc; }
.ghost-btn:disabled { cursor: progress; opacity: .6; }
.ghost-btn .v-icon { color: inherit; }

.field-error { color: #b42318; font-size: 0.75rem; }

.link-btn { padding: 0; color: #2563dc; font-weight: 600; text-decoration: underline; }
.link-btn:hover { color: #1d4ed8; }

.page-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 10px 12px;
  border: 1px solid #fedf89;
  border-radius: 8px;
  background: #fffaeb;
  color: #93370d;
  font-size: 12px;
  font-weight: 600;
}

.page-banner .v-icon { color: inherit; }

.billing-card.incomplete { border-color: #fedf89; background: #fffcf5; }
.incomplete-note { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 4px; margin-top: 6px; color: #b54708; font-size: 11px; font-weight: 600; }
.incomplete-note .v-icon { color: inherit; }

/* Collect payment for a customer it isn't available to */
.invoice-type.disabled { cursor: not-allowed; opacity: .5; }
.invoice-type.disabled:hover { border-color: #d5dde7; }

/* Totals while a new preview is on its way */
.summary-card.pending .summary-lines,
.summary-card.pending .summary-total { opacity: .55; transition: opacity .15s ease; }

.missing-list .link-btn { font-size: 11px; }

.confirm-error {
  margin-top: 12px;
  padding: 8px 10px;
  border: 1px solid #fecdca;
  border-radius: 8px;
  background: #fef3f2;
  color: #b42318;
  font-size: 12px;
}

@media (max-width: 960px) {
  .recharge-layout { grid-template-columns: 1fr; }
  .summary-card { position: static; }
  .invoice-type-grid { grid-template-columns: 1fr; }
  .result-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
<script>
import { mapActions } from 'vuex/dist/vuex.common.js';
import { v4 as uuidv4 } from 'uuid';
import loadIng from '../../../components/element/LoadIng.vue';
import UtilsMixin from '../../../mixins/utils.js';
import AccessDenied from '../../AccessDenied.vue';
import KycCreditCalculator from '../../../components/credit/KycCreditCalculator.vue';
import HfPopUp from '../../../components/element/hfPopup.vue';
import BillingDetails from '../../../components/settings/BillingDetails.vue';
import { BillingError, getAdminBillingProfile, previewAdminInvoice, createAdminInvoice, getAdminInvoice } from '../../../utils/billingApi';
import { formatMinor, formatBps, localeFor } from '../../../utils/billingFormat';
import { downloadInvoiceDocument } from '../../../components/credit/invoice/downloadInvoice';

const DEBOUNCE_MS = 400;
const BILLING_DETAILS_ITEM = 'Customer billing details';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const defaultForm = () => ({
  serviceId: '',
  amount: '100',
  validityMonths: '12',
  validityDays: '0',
  amountDenom: 'uHID',
});

// Local calendar date as YYYY-MM-DD (what the date input shows and the API takes)
const todayIso = () => {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const defaultInvoice = () => ({
  type: null,
  price: '',
  paymentMethod: 'BANK_TRANSFER',
  paymentReference: '',
  paidOn: todayIso(),
  // Collect payment (contract §7.1)
  notifyByEmail: true,
  notifyEmail: '',
  linkExpiresInDays: '15',
  note: '',
});

const emptyCreate = () => ({ attempt: null, inFlight: false, error: '', blocked: false, retryable: false });

// GET /admin/billing/profiles errors, shown under the App ID (contract §5)
function billedToError(error) {
  if (error.code === 'APP_NOT_FOUND') return 'No app with this ID.';
  if (error.code === 'APP_NOT_BILLABLE') return 'This is an SSI app. Switch Service type to SSI Service.';
  if (error.code === 'ONBOARDING_NOT_FOUND') return 'The app\'s owner hasn\'t completed onboarding.';
  if (error.status === 403) return 'Only super admins can load billing details.';
  return 'Could not load the billing details. Check the app ID and try again.';
}

// The create call failed but may have issued the invoice or link: a network error, the server's
// "Invoice … was issued, but the credits could not be granted yet" 500, or 503 PAYMENTS_UNAVAILABLE
// when Razorpay didn't answer. Retry with the same key.
function isRetryable(error) {
  if (!(error instanceof BillingError)) return true;
  if (error.code === 'PAYMENTS_UNAVAILABLE') return true;
  return error.status >= 500 && /^Invoice .* was issued, but the credits could not be granted yet/.test(error.message);
}

export default {
  name: 'CreditRecharge',
  components: { loadIng, AccessDenied, KycCreditCalculator, HfPopUp, BillingDetails },
  mixins: [UtilsMixin],
  data() {
    return {
      BILLING_DETAILS_ITEM,
      loading: false,
      isLoading: false,
      accessDenied: false,
      serviceType: 'ID_SERVICE',
      serviceTypes: [
        { value: 'ID_SERVICE', label: 'ID Service', description: 'Recharge credits for an ID Service application.' },
        { value: 'SSI_SERVICE', label: 'SSI Service', description: 'Recharge credits for an SSI application.' },
      ],
      paymentMethods: [
        { text: 'Bank transfer', value: 'BANK_TRANSFER' },
        { text: 'UPI', value: 'UPI' },
        { text: 'Cheque', value: 'CHEQUE' },
        { text: 'Card (outside dashboard)', value: 'CARD_OUTSIDE_DASHBOARD' },
        { text: 'Other system', value: 'OTHER_SYSTEM' },
      ],
      showCreditInfo: false,
      confirmPopupId: 'credit-recharge-confirm-popup',
      form: defaultForm(),
      invoice: defaultInvoice(),
      // Validity is prefilled from the app's region until the admin edits it
      validityTouched: false,
      // "Send to" is prefilled with the billing email until the admin edits it
      notifyEmailTouched: false,
      // A PAYMENTS_NOT_AVAILABLE answer for this app: Collect payment is off for it
      paymentsRefused: false,
      // Step 1: GET /admin/billing/profiles
      billed: { loading: false, error: '', data: null },
      billedRequest: 0,
      billedTimer: null,
      // Set by a BILLING_PROFILE_INCOMPLETE answer, on top of profile.complete
      profileRefused: false,
      notConfigured: false,
      // Summary: POST /admin/billing/invoices/preview, kept with the body it priced
      preview: { loading: false, error: '', data: null, key: '' },
      previewRequest: 0,
      previewTimer: null,
      // Field path → message from a VALIDATION_FAILED answer
      serverErrors: {},
      create: emptyCreate(),
      billingDialogOpen: false,
      createdInvoice: null,
      createdCompany: '',
      createdCreditsActive: null,
      // PaymentLink from a Collect payment create
      createdLink: null,
      downloading: false,
      downloadError: '',
      today: todayIso(),
    };
  },
  computed: {
    isIdService() {
      return this.serviceType === 'ID_SERVICE';
    },
    selectedServiceType() {
      return this.serviceTypes.find((t) => t.value === this.serviceType);
    },
    appId() {
      return this.form.serviceId.trim();
    },
    billedProfile() {
      return (this.billed.data && this.billed.data.profile) || {};
    },
    profileIncomplete() {
      return Boolean(this.billed.data) && (!this.billedProfile.complete || this.profileRefused);
    },
    billedAddressLines() {
      const a = this.billedProfile.address || {};
      return [
        a.street,
        [a.city, a.province, a.postalCode, a.country].filter(Boolean).join(', '),
      ].filter(Boolean);
    },
    currency() {
      return this.billedProfile.currency || '';
    },
    currencySymbol() {
      if (!this.currency) return '';
      const part = new Intl.NumberFormat(localeFor(this.currency), { style: 'currency', currency: this.currency })
        .formatToParts(0)
        .find(p => p.type === 'currency');
      return part ? part.value : '';
    },
    // India and Global both collect; the server answers PAYMENTS_NOT_AVAILABLE where payments are off (contract §7)
    collectBlockedReason() {
      if (this.paymentsRefused) return 'Collect payment isn\'t available for this customer yet.';
      return '';
    },
    // The selection sets amountMinor / isPaid (contract §5 and §7)
    invoiceTypes() {
      const zero = this.currencySymbol ? `${this.currencySymbol}0 invoice` : 'Zero-amount invoice';
      return [
        { value: 'COMPLIMENTARY', label: 'Free credits', description: `No charge. ${zero}, credits active now.`, icon: 'mdi-gift-outline' },
        { value: 'OFFLINE', label: 'Already paid', description: 'Paid outside the dashboard. Credits active now.', icon: 'mdi-bank-check' },
        {
          value: 'UNPAID',
          label: 'Collect payment',
          description: 'Send a payment link. Credits are added once paid.',
          icon: 'mdi-send-clock-outline',
          disabled: Boolean(this.collectBlockedReason),
          disabledReason: this.collectBlockedReason,
        },
      ];
    },
    credits() {
      const text = String(this.form.amount).trim();
      return /^\d+$/.test(text) && Number(text) > 0 ? Number(text) : null;
    },
    validityValid() {
      const whole = value => /^\d+$/.test(String(value).trim() || '0');
      return whole(this.form.validityMonths) && whole(this.form.validityDays) && this.validityInDays > 0;
    },
    // "40000" or "40000.5" → minor units; null when empty, not positive, or more than 2 decimals
    amountMinor() {
      const text = String(this.invoice.price).trim();
      if (!/^\d+(\.\d{1,2})?$/.test(text)) return null;
      const minor = Math.round(Number(text) * 100);
      return minor > 0 ? minor : null;
    },
    priceProblem() {
      const text = String(this.invoice.price).trim();
      if (!text || this.amountMinor !== null) return '';
      return /^\d+\.\d{3,}$/.test(text) ? 'Use at most 2 decimals.' : 'Enter an amount above 0.';
    },
    paidOnInFuture() {
      return Boolean(this.invoice.paidOn) && this.invoice.paidOn > this.today;
    },
    // 1–30 whole days; null otherwise
    linkExpiresInDays() {
      const text = String(this.invoice.linkExpiresInDays).trim();
      if (!/^\d+$/.test(text)) return null;
      const days = Number(text);
      return days >= 1 && days <= 30 ? days : null;
    },
    linkDaysProblem() {
      return this.linkExpiresInDays === null ? 'Enter 1 to 30 days.' : '';
    },
    notifyEmail() {
      return this.invoice.notifyByEmail ? this.invoice.notifyEmail.trim() : '';
    },
    notifyEmailProblem() {
      return this.notifyEmail && !EMAIL_PATTERN.test(this.notifyEmail) ? 'Enter a valid email address.' : '';
    },
    // What still blocks the button, in the agreed order and wording
    missingFields() {
      const missing = [];
      if (!this.isIdService) {
        if (!this.appId) missing.push('Application ID');
        if (!this.credits) missing.push('Credits');
        if (!this.validityValid) missing.push('Validity');
        return missing;
      }
      if (!this.billed.data) missing.push('Application ID');
      if (!this.credits) missing.push('Credits');
      if (!this.validityValid) missing.push('Validity');
      if (!this.invoice.type) missing.push('Invoice type');
      if (this.invoice.type === 'UNPAID') {
        if (this.collectBlockedReason) missing.push('Invoice type');
        if (this.amountMinor === null) missing.push('Amount');
        if (this.linkExpiresInDays === null) missing.push('Link valid for');
        if (this.notifyEmailProblem) missing.push('Send to');
      }
      if (this.invoice.type === 'OFFLINE') {
        if (this.amountMinor === null) missing.push('Amount');
        if (!this.invoice.paymentReference.trim()) missing.push('Payment reference');
        if (!this.invoice.paidOn || this.paidOnInFuture) missing.push('Paid on');
      }
      if (this.profileIncomplete) missing.push(BILLING_DETAILS_ITEM);
      return missing;
    },
    // The preview and create body (contract §5); null until the form is valid
    invoiceBody() {
      if (!this.isIdService || this.missingFields.length) return null;
      const body = { appId: this.billed.data.app.appId, credits: this.credits, validityDays: this.validityInDays };
      if (this.invoice.type === 'COMPLIMENTARY') {
        body.amountMinor = 0;
      } else if (this.invoice.type === 'UNPAID') {
        // Collect payment: the server works out tax (GST for India, none for Global); the link total includes it
        body.amountMinor = this.amountMinor;
        body.isPaid = false;
      } else {
        body.amountMinor = this.amountMinor;
        body.isPaid = true;
        body.payment = {
          method: this.invoice.paymentMethod,
          reference: this.invoice.paymentReference.trim(),
          paidAt: this.invoice.paidOn,
        };
      }
      return body;
    },
    // The note and the link's delivery aren't priced, so typing them doesn't re-run the preview
    invoiceBodyKey() {
      return this.invoiceBody ? JSON.stringify(this.invoiceBody) : '';
    },
    createBody() {
      if (!this.invoiceBody) return null;
      const body = { ...this.invoiceBody };
      if (this.invoice.type === 'UNPAID') {
        body.notifyByEmail = this.invoice.notifyByEmail;
        if (this.notifyEmail) body.notifyEmail = this.notifyEmail;
        body.linkExpiresInDays = this.linkExpiresInDays;
      }
      const note = this.invoice.note.trim();
      if (note) body.note = note;
      return body;
    },
    // The preview for the form as it is now; an older one never shows
    currentPreview() {
      return this.preview.data && this.preview.key === this.invoiceBodyKey ? this.preview.data : null;
    },
    previewTaxLines() {
      return (this.currentPreview && this.currentPreview.tax && this.currentPreview.tax.lines) || [];
    },
    summaryChip() {
      if (this.currentPreview) return this.outcomeChip(this.currentPreview.willIssueAs);
      if (this.invoice.type === 'COMPLIMENTARY') return this.settlementChip('COMPLIMENTARY');
      if (this.invoice.type === 'OFFLINE') return this.settlementChip('OFFLINE');
      if (this.invoice.type === 'UNPAID') return this.outcomeChip({ status: 'AWAITING_PAYMENT', settlement: 'GATEWAY' });
      return null;
    },
    totalLabel() {
      return this.invoice.type === 'UNPAID' ? 'Customer pays' : 'Invoice total';
    },
    deliveryLabel() {
      if (!this.invoice.notifyByEmail) return 'Not emailed. Copy the link and send it yourself.';
      return `Emailed to ${this.notifyEmail || this.billedProfile.email || 'the billing email'}`;
    },
    creditsActiveText() {
      return this.creditsActiveLabel(this.currentPreview && this.currentPreview.creditsActive);
    },
    canSubmit() {
      return !this.missingFields.length && Boolean(this.currentPreview) && !this.preview.loading && !this.notConfigured && !this.loading;
    },
    submitLabel() {
      return {
        COMPLIMENTARY: 'Add free credits',
        OFFLINE: 'Recharge and issue paid invoice',
        UNPAID: 'Create payment link',
      }[this.invoice.type] || 'Choose an invoice type';
    },
    confirmLabel() {
      if (!this.isIdService) return 'Confirm & Recharge';
      if (this.create.retryable) return 'Retry';
      return this.invoice.type === 'UNPAID' ? 'Create payment link' : 'Confirm';
    },
    confirmHeader() {
      if (!this.isIdService) return 'Confirm Credit Recharge';
      return this.invoice.type === 'UNPAID' ? 'Confirm payment link' : 'Confirm recharge and invoice';
    },
    confirmIntro() {
      if (!this.isIdService) return 'Please review the details below. Credits cannot be taken back once recharged.';
      if (this.invoice.type === 'UNPAID') {
        return 'Please review the details below. The customer pays on the link; the invoice is issued and the credits are added once they pay.';
      }
      return 'Please review the details below. Invoices cannot be edited once issued.';
    },
    resultTitle() {
      if (!this.createdInvoice) return '';
      return this.createdInvoice.settlement === 'COMPLIMENTARY' ? 'Free credits added' : 'Credits recharged and paid invoice issued';
    },
    resultDetail() {
      return this.creditsActiveLabel(this.createdCreditsActive) || 'The invoice has been issued.';
    },
    // Expiry date = today + X months + Y days, using calendar months
    // (so 1 month from Jan 31 lands on Mar 2/3, matching Date rollover).
    validityRange() {
      const months = Number(this.form.validityMonths) || 0;
      const days = Number(this.form.validityDays) || 0;
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setMonth(end.getMonth() + months);
      end.setDate(end.getDate() + days);
      return { start, end };
    },
    validityInDays() {
      const { start, end } = this.validityRange;
      // Math.round absorbs the DST hour shift between the two midnights
      return Math.round((end - start) / (24 * 60 * 60 * 1000));
    },
    validityExpiryDate() {
      return this.validityRange.end.toDateString();
    },
    validityLabel() {
      const months = Number(this.form.validityMonths) || 0;
      const days = Number(this.form.validityDays) || 0;
      const parts = [];
      if (months) parts.push(`${months} month${months === 1 ? '' : 's'}`);
      if (days) parts.push(`${days} day${days === 1 ? '' : 's'}`);
      return parts.join(' ');
    },
    formattedAmount() {
      return new Intl.NumberFormat().format(Number(this.form.amount) || 0);
    },
  },
  watch: {
    // Step 1 loads the Billed to card 400 ms after the App ID stops changing
    appId() {
      if (!this.isIdService) return;
      this.scheduleBilledTo();
    },
    invoiceBodyKey() {
      this.serverErrors = {};
      this.schedulePreview();
    },
  },
  beforeDestroy() {
    clearTimeout(this.billedTimer);
    clearTimeout(this.previewTimer);
  },
  methods: {
    ...mapActions('mainStore', ['creditRecharge']),
    selectServiceType(type) {
      if (type === this.serviceType) return;
      this.serviceType = type;
      this.startOver();
    },
    selectInvoiceType(option) {
      if (option.disabled) return;
      this.invoice.type = option.value;
    },
    numberFormat(value) {
      const number = Number(value);
      return number ? new Intl.NumberFormat().format(number) : '';
    },
    money(amountMinor, currency) {
      return formatMinor(amountMinor, currency || this.currency || 'INR');
    },
    taxLabel(line) {
      return `${line.type} (${formatBps(line.rateBps)})`;
    },
    shortDate(value) {
      return new Date(value).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
    },
    settlementChip(settlement) {
      if (settlement === 'COMPLIMENTARY') return { label: 'Complimentary', className: 'is-complimentary' };
      return { label: 'Paid', className: 'is-paid' };
    },
    // The preview's willIssueAs: { status, settlement }
    outcomeChip(willIssueAs) {
      if (willIssueAs && willIssueAs.status === 'AWAITING_PAYMENT') return { label: 'Awaiting payment · Pay by link', className: 'is-due' };
      return this.settlementChip(willIssueAs && willIssueAs.settlement);
    },
    dateTime(value) {
      if (!value) return '';
      return new Date(value).toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    creditsActiveLabel(value) {
      if (value === 'WHEN_PAID') return 'Credits are added when the customer pays.';
      if (value === 'IMMEDIATELY') return 'Credits become active immediately.';
      if (value === 'AFTER_CURRENT_PLAN') return 'Credits start after the app\'s current plan runs low or is activated.';
      return '';
    },
    paymentMethodLabel(value) {
      const method = this.paymentMethods.find(m => m.value === value);
      return method ? method.text : value;
    },
    serverError(path) {
      return this.serverErrors[path] || '';
    },

    // ---- Step 1: Billed to

    scheduleBilledTo() {
      clearTimeout(this.billedTimer);
      this.billedRequest++;
      this.billed = { loading: false, error: '', data: null };
      this.profileRefused = false;
      this.paymentsRefused = false;
      if (!this.appId) return;
      this.billed.loading = true;
      this.billedTimer = setTimeout(() => this.loadBilledTo(), DEBOUNCE_MS);
    },
    async loadBilledTo() {
      const request = ++this.billedRequest;
      const appId = this.appId;
      this.billed = { loading: true, error: '', data: this.billed.data };
      try {
        const data = await getAdminBillingProfile(appId);
        if (request !== this.billedRequest) return;
        const firstLoad = !this.billed.data || this.billed.data.app.appId !== data.app.appId;
        this.billed = { loading: false, error: '', data };
        this.profileRefused = false;
        // Prefill validity from the region's validity add-on: India 1 month, Global 6 months
        if (firstLoad && !this.validityTouched) {
          this.form.validityMonths = data.profile.region === 'IN' ? '1' : '6';
          this.form.validityDays = '0';
        }
        if (firstLoad && !this.notifyEmailTouched) this.invoice.notifyEmail = data.profile.email || '';
      } catch (error) {
        if (request !== this.billedRequest) return;
        this.billed = { loading: false, error: billedToError(error), data: null };
      }
    },
    // The admin completed the customer's details: reload Billed to, then price again
    async onBillingSaved() {
      this.billingDialogOpen = false;
      await this.loadBilledTo();
      this.runPreview();
    },

    // ---- Summary: preview

    schedulePreview() {
      clearTimeout(this.previewTimer);
      this.previewRequest++;
      this.preview.error = '';
      if (!this.invoiceBody) {
        this.preview.loading = false;
        return;
      }
      this.preview.loading = true;
      this.previewTimer = setTimeout(() => this.runPreview(), DEBOUNCE_MS);
    },
    async runPreview() {
      clearTimeout(this.previewTimer);
      if (!this.invoiceBody) return;
      const request = ++this.previewRequest;
      const key = this.invoiceBodyKey;
      this.preview = { ...this.preview, loading: true, error: '' };
      try {
        const data = await previewAdminInvoice(this.invoiceBody);
        if (request !== this.previewRequest) return;
        this.notConfigured = false;
        this.preview = { loading: false, error: '', data, key };
      } catch (error) {
        if (request !== this.previewRequest) return;
        this.preview = { loading: false, error: '', data: null, key: '' };
        this.handleInvoiceError(error, message => { this.preview.error = message; });
      }
    },
    // Errors shared by preview and create (contract §5). `show` displays anything not shown elsewhere.
    handleInvoiceError(error, show) {
      if (error.code === 'VALIDATION_FAILED') {
        this.serverErrors = (error.details && error.details.fields) || {};
        show(Object.keys(this.serverErrors).length ? 'Please fix the highlighted fields.' : error.message);
      } else if (error.code === 'BILLING_PROFILE_INCOMPLETE') {
        this.profileRefused = true;
      } else if (error.code === 'BILLING_NOT_CONFIGURED') {
        this.notConfigured = true;
      } else if (['APP_NOT_FOUND', 'APP_NOT_BILLABLE', 'ONBOARDING_NOT_FOUND'].includes(error.code)) {
        this.billed = { loading: false, error: billedToError(error), data: null };
      } else if (error.code === 'PAYMENTS_NOT_AVAILABLE') {
        // Payments are switched off or not set up for this region. Free credits and Already paid still work.
        this.paymentsRefused = true;
        show('Collect payment isn\'t available for this customer yet.');
      } else if (error.status === 403) {
        this.accessDenied = true;
      } else {
        show(error instanceof BillingError ? error.message : 'Could not reach the server. Please try again.');
      }
    },

    // ---- Create

    handleRecharge() {
      if (this.isIdService) {
        if (!this.canSubmit) return;
        // One Idempotency-Key per attempt. An attempt whose outcome is unknown keeps its key,
        // so confirming the same invoice again can never issue a second one.
        const body = this.createBody;
        const sameAttempt = this.create.attempt && this.create.retryable
          && JSON.stringify(this.create.attempt.body) === JSON.stringify(body);
        this.create = sameAttempt ? { ...this.create, error: this.create.error } : { ...emptyCreate(), attempt: { key: uuidv4(), body } };
        this.$root.$emit('bv::show::modal', this.confirmPopupId);
        return;
      }
      if (!this.form.serviceId) {
        this.notifyErr("Please provide a Application ID.");
        return;
      }
      if (!this.form.amount || Number(this.form.amount) <= 0) {
        this.notifyErr("Amount must be greater than 0.");
        return;
      }
      const months = Number(this.form.validityMonths || 0);
      const days = Number(this.form.validityDays || 0);
      if (!Number.isInteger(months) || !Number.isInteger(days) || months < 0 || days < 0) {
        this.notifyErr("Validity months and days must be whole numbers (0 or more).");
        return;
      }
      if (this.validityInDays <= 0) {
        this.notifyErr("Validity period must be greater than 0.");
        return;
      }

      this.$root.$emit('bv::show::modal', this.confirmPopupId);
    },
    closeConfirm() {
      this.$root.$emit('bv::hide::modal', this.confirmPopupId);
    },
    async confirmRecharge() {
      if (this.isIdService) {
        await this.createInvoice();
        return;
      }
      // SSI Service: today's direct recharge, no invoice
      // Guards a double click landing during the popup's close animation
      if (this.loading) return;
      this.closeConfirm();
      this.loading = true;
      this.isLoading = true;
      try {
        await this.creditRecharge({
          serviceId: this.form.serviceId,
          amount: this.form.amount,
          amountDenom: this.form.amountDenom,
          validityPeriod: this.validityInDays,
          validityPeriodUnit: 'Days',
        });
        this.notifySuccess(`Credits recharged successfully for service ${this.form.serviceId}.`);
        this.form = defaultForm();
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || "Recharge failed.";
        const isPermissionDenied = errorMsg.toLowerCase().includes('permission denied') ||
          errorMsg.toLowerCase().includes('forbidden') ||
          errorMsg.toLowerCase().includes('access denied') ||
          errorMsg.toLowerCase().includes('not authorized');
        if (isPermissionDenied) {
          this.accessDenied = true;
        } else {
          this.notifyErr(errorMsg);
        }
      } finally {
        this.loading = false;
        this.isLoading = false;
      }
    },
    // POST /admin/billing/invoices with this attempt's body and key. A retry resends both unchanged.
    async createInvoice() {
      const { attempt } = this.create;
      if (!attempt || this.create.inFlight) return;
      this.create = { ...this.create, inFlight: true, error: '', blocked: false };
      try {
        const result = await createAdminInvoice(attempt.body, attempt.key);
        if (result.paymentLink) {
          // Collect payment: no invoice until the customer pays
          this.createdLink = result.paymentLink;
          this.create = emptyCreate();
          this.closeConfirm();
          return;
        }
        this.createdInvoice = result.invoice;
        this.createdCompany = this.billedProfile.legalName || (this.billed.data && this.billed.data.org.companyName) || '';
        this.createdCreditsActive = this.currentPreview ? this.currentPreview.creditsActive : null;
        this.create = emptyCreate();
        this.closeConfirm();
      } catch (error) {
        if (isRetryable(error)) {
          const link = attempt.body.isPaid === false;
          let message = error instanceof BillingError ? error.message : '';
          if (error.code === 'PAYMENTS_UNAVAILABLE') message = 'The payment link could not be created. Retry sends the same request.';
          if (!(error instanceof BillingError)) {
            message = link
              ? 'The server could not be reached. Retry sends the same request; it won\'t create a second link.'
              : 'The server could not be reached. Retry sends the same request; it won\'t issue a second invoice.';
          }
          this.create = { ...this.create, inFlight: false, error: message, retryable: true };
          return;
        }
        if (error.code === 'IDEMPOTENCY_KEY_REUSED') {
          // The key belongs to a different invoice: start a new attempt and ask again
          this.create = {
            ...emptyCreate(),
            attempt: { key: uuidv4(), body: attempt.body },
            error: 'These details changed since the last attempt. Please review and confirm again.',
          };
          return;
        }
        let message = '';
        this.handleInvoiceError(error, text => { message = text; });
        this.create = {
          ...this.create,
          inFlight: false,
          retryable: false,
          blocked: true,
          error: message || `The ${attempt.body.isPaid === false ? 'payment link' : 'invoice'} could not be created. Close this dialog and check the highlighted items.`,
        };
      }
    },
    // Renders the PDF from GET /admin/billing/invoices/:invoiceId (contract §4)
    async downloadCreatedInvoice() {
      if (!this.createdInvoice || this.downloading) return;
      this.downloading = true;
      this.downloadError = '';
      try {
        await downloadInvoiceDocument(await getAdminInvoice(this.createdInvoice.invoiceId));
      } catch (e) {
        this.downloadError = e.code === 'INVOICE_NOT_FOUND' ? 'This invoice could not be found.' : e.message || 'Could not prepare the invoice.';
      } finally {
        this.downloading = false;
      }
    },
    async copyCreatedLink() {
      try {
        await navigator.clipboard.writeText(this.createdLink.url);
        this.notifySuccess('Link copied');
      } catch (e) {
        this.notifyErr('Could not copy the link');
      }
    },
    // The Payment links tab of Super admin tools (SettingConfig reads ?ref=)
    viewPaymentLinks() {
      if (this.$route.query.ref === 'payment-links') return;
      this.$router.replace({ query: { ...this.$route.query, ref: 'payment-links' } }).catch(() => {});
    },
    startOver() {
      clearTimeout(this.billedTimer);
      clearTimeout(this.previewTimer);
      this.billedRequest++;
      this.previewRequest++;
      Object.assign(this, {
        form: defaultForm(),
        invoice: defaultInvoice(),
        validityTouched: false,
        notifyEmailTouched: false,
        billed: { loading: false, error: '', data: null },
        profileRefused: false,
        paymentsRefused: false,
        preview: { loading: false, error: '', data: null, key: '' },
        serverErrors: {},
        create: emptyCreate(),
        createdInvoice: null,
        createdCompany: '',
        createdCreditsActive: null,
        createdLink: null,
        downloadError: '',
        today: todayIso(),
      });
    },
  }
};
</script>
