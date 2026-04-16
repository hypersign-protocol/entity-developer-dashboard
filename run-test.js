const readlineSync = require("readline-sync");
const { exec } = require("child_process");
const path = require("path");
const os = require("os");
const fs = require('fs');

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
        superAdminEmailId,
        browser,
        debugMode,
        takeScreenshots,
    };
}

function buildConfig(vars, browser, profilePath) {
    const config = [];

    if (browser === "firefox") {
        config.push(`browserName=firefox`);
        config.push(`moz:firefoxOptions.args=[-profile,${profilePath},-headless]`);
    } else {
        config.push(`browserName=${browser}`);
        config.push(`goog:chromeOptions.args=[headless,--window-size=1920,1080,--user-data-dir=${profilePath},--disable-gpu,--no-sandbox]`);
    }
    return config.join(" ");
}

function runTest(file, config, baseUrl, options) {
    let sideContent = fs.readFileSync(file, 'utf8');
    sideContent = sideContent.replace(
        /"target": "seleniumide609@gmail.com"/g,
        `"target": "${options.adminEmail}"`
    );
    sideContent = sideContent.replace(
        /"target": "609varsha@gmail.com"/g,
        `"target": "${options.superAdminEmailId}"`
    );
    const tempFile = path.join(os.tmpdir(), `temp_${path.basename(file)}`);
    fs.writeFileSync(tempFile, sideContent);
    return new Promise((resolve) => {
        console.log("🚀 Running:", file);
        const baseUrlFlag = baseUrl ? `--base-url "${baseUrl}"` : "";
        const debugFlag = options.debugMode ? "--debug" : "";
        const screenshotFlag = options.takeScreenshots ? "-z ./error-screenshots" : "";
        const cmd = `selenium-side-runner ${screenshotFlag} ${debugFlag} "${tempFile}" ${baseUrlFlag} -c "${config}"`.trim();

        const child = exec(cmd);

        child.stdout.on("data", (data) => console.log(data.toString()));
        child.stderr.on("data", (data) => console.error(data.toString()));

        child.on("exit", (code) => {
            fs.unlinkSync(tempFile);
            console.log("✅ Finished:", file, "code:", code);
            resolve();
        });
    });
}

async function run() {
    const inputs = getInputs(); // 👈 sync now

    // Build OS-specific profile paths
    let defaultProfilePath, superAdminProfilePath;
    console.log(os.platform())
    if (os.platform() === "win32") {
        // Windows
        defaultProfilePath = "C:\\selenium-profile";
        superAdminProfilePath = "C:\\selenium-profile-superadmin";
    } else {
        // Linux/Mac
        defaultProfilePath = path.join(os.homedir(), "selenium-profile");
        superAdminProfilePath = path.join(os.homedir(), "selenium-profile-superadmin");
    }

    console.log("\n⚙️ Default profile:", defaultProfilePath);
    console.log("⚙️ Super admin profile:", superAdminProfilePath);

    for (const file of tests) {
        const profilePath = file.includes("loginAndApproveOnboarding.side")
            ? superAdminProfilePath
            : defaultProfilePath;
        const fileConfig = buildConfig(inputs, inputs.browser, profilePath);
        await runTest(file, fileConfig, inputs.baseUrl, inputs);
    }
}


run();
