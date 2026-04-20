# Selenium IDE & Side Runner — UI Testing Guide

## Introduction

**Selenium** is a widely used open-source framework for automating web applications. It enables testers and developers to simulate real user interactions in a browser for reliable end-to-end (E2E) testing.

This project supports two ways of running UI tests:

1. **Selenium IDE (Browser Extension)** — quick, visual test runs
2. **Selenium Side Runner (CLI)** — automation, CI, Linux, headless runs

---

## Why Selenium IDE?

Selenium IDE is ideal for fast UI testing without writing complex scripts.

**Benefits**

* Record and replay tests easily
* Simple debugging
* No coding required
* Very useful for Vue 2 UI interaction testing

> ✅ Recommended IDE version: **3.17.2**

---

## ⚠️ Very Important — Pre-Test Requirement for Dashboards

Before running any test related to:

* **ID Dashboard**
* **Business Dashboard**

You **must first complete**:

1. **ID Verification**
2. **Business Verification**

### What happens if you skip this?

If verification is **not** completed:

* Dashboards appear empty
* Tests validate the **empty state**
* Assertions like **“No user found”** pass
* The test exits without actually validating real dashboard data

### Reason

When verification is not done, the application legitimately shows an empty dashboard with no user records.
Selenium correctly detects this state and validates **“no user found”**, then returns successfully.

This creates a **false impression that the dashboard test passed**, while in reality, no real user data was tested.

> ❗ This is **not** a Selenium issue. The application simply has no verification data to display.

### ✅ Correct Order

Always follow this order:

1. Login
2. Perform **ID Verification**
3. Perform **Business Verification**
4. Run dashboard tests

This applies to **both IDE and Side Runner**.

---

## Installation (Selenium IDE)

### Firefox

Install Selenium IDE from Mozilla Add-ons.

### Brave (Recommended)

Install Selenium IDE from Chrome Web Store in Brave.

> Disable **Brave Shields** and allow **pop-ups** for the site.

---

## Test Scenarios

| Module  | Scenario                 | File                                                               |
| ------- | ------------------------ | ------------------------------------------------------------------ |
| Service | Login                    | `E2E_test/login/login.side`                                        |
| Service | Setup MFA                | `E2E_test/login/setupAndLoginWithMfa.side`                         |
| Service | Invite member            | `E2E_test/serviceConfigModule/loginAndSetting.side`                |
| Service | Fill onboarding          | `E2E_test/serviceConfigModule/loginAndFillOnboarding.side`         |
| Service | Approve onboarding       | `E2E_test/serviceConfigModule/loginAndApproveOnboarding.side`      |
| Service | Regenerate API key       | `E2E_test/serviceConfigModule/loginAndGenerateApiKey.side`         |
| Service | Update app               | `E2E_test/serviceConfigModule/loginAndUpdateAppConfig.side`        |
| SSI     | DID operations           | `E2E_test/ssiServiceModule/loginAndDidOperations.side`             |
| SSI     | Schema operations        | `E2E_test/ssiServiceModule/loginAndSchemaOperations.side`          |
| SSI     | Credential operations    | `E2E_test/ssiServiceModule/loginAndCredentialOperation.side`       |
| KYC     | Configure ID verifier    | `E2E_test/kycServiceModule/verifier/loginAndDeleteIdVerifier.side` |
| KYC     | Update ID verifier       | `E2E_test/kycServiceModule/verifier/loginAndUpdateIdVerifier.side` |
| KYC     | Configure ID widget      | `E2E_test/kycServiceModule/widget/loginAndUpdateIdWidget.side`     |
| KYC     | Configure KYB widget     | `E2E_test/kycServiceModule/widget/loginAndConfigureKybWidget.side` |
| KYC     | Configure webhook        | `E2E_test/kycServiceModule/loginAndWebhookConfiguration.side`      |
| KYC     | Visit analytics          | `E2E_test/kycServiceModule/loginAndVisitAnalytics.side`            |
| KYC     | Visit ID dashboard       | `E2E_test/kycServiceModule/loginAndVisitIdDashboard.side`          |
| KYC     | Visit business dashboard | `E2E_test/kycServiceModule/loginAndVisitBusinessDashboard.side`    |

---

# Running Tests with Selenium IDE

## Prerequisites

* Selenium IDE v3.17.2
* Use **Brave browser**
* Disable shields and allow popups
* Update email IDs inside tests:

  * `seleniumtest609@gmail.com`
  * `teamMateEmailId`
* Super admin email required for onboarding approval tests

## Steps

1. Open Selenium IDE
2. Open existing project
3. Load required `.side` file
4. Run

> ⚠️ Before dashboard tests, manually run ID & Business verification tests.

---

# Running Tests with Selenium Side Runner (CLI / Linux / CI)

Side Runner is included as a dev dependency. No global install needed.

## Prerequisites

* Run `npm install`
* UI running with `npm run serve`
* Required services running:

  * dashboard service
  * db
  * vault
  * redis
  * ssi api
  * id service
  * auth server
  * Kyc-Widget
  * vrifier ui
* Browser drivers installed
* Cookie injection configured

---

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

---

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

4. Save `cookies.json` before running tests.

## Running Tests

From the project root:

```bash
npm run test
```

You will be prompted:

```
1) Fill Onboarding
2) Approve Onboarding
3) Run Others
```

---

## ✅ Correct Execution Order

### Step 1 — Fill Onboarding

Creates onboarding request. Copy onboarding ID from the URL.

### Step 2 — Approve Onboarding

Run again and provide onboarding ID.

### ⚠️ Dev Limitation

First approval may fail because the SSI service has no funds initially.

### Step 3 — Run Others

Runs remaining tests including dashboards.

> At this stage, ID & Business verification should already be completed.

---

## Supported Browsers

* Brave (recommended)
* Chrome
* Firefox
* Edge

---

## Test Results

After completion:

```
Test Summary: Passed / Failed
```

---

## Demo

`src/assets/seleniumTestDemo.mp4`
