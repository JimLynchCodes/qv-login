import puppeteer from "puppeteer";
import * as fs from "node:fs";

const TARGET_URL = "https://quickvee.com/merchants/dashboard";
const COOKIES_PATH = "./cookies.json";

async function main(): Promise<void> {
  if (!fs.existsSync(COOKIES_PATH)) {
    throw new Error("No cookies.json found! Please run 'npx tsx index.ts' first to log in.");
  }

  console.log("Launching browser and restoring session cookies...");

  const browser = await puppeteer.launch({
    headless: false,
    channel: "chrome",
    defaultViewport: null,
  });

  const page = await browser.newPage();

  try {
    // Load and set cookies prior to visiting the target page
    const cookiesString = fs.readFileSync(COOKIES_PATH, "utf8");
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    console.log("Cookies injected successfully.");

    console.log(`Navigating to ${TARGET_URL}...`);
    await page.goto(TARGET_URL, { waitUntil: "domcontentloaded" });

    if (page.url().includes("login")) {
      console.log("WARNING: Redirected to login. Your cookies may have expired. Run index.ts again.");
    } else {
      console.log("SUCCESS: Re-opened browser and authenticated via saved cookies!");
    }
  } finally {
    // Disconnects Puppeteer so your script terminates, but the browser window stays open
    browser.disconnect();
    console.log("Script exited. Browser left running and open.");
  }
}

main().catch((error: unknown) => {
  console.error("FAILURE:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});