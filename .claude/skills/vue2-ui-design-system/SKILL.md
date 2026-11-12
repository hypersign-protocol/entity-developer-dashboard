---
name: vue2-ui-design-system
description: Use whenever creating, editing, or styling Vue 2 components, pages, modals, tables, or forms in this repository, or adding API calls behind them, to enforce our exact slate/blue theme, typography, spacing, standard component wrappers, data-fetching pattern, and the legacy patterns to avoid.
---

# Vue 2 UI Design System & Styling Rules

When building or styling UI in this repository, follow the slate/blue conventions of the modern reference modules:
`BillingDetails.vue` (forms, read-only summary, notices), `hfPopup.vue` (modal), `GoLivePanel.vue`
(cards, checklist, badges) and `SettingConfig.vue` (page header, tabs).
Copy their layout, forms and states, **not their buttons**: `BillingDetails` and `CreditTopUpPopup` still hand-roll gray
`.primary-button` / `.pay-action` classes, which rule 3 forbids.

There are no CSS variables or theme tokens yet. Write the exact values below in scoped styles.

## 1. Color Palette (Slate / Blue Theme)
Do not use the old purple/teal theme (`#905ab0`, `rgba(46,102,93)`, `#636363`), Bootstrap gray `#6c757d`, or Vuetify theme colors.

| Role | Value |
|---|---|
| Page / section headings | `#263244` |
| Modal title | `#172554` |
| Body text | `#273448` |
| Form labels | `#475467` |
| Muted text / subtitles | `#718198` |
| Help text, placeholder-level text | `#8793a5` |
| Primary accent / links / active tab | `#2563dc` |
| Focus | border `#2f6fec` + `box-shadow: 0 0 0 2px rgba(47,111,236,.12)` |
| Borders | inputs `#d5dde7`, cards `#d7e0ea`, nested items `#e1e6ed`, modal `#dbe3ef`, row dividers `#eef2f6` |
| Surfaces | page `#fff`, muted / modal body / disabled `#f8fafc`, hover `#f1f5f9` |

Status colors (text / background / border):
- **Success:** `#218459` / `#eaf8f0` / `#b7e2cb` (dot `#2daf78`)
- **Error:** `#b42318` / `#fef3f2` / `#fecdca`. An invalid input gets border `#f04438`. A destructive button is `#dc2626`.
- **Warning:** `#956625` / `#fff9ee` / `#efd4a5` (dot `#d99833`)
- **Info:** `#3538cd` / `#eef4ff` / `#c7d7fe`
- **Neutral:** `#64748b` / `#f1f5f9`

## 2. Typography
- **Base font:** `Roboto, sans-serif` at `13px`, set on `#app`. Roboto is **not loaded** by the app, so most machines show
  the system sans-serif. Don't add per-component font imports. Fixing the base font is a separate global change.
- **Page titles:** `24px` / `700`, `letter-spacing: -.02em`, `line-height: 1.25`.
- **Section and card titles:** `16px`–`17px` / `700`. **Modal titles:** `16px` / `700`.
- **Body, inputs, buttons:** `13px`. **Subtitles:** `12px`–`13px`, color `#718198`.
- **Form labels:** `12px` / `600`. **Tabs:** `13px` / `700`. **Sub-tabs:** `12px` / `700`.
- **Pills, badges, help text, error text:** `11px` (pills `700`). **Tables:** `12px`.
- **Code and IDs:** `ui-monospace, SFMono-Regular, Menlo, monospace`. Numbers in data get `font-variant-numeric: tabular-nums`.

## 3. Layout, Spacing & Components
- **Spacing:** px values on a 4px grid. 2px steps are allowed (common values are 4, 8, 10, 12, 14, 16, 20, 24). Lay out with CSS
  `gap`: `8px` between buttons, `14px 16px` in form grids, `18px` between cards. Page padding is `16px 15px 64px`, and the
  header-to-content gap is `24px`. There is one responsive breakpoint, `@media (max-width: 650px)`: grids collapse to one column and headers stack.
- **Page shell:** `header.app-page-header > h1.app-page-title + p.app-page-subtitle`, then the tabs. Inside a tab, use
  `<SectionHeader title description>` (`components/element/SectionHeader.vue`) with actions in its slot.
- **Tabs:** plain `<button>`s with `v-show`, never `b-tabs`. Main tabs (`.config-tabs`) use a 2px bottom border that is `#2563dc`
  when active. Secondary tabs (`.sub-tabs`) are a segmented control: track `#edf2f7`, active item white with a `#c7d5e8` border.
- **Cards:** `border: 1px solid #d7e0ea; border-radius: 12px; padding: 28px 30px; background: #fff;` with no shadow or a near-invisible
  one. Nested items use radius `10px`, border `#e1e6ed`, padding `14px 16px`. The header is a flex row: title and description on the
  left, a badge on the right. Don't use the legacy `.card`, `.serviceCard`, `.event-card` or `.card-head`.
- **Buttons:** always `<hf-buttons name icon-class="mdi-…" variant="primary|secondary|ghost|danger|danger-outline|link" size="sm" @executeAction>`.
  Never hand-roll buttons or pass `btn btn-*` classes. Group buttons in `.hf-btn-group`: right-aligned, destructive or secondary
  actions first, the primary action last.
- **Modals:** always use `<hf-pop-up>` (`components/element/hfPopup.vue`). Never use a raw `b-modal` in a feature.
  ```html
  <hf-pop-up v-model="open" title="Invite member" description="Optional subtitle" icon="mdi-account-plus-outline" size="lg">
    …body…
    <template #footer>
      <hf-buttons name="Cancel" variant="ghost" @executeAction="open = false" />
      <hf-buttons name="Send invite" variant="primary" @executeAction="send" />
    </template>
  </hf-pop-up>
  ```
  - **Opening:** use `v-model`, or give it an `id` and call `this.$root.$emit('bv::show::modal' | 'bv::hide::modal', id)`.
    Never use the removed global `modal-show` / `modal-close` events.
  - **Props:** `title` (`Header` is the older name and still works), `description`, `icon` (MDI), `size` (`sm|md|lg|xl`), `hideHeaderClose`.
    **Events:** `hide`, `hidden`. **Slots:** default (body), `footer` (actions).
  - **Chrome:** it already provides the light header with an icon tile, 14px radius, `#f8fafc` body and white footer. Don't restyle `.modal-*` per feature.
  - `CreditTopUpPopup.vue` still uses its own `b-modal` with the same look. It's due to move to `hf-pop-up`, so don't copy it.
- **Forms:** see §3b. **Dropdowns:** see §3c.
- **Notices:** `.notice.notice-{error|info|muted}`: radius `8px`, padding `12px 14px`, `12px` text, a leading `<v-icon small>`.
  Errors also get `role="alert"`.
- **Status pills:** `.status-pill.is-{success|muted|…}`: radius `10px`, `11px` / `700`, status colors from §1.
- **Tables:** a plain `<table>` inside an `overflow-x: auto` wrapper. `12px` text, `8px` cell padding, `#f1f5f9` row dividers.
- **Icons:** see §3a.
- **States:** render as one `v-if` chain: no permission, loading (`<load-ing>`, `<wait-spinner>` or a short "Loading…" line),
  empty (`<empty-container icon title description>`), load error with a "Try again" action, then content.
- **Permissions:** hide actions with `this.$can(service, access)` or the `mainStore/hasAccess` getter. The backend still enforces them.
- **Copy:** short, plain, sentence-case strings written inline in the template.

## 3a. Icons
- **One set:** Material Design Icons (`@mdi/font`) only. Don't use Font Awesome (`fa fa-…`), Bootstrap-Vue `<b-icon>`,
  MDI Light (`mdil-…`), emoji or `<img>` icons in new code. Replace them when you touch a legacy file.
- **How to render:** use `<v-icon small>mdi-…</v-icon>` in templates. Use `<i class="mdi mdi-…" aria-hidden="true"></i>` only where
  a component takes an icon class string: sidebar menu items, the `icon` prop of `<empty-container>`, and the `icon-class` prop of `<hf-buttons>`.
- **Style:** use the `-outline` variant by default. Use the filled variant only for a completed or active state,
  for example `mdi-check-circle` on a done checklist item.
- **Sizes:**
  - `x-small` (12px) next to 11–12px text, in pills and in link buttons.
  - `small` (16px) in notices, headers, buttons and table actions. This is the default.
  - Larger only for the 36px header icon tile and large status icons (`32px`).
  - Don't use other sizes.
- **Color:** icons inherit the surrounding text color (`.v-icon { color: inherit }`). Set color only in CSS, with palette or
  status colors from §1: `#2563dc` for the accent, `#8793a5` for muted icons. Never use Vuetify `color="…"` names like `primary`
  or `grey darken-1`. `primary` is Vuetify's default `#1976d2`, not our accent.
- **One icon per meaning:**

  | Meaning | Icon | Meaning | Icon |
  |---|---|---|---|
  | Info | `mdi-information-outline` | Add | `mdi-plus` |
  | Error | `mdi-alert-circle-outline` | Edit | `mdi-pencil-outline` |
  | Warning | `mdi-alert-outline` | Delete | `mdi-trash-can-outline` |
  | Success | `mdi-check-circle-outline` | Refresh / retry | `mdi-refresh` |
  | Done (filled) | `mdi-check-circle` | Download | `mdi-tray-arrow-down` |
  | Pending | `mdi-clock-outline` | Copy | `mdi-content-copy` |
  | Locked | `mdi-lock-outline` | External link | `mdi-open-in-new` |
  | Close | `mdi-close` | Expand / collapse | `mdi-chevron-down` (rotate when open) |
  | Email | `mdi-email-outline` | Organization | `mdi-domain` |

  If you need a new meaning, pick an outline MDI icon and add it to this table.
- **Accessibility:** decorative icons get `aria-hidden="true"`. Icon-only buttons need a label: use the `title` prop of
  `<hf-buttons>`, or `aria-label` on a native button.

## 3b. Text boxes, text areas & selects
Every text box, text area and select looks like the ones in Settings › Billing details. The styles are shared global classes
in `src/assets/css/gblStyle.css`. **Use the classes. Don't restyle fields in a component's scoped CSS.**

```html
<div class="hf-field-grid">
  <label class="hf-field" :class="{ invalid: fieldErrors.name }">
    <span>Legal name</span>
    <input v-model.trim="form.name" class="hf-input" type="text" maxlength="200" autocomplete="organization" />
    <small v-if="fieldErrors.name" class="hf-field-error">{{ fieldErrors.name }}</small>
    <small v-else class="hf-field-help">Printed on your invoices.</small>
  </label>

  <label class="hf-field full">
    <span>Description <span class="hf-optional">(optional)</span></span>
    <textarea v-model.trim="form.description" class="hf-input" rows="3" maxlength="500"></textarea>
  </label>

  <label class="hf-field">
    <span>Country</span>
    <select v-model="form.country" class="hf-input">
      <option value="" disabled>Select a country</option>
      <option v-for="c in countries" :key="c.value" :value="c.value">{{ c.label }}</option>
    </select>
  </label>
</div>
```

- **Controls:** native `<input>`, `<textarea>` and `<select>`, each with `class="hf-input"` (for dropdowns, see §3c). Never use `v-text-field`, `v-textarea`,
  `v-select`, `b-form-input`, `b-form-textarea`, `b-form-select`, `hf-select-drop-down` or Bootstrap `form-control` in new code,
  and don't mix `form-control` with `hf-input`.
- **What the classes give you:**
  - Text box: `38px` high, padding `0 11px`, border `#d5dde7`, radius `6px`, white background, text `#27364a` at `13px`, placeholder `#8793a5`.
  - Text area: the same border and colors, padding `9px 11px`, `min-height: 76px` (3 rows), `line-height: 1.45`, vertical resize only.
    Set the height with `rows`, not CSS.
  - Select: the same as a text box plus a gray chevron. Dropdowns have their own rules in §3c.
  - Focus: border `#2f6fec` and a 2px ring of `rgba(47,111,236,.12)`.
  - Disabled: background `#f8fafc`, text `#667085`, cursor `not-allowed`. Read-only: background `#f8fafc`.
  - Invalid: border `#f04438`, from `.hf-field.invalid` or `.hf-input.is-invalid`.
- **IDs and keys:** add `hf-mono` (`class="hf-input hf-mono"`) for app IDs, record IDs, payment references and similar values.
- **Fixed text before or after the value** (currency symbol, "days", "months"): use `.hf-input-group`. It's the same box, with
  `span.hf-affix` muted text and a bare `<input>` inside:
  `<div class="hf-input-group"><span class="hf-affix">₹</span><input v-model="price" type="number" aria-label="Amount" /></div>`.
  Add `is-invalid` or `is-disabled` on the group for those states. Don't put a currency or unit in the placeholder instead.
- **Field structure:** a `label.hf-field` holds a `span` (the label, `12px` / `600`, `#475467`), the control, then one line below it:
  `small.hf-field-error` (`#b42318`, `11px`) when there's an error, otherwise `small.hf-field-help` (`#8793a5`, `11px`).
  Use `div.hf-field` with a `span.hf-label` when the control is composite, such as `PhoneInput`.
- **Labels:** every control has a visible label. A control in a repeated row (for example header name and value) uses `aria-label` instead.
  The label is sentence case. Don't use uppercase labels, placeholders as labels, or red asterisks.
  When a form mixes required and optional fields, mark the optional ones with `<span class="hf-optional">(optional)</span>`.
- **Layout:** `.hf-field-grid` is two columns with `gap: 14px 16px`. `.hf-field.full` spans both columns, and the grid collapses to
  one column below `650px`. Put long text, URLs, emails and text areas in `full`. Put a single field on its own without a grid.
  Repeated rows (key/value pairs, tax IDs) use a small CSS grid with `gap: 8px` and a ghost `mdi-close` `<hf-buttons size="sm">` to remove a row.
- **Input attributes:** always set `type` (`email`, `url`, `tel`, `number`), `autocomplete`, and `maxlength` to match the server
  limit. Use `inputmode` for numeric or URL keyboards. Use `v-model.trim` for anything except secrets and free text where spaces matter.
- **Validation:** errors live in a `fieldErrors` map keyed by path (`'address.city'`, `'taxIds[0].number'`). Fill it from both client
  checks and the server's `details.fields`. Editing a field clears its error. Show errors on the field, not in a toast.
  Use `<form novalidate @submit.prevent="save">`.
- **Saved data:** show it as a read-only `<dl>` summary (160px `dt` column) with an Edit button.
- **Composite fields:** `PhoneInput` (`components/element/PhoneInput.vue`) for phone numbers. It uses the same box and states.
- **Legacy fields:** Bootstrap `.form-control` / `.custom-select` (and therefore `b-form-input`, `b-form-textarea`, `b-form-select`,
  `hf-select-drop-down`) are restyled globally in `gblStyle.css` to look like `.hf-input`. That's only a bridge for old screens:
  when you touch one, move its fields to `hf-input`. Never add scoped or `::v-deep` overrides of `.form-control` or `.custom-select`.
- **References:** `BillingDetails.vue` (full form, tax-ID rows, `PhoneInput`), `WebhookConfig.vue` (repeated key/value rows),
  `sa/components/CreditRecharge.vue` (`.hf-input-group` with currency and units).

## 3c. Dropdowns
Every dropdown is the same `38px` box as a text box, with a gray chevron on the right. There are two controls. Pick by what the list needs:

| The list… | Use |
|---|---|
| is one choice from a short, fixed or already-loaded list (up to about 15 options) | native `<select class="hf-input">` |
| needs search (long lists: countries, DIDs, schemas once there are many) | `<hf-select>` |
| allows several values | `<hf-select multiple>` |
| loads more options as you scroll (paged API) | `<hf-select :has-more @load-more>` |

**Native select** (`select.hf-input`), the default:
```html
<label class="hf-field">
  <span>Verification method</span>
  <select v-model="form.methodId" class="hf-input hf-mono" :disabled="!form.did">
    <option value="" disabled>{{ form.did ? 'Select a verification method' : 'Select a DID first' }}</option>
    <option v-for="vm in methods" :key="vm.id" :value="vm.id">{{ vm.id }} ({{ vm.type }})</option>
  </select>
</label>
```
- **Look** (from `gblStyle.css`; never restyle it): `38px` high, padding `0 32px 0 11px`, border `#d5dde7`, radius `6px`,
  text `#27364a` at `13px`, chevron `16px` in `#8793a5` at `right 10px`. Vuetify's reset strips the browser arrow from every
  `<select>`, so a select **without** `hf-input` has no arrow at all. Focus, disabled and invalid states are the same as a text box.
- **Placeholder:** the first option is `<option value="" disabled>Select a …</option>`, so it shows until a choice is made and
  can't be picked back. The model starts as `''`, not `null`. Use sentence case: "Select a country", not "-- SELECT --".
- **Dependent dropdowns:** disable the second one until the first has a value, and say why in its placeholder ("Select a DID first").
  Clear the second value when the first changes.
- **IDs as options** (DIDs, verification methods, app IDs): add `hf-mono`.
- Option text is plain text; a native option can't hold icons, flags or two-line content. If you need those, use `<hf-select>`.

**`<hf-select>`** (`components/element/HfSelect.vue`, import it locally): the same box with a search input, a floating list and keyboard
support (arrows, Enter, Escape; Backspace removes the last chip).
```html
<label for="target-countries" class="hf-label">Target countries</label>
<hf-select id="target-countries" multiple v-model="form.countries" :options="countryOptions" placeholder="Search countries">
  <template #option="{ option }"><country-flag :country="option.alpha2" size="small" /> {{ option.text }}</template>
</hf-select>

<hf-select id="widget-config" v-model="configId" :options="configOptions" :loading="loadingConfigs"
  :has-more="hasMoreConfigs" placeholder="Select a verification configuration" @load-more="loadMoreConfigs" />
```
- **Look:**
  - Box: as above. With `multiple`, chips sit inside it and the box grows as they wrap; a clear-all × sits before the chevron.
  - Chip: `26px` high, radius `6px`, background `#f1f5f9`, border `#e1e6ed`, text `#273448` at `12px` / `600`, a gray `x-small` `mdi-close` to remove.
  - List: opens `4px` below the box, radius `8px`, border `#d7e0ea`, white, shadow `0 12px 28px -8px rgba(23,37,84,.18)`, max height `280px`.
  - Option: `34px` min height, padding `6px 10px`, radius `6px`, `13px`. Hover or keyboard focus: background `#f1f5f9`.
    Selected: text `#2563dc` / `600` with a `mdi-check` on the right.
  - Notes ("No matches", "Loading…"): `12px` in `#8793a5`. "Load more": `12px` / `600` in `#2563dc`.
  - The chevron turns upside down while the list is open.
- **API:** `v-model` is one value, or an array with `multiple`. `options` are strings or `{ value, text, … }`; extra fields reach the
  `option` and `chip` slots (flags, codes). A selected value missing from `options` shows its raw value. Other props:
  `placeholder`, `searchable` (default `true`; `false` for short fixed lists), `disabled`, `invalid`, `loading`, `hasMore`,
  `emptyText`, `id` (goes on the search input, so `<label for>` works), `ariaLabel`. Events: `input`, `change`, `blur`, `load-more`.
- **Paging:** pass `has-more` and `loading`, and fetch the next page on `@load-more`. It fires near the end of the list, and a
  "Load more" row is there as a fallback.

**Never use** `v-select`, `v-autocomplete`, `b-form-select`, `hf-select-drop-down`, `vue-multiselect`, a `<select>` without `hf-input`,
scoped select styles, or hand-built chip rows and menus.

**References:** Issuer configuration in `ServiceConfig.vue` (native, dependent, `hf-mono`), `BillingDetails.vue` (native),
Target Countries in `WidgetConfig/Index.vue` (multiple, flags), `DID.vue` (multiple, no search), Verification Configuration in
`KYCWebpageGenerator.vue` (single, paged).

## 4. Data & API Calls
- Put new endpoints in a feature API module (one exported function per endpoint) built on `request()` from
  `src/utils/billingApi.js`, as `src/utils/onboardingApi.js` does.
  - `request()` uses the cookie session and handles the token refresh and logout itself.
  - It throws `BillingError { status, code, messages, details }`. Branch on `error.code` and `error.status`.
  - Send an `Idempotency-Key` header on POSTs that create something, such as orders or invoices.
- Components call these functions directly and keep results in local `data`. Don't add new state or actions to `mainStore.js`.
  For shared cache or invalidation, use a small module like `credit/promotion/promotionState.js`.
- Put shared behavior in a feature mixin (`credit/payCheckoutMixin.js`) or a pure helper (`production/companyReview.js`).
- Use toasts (`notifySuccess`, `notifyErr` from `mixins/utils.js`) only for short confirmations. Show form and load errors inline.

## 5. Don't Copy (legacy patterns)
- Don't use `RequestHandler`, `JWTExpiredErrorMessageHandling`, or a `new Promise` wrapper around `fetch` for new calls.
- Don't read the auth token from `localStorage` or build headers with `getHeader()`.
- Don't import from `'vuex/dist/vuex.common.js'`. Import from `'vuex'`.
- Don't control the UI through `$root.$emit` or `EventBus`. Use props, emits and `v-model`.
- Don't use `v-html` for messages or labels. Render text. Use it only for sanitized markdown.
- Don't use Vuetify components other than `<v-icon>`. Don't use `mdbvue`.
- Don't use Font Awesome, `<b-icon>`, emoji or Vuetify `color=` names for icons (see §3a).
- Don't build fields with `v-text-field`, `v-textarea`, `v-select`, `v-autocomplete`, `vue-multiselect`, `b-form-input`, `b-form-textarea` or `form-control`, and don't restyle fields per component (see §3b).
- Don't use `!important`, inline `style="…"`, unscoped styles (except modal chrome keyed on `modal-class`), or class names copied from other sites.
- Don't use `console.log`, `document.getElementById`, or file-level `/* eslint-disable */`.
- Don't write components over about 600 lines. Split into a container, presentational children and an API module.
