<template>
  <v-container fluid pa-0>
    <load-ing :active.sync="isLoading" :can-cancel="false" :is-full-page="false"></load-ing>
    <div class="overview-container">
      <div class="header-row">
        <h2 class="title">Service Credit Recharge</h2>
      </div>

      <AccessDenied v-if="accessDenied" />

      <div v-else class="pa-2">
        <p class="text-subtitle-2 text-muted mb-6">
          {{ isIdService
            ? 'Add credits to an ID Service app. Every recharge issues an invoice: free, already paid, or paid by link.'
            : 'Allocate credits and set validity periods for your registered backend services.' }}
        </p>

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

        <!-- Result of the last ID Service invoice -->
        <section v-if="createdInvoice" class="result-card">
          <div class="result-head">
            <span class="result-icon"><v-icon small>{{ createdInvoice.status === 'UNPAID' ? 'mdi-send-clock-outline' : 'mdi-check-circle-outline' }}</v-icon></span>
            <div class="result-copy">
              <strong>{{ resultTitle }}</strong>
              <small>{{ resultDetail }}</small>
            </div>
            <span class="invoice-status" :class="invoiceStatusClass(createdInvoice)">{{ invoiceStatusLabel(createdInvoice) }}</span>
          </div>

          <dl class="result-grid">
            <div><dt>Invoice no.</dt><dd class="mono-text">{{ createdInvoice.invoiceNumber }}</dd></div>
            <div><dt>Billed to</dt><dd>{{ createdInvoice.customer.legalName }}</dd></div>
            <div><dt>Credits</dt><dd>{{ numberFormat(createdInvoice.credits) }} · {{ createdInvoice.validityDays }} days</dd></div>
            <div><dt>Total</dt><dd>{{ money(createdInvoice.totals.totalMinor, createdInvoice.currency) }}</dd></div>
          </dl>

          <div v-if="createdInvoice.paymentLink" class="payment-link-row">
            <v-icon x-small>mdi-link-variant</v-icon>
            <span class="mono-text payment-link-url">{{ createdInvoice.paymentLink.url }}</span>
            <button type="button" class="ghost-btn" @click="copyPaymentLink">
              <v-icon x-small>mdi-content-copy</v-icon> Copy
            </button>
          </div>
          <p v-if="createdInvoice.paymentLink" class="field-hint text-muted mb-0">
            Sent to {{ createdInvoice.paymentLink.sentTo.join(', ') }} · expires {{ shortDate(createdInvoice.paymentLink.expiresAt) }}
          </p>
          <p v-if="resultPreviewOnly" class="preview-note">
            <v-icon x-small>mdi-flask-outline</v-icon>
            Preview only: payment links and pending credits need the billing backend, so no credits were created.
          </p>

          <div class="result-actions">
            <button type="button" class="ghost-btn" :disabled="downloading" @click="downloadCreatedInvoice">
              <v-icon x-small>mdi-tray-arrow-down</v-icon>
              {{ downloading ? 'Preparing…' : 'Download invoice' }}
            </button>
            <button type="button" class="ghost-btn" @click="startOver">
              <v-icon x-small>mdi-plus</v-icon> New recharge
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

              <div v-if="isIdService && billing" class="billing-card">
                <div class="billing-main">
                  <span class="input-label mb-1">Billed to</span>
                  <strong>{{ billing.legalName }}</strong>
                  <small>{{ billing.address.join(', ') }}</small>
                  <small v-if="billing.gstin">GSTIN {{ billing.gstin }}</small>
                </div>
                <div class="billing-tags">
                  <span class="tag">{{ billing.label }}</span>
                  <span class="tag">{{ billing.currency }}</span>
                </div>
              </div>
              <div v-else class="field-hint text-muted mt-1">
                {{ isIdService ? 'Enter the app ID to load its billing details.' : `Enter the ${selectedServiceType.label} application ID.` }}
              </div>
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
                  <v-text-field v-model="form.amount" type="number" min="1" outlined dense hide-details color="primary"></v-text-field>
                  <v-btn v-if="isIdService" text x-small color="primary" class="px-0 mt-1 text-none" @click="showCreditInfo = true">
                    Understand Credit?
                  </v-btn>
                </v-col>
                <v-col cols="12" md="7">
                  <label class="input-label">Validity</label>
                  <div class="d-flex" style="gap: 8px;">
                    <v-text-field v-model="form.validityMonths" type="number" min="0" step="1" suffix="months" outlined dense hide-details color="primary"></v-text-field>
                    <v-text-field v-model="form.validityDays" type="number" min="0" step="1" suffix="days" outlined dense hide-details color="primary"></v-text-field>
                  </div>
                  <div v-if="validityInDays > 0" class="field-hint text-muted mt-1">
                    = <strong>{{ validityInDays }} days</strong><template v-if="!isIdService">, expires on {{ validityExpiryDate }}</template>
                  </div>
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
                  :class="{ selected: invoice.type === option.value }"
                  :aria-checked="invoice.type === option.value ? 'true' : 'false'"
                  @click="invoice.type = option.value"
                >
                  <span class="invoice-type-icon"><v-icon small>{{ option.icon }}</v-icon></span>
                  <strong>{{ option.label }}</strong>
                  <small>{{ option.description }}</small>
                  <span class="invoice-type-check" aria-hidden="true"><v-icon x-small>mdi-check</v-icon></span>
                </button>
              </div>

              <template v-if="invoice.type && invoice.type !== 'COMPLIMENTARY'">
                <v-row dense class="mt-3">
                  <v-col cols="12" md="5">
                    <label class="input-label">Amount, excluding tax</label>
                    <v-text-field
                      v-model="invoice.price"
                      type="number"
                      min="1"
                      :prefix="currencySymbol"
                      outlined
                      dense
                      hide-details
                      color="primary"
                    ></v-text-field>
                    <div v-if="billing && priceMinor > 0" class="field-hint text-muted mt-1">
                      <template v-for="line in taxPreview.lines">+ {{ line.label }} {{ money(line.amountMinor) }} </template>
                      = <strong>{{ money(totalMinor) }}</strong>
                    </div>
                  </v-col>

                  <template v-if="invoice.type === 'OFFLINE'">
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
                    </v-col>
                    <v-col cols="12" md="7">
                      <label class="input-label">Payment reference</label>
                      <v-text-field
                        v-model="invoice.paymentReference"
                        placeholder="UTR, cheque no. or receipt ID"
                        outlined
                        dense
                        hide-details
                        color="primary"
                        class="mono-text"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="5">
                      <label class="input-label">Paid on</label>
                      <v-text-field v-model="invoice.paidOn" type="date" :max="today" outlined dense hide-details color="primary"></v-text-field>
                    </v-col>
                  </template>

                  <v-col v-if="invoice.type === 'UNPAID'" cols="12" md="7">
                    <label class="input-label">Send payment link to</label>
                    <v-text-field
                      v-model="invoice.recipients"
                      placeholder="billing@customer.com, finance@customer.com"
                      outlined
                      dense
                      hide-details
                      color="primary"
                    ></v-text-field>
                    <div class="field-hint text-muted mt-1">Comma separated. The link expires after 15 days, with reminders at 3 and 7 days.</div>
                  </v-col>
                </v-row>
              </template>

              <label class="input-label mt-4">Internal note <span class="optional">optional</span></label>
              <v-text-field
                v-model="invoice.note"
                placeholder="Why this recharge? Not printed on the invoice."
                outlined
                dense
                hide-details
                color="primary"
              ></v-text-field>
            </section>
          </div>

          <aside v-if="isIdService" class="summary-card" aria-live="polite">
            <span class="input-label">Summary</span>
            <dl class="summary-lines">
              <div><dt>Credits</dt><dd>{{ numberFormat(form.amount) || '—' }}</dd></div>
              <div><dt>Validity</dt><dd>{{ validityInDays > 0 ? `${validityInDays} days` : '—' }}</dd></div>
              <div><dt>Amount</dt><dd>{{ billing ? money(invoice.type === 'COMPLIMENTARY' ? 0 : priceMinor) : '—' }}</dd></div>
              <div v-for="line in summaryTaxLines" :key="line.label"><dt>{{ line.label }}</dt><dd>{{ money(line.amountMinor) }}</dd></div>
            </dl>
            <div class="summary-total">
              <span>Invoice total</span>
              <strong>{{ billing ? money(totalMinor) : '—' }}</strong>
            </div>

            <div v-if="invoice.type" class="summary-outcome">
              <div><span class="invoice-status" :class="outcome.statusClass">{{ outcome.status }}</span></div>
              <p>{{ outcome.credits }}</p>
            </div>

            <ul v-if="missingFields.length" class="missing-list">
              <li v-for="item in missingFields" :key="item">{{ item }}</li>
            </ul>

            <button type="button" class="primary-btn" :disabled="!!missingFields.length || loading" @click="handleRecharge">
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

        <hf-pop-up :id="confirmPopupId" :Header="isIdService ? 'Confirm recharge and invoice' : 'Confirm Credit Recharge'" size="md">
          <p class="small text-muted mb-3">
            {{ isIdService
              ? 'Please review the details below. Invoices cannot be edited once issued.'
              : 'Please review the details below. Credits cannot be taken back once recharged.' }}
          </p>
          <table class="confirm-summary">
            <tbody>
              <tr>
                <th>Service Type</th>
                <td>{{ selectedServiceType && selectedServiceType.label }}</td>
              </tr>
              <tr>
                <th>Application ID</th>
                <td class="mono-text">{{ form.serviceId }}</td>
              </tr>
              <tr v-if="isIdService && billing">
                <th>Billed to</th>
                <td>{{ billing.legalName }} · {{ billing.label }}</td>
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
              <template v-if="isIdService && invoice.type">
                <tr>
                  <th>Invoice</th>
                  <td>{{ selectedInvoiceType.label }}</td>
                </tr>
                <tr>
                  <th>Invoice total</th>
                  <td><strong>{{ money(totalMinor) }}</strong></td>
                </tr>
                <tr v-if="invoice.type === 'OFFLINE'">
                  <th>Payment</th>
                  <td>{{ invoice.paymentMethod }} · <span class="mono-text">{{ invoice.paymentReference }}</span> · {{ invoice.paidOn }}</td>
                </tr>
                <tr v-if="invoice.type === 'UNPAID'">
                  <th>Payment link to</th>
                  <td>{{ recipientList.join(', ') }}</td>
                </tr>
                <tr>
                  <th>Credits</th>
                  <td>{{ outcome.credits }}</td>
                </tr>
              </template>
            </tbody>
          </table>
          <div class="d-flex justify-end mt-4" style="gap: 8px;">
            <v-btn outlined depressed @click="closeConfirm">Cancel</v-btn>
            <v-btn color="#111827" depressed @click="confirmRecharge">
              <span style="color: white;">{{ isIdService ? 'Confirm' : 'Confirm &amp; Recharge' }}</span>
            </v-btn>
          </div>
        </hf-pop-up>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.overview-container {
  padding: 1.0rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.header-row {
  margin-bottom: 0.5rem;
}

.title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
.payment-link-url { flex: 1 1 auto; overflow: hidden; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }

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

@media (max-width: 960px) {
  .recharge-layout { grid-template-columns: 1fr; }
  .summary-card { position: static; }
  .invoice-type-grid { grid-template-columns: 1fr; }
  .result-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
<script>
import { mapActions } from 'vuex/dist/vuex.common.js';
import loadIng from '../../../components/element/LoadIng.vue';
import UtilsMixin from '../../../mixins/utils.js';
import AccessDenied from '../../AccessDenied.vue';
import KycCreditCalculator from '../../../components/credit/KycCreditCalculator.vue';
import HfPopUp from '../../../components/element/hfPopup.vue';
import { mockAdminInvoice, mockBillingProfileForApp, previewTax } from '../../../components/credit/invoice/mockInvoices';
import { formatMinor } from '../../../components/credit/invoice/invoiceDocument';
import { downloadInvoicePdf } from '../../../components/credit/invoice/downloadInvoice';

const defaultForm = () => ({
  serviceId: '',
  amount: '100',
  validityMonths: '12',
  validityDays: '0',
  amountDenom: 'uHID',
});

const todayIso = () => new Date().toISOString().slice(0, 10);

const defaultInvoice = () => ({
  type: null,
  price: '',
  paymentMethod: 'Bank transfer',
  paymentReference: '',
  paidOn: todayIso(),
  recipients: '',
  note: '',
});

export default {
  name: 'CreditRecharge',
  components: { loadIng, AccessDenied, KycCreditCalculator, HfPopUp },
  mixins: [UtilsMixin],
  data() {
    return {
      loading: false,
      isLoading: false,
      accessDenied: false,
      serviceType: 'ID_SERVICE',
      serviceTypes: [
        { value: 'ID_SERVICE', label: 'ID Service', description: 'Recharge credits for an ID Service application.' },
        { value: 'SSI_SERVICE', label: 'SSI Service', description: 'Recharge credits for an SSI application.' },
      ],
      // amount and isPaid for the backend (ADR §8.2): free = amount 0, already paid = isPaid true, collect = isPaid false
      invoiceTypes: [
        { value: 'COMPLIMENTARY', label: 'Free credits', description: 'No charge. ₹0 invoice, credits active now.', icon: 'mdi-gift-outline' },
        { value: 'OFFLINE', label: 'Already paid', description: 'Paid outside the dashboard. Credits active now.', icon: 'mdi-bank-check' },
        { value: 'UNPAID', label: 'Collect payment', description: 'Send a payment link. Credits activate once paid.', icon: 'mdi-send-clock-outline' },
      ],
      paymentMethods: ['Bank transfer', 'UPI', 'Cheque', 'Card (outside dashboard)', 'Other system'],
      showCreditInfo: false,
      confirmPopupId: 'credit-recharge-confirm-popup',
      form: defaultForm(),
      invoice: defaultInvoice(),
      createdInvoice: null,
      resultPreviewOnly: false,
      downloading: false,
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
    selectedInvoiceType() {
      return this.invoiceTypes.find((t) => t.value === this.invoice.type) || {};
    },
    // TODO: GET /admin/billing/profiles by app once it exists; mock until then
    billing() {
      const appId = this.form.serviceId.trim();
      return appId.length >= 6 ? mockBillingProfileForApp(appId) : null;
    },
    currencySymbol() {
      if (!this.billing) return '';
      const part = new Intl.NumberFormat(this.billing.locale, { style: 'currency', currency: this.billing.currency })
        .formatToParts(0)
        .find(p => p.type === 'currency');
      return part ? part.value : '';
    },
    priceMinor() {
      return Math.max(Math.round((Number(this.invoice.price) || 0) * 100), 0);
    },
    chargeableMinor() {
      return this.invoice.type === 'COMPLIMENTARY' ? 0 : this.priceMinor;
    },
    taxPreview() {
      if (!this.billing) return { lines: [], taxMinor: 0 };
      return previewTax(this.billing.region, this.chargeableMinor);
    },
    summaryTaxLines() {
      return this.taxPreview.lines;
    },
    totalMinor() {
      return this.chargeableMinor + this.taxPreview.taxMinor;
    },
    recipientList() {
      const typed = this.invoice.recipients.split(',').map(e => e.trim()).filter(Boolean);
      return typed.length ? typed : (this.billing ? [this.billing.email] : []);
    },
    outcome() {
      return {
        COMPLIMENTARY: { status: 'Complimentary', statusClass: 'is-complimentary', credits: 'Credits become active immediately.' },
        OFFLINE: { status: 'Paid', statusClass: 'is-paid', credits: 'Credits become active immediately.' },
        UNPAID: { status: 'Payment due', statusClass: 'is-due', credits: 'Credits are added as "Awaiting payment" and activate once the customer pays.' },
      }[this.invoice.type] || {};
    },
    submitLabel() {
      return {
        COMPLIMENTARY: 'Add free credits',
        OFFLINE: 'Recharge and issue paid invoice',
        UNPAID: 'Create invoice and send link',
      }[this.invoice.type] || 'Choose an invoice type';
    },
    missingFields() {
      const missing = [];
      if (!this.isIdService) {
        if (!this.form.serviceId.trim()) missing.push('Application ID');
        if (!(Number(this.form.amount) > 0)) missing.push('Number of credits');
        if (!(this.validityInDays > 0)) missing.push('Validity');
        return missing;
      }
      if (!this.billing) missing.push('Application ID');
      if (!(Number(this.form.amount) > 0)) missing.push('Number of credits');
      if (!(this.validityInDays > 0)) missing.push('Validity');
      if (!this.invoice.type) missing.push('Invoice type');
      if (this.invoice.type && this.invoice.type !== 'COMPLIMENTARY' && !(this.priceMinor > 0)) missing.push('Amount');
      if (this.invoice.type === 'OFFLINE' && !this.invoice.paymentReference.trim()) missing.push('Payment reference');
      if (this.invoice.type === 'OFFLINE' && !this.invoice.paidOn) missing.push('Paid on');
      if (this.invoice.type === 'UNPAID' && !this.recipientList.length) missing.push('Payment link recipient');
      return missing;
    },
    resultTitle() {
      if (!this.createdInvoice) return '';
      if (this.createdInvoice.status === 'UNPAID') return 'Invoice created and payment link sent';
      return this.createdInvoice.settlement === 'COMPLIMENTARY' ? 'Free credits added' : 'Credits recharged and paid invoice issued';
    },
    resultDetail() {
      if (!this.createdInvoice) return '';
      return this.createdInvoice.status === 'UNPAID'
        ? 'Credits are awaiting payment and activate as soon as the customer pays.'
        : 'Credits are active. The invoice was emailed to the billing contact.';
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
    // Prefill validity from the region's validity add-on (India 1 month, Global 6 months); still editable
    'billing.region'(region) {
      if (!region || !this.isIdService) return;
      this.form.validityMonths = region === 'IN' ? '1' : '6';
      this.form.validityDays = '0';
    },
  },
  methods: {
    ...mapActions('mainStore', ['creditRecharge']),
    selectServiceType(type) {
      if (type === this.serviceType) return;
      this.serviceType = type;
      this.form = defaultForm();
      this.invoice = defaultInvoice();
      this.createdInvoice = null;
    },
    numberFormat(value) {
      const number = Number(value);
      return number ? new Intl.NumberFormat().format(number) : '';
    },
    money(amountMinor, currency) {
      return formatMinor(amountMinor, currency || (this.billing && this.billing.currency) || 'INR');
    },
    shortDate(value) {
      return new Date(value).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
    },
    invoiceStatusLabel(invoice) {
      if (invoice.status === 'UNPAID') return 'Payment due';
      return invoice.settlement === 'COMPLIMENTARY' ? 'Complimentary' : 'Paid';
    },
    invoiceStatusClass(invoice) {
      if (invoice.status === 'UNPAID') return 'is-due';
      return invoice.settlement === 'COMPLIMENTARY' ? 'is-complimentary' : 'is-paid';
    },
    handleRecharge() {
      if (this.isIdService) {
        if (this.missingFields.length) {
          this.notifyErr(`Please complete: ${this.missingFields.join(', ')}.`);
          return;
        }
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
      // Guards a double click landing during the popup's close animation
      if (this.loading) return;
      this.closeConfirm();
      this.loading = true;
      this.isLoading = true;

      try {
        // Free and already-paid recharges grant credits now, through today's endpoint.
        // Collect payment needs pending credits and payment links from the billing backend,
        // so for now it only previews the invoice (ADR §8.2).
        const grantsNow = !this.isIdService || this.invoice.type !== 'UNPAID';
        if (grantsNow) {
          await this.creditRecharge({
            serviceId: this.form.serviceId,
            amount: this.form.amount,
            amountDenom: this.form.amountDenom,
            validityPeriod: this.validityInDays,
            validityPeriodUnit: 'Days',
          });
        }

        if (!this.isIdService) {
          this.notifySuccess(`Credits recharged successfully for service ${this.form.serviceId}.`);
          this.form = defaultForm();
          return;
        }

        // TODO: replace with POST /admin/billing/invoices { appId, credits, validityDays, amountMinor, isPaid, ... }
        this.createdInvoice = mockAdminInvoice({
          type: this.invoice.type,
          appId: this.form.serviceId.trim(),
          credits: Number(this.form.amount),
          validityDays: this.validityInDays,
          amountMinor: this.chargeableMinor,
          payment: this.invoice.type === 'OFFLINE'
            ? { method: this.invoice.paymentMethod, reference: this.invoice.paymentReference.trim(), paidAt: new Date(this.invoice.paidOn).toISOString() }
            : null,
          recipients: this.invoice.type === 'UNPAID' ? this.recipientList : null,
        });
        this.resultPreviewOnly = !grantsNow;
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
    async downloadCreatedInvoice() {
      if (!this.createdInvoice || this.downloading) return;
      this.downloading = true;
      try {
        await downloadInvoicePdf(this.createdInvoice);
      } catch (e) {
        this.notifyErr(`Could not prepare the invoice: ${e.message}`);
      } finally {
        this.downloading = false;
      }
    },
    async copyPaymentLink() {
      try {
        await navigator.clipboard.writeText(this.createdInvoice.paymentLink.url);
        this.notifySuccess('Payment link copied');
      } catch (e) {
        this.notifyErr('Could not copy the link');
      }
    },
    startOver() {
      this.form = defaultForm();
      this.invoice = defaultInvoice();
      this.createdInvoice = null;
      this.resultPreviewOnly = false;
    },
  }
};
</script>
