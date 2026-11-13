import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const routes = [
  { name: "home-hero", path: "/", scroll: 0 },
  { name: "home-scrolled", path: "/", scroll: 650 },
  { name: "portal-page", path: "/portal", scroll: 0 },
  { name: "home-workflow", path: "/", selector: "#workflow" },
  { name: "features", path: "/features", scroll: 0 },
  { name: "how-it-works", path: "/how-it-works", scroll: 0 },
  { name: "showcase-page", path: "/showcase", scroll: 0 },
  { name: "pricing-page", path: "/pricing", scroll: 0 },
];

async function run() {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const port = 9222;
  const userDataDir = path.resolve(process.cwd(), ".chrome-temp-profile");

  const chromeProc = spawn(chromePath, [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "--no-sandbox",
    "--window-size=1440,1050",
    "http://localhost:4000/",
  ]);

  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json`);
      if (res.ok) {
        const list = await res.json();
        if (list.length > 0 && list[0].webSocketDebuggerUrl) {
          wsUrl = list[0].webSocketDebuggerUrl;
          break;
        }
      }
    } catch {
      // Devtools starting
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  if (!wsUrl) {
    console.error("Could not get WebSocket debugger URL");
    chromeProc.kill();
    process.exit(1);
  }

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      function onMessage(event) {
        const data = JSON.parse(event.data);
        if (data.id === id) {
          ws.removeEventListener("message", onMessage);
          if (data.error) reject(data.error);
          else resolve(data.result);
        }
      }
      ws.addEventListener("message", onMessage);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send("Page.enable");
  await send("Runtime.enable");

  const outDir = path.resolve("out", "v3-pages");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const item of routes) {
    console.log(`Navigating to: ${item.path}...`);
    await send("Page.navigate", { url: `http://localhost:4000${item.path}` });
    await new Promise((r) => setTimeout(r, 2000));

    if (item.selector) {
      await send("Runtime.evaluate", {
        expression: `
          const el = document.querySelector('${item.selector}');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        `,
      });
      await new Promise((r) => setTimeout(r, 1200));
    } else if (item.scroll) {
      await send("Runtime.evaluate", {
        expression: `window.scrollTo(0, ${item.scroll});`,
      });
      await new Promise((r) => setTimeout(r, 1200));
    }

    const shot = await send("Page.captureScreenshot", { format: "png" });
    const targetPath = path.resolve(outDir, `${item.name}.png`);
    fs.writeFileSync(targetPath, Buffer.from(shot.data, "base64"));
    console.log(`Captured ${item.name} -> ${targetPath}`);
  }

  // Mobile screenshot of Pricing
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await send("Page.navigate", { url: "http://localhost:4000/pricing" });
  await new Promise((r) => setTimeout(r, 2000));
  const mobShot = await send("Page.captureScreenshot", { format: "png" });
  const mobPath = path.resolve(outDir, "pricing-mobile.png");
  fs.writeFileSync(mobPath, Buffer.from(mobShot.data, "base64"));
  console.log(`Captured mobile pricing -> ${mobPath}`);

  ws.close();
  chromeProc.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {
    // ignore
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

