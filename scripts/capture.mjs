import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

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
    "--window-size=1440,1100",
    "http://localhost:5000/",
  ]);

  // Wait for DevTools port to be ready
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
    } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }

  if (!wsUrl) {
    console.error("Could not get WebSocket debugger URL");
    chromeProc.kill();
    process.exit(1);
  }

  // Connect via native WebSocket (Node 22+)
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

  // Wait for initial render
  await new Promise((r) => setTimeout(r, 2000));

  // Scroll to showcase section
  await send("Runtime.evaluate", {
    expression: `
      const el = document.querySelector('#showcase');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `,
  });

  await new Promise((r) => setTimeout(r, 1500));

  // Capture screenshot of showcase
  const showcaseShot = await send("Page.captureScreenshot", { format: "png" });
  const showcasePath = path.resolve("out", "showcase-actual.png");
  fs.writeFileSync(showcasePath, Buffer.from(showcaseShot.data, "base64"));
  console.log("Captured:", showcasePath);

  // Scroll to automation section
  await send("Runtime.evaluate", {
    expression: `
      window.scrollTo(0, 3600);
    `,
  });

  await new Promise((r) => setTimeout(r, 1500));

  const autoShot = await send("Page.captureScreenshot", { format: "png" });
  const autoPath = path.resolve("out", "automation-actual.png");
  fs.writeFileSync(autoPath, Buffer.from(autoShot.data, "base64"));
  console.log("Captured:", autoPath);

  // Set mobile device metrics
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await send("Runtime.evaluate", {
    expression: `
      window.scrollTo(0, 0);
    `,
  });

  await new Promise((r) => setTimeout(r, 1500));

  const mobShot = await send("Page.captureScreenshot", { format: "png" });
  const mobPath = path.resolve("out", "landing-mobile.png");
  fs.writeFileSync(mobPath, Buffer.from(mobShot.data, "base64"));
  console.log("Captured:", mobPath);

  ws.close();
  chromeProc.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {}
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
