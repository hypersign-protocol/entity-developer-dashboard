const readlineSync = require("readline-sync");
const { exec } = require("child_process");
const path = require("path");
const os = require("os");
const fs = require("fs");

const cookiesData = JSON.parse(fs.readFileSync("./cookies.json", "utf8"));

// Test groups
const fillTest =
    "tests/E2E_test/serviceConfigModule/loginAndFillOnboarding.side";
const approveTest =
    "tests/E2E_test/serviceConfigModule/loginAndApproveOnboarding.side";

const otherTests = [
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
    "tests/E2E_test/serviceConfigModule/deleteApp.side",
];

// Inputs
function getInputs(runType) {
    const baseUrl =
        readlineSync.question("Enter Base URL: ") ||
        "http://localhost:9001";

    const adminEmail =
        readlineSync.question("Enter Admin Email: ") ||
        "seleniumide609@gmail.com";

    const superAdminEmailId =
        readlineSync.question("Enter Super Admin Email ID: ") ||
        "609varsha@gmail.com";

    const onboardingId =
        runType === "approve"
            ? readlineSync.question("Enter Onboarding ID: ")
            : null;

    const concurrency =
        parseInt(
            readlineSync.question("How many tests to run in parallel? [2]: ")
        ) || 2;

    const browserIndex = readlineSync.keyInSelect(
        ["chrome", "firefox", "edge", "brave"],
        "Select browser:"
    );

    const browser =
        ["chrome", "firefox", "edge", "brave"][browserIndex] || "chrome";

    const debugMode =
        readlineSync
            .question("Enable debug mode? (y/n) [n]: ")
            .toLowerCase()
            .trim() === "y";

    const takeScreenshots =
        readlineSync
            .question("Take error screenshots? (y/n) [n]: ")
            .toLowerCase()
            .trim() === "y";

    return {
        baseUrl,
        adminEmail,
        superAdminEmailId,
        browser,
        debugMode,
        takeScreenshots,
        concurrency,
        onboardingId,
    };
}

// Browser config
function buildConfig(browser) {
    const config = [];

    if (browser === "firefox") {
        config.push(`browserName=firefox`);
        config.push(`moz:firefoxOptions.args=[-headless]`);
        // config.push(`moz:firefoxOptions.args=[]`); // for headed mode
    } else {
        config.push(`browserName=${browser}`);
        config.push(
            `goog:chromeOptions.args=[--headless,--window-size=1920,1080,--disable-gpu,--no-sandbox]`
            // `goog:chromeOptions.args=[--window-size=1920,1080,--disable-gpu,--no-sandbox]` // for headed mode
        );
    }

    return config.join(" ");
}

// Run single test
function runTest(file, config, baseUrl, options, cookies) {
    let sideContent = fs.readFileSync(file, "utf8");

    console.log("🔐 Using cookies:", cookies);

    // Inject login bypass
    const script =
        "document.cookie='accessToken=" +
        cookies.accessToken +
        "; path=/;';" +
        "document.cookie='refreshToken=" +
        cookies.refreshToken +
        "; path=/;';" +
        "document.cookie='isLoggedIn=" +
        cookies.isLoggedIn +
        "; path=/;';" +
        "window.location.href='/#/studio/home';";

    sideContent = sideContent.replace(/BYPASS_LOGIN/g, script);

    // Replace emails
    sideContent = sideContent.replace(
        /"target": "seleniumide609@gmail.com"/g,
        `"target": "${options.adminEmail}"`
    );

    sideContent = sideContent.replace(
        /"target": "609varsha@gmail.com"/g,
        `"target": "${options.superAdminEmailId}"`
    );

    // Inject onboarding ID
    if (file.includes("loginAndApproveOnboarding.side")) {
        if (!options.onboardingId) {
            console.error("❌ Onboarding ID is required for approve test");
            process.exit(1);
        }

        sideContent = sideContent.replace(
            /DOCUMENT_ID_PLACEHOLDER/g,
            options.onboardingId
        );
    }

    const tempFile = path.join(
        os.tmpdir(),
        `temp_${Date.now()}_${Math.random()}_${path.basename(file)}`
    );

    fs.writeFileSync(tempFile, sideContent);

    return new Promise((resolve) => {
        console.log("🚀 Running:", file);

        const baseUrlFlag = baseUrl ? `--base-url "${baseUrl}"` : "";
        const debugFlag = options.debugMode ? "--debug" : "";
        const screenshotFlag = options.takeScreenshots
            ? "-z ./error-screenshots"
            : "";

        const cmd = `selenium-side-runner  --jest-timeout 180000 ${screenshotFlag} ${debugFlag} "${tempFile}" ${baseUrlFlag} -c "${config}"`.trim();
        const child = exec(cmd);
        let stdoutLogs = "";
        let stderrLogs = "";

        child.stdout.on("data", (data) => {
            const text = data.toString();
            stdoutLogs += text;
            console.log(text);
        });

        child.stderr.on("data", (data) => {
            const text = data.toString();
            stderrLogs += text;
            console.error(text);
        });

        child.on("exit", (code) => {
            fs.unlinkSync(tempFile);
            const status = code === 0 ? "PASSED" : "FAILED";
            const errorSnippet =
                status === "FAILED"
                    ? (stderrLogs || stdoutLogs)
                        .split("\n")
                        .slice(-25)
                        .join("\n")
                    : null;

            console.log(`✅ Finished: ${file} -> ${status}`);

            resolve({ file, status, code, error: errorSnippet, });
        });
    });
}

// Main runner
async function run() {
    const runTypeIndex = readlineSync.keyInSelect(
        ["Fill Onboarding", "Approve Onboarding", "Run Others"],
        "What do you want to run?"
    );

    const runType = ["fill", "approve", "others"][runTypeIndex];

    let tests = [];

    if (runType === "fill") {
        tests = [fillTest];
    } else if (runType === "approve") {
        tests = [approveTest];
    } else {
        tests = otherTests;
    }

    const inputs = getInputs(runType);
    const fileConfig = buildConfig(inputs.browser);

    const queue = [...tests];
    const running = [];
    const results = [];

    async function runNext() {
        if (queue.length === 0) return;

        const file = queue.shift();

        const isSuperAdmin = file.includes(
            "loginAndApproveOnboarding.side"
        );

        const cookies = isSuperAdmin
            ? cookiesData.superAdmin
            : cookiesData.admin;

        const p = runTest(file, fileConfig, inputs.baseUrl, inputs, cookies)
            .then((res) => {
                results.push(res);
                running.splice(running.indexOf(p), 1);
            });

        running.push(p);

        let next = Promise.resolve();

        if (running.length >= inputs.concurrency) {
            next = Promise.race(running);
        }

        await next;
        await runNext();
    }

    const workers = Array(inputs.concurrency)
        .fill(0)
        .map(() => runNext());

    await Promise.all(workers);

    // Summary
    console.log("\n📊 Test Summary:\n");

    const passed = results.filter((r) => r.status === "PASSED");
    const failed = results.filter((r) => r.status === "FAILED");

    console.log(`✅ Passed: ${passed.length}`);
    passed.forEach((r) => console.log("   ✔", r.file));

    console.log(`\n❌ Failed: ${failed.length}`);
    failed.forEach((r) => console.log("   ✖", r.file));

    // Save report
    fs.writeFileSync(
        "test-results.json",
        JSON.stringify(results, null, 2)
    );

    console.log("\n💾 Results saved to test-results.json");
    console.log("🎉 All tests finished");
}

run();