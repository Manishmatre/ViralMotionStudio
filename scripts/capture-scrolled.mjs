import puppeteer from "puppeteer";

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle2" });
  await page.evaluate(() => window.scrollTo(0, 600));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: "C:/Users/Pc/.gemini/antigravity/brain/bb6c1499-a499-49ab-bb2b-a693a6889452/home-scrolled.png" });
  await browser.close();
  console.log("Captured home-scrolled.png successfully!");
}

run();

