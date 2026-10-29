"""Client-facing proposal: the SHARE ART lockup set in 12 Arabic typefaces (1920x1080 pages)."""
import os, json

HERE = os.path.dirname(os.path.abspath(__file__))
P = json.load(open(os.path.join(HERE, 'palette.json')))
G = json.load(open(os.path.join(HERE, 'geometry.json')))
OPT = json.load(open(os.path.join(HERE, 'options', 'options.json')))
SZ = json.load(open(os.path.join(HERE, 'options', 'sizes.json')))
DEEP, TEAL, AQUA, MIST, INK, WHITE, PEARL = (P[k] for k in ('deep', 'teal', 'aqua', 'mist', 'ink', 'white', 'pearl'))
MW, MH = G['w'], G['h']
PICKS = [(2, 'أفضل توازن بين الفخامة والوضوح؛ حروفه العريضة تقف بثقة جنب الرمز، وممتاز في اللوحات والمطبوعات.'),
         (3, 'الأقرب لشخصية الرمز: هندسة كوفية بزوايا واضحة مع لمسة فنية تعبّر عن «آرت».'),
         (8, 'لو العميل يميل للأناقة والرقي؛ مميز وسهل القراءة وما يشبه خطوط الشركات المعتادة.')]

def pts(poly): return ' '.join(f'{x:.2f},{y:.2f}' for x, y in poly)
def mark(h, top=AQUA, bot=DEEP):
    return (f'<svg width="{h*MW/MH:.1f}" height="{h:.1f}" viewBox="0 0 {MW:.2f} {MH:.2f}">'
            f'<polygon fill="{top}" points="{pts(G["top"])}"/><polygon fill="{bot}" points="{pts(G["bot"])}"/></svg>')
def img(name, h=None, w=None, style=''):
    lw, lh = SZ[name]
    if h and not w: w = h * lw / lh
    if w and not h: h = w * lh / lw
    return f'<img src="options/{name}.svg" style="display:block;width:{w:.1f}px;height:{h:.1f}px;{style}">'

PAGES = []
def page(body, cls='', crumb=''):
    n = len(PAGES) + 1
    chrome = '' if 'cover' in cls else (
        f'<div class="chrome top"><div class="crumb">{crumb}</div>'
        f'<div class="brandtag">{mark(26)}<span>SHARE ART · Typeface Options</span></div></div>'
        f'<div class="chrome bottom"><span class="pg">{n:02d}</span><span>اقتراحات الخط العربي للشعار — للاعتماد</span></div>')
    PAGES.append(f'<section class="page {cls}">{body}{chrome}</section>')

def fam(o): return f"F{o['no']:02d}"

# 1 — cover
page(f'''
<div class="cover-bg"></div>
<div class="op-cover">
  <div class="op-mark">{mark(300, AQUA, WHITE)}</div>
  <div>
    <div class="en-cap" style="text-align:right">Arabic Typeface Options</div>
    <h1 class="op-title">اقتراحات الخط العربي<br>لشعار شير آرت</h1>
    <p class="op-sub">{len(OPT)} خطًا مقترحًا على نفس الشعار، لاختيار الخط المعتمد قبل تحديث ملف الهوية النهائي.</p>
  </div>
</div>
<div class="cover-foot"><span>للاعتماد من العميل</span><span>اختر رقم الخط المفضّل</span></div>
''', cls='cover')

# 2 — overview
cards = ''.join(f'''<div class="oc"><span class="oc-n">{o["no"]:02d}</span>
  <div class="oc-art">{img(f"{o['no']:02d}-color", h=104)}</div>
  <div class="oc-cap"><b>{o["ar"]}</b><i>{o["en"]}</i><em>{o["style"]}</em></div></div>''' for o in OPT)
page(f'''
<div class="head narrow"><div class="eyebrow"><b>00</b><span>Overview</span></div>
<h1 class="h-s">نظرة شاملة على الاقتراحات</h1></div>
<div class="ov">{cards}</div>
''', crumb='<b>00</b> نظرة شاملة <i>Overview</i>')

# 3.. — one page per typeface
for o in OPT:
    n = f"{o['no']:02d}"
    page(f'''
<div class="fd-grid">
  <div class="fd-info">
    <div class="fd-no">{n}</div>
    <h1>{o["ar"]}</h1>
    <div class="fd-en">{o["en"]}</div>
    <span class="chip">{o["style"]}</span>
    <p class="fd-why">{o["why"]}</p>
    <div class="fd-sample" style="font-family:{fam(o)}">
      <div class="s1">نصنع الفكرة معًا</div>
      <div class="s2">دعاية وإعلان · تصميم جرافيك · مطبوعات · فيديو</div>
    </div>
    <table class="spec fd-spec"><tr><td>الوزن المستخدم</td><td>{o["w"]}</td></tr><tr><td>الترخيص</td><td>{o["lic"]}</td></tr></table>
  </div>
  <div class="fd-art">
    <div class="fd-main">{img(n + '-color', h=230)}</div>
    <div class="fd-row">
      <div class="fd-dark">{img(n + '-reverse', h=120)}</div>
      <div class="fd-word">{img(n + '-word', h=120)}</div>
    </div>
  </div>
</div>
''', crumb=f'<b>{n}</b> {o["ar"]} <i>{o["en"]}</i>')

# last — recommendations & how to reply
picks = ''.join(f'''<div class="pk"><div class="pk-art">{img(f"{no:02d}-color", h=120)}</div>
  <div class="pk-txt"><span class="oc-n">{no:02d}</span><b>{OPT[no-1]["ar"]} <i>{OPT[no-1]["en"]}</i></b><p>{why}</p></div></div>''' for no, why in PICKS)
page(f'''
<div class="rec">
 <div>
  <div class="head"><div class="eyebrow"><b>★</b><span>Our Recommendation</span></div><h1 class="h-s">ترشيحاتنا</h1></div>
  <div class="picks">{picks}</div>
 </div>
 <div class="reply">
  <h3>طريقة الاعتماد</h3>
  <ol>
   <li>اختر <b>رقم الخط</b> المفضّل (أو رقمين للمقارنة النهائية).</li>
   <li>بعد الاعتماد نختار الخط الإنجليزي المناسب له، لأنه ثابت مؤقتًا في كل الاقتراحات.</li>
   <li>نحدّث ملف الهوية كاملًا وكل ملفات الشعار بالخط الجديد.</li>
  </ol>
  <p class="note2">كل الخطوط تجارية قانونية ومجانية الاستخدام (ترخيص OFL)، ما عدا «ثمانية سيرف» يُراجع شرط ترخيصه قبل الاعتماد.</p>
 </div>
</div>
''', crumb='<b>★</b> الترشيحات <i>Recommendation</i>')

faces = ''.join(f"@font-face{{font-family:{fam(o)};src:url({os.path.relpath(o['file'], HERE)})}}\n" for o in OPT)
base = open(os.path.join(HERE, 'book.css')).read()
extra = '''
.op-cover{position:absolute;inset:0;display:flex;align-items:center;gap:200px;padding:0 170px;flex-direction:row-reverse;justify-content:flex-end}
.op-mark{filter:drop-shadow(0 40px 60px rgba(0,30,40,.35))}
.op-title{color:#fff;font-size:84px;line-height:1.25;margin:18px 0 26px}
.op-sub{color:rgba(255,255,255,.75);font-size:26px;font-weight:300;max-width:820px;line-height:1.7}
.h-s{font-size:56px}
.ov{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:28px}
.oc{background:$PEARL;height:208px;position:relative;display:flex;flex-direction:column;padding:16px 20px 14px;border:1px solid #e3ecec}
.oc-n{font-size:15px;font-weight:700;color:#fff;background:$TEAL;padding:3px 9px 2px;letter-spacing:.06em;align-self:flex-start}
.oc .oc-n{position:absolute;top:14px;right:14px}
.oc-art{flex:1;display:flex;align-items:center;justify-content:center;padding-top:10px}
.oc-cap{display:flex;align-items:baseline;gap:10px;white-space:nowrap;border-top:1px solid #dfe9ea;padding-top:10px}
.oc-cap b{font-size:19px;color:$DEEP}
.oc-cap i{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:$AQUA;direction:ltr}
.oc-cap em{font-style:normal;margin-right:auto;font-size:13px;color:#7d9196}
.fd-grid{display:grid;grid-template-columns:560px 1fr;gap:70px;height:100%}
.fd-no{font-size:120px;font-weight:200;color:$AQUA;line-height:1;margin-bottom:6px}
.fd-info h1{font-size:64px}
.fd-en{font-size:16px;letter-spacing:.3em;text-transform:uppercase;color:$TEAL;direction:ltr;text-align:right;margin:22px 0 20px}
.chip{display:inline-block;background:$MIST;color:$DEEP;font-size:16px;font-weight:600;padding:6px 16px}
.fd-why{font-size:22px;font-weight:300;line-height:1.8;color:#3b5359;margin-top:22px}
.fd-sample{margin-top:26px;border-top:1px solid #e3ecec;padding-top:22px;color:$DEEP}
.fd-sample .s1{font-size:46px;line-height:1.35}
.fd-sample .s2{font-size:20px;color:$TEAL;margin-top:6px}
.fd-spec{margin-top:20px;font-size:17px}
.fd-spec td{padding:10px 0}
.fd-art{display:flex;flex-direction:column;gap:22px}
.fd-main{flex:1.5;background:#fff;border:1px solid #e3ecec;display:flex;align-items:center;justify-content:center}
.fd-row{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:22px}
.fd-dark{background:$DEEP;display:flex;align-items:center;justify-content:center}
.fd-word{background:$PEARL;border:1px solid #e3ecec;display:flex;align-items:center;justify-content:center}
.rec{display:grid;grid-template-columns:1.35fr 1fr;gap:80px;height:100%}
.picks{display:flex;flex-direction:column;gap:18px;margin-top:30px}
.pk{display:flex;align-items:center;gap:30px;background:$PEARL;border:1px solid #e3ecec;padding:20px 26px}
.pk-art{width:340px;flex:none;display:flex;justify-content:center;background:#fff;padding:16px 0}
.pk-txt b{display:block;font-size:26px;color:$DEEP;margin:10px 0 6px}
.pk-txt b i{font-size:13px;letter-spacing:.2em;color:$AQUA;font-weight:400;margin-right:8px}
.pk-txt p{font-size:18px;font-weight:300;line-height:1.7;color:#3b5359}
.reply{background:$DEEP;color:#fff;padding:56px 50px;align-self:center}
.reply h3{font-size:36px;margin-bottom:24px}
.reply ol{padding-right:26px;font-size:21px;font-weight:300;line-height:1.8}
.reply li{margin-bottom:12px}
.reply b{color:$AQUA;font-weight:700}
.note2{margin-top:26px;font-size:15px;color:rgba(255,255,255,.65);line-height:1.7;border-top:1px solid rgba(255,255,255,.18);padding-top:18px}
'''
css = (base + extra).replace('$DEEP', DEEP).replace('$TEAL', TEAL).replace('$AQUA', AQUA) \
    .replace('$MIST', MIST).replace('$INK', INK).replace('$PEARL', PEARL)
html = (f'<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>SHARE ART — Typeface Options</title>'
        f'<style>{faces}{css}</style></head><body>{"".join(PAGES)}</body></html>')
open(os.path.join(HERE, 'font-options.html'), 'w').write(html)
print('pages:', len(PAGES))
