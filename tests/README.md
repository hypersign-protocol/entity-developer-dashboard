# Selenium Browser Extension - UI Testing

## Introduction
Selenium is a widely-used open-source framework for automating web applications. It allows developers and testers to simulate user interactions in a real browser environment. Selenium supports multiple programming languages and browser drivers, making it ideal for end-to-end (E2E) testing.

## Why use Selenium Browser Extension for UI Testing?
The Selenium Browser Extension (Selenium IDE) is a powerful tool for recording, editing, and debugging tests. It is especially useful for quickly creating and running UI tests without writing complex scripts.

**Key benefits:**
- Easy to install and use as a browser extension  
- Supports rapid test case creation via recording  
- Allows exporting test cases in multiple formats  
- Ideal for quick UI testing and interaction simulation (especially for Vue 2 projects)

---

## Installation
For best compatibility, use **Selenium IDE version 3.17.2**

### For Firefox
- Visit: https://addons.mozilla.org/en-US/firefox/addon/selenium_ide/  
- Click **Add to Firefox**

### For Brave (Recommended)
- Go to: https://chromewebstore.google.com/  
- Search for **Selenium IDE**  
- Select the extension and click **Add to Brave**

---

## Test Scenarios

| Module | Scenario | File |
|--------|---------|------|
| Service | Login | [LoginTest](./E2E_test/login/login.side) |
| Service | Login and setup MFA | [Setup MFA](./E2E_test/login/setupAndLoginWithMfa.side) |
| Service | Login and invite a member and accept invitation | [Invite people](./E2E_test/serviceConfigModule/loginAndSetting.side) |
| Service | Login and fill onboarding form | [Fill onboarding form](./E2E_test/serviceConfigModule/loginAndFillOnboarding.side) |
| Service | Login and approve onboarding by Super-admin | [Approve onboarding](./E2E_test/serviceConfigModule/loginAndApproveOnboarding.side) |
| Service | Login and re-generate API key | [Regenerate API key](./E2E_test/serviceConfigModule/loginAndGenerateApiKey.side) |
| Service | Login and update app | [Update app configuration](./E2E_test/serviceConfigModule/loginAndUpdateAppConfig.side) |
| SSI Service | Perform DID operations | [Perform DID operations](./E2E_test/ssiServiceModule/loginAndDidOperations.side) |
| SSI Service | Perform schema operations | [Perform schema operations](./E2E_test/ssiServiceModule/loginAndSchemaOperations.side) |
| SSI Service | Perform credential operations | [Perform credential operations](./E2E_test/ssiServiceModule/loginAndCredentialOperation.side) |
| KYC Service | Configure ID verifier page | [Configure Verifier page](./E2E_test/kycServiceModule/verifier/loginAndDeleteIdVerifier.side) |
| KYC Service | Update ID verifier page | [Update ID Verifier page](./E2E_test/kycServiceModule/verifier/loginAndUpdateIdVerifier.side) |
| KYC Service | Configure ID widget | [Add ID widget configuration](./E2E_test/kycServiceModule/widget/loginAndUpdateIdWidget.side) |
| KYC Service | Configure KYB widget | [Add business widget configuration](./E2E_test/kycServiceModule/widget/loginAndConfigureKybWidget.side) |
| KYC Service | Configure webhook | [Add webhook configuration](./E2E_test/kycServiceModule/loginAndWebhookConfiguration.side) |
| KYC Service | Visit analytics | [Visit analytics](./E2E_test/kycServiceModule/loginAndVisitAnalytics.side) |
| KYC Service | Visit ID dashboard | [Visit ID dashboard](./E2E_test/kycServiceModule/loginAndVisitIdDashboard.side) |
| KYC Service | Visit business dashboard | [Visit business dashboard](./E2E_test/kycServiceModule/loginAndVisitBusinessDashboard.side) |

---

## Steps to Run

### Running Selenium IDE

#### Prerequisites
- Ensure Selenium IDE (v3.17.2) is installed  
- **Use Brave Browser (recommended)** for 100% test compatibility  
  - Some features may not work properly in Firefox due to browser security restrictions  
- Enable **pop-ups** in the browser  
- Disable **Brave Shields (security protections)** for the site    
- Update email IDs in test files if needed:
  - Replace `"target": "seleniumtest609@gmail.com"` with your email  
  - Replace teammate email (`teamMateEmailId`) if running invite tests  

- For running certain flows:
  - To test **team invitation**, you need an additional email
  - To test **Approve onboarding** you must have super admin emailId and its access.  
---

### Steps to Run Tests
- Open Selenium IDE in your browser  
- Click **"Open an existing project"**  
- Upload the required `.side` file from the `E2E_test` folder  
- Run the test  

---

## Running from CLI with Selenium Side Runner
Selenium Side Runner is included as a dev dependency, so no global install is needed.

### Prerequisites
Before running CLI tests, ensure:
- Run `npm install` to install dependencies.
- The developer dashboard UI is built and running via `npm run serve` from the project root.
- These backend services are running:

  - `entity-develop-dashboard-service`
  - `db`
  - `vault`
  - `redis`
  - `entity-ssi-api-service`
  - `Id service`
  - `authserver`
- Cookie injection is set up for parallel tests ([see below](#cookie-injection-for-parallel-tests)).
- Browser drivers are required and installation instructions are [below](#browser-driver-installation).

#### Browser Driver Installation
Install drivers for your preferred browser. Supported: Chrome, Brave, Firefox, Edge.

**Windows:**
1. Download drivers manually if no package manager:
   - ChromeDriver: [Download](https://sites.google.com/chromium.org/driver/) (choose latest stable, `chromedriver_win32.zip`)
   - GeckoDriver (Firefox): [Download](https://github.com/mozilla/geckodriver/releases) (`geckodriver-vX.Y.Z-win64.zip`)
   - EdgeDriver: [Download](https://developer.microsoft.com/microsoft-edge/tools/webdriver/) (`edgedriver_win64.zip`)
2. Extract to a folder, e.g., `C:\selenium-drivers\`.
3. Add to PATH:
   - Temporarily: `$env:Path += ";C:\selenium-drivers"`
   - Permanently: `setx PATH "%PATH%;C:\selenium-drivers"`
4. Verify: Run `chromedriver --version`, etc.

**Linux:**
1. Use package manager:
   - Debian/Ubuntu: `sudo apt update && sudo apt install chromium-chromedriver firefox-geckodriver msedge-webdriver`
   - Fedora/RHEL/CentOS: `sudo dnf install chromedriver geckodriver`
   - Arch: `sudo pacman -S chromedriver geckodriver`
2. Or download manually:
   - ChromeDriver: [Download](https://sites.google.com/chromium.org/driver/) (`chromedriver_linux64.zip`)
   - GeckoDriver: [Download](https://github.com/mozilla/geckodriver/releases) (`geckodriver-vX.Y.Z-linux64.tar.gz`)
   - EdgeDriver: [Download](https://developer.microsoft.com/microsoft-edge/tools/webdriver/) (`edgedriver_linux64.zip`)
3. Extract and move to `/usr/local/bin/`, e.g., `sudo mv chromedriver /usr/local/bin/`.
4. Make executable: `sudo chmod +x /usr/local/bin/chromedriver`.
5. Verify: Run `chromedriver --version`, etc.

#### Cookie Injection for Parallel Tests
For parallel execution, store auth tokens in `cookies.json` to avoid manual logins.

1. Log in to the dashboard with each account in a browser.
2. In devtools, capture `accessToken` and `refreshToken` from cookies/network.
3. Update root `cookies.json` like this:

```json
{
  "admin": {
    "accessToken": "<admin-access-token>",
    "refreshToken": "<admin-refresh-token>",
    "isLoggedIn": "true"
  },
  "superAdmin": {
    "accessToken": "<superadmin-access-token>",
    "refreshToken": "<superadmin-refresh-token>",
    "isLoggedIn": "true"
  }
}
```

4. Save `cookies.json` before running tests.
### ▶️ Run Test

Run from project root:

```bash
npm run test
```

---
### 🔁 Test Execution Flow (Important)

You will be prompted:

```
1) Fill Onboarding
2) Approve Onboarding
3) Run Others
```

---

### ✅ Recommended Order

1. Fill Onboarding
2. Approve Onboarding
3. Run Others

---
### ▶️ Step-by-step

#### 1. Fill Onboarding

* Select **Fill Onboarding**
* Creates onboarding request
* Copy onboarding ID from:

  * URL (preferred)
  * or UI

---

#### 2. Approve Onboarding

Run again:

```bash
npm run test
```

* Select **Approve Onboarding**
* Enter onboarding ID when prompted

---

### ⚠️ Dev Environment Limitation

#### ❗ Approve Onboarding may fail on first attempt

##### Reason

- During approval, an **SSI service is created**
- This service has **no funds initially**
- Due to this, approval fails

---

#### 3. Run Remaining Tests

```bash
npm run test
```

* Select **Run Others**

---

### 📊 Test Results

After execution:

```
📊 Test Summary:

Passed / Failed
```
### Supported Browsers
- Chrome
- Brave (recommended)
- Firefox
- Edge

### Running Tests
From repo root: `npm run test`

---


## Demo
![Demo](../src/assets/seleniumTestDemo.mp4)
  
