import puppeteer, { ElementHandle } from "puppeteer";
import * as fs from "node:fs";

const LOGIN_URL = "https://quickvee.com/merchants/login";
const COOKIES_PATH = "./cookies.json";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

async function main(): Promise<void> {
  const store = requiredEnv("QUICKVEE_STORE");
  const username = requiredEnv("QUICKVEE_USERNAME");
  const password = requiredEnv("QUICKVEE_PASSWORD");

  console.log("Launching browser for initial login...");

  const browser = await puppeteer.launch({
    headless: false,
    channel: "chrome",
    defaultViewport: null,
  });

  const page = await browser.newPage();

  try {
    console.log("Opening Quickvee login page...");
    await page.goto(LOGIN_URL, { waitUntil: "domcontentloaded" });

    await page.waitForFunction(
      () => document.querySelectorAll("input").length >= 3,
      { timeout: 30_000 },
    );

    const inputs = await page.$$("input");
    if (inputs.length < 3) {
      throw new Error("Expected at least three input fields.");
    }

    console.log("Filling login form...");
    await inputs[0].type(store);
    await inputs[1].type(username);
    await inputs[2].type(password);

    const previousUrl = page.url();

    console.log("Submitting login form...");
    
    const loginButton = await page.evaluateHandle(() => {
      const elements = Array.from(document.querySelectorAll("button, a, div, span, input"));
      return elements.find(el => {
        const text = el.textContent?.trim() || (el as HTMLInputElement).value || "";
        return text.toLowerCase() === "login" && (el as HTMLElement).offsetParent !== null;
      });
    });

    if (loginButton && loginButton.asElement()) {
      await (loginButton as ElementHandle).click();
    } else {
      throw new Error("Could not find the 'Login' clickable element on the page.");
    }

    await page.waitForFunction(
      (url) => window.location.href !== url,
      {},
      previousUrl,
    );

    const finalUrl = new URL(page.url());
    console.log(`SUCCESS: Logged in! Navigated to ${finalUrl.href}`);

    // Extract and save cookies to disk
    const cookies = await page.cookies();
    fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));
    console.log("Session cookies successfully saved to cookies.json");

  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
}

main().catch((error: unknown) => {
  console.error("FAILURE:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});