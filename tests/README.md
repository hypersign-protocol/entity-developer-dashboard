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
Selenium Side Runner is already included in this project as a dev dependency, so there is no need to install it globally.

### Prerequisites
- Run `npm install` once to install dev dependencies, including `selenium-side-runner`
- Install browser drivers as needed:
  - Chrome: `chromedriver`
  - Firefox: `geckodriver`
  - Edge: `msedgedriver`
- Create two browser profiles:
  - `selenium-profile` for normal admin use
  - `selenium-profile-superadmin` for approve-onboarding flow
- Open the dashboard URL in each profile and log in with the appropriate account
  - `selenium-profile`: normal admin email
  - `selenium-profile-superadmin`: super admin email

> Each profile must already have an authenticated session before running the CLI tests.

### Windows profile setup
From PowerShell, create and launch a browser profile with a custom user data directory:

- Chrome:
  - `& "C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="C:\selenium-profile"`
- Brave:
  - `& "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" --user-data-dir="C:\selenium-profile"`
- Firefox:
  - `& "C:\Program Files\Mozilla Firefox\firefox.exe" -profile "C:\selenium-profile"`
- Edge:
  - `& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --user-data-dir="C:\selenium-profile"`

After the browser opens, navigate to the dashboard URL and sign in with your email.

#### Super admin Windows profile setup
Use the same browser binary but a different profile directory:
- Chrome:
  - `& "C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="C:\selenium-profile-superadmin"`
- Brave:
  - `& "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" --user-data-dir="C:\selenium-profile-superadmin"`
- Firefox:
  - `& "C:\Program Files\Mozilla Firefox\firefox.exe" -profile "C:\selenium-profile-superadmin"`
- Edge:
  - `& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --user-data-dir="C:\selenium-profile-superadmin"`

After the browser opens, log in with the super admin email and close the browser before running `loginAndApproveOnboarding.side`.

### Linux profile setup
Use the browser binary from your distribution and set a profile directory under `~/selenium-profile`:

- Chrome / Chromium:
  - `google-chrome --user-data-dir="$HOME/selenium-profile"`
  - `chromium-browser --user-data-dir="$HOME/selenium-profile"`
- Brave:
  - `brave-browser --user-data-dir="$HOME/selenium-profile"`
- Firefox:
  - `firefox -profile "$HOME/selenium-profile"`
- Edge:
  - `microsoft-edge --user-data-dir="$HOME/selenium-profile"`

Open the dashboard URL in that profile and log in before running tests.
- Close the browser after logging in so the profile can be reused during CLI test execution.

#### Super admin Linux profile setup
Use the same browser binary but a different profile directory:
- Chrome / Chromium:
  - `google-chrome --user-data-dir="$HOME/selenium-profile-superadmin"`
  - `chromium-browser --user-data-dir="$HOME/selenium-profile-superadmin"`
- Brave:
  - `brave-browser --user-data-dir="$HOME/selenium-profile-superadmin"`
- Firefox:
  - `firefox -profile "$HOME/selenium-profile-superadmin"`
- Edge:
  - `microsoft-edge --user-data-dir="$HOME/selenium-profile-superadmin"`

Open the dashboard URL in that profile and log in with the super admin email before running `loginAndApproveOnboarding.side`.
- Close the browser after logging in so the profile can be reused during CLI test execution.

### Browser driver installation
#### Windows
1. If you cannot use a package manager, download the driver manually:
   - ChromeDriver: `https://sites.google.com/chromium.org/driver/`
     - Choose the latest stable release and download the `chromedriver_win32.zip` file.
   - GeckoDriver: `https://github.com/mozilla/geckodriver/releases`
     - Download `geckodriver-vX.Y.Z-win64.zip` for 64-bit Windows.
   - EdgeDriver: `https://developer.microsoft.com/microsoft-edge/tools/webdriver/`
     - Download the matching `edgedriver_win64.zip` file.
2. Extract the downloaded ZIP file to a folder, for example:
   - `C:\selenium-drivers\`
3. Add the driver folder to your PATH:
   - In PowerShell (current session):
     - `$env:Path += ";C:\selenium-drivers"`
   - Permanently:
     - `setx PATH "%PATH%;C:\selenium-drivers"`
4. Verify the driver is available:
   - `chromedriver --version`
   - `geckodriver --version`
   - `msedgedriver --version`

#### Linux
1. Install the driver using your package manager:
   - Debian/Ubuntu:
     - `sudo apt update`
     - `sudo apt install chromium-chromedriver`
     - `sudo apt install firefox-geckodriver`
     - `sudo apt install msedge-webdriver` (if available)
   - Fedora/RHEL/CentOS:
     - `sudo dnf install chromedriver geckodriver`
   - Arch Linux:
     - `sudo pacman -S chromedriver geckodriver`
2. If package manager installation is not available, download manually:
   - ChromeDriver: `https://sites.google.com/chromium.org/driver/`
     - Download the `chromedriver_linux64.zip` file.
   - GeckoDriver: `https://github.com/mozilla/geckodriver/releases`
     - Download `geckodriver-vX.Y.Z-linux64.tar.gz`.
   - EdgeDriver: `https://developer.microsoft.com/microsoft-edge/tools/webdriver/`
     - Download `edgedriver_linux64.zip` if available.
3. Extract and move the driver binary to a folder in your PATH, for example:
   - `sudo mv chromedriver /usr/local/bin/`
   - `sudo mv geckodriver /usr/local/bin/`
   - `sudo mv msedgedriver /usr/local/bin/`
4. Make sure the binary is executable:
   - `sudo chmod +x /usr/local/bin/chromedriver`
   - `sudo chmod +x /usr/local/bin/geckodriver`
   - `sudo chmod +x /usr/local/bin/msedgedriver`
5. Verify the driver is available:
   - `chromedriver --version`
   - `geckodriver --version`
   - `msedgedriver --version`

### Supported browsers
- Chrome
- Brave
- Mozilla Firefox
- Microsoft Edge

### Running the test
From the repository root, run:

- `npm run test`

---

## Notes
- If the email ID is already used in the Entity Developer Dashboard, ensure **2FA is disabled** for testign in ide.
- Close the browser **manually after finishing each test case**  
- Tests have been fully validated on:
  - **Brave Browser v1.88.138**
  - **Selenium IDE v3.17.2**
## Demo 
![Demo](../src/assets/seleniumTestDemo.mp4)
  
