/**
 * Record the looping demo video used by the video blocks in the demo content.
 *
 * Playwright drives a headless Chromium over a small CSS animation and captures
 * it as WebM. Replace public/media/motion/reel.webm with real footage by
 * uploading it from /admin — nothing references it outside content JSON.
 *
 * Run: node scripts/record-demo-video.mjs
 */
import { chromium } from 'playwright';
import { mkdir, readdir, rename, rm } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'public', 'media', 'motion');
const TMP = path.join(process.cwd(), '.video-tmp');

const page = `<!doctype html><meta charset="utf-8"><style>
  html,body{margin:0;height:100%;background:#141414;overflow:hidden}
  .stage{position:absolute;inset:0;display:grid;place-items:center}
  .ring,.ring2,.bar{position:absolute}
  .ring{width:320px;height:320px;border:10px solid #F2EFE8;border-radius:50%;
        animation:spin 4s linear infinite}
  .ring::after{content:"";position:absolute;inset:-10px;border:10px solid transparent;
        border-top-color:#C6462B;border-radius:50%}
  .ring2{width:452px;height:452px;border:4px solid #F2EFE8;border-radius:50%;opacity:.5;
        animation:spin 6s linear infinite reverse}
  .bar{width:18px;height:180px;background:#C6462B;animation:sweep 4s ease-in-out infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes sweep{0%,100%{transform:translateX(-210px)}50%{transform:translateX(210px)}}
</style><div class="stage"><div class="ring2"></div><div class="ring"></div><div class="bar"></div></div>`;

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const context = await browser.newContext({
  viewport: { width: 960, height: 540 },
  recordVideo: { dir: TMP, size: { width: 960, height: 540 } },
});
const p = await context.newPage();
await p.setContent(page);
await p.waitForTimeout(4000); // one full loop of the 4s animation
await context.close();
await browser.close();

await mkdir(OUT, { recursive: true });
const [file] = (await readdir(TMP)).filter((f) => f.endsWith('.webm'));
if (!file) throw new Error('no video recorded');
await rename(path.join(TMP, file), path.join(OUT, 'reel.webm'));
await rm(TMP, { recursive: true, force: true });
console.log('wrote public/media/motion/reel.webm');
