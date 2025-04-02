# Entity Developer Dashboard

A VueJs based dashboard for developers to manage their tenants and API keys				

## Manual

### Install

Node Version:  `14.21.3`

```bash
git clone https://github.com/hypersign-protocol/entity-developer-dashboard #Pull the repo
cd studio/client
yarn
```

### Build & Run

#### Prod

```bash
yarn build
yarn serve
```

#### Dev

```bash
npm run dev
```


Make sure you have `.env` file.


## Testing
### Running Selenium IDE
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
- If the email ID is already in use within the Entity Developer Dashboard, it must not have 2FA enabled. You can verify this by logging into the dashboard before running the tests.
### Running the Tests
- Run the Login test first to ensure proper authentication.
- After successful login, run the DID test.
- Select the test case you wish to run.
- Finally, run the Schema test.
- Check the logs and results for any issues or errors.