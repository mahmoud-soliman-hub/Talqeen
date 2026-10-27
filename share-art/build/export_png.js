// Rasterise every logo SVG to a transparent PNG (long edge 2400px) + app/social icons.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const SRC='../logo/svg', OUT='../logo/png', ICO='../logo/icons';
(async()=>{fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync(ICO,{recursive:true});
const b=await chromium.launch();const p=await b.newPage();
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.svg'))){
  const svg=fs.readFileSync(path.join(SRC,f),'utf8');
  const [,w,h]=svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  const k=2400/Math.max(w,h), W=Math.round(w*k), H=Math.round(h*k);
  await p.setViewportSize({width:W,height:H});
  await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace(/width="[\d.]+" height="[\d.]+"/,`width="${W}" height="${H}"`)}</body></html>`);
  await p.screenshot({path:path.join(OUT,f.replace('.svg','.png')),omitBackground:true,clip:{x:0,y:0,width:W,height:H}});
}
const mark=fs.readFileSync(path.join(SRC,'mark-mono-white.svg'),'utf8').replace(/width="[\d.]+" height="[\d.]+"/,'height="56%"').replace(/<title>.*?<\/title>/,'');
const markC=fs.readFileSync(path.join(SRC,'mark-color.svg'),'utf8').replace(/width="[\d.]+" height="[\d.]+"/,'height="62%"');
const icons=[['app-icon-1024',1024,`background:linear-gradient(135deg,#00B4C0,#0096A7 45%,#00586B)`,mark,''],
 ['social-avatar-1080',1080,`background:linear-gradient(135deg,#00B4C0,#0096A7 45%,#00586B)`,mark,''],
 ['social-avatar-white-1080',1080,`background:#fff`,markC,''],
 ['favicon-512',512,`background:#00586B;border-radius:22%`,mark,'r'],
 ['favicon-64',64,`background:#00586B;border-radius:22%`,mark,'r']];
for(const [n,s,bg,m,r] of icons){await p.setViewportSize({width:s,height:s});
  await p.setContent(`<html><body style="margin:0;background:transparent"><div style="width:${s}px;height:${s}px;${bg};display:flex;align-items:center;justify-content:center">${m}</div></body></html>`);
  await p.screenshot({path:path.join(ICO,n+'.png'),omitBackground:true});}
await b.close();})();
