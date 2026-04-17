const readlineSync = require("readline-sync");
const { exec } = require("child_process");
const path = require("path");
const os = require("os");
const fs = require("fs");

const cookiesData = JSON.parse(fs.readFileSync("./cookies.json", "utf8"));

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
    const baseUrl =
        readlineSync.question("Enter Base URL: ") ||
        "http://localhost:9001";

    const adminEmail =
        readlineSync.question("Enter Admin Email: ") ||
        "seleniumide609@gmail.com";

    const superAdminEmailId =
        readlineSync.question(
            "Enter Super Admin Email ID: "
        ) || "609varsha@gmail.com";
    const concurrency =
        parseInt(readlineSync.question("How many tests to run in parallel? [2]: ")) || 2;

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
        concurrency
    };
}

function buildConfig(browser) {
    const config = [];

    if (browser === "firefox") {
        config.push(`browserName=firefox`);
        config.push(`moz:firefoxOptions.args=[-headless]`);

    } else {
        config.push(`browserName=${browser}`);
        config.push(
            `goog:chromeOptions.args=[--headless,--window-size=1920,1080,--disable-gpu,--no-sandbox]`
        );
    }

    return config.join(" ");
}

function runTest(file, config, baseUrl, options, cookies) {
    let sideContent = fs.readFileSync(file, "utf8");

    console.log("🔐 Using cookies:", cookies);

    // Inject AFTER first open command
    const script =
        "document.cookie='accessToken=" + cookies.accessToken + "; path=/;';" +
        "document.cookie='refreshToken=" + cookies.refreshToken + "; path=/;';" +
        "document.cookie='isLoggedIn=" + cookies.isLoggedIn + "; path=/;';" +
        "window.location.href='/#/studio/home';";

    sideContent = sideContent.replace(/BYPASS_LOGIN/g, script);

    // Replace emails dynamically
    sideContent = sideContent.replace(
        /"target": "seleniumide609@gmail.com"/g,
        `"target": "${options.adminEmail}"`
    );

    sideContent = sideContent.replace(
        /"target": "609varsha@gmail.com"/g,
        `"target": "${options.superAdminEmailId}"`
    );

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

        const cmd = `selenium-side-runner  ${screenshotFlag} ${debugFlag} "${tempFile}" ${baseUrlFlag} -c "${config}"`.trim();

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
    const inputs = getInputs();
    const fileConfig = buildConfig(inputs.browser);

    const queue = [...tests];
    const running = [];

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
            .then(() => {
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

    console.log("🎉 All tests finished");
}

run();