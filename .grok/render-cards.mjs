import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

function b64(path) {
  return readFileSync(path).toString("base64");
}

const aref = b64("/workspace/.grok/fonts/ArefRuqaa-Bold.ttf");
const m800 = b64("/workspace/.grok/fonts/Manrope-800.ttf");
const m600 = b64("/workspace/.grok/fonts/Manrope-600.ttf");
const m500 = b64("/workspace/.grok/fonts/Manrope-500.ttf");

const faces = `
@font-face { font-family: Aref; src: url(data:font/ttf;base64,${aref}) format("truetype"); font-weight: 700; }
@font-face { font-family: Manrope; src: url(data:font/ttf;base64,${m800}) format("truetype"); font-weight: 800; }
@font-face { font-family: Manrope; src: url(data:font/ttf;base64,${m600}) format("truetype"); font-weight: 600; }
@font-face { font-family: Manrope; src: url(data:font/ttf;base64,${m500}) format("truetype"); font-weight: 500; }
`;

const og = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><style>
${faces}
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#0B3D2E}
body{background:#0B3D2E url("og-bg.jpg") center/cover no-repeat;display:flex;align-items:center;justify-content:center}
.lock{text-align:center;transform:translateY(-18px)}
.mark{font-family:Aref,serif;font-size:78px;line-height:1;color:#7A6210;margin:0}
.title{font-family:Manrope,sans-serif;font-weight:800;font-size:156px;line-height:0.82;color:#0B3D2E;margin:10px 0 0;letter-spacing:-0.04em}
.rule{width:64px;height:1px;background:#C9A227;margin:18px auto 14px}
.tag{font-family:Manrope,sans-serif;font-weight:600;font-size:26px;letter-spacing:0.2em;color:#7A6210;margin:0 0 0 0.2em}
</style></head>
<body><div class="lock">
<p class="mark" lang="ar">نور</p>
<h1 class="title">Нур</h1>
<div class="rule"></div>
<p class="tag">хиджра и намаз</p>
</div></body></html>`;

const banner = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><style>
${faces}
html,body{margin:0;width:1200px;height:264px;overflow:hidden;background:#0A1210}
body{background:#0A1210 url("x-banner-bg.jpg") center/cover no-repeat;position:relative}
.lock{position:absolute;left:68px;top:30px;text-align:left}
.mark{font-family:Aref,serif;font-size:42px;line-height:1;color:#C9A227;margin:0}
.title{font-family:Manrope,sans-serif;font-weight:800;font-size:76px;line-height:0.86;color:#F4EBD0;margin:4px 0 0;letter-spacing:-0.04em}
.tag{font-family:Manrope,sans-serif;font-weight:500;font-size:20px;letter-spacing:0.16em;color:#C9A227;margin:10px 0 0}
</style></head>
<body><div class="lock">
<p class="mark" lang="ar">نور</p>
<h1 class="title">Нур</h1>
<p class="tag">хиджра и намаз</p>
</div></body></html>`;

writeFileSync("/workspace/.grok/og-card.html", og);
writeFileSync("/workspace/.grok/x-banner.html", banner);

const browser = await chromium.launch();
async function shot(file, w, h, out) {
  const page = await browser.newPage({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
  });
  await page.goto(`file://${file}`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.screenshot({ path: out, type: "png", clip: { x: 0, y: 0, width: w, height: h } });
  await page.close();
}
await shot("/workspace/.grok/og-card.html", 1200, 630, "/workspace/.grok/og-raw.png");
await shot("/workspace/.grok/x-banner.html", 1200, 264, "/workspace/.grok/x-banner-raw.png");
await browser.close();
console.log("shot");
