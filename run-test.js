const readlineSync = require("readline-sync");
const { exec } = require("child_process");

const tests = [
    "tests/E2E_test/serviceConfigModule/loginAndFillOnboarding.side",
    "tests/E2E_test/serviceConfigModule/loginAndApproveOnboarding.side",
    "tests/E2E_test/serviceConfigModule/loginAndGenerateApiKey.side",
    "tests/E2E_test/serviceConfigModule/loginAndUpdateAppConfig.side",
    "tests/E2E_test/kycServiceModule/loginAndVisitAnalytics.side",
    "tests/E2E_test/kycServiceModule/loginAndVisitBusinessDashboard.side",
    "tests/E2E_test/kycServiceModule/loginAndVisitIdDashboard.side",
    "tests/E2E_test/kycServiceModule/loginAndWebhookConfiguration.side",
    "tests/E2E_test/kycServiceModule/verifier/loginAndDeleteIdVerifier.side",
    "tests/E2E_test/kycServiceModule/verifier/loginAndUpdateIdVerifier.side",
    "tests/E2E_test/kycServiceModule/widget/loginAndUpdateIdWidget.side",
    "tests/E2E_test/kycServiceModule/widget/loginAndConfigureKybWidget.side",
];

function getInputs() {
    const baseUrl = readlineSync.question("Enter Base URL (optional): ") || "https://entity.dashboard.hypersign.id";
    const adminEmail = readlineSync.question("Enter Admin Email (optional): ") || "seleniumide609@gmail.com";
    const onboardingId = readlineSync.question("Enter Onboarding ID (optional): ") || "123456789";
    const superAdminEmailId = readlineSync.question("Enter Super Admin Email ID for approve onboarding (optional): ") || '609varsha@gmail.com'
    const browserIndex = readlineSync.keyInSelect(
        ["chrome", "firefox", "edge", "brave"],
        "Select browser:"
    );

    const browser = ["chrome", "firefox", "edge", "brave"][browserIndex] || "chrome";
    const debugModeInput = readlineSync.question("Enable debug mode? (y/n) [n]: ").toLowerCase().trim();
    const debugMode = debugModeInput === 'y' || debugModeInput === 'yes';

    const takeScreenshotsInput = readlineSync.question("Take error screenshots? (y/n) [n]: ").toLowerCase().trim();
    const takeScreenshots = takeScreenshotsInput === 'y' || takeScreenshotsInput === 'yes';

    return {
        baseUrl,
        adminEmail,
        onboardingId,
        superAdminEmailId,
        browser,
        debugMode,
        takeScreenshots,
    };
}

function buildConfig(vars, browser) {
    const config = [];

    if (browser === "firefox") {
        config.push(`browserName=firefox`);
        config.push(`moz:firefoxOptions.args=[-profile,C:\\selenium-profile,-headless]`);
    } else {
        config.push(`browserName=${browser}`);
        config.push(`goog:chromeOptions.args=[headless,--window-size=1920,1080,--user-data-dir=C:\\selenium-profile,--disable-gpu,--no-sandbox]`);
    }

    if (vars.adminEmail) config.push(`vars.ADMIN_EMAIL=${vars.adminEmail}`);
    if (vars.onboardingId) config.push(`vars.ONBOARDING_ID=${vars.onboardingId}`);
    if (vars.superAdminEmailId) config.push(`vars.SUPER_ADMIN_EMAIL_ID=${vars.superAdminEmailId}`);
    return config.join(" ");
}

function runTest(file, config, baseUrl, options) {
    return new Promise((resolve) => {
        console.log("🚀 Running:", file);

        const baseUrlFlag = baseUrl ? `--base-url "${baseUrl}"` : "";
        const debugFlag = options.debugMode ? "--debug" : "";
        const screenshotFlag = options.takeScreenshots ? "-z ./error-screenshots" : "";

        const cmd = `selenium-side-runner ${screenshotFlag} ${debugFlag} "${file}" ${baseUrlFlag} -c "${config}"`.trim();

        const child = exec(cmd);

        child.stdout.on("data", (data) => console.log(data.toString()));
        child.stderr.on("data", (data) => console.error(data.toString()));

        child.on("exit", (code) => {
            console.log("✅ Finished:", file, "code:", code);
            resolve();
        });
    });
}

async function run() {
    const inputs = getInputs(); // 👈 sync now
    const config = buildConfig(inputs, inputs.browser);

    console.log("\n⚙️ Final Config:", config, "\n");

    for (const file of tests) {
        await runTest(file, config, inputs.baseUrl, inputs);
    }
}

run();
