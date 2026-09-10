<style scoped>

.detail-card {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  height: 100%;
}

.info-bar {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.info-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  font-weight: 600;
  margin-bottom: 2px;
}

.info-value {
  font-weight: 600;
  color: #374151;
  font-size: 13px;
}

.info-summary-row {
  display: flex;
  align-items: center;
  gap: 24px;
  width: 100%;
  min-width: 0;
}

.info-summary-item {
  min-width: 0;
}

.info-summary-date {
  flex: 0 0 155px;
}

.info-summary-email {
  flex: 0 1 280px;
}

.info-summary-attempts {
  flex: 0 0 70px;
}

.info-summary-status {
  flex: 0 0 130px;
  display: flex;
  align-items: center;
}

.info-actions-wrap {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
  margin-left: auto;
  white-space: nowrap;
}

.manual-review-btn {
  min-width: 210px;
  border: 1px solid #f59e0b;
  background: #fffaf0;
  color: #b45309;
  border-radius: 10px;
  padding: 6px 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0;
  line-height: 1.1;
  box-shadow: 0 1px 2px rgba(245, 158, 11, 0.08);
}

.manual-review-btn:hover {
  background: #fffbeb;
  color: #92400e;
}

.manual-review-btn .review-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
}

.manual-review-btn .review-subtitle {
  display: block;
  margin-top: 3px;
  color: #374151;
  font-size: 10px;
  font-weight: 600;
  text-transform: none;
}

.manual-review-btn i {
  font-size: 12px;
}

.card-section-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 10px;
  margin-bottom: 14px;
}

.data-table {
  border-collapse: collapse;
}

.data-table td {
  padding: 6px 4px;
  border: none;
  font-size: 13px;
  font-weight: 400;
  vertical-align: middle;
  color: #4b5563;
}

.data-table td:first-child {
  color: #6b7280;
  width: 48%;
}

.data-table td:last-child {
  font-weight: 500;
  text-align: right;
  word-break: break-word;
  color: #374151;
}

/* scrollable table inside cards */
.card-table-scroll {
  max-height: 240px;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 6px;
  padding-right: 8px;
  margin-right: -4px;
}

.card-table-scroll::-webkit-scrollbar {
  width: 3px;
}

.card-table-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.card-table-scroll::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}

.card-table-scroll::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.face-img {
  border-radius: 50%;
  border: 3px solid #e5e7eb;
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.centered-img {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.doc-thumb {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.15s;
}

.doc-thumb:hover {
  background: #f3f4f6;
}

/* ── document zoom modal ──────────────────────────────── */
::v-deep(#zoom-doc .modal-content) {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

::v-deep(#zoom-doc .modal-header) {
  background: #fff !important;
  border-bottom: 1px solid #f3f4f6;
  padding: 16px 20px;
}

::v-deep(#zoom-doc .modal-title) {
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 8px;
}

::v-deep(#zoom-doc .modal-header .close) {
  color: #6b7280;
  font-size: 1.2rem;
  opacity: 0.6;
}

::v-deep(#zoom-doc .modal-header .close:hover) {
  opacity: 1;
}

::v-deep(#zoom-doc .modal-body) {
  background: #f9fafb;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

::v-deep(#zoom-doc .modal-body img) {
  max-width: 100%;
  max-height: 72vh;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  background: #fff;
}

::v-deep(#manual-review-decision-modal .modal-content) {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  font-size: 13px;
}

::v-deep(#manual-review-decision-modal .modal-header) {
  padding: 16px 20px;
}

::v-deep(#manual-review-decision-modal .modal-title) {
  font-size: 14px;
  font-weight: 600;
}

::v-deep(#manual-review-decision-modal .custom-control-label),
::v-deep(#manual-review-decision-modal .alert),
::v-deep(#manual-review-decision-modal .form-control),
::v-deep(#manual-review-decision-modal .btn) {
  font-size: 13px;
}

::v-deep(#manual-review-decision-modal .modal-body) {
  background: #f9fafb;
  padding: 24px;
}

::v-deep(#manual-review-decision-modal .modal-footer) {
  background: #fff;
  border-top: 1px solid #e5e7eb;
  padding: 12px 20px;
}

.manual-review-cancel-btn {
  background: #fff !important;
  border-color: #6c757d !important;
  color: #6c757d !important;
}

.manual-review-cancel-btn:hover,
.manual-review-cancel-btn:focus {
  background: #6c757d !important;
  color: #fff !important;
}

.manual-review-submit-btn {
  background: #3b82f6 !important;
  border-color: #3b82f6 !important;
  color: #fff !important;
}

.manual-review-submit-btn:hover,
.manual-review-submit-btn:focus {
  background: #2563eb !important;
  border-color: #2563eb !important;
  color: #fff !important;
}

.manual-review-submit-btn:disabled {
  background: #3b82f6 !important;
  border-color: #3b82f6 !important;
  color: #fff !important;
  opacity: 0.65;
}

.risk-flag-list {
  max-height: 460px;
  overflow-y: auto;
  padding-right: 4px;
}

@media (max-width: 960px) {
  .info-summary-row {
    flex-wrap: wrap;
    gap: 16px;
  }

  .info-summary-date,
  .info-summary-email,
  .info-summary-attempts,
  .info-summary-status,
  .info-actions-wrap {
    flex: 1 1 100%;
  }

  .manual-review-btn {
    width: 100%;
    min-width: 0;
  }

  .info-actions-wrap {
    justify-content: stretch;
  }

}

.timeline-item {
  position: relative;
  padding: 8px 12px 8px 28px;
  border-left: 2px solid #e5e7eb;
  margin-left: 6px;
  margin-bottom: 4px;
}

.timeline-dot {
  position: absolute;
  left: -7px;
  top: 12px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #6b7280;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #e5e7eb;
}

.timeline-step-name {
  font-weight: 600;
  font-size: 13px;
  color: #374151;
}

.timeline-date {
  font-size: 12px;
  color: #9ca3af;
}

.back-link {
  color: #374151;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
  color: #374151;
}

.breadcrumb-sep {
  color: #d1d5db;
  margin: 0 8px;
  font-size: 12px;
}

.scrollit {
  overflow: hidden;
  max-height: 320px;
}

.scrollit:hover {
  overflow-y: auto;
}

.greyFont {
  color: grey;
}

.info-actions {
  display: flex;
  align-items: center;
  border-radius: 6px;
  font-size: 12px;
  justify-content: center;
  gap: 6px;
  min-height: 36px;
  min-width: 80px;
  padding: 6px 12px;
}

.decision-history-wrap {
  margin-left: 4px;
  padding-left: 20px;
  position: relative;
}

.decision-history-wrap::before {
  background: #e5e7eb;
  bottom: 14px;
  content: "";
  left: 5px;
  position: absolute;
  top: 12px;
  width: 1px;
}

.decision-history-item {
  padding: 0 0 10px;
  position: relative;
}

.decision-history-item::before {
  background: #fff;
  border: 2px solid #9ca3af;
  border-radius: 50%;
  content: "";
  height: 10px;
  left: -20px;
  position: absolute;
  top: 12px;
  width: 10px;
  z-index: 1;
}

.decision-history-item:first-child::before {
  background: #6b7280;
  border-color: #6b7280;
}

.decision-history-item:last-child {
  padding-bottom: 0;
}

.decision-history-event {
  background: #f9fafb;
  border: 1px solid #eef0f3;
  border-radius: 6px;
  padding: 9px 11px;
}

.decision-history-event-header {
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  padding-bottom: 7px;
}

.decision-history-grid {
  display: grid;
  gap: 5px 10px;
  grid-template-columns: 96px minmax(0, 1fr);
  margin-top: 7px;
}

.decision-history-label {
  color: #6b7280;
  font-size: 11px;
  font-weight: 500;
}

.decision-history-value {
  color: #374151;
  font-size: 12px;
  font-weight: 500;
  min-width: 0;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.score-value {
  font-size: 3rem;
  font-weight: 800;
}
.score-total {
  font-size: 1.25rem;
  font-weight: 500;
}
.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 2px;
  display: inline-block;
}
.bg-success { background-color: #4CAF50; }
.bg-warning { background-color: #FFC107; }
.bg-orange { background-color: #FF9800; }
.bg-danger { background-color: #F44336; }
.cursor-pointer { cursor: pointer; }

.sd-page { --sd-primary: #2563eb; --sd-success: #4ec96b; --sd-danger: rgba(243, 6, 6, .736); --sd-warning: #ffc107; --sd-secondary: #6c757d; color: #172554; padding: 12px 20px 40px; }
.sd-breadcrumb { align-items: center; color: #7180a5; display: flex; font-size: 12px; gap: 10px; margin-bottom: 22px; }
.sd-breadcrumb button { background: none; border: 0; color: #52658f; padding: 0; }
.sd-breadcrumb button i { margin-right: 8px; }
.sd-breadcrumb span { cursor: pointer; max-width: 70vw; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sd-header { align-items: center; display: flex; justify-content: space-between; margin-bottom: 16px; }
.sd-header h1 { color: #111827; font-size: 25px; font-weight: 750; line-height: 1.2; margin: 0; }
.sd-header p { color: #7180a5; font-size: 13px; margin: 4px 0 0; }
.sd-report-btn { background: #fff; border: 1px solid #cbd5e1; border-radius: 7px; color: #43557d; font-size: 13px; font-weight: 600; padding: 10px 18px; }
.sd-report-btn i { margin-right: 8px; }
.sd-profile-card { align-items: stretch; background: #fff; border: 1px solid #dbe3ef; border-radius: 9px; display: flex; margin-bottom: 16px; padding: 18px; }
.sd-avatar { align-items: center; align-self: center; background: #e8edf5; border-radius: 50%; color: #52658a; display: flex; flex: 0 0 58px; font-size: 20px; font-weight: 700; height: 58px; justify-content: center; }
.sd-profile-main { align-self: center; border-right: 1px solid #e2e8f0; display: flex; flex: 1 1 260px; flex-direction: column; margin-left: 16px; min-width: 180px; padding-right: 20px; }
.sd-profile-main strong { color: #14214a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sd-profile-main span { color: #7180a5; font-size: 12px; margin-top: 5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sd-stat { border-right: 1px solid #e2e8f0; display: flex; flex: 1 1 135px; flex-direction: column; justify-content: flex-start; padding: 4px 22px 0; }
.sd-stat:last-child { border-right: 0; }
.sd-stat label { color: #7180a5; font-size: 11px; margin-bottom: 8px; }
.sd-stat strong { color: #172554; font-size: 14px; }
.sd-status { align-self: flex-start; background: #f1f5f9; border-radius: 5px; color: #64748b; font-size: 13px; font-weight: 700; padding: 5px 9px; }
.sd-status.passed { background: rgba(78, 201, 107, .12); color: var(--sd-success); }
.sd-status.failed, .sd-verification-result.failed { background: rgba(243, 6, 6, .10); color: var(--sd-danger); }
.sd-verification-result.failed strong { color: var(--sd-danger); }
.sd-status.review, .sd-verification-result.review { background: rgba(255, 193, 7, .14); border-color: rgba(255, 193, 7, .35); color: #856404; }
.sd-verification-result.review strong { color: #856404; }
.sd-status.expired { background: rgba(108, 117, 125, .12); color: var(--sd-secondary); }
.sd-current-status-row { align-items: center; display: flex; }
.sd-risk-value { display: inline-block; font-size: 19px !important; }
.sd-risk-value small, .sd-risk-large small { color: #52658a; font-size: .55em; }
.sd-risk-band { background: #edfdf3; border-radius: 4px; font-size: 10px; font-weight: 800; margin-top: 4px; padding: 3px 7px; text-transform: uppercase; width: fit-content; }
.sd-tabs { border-bottom: 1px solid #dbe3ef; display: flex; gap: 12px; margin-bottom: 18px; overflow-x: auto; }
.sd-tabs button { background: transparent; border: 0; border-bottom: 2px solid transparent; color: #607095; font-size: 13px; padding: 12px 14px; white-space: nowrap; }
.sd-tabs button.active { border-bottom-color: #2563eb; color: #2563eb; font-weight: 700; }
.sd-tabs i { margin-right: 9px; }.sd-tab-count { background: #edf2fa; border-radius: 10px; margin-left: 7px; padding: 2px 7px; }
.sd-grid { align-items: start; display: grid; gap: 16px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.sd-card { background: #fff; border: 1px solid #dbe3ef; border-radius: 9px; min-width: 0; padding: 16px; }
.sd-grid > .sd-card { height: 235px; overflow-x: hidden; overflow-y: auto; scrollbar-color: #dbe3ef transparent; scrollbar-width: thin; }
.sd-grid > .sd-card::-webkit-scrollbar { width: 3px; }
.sd-grid > .sd-card::-webkit-scrollbar-track { background: transparent; }
.sd-grid > .sd-card::-webkit-scrollbar-thumb { background: #dbe3ef; border-radius: 8px; }
.sd-grid > .sd-card:hover::-webkit-scrollbar-thumb { background: #b8c4d6; }
.sd-grid > .decision-history-card { overflow: hidden; }
.decision-history-card .card-table-scroll { max-height: 172px; }
.sd-grid > .sd-notes-card { grid-column: 1 / -1; height: auto; min-height: 72px; }
.sd-card h2 { border-bottom: 1px solid #edf1f6; color: #172554; font-size: 14px; font-weight: 700; margin: 0 0 13px; padding-bottom: 13px; }
.sd-card h2 i { color: #52658a; margin-right: 10px; }
.sd-card dl { display: grid; font-size: 13px; gap: 8px 14px; grid-template-columns: minmax(110px, .75fr) 1fr; margin: 0; }
.sd-card dt { color: #7180a5; font-weight: 500; }.sd-card dd { color: #26375f; margin: 0; overflow-wrap: anywhere; }
.sd-checks { display: flex; justify-content: space-around; margin: 18px 0 22px; position: relative; }.sd-checks::before { background: #bbf7d0; content: ""; height: 2px; left: 12%; position: absolute; right: 12%; top: 10px; }
.sd-checks div { align-items: center; color: #7180a5; display: flex; flex: 1; flex-direction: column; font-size: 11px; gap: 6px; position: relative; text-align: center; z-index: 1; }
.sd-checks div > span { align-items: center; background: #16a34a; border-radius: 50%; color: #fff; display: flex; height: 21px; justify-content: center; width: 21px; }.sd-checks .failed > span { background: #ef4444; }
.sd-verification-result { align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; color: #64748b; display: flex; gap: 12px; padding: 12px; }.sd-verification-result.passed { background: #ecfdf3; border-color: #d1fae5; color: #16a34a; }.sd-verification-result > i { font-size: 24px; }.sd-verification-result div { align-items: center; display: flex; flex: 1; justify-content: space-between; }.sd-verification-result strong { color: inherit; display: block; font-size: 14px; }.sd-verification-result.passed strong { color: #15803d; }.sd-verification-result span { color: #7180a5; font-size: 11px; }
.sd-risk-large { display: inline-block; font-size: 38px; font-weight: 800; margin: 2px 8px 18px 0; }.sd-risk-track { background: linear-gradient(90deg,#22c55e 0 24%,#fde68a 30% 49%,#fdba74 55% 74%,#f87171 80% 100%); border-radius: 8px; height: 10px; overflow: visible; position: relative; }.sd-risk-track span { border: 2px solid #fff; border-radius: 50%; box-shadow: 0 0 0 1px rgba(15,23,42,.15); display: block; height: 14px; position: absolute; top: -2px; transform: translateX(-50%); width: 14px !important; }.sd-risk-labels { color: #7180a5; display: flex; font-size: 10px; justify-content: space-between; margin-top: 8px; }
.sd-flag { border-bottom: 1px solid #edf1f6; padding: 8px 0; }.sd-flag > span { color: #b45309; float: right; font-size: 10px; text-transform: uppercase; }.sd-flag p { clear: both; color: #7180a5; font-size: 12px; margin: 5px 0; }.sd-review-btn { background: #fff7ed; border: 1px solid #fdba74; border-radius: 6px; color: #c2410c; font-size: 12px; font-weight: 700; margin-top: 10px; padding: 8px 12px; width: 100%; }
.sd-document { cursor: pointer; }.sd-document img { border-radius: 6px; max-height: 360px; object-fit: contain; width: 100%; }
.sd-evidence-images { align-items: center; display: flex; gap: 16px; justify-content: center; }.sd-evidence-images figure { margin: 0; text-align: center; }.sd-evidence-images img { border: 3px solid #e5e7eb; border-radius: 50%; height: 92px; object-fit: cover; width: 92px; }.sd-evidence-images figcaption { color: #7180a5; font-size: 11px; margin-top: 5px; }.sd-result-line { border-radius: 6px; font-size: 12px; font-weight: 600; margin-top: 13px; padding: 9px 11px; }.sd-result-line.passed { background: #ecfdf3; color: #15803d; }.sd-result-line.failed { background: #fef2f2; color: #dc2626; }
.sd-audit-item { align-items: flex-start; border-left: 2px solid #dbe3ef; display: flex; gap: 12px; margin-left: 6px; padding: 5px 0 18px 18px; position: relative; }.sd-audit-item > span { background: #2563eb; border: 3px solid #dbeafe; border-radius: 50%; height: 11px; left: -7px; position: absolute; top: 7px; width: 11px; }.sd-audit-item div { flex: 1; }.sd-audit-item p, .sd-decision p { color: #dc2626; font-size: 11px; margin: 4px 0 0; }.sd-audit-item time, .sd-decision span { color: #7180a5; font-size: 11px; }.sd-decision { border-bottom: 1px solid #edf1f6; padding: 10px 0; }.sd-decision span { float: right; }
.sd-attempt { border: 1px solid #e2e8f0; border-left: 3px solid #22c55e; border-radius: 6px; margin-bottom: 8px; padding: 10px 12px; }.sd-attempt.failed { border-left-color: #ef4444; }.sd-attempt-head { display: flex; justify-content: space-between; }.sd-attempt p { color: #7180a5; font-size: 11px; margin: 4px 0 0; }.sd-notes-card p { color: #607095; font-size: 12px; margin: 0; }
.sd-attempts-card h2 { align-items: center; display: flex; }.sd-attempts-card h2 button { background: transparent; border: 0; color: var(--sd-primary); font-size: 11px; margin-left: auto; padding: 0; }.sd-attempts-card h2 button i { color: inherit; margin: 0 0 0 3px; }.sd-attempt-list { display: grid; gap: 8px; }.sd-attempt-summary { align-items: center; background: #fff; border: 1px solid #e2e8f0; border-left: 4px solid var(--sd-primary); border-radius: 6px; color: #172554; display: grid; gap: 4px 8px; grid-template-columns: minmax(90px,.7fr) auto 18px; padding: 9px 10px; text-align: left; width: 100%; }.sd-attempt-summary.passed { border-left-color: #16a34a; }.sd-attempt-summary.failed { border-left-color: #dc2626; }.sd-attempt-summary.review { border-left-color: #d97706; }.sd-attempt-summary.expired { border-left-color: #64748b; }.sd-attempt-summary > strong { font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.sd-attempt-summary .sd-status { font-size: 9px; padding: 3px 6px; }.sd-attempt-summary small { color: #7180a5; font-size: 9px; grid-column: 1 / 3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.sd-attempt-summary > i { color: #52658a; grid-column: 3; grid-row: 1 / 3; justify-self: end; }
.documents-panel { background: #fff; border: 1px solid #dbe3ef; border-radius: 9px; overflow: hidden; }
.documents-header { align-items: center; border-bottom: 1px solid #e8edf4; display: flex; justify-content: space-between; padding: 15px 18px; }
.documents-header h2 { color: #172554; font-size: 17px; margin: 0; }.documents-header h2 i { color: #435b86; margin-right: 10px; }.documents-header p { color: #7180a5; font-size: 11px; margin: 2px 0 0 28px; }
.attempt-selector { align-items: center; display: flex; gap: 8px; margin-left: auto; }.attempt-selector label { color: #52658a; font-size: 11px; font-weight: 600; margin: 0; }.attempt-selector select { background: #fff; border: 1px solid #cbd5e1; border-radius: 6px; color: #172554; font-size: 11px; min-width: 220px; padding: 8px 28px 8px 10px; }
.documents-layout { display: grid; grid-template-columns: 245px minmax(360px, 1.25fr) minmax(300px, 1fr); min-height: 545px; }
.document-types { border-right: 1px solid #e8edf4; max-height: 545px; overflow-x: hidden; overflow-y: auto; padding: 15px 12px; scrollbar-color: #dbe3ef transparent; scrollbar-width: thin; }.document-types h3 { color: #172554; font-size: 12px; margin: 0 0 12px; }.document-types button { align-items: center; background: #fff; border: 1px solid #e5eaf2; border-radius: 6px; color: #172554; display: grid; gap: 10px; grid-template-columns: 34px minmax(0,1fr) auto; margin-bottom: 10px; padding: 10px; text-align: left; width: 100%; }.document-types button.active { background: #f3f7ff; border-color: #bfdbfe; box-shadow: inset 3px 0 #2563eb; }.document-type-icon { align-items: center; background: #eaf2ff; border-radius: 7px; color: #2563eb; display: flex; height: 34px; justify-content: center; width: 34px; }.document-types strong,.document-types small { display: block; }.document-types strong { font-size: 12px; }.document-types small { color: #7180a5; font-size: 10px; margin-top: 3px; }.document-types em,.document-info-card h3 span { border-radius: 5px; font-size: 9px; font-style: normal; font-weight: 700; padding: 3px 6px; }.document-types em i,.document-info-card h3 span i { margin-right: 4px; }
.passed { color: #16a34a !important; }.failed { color: #dc2626 !important; }.document-types em.passed,.document-info-card h3 span.passed { background: #dcfce7; }.document-types em.failed,.document-info-card h3 span.failed { background: #fee2e2; }
.document-viewer { border-right: 1px solid #e8edf4; min-width: 0; padding: 14px; }.document-viewer-title { align-items: center; display: flex; justify-content: space-between; margin-bottom: 10px; }.document-viewer-title strong { color: #172554; font-size: 13px; }.document-viewer-title strong i,.document-info-card h3 > i { color: #52658a; margin-right: 6px; }
.document-stage { align-items: center; background: #f6f7f9; border-radius: 7px; display: flex; height: 350px; justify-content: center; overflow: auto; padding: 14px; }.document-stage > img { cursor: zoom-in; max-height: 100%; max-width: 100%; object-fit: contain; }.document-ocr { display: grid; font-size: 11px; gap: 7px 18px; grid-template-columns: 1fr 1.4fr; margin: auto; width: 90%; }.document-ocr dt { color: #7180a5; }.document-ocr dd { color: #172554; margin: 0; overflow-wrap: anywhere; }
.document-empty-state { align-items: center; color: #7180a5; display: flex; flex-direction: column; justify-content: center; padding: 24px; text-align: center; }.document-empty-state > i { color: #94a3b8; font-size: 42px; line-height: 1; margin-bottom: 10px; }.document-empty-state strong { color: #475569; font-size: 13px; }.document-empty-state span { font-size: 10px; margin-top: 4px; }
.document-thumbs { display: flex; gap: 12px; justify-content: center; margin-top: 12px; }.document-thumbs button { background: transparent; border: 0; color: #52658a; font-size: 10px; padding: 0; }.document-thumbs button img,.ocr-thumb { align-items: center; background: #f8fafc; border: 1px solid #dbe3ef; border-radius: 5px; display: flex; height: 58px; justify-content: center; margin-bottom: 5px; object-fit: cover; padding: 3px; width: 92px; }.document-thumbs button.active img,.document-thumbs button.active .ocr-thumb { border: 2px solid #2563eb; }.ocr-thumb { color: #607095; font-size: 20px; }
.document-insights { background: #fbfcfe; padding: 0 12px 12px; }.document-info-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; margin-top: 12px; max-height: 218px; overflow-y: auto; padding: 10px 12px; scrollbar-color: #dbe3ef transparent; scrollbar-width: thin; }.document-info-card h3 { align-items: center; border-bottom: 1px solid #edf1f6; color: #172554; display: flex; font-size: 11px; justify-content: space-between; margin: 0 0 9px; padding-bottom: 8px; }.verification-result-row { align-items: center; display: grid; font-size: 10px; gap: 7px; grid-template-columns: 13px 1fr auto; margin: 7px 0; }.verification-result-row strong { font-size: 10px; }.document-info-card dl { display: grid; font-size: 10px; gap: 5px 12px; grid-template-columns: minmax(100px,.8fr) 1fr; margin: 0; }.document-info-card dt { color: #7180a5; font-weight: 500; }.document-info-card dd { color: #26375f; margin: 0; overflow-wrap: anywhere; }
.document-info-card h3 > span:first-child { align-items: center; border-radius: 0; display: inline-flex; font-size: inherit; padding: 0; }.document-info-card h3 > span:first-child i { color: #52658a; margin-right: 6px; }
.audit-panel { align-items: stretch; display: grid; gap: 16px; grid-template-columns: minmax(0, 2.2fr) minmax(280px, .85fr); }
.audit-log,.audit-event-card { background: #fff; border: 1px solid #dbe3ef; border-radius: 9px; min-width: 0; }.audit-log { align-self: stretch; display: flex; flex-direction: column; min-height: 0; width: 100%; }
.audit-log-header { align-items: flex-start; border-bottom: 1px solid #e8edf4; display: flex; justify-content: space-between; padding: 15px 16px 12px; }
.audit-log-header h2,.audit-event-card h2 { color: #172554; font-size: 16px; margin: 0; }.audit-log-header h2 i,.audit-event-card h2 i { color: #52658a; margin-right: 8px; }.audit-log-header p { color: #7180a5; font-size: 11px; margin: 3px 0 0 27px; }
.audit-session-filters { display: flex; gap: 7px; overflow-x: auto; padding: 10px 14px 1px; scrollbar-color: #dbe3ef transparent; scrollbar-width: thin; }
.audit-session-filter { align-items: center; background: #f8fafc; border: 1px solid #e5eaf2; border-radius: 16px; color: #607095; display: inline-flex; font-size: 10px; gap: 5px; padding: 5px 10px; white-space: nowrap; }.audit-session-filter.active { background: #dbeafe; border-color: #93c5fd; color: #1d4ed8; font-weight: 700; }.audit-session-filter.passed i { color: #15803d; }.audit-session-filter.failed i { color: #dc2626; }.audit-session-filter.expired i { color: #475569; }.audit-session-filter.review i,.audit-session-filter.risk i { color: #b45309; }.audit-session-filter.passed.active { background: #dcfce7; border-color: #86efac; color: #15803d; }.audit-session-filter.failed.active { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }.audit-session-filter.expired.active { background: #e5e7eb; border-color: #cbd5e1; color: #475569; }.audit-session-filter.review.active,.audit-session-filter.risk.active { background: #fef3c7; border-color: #fcd34d; color: #92400e; }
.audit-groups { flex: 1 1 auto; max-height: 515px; min-height: 0; overflow-x: hidden; overflow-y: auto; padding: 0 14px 12px; scrollbar-color: #cbd5e1 transparent; scrollbar-width: thin; }.audit-groups::-webkit-scrollbar { width: 3px; }.audit-groups::-webkit-scrollbar-thumb { background: #dbe3ef; border-radius: 4px; }
.audit-group { margin-top: 9px; }.audit-group-toggle { align-items: center; background: #dbeafe; border: 0; border-left: 4px solid var(--sd-primary); border-radius: 6px; color: #172554; cursor: pointer; display: flex; gap: 9px; padding: 9px 10px; text-align: left; touch-action: manipulation; transition: filter .15s ease, box-shadow .15s ease; user-select: none; width: 100%; }.audit-group-toggle:hover { filter: brightness(.98); }.audit-group-toggle:focus-visible { box-shadow: 0 0 0 2px rgba(37,99,235,.22); outline: none; }.audit-group-toggle.passed { background: #dcfce7; border-left-color: #16a34a; }.audit-group-toggle.failed { background: #fee2e2; border-left-color: #dc2626; }.audit-group-toggle.review { background: #fef3c7; border-left-color: #d97706; }.audit-group-toggle.expired { background: #e5e7eb; border-left-color: #64748b; }.audit-group-toggle.passed > strong { color: #15803d; }.audit-group-toggle.failed > strong { color: #dc2626; }.audit-group-toggle.review > strong { color: #92400e; }.audit-group-toggle.expired > strong { color: #334155; }.audit-group-toggle.expired .sd-status { background: #cbd5e1; color: #334155; }.audit-group-toggle > strong { font-size: 12px; }.audit-group-toggle > span { color: #64748b; font-size: 10px; }.audit-group-toggle .audit-group-count { margin-left: auto; }.audit-group-toggle > i { color: #52658a; }
.audit-table-head,.audit-event { align-items: center; display: grid; gap: 10px; grid-template-columns: 86px 24px minmax(130px,.9fr) minmax(180px,1.4fr) 80px; }.audit-table-head { border-bottom: 1px solid #edf1f6; color: #7180a5; font-size: 9px; padding: 8px 9px; }.audit-table-head span:nth-child(2) { grid-column: 2 / 4; }
.audit-table-head.without-actor,.audit-event.without-actor { grid-template-columns: 86px 24px minmax(130px,.9fr) minmax(180px,1.4fr); }
.audit-event { background: #fff; border: 0; border-bottom: 1px solid #edf1f6; border-radius: 3px; color: #26375f; cursor: pointer; font-size: 10px; padding: 8px 9px; position: relative; text-align: left; touch-action: manipulation; transition: background-color .14s ease, box-shadow .14s ease; user-select: none; width: 100%; }.audit-event:hover { background: #f8faff; }.audit-event.selected { background: #f8faff; box-shadow: inset 0 0 0 1px #dbeafe; }.audit-event.selected .audit-event-title { color: #1d4ed8; }.audit-event.selected .audit-event-icon { box-shadow: 0 0 0 2px #bfdbfe; }.audit-event:focus-visible { box-shadow: inset 0 0 0 1px #93c5fd, 0 0 0 2px rgba(37,99,235,.14); outline: none; }.audit-event time,.audit-event-detail,.audit-event-actor { color: #7180a5; }.audit-event-icon { align-items: center; background: #eff6ff; border-radius: 50%; color: var(--sd-primary); display: flex; flex: 0 0 22px; font-size: 15px; height: 22px; justify-content: center; transition: box-shadow .14s ease; width: 22px; }.audit-event-icon.passed { background: rgba(78, 201, 107, .12); color: var(--sd-success); }.audit-event-icon.failed { background: rgba(243, 6, 6, .10); color: var(--sd-danger); }.audit-event-icon.expired { background: rgba(108, 117,125,.12); color: var(--sd-secondary); }.audit-event-icon.review { background: rgba(255,193,7,.14); color: #856404; }.audit-event-title { font-weight: 600; transition: color .14s ease; }.audit-event-detail { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.audit-side { display: flex; flex-direction: column; min-height: 0; min-width: 0; }
.audit-side > .audit-event-card:first-child { display: flex; flex: 1 1 auto; flex-direction: column; min-height: 0; }
.audit-event-card { padding: 14px; }.audit-event-card + .audit-event-card { margin-top: 12px; }.audit-event-card h2 { border-bottom: 1px solid #edf1f6; font-size: 13px; margin-bottom: 12px; padding-bottom: 10px; }.audit-selected-heading { align-items: flex-start; display: flex; gap: 9px; margin-bottom: 13px; }.audit-selected-heading > i { color: var(--sd-primary); font-size: 22px; }.audit-selected-heading > i.passed { color: var(--sd-success); }.audit-selected-heading > i.failed { color: var(--sd-danger); }.audit-selected-heading > i.expired { color: var(--sd-secondary); }.audit-selected-heading > i.review { color: #856404; }.audit-selected-heading strong { color: #172554; display: block; font-size: 12px; }.audit-selected-heading span { color: #7180a5; display: block; font-size: 10px; margin-top: 2px; }.audit-event-card dl { display: grid; font-size: 10px; gap: 7px 10px; grid-template-columns: 90px minmax(0,1fr); margin: 0; }.audit-event-card dt { color: #7180a5; font-weight: 500; }.audit-event-card dd { color: #26375f; margin: 0; overflow-wrap: anywhere; }
.audit-risk-count { align-items: center; background: #fff3cd; border-radius: 10px; color: #856404 !important; display: inline-flex; font-weight: 700; gap: 4px; padding: 3px 7px; }
.audit-event-flags { border-top: 1px solid #edf1f6; display: flex; flex: 1 1 0; flex-direction: column; margin-top: 13px; min-height: 0; overflow: hidden; padding-top: 12px; }
.audit-event-flags h3 { align-items: center; color: #172554; display: flex; font-size: 11px; gap: 4px; margin: 0 0 8px; }
.audit-event-flags-list { align-content: start; display: grid; flex: 1 1 0; gap: 7px; min-height: 0; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; padding-right: 6px; scrollbar-color: #cbd5e1 transparent; scrollbar-gutter: stable; scrollbar-width: thin; }
.audit-event-flags-list::-webkit-scrollbar { width: 4px; }
.audit-event-flags-list::-webkit-scrollbar-track { background: transparent; }
.audit-event-flags-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.audit-event-flag { background: #fffbeb; border-left: 3px solid var(--sd-warning); border-radius: 5px; min-width: 0; overflow: hidden; padding: 8px; }
.audit-event-flag header { align-items: flex-start; display: flex; gap: 6px; min-width: 0; }
.audit-event-flag header strong { font-size: 10px; min-width: 0; overflow-wrap: anywhere; }
.audit-event-flag header span { color: #856404; flex: 0 0 auto; font-size: 9px; font-weight: 700; margin-left: auto; }
.audit-event-flag p { color: #64748b; font-size: 9px; margin: 5px 0 0; overflow-wrap: anywhere; }
.audit-event-flag dl { grid-template-columns: minmax(82px,.8fr) minmax(0,1.2fr); margin-top: 7px; }
.risk-page-header { align-items: center; display: flex; margin-bottom: 13px; padding: 2px 4px; }.risk-page-header h2 { color: #172554; font-size: 17px; margin: 0; }.risk-page-header h2 i { color: #52658a; margin-right: 9px; }.risk-page-header p { color: #7180a5; font-size: 11px; margin: 3px 0 0 29px; }
.risk-layout { align-items: start; display: grid; gap: 14px; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); }.risk-column { display: flex; flex-direction: column; gap: 14px; min-width: 0; }.risk-detail-card { background: #fff; border: 1px solid #dbe3ef; border-radius: 8px; min-width: 0; padding: 15px; }.risk-detail-card h3 { align-items: center; border-bottom: 1px solid #edf1f6; color: #172554; display: flex; font-size: 12px; margin: 0 0 13px; padding-bottom: 10px; }.risk-detail-card h3 > i { color: #52658a; font-size: 16px; margin-right: 7px; }.risk-detail-card h3 > span { margin-left: auto; }.risk-score-line { align-items: center; display: flex; gap: 10px; margin-bottom: 17px; }.risk-score-line .sd-risk-large { margin: 0; }.risk-score-line .sd-risk-band { margin: 0; }.risk-verification-row { align-items: center; display: grid; font-size: 11px; gap: 8px; grid-template-columns: 18px minmax(0,1fr) auto; padding: 5px 0; }.risk-verification-row > i { font-size: 16px; }.risk-verification-row strong { font-size: 10px; }.risk-flags-list { display: grid; gap: 9px; max-height: 360px; overflow-y: auto; padding-right: 4px; scrollbar-color: #cbd5e1 transparent; scrollbar-width: thin; }.risk-flags-list::-webkit-scrollbar { width: 3px; }.risk-flags-list::-webkit-scrollbar-track { background: transparent; }.risk-flags-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }.risk-flag-item { border: 1px solid #e5eaf2; border-left: 3px solid #f59e0b; border-radius: 6px; padding: 10px; }.risk-flag-item.high,.risk-flag-item.critical { border-left-color: #dc2626; }.risk-flag-head { align-items: center; display: flex; gap: 7px; }.risk-flag-head > i { color: #d97706; font-size: 16px; }.risk-flag-item.high .risk-flag-head > i,.risk-flag-item.critical .risk-flag-head > i { color: #dc2626; }.risk-flag-head strong { color: #172554; font-size: 11px; }.risk-flag-head span { margin-left: auto; }.risk-flag-item p { color: #7180a5; font-size: 10px; margin: 6px 0 0; }.risk-flag-meta { color: #52658a !important; font-weight: 600; }.risk-decision-details { display: grid; font-size: 10px; gap: 7px 10px; grid-template-columns: minmax(90px,.7fr) 1fr; margin: 0; }.risk-decision-details dt { color: #7180a5; font-weight: 500; }.risk-decision-details dd { color: #26375f; margin: 0; overflow-wrap: anywhere; }
@media (max-width: 1050px) { .documents-layout { grid-template-columns: 210px 1fr; }.document-insights { border-top: 1px solid #e8edf4; grid-column: 1 / -1; display: grid; gap: 12px; grid-template-columns: repeat(3,1fr); padding-top: 12px; }.document-info-card { margin-top: 0; } }
@media (max-width: 1050px) { .risk-layout { grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); } }
@media (max-width: 950px) { .audit-panel { grid-template-columns: 1fr; }.audit-groups { max-height: none; }.audit-side { display: grid; gap: 12px; grid-template-columns: repeat(2,minmax(0,1fr)); }.audit-side > .audit-event-card:first-child { display: block; }.audit-event-flags { display: block; }.audit-event-flags-list { max-height: 220px; }.audit-event-card + .audit-event-card { margin-top: 0; } }
@media (max-width: 720px) { .documents-layout { display: block; }.document-types,.document-viewer { border-right: 0; border-bottom: 1px solid #e8edf4; }.document-insights { display: block; }.document-info-card { margin-top: 12px; }.document-stage { height: 280px; } }
@media (max-width: 720px) { .audit-side { display: block; }.audit-event-card + .audit-event-card { margin-top: 12px; }.audit-table-head { display: none; }.audit-event { grid-template-columns: 70px 22px minmax(110px,1fr); }.audit-event-detail,.audit-event-actor { display: none; } }
@media (max-width: 720px) { .risk-layout { grid-template-columns: 1fr; } }
.sd-verification-result strong small { color: #607095; display: block; font-size: 11px; font-weight: 400; margin-top: 3px; }
@media (max-width: 1100px) { .sd-profile-card { flex-wrap: wrap; }.sd-stat { border-top: 1px solid #e2e8f0; margin-top: 16px; padding-top: 14px; }.sd-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } }
@media (max-width: 700px) { .sd-page { padding: 8px 4px 30px; }.sd-header { align-items: flex-start; }.sd-header p { max-width: 220px; }.sd-profile-main { border-right: 0; }.sd-stat { border-right: 0; flex-basis: 50%; padding: 12px 8px 0; }.sd-grid { grid-template-columns: 1fr; }.sd-grid > .sd-card { height: auto; max-height: 360px; }.sd-verification-result div { flex-direction: column; }.sd-tabs { gap: 0; } }
</style>

<template>
  <b-container fluid class="py-3" :class="isContainerShift ? 'homeShift' : 'home'">
    <loadIng
      :active.sync="isLoading"
      :can-cancel="true"
      :is-full-page="fullPage"
    ></loadIng>

    <div class="sd-page" v-if="session && Object.keys(session).length">
      <div class="sd-breadcrumb">
        <button type="button" @click="goBack"><i class="mdi mdi-arrow-left"></i>{{ breadcrumbBackLabel }}</button>
        <i class="mdi mdi-chevron-right"></i>
        <span @click="copyToClip(sessionId, isSessionDetailView ? 'Session ID' : 'User ID')">{{ breadcrumbCurrentLabel }}</span>
      </div>
      <header class="sd-header">
        <div><h1>{{ pageTitle }}</h1><p>{{ pageDescription }}</p></div>
        <button v-if="session.status" class="sd-report-btn" @click="downloadKYCReport"><i class="mdi mdi-download-outline"></i> Report</button>
      </header>
      <section class="sd-profile-card">
        <div class="sd-avatar">{{ userInitials }}</div>
        <div class="sd-profile-main"><strong v-if="session.email">{{ session.email }}</strong><span v-if="isSessionDetailView">Session ID: {{ session.sessionId || sessionId }}</span><span v-else-if="session.userId">User ID: {{ session.userId }}</span><span v-else-if="sessionId">User ID: {{ sessionId }}</span></div>
        <div v-if="session.status" class="sd-stat">
          <label>{{ isSessionDetailView ? "Session Status" : "Current Status" }}</label>
          <div class="sd-current-status-row">
            <span class="sd-status" :class="statusTone">{{ statusDisplayLabel }}</span>
          </div>
        </div>
        <div v-if="hasRiskScore" class="sd-stat"><label>{{ isSessionDetailView ? "Session Risk Score" : "Current Risk Score" }}</label><strong class="sd-risk-value" :style="{ color: riskColor }">{{ session.risk.riskScore }} <small>/ 100</small></strong><span v-if="session.risk.riskBand" class="sd-risk-band" :style="{ color: riskColor }">{{ session.risk.riskBand }}</span></div>
        <div v-if="verificationAttemptCount" class="sd-stat"><label>Total Attempts</label><strong>{{ verificationAttemptCount }}</strong></div>
        <div v-if="latestVerificationSummary" class="sd-stat"><label>{{ latestVerificationSummary.label }}</label><strong :title="latestVerificationSummary.title">{{ latestVerificationSummary.primary }}</strong><span v-if="latestVerificationSummary.secondary">{{ latestVerificationSummary.secondary }}</span></div>
      </section>
      <nav class="sd-tabs">
        <button v-for="tab in visibleTabs" :key="tab.id" :class="{ active: activeTab === tab.id }" @click="selectTab(tab.id)"><i :class="tab.icon"></i>{{ tab.label }}<span v-if="tab.count" class="sd-tab-count">{{ tab.count }}</span></button>
      </nav>
      <div v-if="activeTab === 'overview'" class="sd-grid">
        <section v-if="identityEntries.length" class="sd-card"><h2><i class="mdi mdi-account-outline"></i> Identity Information</h2><dl><template v-for="item in identityEntries"><dt :key="item.key + '-label'">{{ item.label }}</dt><dd :key="item.key">{{ formatFieldValue(item.key, item.value) }}</dd></template></dl></section>
        <section v-if="verificationChecks.length || session.status" class="sd-card"><h2><i class="mdi mdi-shield-check-outline"></i> Verification Status</h2><div v-if="verificationChecks.length" class="sd-checks"><div v-for="check in verificationChecks" :key="check.label" :class="check.passed ? 'passed' : 'failed'"><span><i :class="check.passed ? 'mdi mdi-check' : 'mdi mdi-close'"></i></span><small>{{ check.label }}</small></div></div><div v-if="session.status" class="sd-verification-result" :class="statusTone"><i :class="statusIcon"></i><div><strong>{{ statusDisplayLabel }}<small v-if="allAvailableChecksPassed">All available verification checks passed.</small></strong><span v-if="session.completedAt">{{ formatDate(session.completedAt) }}</span></div></div></section>
        <section v-if="hasRiskScore" class="sd-card sd-risk-card"><h2><i class="mdi mdi-alert-outline"></i> Risk Score</h2><div class="sd-risk-large" :style="{ color: riskColor }">{{ session.risk.riskScore }} <small>/ 100</small></div><span v-if="session.risk.riskBand" class="sd-risk-band" :style="{ color: riskColor }">{{ session.risk.riskBand }}</span><div class="sd-risk-track"><span :style="{ left: riskPercent + '%', backgroundColor: riskColor }"></span></div><div class="sd-risk-labels"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div></section>
        <section v-if="deviceLocationEntries.length" class="sd-card"><h2><i class="mdi mdi-laptop"></i> Device &amp; Location</h2><dl><template v-for="item in deviceLocationEntries"><dt :key="item.label + '-label'">{{ item.label }}</dt><dd :key="item.label">{{ item.value }}</dd></template></dl></section>
        <section v-if="overviewVerificationResults.length" class="sd-card"><h2><i class="mdi mdi-clipboard-check-outline"></i> Verification Results</h2><div v-for="result in overviewVerificationResults" :key="result.label" class="risk-verification-row"><i :class="result.passed ? 'mdi mdi-check-circle passed' : 'mdi mdi-close-circle failed'"></i><span>{{ result.label }}</span><strong :class="result.passed ? 'passed' : 'failed'">{{ result.value }}</strong></div></section>
        <section v-if="overviewVerificationAttempts.length" class="sd-card sd-attempts-card">
          <h2><i class="mdi mdi-history"></i> Verification Attempts <button v-if="overviewAttemptLimit" type="button" @click="overviewAttemptLimit = null">View All <i class="mdi mdi-arrow-right"></i></button></h2>
          <div class="sd-attempt-list">
            <button v-for="attempt in overviewVerificationAttempts" :key="attempt.key" type="button" class="sd-attempt-summary" :class="attempt.tone" @click="viewSessionAttempt(attempt.key)">
              <strong :title="attempt.fullLabel">{{ attempt.label }}</strong>
              <span v-if="attempt.statusLabel" class="sd-status" :class="attempt.tone">{{ attempt.statusLabel }}</span>
              <small v-if="attempt.dateRange">{{ attempt.dateRange }}</small>
              <i class="mdi mdi-chevron-right"></i>
            </button>
          </div>
        </section>
        <section v-if="notes.length" class="sd-card sd-notes-card"><h2><i class="mdi mdi-information-outline"></i> Notes</h2><p v-for="(note, index) in notes" :key="index">{{ note }}</p></section>
      </div>
      <section v-else-if="activeTab === 'documents'" class="documents-panel">
        <header class="documents-header">
          <div><h2><i class="mdi mdi-file-document-outline"></i> Documents</h2><p>Identity documents and evidence submitted during verification.</p></div>
          <div v-if="attemptOptions.length" class="attempt-selector"><label for="document-attempt">Attempt:</label><select id="document-attempt" v-model="selectedAttemptSessionId" @change="selectAttemptSession"><option v-for="attempt in attemptOptions" :key="attempt.id" :value="attempt.id">{{ attempt.label }}</option></select></div>
        </header>
        <div class="documents-layout">
          <aside class="document-types">
            <h3>Document Types</h3>
            <button v-for="item in documentTypeItems" :key="item.key" :class="{ active: selectedDocumentItem && selectedDocumentItem.key === item.key }" @click="selectDocumentCategory(item.category, item.key)"><span class="document-type-icon"><i :class="item.icon"></i></span><span><strong>{{ item.label }}</strong><small v-if="item.subtitle">{{ item.subtitle }}</small></span><em v-if="item.result" :class="item.result.tone"><i :class="item.result.passed ? 'mdi mdi-check-circle-outline' : 'mdi mdi-close-circle-outline'"></i>{{ item.result.label }}</em></button>
          </aside>

          <main class="document-viewer">
            <div class="document-viewer-title"><strong><i class="mdi mdi-card-account-details-outline"></i>{{ activeDocumentTitle }}</strong></div>
            <div class="document-stage">
              <img v-if="activeDocumentImage" :src="activeDocumentImage" :alt="activeDocumentTitle">
              <dl v-else-if="selectedDocumentView === 'ocr' && identityEntries.length" class="document-ocr"><template v-for="item in identityEntries"><dt :key="item.key + '-ocr-label'">{{ item.label }}</dt><dd :key="item.key + '-ocr'">{{ formatFieldValue(item.key, item.value) }}</dd></template></dl>
              <div v-else class="document-empty-state">
                <i :class="selectedDocumentCategory === 'selfie' ? 'mdi mdi-account-off-outline' : 'mdi mdi-file-image-remove-outline'"></i>
                <strong>{{ selectedDocumentCategory === "selfie" ? "No selfie image available" : "No document image available" }}</strong>
                <span>No image was returned for this attempt.</span>
              </div>
            </div>
            <div v-if="selectedDocumentCategory === 'document'" class="document-thumbs">
              <button v-if="effectiveOcrIdDocsDetails.tokenFrontDocumentImage" :class="{ active: selectedDocumentView === 'front' }" @click="selectedDocumentView = 'front'"><img :src="effectiveOcrIdDocsDetails.tokenFrontDocumentImage"><span>Front Side</span></button>
              <button v-if="effectiveOcrIdDocsDetails.tokenBackDocumentImage" :class="{ active: selectedDocumentView === 'back' }" @click="selectedDocumentView = 'back'"><img :src="effectiveOcrIdDocsDetails.tokenBackDocumentImage"><span>Back Side</span></button>
              <button v-if="identityEntries.length" :class="{ active: selectedDocumentView === 'ocr' }" @click="selectedDocumentView = 'ocr'"><span class="ocr-thumb"><i class="mdi mdi-text-recognition"></i></span><span>OCR View</span></button>
            </div>
          </main>

          <aside class="document-insights">
            <section v-if="documentVerificationResults.length" class="document-info-card"><h3><span><i class="mdi mdi-clipboard-check-outline"></i>Verification Results</span><span v-if="documentVerificationResult" :class="documentVerificationResult.tone"><i :class="documentVerificationResult.passed ? 'mdi mdi-check-circle-outline' : 'mdi mdi-close-circle-outline'"></i>{{ documentVerificationResult.label }}</span></h3><div v-for="result in documentVerificationResults" :key="result.label" class="verification-result-row"><i :class="result.passed ? 'mdi mdi-check-circle-outline passed' : 'mdi mdi-close-circle-outline failed'"></i><span>{{ result.label }}</span><strong :class="result.passed ? 'passed' : 'failed'">{{ result.value }}</strong></div></section>
            <section v-if="identityEntries.length" class="document-info-card"><h3><span><i class="mdi mdi-card-text-outline"></i>Extracted Information</span></h3><dl><template v-for="item in identityEntries"><dt :key="item.key + '-extracted-label'">{{ item.label }}</dt><dd :key="item.key + '-extracted'">{{ formatFieldValue(item.key, item.value) }}</dd></template></dl></section>
            <section v-if="submissionEntries.length" class="document-info-card"><h3><span><i class="mdi mdi-information-outline"></i>Record Details</span></h3><dl><template v-for="item in submissionEntries"><dt :key="item.label + '-submission-label'">{{ item.label }}</dt><dd :key="item.label + '-submission'">{{ item.value }}</dd></template></dl></section>
          </aside>
        </div>
      </section>
      <section v-else-if="activeTab === 'risk'">
        <header class="risk-page-header"><div><h2><i class="mdi mdi-shield-check-outline"></i>Risk &amp; Compliance</h2><p>{{ isSessionDetailView ? "Risk assessment, verification results, flags and review decision for the selected attempt." : "Current risk assessment, flags and review decisions." }}</p></div><div v-if="isSessionDetailView && attemptOptions.length" class="attempt-selector"><label for="risk-attempt">Attempt:</label><select id="risk-attempt" v-model="selectedAttemptSessionId" @change="selectAttemptSession"><option v-for="attempt in attemptOptions" :key="attempt.id" :value="attempt.id">{{ attempt.label }}</option></select></div></header>
        <div class="risk-layout">
          <div v-if="hasDetailRiskScore || (isSessionDetailView ? latestRiskDecision : hasManualDecisions)" class="risk-column">
            <article v-if="hasDetailRiskScore" class="risk-detail-card">
              <h3><i class="mdi mdi-shield-alert-outline"></i>Risk Assessment</h3>
              <div class="risk-score-line"><div class="sd-risk-large" :style="{ color: detailRiskColor }">{{ riskDataSession.risk.riskScore }} <small>/ 100</small></div><span v-if="riskDataSession.risk.riskBand" class="sd-risk-band" :style="{ color: detailRiskColor }">{{ riskDataSession.risk.riskBand }}</span></div>
              <div class="sd-risk-track"><span :style="{ left: detailRiskPercent + '%', backgroundColor: detailRiskColor }"></span></div><div class="sd-risk-labels"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div>
            </article>
            <article v-if="isSessionDetailView && latestRiskDecision" class="risk-detail-card">
              <h3><i class="mdi mdi-gavel"></i>Latest Decision <span class="badge badge-pill" :class="decisionStatusClass(latestRiskDecision.action)">{{ decisionStatusLabel(latestRiskDecision.action) }}</span></h3>
              <dl class="risk-decision-details"><template v-for="item in latestRiskDecisionEntries"><dt :key="item.key + '-risk-decision-label'">{{ item.label }}</dt><dd :key="item.key + '-risk-decision-value'">{{ item.value }}</dd></template></dl>
            </article>
            <article v-if="!isSessionDetailView && hasManualDecisions" class="risk-detail-card decision-history-card">
              <h3><i class="mdi mdi-history"></i>Decision History</h3>
              <div class="card-table-scroll">
                <div class="decision-history-wrap">
                  <div v-for="decision in normalizedManualDecisions" :key="decision.key" class="decision-history-item">
                    <div class="decision-history-event">
                      <div v-if="decision.action" class="decision-history-event-header"><span class="decision-history-label">Status</span><span class="badge badge-pill px-2 py-1" :class="decisionStatusClass(decision.action)">{{ decisionStatusLabel(decision.action) }}</span></div>
                      <div class="decision-history-grid">
                        <template v-if="decision.decidedBy"><span class="decision-history-label">Decided By</span><span class="decision-history-value" :title="decision.decidedBy">{{ decision.decidedBy }}</span></template>
                        <template v-if="decision.decidedAt"><span class="decision-history-label">Time</span><span class="decision-history-value">{{ formatDate(decision.decidedAt) }}</span></template>
                        <template v-if="decision.reasonCode"><span class="decision-history-label">{{ isManualReviewCleared(decision) ? "Review Result" : "Reason" }}</span><span class="decision-history-value" :title="formatDecisionReason(decision.reasonCode)"><i class="mdi mr-1" :class="isManualReviewCleared(decision) ? 'mdi-check-circle-outline text-success' : 'mdi-alert-circle-outline text-danger'"></i>{{ formatDecisionReason(decision.reasonCode) }}</span></template>
                        <template v-if="decision.comments"><span class="decision-history-label">Comment</span><span class="decision-history-value" :title="decision.comments">{{ decision.comments }}</span></template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
          <div v-if="isSessionDetailView && riskVerificationResults.length" class="risk-column">
            <article class="risk-detail-card">
              <h3><i class="mdi mdi-clipboard-check-outline"></i>Verification Results</h3>
              <div v-for="result in riskVerificationResults" :key="result.label" class="risk-verification-row"><i :class="result.passed ? 'mdi mdi-check-circle passed' : 'mdi mdi-close-circle failed'"></i><span>{{ result.label }}</span><strong :class="result.passed ? 'passed' : 'failed'">{{ result.value }}</strong></div>
            </article>
          </div>
          <div v-if="hasRiskFlags" class="risk-column">
            <article class="risk-detail-card">
              <h3><i class="mdi mdi-alert-outline"></i>Risk Signals &amp; Flags <span>{{ riskFlagCount }}</span></h3>
              <div class="risk-flags-list"><div v-for="flag in normalizedRiskFlags" :key="flag.key" class="risk-flag-item" :class="(flag.severity || '').toLowerCase()"><div class="risk-flag-head"><i :class="riskFlagIconClass(flag.severity)"></i><strong>{{ flag.title }}</strong><span v-if="flag.severity" class="badge badge-pill" :class="riskSeverityClass(flag.severity)">{{ formatSeverity(flag.severity) }}</span></div><p v-if="flag.description">{{ flag.description }}</p><p v-for="item in flag.metadataEntries" :key="item.key" class="risk-flag-meta">{{ item.label }}: {{ item.value }}</p><p v-if="flag.source">Source: {{ formatRiskCode(flag.source) }}</p></div></div>
              <button class="sd-review-btn" @click="openManualReviewModal">Review and take action</button>
            </article>
          </div>
        </div>
      </section>
      <div v-else-if="activeTab === 'audit'" class="audit-panel">
        <section class="audit-log">
          <header class="audit-log-header">
            <div><h2><i class="mdi mdi-history"></i>Audit Trail</h2><p>Verification events grouped by attempt.</p></div>
          </header>
          <div class="audit-session-filters">
            <button v-for="filter in auditSessionFilters" :key="filter.id" type="button" class="audit-session-filter" :class="[filter.tone, { active: auditSessionFilter === filter.id }]" @click="selectAuditSessionFilter(filter.id)">
              <i :class="filter.icon"></i>{{ filter.label }} ({{ filter.count }})
            </button>
          </div>
          <div class="audit-groups">
            <article v-for="group in auditGroups" :key="group.key" class="audit-group">
              <button type="button" class="audit-group-toggle" :class="group.tone" :aria-expanded="String(!isAuditGroupCollapsed(group.key))" @click="toggleAuditGroup(group.key)">
                <strong>{{ group.label }}</strong>
                <span v-if="group.statusLabel" class="sd-status" :class="group.tone">{{ group.statusLabel }}</span>
                <span v-if="group.riskFlagCount" class="audit-risk-count"><i class="mdi mdi-alert-outline"></i>{{ group.riskFlagCount }} {{ group.riskFlagCount === 1 ? "risk flag" : "risk flags" }}</span>
                <span v-if="group.dateRange">{{ group.dateRange }}</span>
                <span class="audit-group-count">{{ group.events.length }} {{ group.events.length === 1 ? "event" : "events" }}</span>
                <i :class="isAuditGroupCollapsed(group.key) ? 'mdi mdi-chevron-down' : 'mdi mdi-chevron-up'"></i>
              </button>
              <div v-show="!isAuditGroupCollapsed(group.key)">
                <div class="audit-table-head" :class="{ 'without-actor': !hasAuditActors }"><span>Time</span><span>Event</span><span>Details</span><span v-if="hasAuditActors">Actor</span></div>
                <button v-for="event in group.events" :key="event.key" type="button" class="audit-event" :class="{ selected: selectedAuditEvent && selectedAuditEvent.key === event.key, 'without-actor': !hasAuditActors }" :aria-pressed="String(Boolean(selectedAuditEvent && selectedAuditEvent.key === event.key))" @click="selectAuditEvent(event.key)">
                  <time v-if="event.createdAt">{{ formatAuditTime(event.createdAt) }}</time><span v-else></span>
                  <span class="audit-event-icon" :class="event.tone"><i :class="event.icon"></i></span>
                  <span class="audit-event-title">{{ event.title }}</span>
                  <span class="audit-event-detail">{{ event.detail }}</span>
                  <span v-if="hasAuditActors" class="audit-event-actor">{{ event.actor }}</span>
                </button>
              </div>
            </article>
            <p v-if="!auditGroups.length" class="text-muted text-center py-4 mb-0">No sessions in this filter.</p>
          </div>
        </section>
        <aside v-if="selectedAuditEvent" class="audit-side">
          <section class="audit-event-card">
            <h2><i class="mdi mdi-file-document-outline"></i>Event Details</h2>
            <div class="audit-selected-heading">
              <i :class="[selectedAuditEvent.icon, selectedAuditEvent.tone]"></i>
              <div><strong>{{ selectedAuditEvent.title }}</strong><span v-if="selectedAuditEvent.detail">{{ selectedAuditEvent.detail }}</span></div>
            </div>
            <dl><template v-for="item in selectedAuditEventEntries"><dt :key="item.key + '-audit-label'">{{ item.label }}</dt><dd :key="item.key + '-audit-value'">{{ item.value }}</dd></template></dl>
            <div v-if="selectedAuditRiskFlags.length" class="audit-event-flags">
              <h3><i class="mdi mdi-alert-outline"></i> Risk Flags ({{ selectedAuditRiskFlags.length }})</h3>
              <div :key="selectedAuditEvent.key" ref="auditRiskFlagsList" class="audit-event-flags-list">
                <article v-for="flag in selectedAuditRiskFlags" :key="flag.key" class="audit-event-flag">
                  <header><strong>{{ flag.title }}</strong><span v-if="flag.severity">{{ formatSeverity(flag.severity) }}</span></header>
                  <p v-if="flag.description">{{ flag.description }}</p>
                  <dl v-if="flag.metadataEntries.length"><template v-for="item in flag.metadataEntries"><dt :key="item.key + '-audit-flag-label'">{{ item.label }}</dt><dd :key="item.key + '-audit-flag-value'">{{ item.value }}</dd></template></dl>
                </article>
              </div>
            </div>
          </section>
        </aside>
      </div>
      <div v-else-if="activeTab === 'customer'" class="sd-grid"><section v-if="identityEntries.length" class="sd-card"><h2><i class="mdi mdi-account-outline"></i> Customer Information</h2><dl><template v-for="item in identityEntries"><dt :key="item.key + '-customer-label'">{{ item.label }}</dt><dd :key="item.key + '-customer'">{{ formatFieldValue(item.key, item.value) }}</dd></template></dl></section><section v-for="(sbt, index) in allSbtMintData || []" :key="'customer-sbt-' + index" class="sd-card"><h2><i class="mdi mdi-card-account-details-outline"></i> Soul Bound Token</h2><dl><template v-if="sbt.proofType"><dt>Credential Type</dt><dd>{{ `${sbt.proofType}SbtCredential` }}</dd></template><template v-if="sbt.blockchainLabel"><dt>Blockchain</dt><dd>{{ getChainDetail(sbt.blockchainLabel).chainName }}</dd></template><template v-if="sbt.ownerWalletAddress"><dt>Wallet Address</dt><dd>{{ sbt.ownerWalletAddress }}</dd></template><template v-if="sbt.did"><dt>User's DID</dt><dd>{{ sbt.did }}</dd></template><template v-if="sbt.tokenId"><dt>Token ID</dt><dd>{{ sbt.tokenId }}</dd></template><template v-if="sbt.sbtContractAddress"><dt>Contract Address</dt><dd>{{ sbt.sbtContractAddress }}</dd></template><template v-if="sbt.transactionHash"><dt>Transaction Hash</dt><dd>{{ sbt.transactionHash }}</dd></template></dl></section></div>
    </div>

    <hf-pop-up id="zoom-doc" :Header="popupHeader" size="md">
      <img :src="popupImage" />
    </hf-pop-up>

    <b-modal
      id="manual-review-decision-modal"
      v-model="showManualReviewModal"
      size="xl"
      centered
      scrollable
      title="Review verification and take action"
      header-bg-variant="dark"
      header-text-variant="light"
    >
      <p class="text-muted mb-3">
        Review the risk flags below and decide to approve or reject this verification.
      </p>

      <b-row>
        <b-col cols="12" lg="6" class="mb-3 mb-lg-0">
          <b-card class="h-100 shadow-none" body-class="p-3">
            <div class="card-section-title d-flex align-items-center justify-content-between">
              <span>
                <i class="mdi mdi-alert-outline mr-2 text-warning"></i>
                Review Required
              </span>
              <span class="text-muted text-lowercase">
                {{ riskFlagCount }} risk {{ riskFlagCount === 1 ? "flag" : "flags" }}
              </span>
            </div>

            <p class="text-muted mb-3">
              This verification passed automated checks but requires manual review before it can be approved.
            </p>

            <div class="risk-flag-list">
              <b-card
                v-for="flag in normalizedRiskFlags"
                :key="flag.key"
                class="mb-3 shadow-none"
                :class="riskFlagCardClass(flag.severity)"
                body-class="p-3"
              >
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <strong>{{ flag.title }}</strong>
                  <span
                    v-if="flag.severity"
                    class="badge badge-pill p-2"
                    :class="riskSeverityClass(flag.severity)"
                  >
                    {{ formatSeverity(flag.severity) }}
                  </span>
                </div>
                <p class="text-muted mb-2">{{ flag.description }}</p>
                <div v-if="flag.metaLine" class="font-weight-bold mb-2">
                  {{ flag.metaLine }}
                </div>
              </b-card>
            </div>
          </b-card>
        </b-col>

        <b-col cols="12" lg="6">
          <b-card class="h-100 shadow-none" body-class="p-3">
            <div class="card-section-title">Take decision</div>

            <b-form-radio
              v-model="reviewDecision"
              value="APPROVED"
              class="font-weight-bold mb-2"
            >
              Approve
            </b-form-radio>

            <b-form-radio
              v-model="reviewDecision"
              value="REJECTED"
              class="font-weight-bold mb-3"
            >
              Reject
            </b-form-radio>

            <b-alert
              v-if="reviewDecision === 'APPROVED'"
              show
              variant="success"
              class="py-2"
            >
              This verification will be approved and the user can proceed.
            </b-alert>
            <b-alert v-else show variant="danger" class="py-2">
              This verification will be rejected and the user will not be able to proceed.
            </b-alert>

            <div v-if="reviewDecision === 'REJECTED'" class="form-group mt-4">
              <label class="font-weight-bold">
                Reason <span class="mandatory">*</span>
              </label>
              <div class="text-muted small mb-2">Common reasons</div>
              <b-form-radio
                v-for="reason in reviewReasonOptions"
                :key="reason.value"
                v-model="reviewReasonCode"
                :value="reason.value"
                class="mb-2"
              >
                {{ reason.label }}
              </b-form-radio>
            </div>

            <div class="form-group mt-4 mb-0">
              <label class="font-weight-bold">
                Comments <small class="text-muted">(optional)</small>
              </label>
              <b-form-textarea
                v-model="reviewComments"
                maxlength="300"
                rows="5"
                no-resize
                placeholder="Add additional notes for the audit trail..."
              ></b-form-textarea>
              <div class="text-muted small text-right mt-1">
                {{ reviewComments.length }} / 300
              </div>
            </div>
          </b-card>
        </b-col>
      </b-row>

      <template #modal-footer>
        <b-button
          variant="outline-secondary"
          class="manual-review-cancel-btn"
          @click="closeManualReviewModal"
        >
          Cancel
        </b-button>
        <b-button
          variant="primary"
          class="manual-review-submit-btn"
          :disabled="isSubmittingReviewDecision"
          @click="submitReviewDecision"
        >
          {{ isSubmittingReviewDecision ? "Submitting..." : "Submit" }}
        </b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import UtilsMixin from "../../mixins/utils";
import { mapState, mapGetters, mapActions } from "vuex";
import UAParser from "ua-parser-js";
import { getCosmosChainConfig } from "@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/cosmos-wallet-utils";
import { getStellarChainConfig } from "@hypersign-protocol/hypersign-kyc-chains-metadata/stellar/wallet/stellar-wallet-utils";
import HfPopUp from "../../components/element/hfPopup.vue";
import Config from "../../config";
import { HYPERSIGN_PROOF_TYPES } from "@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/cosmos-wallet-utils";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import embeddedPdfFonts from "@/assets/fonts/vfs_fonts";
const pdfMakeVfs = pdfFonts.vfs || pdfFonts;
const embeddedPdfFontVfs = embeddedPdfFonts.vfs || embeddedPdfFonts;
pdfMake.vfs = {
  ...pdfMakeVfs,
  ...embeddedPdfFontVfs,
};

const PDF_FONT_FAMILY = "Roboto";
const fonts = {
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Medium.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-MediumItalic.ttf",
  },
  NotoSansDevanagari: {
    normal: "NotoSansDevanagari-Regular.ttf",
    bold: "NotoSansDevanagari-Regular.ttf",
    italics: "NotoSansDevanagari-Regular.ttf",
    bolditalics: "NotoSansDevanagari-Regular.ttf",
  },
  NotoSansBengali: {
    normal: "NotoSansBengali-Regular.ttf",
    bold: "NotoSansBengali-Bold.ttf",
    italics: "NotoSansBengali-Regular.ttf",
    bolditalics: "NotoSansBengali-Bold.ttf",
  },
  NotoNaskhArabic: {
    normal: "NotoNaskhArabic-Regular.ttf",
    bold: "NotoNaskhArabic-Bold.ttf",
    italics: "NotoNaskhArabic-Regular.ttf",
    bolditalics: "NotoNaskhArabic-Bold.ttf",
  },
};
pdfMake.addFonts(fonts);
import logoSrc from "../../assets/Entity_full.png";

const ServiceLivenessResultEnum = {
  0: "None",
  1: "Spoof",
  2: "Uncertain",
  3: "Live",
  4: "Bad quality image",
  5: "Face very close",
  6: "Face not found",
  7: "Face too small",
  8: "Face too large",
  9: "Invalid image format",
  10: "Internal server error",
  11: "Image processing error",
  12: "Too many faces",
  13: "Face too close to edge",
  14: "Face was cropped",
  15: "License error",
  16: "Face is obstructed",
  17: "No life detected",
  18: "Eyes closed",
  66: "Eye is obstructed"
};

const ZkpVerificationResultEnum = {
  0: "Age verification could not be performed",
  1: "Age verification failed",
  2: "Age verification uncertain",
  3: "Age verification passed",
};

export default {
  name: "sessionDetails",
  components: {
    HfPopUp,
  },
  computed: {
    ...mapGetters("mainStore", ["getSessionDetailsBySessionId", "getSelectedService"]),
    ...mapState({
      companies: (state) => state.mainStore.companies,
      sessionList: (state) => state.mainStore.sessionList,
      containerShift: (state) => state.playgroundStore.containerShift,
    }),
    isSessionDetailView() {
      return this.isVerificationSessionId(this.sessionId);
    },
    parentUserIdentifier() {
      if (!this.isSessionDetailView) return "";
      return String(this.$route.query.userId || this.session?.appUserId || this.session?.userId || "");
    },
    attemptNumberBySessionId() {
      const ids = this.distinctVerificationSessionIds();
      const originalOrder = new Map(ids.map((id, index) => [id, index]));
      const firstEventTime = new Map();

      this.auditEvents.forEach(event => {
        if (event.attemptKey === "session") return;
        const time = Date.parse(event.createdAt) || 0;
        const current = firstEventTime.get(event.attemptKey);
        if (time && (!current || time < current)) firstEventTime.set(event.attemptKey, time);
      });
      this.verificationAttempts.forEach(attempt => {
        const id = String(attempt?.sessionId || attempt?.id || "");
        const time = Date.parse(attempt?.createdAt || attempt?.completedAt) || 0;
        if (id && time && !firstEventTime.has(id)) firstEventTime.set(id, time);
      });

      const latestId = String(this.session?.latestSessionId || "");
      const chronologicalIds = [...ids].sort((a, b) => {
        if (a === latestId && b !== latestId) return 1;
        if (b === latestId && a !== latestId) return -1;
        const aTime = firstEventTime.get(a) || 0;
        const bTime = firstEventTime.get(b) || 0;
        if (aTime && bTime && aTime !== bTime) return aTime - bTime;
        if (aTime && !bTime) return -1;
        if (!aTime && bTime) return 1;
        return originalOrder.get(a) - originalOrder.get(b);
      });

      return chronologicalIds.reduce((numbers, id, index) => {
        numbers[id] = index + 1;
        return numbers;
      }, {});
    },
    currentAttemptNumber() {
      return this.$route.query.attemptNumber || this.attemptNumberBySessionId[this.sessionId] || "";
    },
    breadcrumbBackLabel() {
      if (this.isSessionDetailView) {
        return this.parentUserIdentifier ? "User Detail" : "Sessions";
      }
      return "Users";
    },
    breadcrumbCurrentLabel() {
      return this.isSessionDetailView
        ? (this.currentAttemptNumber ? `Attempt #${this.currentAttemptNumber}` : "Attempt Detail")
        : this.sessionId;
    },
    pageTitle() {
      return this.isSessionDetailView ? "Attempt Detail" : "User Detail";
    },
    pageDescription() {
      return this.isSessionDetailView
        ? "Verification data for this specific attempt"
        : "View verification history, identity information and compliance record";
    },
    userInitials() {
      const source = this.session?.name || this.session?.email || this.session?.userId || "U";
      return String(source).split(/\s+|@/).slice(0, 2).map(part => part.charAt(0)).join("").toUpperCase();
    },
    statusTone() {
      const status = this.session?.status || "";
      if (/manual[_\s-]?review/i.test(status)) return "review";
      if (/expired|timeout/i.test(status)) return "expired";
      if (/fail|reject|denied|invalid|error/i.test(status)) return "failed";
      if (/success|verified|approved|passed/i.test(status)) return "passed";
      return "";
    },
    statusDisplayLabel() {
      return this.formatStatusLabel(this.session?.status);
    },
    statusIcon() {
      if (this.statusTone === "review") return "mdi mdi-alert-circle-outline";
      if (this.statusTone === "passed") return "mdi mdi-check-circle-outline";
      if (this.statusTone === "failed") return "mdi mdi-close-circle-outline";
      if (this.statusTone === "expired") return "mdi mdi-clock-outline";
      return "mdi mdi-circle-outline";
    },
    hasRiskScore() {
      return this.hasValue(this.session?.risk?.riskScore);
    },
    detailsSession() {
      return this.selectedAttemptDetails || this.session || {};
    },
    riskDataSession() {
      return this.isSessionDetailView ? this.detailsSession : this.session || {};
    },
    detailDeviceDetails() {
      const userAgent = this.detailsSession?.deviceDetails?.userAgent;
      if (!userAgent) return {};
      const parser = new UAParser(userAgent);
      return {
        os: parser.getOS().name,
        osVer: parser.getOS().version,
        browser: parser.getBrowser().name,
        device: parser.getDevice().model,
      };
    },
    detailLocationDetails() {
      return this.detailsSession?.deviceDetails?.locationDetail || {};
    },
    attemptOptions() {
      const ids = this.distinctVerificationSessionIds();
      const idSet = new Set(ids);
      const orderedIds = [
        ...this.allAuditGroups.map(group => group.key).filter(id => idSet.has(id)),
        ...ids.filter(id => !this.allAuditGroups.some(group => group.key === id)),
      ];
      return orderedIds.map(id => {
        const group = this.allAuditGroups.find(item => item.key === id);
        const isLatest = id === this.session?.latestSessionId;
        return {
          id,
          label: [this.attemptDisplayLabelBySessionId(id), isLatest ? "Latest" : "", group?.statusLabel].filter(Boolean).join(" · "),
        };
      });
    },
    hasDetailRiskScore() {
      return this.hasValue(this.riskDataSession?.risk?.riskScore);
    },
    detailRiskPercent() {
      return Math.max(0, Math.min(100, Number(this.riskDataSession?.risk?.riskScore) || 0));
    },
    detailRiskColor() {
      return this.riskBandColor(this.riskDataSession?.risk?.riskBand);
    },
    riskPercent() {
      return Math.max(0, Math.min(100, Number(this.session?.risk?.riskScore) || 0));
    },
    identityEntries() {
      const source = Object.keys(this.userPersonalDataFromUserConsent).length ? this.userPersonalDataFromUserConsent : this.userPersonalDataGovIdFromUserConsent;
      return Object.entries(source)
        .filter(([, value]) => this.hasValue(value))
        .map(([key, value]) => ({
          key,
          value,
          label: key.replace(/([A-Z])/g, " $1").replace(/^./, char => char.toUpperCase()),
        }));
    },
    deviceLocationEntries() {
      return [{ label: "Operating System", value: this.deviceDetails.os }, { label: "OS Version", value: this.deviceDetails.osVer }, { label: "Browser", value: this.deviceDetails.browser }, { label: "Device", value: this.deviceDetails.device }, { label: "CPU", value: this.deviceDetails.cpu }, { label: "IP Address", value: this.session?.deviceDetails?.ip || this.locationDetails.ip }, { label: "Continent", value: this.locationDetails.continentName }, { label: "Country", value: this.locationDetails.countryName }, { label: "Region", value: this.locationDetails.region }, { label: "City", value: this.locationDetails.city }].filter(item => this.hasValue(item.value));
    },
    ocrDocumentRecords() {
      const records = this.stepDetailRecords(this.detailsSession?.ocriddocsDetails);
      if (records.length) return records;
      return this.hasObjectData(this.userConsentOcrIdDocsDetails)
        ? [this.userConsentOcrIdDocsDetails]
        : [];
    },
    selfieDocumentRecords() {
      const records = this.stepDetailRecords(this.detailsSession?.selfiDetails);
      if (records.length) return records;
      return this.hasObjectData(this.userConsentSelfiDetails)
        ? [this.userConsentSelfiDetails]
        : [];
    },
    documentTypeItems() {
      const documentCount = this.ocrDocumentRecords.length;
      const selfieCount = this.selfieDocumentRecords.length;
      const documents = this.ocrDocumentRecords.map((record, index) => ({
        key: this.documentRecordKey("document", record, index),
        category: "document",
        record,
        icon: "mdi mdi-card-account-details-outline",
        label: documentCount > 1 ? `${this.identityDocumentLabel} #${index + 1}` : this.identityDocumentLabel,
        subtitle: [this.documentSidesForRecord(record), record.createdAt ? this.formatDate(record.createdAt) : ""].filter(Boolean).join(" · "),
        result: this.documentRecordResult(record),
      }));
      const selfies = this.selfieDocumentRecords.map((record, index) => ({
        key: this.documentRecordKey("selfie", record, index),
        category: "selfie",
        record,
        icon: "mdi mdi-account-outline",
        label: selfieCount > 1 ? `Selfie Image #${index + 1}` : "Selfie Image",
        subtitle: record.createdAt ? this.formatDate(record.createdAt) : "",
        result: this.selfieRecordResult(record),
      }));
      return [...documents, ...selfies];
    },
    selectedDocumentItem() {
      const selected = this.documentTypeItems.find(item => item.key === this.selectedDocumentRecordKey);
      if (selected) return selected;

      const categoryItems = this.documentTypeItems.filter(item => item.category === this.selectedDocumentCategory);
      const candidates = categoryItems.length ? categoryItems : this.documentTypeItems;
      const latestRecord = this.latestStepDetail(candidates.map(item => item.record));
      return candidates.find(item => item.record === latestRecord) || candidates[0] || null;
    },
    selectedOcrDocumentRecord() {
      if (this.selectedDocumentItem?.category === "document") return this.selectedDocumentItem.record;
      return this.latestStepDetail(this.ocrDocumentRecords);
    },
    selectedSelfieDocumentRecord() {
      if (this.selectedDocumentItem?.category === "selfie") return this.selectedDocumentItem.record;
      return this.latestStepDetail(this.selfieDocumentRecords);
    },
    hasIdentityDocument() {
      return this.idDocDocumentImageFound || this.hasValue(this.effectiveOcrIdDocsDetails?.tokenBackDocumentImage) || this.identityEntries.length > 0;
    },
    identityDocumentLabel() {
      if (this.hasObjectData(this.passportCredentialSubject)) return "Passport";
      if (this.hasObjectData(this.governmentIdCredentialSubject)) return "Government ID";
      return "Identity Document";
    },
    availableDocumentSides() {
      const sides = [];
      if (this.effectiveOcrIdDocsDetails?.tokenFrontDocumentImage) sides.push("Front side");
      if (this.effectiveOcrIdDocsDetails?.tokenBackDocumentImage) sides.push("Back side");
      return sides.join(" · ") || "Extracted information";
    },
    activeDocumentImage() {
      if (this.selectedDocumentCategory === "selfie") return this.effectiveSelfiDetails?.tokenSelfiImage || "";
      if (this.selectedDocumentView === "back") return this.effectiveOcrIdDocsDetails?.tokenBackDocumentImage || "";
      if (this.selectedDocumentView === "ocr") return "";
      return this.effectiveOcrIdDocsDetails?.tokenFrontDocumentImage || this.effectiveOcrIdDocsDetails?.tokenBackDocumentImage || "";
    },
    activeDocumentTitle() {
      const selectedLabel = this.selectedDocumentItem?.label;
      if (this.selectedDocumentCategory === "selfie") return selectedLabel || "Selfie Image";
      if (!this.hasIdentityDocument) return this.identityDocumentLabel;
      if (this.selectedDocumentView === "ocr") return `${selectedLabel || this.identityDocumentLabel} - OCR View`;
      return `${selectedLabel || this.identityDocumentLabel} - ${this.selectedDocumentView === "back" ? "Back Side" : "Front Side"}`;
    },
    documentVerificationResults() {
      const results = [];
      const documentResult = this.documentRecordResult(this.selectedOcrDocumentRecord);
      if (documentResult) {
        results.push({ label: "Document verification", passed: documentResult.passed, value: documentResult.label });
      }
      if (this.faceAuthenticationResultFound) {
        results.push({ label: "Face authentication", passed: this.isFacialAuthenticationSuccess.success, value: this.isFacialAuthenticationSuccess.success ? "Passed" : "Failed" });
      }
      if (this.hasValue(this.effectiveOcrIdDocsDetails?.serviceFacialSimilarityResult)) {
        const similarity = Number(this.effectiveOcrIdDocsDetails.serviceFacialSimilarityResult);
        const percentage = similarity > 1 ? similarity : similarity * 100;
        results.push({ label: "Face similarity", passed: this.isFacialAuthenticationSuccess.success, value: Number.isNaN(percentage) ? String(this.effectiveOcrIdDocsDetails.serviceFacialSimilarityResult) : `${Math.round(percentage)}%` });
      }
      if (this.livelinessResultFound) {
        results.push({ label: "Liveness", passed: this.passiveLivelinessData.success, value: this.passiveLivelinessData.success ? "Passed" : this.passiveLivelinessData.result });
      }
      return results;
    },
    documentVerificationResult() {
      const documentResult = this.documentVerificationResults.find(result => result.label === "Document verification");
      if (!documentResult) return null;
      const passed = documentResult.passed;
      return { passed, label: passed ? "Passed" : "Failed", tone: passed ? "passed" : "failed" };
    },
    submissionEntries() {
      const location = [this.detailLocationDetails.city, this.detailLocationDetails.region, this.detailLocationDetails.countryName].filter(Boolean).join(", ");
      const createdAt = this.selectedDocumentCategory === "selfie"
        ? this.effectiveSelfiDetails?.createdAt
        : this.effectiveOcrIdDocsDetails?.createdAt;
      const submittedFrom = [this.detailDeviceDetails.device, this.detailDeviceDetails.os, this.detailDeviceDetails.osVer].filter(Boolean).join(" · ");
      return [{ label: "Created At", value: createdAt ? this.formatDate(createdAt) : "" }, { label: "Session Device", value: submittedFrom }, { label: "Session Browser", value: this.detailDeviceDetails.browser }, { label: "Session IP Address", value: this.detailsSession?.deviceDetails?.ip || this.detailLocationDetails.ip }, { label: "Session Location", value: location }].filter(item => this.hasValue(item.value));
    },
    verificationChecks() {
      return [
        { label: "Document", value: this.session?.step_ocrIdVerification },
        { label: "Liveness", value: this.session?.step_liveliness },
        { label: "Age Check", value: this.session?.step_zkProofVerification },
        { label: "Consent", value: this.session?.step_userConsent },
      ].filter(item => this.hasValue(item.value)).map(item => ({
        label: item.label,
        passed: item.value == 1,
      }));
    },
    overviewVerificationResults() {
      const results = [];
      const ocrDetails = this.latestStepDetail(this.session?.ocriddocsDetails);
      const selfiDetails = this.latestStepDetail(this.session?.selfiDetails);
      const zkpDetails = this.latestStepDetail(
        this.session?.zkProofVerificationDetails || this.session?.zkpVerificationDetails
      );

      if (this.hasValue(this.session?.step_ocrIdVerification)) {
        const passed = this.session.step_ocrIdVerification == 1;
        results.push({ label: "Document verification", passed, value: passed ? "Passed" : "Failed" });
      }
      if (this.hasValue(ocrDetails.serviceFacialAuthenticationResult)) {
        const result = ocrDetails.serviceFacialAuthenticationResult;
        const passed = result == 3;
        results.push({ label: "Face authentication", passed, value: passed ? "Passed" : Config['FaicalAuthenticationError'][result] || "Failed" });
      }
      if (this.hasValue(ocrDetails.serviceFacialSimilarityResult)) {
        const similarity = Number(ocrDetails.serviceFacialSimilarityResult);
        const percentage = similarity > 1 ? similarity : similarity * 100;
        results.push({ label: "Face similarity", passed: ocrDetails.serviceFacialAuthenticationResult == 3, value: Number.isNaN(percentage) ? String(ocrDetails.serviceFacialSimilarityResult) : `${Math.round(percentage)}%` });
      }
      if (this.hasValue(selfiDetails.serviceLivenessResult)) {
        const result = selfiDetails.serviceLivenessResult;
        const passed = result == 3;
        results.push({ label: "Liveness", passed, value: passed ? "Passed" : ServiceLivenessResultEnum[result] || "Failed" });
      }
      if (this.hasValue(zkpDetails.serviceZkpVerificationResult)) {
        const result = zkpDetails.serviceZkpVerificationResult;
        const passed = result == 3;
        results.push({ label: "Age Verification", passed, value: passed ? "Passed" : ZkpVerificationResultEnum[result] || "Failed" });
      }
      if (this.hasValue(this.session?.step_userConsent)) {
        const passed = this.session.step_userConsent == 1;
        results.push({ label: "User Consent", passed, value: passed ? "Captured" : "Failed" });
      }

      return results;
    },
    riskVerificationResults() {
      const results = [...this.documentVerificationResults];
      if (this.zkpVerificationResultFound) {
        results.push({ label: "Age Verification", passed: this.zkpVerificationPassed, value: this.zkpVerificationPassed ? "Passed" : this.zkpVerificationResultForDisplay });
      }
      if (this.userConsentDataFound) {
        const passed = this.detailsSession?.step_userConsent == 1;
        results.push({ label: "User Consent", passed, value: passed ? "Passed" : "Failed" });
      }
      return results;
    },
    allAvailableChecksPassed() {
      return this.verificationChecks.length > 0 &&
        this.verificationChecks.every(check => check.passed) &&
        /success|verified|approved/i.test(this.session?.status || "");
    },
    verificationAttempts() {
      const attempts = this.session?.verificationAttempts || this.session?.attempts || this.session?.sessions || [];
      if (!Array.isArray(attempts)) return [];
      return [...attempts].sort((a, b) => new Date(b.completedAt || b.createdAt || 0) - new Date(a.completedAt || a.createdAt || 0));
    },
    verificationAttemptCount() {
      const sessionCount = this.distinctVerificationSessionIds().length;
      return sessionCount || this.verificationAttempts.length;
    },
    latestAttempt() {
      return this.verificationAttempts[0] || null;
    },
    latestAttemptDate() {
      return this.latestAttempt?.completedAt || this.latestAttempt?.createdAt || "";
    },
    latestVerificationSummary() {
      if (this.latestAttempt) {
        const attemptIdentifier = this.latestAttempt.attemptNumber || this.latestAttempt.attempt;
        const sessionIdentifier = this.latestAttempt.sessionId || this.latestAttempt.id;
        const status = this.latestAttempt.status || this.latestAttempt.result;
        const identifier = this.hasValue(attemptIdentifier)
          ? `Attempt #${attemptIdentifier}`
          : sessionIdentifier
            ? this.attemptDisplayLabelBySessionId(sessionIdentifier)
            : "";
        return {
          label: "Latest Attempt",
          primary: [identifier, this.hasValue(status) ? this.formatStatusLabel(status) : ""].filter(Boolean).join(" · "),
          secondary: this.latestAttemptDate ? this.formatDate(this.latestAttemptDate) : "",
          title: sessionIdentifier || "",
        };
      }
      if (this.session?.latestSessionId) {
        return {
          label: "Latest Attempt",
          primary: this.attemptDisplayLabelBySessionId(this.session.latestSessionId),
          secondary: this.session.completedAt ? this.formatDate(this.session.completedAt) : "",
          title: this.session.latestSessionId,
        };
      }
      if (this.session?.completedAt) {
        return { label: "Completed At", primary: this.formatDate(this.session.completedAt), secondary: "", title: "" };
      }
      return null;
    },
    notes() {
      const notes = this.session?.notes;
      if (Array.isArray(notes)) {
        return notes.map(note => typeof note === "object" ? note.text || note.note || note.message : note).filter(value => this.hasValue(value));
      }
      return this.hasValue(notes) ? [notes] : [];
    },
    visibleTabs() {
      return [{ id: "overview", label: "Overview", icon: "mdi mdi-view-dashboard-outline", show: true }, { id: "documents", label: "Documents", icon: "mdi mdi-file-document-outline", show: this.attemptOptions.length || this.hasIdentityDocument || this.selfiImageFound }, { id: "risk", label: "Risk & Compliance", icon: "mdi mdi-shield-check-outline", show: this.attemptOptions.length || this.hasRiskScore || this.hasRiskFlags || this.riskVerificationResults.length || this.hasManualDecisions }, { id: "audit", label: "Audit Trail", icon: "mdi mdi-tune-variant", show: this.auditEvents.length }].filter(tab => tab.show);
    },
    currentCompanyName() {
      const companies = Array.isArray(this.companies) ? this.companies : [];
      const company = companies.find((company) => company.companyId === this.companyId);
      return company?.companyName?.trim().replace(/\b\w/g, char => char.toUpperCase()) || "";
    },
    hasCurrentCompanyName() {
      return Boolean(this.currentCompanyName);
    },
    isFacialAuthenticationSuccess() {
      const facialAuthenticationResult =
        this.effectiveOcrIdDocsDetails.serviceFacialAuthenticationResult;
      const facialSimilarityResult =
        this.effectiveOcrIdDocsDetails.serviceFacialSimilarityResult;

      if (!this.faceAuthenticationResultFound) {
        return {
          success: false,
          result: "",
        };
      }

      const status = facialAuthenticationResult == 3;
      const matchPercentage = this.hasValue(facialSimilarityResult)
        ? `, match ${Math.round(Number(facialSimilarityResult) * 100)}%`
        : "";
      return {
        success: status,
        result: !status
          ? (Config['FaicalAuthenticationError'][facialAuthenticationResult] || "") +
            matchPercentage
          : "Facial Authentication Passed" + matchPercentage,
      };
    },
    passiveLivelinessData() {
      const status = this.effectiveSelfiDetails.serviceLivenessResult == 3;
      return {
        success: status,
        result:
          ServiceLivenessResultEnum[this.effectiveSelfiDetails.serviceLivenessResult] ,
        borderColor: status ? "5px solid rgb(81 137 81 / 20%)" : "5px solid #cd5c5c5e",
      };
    },
    getStatusColor() {
      if (this.isFacialAuthenticationSuccess.success) {
        return "5px solid rgb(81 137 81 / 20%)";
      } else {
        return "5px solid #cd5c5c5e";
      }
    },
    isContainerShift() {
      return this.containerShift;
    },
    selfiDataFound() {
      return this.hasObjectData(this.effectiveSelfiDetails);
    },
    selfiImageFound() {
      return Boolean(this.effectiveSelfiDetails?.tokenSelfiImage);
    },
    livelinessResultFound() {
      return this.hasValue(this.effectiveSelfiDetails?.serviceLivenessResult);
    },
    idDocDataFound() {
      return this.hasObjectData(this.effectiveOcrIdDocsDetails);
    },
    idDocFaceImageFound() {
      return Boolean(this.effectiveOcrIdDocsDetails?.tokenFaceImage);
    },
    faceAuthenticationResultFound() {
      return this.hasValue(
        this.effectiveOcrIdDocsDetails?.serviceFacialAuthenticationResult
      );
    },
    faceAuthenticationDisplayFound() {
      return this.faceAuthenticationResultFound;
    },
    faceAuthenticationPassedForDisplay() {
      return this.isFacialAuthenticationSuccess.success;
    },
    faceAuthenticationResultForDisplay() {
      return this.faceAuthenticationResultFound ? this.isFacialAuthenticationSuccess.result : "";
    },
    idDocDocumentImageFound() {
      return Boolean(this.effectiveOcrIdDocsDetails?.tokenFrontDocumentImage);
    },
    userConsentDataFound() {
      return this.hasObjectData(this.effectiveUserConsentDetails);
    },
    sbtDataFound() {
      return this.session?.mintsbtsDetails && this.session.mintsbtsDetails.length > 0;
    },
    zkpVerificationDataFound() {
      return this.hasObjectData(this.effectiveZkpVerificationDetails);
    },
    zkpVerificationResultFound() {
      return this.hasValue(
        this.effectiveZkpVerificationDetails?.serviceZkpVerificationResult
      );
    },
    zkpVerificationPassed() {
      return this.effectiveZkpVerificationDetails?.serviceZkpVerificationResult == 3;
    },
    zkpVerificationResultForDisplay() {
      const result = this.effectiveZkpVerificationDetails?.serviceZkpVerificationResult;
      return ZkpVerificationResultEnum[result] || `Result ${result}`;
    },
    startFinishDiffInSeconds() {
      if (this.userConsentDataFound) {
        const startDate = new Date(this.detailsSession.createdAt);
        const endDate = new Date(this.effectiveUserConsentDetails.createdAt);

        const startEpoch = startDate.getTime();
        const endEpoch = endDate.getTime();

        return parseFloat((endEpoch - startEpoch) / 1000 / 60).toFixed(2);
      } else {
        return 0;
      }
    },
    userConsentCredentialSubjects() {
      const presentation = this.parseUserConsentPresentation();
      const credentials = presentation?.verifiableCredential;
      const credentialList = Array.isArray(credentials)
        ? credentials
        : credentials
        ? [credentials]
        : [];

      return credentialList.reduce((subjects, credential) => {
        const types = Array.isArray(credential?.type)
          ? credential.type
          : credential?.type
          ? [credential.type]
          : [];

        types.forEach((type) => {
          subjects[type] = credential?.credentialSubject || {};
        });

        return subjects;
      }, {});
    },
    passportCredentialSubject() {
      return this.userConsentCredentialSubjects.PassportCredential || {};
    },
    governmentIdCredentialSubject() {
      return this.userConsentCredentialSubjects.GovernmentIdCredential || {};
    },
    personhoodCredentialSubject() {
      return this.userConsentCredentialSubjects.PersonhoodCredential || {};
    },
    userConsentSelfiDetails() {
      return this.buildSelfiDetailsFromCredentialSubject(
        this.personhoodCredentialSubject
      );
    },
    userConsentOcrIdDocsDetails() {
      const subject = this.hasObjectData(this.passportCredentialSubject)
        ? this.passportCredentialSubject
        : this.governmentIdCredentialSubject;

      return this.buildOcrIdDocsDetailsFromCredentialSubject(subject);
    },
    effectiveSelfiDetails() {
      return this.mergeWithFallback(
        this.selectedSelfieDocumentRecord,
        this.userConsentSelfiDetails
      );
    },
    effectiveOcrIdDocsDetails() {
      return this.mergeWithFallback(
        this.selectedOcrDocumentRecord,
        this.userConsentOcrIdDocsDetails
      );
    },
    effectiveZkpVerificationDetails() {
      return this.latestStepDetail(
        this.detailsSession?.zkProofVerificationDetails ||
          this.detailsSession?.zkpVerificationDetails
      );
    },
    effectiveUserConsentDetails() {
      return this.latestStepDetail(this.detailsSession?.userConsentDetails);
    },
    userPersonalDataFromUserConsent() {
      const d = { ...this.passportCredentialSubject };
      delete d["face"];
      delete d["overallRating"];
      delete d["id"];
      return d;
    },
    userPersonalDataGovIdFromUserConsent() {
      const d = { ...this.governmentIdCredentialSubject };
      delete d["face"];
      delete d["overallRating"];
      delete d["id"];
      return d;
    },
    userSbtMintDataFromUserConsent() {
      // const sbtType =
      // HYPERSIGN_PROOF_TYPES
      const t = this.getCredentialSubjectByType("zkProofOfPersonHoodSbtCredential");
      return t;
    },
    allProofTypeSBTCredentials() {
      const proofTypeSBTCredential = [];
      Object.keys(HYPERSIGN_PROOF_TYPES).forEach((eachProofType) => {
        proofTypeSBTCredential.push(
          this.getCredentialSubjectByType(`${eachProofType}SbtCredential`)
        );
      });
      return proofTypeSBTCredential;
    },
    allSbtMintData() {
      let sbtMintData;
      if (this.sbtDataFound) {
        sbtMintData = this.session.mintsbtsDetails;
      }
      return sbtMintData;
    },
    sortedTimelineDetails() {
      return [...this.timeLineDetails].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    },
    auditEvents() {
      return this.sortedTimelineDetails.map((item, index) =>
        this.normalizeAuditEvent(item, `timeline-${index}`)
      );
    },
    auditAttemptLabels() {
      const groups = new Map();
      this.auditEvents.forEach(event => {
        if (!groups.has(event.attemptKey)) groups.set(event.attemptKey, []);
        groups.get(event.attemptKey).push(event);
      });
      return [...groups.entries()].reduce((labels, [key, events]) => {
        const explicitLabel = events.find(event => event.attemptLabel)?.attemptLabel;
        labels[key] = explicitLabel || (key === "session"
          ? "Attempt Events"
          : this.attemptDisplayLabelBySessionId(key));
        return labels;
      }, {});
    },
    allAuditGroups() {
      const grouped = new Map();
      this.auditEvents.forEach(event => {
        if (!grouped.has(event.attemptKey)) grouped.set(event.attemptKey, []);
        grouped.get(event.attemptKey).push(event);
      });

      return [...grouped.entries()].map(([key, events]) => {
        const orderedEvents = [...events].sort((a, b) =>
          (Date.parse(a.createdAt) || 0) - (Date.parse(b.createdAt) || 0)
        );
        const statusSource = [...orderedEvents].reverse().find(event => event.statusLabel);
        const hasFailure = orderedEvents.some(event => event.tone === "failed");
        const hasReview = orderedEvents.some(event => event.tone === "review");
        const firstDate = orderedEvents[0]?.createdAt;
        const lastDate = orderedEvents[orderedEvents.length - 1]?.createdAt;
        const statusLabel = statusSource?.statusLabel || "";
        const statusKey = statusLabel.toLowerCase();
        const riskFlagCount = orderedEvents.reduce((count, event) => {
          const flags = event.raw?.riskFlags;
          return count + (Array.isArray(flags) ? flags.length : this.hasObjectData(flags) ? 1 : 0);
        }, 0);
        return {
          key,
          label: this.auditAttemptLabels[key],
          events: orderedEvents,
          tone: statusLabel
            ? this.auditSessionStatusTone(statusLabel)
            : hasFailure
              ? "failed"
              : hasReview
                ? "review"
                : "",
          statusLabel,
          statusKey,
          hasRiskFlags: riskFlagCount > 0,
          riskFlagCount,
          dateRange: this.formatAuditDateRange(firstDate, lastDate),
          latestTime: Date.parse(lastDate) || 0,
        };
      }).sort((a, b) => b.latestTime - a.latestTime);
    },
    overviewVerificationAttempts() {
      if (this.verificationAttempts.length) {
        const attempts = this.overviewAttemptLimit
          ? this.verificationAttempts.slice(0, this.overviewAttemptLimit)
          : this.verificationAttempts;
        return attempts.map(attempt => {
          const sessionId = attempt.sessionId || attempt.id;
          const status = attempt.status || attempt.result || "";
          return {
            key: sessionId,
            label: sessionId ? this.attemptDisplayLabelBySessionId(sessionId) : "Attempt",
            fullLabel: sessionId ? `${this.attemptDisplayLabelBySessionId(sessionId)} · ${sessionId}` : "Attempt",
            statusLabel: this.hasValue(status) ? this.formatStatusLabel(status) : "",
            tone: this.auditSessionStatusTone(status),
            dateRange: attempt.createdAt ? this.formatDate(attempt.createdAt) : "",
            events: this.allAuditGroups.find(group => group.key === String(sessionId))?.events || [],
          };
        });
      }
      const availableGroups = this.allAuditGroups.length
        ? this.allAuditGroups
        : this.distinctVerificationSessionIds().map(id => ({ key: id, label: this.attemptDisplayLabelBySessionId(id), statusLabel: "", tone: "", dateRange: "" }));
      const groups = this.overviewAttemptLimit
        ? availableGroups.slice(0, this.overviewAttemptLimit)
        : availableGroups;
      return groups.map(group => ({
        ...group,
        fullLabel: group.key === "session" ? group.label : `${group.label} · ${group.key}`,
      }));
    },
    auditSessionFilters() {
      const statusCounts = new Map();
      this.allAuditGroups.forEach(group => {
        if (group.statusKey) {
          statusCounts.set(group.statusKey, (statusCounts.get(group.statusKey) || 0) + 1);
        }
      });
      const preferredOrder = ["success", "failed", "expired"];
      const statuses = [...statusCounts.entries()].sort(([a], [b]) => {
        const aIndex = preferredOrder.indexOf(a);
        const bIndex = preferredOrder.indexOf(b);
        if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
      const filters = [{ id: "all", label: "All Attempts", icon: "mdi mdi-view-grid-outline", tone: "", count: this.allAuditGroups.length }];
      statuses.forEach(([status, count]) => {
        filters.push({
          id: `status:${status}`,
          label: this.formatAuditStatusLabel(status),
          icon: this.auditSessionStatusIcon(status),
          tone: this.auditSessionStatusTone(status),
          count,
        });
      });
      const riskFlagCount = this.allAuditGroups.filter(group => group.hasRiskFlags).length;
      if (riskFlagCount) filters.push({ id: "risk-flag", label: "Flagged Attempts", icon: "mdi mdi-alert-outline", tone: "risk", count: riskFlagCount });
      return filters;
    },
    auditGroups() {
      if (this.auditSessionFilter === "all") return this.allAuditGroups;
      if (this.auditSessionFilter === "risk-flag") {
        return this.allAuditGroups.filter(group => group.hasRiskFlags);
      }
      if (this.auditSessionFilter.startsWith("status:")) {
        const status = this.auditSessionFilter.slice(7);
        return this.allAuditGroups.filter(group => group.statusKey === status);
      }
      return this.allAuditGroups;
    },
    hasAuditActors() {
      return this.auditGroups.some(group => group.events.some(event => this.hasValue(event.actor)));
    },
    selectedAuditEvent() {
      const visibleEvents = this.auditGroups.flatMap(group => group.events);
      return visibleEvents.find(event => event.key === this.selectedAuditEventKey) || this.auditGroups[0]?.events[0] || null;
    },
    selectedAuditRiskFlags() {
      const eventFlags = this.selectedAuditEvent?.raw?.riskFlags;
      const flags = Array.isArray(eventFlags)
        ? eventFlags
        : this.hasObjectData(eventFlags)
          ? [eventFlags]
          : [];
      return flags.map((flag, index) => this.normalizeRiskFlag(flag, index));
    },
    selectedAuditEventEntries() {
      if (!this.selectedAuditEvent) return [];
      const event = this.selectedAuditEvent;
      const raw = event.raw || {};
      const entries = [
        { key: "time", label: "Time", value: event.createdAt ? this.formatDate(event.createdAt) : "" },
        { key: "actor", label: "Actor", value: event.actor },
        { key: "step", label: "Step", value: event.title },
        {
          key: "attempt",
          label: event.attemptLabel ? "Attempt" : "Session ID",
          value: event.attemptLabel || (event.attemptKey !== "session" ? event.attemptKey : ""),
        },
        { key: "status", label: "Status", value: event.statusLabel },
        { key: "result", label: event.resultLabel || "Result", value: event.result },
        { key: "error", label: "Error", value: event.error },
        { key: "reason", label: "Reason", value: raw.reasonCode ? this.formatDecisionReason(raw.reasonCode) : raw.failureReason },
        { key: "comment", label: "Comment", value: raw.comments || raw.comment },
      ];
      const representedKeys = new Set(["createdAt", "decidedAt", "timestamp", "actor", "performedBy", "decidedBy", "createdBy", "stepName", "step_name", "eventName", "event", "type", "status", "outcome", "action", "result", "error", "failureReason", "reasonCode", "comments", "comment", "sessionId", "session_id", "attemptNumber", "attemptNo", "attempt"]);
      const additionalEntries = this.scalarEntries(raw).filter(item => !representedKeys.has(item.key));
      return [...entries.filter(item => this.hasValue(item.value)), ...additionalEntries];
    },
    normalizedRiskFlags() {
      const flags = this.riskDataSession?.riskFlags || [];
      if (!Array.isArray(flags)) return [];

      return flags.map((flag, index) => this.normalizeRiskFlag(flag, index));
    },
    hasRiskFlags() {
      return this.normalizedRiskFlags.length > 0;
    },
    riskFlagCount() {
      return this.normalizedRiskFlags.length;
    },
    normalizedManualDecisions() {
      const decisions = this.session?.manualDecisions || [];
      if (!Array.isArray(decisions)) return [];

      return decisions
        .map((decision, index) => ({
          ...decision,
          key: `${decision.action || "DECISION"}-${decision.decidedAt || index}`,
          action: decision.action || "",
          reasonCode: decision.reasonCode || "",
          comments: decision.comments || "",
          decidedBy: decision.decidedBy || "",
          decidedAt: decision.decidedAt || "",
        }))
        .filter(decision => [decision.action, decision.reasonCode, decision.comments, decision.decidedBy, decision.decidedAt].some(value => this.hasValue(value)))
        .sort((a, b) => {
          const aTime = Date.parse(a.decidedAt) || 0;
          const bTime = Date.parse(b.decidedAt) || 0;
          return bTime - aTime;
        });
    },
    hasManualDecisions() {
      return this.normalizedManualDecisions.length > 0;
    },
    normalizedRiskDecisions() {
      const decisions = this.detailsSession?.manualDecisions || [];
      if (!Array.isArray(decisions)) return [];
      return [...decisions].sort((a, b) =>
        (Date.parse(b.decidedAt) || 0) - (Date.parse(a.decidedAt) || 0)
      );
    },
    latestRiskDecision() {
      return this.normalizedRiskDecisions[0] || null;
    },
    latestRiskDecisionEntries() {
      if (!this.latestRiskDecision) return [];
      const decision = this.latestRiskDecision;
      return [
        { key: "time", label: "Decision Time", value: decision.decidedAt ? this.formatDate(decision.decidedAt) : "" },
        { key: "actor", label: "Decided By", value: decision.decidedBy },
        { key: "reason", label: this.isManualReviewCleared(decision) ? "Review Result" : "Reason", value: decision.reasonCode ? this.formatDecisionReason(decision.reasonCode) : "" },
        { key: "comment", label: "Comment", value: decision.comments },
      ].filter(item => this.hasValue(item.value));
    },
    riskColor() {
      return this.riskBandColor(this.session?.risk?.riskBand);
    }
  },
  data() {
    return {
      breadCrumbsItems: [
        { text: "Session", disabled: false, href: "/session" },
        { text: this.sessionId, disabled: true },
      ],
      fullPage: true,
      isLoading: false,
      appId: "",
      companyId: "",
      isValidBusinessID: false,
      sessionId: "",
      env: "prod",
      session: {},
      selectedAttemptSessionId: "",
      selectedAttemptDetails: null,
      attemptDetailsCache: {},
      showManualReviewModal: false,
      isSubmittingReviewDecision: false,
      reviewDecision: "REJECTED",
      reviewReasonCode: "",
      reviewComments: "",
      reviewReasonOptions: [
        { label: "Suspicious document", value: "SUSPICIOUS_DOCUMENT" },
        { label: "Identity could not be verified", value: "IDENTITY_NOT_VERIFIED" },
        { label: "Biometric mismatch", value: "BIOMETRIC_MISMATCH" },
        { label: "Restricted jurisdiction", value: "RESTRICTED_JURISDICTION" },
        { label: "Fraud / duplicate identity", value: "FRAUD_DUPLICATE_IDENTITY" },
        { label: "Other", value: "OTHER" },
      ],
      popupHeader: "",
      popupImage: "",
      deviceDetails: {},
      locationDetails: {},
      timeLineDetails: [],
      activeTab: "overview",
      selectedDocumentCategory: "document",
      selectedDocumentRecordKey: "",
      selectedDocumentView: "front",
      auditSessionFilter: "all",
      collapsedAuditGroups: {},
      selectedAuditEventKey: "",
      overviewAttemptLimit: 3,
      locationMap: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        zoom: 15,
        center: [51.505, -0.159],
        markerLatLng: [51.504, -0.159],
      },
    };
  },

  async created() {
    this.appId = this.getSelectedService?.appId
    this.companyId=undefined;
    this.sessionId = this.$route.params.sessionId;
    this.isValidBusinessID= /^[a-f\d]{24}$/i.test(this.$route.params.appId); // Check for mongoDB_Id
    if(this.isValidBusinessID) {
      this.companyId=this.$route.params.appId;
    }
    this.env = this.$store.getters["mainStore/getSelectedService"]?.env || "prod";
    await this.loadSessionIdentifier(this.sessionId);
  },
  watch: {
    "$route.params.sessionId": async function(identifier) {
      if (!identifier || identifier === this.sessionId) return;
      this.sessionId = identifier;
      await this.loadSessionIdentifier(identifier);
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    ...mapActions("mainStore", ["fetchSessionsDetailsById", "fetchSessionsDetailsById2", "submitManualReviewDecision"]),
    distinctVerificationSessionIds() {
      const ids = [];
      const addSessionId = value => {
        const id = typeof value === "object" && value
          ? value.sessionId || value.id
          : value;
        if (this.hasValue(id)) ids.push(String(id));
      };

      [
        this.session?.sessionIds,
        this.session?.verificationSessionIds,
        this.session?.verificationAttempts,
        this.session?.attempts,
        this.session?.sessions,
      ].forEach(collection => {
        if (Array.isArray(collection)) collection.forEach(addSessionId);
      });
      this.timeLineDetails.forEach(addSessionId);
      addSessionId(this.session?.latestSessionId);

      return [...new Set(ids)];
    },
    isVerificationSessionId(identifier) {
      return /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(identifier || "");
    },
    async loadSessionIdentifier(identifier) {
      try {
        this.isLoading = true;
        this.activeTab = "overview";
        this.auditSessionFilter = "all";
        this.collapsedAuditGroups = {};
        this.selectedAuditEventKey = "";
        this.overviewAttemptLimit = 3;
        this.selectedAttemptSessionId = "";
        this.selectedAttemptDetails = null;
        this.selectedDocumentRecordKey = "";
        this.deviceDetails = {};
        this.locationDetails = {};
        this.timeLineDetails = [];
        this.session = this.isVerificationSessionId(identifier)
          ? await this.fetchSessionsDetailsById2({ sessionId: identifier }) || {}
          : await this.fetchSessionsDetailsById({
            sessionId: identifier,
            env: this.env,
            businessId: this.isValidBusinessID ? this.companyId : undefined,
          }) || {};

        const userAgentString = this.session?.deviceDetails?.userAgent;
        if (userAgentString) {
          const uaparser = new UAParser();
          uaparser.setUA(userAgentString);
          this.deviceDetails = {
            os: uaparser.getOS().name,
            osVer: uaparser.getOS().version,
            browser: uaparser.getBrowser().name,
            device: uaparser.getDevice().model,
            cpu: uaparser.getCPU().architecture,
          };
        }
        if (this.session?.deviceDetails?.locationDetail) {
          this.locationDetails = { ...this.session.deviceDetails.locationDetail };
        }
        if (Array.isArray(this.session?.timeLineDetails)) {
          this.timeLineDetails = this.session.timeLineDetails.map(item => ({ ...item }));
        }
        if (this.isVerificationSessionId(identifier)) {
          this.selectedAttemptSessionId = this.session?.sessionId || identifier;
          this.selectedAttemptDetails = this.session;
          this.$set(this.attemptDetailsCache, this.selectedAttemptSessionId, this.session);
        } else {
          this.selectedAttemptSessionId = this.session?.latestSessionId || this.allAuditGroups[0]?.key || "";
          this.selectedAttemptDetails = null;
        }
        this.selectDocumentCategory("document");
      } catch (e) {
        this.notifyErr(e.message);
        this.$router.go(-1);
      } finally {
        this.isLoading = false;
      }
    },
    normalizeAuditEvent(item, sourceKey) {
      const title = item.stepName || item.step_name || item.eventName || item.event || item.type || item.action || "Event";
      const category = this.auditEventCategory(title, item);
      const error = item.error || item.failureReason || "";
      const statusValue = item.status || item.outcome || item.action;
      const resultValue = item.result;
      const resultType = this.auditResultType(item);
      const result = this.formatAuditResult(resultType, resultValue);
      const toneValue = this.hasValue(statusValue) ? statusValue : resultValue;
      const normalizedResult = String(toneValue || "").toLowerCase();
      const documentFailure = resultType === "document"
        ? Config['FaicalAuthenticationError'][resultValue]
        : "";
      const tone = error || documentFailure || /fail|reject|denied|invalid|error/.test(normalizedResult)
        ? "failed"
        : /manual.review|review|required|pending/.test(normalizedResult)
          ? "review"
          : /expired|timeout/.test(normalizedResult)
            ? "expired"
            : /success|verified|approved|passed/.test(normalizedResult) || resultValue == 3
              ? "passed"
              : "";
      const attemptValue = item.attemptNumber || item.attemptNo || item.attempt || item.sessionId || item.session_id;
      const explicitAttemptNumber = item.attemptNumber || item.attemptNo || item.attempt;
      const eventRiskFlags = Array.isArray(item.riskFlags)
        ? item.riskFlags
        : this.hasObjectData(item.riskFlags)
          ? [item.riskFlags]
          : [];
      const riskFlagDetail = eventRiskFlags
        .map(flag => flag?.message || flag?.code)
        .filter(value => this.hasValue(value))
        .join(" · ");
      const detailValue = error || item.message || item.description || item.details || item.reason || item.comments || documentFailure || riskFlagDetail || result || "";

      return {
        key: `${sourceKey}-${item.id || item._id || item.createdAt || item.decidedAt || title}`,
        raw: item,
        title: this.formatAuditTitle(title),
        category,
        icon: this.auditEventIcon(category),
        tone,
        createdAt: item.createdAt || item.decidedAt || item.timestamp || "",
        actor: item.actor || item.performedBy || item.decidedBy || item.createdBy || "",
        detail: this.hasValue(detailValue) ? String(detailValue) : "",
        error: this.hasValue(error) ? String(error) : "",
        result,
        resultLabel: this.auditResultLabel(resultType),
        statusLabel: this.hasValue(statusValue) ? this.formatAuditStatusLabel(statusValue) : "",
        riskFlagCount: eventRiskFlags.length,
        attemptKey: this.hasValue(attemptValue) ? String(attemptValue) : "session",
        attemptLabel: this.hasValue(explicitAttemptNumber) ? `Attempt #${explicitAttemptNumber}` : "",
      };
    },
    auditResultType(item) {
      const rawStep = item?.step_name || item?.stepName || item?.eventName || item?.event || item?.type || "";
      const step = String(rawStep).toLowerCase().replace(/[\s_-]+/g, "");
      if (step === "liveliness" || step === "liveness") return "liveness";
      if (step === "ocriddoc" || step === "ocridverification") return "document";
      if (["zkpverification", "zkproofverification", "ageverification"].includes(step)) return "age-verification";
      return "";
    },
    auditResultLabel(resultType) {
      const labels = {
        liveness: "Liveness Result",
        document: "Document Result",
        "age-verification": "Age Verification Result",
      };
      return labels[resultType] || "Result";
    },
    formatAuditResult(resultType, resultValue) {
      if (!this.hasValue(resultValue)) return "";

      if (resultType === "liveness") {
        return ServiceLivenessResultEnum[resultValue] || "Unknown liveliness result";
      }
      if (resultType === "document") {
        if (resultValue == 3) return "Document verification passed";
        return Config['FaicalAuthenticationError'][resultValue] || "Unknown document verification result";
      }
      if (resultType === "age-verification") {
        return ZkpVerificationResultEnum[resultValue] || "Unknown age verification result";
      }

      return typeof resultValue === "string"
        ? this.formatAuditStatusLabel(resultValue)
        : "";
    },
    auditEventCategory(title, item) {
      if (item.action || item.eventCategory === "decision") return "decision";
      const rawStep = item.eventCategory || item.step_name || item.stepName || item.eventName || item.event || item.type || title;
      const normalized = String(rawStep || "event").toLowerCase().replace(/[\s_-]+/g, "");
      const knownSteps = {
        start: "start",
        liveliness: "selfie",
        liveness: "selfie",
        selfieuploaded: "selfie",
        ocriddoc: "document",
        documentuploaded: "document",
        userconsent: "consent",
        consent: "consent",
        zkpverification: "age-verification",
        zkproofverification: "age-verification",
        ageverification: "age-verification",
        risk: "risk",
        riskassessment: "risk",
        mintsbt: "sbt",
        soulboundtoken: "sbt",
        finish: "finish",
      };
      return knownSteps[normalized] || String(rawStep || "event").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    },
    auditEventIcon(category) {
      const icons = {
        start: "mdi mdi-play",
        selfie: "mdi mdi-face-recognition",
        document: "mdi mdi-file-document-outline",
        "age-verification": "mdi mdi-account-check-outline",
        consent: "mdi mdi-file-check-outline",
        risk: "mdi mdi-shield-alert-outline",
        sbt: "mdi mdi-certificate-outline",
        finish: "mdi mdi-check-circle-outline",
      };
      return icons[category] || "mdi mdi-circle-outline";
    },
    formatAuditTitle(value) {
      if (!this.hasValue(value)) return "Event";
      return String(value)
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, char => char.toUpperCase());
    },
    formatAuditTime(value) {
      if (!value) return "";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return String(value);
      return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    },
    formatAuditDateRange(firstDate, lastDate) {
      if (!firstDate && !lastDate) return "";
      if (firstDate === lastDate || !lastDate) return this.formatDate(firstDate || lastDate);
      const first = new Date(firstDate);
      const last = new Date(lastDate);
      if (Number.isNaN(first.getTime()) || Number.isNaN(last.getTime())) return "";
      const sameDay = first.toDateString() === last.toDateString();
      if (!sameDay) return `${this.formatDate(firstDate)} – ${this.formatDate(lastDate)}`;
      return `${first.toLocaleDateString("en-IN")} · ${this.formatAuditTime(firstDate)} – ${this.formatAuditTime(lastDate)}`;
    },
    toggleAuditGroup(key) {
      const shouldCollapse = !this.isAuditGroupCollapsed(key);

      this.collapsedAuditGroups = this.auditGroups.reduce((state, group) => {
        state[group.key] = shouldCollapse || group.key !== key;
        return state;
      }, {});

      if (!shouldCollapse) {
        const openedGroup = this.auditGroups.find(group => group.key === key);
        this.selectedAuditEventKey = openedGroup?.events[0]?.key || "";
      }
      this.resetAuditRiskFlagsScroll();
    },
    selectAuditSessionFilter(filter) {
      this.auditSessionFilter = filter;
      const firstGroup = this.auditGroups[0];
      this.collapsedAuditGroups = this.auditGroups.reduce((state, group) => {
        state[group.key] = group.key !== firstGroup?.key;
        return state;
      }, {});
      this.selectedAuditEventKey = firstGroup?.events[0]?.key || "";
      this.resetAuditRiskFlagsScroll();
    },
    selectAuditEvent(eventKey) {
      this.selectedAuditEventKey = eventKey;
      this.resetAuditRiskFlagsScroll();
    },
    async selectTab(tabId) {
      if (tabId === "documents" && !this.isSessionDetailView && this.selectedAttemptSessionId && !this.selectedAttemptDetails) {
        const loaded = await this.selectAttemptSession();
        if (!loaded) return;
      }
      if (tabId !== "documents" && !this.isSessionDetailView) {
        this.selectedAttemptDetails = null;
      }
      this.activeTab = tabId;
      if (tabId === "documents") this.selectDocumentCategory(this.selectedDocumentCategory);
    },
    resetAuditRiskFlagsScroll() {
      this.$nextTick(() => {
        const list = this.$refs.auditRiskFlagsList;
        if (list) list.scrollTop = 0;
      });
    },
    viewSessionAttempt(sessionId) {
      if (!this.hasValue(sessionId)) return;
      const attemptNumber = this.attemptNumberBySessionId[String(sessionId)];
      this.$router.push({
        name: "sessionDetails",
        params: {
          appId: this.$route.params.appId,
          sessionId: String(sessionId),
        },
        query: {
          ...this.$route.query,
          userId: this.sessionId,
          ...(attemptNumber ? { attemptNumber: String(attemptNumber) } : {}),
        },
      });
    },
    async selectAttemptSession() {
      const sessionId = this.selectedAttemptSessionId;
      if (!this.hasValue(sessionId)) return false;
      if (this.attemptDetailsCache[sessionId]) {
        this.selectedAttemptDetails = this.attemptDetailsCache[sessionId];
        this.selectedDocumentRecordKey = "";
        this.selectDocumentCategory("document");
        return true;
      }

      try {
        this.isLoading = true;
        const details = await this.fetchSessionsDetailsById2({ sessionId });
        this.$set(this.attemptDetailsCache, sessionId, details);
        this.selectedAttemptDetails = details;
        this.selectedDocumentRecordKey = "";
        this.selectDocumentCategory("document");
        return true;
      } catch (e) {
        this.notifyErr(e.message);
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    riskBandColor(band) {
      const colors = {
        CRITICAL: "#D32F2F",
        HIGH: "#FF5722",
        MEDIUM: "#FFC107",
        LOW: "#4CAF50",
      };
      return colors[String(band || "").toUpperCase()] || "#9E9E9E";
    },
    auditSessionStatusIcon(status) {
      const normalized = String(status || "").toLowerCase();
      if (/success|verified|approved|passed/.test(normalized)) return "mdi mdi-check-circle-outline";
      if (/fail|reject|denied|invalid|error/.test(normalized)) return "mdi mdi-close-circle-outline";
      if (/expired|timeout/.test(normalized)) return "mdi mdi-clock-outline";
      if (/manual.review|review|required|pending/.test(normalized)) return "mdi mdi-alert-circle-outline";
      return "mdi mdi-circle-outline";
    },
    auditSessionStatusTone(status) {
      const normalized = String(status || "").toLowerCase();
      if (/success|verified|approved|passed/.test(normalized)) return "passed";
      if (/fail|reject|denied|invalid|error/.test(normalized)) return "failed";
      if (/expired|timeout/.test(normalized)) return "expired";
      if (/manual.review|review|required|pending/.test(normalized)) return "review";
      return "";
    },
    isAuditGroupCollapsed(key) {
      if (Object.prototype.hasOwnProperty.call(this.collapsedAuditGroups, key)) {
        return Boolean(this.collapsedAuditGroups[key]);
      }
      return key !== this.auditGroups[0]?.key;
    },
    shortAuditIdentifier(value) {
      const identifier = String(value || "");
      return identifier.length > 12 ? `${identifier.slice(0, 8)}…` : identifier;
    },
    formatDate(date) {
      if (!date) return "-";
      const d = new Date(date);
      return d.toLocaleString(); // Customize formatting if needed
    },
    scalarEntries(value) {
      if (!value || typeof value !== "object") return [];
      return Object.entries(value)
        .filter(([key, item]) => this.hasValue(item) && typeof item !== "object" && !/image|presentation|token/i.test(key))
        .map(([key, item]) => ({
          key,
          label: key.replace(/([A-Z])/g, " $1").replace(/^./, char => char.toUpperCase()),
          value: /status|result/i.test(key)
            ? this.formatStatusLabel(item)
            : this.formatFieldValue(key, item),
        }));
    },
    formatStatusLabel(status) {
      if (!this.hasValue(status)) return "";
      const normalized = String(status).trim();
      if (/^manual[_\s-]?review$/i.test(normalized)) return "Manual Review";
      return normalized.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    },
    attemptDisplayLabel(attempt) {
      const attemptNumber = attempt?.attemptNumber || attempt?.attempt;
      if (this.hasValue(attemptNumber)) return `Attempt #${attemptNumber}`;
      const sessionIdentifier = attempt?.sessionId || attempt?.id;
      return sessionIdentifier ? this.attemptDisplayLabelBySessionId(sessionIdentifier) : "Attempt";
    },
    attemptDisplayLabelBySessionId(sessionId) {
      const attemptNumber = this.attemptNumberBySessionId[String(sessionId)];
      return attemptNumber ? `Attempt #${attemptNumber}` : "Attempt";
    },
    attemptRiskScore(attempt) {
      if (this.hasValue(attempt?.riskScore)) return attempt.riskScore;
      return attempt?.risk?.riskScore;
    },
    formatAuditStatusLabel(status) {
      if (!this.hasValue(status)) return "";
      return String(status).trim().replace(/_/g, " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    },
    selectDocumentCategory(category, recordKey = "") {
      if (recordKey) {
        this.selectedDocumentRecordKey = recordKey;
        this.selectedDocumentCategory = category;
      } else {
        const categoryItems = this.documentTypeItems.filter(item => item.category === category);
        const candidateItems = categoryItems.length ? categoryItems : this.documentTypeItems;
        const currentItem = candidateItems.find(item => item.key === this.selectedDocumentRecordKey);
        const latestRecord = this.latestStepDetail(candidateItems.map(item => item.record));
        const itemToSelect = currentItem || candidateItems.find(item => item.record === latestRecord) || candidateItems[0];
        this.selectedDocumentRecordKey = itemToSelect?.key || "";
        this.selectedDocumentCategory = itemToSelect?.category || category;
      }
      if (this.selectedDocumentCategory === "selfie") return;
      if (this.effectiveOcrIdDocsDetails?.tokenFrontDocumentImage) {
        this.selectedDocumentView = "front";
      } else if (this.effectiveOcrIdDocsDetails?.tokenBackDocumentImage) {
        this.selectedDocumentView = "back";
      } else {
        this.selectedDocumentView = "ocr";
      }
    },
    openManualReviewModal() {
      this.showManualReviewModal = true;
    },
    closeManualReviewModal() {
      this.showManualReviewModal = false;
    },
    async submitReviewDecision() {
      if (this.reviewDecision === "REJECTED" && !this.reviewReasonCode) {
        this.notifyErr("Please select a reason for rejection.");
        return;
      }

      const decisionSessionId = this.selectedAttemptSessionId || this.session?.latestSessionId || this.session?.sessionId || this.sessionId;
      const reasonCode = this.reviewDecision === "REJECTED"
        ? this.reviewReasonCode
        : "MANUAL_REVIEW_CLEARED";

      try {
        this.isSubmittingReviewDecision = true;
        await this.submitManualReviewDecision({
          sessionId: decisionSessionId,
          action: this.reviewDecision,
          reasonCode,
          comments: this.reviewComments,
        });

        this.session = await this.fetchSessionsDetailsById({
          sessionId: this.sessionId,
          env: this.env,
          businessId: this.isValidBusinessID ? this.companyId : undefined,
        }) || {};

        this.notifySuccess("Manual review decision submitted successfully.");
        this.closeManualReviewModal();
      } catch (e) {
        this.notifyErr(e.message || "Unable to submit manual review decision.");
      } finally {
        this.isSubmittingReviewDecision = false;
      }
    },
    normalizeRiskFlag(flag, index) {
      const code = flag?.code || flag?.reason || "";
      const severity = flag?.severity || "";
      const metadata = flag?.metadata || {};
      const metadataEntries = this.scalarEntries(metadata)
        .filter(entry => String(entry.key).toLowerCase() !== "strategy")
        .map(entry => ({
          ...entry,
          value: entry.key === "reason"
            ? this.formatJurisdictionRestrictionReason(metadata.reason)
            : entry.value,
        }));

      return {
        ...flag,
        key: `${code || "risk-flag"}-${index}`,
        code,
        severity,
        source: flag?.source || flag?.associatedStep || flag?.step || "",
        associatedStep: flag?.associatedStep || flag?.step || "",
        title: code ? this.formatRiskCode(code) : "Risk Flag",
        description: flag?.message || flag?.description || "",
        metadata,
        metadataEntries,
      };
    },
    formatJurisdictionRestrictionReason(reason) {
      if (!this.hasValue(reason)) return "";
      const knownReasons = Object.values(Config['JurisdictionRestrictionReason'] || {});
      return knownReasons.includes(reason) ? this.formatRiskCode(reason) : this.formatStatusLabel(reason);
    },
    formatRiskCode(code) {
      return String(code)
        .toLowerCase()
        .split("_")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    },
    formatSeverity(severity) {
      return String(severity || "").toLowerCase().replace(/^./, (char) => char.toUpperCase());
    },
    riskSeverityClass(severity) {
      const value = String(severity || "").toLowerCase();
      return {
        "badge-outline-danger": value === "high",
        "badge-outline-warning": value === "medium",
        "badge-outline-secondary": value === "low",
      };
    },
    riskFlagCardClass(severity) {
      const value = String(severity || "").toLowerCase();
      return {
        "border-danger": value === "high",
        "border-warning": value === "medium",
        "border-secondary": value === "low",
      };
    },
    riskFlagIconClass(severity) {
      const value = String(severity || "").toLowerCase();
      return value === "high" ? "mdi mdi-alert-circle-outline" : "mdi mdi-alert-outline";
    },
    decisionStatusLabel(action) {
      const labels = {
        MANUAL_REVIEW: "Manual Review",
        APPROVED: "Approved",
        REJECTED: "Rejected",
      };

      if (labels[action]) return labels[action];
      return this.formatRiskCode(action || "Decision");
    },
    decisionStatusClass(action) {
      if (action === "REJECTED") return "badge-outline-danger";
      if (action === "APPROVED") return "badge-outline-success";
      return "badge-outline-warning";
    },
    formatDecisionReason(reasonCode) {
      const reason = this.reviewReasonOptions.find((item) => item.value === reasonCode);
      if (reason) return reason.label;

      return this.formatRiskCode(reasonCode);
    },
    isManualReviewCleared(decision) {
      return decision?.reasonCode === "MANUAL_REVIEW_CLEARED";
    },
    formatFieldValue(key, value) {
      if (!value && value !== 0) return value;
      const dateKeys = /date|dob|birth|expir|issued|valid/i;
      if (dateKeys.test(key)) {
        // Unix seconds (10 digits) or milliseconds (13 digits)
        const num = Number(value);
        if (
          !isNaN(num) &&
          String(value)
            .trim()
            .match(/^\d{9,13}$/)
        ) {
          const ms = String(value).length === 10 ? num * 1000 : num;
          const d = new Date(ms);
          
          if (!isNaN(d.getTime())) {
            return d.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
          }
        }
      }
      return value;
    },
    async downloadKYCReport() {
      try {
        this.isLoading = true;

        // ── colours ──────────────────────────────────────────────────
        const navy = "#1c2336";
        const purple = "#905ab0";
        const dark = "#1e1e1e";
        const mid = "#646e7d";
        const light = "#f5f6f8";
        const bord = "#e5e7eb";
        const grn = "#27ae60";
        const rd = "#dc3545";
        const white = "#ffffff";
        const amber = "#d97706";

        // ── register custom pdfmake table layouts ─────────────────────
        pdfMake.tableLayouts = {
          // zebra-striped data rows, no outer borders
          kycTable: {
            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 0 : 0.4),
            vLineWidth: () => 0,
            hLineColor: () => bord,
            paddingLeft: (i) => (i === 0 ? 12 : 8),
            paddingRight: (i, node) => (i === node.table.widths.length - 1 ? 12 : 8),
            paddingTop: () => 7,
            paddingBottom: () => 7,
            fillColor: (rowIndex) => (rowIndex % 2 === 0 ? light : white),
          },
          // stat cards in the metadata bar – vertical dividers only
          statBar: {
            hLineWidth: () => 0,
            vLineWidth: (i, node) =>
              i === 0 || i === node.table.widths.length ? 0 : 0.5,
            vLineColor: () => bord,
            paddingLeft: () => 16,
            paddingRight: () => 16,
            paddingTop: () => 14,
            paddingBottom: () => 14,
            fillColor: () => light,
          },
          // verification result strip – left accent only via canvas
          resultLayout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingLeft: () => 12,
            paddingRight: () => 12,
            paddingTop: () => 8,
            paddingBottom: () => 8,
            fillColor: () => light,
          },
        };

        // ── helpers ──────────────────────────────────────────────────
        const toBase64 = (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              const c = document.createElement("canvas");
              c.width = img.naturalWidth;
              c.height = img.naturalHeight;
              c.getContext("2d").drawImage(img, 0, 0);
              resolve(c.toDataURL("image/jpeg", 0.85));
            };
            img.onerror = () => resolve(null);
            img.src = url;
          });
        const toBase64Png = (url, invertColors = false) =>
          new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              const c = document.createElement("canvas");
              c.width = img.naturalWidth;
              c.height = img.naturalHeight;
              const ctx = c.getContext("2d");

              ctx.drawImage(img, 0, 0);

              if (invertColors) {
                const imageData = ctx.getImageData(0, 0, c.width, c.height);
                const data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                  data[i] = 255 - data[i];
                  data[i + 1] = 255 - data[i + 1];
                  data[i + 2] = 255 - data[i + 2];
                }

                ctx.putImageData(imageData, 0, 0);
              }

              resolve(c.toDataURL("image/png"));
            };
            img.onerror = () => resolve(null);
            img.src = url;
          });

        const statusColor = (s) =>
          s === "Completed" ? grn : s === "Failed" ? rd : amber;

        const getPdfFont = (value) => {
          const text = String(value ?? "");
          if (/[\u0600-\u06FF]/.test(text)) return "NotoNaskhArabic";
          if (/[\u0980-\u09FF]/.test(text)) return "NotoSansBengali";
          if (/[\u0900-\u097F]/.test(text)) return "NotoSansDevanagari";
          return PDF_FONT_FAMILY;
        };

        const getPdfText = (value) => {
          const text = String(value ?? "—");
          if (!text) return "—";

          const chunks = [];
          let currentText = "";
          let currentFont = getPdfFont(text[0]);

          for (const char of text) {
            const charFont = getPdfFont(char);
            if (charFont !== currentFont && currentText) {
              chunks.push({ text: currentText, font: currentFont });
              currentText = "";
            }
            currentText += char;
            currentFont = charFont;
          }

          if (currentText) chunks.push({ text: currentText, font: currentFont });

          return chunks.length === 1 ? text : chunks;
        };

        const pdfTextNode = (value, options = {}) => ({
          text: getPdfText(value),
          font: getPdfFont(value),
          ...options,
        });

        // section header with purple left-accent bar
        const sectionTitle = (text) => ({
          columns: [
            {
              canvas: [{ type: "rect", x: 0, y: 1, w: 3, h: 11, color: purple, r: 1 }],
              width: 8,
            },
            {
              text: text.toUpperCase(),
              bold: true,
              fontSize: 9,
              color: navy,
              letterSpacing: 0.5,
              margin: [4, 1, 0, 0],
            },
          ],
          columnGap: 0,
          margin: [0, 16, 0, 4],
        });

        // full-width hairline separator
        const divider = () => ({
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 0.4,
              lineColor: bord,
            },
          ],
          margin: [0, 0, 0, 8],
        });

        // two-column key/value table using custom kycTable layout
        const dataTable = (rows) => ({
          table: {
            widths: ["42%", "58%"],
            body: rows.map(([label, value]) => [
              pdfTextNode(label, { color: mid, fontSize: 8 }),
              pdfTextNode(value, { color: dark, fontSize: 8, bold: true }),
            ]),
          },
          layout: "kycTable",
          margin: [0, 2, 0, 6],
        });

        // pill-shaped PASSED / FAILED badge
        const pill = (passed) => ({
          table: {
            widths: ["*"],
            body: [
              [
                {
                  text: passed ? " PASSED " : " FAILED ",
                  fontSize: 7,
                  bold: true,
                  color: white,
                  fillColor: passed ? grn : rd,
                  border: [false, false, false, false],
                  alignment: "center",
                },
              ],
            ],
          },
          layout: "noBorders",
          margin: [0, 0, 0, 0],
        });

        // verification result row (uses resultLayout)
        const verifyRow = (label, passed, detail) => [
          {
            table: {
              widths: ["*", 54],
              body: [
                [
                  {
                    text: label,
                    fontSize: 8.5,
                    color: dark,
                    border: [false, false, false, false],
                  },
                  {
                    text: passed ? "PASSED" : "FAILED",
                    fontSize: 7,
                    bold: true,
                    color: white,
                    fillColor: passed ? grn : rd,
                    border: [false, false, false, false],
                    alignment: "center",
                    margin: [0, 2, 0, 2],
                  },
                ],
              ],
            },
            layout: "resultLayout",
            margin: [0, 2, 0, 0],
          },
          ...(detail && !passed
            ? [
                {
                  text: detail,
                  fontSize: 7.5,
                  color: rd,
                  italics: true,
                  margin: [12, 2, 0, 6],
                },
              ]
            : [{ text: "", margin: [0, 0, 0, 4] }]),
        ];

        // small label above a bold value (for stat bar cells)
        const statCell = (label, value, valueColor) => ({
          stack: [
            pdfTextNode(label.toUpperCase(), { fontSize: 6.5, color: mid, bold: true }),
            pdfTextNode(value, {
              fontSize: 10,
              bold: true,
              color: valueColor || dark,
              margin: [0, 3, 0, 0],
            }),
          ],
        });

        // break a long string (no spaces) into lines so it fits in PDF columns
        const breakLong = (str, chunk = 30) => {
          if (!str) return "—";
          const s = String(str);
          if (s.length <= chunk) return s;
          const parts = [];
          for (let i = 0; i < s.length; i += chunk) parts.push(s.slice(i, i + chunk));
          return parts.join("\n");
        };

        const stepStatusColor = (status) => {
          if (status === "completed") return grn;
          if (status === "in-progress") return amber;
          return bord;
        };

        const stepStatusLabel = (status) => {
          if (status === "completed") return "Completed";
          if (status === "in-progress") return "In Progress";
          return "Not Started";
        };

        const isStepCompletedValue = (value) => value === 1 || value === "1";
        const isStepPendingValue = (value) => value === 0 || value === "0";

        const getPdfStepStatus = (stepProperty) => {
          const session = this.session || {};
          const currentSessionStatus = session.status || "Unknown";
          const isPendingSession = ["Pending", "In Progress"].includes(
            currentSessionStatus
          );
          if (!(stepProperty in session)) return "not-started";
          if (isStepCompletedValue(session[stepProperty])) return "completed";
          if (isStepPendingValue(session[stepProperty]) && isPendingSession) {
            return "in-progress";
          }
          return "not-started";
        };

        const pdfStepDefinitions = [
          { key: "step_start", label: "Start", title: "Session Started" },
          { key: "step_liveliness", label: "Liveness", title: "Liveness Check" },
          { key: "step_ocrIdVerification", label: "Document", title: "Document Verification" },
          { key: "step_userConsent", label: "Consent", title: "User Consent" },
          { key: "step_finish", label: "Done", title: "Completed" },
        ].map((step) => ({
          ...step,
          status: getPdfStepStatus(step.key),
        }));

        const completedPdfSteps = pdfStepDefinitions.filter(
          (step) => step.status === "completed"
        ).length;
        const progressPct = Math.round(
          (completedPdfSteps / pdfStepDefinitions.length) * 100
        );

        const stepMetaCell = (label, value, color = dark) => ({
          stack: [
            pdfTextNode(label.toUpperCase(), { fontSize: 6.5, color: mid, bold: true }),
            pdfTextNode(value, {
              fontSize: 10,
              bold: true,
              color,
              margin: [0, 3, 0, 0],
            }),
          ],
        });

        const stepTrackNode = (step) => {
          // cx is the circle center in the 66pt column, r=8
          const cx = 33;
          const cy = 9;
          const r  = 8;
          const fill = stepStatusColor(step.status);

          const shapes = [
            { type: "ellipse", x: cx, y: cy, r1: r, r2: r, color: fill },
          ];

          if (step.status === "completed") {
            // white checkmark
            shapes.push(
              { type: "line", x1: cx - 4, y1: cy + 0.5, x2: cx - 1, y2: cy + 3.5, lineWidth: 1.8, lineColor: white },
              { type: "line", x1: cx - 1, y1: cy + 3.5, x2: cx + 5, y2: cy - 3,   lineWidth: 1.8, lineColor: white }
            );
          } else if (step.status === "in-progress") {
            // three white dots
            shapes.push(
              { type: "ellipse", x: cx - 4, y: cy, r1: 1.3, r2: 1.3, color: white },
              { type: "ellipse", x: cx,     y: cy, r1: 1.3, r2: 1.3, color: white },
              { type: "ellipse", x: cx + 4, y: cy, r1: 1.3, r2: 1.3, color: white }
            );
          } else {
            // grey dash
            shapes.push(
              { type: "line", x1: cx - 4, y1: cy, x2: cx + 4, y2: cy, lineWidth: 1.8, lineColor: "#9ca3af" }
            );
          }

          return {
            width: 66,
            stack: [
              { canvas: shapes, margin: [0, 0, 0, 3] },
              { text: step.label, fontSize: 7, bold: true, color: dark, alignment: "center" },
              {
                text: stepStatusLabel(step.status),
                fontSize: 6,
                color: step.status === "completed" ? grn : step.status === "in-progress" ? amber : mid,
                alignment: "center",
                margin: [0, 1, 0, 0],
              },
            ],
          };
        };

        const stepTrackLine = (done) => ({
          width: "*",
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 9,
              x2: 40,
              y2: 9,
              lineWidth: 1.5,
              lineColor: done ? grn : bord,
            },
          ],
          margin: [0, 0, 0, 0],
        });

        const stepTrackColumns = pdfStepDefinitions.flatMap((step, index) => {
          const columns = [stepTrackNode(step)];
          if (index < pdfStepDefinitions.length - 1) {
            columns.push(stepTrackLine(step.status === "completed"));
          }
          return columns;
        });

        // ── load images ───────────────────────────────────────────────
        const selfieUrl = this.effectiveSelfiDetails?.tokenSelfiImage;
        const faceUrl = this.effectiveOcrIdDocsDetails?.tokenFaceImage;
        const frontUrl = this.effectiveOcrIdDocsDetails?.tokenFrontDocumentImage;
        const backUrl = this.effectiveOcrIdDocsDetails?.tokenBackDocumentImage;

        const [selfieB64, faceB64, frontB64, backB64] = await Promise.all([
          selfieUrl ? toBase64(selfieUrl) : Promise.resolve(null),
          faceUrl ? toBase64(faceUrl) : Promise.resolve(null),
          frontUrl ? toBase64(frontUrl) : Promise.resolve(null),
          backUrl ? toBase64(backUrl) : Promise.resolve(null),
        ]);

        // embed project logo in PDF header
        const logoPng = await toBase64Png(logoSrc, true);

        // ── data extraction ───────────────────────────────────────────
        const personalData =
          Object.keys(this.userPersonalDataFromUserConsent).length > 0
            ? this.userPersonalDataFromUserConsent
            : this.userPersonalDataGovIdFromUserConsent;

        const personalRows = Object.entries(personalData)
          .filter(([, v]) => v)
          .map(([k, v]) => {
            let value = v;

            // Convert Unix timestamp → readable date
            if (typeof value === "number") {
              const ts = value.toString().length === 10 ? value * 1000 : value;
              const date = new Date(ts);

              if (!isNaN(date.getTime())) {
                value = date.toLocaleString("en-IN"); // better for India
              }
            }

            // Decode ONLY if string contains unicode escape sequences
            if (typeof value === "string" && /\\u[0-9a-fA-F]{4}/.test(value)) {
              try {
                value = JSON.parse(`"${value}"`);
              } catch {
                // ignore if parsing fails
              }
            }

            return [
              k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
              String(value),
            ];
          });
          
        const livePass = this.passiveLivelinessData.success;
        const liveLabel = this.passiveLivelinessData.result || "—";
        const liveScore = this.effectiveSelfiDetails?.serviceLivenessResult ?? "—";

        const facePass = this.faceAuthenticationPassedForDisplay;
        const faceDetail = this.faceAuthenticationResultForDisplay;
        const matchPct = Math.round(
          (this.effectiveOcrIdDocsDetails?.serviceFacialSimilarityResult || 0) * 100
        );

        const sessionStatus = this.session.status || "Unknown";

        // actual session UUID lives in timeLineDetails entries; this.sessionId is the userId hash

        // duration: prefer userConsent diff, fall back to completedAt - createdAt

        // timeline rows
        const tlRows = (this.sortedTimelineDetails || []).map((step, i) => {
          const isLast = i === this.sortedTimelineDetails.length - 1;
          return {
            columns: [
              {
                stack: [
                  {
                    canvas: [
                      {
                        type: "ellipse",
                        x: 6,
                        y: 6,
                        r1: 5,
                        r2: 5,
                        color: step.error ? rd : "#905ab0",
                      },
                      ...(!isLast
                        ? [
                            {
                              type: "line",
                              x1: 6,
                              y1: 11,
                              x2: 6,
                              y2: 22,
                              lineWidth: 1,
                              lineColor: bord,
                            },
                          ]
                        : []),
                    ],
                  },
                ],
                width: 18,
              },
              {
                stack: [
                  { text: step.stepName || "", fontSize: 8.5, bold: true, color: dark },
                  ...(step.error
                    ? [
                        {
                          text: step.error,
                          fontSize: 7.5,
                          color: rd,
                          italics: true,
                          margin: [0, 2, 0, 0],
                        },
                      ]
                    : []),
                ],
                width: "*",
              },
              {
                text: this.formatDate(step.createdAt),
                fontSize: 7.5,
                color: mid,
                alignment: "right",
                width: 120,
              },
            ],
            columnGap: 6,
            margin: [0, 0, 0, step.error ? 10 : 6],
          };
        });

        // ── document definition ───────────────────────────────────────
        const dd = {
          pageSize: "A4",
          pageMargins: [36, 60, 36, 52],

          // purple accent stripe on every page; full navy block on page 1 only
          background: (currentPage, pageSize) => {
            if (currentPage === 1) {
              return {
                canvas: [
                  { type: "rect", x: 0, y: 0, w: pageSize.width, h: 57, color: navy },
                  { type: "rect", x: 0, y: 57, w: pageSize.width, h: 3, color: purple },
                ],
              };
            }
            return {
              canvas: [
                { type: "rect", x: 0, y: 0, w: pageSize.width, h: 3, color: purple },
              ],
            };
          },

          // persistent branded header — full on page 1, compact on pages 2+
          header: (currentPage) => {
            if (currentPage === 1) {
              return {
                margin: [36, 8, 36, 0],
                columns: [
                  {
                    stack: logoPng
                      ? [{ image: logoPng, width: 120, margin: [0, 0, 0, 4] }]
                      : [
                          {
                            text: "Hypersign",
                            bold: true,
                            fontSize: 14,
                            color: white,
                            margin: [0, 8, 0, 0],
                          },
                        ],
                    width: "*",
                  },
                  {
                    stack: [
                      {
                        text: "ID Verification Report",
                        bold: true,
                        fontSize: 12,
                        color: white,
                        alignment: "right",
                      },
                      {
                        text: new Date().toLocaleString(),
                        fontSize: 7,
                        color: "#8892a4",
                        alignment: "right",
                        margin: [0, 3, 0, 0],
                      },
                    ],
                    width: "auto",
                  },
                ],
              };
            }
            return {
              margin: [36, 8, 36, 0],
              columns: [],
            };
          },

          footer: (currentPage, pageCount, pageSize) => ({
            margin: [36, 8, 36, 10],
            stack: [
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 0,
                    x2: pageSize.width - 72,
                    y2: 0,
                    lineWidth: 0.4,
                    lineColor: bord,
                  },
                ],
                margin: [0, 0, 0, 5],
              },
              {
                columns: [
                  {
                    text:
                      "CONFIDENTIAL \u2014 Hypersign Identity \u00B7 ID Verification Report",
                    fontSize: 7,
                    color: mid,
                    width: "*",
                  },
                  {
                    text: `Page ${currentPage} of ${pageCount}`,
                    fontSize: 7,
                    color: mid,
                    bold: true,
                    alignment: "right",
                    width: "auto",
                  },
                ],
              },
            ],
          }),

          content: [
            // ════════════════ STAT BAR ════════════════
            // user ID first (full width)
            ...(this.session.userId
              ? [
                  {
                    table: {
                      widths: ["*"],
                      body: [
                        [
                          {
                            stack: [
                              { text: "USER ID", fontSize: 6.5, color: mid, bold: true },
                              {
                                text: this.session.userId || "—",
                                fontSize: 7.5,
                                bold: true,
                                color: dark,
                                margin: [0, 3, 0, 0],
                              },
                            ],
                          },
                        ],
                      ],
                    },
                    layout: "statBar",
                    margin: [0, 12, 0, 0],
                  },
                ]
              : []),
            // date + status
            {
              table: {
                widths: ["*", "*"],
                body: [
                  [
                    statCell("Date", this.formatDate(this.session.createdAt)),
                    statCell("Status", sessionStatus, statusColor(sessionStatus)),
                  ],
                ],
              },
              layout: "statBar",
              margin: [0, 0, 0, 0],
            },
            // email (full width)
            {
              table: {
                widths: ["*"],
                body: [
                  [
                    statCell("Email", this.session.email || "—"),
                  ],
                ],
              },
              layout: "statBar",
              margin: [0, 0, 0, 0],
            },
            // completedAt (full width)
            {
              table: {
                widths: ["*"],
                body: [
                  [
                    {
                      stack: [
                        { text: "COMPLETED AT", fontSize: 6.5, color: mid, bold: true },
                        {
                          text: this.formatDate(this.session.completedAt) || "—",
                          fontSize: 8,
                          bold: true,
                          color: dark,
                          margin: [0, 3, 0, 0],
                        },
                      ],
                    },
                  ],
                ],
              },
              layout: "statBar",
              margin: [0, 0, 0, 4],
            },

            // ════════════════ VERIFICATION STEPS PROGRESS ════════════════
            {
              stack: [
                sectionTitle("Verification Steps"),
                divider(),
                {
                  table: {
                    widths: ["*", "*", "*"],
                    body: [[
                      stepMetaCell("Progress", `${progressPct}%`),
                      stepMetaCell("Retries", this.session.retryAttempts ?? 0),
                      stepMetaCell("Status", sessionStatus, statusColor(sessionStatus)),
                    ]],
                  },
                  layout: "statBar",
                  margin: [0, 2, 0, 10],
                },
                {
                  columns: stepTrackColumns,
                  columnGap: 0,
                  margin: [0, 6, 0, 10],
                },
              ],
              unbreakable: true,
            },

            // ════════════════ PERSONAL INFORMATION ════════════════
            ...(personalRows.length > 0
              ? [sectionTitle("Personal Information"), divider(), dataTable(personalRows)]
              : []),

            // ════════════════ DEVICE & LOCATION ════════════════
            ...(this.deviceDetails?.os || Object.keys(this.locationDetails).length > 0
              ? [
                  {
                    stack: [
                      sectionTitle("Device & Location"),
                      divider(),
                      {
                        columns: [
                      // device column
                      ...(this.deviceDetails?.os
                        ? [
                            {
                              stack: [
                                {
                                  text: "Device Information",
                                  fontSize: 8,
                                  bold: true,
                                  color: mid,
                                  margin: [0, 0, 0, 4],
                                },
                                dataTable([
                                  [
                                    "Operating System",
                                    `${this.deviceDetails.os || "N/A"} ${
                                      this.deviceDetails.osVer || ""
                                    }`.trim(),
                                  ],
                                  ["Browser", this.deviceDetails.browser || "N/A"],
                                  ["Device", this.deviceDetails.device || "N/A"],
                                  ["CPU", this.deviceDetails.cpu || "N/A"],
                                ]),
                              ],
                              width: "50%",
                            },
                          ]
                        : []),
                      // location column
                      ...(Object.keys(this.locationDetails).length > 0
                        ? [
                            {
                              stack: [
                                {
                                  text: "Location Information",
                                  fontSize: 8,
                                  bold: true,
                                  color: mid,
                                  margin: [0, 0, 0, 4],
                                },
                                dataTable([
                                  ["IP Address", this.locationDetails.ip || "—"],
                                  ["Country", this.locationDetails.countryName || "—"],
                                  [
                                    "Continent",
                                    this.locationDetails.continentName || "—",
                                  ],
                                  ["Region", this.locationDetails.region || "—"],
                                ]),
                              ],
                              width: "50%",
                            },
                          ]
                        : []),
                    ],
                    columnGap: 12,
                      },
                    ],
                    unbreakable: true,
                  },
                ]
              : []),

            // ════════════════ LIVENESS CHECK ════════════════
            ...(this.selfiImageFound && this.livelinessResultFound
              ? [
                  {
                    stack: [
                      sectionTitle("Liveness Check"),
                      divider(),
                      {
                    columns: [
                      // selfie image
                      ...(selfieB64
                        ? [
                            {
                              stack: [
                                {
                                  image: selfieB64,
                                  width: 96,
                                  height: 96,
                                  alignment: "center",
                                },
                                {
                                  text: "Captured Selfie",
                                  fontSize: 7,
                                  color: mid,
                                  alignment: "center",
                                  margin: [0, 4, 0, 0],
                                },
                              ],
                              width: 110,
                            },
                          ]
                        : []),
                      // results
                      {
                        stack: [
                          {
                            table: {
                              widths: ["*"],
                              body: [
                                [
                                  {
                                    stack: [
                                      {
                                        text: livePass
                                          ? "✓  Live Person Detected"
                                          : "✗  Liveness Check Failed",
                                        bold: true,
                                        fontSize: 11,
                                        color: livePass ? grn : rd,
                                      },
                                      {
                                        text: `Score: ${liveScore}  |  Result: ${liveLabel}`,
                                        fontSize: 8,
                                        color: mid,
                                        margin: [0, 4, 0, 0],
                                      },
                                    ],
                                    border: [false, false, false, false],
                                    fillColor: livePass ? "#f0faf4" : "#fff5f5",
                                    margin: [10, 10, 10, 10],
                                  },
                                ],
                              ],
                            },
                            layout: "noBorders",
                            margin: [0, 0, 0, 8],
                          },
                          pill(livePass),
                        ],
                        width: "*",
                        margin: [12, 0, 0, 0],
                      },
                    ],
                    columnGap: 0,
                        margin: [0, 4, 0, 16],
                      },
                    ],
                    unbreakable: true,
                  },
                ]
              : []),

            // ════════════════ FACE AUTHENTICATION ════════════════
            ...(this.selfiImageFound && this.idDocFaceImageFound
              ? [
                  {
                    stack: [
                      sectionTitle("Face Authentication"),
                      divider(),
                      // three-column: selfie — match result — id photo
                      {
                    columns: [
                      {
                        stack: [
                          ...(selfieB64
                            ? [{ image: selfieB64, width: 90, height: 90 }]
                            : [
                                {
                                  canvas: [
                                    {
                                      type: "rect",
                                      x: 0,
                                      y: 0,
                                      w: 90,
                                      h: 90,
                                      color: light,
                                    },
                                  ],
                                },
                              ]),
                          {
                            text: "Live Selfie",
                            fontSize: 7.5,
                            color: mid,
                            alignment: "center",
                            margin: [0, 5, 0, 0],
                          },
                        ],
                        alignment: "center",
                        width: 100,
                      },
                      ...(this.faceAuthenticationResultFound
                        ? [
                            {
                              stack: [
                                {
                                  text: `${matchPct}%`,
                                  bold: true,
                                  fontSize: 22,
                                  color: matchPct >= 80 ? grn : rd,
                                  alignment: "center",
                                },
                                {
                                  text: "Similarity",
                                  fontSize: 7.5,
                                  color: mid,
                                  alignment: "center",
                                },
                                {
                                  canvas: [
                                    {
                                      type: "line",
                                      x1: 10,
                                      y1: 0,
                                      x2: 70,
                                      y2: 0,
                                      lineWidth: 0.4,
                                      lineColor: bord,
                                    },
                                  ],
                                  margin: [0, 8, 0, 8],
                                },
                                {
                                  text: facePass ? "✓ MATCH" : "✗ NO MATCH",
                                  bold: true,
                                  fontSize: 9,
                                  color: facePass ? grn : rd,
                                  alignment: "center",
                                },
                              ],
                              width: "*",
                              margin: [0, 16, 0, 0],
                            },
                          ]
                        : []),
                      {
                        stack: [
                          ...(faceB64
                            ? [{ image: faceB64, width: 90, height: 90 }]
                            : [
                                {
                                  canvas: [
                                    {
                                      type: "rect",
                                      x: 0,
                                      y: 0,
                                      w: 90,
                                      h: 90,
                                      color: light,
                                    },
                                  ],
                                },
                              ]),
                          {
                            text: "ID Photo",
                            fontSize: 7.5,
                            color: mid,
                            alignment: "center",
                            margin: [0, 5, 0, 0],
                          },
                        ],
                        alignment: "center",
                        width: 100,
                      },
                    ],
                    columnGap: 8,
                        margin: [0, 4, 0, 10],
                      },
                      ...(this.faceAuthenticationDisplayFound
                        ? verifyRow(
                            "Face Authentication Overall Result",
                            facePass,
                            faceDetail
                          )
                        : []),
                    ],
                    unbreakable: true,
                  },
                ]
              : []),

            // ════════════════ SOUL BOUND TOKENS ════════════════
            ...(this.allSbtMintData?.length > 0
              ? [
                  {
                    stack: [
                      sectionTitle("Soul Bound Tokens"),
                      divider(),
                      ...this.allSbtMintData.map((sbt, idx) => ({
                        stack: [
                          ...(this.allSbtMintData.length > 1
                            ? [
                                {
                                  text: `Token ${idx + 1}`,
                                  fontSize: 8,
                                  color: mid,
                                  bold: true,
                                  margin: [0, 0, 0, 4],
                                },
                              ]
                            : []),
                          dataTable([
                            ["Credential Type", `${sbt.proofType}SbtCredential`],
                            ["Blockchain", sbt.blockchainLabel || "—"],
                            ["Wallet Address", breakLong(sbt.ownerWalletAddress || "—", 26)],
                            ["User DID", breakLong(sbt.did || "—", 26)],
                            ...(sbt.tokenId ? [["Token ID", String(sbt.tokenId)]] : []),
                            ...(sbt.transactionHash
                              ? [["Transaction Hash", breakLong(sbt.transactionHash, 26)]]
                              : []),
                            ...(sbt.sbtContractAddress
                              ? [["Contract Address", breakLong(sbt.sbtContractAddress, 26)]]
                              : []),
                          ]),
                        ],
                      })),
                    ],
                    unbreakable: true,
                  },
                ]
              : []),
            // ════════════════ DOCUMENT IMAGES (new page) ═══════════
            ...(frontB64 || backB64
              ? [
                  { ...sectionTitle("Identity Document Images"), pageBreak: "before" },
                  divider(),
                  ...(frontB64
                    ? [
                        {
                          text: "Front Side",
                          fontSize: 8,
                          bold: true,
                          color: mid,
                          margin: [0, 4, 0, 8],
                        },
                        {
                          image: frontB64,
                          width: 300,
                          alignment: "center",
                          margin: [0, 0, 0, 20],
                        },
                      ]
                    : []),
                  ...(backB64
                    ? [
                        {
                          text: "Back Side",
                          fontSize: 8,
                          bold: true,
                          color: mid,
                          margin: [0, 4, 0, 8],
                        },
                        {
                          image: backB64,
                          width: 300,
                          alignment: "center",
                          margin: [0, 0, 0, 20],
                        },
                      ]
                    : []),
                ]
              : []),
            // ════════════════ VERIFICATION TIMELINE ════════════════
            ...(tlRows.length > 0
              ? [sectionTitle("Verification Timeline"), divider(), ...tlRows]
              : []),
          ],

          defaultStyle: { font: PDF_FONT_FAMILY, fontSize: 9, lineHeight: 1.35, color: dark },
        };

        pdfMake
          .createPdf(dd)
          .download(
            `KYC-Report-${
              this.session.userId || this.sessionId || "session"
            }-${Date.now()}.pdf`
          );
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.error("Error generating PDF:", err);
        this.notifyErr(err.message);
      }
    },
    goBack() {
      if (this.isSessionDetailView && this.parentUserIdentifier) {
        const query = { ...this.$route.query };
        delete query.userId;
        delete query.attemptNumber;
        this.$router.push({
          name: "sessionDetails",
          params: {
            appId: this.$route.params.appId,
            sessionId: this.parentUserIdentifier,
          },
          query,
        });
        return;
      }
      if(this.isValidBusinessID){
        this.$router.push({ name: "BusinessDetails", params: { companyId: this.companyId, appId: this.appId, tab: "ubo-details"} }
      );
      }else{
      this.$router.push({
        name: "playgroundCredential",
      });
      }
    
    },
    goToCompanySource() {
      if (!this.hasCurrentCompanyName || !this.companyId) return;

      this.$router.push({
        name: "BusinessDetails",
        params: { companyId: this.companyId, appId: this.appId },
      });
    },

    getChainDetail(blockchainlabel = "cosmos:comdex:test") {
      // console.log('Inside get chain details.... ' + JSON.stringify(blockchainlabel))
      // const config = getCosmosChainConfig(blockchainlabel)

      const chainLabel = blockchainlabel || "cosmos:comdex:test";
      let config;
      if (chainLabel.indexOf("cosmos") >= 0) {
        config = getCosmosChainConfig(chainLabel);
      } else {
        config = getStellarChainConfig(chainLabel);
      }

      return {
        chainName: config?.chainName || chainLabel,
        chainId: config?.chainId || "",
        logoUrl: config?.stakeCurrency?.coinImageUrl || "",
        tx_explorer: config?.txExplorer?.txUrl || "",
      };
    },
    hasValue(value) {
      return value !== undefined && value !== null && value !== "";
    },
    hasObjectData(value) {
      return Boolean(value && Object.keys(value).length > 0);
    },
    stepDetailRecords(value) {
      if (Array.isArray(value)) {
        return value
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => this.hasObjectData(item))
          .sort((a, b) => {
            const aTime = Date.parse(a.item.updatedAt || a.item.createdAt) || 0;
            const bTime = Date.parse(b.item.updatedAt || b.item.createdAt) || 0;
            return bTime - aTime || a.index - b.index;
          })
          .map(({ item }) => item);
      }
      return this.hasObjectData(value) ? [value] : [];
    },
    documentRecordKey(category, record, index) {
      return `${category}-${record?._id || record?.id || record?.createdAt || index}`;
    },
    documentSidesForRecord(record) {
      const sides = [];
      if (record?.tokenFrontDocumentImage) sides.push("Front side");
      if (record?.tokenBackDocumentImage) sides.push("Back side");
      return sides.join(" · ") || "Extracted information";
    },
    documentRecordResult(record) {
      const result = record?.serviceFacialAuthenticationResult;
      if (this.hasValue(result)) {
        const passed = result == 3;
        return { passed, label: passed ? "Passed" : "Failed", tone: passed ? "passed" : "failed" };
      }
      if (this.ocrDocumentRecords.length === 1 && this.hasValue(this.detailsSession?.step_ocrIdVerification)) {
        const passed = this.detailsSession.step_ocrIdVerification == 1;
        return { passed, label: passed ? "Passed" : "Failed", tone: passed ? "passed" : "failed" };
      }
      return null;
    },
    selfieRecordResult(record) {
      const result = record?.serviceLivenessResult;
      if (!this.hasValue(result)) return null;
      const passed = result == 3;
      return {
        passed,
        label: ServiceLivenessResultEnum[result] || (passed ? "Live" : "Failed"),
        tone: passed ? "passed" : "failed",
      };
    },
    latestStepDetail(value) {
      if (!Array.isArray(value)) {
        return this.hasObjectData(value) ? value : {};
      }

      return value.reduce((latest, current) => {
        if (!this.hasObjectData(current)) return latest;
        if (!this.hasObjectData(latest)) return current;

        const latestTime = Date.parse(latest.updatedAt || latest.createdAt) || 0;
        const currentTime = Date.parse(current.updatedAt || current.createdAt) || 0;
        return currentTime >= latestTime ? current : latest;
      }, {});
    },
    mergeWithFallback(primary = {}, fallback = {}) {
      const merged = { ...fallback };
      Object.entries(primary).forEach(([key, value]) => {
        if (this.hasValue(value)) {
          merged[key] = value;
        }
      });
      return merged;
    },
    withImagePrefix(image) {
      if (!image || typeof image !== "string") return image;
      if (image.startsWith("data:image")) return image;
      return `data:image/jpeg;base64,${image}`;
    },
    parseUserConsentPresentation() {
      if (!this.userConsentDataFound) return {};

      const presentation = this.effectiveUserConsentDetails.presentation;
      if (!presentation) return {};
      if (typeof presentation === "object") return presentation;

      try {
        return JSON.parse(presentation);
      } catch (e) {
        return {};
      }
    },
    getCredentialSubjectByType(type) {
      if (!type) return {};
      return this.userConsentCredentialSubjects[type] || {};
    },
    buildSelfiDetailsFromCredentialSubject(subject = {}) {
      if (!subject || Object.keys(subject).length === 0) return {};

      const tokenSelfiImage =
        subject.tokenSelfiImage ||
        subject.base64Image ||
        subject.bestImageTokenized ||
        subject.selfie ||
        subject.selfieImage;

      return this.mergeWithFallback(
        {
          tokenSelfiImage: this.withImagePrefix(tokenSelfiImage),
        },
        subject
      );
    },
    buildOcrIdDocsDetailsFromCredentialSubject(subject = {}) {
      if (!subject || Object.keys(subject).length === 0) return {};

      const tokenFaceImage =
        subject.tokenFaceImage || subject.face || subject.faceImage || subject.photo;
      const tokenFrontDocumentImage =
        subject.tokenFrontDocumentImage ||
        subject.frontDocumentImage ||
        subject.documentFrontImage ||
        subject.documentImage;
      const tokenBackDocumentImage =
        subject.tokenBackDocumentImage ||
        subject.backDocumentImage ||
        subject.documentBackImage;

      return this.mergeWithFallback(
        {
          tokenFaceImage: this.withImagePrefix(tokenFaceImage),
          tokenFrontDocumentImage: this.withImagePrefix(tokenFrontDocumentImage),
          tokenBackDocumentImage: this.withImagePrefix(tokenBackDocumentImage),
        },
        subject
      );
    },
    zoomDocument(place) {
      this.popupHeader = place;
      switch (place) {
        case "Document Front": {
          this.popupImage = this.effectiveOcrIdDocsDetails.tokenFrontDocumentImage;
          break;
        }
        case "Selfie": {
          this.popupImage = this.effectiveSelfiDetails.tokenSelfiImage;
          break;
        }
        case "Document Back": {
          this.popupImage = this.effectiveOcrIdDocsDetails.tokenBackDocumentImage;
          break;
        }
      }
      this.$root.$emit("bv::show::modal", "zoom-doc");
    },
  },
  mixins: [UtilsMixin],
};
</script>
