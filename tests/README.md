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
      - Visit the official Selenium IDE download page: [Selenium IDE Download]('https://addons.mozilla.org/en-US/firefox/addon/selenium_ide/')
      - Click 'Add to Firefox' to install the extension
 - For brave
      - Go to [chrome web store]('https://chromewebstore.google.com/?pli=1')
      - Search for `Selenium IDE`
      - Select the selenium Extension
      - Click 'Add to Brave'
  #### Test Scenarios
  The following table lists the test scenarios along with their respective test files:
  | Test Scenario | Test File |
|---------|----------|
| Login   | [LoginTest](./E2E%20test/Login.side)   |    
| Login and create a new service   |[CreateApp](./E2E%20test/Login%20and%20createService.side)  |
| Login and invite a member and accept invitation   |[Invite people](./E2E%20test/Login%20and%20settings%20module.side)  |
| Login perform did operations in specific service   | [Perform did operations](./E2E%20test/Login%20and%20did%20operations.side)  |    
| Login and perform schema operations in specific service  |  [Perform schema operations](./E2E%20test/Login%20and%20schema%20operations.side)  |
| Login and perform credential operations in specific service |  [Perform credential operations](./E2E%20test/Login%20and%20credential%20operation.side)  |

#### Steps to Run
##### Running Selenium IDE
Follow these steps to set up and run Selenium IDE with your test files:
**Prerequisites**
 - Ensure you have the latest version of Selenium IDE installed as a browser extension.
 - Update the email ID in the test file before uploading it to Selenium IDE.
     - Open the test file in a text editor and use the Find & Replace feature to replace the existing email ID with your own.

    - Save the changes after updating the email ID.
**Steps to Run Tests**
- Open Selenium IDE in your browser.
- Click on the `Open an existing project` button and upload the test file from the E2E folder inside test folder in this repository.
**Important Note**

If the email ID is already in use within the Entity Developer Dashboard, it must not have 2FA enabled. You can verify this by logging into the dashboard before running the tests.

**Running the Tests**
- After running [Login and Create service]('./E2E test/Login and createService.side') get credit to your service by contacting the admin, and then run other tests.
- Check the log and results for any issues or errors.
- 
[Demo]('../src/assets/test_demo.gif')
  
