"""Client presentation deck (16:9) for the Mr. Boma logo round 2.

Run:  python3 deck.py  -> ../deck.html ; then render to PDF with render_pdf.js
"""
import base64
from pathlib import Path
from build import inline, META, PATTERNS, data_uri, ROOT

HERE = Path(__file__).parent
PAGE_CSS = (HERE / "page.css").read_text()
MOCK_CSS = PAGE_CSS[PAGE_CSS.index("/* ---------- mockups */"):PAGE_CSS.index("/* ---------- specs */")]
ICON_CSS = PAGE_CSS[PAGE_CSS.index(".icon-row{"):PAGE_CSS.index("/* ---------- mockups */")]
OLD = base64.b64encode((HERE / "old-logo.jpg").read_bytes()).decode()

ORDER = ["heritage", "momentum", "horizon"]
TOTAL = 17
_page = [0]


def kvars(cid):
    m = META[cid]
    return (f"--k-dark:{m['dark']};--k-light:{m['light']};--k-accent:{m['accent']};--k-ink:{m['ink']};"
            f"--k-head:{m['head']};--k-body:{m['body']};--k-pattern:{data_uri(PATTERNS[cid])}")


def slide(body, cls="", style="", chrome=True, dark=False):
    _page[0] += 1
    n = _page[0]
    ch = ""
    if chrome:
        ch = (f'<div class="chrome{" on-dark" if dark else ""}"><span dir="ltr">MR. BOMA · LOGO DEVELOPMENT</span>'
              f'<span dir="ltr">{n:02d} / {TOTAL:02d}</span></div>')
    return f'<section class="slide {cls}" style="{style}">{ch}{body}</section>'


# ------------------------------------------------------------------ slides
def s_cover():
    panels = "".join(
        f'<div class="cv-panel" style="background:{META[c]["dark"]}">{inline(c, "icon", "white", "cv-ic")}'
        f'<span dir="ltr">{META[c]["num"]} {META[c]["en"]}</span></div>' for c in ORDER)
    body = f'''
    <div class="cv-text">
      <span class="eyebrow" dir="ltr">MR. BOMA · FAIR TRADE</span>
      <h1>تطوير الشعار<br>والهوية البصرية</h1>
      <p class="cv-sub">تلات اتجاهات مقترحة للشعار</p>
      <div class="cv-meta"><span>الجولة التانية</span><span>نوفمبر 2026</span></div>
    </div>
    <div class="cv-panels">{panels}</div>'''
    return slide(body, "cover", chrome=False)


def s_brief():
    body = f'''
    <div class="two">
      <div class="col text">
        <span class="kicker">نقطة البداية</span>
        <h2>شركة واحدة، أنشطة كتير، ومحتاجة شعار يشيلهم كلهم</h2>
        <p class="body">مستر بوما شركة تجارية متعددة الأنشطة: عقارات، استثمار، تمويل وتقسيط. الشعار الجديد لازم يبان شركة كبيرة وموثوقة، ويتقري بسهولة على اللافتة وفي صورة البروفايل، ويتطبع بلونين من غير مشاكل.</p>
        <h3 class="sub">ملاحظات على الشعار الحالي</h3>
        <ul class="issues">
          <li><b>ألوان كتير</b><span>الخطوط الملونة جوه الحروف بتصعّب القراية والطباعة</span></li>
          <li><b>تفاصيل بتختفي</b><span>الشمس والسقف المخطط مش بيبانوا في المقاس الصغير</span></li>
          <li><b>خط عادي</b><span>مش مميز ومش بيدي إحساس مؤسسة مالية</span></li>
          <li><b>غلطة إملائية</b><span dir="ltr">installmnts → INSTALLMENTS</span></li>
        </ul>
      </div>
      <figure class="col old"><img src="data:image/jpeg;base64,{OLD}" alt="الشعار الحالي"><figcaption>الشعار الحالي</figcaption></figure>
    </div>'''
    return slide(body, "brief")


def s_overview():
    cols = "".join(f'''
      <div class="ov-col" style="{kvars(c)}">
        <div class="ov-board" style="background:var(--k-light)">{inline(c, "stacked", "color", "lk-s")}</div>
        <div class="ov-cap"><span class="ov-num" dir="ltr">{META[c]["num"]}</span><div><b dir="ltr">{META[c]["en"]}</b> <span>{META[c]["ar"]}</span><small>{META[c]["tone"]}</small></div></div>
      </div>''' for c in ORDER)
    body = f'''<div class="head"><span class="kicker">نظرة عامة</span><h2>تلات اتجاهات، تلات شخصيات مختلفة</h2></div>
    <div class="ov">{cols}</div>'''
    return slide(body, "overview")


def s_intro(cid):
    m = META[cid]
    means = "".join(f"<li><b>{a}</b><span>{b}</span></li>" for a, b in m["means"])
    body = f'''
    <div class="in-text">
      <span class="in-num" dir="ltr">{m["num"]}</span>
      <h2><span dir="ltr" class="lat">{m["en"]}</span> <small>{m["ar"]}</small></h2>
      <p class="tone">{m["tone"]}</p>
      <p class="body">{m["idea"]}</p>
      <ul class="in-means">{means}</ul>
    </div>
    <div class="in-board" style="background:var(--k-light)">{inline(cid, "horizontal", "color", "lk-h")}</div>'''
    return slide(body, "intro", style=kvars(cid))


def s_variants(cid):
    m = META[cid]
    body = f'''<div class="head"><span class="kicker" dir="ltr">{m["num"]} {m["en"]}</span><h2>نسخ الشعار</h2></div>
    <div class="vg">
      <figure class="v v-rev" style="background:var(--k-dark)">{inline(cid, "horizontal", "white", "lk-h")}<figcaption>الأساسية معكوسة على اللون الغامق</figcaption></figure>
      <figure class="v v-st" style="background:var(--k-light)">{inline(cid, "stacked", "color", "lk-s")}<figcaption>الرأسية</figcaption></figure>
      <figure class="v v-ic" style="background:#ECEAE6">
        <div class="icon-row">
          <div class="app" style="background:var(--k-dark)">{inline(cid, "icon", "white", "ic")}</div>
          <div class="avatar" style="background:var(--k-light)">{inline(cid, "icon", "color", "ic")}</div>
          <div class="tiny"><div class="fav">{inline(cid, "mini", "color", "ic")}</div><span dir="ltr">32 px</span></div>
          <div class="tiny"><div class="fav f16">{inline(cid, "mini", "color", "ic")}</div><span dir="ltr">16 px</span></div>
        </div>
        <figcaption>أيقونة التطبيق والبروفايل والمتصفح</figcaption></figure>
      <figure class="v v-mono" style="background:#FFFFFF">{inline(cid, "horizontal", "black", "lk-h")}<figcaption>لون واحد للأختام والحفر والفاكس</figcaption></figure>
    </div>'''
    return slide(body, "variants", style=kvars(cid))


def s_mockups(cid):
    m = META[cid]
    icon_w = inline(cid, "icon", "white", "ic")
    icon_c = inline(cid, "icon", "color", "ic")
    body = f'''<div class="head"><span class="kicker" dir="ltr">{m["num"]} {m["en"]}</span><h2>الشعار على أرض الواقع</h2></div>
    <div class="mk">
      <figure><div class="scene desk">
        <div class="card back" lang="en" dir="ltr"><div class="cb-in">
          <div class="cb-logo">{inline(cid, "horizontal", "color", "lk-h")}</div>
          <div class="cb-info"><div><b>Full Name</b><span>General Manager</span></div>
          <div class="cb-c"><span>+20 100 000 0000</span><span>info@mrboma.com</span></div></div>
        </div><i class="cb-strip"></i></div>
        <div class="card front">{inline(cid, "stacked", "white", "lk-s")}</div>
      </div><figcaption>كارت البيزنس</figcaption></figure>
      <figure><div class="scene shop">
        <div class="lamps"><i></i><i></i><i></i></div>
        <div class="fascia">{inline(cid, "horizontal", "white", "lk-h")}</div>
        <div class="glass"><div class="pane"></div><div class="pane door"><div class="decal">{icon_w}</div></div><div class="pane"></div></div>
        <div class="pave"></div>
      </div><figcaption>لافتة واجهة الفرع</figcaption></figure>
      <figure><div class="scene social">
        <div class="phone" lang="en" dir="ltr">
          <div class="cover"></div>
          <div class="avatar big" style="background:var(--k-light)">{icon_c}</div>
          <div class="p-name">Mr. Boma</div>
          <div class="p-handle">@mrboma · Investment · Financing · Installments</div>
          <div class="p-btn">Follow</div>
          <div class="grid">
            <div class="post a">{icon_w}</div><div class="post b"><span>Real<br>Estate</span></div>
            <div class="post c"><span>Easy<br>Installments</span></div><div class="post b"><span>Smart<br>Investment</span></div>
            <div class="post a pat"></div><div class="post d">{icon_c}</div>
          </div>
        </div>
      </div><figcaption>بروفايل السوشيال ميديا</figcaption></figure>
    </div>'''
    return slide(body, "mockups", style=kvars(cid))


def s_system(cid):
    m = META[cid]
    sw = "".join(f'<div class="sw2"><i style="background:{h}"></i><b dir="ltr">{n}</b><span dir="ltr">HEX {h}</span><span dir="ltr">RGB {r}</span></div>'
                 for n, h, r in m["colors"])
    fonts = "".join(f'''<div class="ty"><span class="ty-big" dir="ltr" style="font-family:{f}">Aa</span>
        <div><b dir="ltr">{n}</b><span>{u}</span><span class="ty-abc" dir="ltr" style="font-family:{f}">ABCDEFGHIJKLM 0123456789</span></div></div>'''
                    for n, u, f in m["fonts"])
    fit = "".join(f"<li>{x}</li>" for x in m["fit"])
    body = f'''<div class="head"><span class="kicker" dir="ltr">{m["num"]} {m["en"]}</span><h2>الألوان والخطوط</h2></div>
    <div class="sys">
      <div class="sys-col"><h3 class="sub">الألوان</h3><div class="sws2">{sw}</div></div>
      <div class="sys-col"><h3 class="sub">الخطوط</h3>{fonts}
        <h3 class="sub">النقشة المساعدة</h3><div class="pat-tile"></div></div>
      <div class="sys-col fitbox"><h3 class="sub">الاتجاه ده مناسب لو</h3><ul class="fit2">{fit}</ul></div>
    </div>'''
    return slide(body, "system", style=kvars(cid))


def s_compare():
    th = "".join(f'<th style="{kvars(c)}"><div class="th-logo" style="background:var(--k-light)">{inline(c, "icon", "color", "ic")}</div><span dir="ltr">{META[c]["num"]} {META[c]["en"]}</span></th>' for c in ORDER)
    body = f'''<div class="head"><span class="kicker">المقارنة</span><h2>إزاي نختار؟</h2></div>
    <div class="cmp">
      <table>
        <thead><tr><th></th>{th}</tr></thead>
        <tbody>
          <tr><td>الإحساس</td><td>فخامة وعراقة</td><td>قوة وسرعة</td><td>دفء وقرب</td></tr>
          <tr><td>الصلة بالشعار القديم</td><td>ضعيفة (بداية جديدة)</td><td>الشباك واللون البرتقالي</td><td>قوية (الشمس والبيت والأرض)</td></tr>
          <tr><td>بيعبّر عن تعدد الأنشطة</td><td>عالي</td><td>عالي</td><td>متوسط (عقار أكتر)</td></tr>
          <tr><td>وضوحه في المقاس الصغير</td><td>جيد</td><td>ممتاز</td><td>ممتاز</td></tr>
          <tr><td>سهولة التطريز والحفر</td><td>متوسطة</td><td>ممتازة</td><td>جيدة</td></tr>
        </tbody>
      </table>
      <div class="rec">
        <span class="kicker">ترشيحنا</span>
        <p class="rec-main"><b dir="ltr">02 Momentum</b></p>
        <p class="body">أوضح رمز في المقاس الصغير، وأقوى على اللافتة والسوشيال، ومناسب لشركة متعددة الأنشطة ناوية تكبر.</p>
        <p class="body muted">لو الأولوية إن العملا الحاليين يفضلوا عارفين الشعار، يبقى <b dir="ltr">Horizon</b>. ولو الشركة متجهة للعقارات الراقية والمستثمرين، يبقى <b dir="ltr">Heritage</b>.</p>
      </div>
    </div>
    <p class="fine">البيانات على الكروت والبروفايلات في النماذج افتراضية للعرض بس.</p>'''
    return slide(body, "compare")


def s_next():
    steps = [("اختيار الاتجاه", "تختاروا اتجاه واحد، أو تقولوا التعديلات اللي محتاجينها"),
             ("التعديلات النهائية", "جولة تظبيط على الرمز والألوان لحد الاعتماد"),
             ("دليل الهوية", "نسخ الشعار، المساحة الآمنة، أقل مقاس، الاستخدامات الممنوعة، أكواد الطباعة"),
             ("المطبوعات", "كارت، ورق رسمي، ظرف، فاتورة، عقد تقسيط، ملف عروض"),
             ("الديجيتال والفرع", "قوالب السوشيال، لافتة الواجهة، رول أب، يونيفورم، ختم")]
    li = "".join(f'<li><span class="st-n" dir="ltr">{i + 1}</span><div><b>{a}</b><span>{b}</span></div></li>' for i, (a, b) in enumerate(steps))
    body = f'''<div class="nx">
      <div class="nx-text"><span class="kicker">الخطوات الجاية</span><h2>من الشعار للهوية الكاملة</h2>
        <p class="body">بعد ما تختاروا الاتجاه، نبني عليه نظام هوية متكامل يتطبق على كل حاجة بتطلع باسم الشركة.</p></div>
      <ol class="steps2">{li}</ol>
    </div>'''
    return slide(body, "next", dark=True)


slides = [s_cover(), s_brief(), s_overview()]
for c in ORDER:
    slides += [s_intro(c), s_variants(c), s_mockups(c), s_system(c)]
slides += [s_compare(), s_next()]
assert _page[0] == TOTAL, _page[0]

DECK_CSS = (HERE / "deck.css").read_text()
html = f'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<title>Mr. Boma — Logo Concepts</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Bodoni+Moda:wght@600&family=Jost:wght@400;500&family=Outfit:wght@400;600;700&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap">
<style>{ICON_CSS}{MOCK_CSS}{DECK_CSS}</style></head><body>{"".join(slides)}</body></html>'''
(ROOT / "deck.html").write_text(html)
print("slides:", _page[0], "bytes:", len(html))
