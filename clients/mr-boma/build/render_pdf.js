// Renders ../deck.html to ../Mr-Boma-Logo-Concepts.pdf.
// Optional arg: a folder to also save one PNG per slide (for review).
const {chromium} = require('playwright');
const path = require('path');
(async () => {
  const root = path.resolve(__dirname, '..');
  const b = await chromium.launch();
  const p = await b.newPage({viewport: {width: 1920, height: 1080}});
  await p.goto('file://' + path.join(root, 'deck.html'), {waitUntil: 'networkidle'});
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(800);
  const shots = process.argv[2];
  if (shots) {
    const els = await p.$$('.slide');
    for (let i = 0; i < els.length; i++) {
      await els[i].screenshot({path: path.join(shots, `slide-${String(i + 1).padStart(2, '0')}.png`)});
    }
  }
  await p.emulateMedia({media: 'print'});
  await p.pdf({path: path.join(root, 'Mr-Boma-Logo-Concepts.pdf'), width: '1920px', height: '1080px',
    printBackground: true, preferCSSPageSize: true});
  await b.close();
})();
