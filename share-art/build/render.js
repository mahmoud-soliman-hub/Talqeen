const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
(async()=>{const [,,mode,only]=process.argv;const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1920,height:1080}});
await p.goto('file://'+path.resolve(process.env.SRC||'brandbook.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
if(mode==='png'){const PD=process.env.PAGES||'pages';fs.mkdirSync(PD,{recursive:true});const els=await p.$$('section.page');
 for(let i=0;i<els.length;i++){if(only&&!only.split(',').includes(String(i+1)))continue;await els[i].screenshot({path:`${PD}/p${String(i+1).padStart(2,'0')}.png`});}}
if(mode==='pdf'){await p.emulateMedia({media:'print'});await p.pdf({path:process.argv[3],width:'1920px',height:'1080px',printBackground:true,preferCSSPageSize:true});}
await b.close()})();
