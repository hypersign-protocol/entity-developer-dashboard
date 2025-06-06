### Selenium Browser Extension - UI Testing

#### Introduction
Selenium is a widely-used open-source framework for automating web applications. It allows developers and testers to simulate user interactions with a web application in a real browser environment. Selenium supports various programming languages and browser drivers, making it an ideal choice for end-to-end (E2E) testing.

##### Why use Selenium Browser Extension for UI Testing?
 The Selenium Browser Extension (also known as Selenium IDE) is a powerful tool that enables recording, editing, and debugging of tests. It is particularly useful for quick test creation and playback, without needing to write complex scripts manually. This tool is preferred because:
 - It is easy to install and use as a browser extension.

 - Supports rapid test case creation via recording.
 - Allows exporting test cases in various formats for automation.
 - Ideal for testing Vue 2 projects where quick UI testing and interaction simulation are required.

#### Installation
 For the best compatibility, use Selenium IDE version 3.17.4.
 Follow these steps to install Selenium IDE:
  - For Firefox
      - Visit the official Selenium IDE download page: [Selenium IDE Download](https://addons.mozilla.org/en-US/firefox/addon/selenium_ide/)
      - Click 'Add to Firefox' to install the extension
 - For brave
      - Go to [chrome web store]('https://chromewebstore.google.com/?pli=1')
      - Search for `Selenium IDE`
      - Select the selenium Extension
      - Click 'Add to Brave'
  #### Test Scenarios
  The following table lists the test scenarios along with their respective test files:
 |Module | Scenario |  File |
|---------|---------|----------|
| Service | Login   | [LoginTest](./E2E_test/serviceModule/Login.side)   |   
| Service | Login and invite a member and accept invitation   |[Invite people](./E2E_test//serviceModule//LoginAndSettingsModule.side)  | 
|SSI Service |Login and create a new service   |[CreateSSIApp](./E2E_test/ssiServiceModule/loginAndCreateSSIService.side)  |
|SSI Service | Login and perform did operations in specific service   | [Perform did operations](./E2E_test/ssiServiceModule/loginAndDidOperations.side)  |    
|SSI Service | Login and perform schema operations in specific service  |  [Perform schema operations](./E2E_test/ssiServiceModule/loginAndSchemaOperations.side)  |
|SSI Service | Login and perform credential operations in specific service |  [Perform credential operations](./E2E_test/ssiServiceModule/loginAndCredentialOperation.side)  |
|KYC Service | Login and create kyc service   | [Create Kyc service](./E2E_test/kycServiceModule//loginAndCreateKycService.side)  |    
|KYC Service | Login and configure onchain kyc  |  [Configure onchain kyc](./E2E_test/kycServiceModule/loginAndConfigureOnchainKyc.side)  |
|KYC Service | Login and configure widget |  [Add widget configuration](./E2E_test/kycServiceModule/loginAndWidgetConfiguration.side)  |
|KYC Service | Login and perform webhook configuration |  [Add webhook configuration](./E2E_test/kycServiceModule/loginAndWebhookConfiguration.side)  |

#### Steps to Run
##### Running Selenium IDE
Follow these steps to set up and run Selenium IDE with your test files:
**Prerequisites**
 - Ensure you have the latest version of Selenium IDE installed as a browser extension.
 - Update the email ID in the test file before uploading it to Selenium IDE.
     - Open the test file in a text editor and use the Find & Replace feature to replace the  `"target": "seleniumtest963@gmail.com"` with your own email ID.
    - Save the changes after updating the email ID.
 - You can also change the value after uploading to Selenium IDE by replacing the `adminEmailId` value with your own email ID.
 - If you want to run the Login and Settings module, you must have an additional email to add as a teammate. To do this, replace "target": "seleniumide609@gmail.com" with your teammate's email ID directly in the test file, or update the value of teamMateEmailId after uploading it to Selenium IDE.
 - In order to run the KYC module test cases, you must first create an SSI service.
Please run [Create SSI Service Test](./E2E_test/ssiServiceModule/loginAndCreateSSIService.side) and [Perform DID Operations](./E2E_test/ssiServiceModule/loginAndDidOperations.side) before proceeding.

**Steps to Run Tests**

- Open Selenium IDE in your browser.
- Click on the `Open an existing project` button and upload the test file from the E2E folder inside test folder in this repository.

> **NOTES**:
> - If the email ID is already in use within the Entity Developer Dashboard, it must not have 2FA enabled. You can verify this by logging into the dashboard before running the tests.
> - After running [LoginAndCreateSSIService](./E2E_test/ssiServiceModule/LoginAndCreateSSIService.side) request credits to your service by contacting the admin, and then run other tests.
  
## Demo 

![Demo](../src/assets/test_demo.gif)
  
