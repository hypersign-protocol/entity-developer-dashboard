# Project Guidelines & Architecture (Vue 2 Legacy Repo)

Hypersign entity developer dashboard. Vue 2.6 single-page app, built with Vue CLI 5 (webpack 5).

## 1. Tech Stack & Commands
- **Framework:** Vue 2.6 (Options API), vue-router 3, Vuex 3. The UI uses Bootstrap-Vue 2.23 and Vuetify 2.7 together
  (a legacy mix; new UI only uses Vuetify's `<v-icon>`). Icons are Material Design Icons.
- **Node:** 20 (the Dockerfile uses `node:20.19`). There's no `.nvmrc`.
- **Package manager:** **yarn** (`yarn.lock`). Never run `npm install`; it creates a `package-lock.json`.
- **Commands:**
  - Dev server against staging: `yarn dev` (port 9001). `yarn serve` runs against **production** APIs. Avoid it.
  - Lint the files you changed: `npx vue-cli-service lint --no-fix <files>`. Plain `yarn lint` **auto-fixes the whole repo**. Don't run it.
  - Unit tests: `yarn test:unit` (mocha, specs in `tests/unit/`). `yarn test` is the Selenium end-to-end suite. Don't run it.
  - Build: `yarn build` (or `yarn build-stage`). The `prebuild` step downloads the KYC catalog from GitHub when
    `src/catalogs/catalog.kyc.json` isn't cached. Don't build just to check a change. Lint and run unit tests instead.
- **Environment:** `.env*` files are gitignored. `env.sample` lists the keys. Never commit env files or secrets.

## 2. Hard Architectural Rules (Do NOT Drift)
- **Vue 2 Options API only:** `data`, `props`, `computed`, `watch`, `methods`. No `<script setup>`, `defineProps`,
  or Composition API (`@vue/composition-api` isn't installed). No TypeScript.
- **API calls:** put new endpoints in a feature API module (one exported function per endpoint) built on `request()` from
  `src/utils/billingApi.js`, as `src/utils/onboardingApi.js` does.
  - `request()` uses the cookie session, refreshes the token once, then logs out.
  - It throws `BillingError { status, code, messages, details }`. Branch on `code` and `status`.
  - Billing and onboarding endpoints are specified in `docs/adr/api-contract.md`. Cite the section in a comment, as `billingApi.js` does.
  - Don't use `RequestHandler` or raw `fetch` for new calls.
- **State management:** keep feature state in the component's `data`. Don't add new state or actions to `src/store/mainStore.js`.
  - For a shared cache, use a small module like `src/components/credit/promotion/promotionState.js`.
  - Import Vuex helpers from `'vuex'`, never from `'vuex/dist/vuex.common.js'`.
- **Component communication:** use props, emits and `v-model`. Don't use `$root.$emit` or `EventBus` for UI control.
  The only exceptions are Bootstrap-Vue's own `bv::show::modal` and `bv::hide::modal`.
- **Permissions:** hide actions the user can't perform with `this.$can(service, access)` (`src/utils/permissions.js`).
  The backend still enforces every one.
- **Size:** keep components under about 600 lines. Split them into a container, presentational children and an API module.
- **Security guardrails:**
  - Never use `v-html` for dynamic user or error messages. It's an XSS risk, and legacy examples exist in `Apps.vue`,
    `ServiceConfig.vue`, `OnlySSIApps.vue` and `Sessions.vue`. Only use it for sanitized markdown.
  - Never hardcode credentials or tokens in source files or stores.
  - Don't add new auth-token handling in `localStorage` or `getHeader()` Bearer headers. The session is the cookie.
  - Don't persist new Vuex state without passing explicit `paths` to `createPersistedState`.

## 3. UI & Design System
For any UI work (components, pages, modals, forms, tables, styles), follow
**`.claude/skills/vue2-ui-design-system/SKILL.md`**. It holds the palette, type scale, spacing and component rules.
Add new UI conventions there, not here.

Reuse the globally registered components (`src/main.js`): `<hf-buttons>` for every button, `<hf-pop-up>` for every modal,
`<empty-container>` for empty states, and `<load-ing>` / `<wait-spinner>` for loading states.

## 4. Golden Reference Modules
Copy patterns from these. Don't copy the legacy views under `src/views/playground/` or `src/views/Apps.vue`.
- **Page layout & tabs:** `src/views/SettingConfig.vue`
- **Forms, read-only summary, notices:** `src/components/settings/BillingDetails.vue` (its local gray buttons are an exception, so use `<hf-buttons>`)
- **Modals:** `src/components/element/hfPopup.vue`
- **Cards, checklists, badges:** `src/components/production/GoLivePanel.vue`
- **API module:** `src/utils/billingApi.js`
- **Feature mixin / pure helpers:** `src/components/credit/payCheckoutMixin.js`, `src/components/production/companyReview.js`

## 5. Git & PR Workflow
- Work on `develop` or a feature branch. PRs target `master`.
- The CI "PR hygiene" check (`.github/workflows/pr-hygiene.yaml`) fails unless:
  - `Changelog.md` is updated for any change outside `docs/` and `*.md`. New entries go under the version heading at the top,
    in `### Added` / `### Changed` / `### Fixed`, written as plain user-facing sentences.
  - the `version` in `package.json` is bumped whenever `package.json` changes.
  - The `hygiene-skip` label skips both checks.
- Only commit or push when asked.
