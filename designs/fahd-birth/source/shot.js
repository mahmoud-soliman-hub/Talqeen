const { chromium } = require('playwright');
(async()=>{const [,, file,out,w,h,scale,hash]=process.argv;
const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w,height:+h},deviceScaleFactor:+(scale||1)});
await p.goto('file://'+require('path').resolve(file)+(hash||''));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
await p.screenshot({path:out});await b.close();})();
