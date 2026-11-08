"""Builds the Mr. Boma logo files and the presentation page.

Run:  python3 build.py   (from this folder)
Out:  ../logos/*.svg  and  ../logo-concepts-v2.html
"""
import itertools
from pathlib import Path
from urllib.parse import quote
from lockups import CONCEPTS, svg

ROOT = Path(__file__).resolve().parent.parent
LOGOS = ROOT / "logos"
LOGOS.mkdir(exist_ok=True)
_uid = itertools.count()


def render(cid, kind, variant):
    C = CONCEPTS[cid]
    c = C["P"][variant]
    if cid == "horizon":
        return C[kind](c, f"clip{next(_uid)}")
    return C[kind](c)


# ------------------------------------------------------------- logo files
FILES = []


def write_logos():
    for cid in CONCEPTS:
        kinds = ("horizontal", "stacked", "icon") + (("mini",) if cid == "heritage" else ())
        for kind in kinds:
            for variant in ("color", "white", "black"):
                inner, w, h = render(cid, kind, variant)
                pad = 24 if kind not in ("icon", "mini") else 12
                bg = CONCEPTS[cid]["P"]["white"]["bg"] if variant == "white" else None
                name = f"mr-boma-{cid}-{kind}-{variant}.svg"
                (LOGOS / name).write_text(svg(inner, w, h, pad=pad, bg=bg))
                FILES.append(name)


def inline(cid, kind, variant, cls="", style=""):
    inner, w, h = render(cid, kind, variant)
    return f'<svg class="{cls}" style="{style}" viewBox="0 0 {w:.2f} {h:.2f}" role="img" aria-label="Mr. Boma logo">{inner}</svg>'


def data_uri(svgtext):
    return "url('data:image/svg+xml," + quote(svgtext, safe="") + "')"


# ------------------------------------------------------------- patterns
PATTERNS = {
    "heritage": '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">'
                '<path d="M6 50 V22 A14 14 0 0 1 34 22 V50" fill="none" stroke="#B8955A" stroke-opacity=".35" stroke-width="1"/></svg>',
    "momentum": '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">'
                '<path d="M8 6 L20 18 L8 30" fill="none" stroke="#FFFFFF" stroke-opacity=".10" stroke-width="5"/></svg>',
    "horizon": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">'
               '<rect y="0" width="20" height="6" fill="#FBF6EC" fill-opacity=".10"/></svg>',
}

META = {
    "heritage": dict(
        num="01", en="Heritage", ar="الأصالة", tone="فاخر · مؤسسي · ثقة",
        dark="#0F2340", light="#F5F0E6", accent="#B8955A", ink="#0F2340",
        head="'Bodoni Moda', Georgia, serif", body="'Jost', 'Helvetica Neue', sans-serif",
        idea="حرفين M وB بخط كلاسيكي بيشتركوا في عمود واحد، كرمز للشراكة بين الشركة والعميل. حواليهم قوس مدخل (باب البيت)، وفوق القوس حجر المفتاح (Keystone)، وهو الحجر اللي بيشيل القوس كله.",
        means=[("القوس", "مدخل البيت، يعني العقار والأمان"), ("العمود المشترك", "شراكة وثقة متبادلة"), ("حجر المفتاح", "الشركة هي الأساس اللي بيشيل الاستثمار")],
        fit=["مستثمرين وبنوك وشركاء", "عقارات راقية ومشاريع كبيرة", "شكل مؤسسة عريقة من أول يوم"],
        colors=[("Midnight Navy", "#0F2340", "15 · 35 · 64"), ("Champagne Gold", "#B8955A", "184 · 149 · 90"), ("Ivory", "#F5F0E6", "245 · 240 · 230")],
        fonts=[("Bodoni Moda", "الاسم والعناوين", "'Bodoni Moda'"), ("Jost", "النصوص والسطر التعريفي", "'Jost'")],
    ),
    "momentum": dict(
        num="02", en="Momentum", ar="الانطلاق", tone="عصري · جريء · تجاري",
        dark="#0A3A6B", light="#FFFFFF", accent="#F28C28", ink="#0A3A6B",
        head="'Outfit', 'Helvetica Neue', sans-serif", body="'Outfit', 'Helvetica Neue', sans-serif",
        idea="حرف B مصمت بزوايا مشطوفة شبه بلوكات البنا، والفراغ اللي جواه على شكل بيت فيه شباك برتقالي، والشباك جاي من الشعار القديم. النقطة البرتقالي في الاسم بتربط الرمز بالكتابة.",
        means=[("الحرف المصمت", "ملاءة مالية وثبات"), ("البيت في الفراغ", "العقار في قلب الشركة"), ("الزوايا لقدام", "حركة تجارة ونمو")],
        fit=["شركة متعددة الأنشطة عايزة تكبر بسرعة", "تطبيق أو منصة تقسيط أونلاين", "إعلانات سوشيال قوية ولافتة واضحة من بعيد"],
        colors=[("Deep Blue", "#0A3A6B", "10 · 58 · 107"), ("Signal Orange", "#F28C28", "242 · 140 · 40"), ("Slate", "#4C6A8C", "76 · 106 · 140"), ("Cloud", "#EEF3F9", "238 · 243 · 249")],
        fonts=[("Outfit Bold", "الاسم والعناوين", "'Outfit'"), ("Outfit Regular", "النصوص والسطر التعريفي", "'Outfit'")],
    ),
    "horizon": dict(
        num="03", en="Horizon", ar="الأفق", tone="دافي · قريب · تطوير للقديم",
        dark="#1E5B45", light="#FBF6EC", accent="#F2A541", ink="#1E5B45",
        head="'Plus Jakarta Sans', 'Helvetica Neue', sans-serif", body="'Plus Jakarta Sans', 'Helvetica Neue', sans-serif",
        idea="الشمس والبيت والأرض من الشعار القديم في ختم دايري واحد. الأرض بقت خطوط أفقية بتصغر واحد ورا التاني، زي الأقساط اللي بتخلص قسط بعد قسط. البيت محفور جوه الشمس وفيه نفس الشباك.",
        means=[("الشمس", "بداية جديدة وتفاؤل"), ("الخطوط", "أقساط بتخلص خطوة بخطوة"), ("البيت المحفور", "بيت العميل هو الهدف")],
        fit=["عملا عارفين الشعار القديم", "أسر وأفراد بيقسطوا", "شكل ودود وقريب من الناس"],
        colors=[("Evergreen", "#1E5B45", "30 · 91 · 69"), ("Sun Amber", "#F2A541", "242 · 165 · 65"), ("Deep Amber", "#D98A1E", "217 · 138 · 30"), ("Cream", "#FBF6EC", "251 · 246 · 236")],
        fonts=[("Plus Jakarta Sans ExtraBold", "الاسم والعناوين", "'Plus Jakarta Sans'"), ("Plus Jakarta Sans SemiBold", "النصوص والسطر التعريفي", "'Plus Jakarta Sans'")],
    ),
}


def concept_section(cid):
    m = META[cid]
    style = (f"--k-dark:{m['dark']};--k-light:{m['light']};--k-accent:{m['accent']};--k-ink:{m['ink']};"
             f"--k-head:{m['head']};--k-body:{m['body']};--k-pattern:{data_uri(PATTERNS[cid])}")
    means = "".join(f"<li><b>{a}</b><span>{b}</span></li>" for a, b in m["means"])
    fit = "".join(f"<li>{x}</li>" for x in m["fit"])
    sw = "".join(f'<div class="sw"><i style="background:{h}"></i><b dir="ltr">{n}</b><span dir="ltr">{h}</span><span dir="ltr">RGB {r}</span></div>'
                 for n, h, r in m["colors"])
    fonts = "".join(f'<div class="fs"><span class="fs-sample" dir="ltr" style="font-family:{f}">Aa Bb 123</span><b dir="ltr">{n}</b><span>{u}</span></div>'
                    for n, u, f in m["fonts"])
    icon_w = inline(cid, "icon", "white", "ic")
    icon_c = inline(cid, "icon", "color", "ic")
    mini_c = inline(cid, "mini", "color", "ic")
    return f'''
<section class="concept" id="{cid}" style="{style}">
  <div class="c-head">
    <div class="c-title">
      <span class="c-num" dir="ltr">{m['num']}</span>
      <div><h2><span dir="ltr">{m['en']}</span> <small>{m['ar']}</small></h2><p class="c-tone">{m['tone']}</p></div>
    </div>
    <p class="c-idea">{m['idea']}</p>
  </div>

  <div class="hero" style="background:var(--k-light)">
    {inline(cid, "horizontal", "color", "lk-h")}
  </div>

  <ul class="means">{means}</ul>

  <div class="trio">
    <figure class="tile" style="background:var(--k-dark)">{inline(cid, "horizontal", "white", "lk-h sm")}<figcaption>النسخة المعكوسة</figcaption></figure>
    <figure class="tile" style="background:var(--k-light)">{inline(cid, "stacked", "color", "lk-s")}<figcaption class="dk">النسخة الرأسية</figcaption></figure>
    <figure class="tile icons" style="background:#ECEAE6">
      <div class="icon-row">
        <div class="app" style="background:var(--k-dark)">{icon_w}</div>
        <div class="avatar" style="background:var(--k-light)">{icon_c}</div>
        <div class="tiny"><div class="fav">{mini_c}</div><span dir="ltr">32</span></div>
        <div class="tiny"><div class="fav f16">{mini_c}</div><span dir="ltr">16</span></div>
      </div>
      <figcaption class="dk">أيقونة التطبيق والبروفايل والمتصفح</figcaption>
    </figure>
  </div>

  <div class="trio mock">
    <figure class="scene desk">
      <div class="card back" lang="en" dir="ltr"><div class="cb-in">
        <div class="cb-logo">{inline(cid, "horizontal", "color", "lk-h")}</div>
        <div class="cb-info">
          <div><b>Full Name</b><span>General Manager</span></div>
          <div class="cb-c"><span>+20 100 000 0000</span><span>info@mrboma.com</span></div>
        </div>
      </div><i class="cb-strip"></i></div>
      <div class="card front">{inline(cid, "stacked", "white", "lk-s")}</div>
      <figcaption>كارت البيزنس</figcaption>
    </figure>
    <figure class="scene shop">
      <div class="lamps"><i></i><i></i><i></i></div>
      <div class="fascia">{inline(cid, "horizontal", "white", "lk-h")}</div>
      <div class="glass"><div class="pane"></div><div class="pane door"><div class="decal">{icon_w}</div></div><div class="pane"></div></div>
      <div class="pave"></div>
      <figcaption>لافتة واجهة الفرع</figcaption>
    </figure>
    <figure class="scene social">
      <div class="phone" lang="en" dir="ltr">
        <div class="cover"></div>
        <div class="avatar big" style="background:var(--k-light)">{icon_c}</div>
        <div class="p-name">Mr. Boma</div>
        <div class="p-handle">@mrboma · Investment · Financing · Installments</div>
        <div class="p-btn">Follow</div>
        <div class="grid">
          <div class="post a">{icon_w}</div>
          <div class="post b"><span>Real<br>Estate</span></div>
          <div class="post c"><span>Easy<br>Installments</span></div>
          <div class="post b"><span>Smart<br>Investment</span></div>
          <div class="post a pat"></div>
          <div class="post d">{icon_c}</div>
        </div>
      </div>
      <figcaption>بروفايل السوشيال ميديا</figcaption>
    </figure>
  </div>

  <div class="specs">
    <div class="spec"><h3>الألوان</h3><div class="sws">{sw}</div></div>
    <div class="spec"><h3>الخطوط</h3><div class="fss">{fonts}</div></div>
    <div class="spec"><h3>مناسب لو</h3><ul class="fit">{fit}</ul>
      <div class="mono">{inline(cid, "horizontal", "black", "lk-h")}</div><span class="mono-cap">نسخة لون واحد للأختام والفاكس والحفر</span></div>
  </div>
</section>'''


CSS = (Path(__file__).parent / "page.css").read_text()

page = f'''<title>Mr. Boma Logo Concepts</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Bodoni+Moda:wght@600&family=Jost:wght@400;500&family=Outfit:wght@400;600;700&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap">
<style>{CSS}</style>
<div class="wrap">
<header class="top">
  <span class="eyebrow" dir="ltr">MR. BOMA · LOGO DEVELOPMENT · ROUND 2</span>
  <h1>تلات اتجاهات لشعار مستر بوما</h1>
  <p class="lead">كل اتجاه ليه رمز وخط وألوان مختلفة، وكل الكتابة جوه الشعار بالإنجليزي. الاتجاه معروض بالألوان، ومعكوس على خلفية غامقة، وكأيقونة، وعلى كارت بيزنس ولافتة الفرع والسوشيال ميديا، عشان تحكموا عليه وهو شغال فعلًا.</p>
  <nav class="jump">
    <a href="#heritage"><span dir="ltr">01 Heritage</span> الأصالة</a>
    <a href="#momentum"><span dir="ltr">02 Momentum</span> الانطلاق</a>
    <a href="#horizon"><span dir="ltr">03 Horizon</span> الأفق</a>
  </nav>
</header>

{concept_section("heritage")}
{concept_section("momentum")}
{concept_section("horizon")}

<section class="compare">
  <h2>مقارنة بين الاتجاهات</h2>
  <div class="tablebox"><table>
    <thead><tr><th>المعيار</th><th dir="ltr">01 Heritage</th><th dir="ltr">02 Momentum</th><th dir="ltr">03 Horizon</th></tr></thead>
    <tbody>
      <tr><td>الإحساس</td><td>فخامة وعراقة</td><td>قوة وسرعة</td><td>دفء وقرب</td></tr>
      <tr><td>الصلة بالشعار القديم</td><td>ضعيفة (بداية جديدة)</td><td>الشباك واللون البرتقالي</td><td>قوية (الشمس والبيت والأرض)</td></tr>
      <tr><td>بيعبّر عن تعدد الأنشطة</td><td>عالي (الاسم هو البطل)</td><td>عالي</td><td>متوسط (عقار أكتر)</td></tr>
      <tr><td>وضوحه في الأيقونة الصغيرة</td><td>جيد</td><td>ممتاز</td><td>ممتاز</td></tr>
      <tr><td>سهولة التطريز والحفر</td><td>متوسطة (خطوط رفيعة)</td><td>ممتازة</td><td>جيدة</td></tr>
      <tr><td>الألوان الأساسية</td><td>كحلي ودهبي</td><td>أزرق وبرتقالي</td><td>أخضر وكهرماني</td></tr>
    </tbody>
  </table></div>
  <div class="rec">
    <b>ترشيحنا</b>
    <p>اتجاه <b dir="ltr">Momentum</b> لشركة متعددة الأنشطة ناوية تكبر: أوضح رمز في المقاس الصغير، وأقوى على اللافتة والسوشيال. لو الأولوية إن العملا الحاليين يفضلوا عارفين الشعار، يبقى <b dir="ltr">Horizon</b>. ولو الشركة متجهة للعقارات الراقية والمستثمرين، يبقى <b dir="ltr">Heritage</b>.</p>
  </div>
  <p class="note">بيانات الكارت والبروفايل في النماذج افتراضية للعرض بس.</p>
</section>

<section class="next">
  <h2>بعد اختيار الاتجاه</h2>
  <div class="steps">
    <div><b>دليل الهوية</b><span>نسخ الشعار، المساحة الآمنة، أقل مقاس، الاستخدامات الممنوعة</span></div>
    <div><b>نظام الألوان والخطوط</b><span>أكواد الطباعة (CMYK وPantone) والشاشة، وتدرج أحجام الخطوط بالعربي والإنجليزي</span></div>
    <div><b>المطبوعات</b><span>كارت، ورق رسمي، ظرف، فاتورة، عقد تقسيط، ملف عروض</span></div>
    <div><b>السوشيال ميديا</b><span>بروفايل، غلاف، قوالب بوست وستوري وريلز</span></div>
    <div><b>الفرع</b><span>لافتة الواجهة، رول أب، يونيفورم، ختم الشركة</span></div>
  </div>
</section>
</div>
'''
if __name__ == "__main__":
    write_logos()
    (ROOT / "logo-concepts-v2.html").write_text(page)
    print("logos:", len(FILES), "page bytes:", len(page))
