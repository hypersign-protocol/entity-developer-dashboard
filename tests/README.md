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
- Use an email account that is **already logged into the dashboard**
  - This avoids entering email and password during test execution  
  - The test will automatically pick the account from the login prompt  
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

## Notes
- If the email ID is already used in the Entity Developer Dashboard, ensure **2FA is disabled**  
- Close the browser **manually after finishing each test case**  
- Tests have been fully validated on:
  - **Brave Browser v1.88.138**
  - **Selenium IDE v3.17.2**
## Demo 
![Demo](../src/assets/seleniumTestDemo.mp4)
  
