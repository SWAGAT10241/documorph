/* eslint-disable @typescript-eslint/no-require-imports */
const { webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

async function capture() {
  const docsDir = path.join(__dirname, '..', 'docs', 'screenshots');
  const publicDir = path.join(__dirname, '..', 'public', 'screenshots');

  fs.mkdirSync(docsDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });

  console.log('Launching Playwright WebKit...');
  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // Retina high DPI
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 1. 3D Hologram View
  console.log('Capturing 3D Hologram view...');
  // Ensure 3D tab is active
  const hologramBtn = page.getByRole('button', { name: /3D Hologram/i });
  if (await hologramBtn.isVisible()) {
    await hologramBtn.click();
  }
  await page.waitForTimeout(4000); // Wait for Three.js shaders & particles to settle

  const shot1 = path.join(docsDir, '01-3d-hologram-constellation.png');
  await page.screenshot({ path: shot1 });
  fs.copyFileSync(shot1, path.join(publicDir, '01-3d-hologram-constellation.png'));
  console.log('Saved 01-3d-hologram-constellation.png');

  // 2. 2D Living Architecture View
  console.log('Capturing 2D Living Architecture view...');
  const livingArchBtn = page.getByRole('button', { name: /Living Architecture/i });
  if (await livingArchBtn.isVisible()) {
    await livingArchBtn.click();
    await page.waitForTimeout(2000);
  }
  const shot2 = path.join(docsDir, '02-2d-living-architecture.png');
  await page.screenshot({ path: shot2 });
  fs.copyFileSync(shot2, path.join(publicDir, '02-2d-living-architecture.png'));
  console.log('Saved 02-2d-living-architecture.png');

  // 3. Living API Sandbox View
  console.log('Capturing API Sandbox view...');
  const sandboxBtn = page.getByRole('button', { name: /API Sandbox/i });
  if (await sandboxBtn.isVisible()) {
    await sandboxBtn.click();
    await page.waitForTimeout(2000);
  }
  const shot3 = path.join(docsDir, '03-living-api-sandbox.png');
  await page.screenshot({ path: shot3 });
  fs.copyFileSync(shot3, path.join(publicDir, '03-living-api-sandbox.png'));
  console.log('Saved 03-living-api-sandbox.png');

  // 4. Grafana View
  console.log('Capturing Grafana Metrics view...');
  const grafanaBtn = page.getByRole('button', { name: /Grafana View/i });
  if (await grafanaBtn.isVisible()) {
    await grafanaBtn.click();
    await page.waitForTimeout(2000);
  }
  const shot4 = path.join(docsDir, '04-grafana-metrics.png');
  await page.screenshot({ path: shot4 });
  fs.copyFileSync(shot4, path.join(publicDir, '04-grafana-metrics.png'));
  console.log('Saved 04-grafana-metrics.png');

  // 5. Code Link Ingestion Modal
  console.log('Capturing Code Link Ingest modal...');
  // Switch back to 3D or 2D first
  await hologramBtn.click();
  await page.waitForTimeout(1000);
  const ingestBtn = page.getByRole('button', { name: /Ingest Code Link/i });
  if (await ingestBtn.isVisible()) {
    await ingestBtn.click();
    await page.waitForTimeout(1500);
  }
  const shot5 = path.join(docsDir, '05-code-link-ingestor.png');
  await page.screenshot({ path: shot5 });
  fs.copyFileSync(shot5, path.join(publicDir, '05-code-link-ingestor.png'));
  console.log('Saved 05-code-link-ingestor.png');

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Failed to capture screenshots:', err);
  process.exit(1);
});
