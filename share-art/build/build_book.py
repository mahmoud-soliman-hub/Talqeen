"""Build the SHARE ART brand guidelines as one HTML file (1920x1080 pages)."""
import os, json, math

HERE = os.path.dirname(os.path.abspath(__file__))
P = json.load(open(os.path.join(HERE, 'palette.json')))
G = json.load(open(os.path.join(HERE, 'geometry.json')))
SIZES = json.load(open(os.path.join(HERE, '..', 'logo', 'sizes.json')))
DEEP, TEAL, AQUA, MIST, INK, WHITE, PEARL = (P[k] for k in ('deep', 'teal', 'aqua', 'mist', 'ink', 'white', 'pearl'))
MW, MH, MOD, S = G['w'], G['h'], G['module'], G['S']

CONTACT = {'web': 'www.shareart.sa', 'mail': 'hello@shareart.sa', 'phone': '+966 5X XXX XXXX', 'handle': '@shareart'}

# ---------------------------------------------------------------- primitives
def pts(poly, k=1.0, ox=0, oy=0):
    return ' '.join(f'{x*k+ox:.2f},{y*k+oy:.2f}' for x, y in poly)

def mark(h, top=AQUA, bot=DEEP, style='', cls='', stroke=None, sw=2):
    w = h * MW / MH
    if stroke:
        fill = f'fill="none" stroke="{stroke}" stroke-width="{sw}" vector-effect="non-scaling-stroke"'
        a = b = fill
    else:
        a, b = f'fill="{top}"', f'fill="{bot}"'
    return (f'<svg class="{cls}" style="{style}" width="{w:.1f}" height="{h:.1f}" viewBox="0 0 {MW:.2f} {MH:.2f}">'
            f'<polygon {a} points="{pts(G["top"])}"/><polygon {b} points="{pts(G["bot"])}"/></svg>')

def logo(name, h=None, w=None, style=''):
    lw, lh = SIZES[name]
    if h and not w: w = h * lw / lh
    if w and not h: h = w * lh / lw
    return f'<img class="lg" src="trim/{name}.svg" style="width:{w:.1f}px;height:{h:.1f}px;{style}">'

def uv_to_xy(u, v):
    x0 = min((a + b) / 2 for a, b in G['top_uv'] + [(S - a, S - b) for a, b in G['top_uv']])
    y0 = min((a - b) / 2 for a, b in G['top_uv'] + [(S - a, S - b) for a, b in G['top_uv']])
    return (((u + v) / 2 - x0) * MOD, ((u - v) / 2 - y0) * MOD)

def pattern_svg(w, h, cell=180, color=WHITE, op=0.07, sw=1.2, pid='p'):
    """Outline marks tiled on a 45-degree lattice: the 'Share Grid' pattern."""
    k = cell / MH
    mw = MW * k
    tile = (f'<pattern id="{pid}" width="{mw*1.6:.1f}" height="{cell*1.1:.1f}" patternUnits="userSpaceOnUse">'
            f'<g fill="none" stroke="{color}" stroke-width="{sw}" opacity="{op}">'
            f'<polygon points="{pts(G["top"], k)}"/><polygon points="{pts(G["bot"], k)}"/>'
            + ''.join(f'<g transform="translate({dx:.1f},{dy:.1f})"><polygon points="{pts(G["top"], k)}"/><polygon points="{pts(G["bot"], k)}"/></g>'
                      for dx in (mw*0.8, mw*0.8 - mw*1.6) for dy in (cell*0.55, cell*0.55 - cell*1.1)) +
            f'</g></pattern>')
    return (f'<svg class="bgpat" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><defs>{tile}</defs>'
            f'<rect width="{w}" height="{h}" fill="url(#{pid})"/></svg>')

def flow_lines(w, h, color=WHITE, op=0.12, n=7, step=46, cx=None, cy=None, scale=1.0, sw=1.5):
    """Concentric echoes of the mark outline, recalling the flowing lines of the reference artwork."""
    cx = w * 0.7 if cx is None else cx
    cy = h * 0.5 if cy is None else cy
    out = []
    for i in range(n):
        k = scale * (1 + i * step / MH)
        ox, oy = cx - MW * k / 2, cy - MH * k / 2
        o = op * (1 - i / (n + 1))
        out.append(f'<g fill="none" stroke="{color}" stroke-width="{sw}" opacity="{o:.3f}">'
                   f'<polygon points="{pts(G["top"], k, ox, oy)}"/><polygon points="{pts(G["bot"], k, ox, oy)}"/></g>')
    return f'<svg class="bgpat" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{"".join(out)}</svg>'

# ---------------------------------------------------------------- page chrome
PAGES = []
def page(body, cls='', num=True, section='', dark=False):
    n = len(PAGES) + 1
    chrome = ''
    if num:
        lg = 'mark-mono-white' if dark else 'mark-color'
        chrome = (f'<div class="chrome top"><div class="crumb">{section}</div>'
                  f'<div class="brandtag">{logo(lg, h=26)}<span>SHARE ART · Brand Guidelines</span></div></div>'
                  f'<div class="chrome bottom"><span class="pg">{n:02d}</span><span>دليل الهوية البصرية — الإصدار 1.0 — 2026</span></div>')
    PAGES.append(f'<section class="page {cls} {"dark" if dark else ""}">{body}{chrome}</section>')

def head(no, ar, en, lead='', cls=''):
    return (f'<div class="head {cls}"><div class="eyebrow"><b>{no}</b><span>{en}</span></div>'
            f'<h1>{ar}</h1>' + (f'<p class="lead">{lead}</p>' if lead else '') + '</div>')

# ---------------------------------------------------------------- pages
SECTIONS = [
    ('01', 'عن شير آرت', 'About'), ('02', 'فكرة الشعار', 'Concept'), ('03', 'تطوير الشعار', 'Refinement'),
    ('04', 'بناء الرمز', 'Construction'), ('05', 'الشعار الرئيسي', 'Primary Logo'), ('06', 'تكوينات الشعار', 'Lockups'),
    ('07', 'الكتابة الشعارية', 'Wordmark'), ('08', 'المساحة الآمنة والأحجام', 'Clear Space'), ('09', 'نسخ الشعار اللونية', 'Logo Colors'),
    ('10', 'الاستخدامات الخاطئة', 'Misuse'), ('11', 'لوحة الألوان', 'Color Palette'), ('12', 'نسب وتدرجات الألوان', 'Color Balance'),
    ('13', 'الخطوط', 'Typography'), ('14', 'العناصر الجرافيكية', 'Graphic Elements'), ('15', 'القرطاسية', 'Stationery'),
    ('16', 'السوشيال ميديا', 'Social Media'), ('17', 'الفيديو والموشن', 'Video & Motion'), ('18', 'التطبيقات', 'Applications'),
]
def sec(i): no, ar, en = SECTIONS[i - 1]; return f'<b>{no}</b> {ar} <i>{en}</i>'

# 1 — cover
page(f'''
<div class="cover-bg"></div>
{flow_lines(1920, 1080, WHITE, 0.16, n=9, step=70, cx=520, cy=540, scale=1.2)}
<div class="cover-mark">{mark(520, AQUA, WHITE)}</div>
<div class="cover-text">
  {logo('horizontal-reverse-deep', h=150)}
  <div class="cover-rule"></div>
  <h2>دليل الهوية البصرية</h2>
  <div class="en-cap">Brand Identity Guidelines</div>
</div>
<div class="cover-foot"><span>الإصدار 1.0</span><span>Version 1.0 — 2026</span><span>دعاية وإعلان · تصميم جرافيك · مطبوعات · فيديو</span></div>
''', cls='cover', num=False)

# 2 — contents
items = ''.join(f'<li><b>{no}</b><span class="ar">{ar}</span><span class="en">{en}</span></li>' for no, ar, en in SECTIONS)
page(f'''
<div class="toc-side">{flow_lines(640, 1080, WHITE, 0.18, n=6, step=60, cx=320, cy=540, scale=0.62)}
  <div class="toc-title"><div class="en-cap light">Contents</div><h1>المحتويات</h1></div></div>
<ol class="toc">{items}</ol>
''', cls='toc-page', section='المحتويات <i>Contents</i>')

# 3 — about
page(f'''
<div class="grid2">
 <div>
  {head('01', 'نشارك الفكرة<br>لنصنع الأثر', 'About Share Art',
        'شير آرت وكالة إبداعية متخصصة في الدعاية والإعلان، تصميم الجرافيك، المطبوعات وإنتاج الفيديو. نؤمن أن كل عمل عظيم يبدأ بالمشاركة: نشارك العميل رؤيته، ونشارك الفريق خياله، ونشارك الجمهور رسالة تُرى وتُتذكّر.')}
  <div class="quote">«الاسم وعدنا: <b>Share</b> مشاركة، و<b>Art</b> إتقان الصنعة.»</div>
 </div>
 <div class="services">
  <div class="svc"><span class="n">A</span><h3>الدعاية والإعلان</h3><p>حملات متكاملة من الفكرة حتى الانتشار.</p><i>Advertising</i></div>
  <div class="svc"><span class="n">B</span><h3>تصميم الجرافيك</h3><p>هويات بصرية ومحتوى يعكس شخصية العلامة.</p><i>Graphic Design</i></div>
  <div class="svc"><span class="n">C</span><h3>المطبوعات</h3><p>جودة تنفيذ تليق بالتفاصيل من الكارت إلى اللوحة.</p><i>Print</i></div>
  <div class="svc"><span class="n">D</span><h3>الفيديو</h3><p>إنتاج وموشن جرافيك يحرّك القصة.</p><i>Video</i></div>
 </div>
</div>
<div class="values">
 <div><b>مشاركة</b><i>Collaborative</i></div><div><b>إبداع</b><i>Creative</i></div>
 <div><b>دقة</b><i>Precise</i></div><div><b>ثقة</b><i>Confident</i></div><div><b>عصرية</b><i>Modern</i></div>
 <span class="vl">شخصية العلامة</span>
</div>
''', section=sec(1))

# 4 — concept
k = 300 / MH
page(f'''
{head('02', 'قطعتان متطابقتان<br>تصنعان معنى واحدًا', 'The Concept',
      'الرمز مكوّن من قطعتين متطابقتين تمامًا؛ لو أدرت إحداهما 180° انطبقت على الأخرى. تتشاركان المساحة نفسها لتكوّنا حرف <b>S</b>، أول حرف من <b>Share</b>. لا قطعة تكتمل وحدها، وهذه هي فلسفة الوكالة.', cls='narrow')}
<div class="concept-row">
  <div class="cstep"><svg width="165" height="215" viewBox="0 0 {MW:.0f} {MH:.0f}"><polygon fill="{AQUA}" points="{pts(G['top'])}" transform="translate(-60,-60)"/></svg><p>القطعة الأولى<br><i>Part one</i></p></div>
  <div class="plus">+</div>
  <div class="cstep"><svg width="165" height="215" viewBox="0 0 {MW:.0f} {MH:.0f}"><polygon fill="{DEEP}" points="{pts(G['bot'])}" transform="translate(60,60)"/></svg><p>القطعة الثانية (نفسها مقلوبة)<br><i>Same part, rotated 180°</i></p></div>
  <div class="plus">=</div>
  <div class="cstep big">{mark(240)}<p>رمز شير آرت<br><i>The Share mark</i></p></div>
</div>
<div class="meanings">
  <div><span class="ico">{mark(40)}</span><h4>حرف S</h4><p>الحرف الأول من Share، مرسوم بخط واحد متصل.</p></div>
  <div><span class="ico dia"></span><h4>المعيّن</h4><p>الشكل الخارجي جوهرة: القيمة والجودة والتميّز.</p></div>
  <div><span class="ico arr"></span><h4>زاوية 45°</h4><p>اتجاه صاعد للأمام: نمو وحركة وطموح.</p></div>
  <div><span class="ico two"></span><h4>الشراكة</h4><p>جزءان متساويان: العميل والوكالة، الفكرة والتنفيذ.</p></div>
</div>
''', section=sec(2))

# 5 — refinement
page(f'''
{head('03', 'من الفكرة إلى نظام دقيق', 'Logo Refinement',
      'حافظنا على روح الشعار المعتمد بالكامل، وأعدنا بناءه هندسيًا ليكون أنظف في الطباعة وأوضح في الأحجام الصغيرة.', cls='narrow')}
<div class="refine">
  <div class="rf"><div class="rf-box"><img src="assets/original.png"></div><h4>الشعار المعتمد</h4><i>Approved sketch</i></div>
  <div class="rf-arrow">←</div>
  <div class="rf"><div class="rf-box grid-bg">{mark(250, stroke=DEEP, sw=1.6)}</div><h4>إعادة البناء على الشبكة</h4><i>Rebuilt on a 45° grid</i></div>
  <div class="rf-arrow">←</div>
  <div class="rf"><div class="rf-box">{mark(250)}</div><h4>الرمز المطوّر</h4><i>Refined mark</i></div>
</div>
<ul class="checks">
  <li><b>سُمك موحّد</b>كل الأذرع بعرض وحدة واحدة <span class="x">X</span></li>
  <li><b>فراغات متساوية</b>كل المسافات الداخلية = ⅞ X</li>
  <li><b>تماثل كامل</b>القطعتان متطابقتان بدوران 180°</li>
  <li><b>زوايا دقيقة</b>كل الحواف على 45° بالضبط</li>
  <li><b>لونان للمعنى</b>لون لكل قطعة يُبرز فكرة الشراكة</li>
</ul>
''', section=sec(3))

# 6 — construction
def construction(hpx):
    k = hpx / MH
    pad = 40
    W, H = MW * k + pad * 2, MH * k + pad * 2
    def P(u, v):
        x, y = uv_to_xy(u, v); return x * k + pad, y * k + pad
    lines = []
    for i in range(0, int(S * 8) + 1):
        c = i / 8
        for a, b in (((c, 0), (c, S)), ((0, c), (S, c))):
            (x1, y1), (x2, y2) = P(*a), P(*b)
            lines.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" class="g1"/>')
    for c in (0, 1, 1.875, 2.875, 3.75, 4.75, 5.625, 6.625):
        for a, b in (((c, -0.4), (c, S + 0.4)), ((-0.4, c), (S + 0.4, c))):
            (x1, y1), (x2, y2) = P(*a), P(*b)
            lines.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" class="g2"/>')
    dia = ' '.join('%.1f,%.1f' % P(u, v) for u, v in ((0, 0), (S, 0), (S, S), (0, S)))
    cx, cy = P(S / 2, S / 2)
    # dimension labels
    ax, ay = P(0.5, S); bx, by = P(0.5, S - 1)
    gx, gy = P(1.4375, S - 1); hx, hy = P(1.4375, 4.75)
    body = (f'<svg width="{W:.0f}" height="{H:.0f}" viewBox="0 0 {W:.0f} {H:.0f}" style="overflow:visible">'
            f'<clipPath id="dc"><polygon points="{dia}"/></clipPath>'
            f'<g clip-path="url(#dc)">{"".join(lines[:len(lines)//1])}</g>'
            f'<polygon points="{dia}" fill="none" stroke="{TEAL}" stroke-width="1.5" stroke-dasharray="6 6"/>'
            f'<g transform="translate({pad},{pad}) scale({k:.5f})"><polygon fill="{AQUA}" fill-opacity=".85" points="{pts(G["top"])}"/>'
            f'<polygon fill="{DEEP}" fill-opacity=".85" points="{pts(G["bot"])}"/></g>'
            f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="7" fill="#fff" stroke="{INK}" stroke-width="2"/>'
            f'<line x1="{ax:.1f}" y1="{ay:.1f}" x2="{bx:.1f}" y2="{by:.1f}" class="dim"/>'
            f'<text x="{(ax+bx)/2-34:.1f}" y="{(ay+by)/2-8:.1f}" class="dl">X</text>'
            f'<line x1="{gx:.1f}" y1="{gy:.1f}" x2="{hx:.1f}" y2="{hy:.1f}" class="dim"/>'
            f'<text x="{(gx+hx)/2+16:.1f}" y="{(gy+hy)/2+6:.1f}" class="dl" direction="ltr">⅞X</text>'
            f'</svg>')
    return body
page(f'''
<div class="cons-wrap">
 <div class="cons-art">{construction(760)}</div>
 <div class="cons-txt">
  {head('04', 'شبكة البناء', 'Construction Grid',
        'الرمز مرسوم داخل معيّن مقسّم على شبكة بزاوية 45°. وحدة القياس الأساسية <b>X</b> هي عرض الذراع، وكل الأبعاد مشتقة منها.')}
  <table class="spec">
   <tr><td>عرض الذراع</td><td>X</td></tr>
   <tr><td>الفراغ بين الأذرع</td><td>⅞ X</td></tr>
   <tr><td>ضلع المعيّن الخارجي</td><td>6⅝ X</td></tr>
   <tr><td>زاوية كل الحواف</td><td>45°</td></tr>
   <tr><td>التماثل</td><td>دوراني 180° حول المركز ●</td></tr>
   <tr><td>نسبة العرض إلى الارتفاع</td><td>1 : 1.395</td></tr>
  </table>
 </div>
</div>
''', section=sec(4))

# 7 — primary logo
page(f'''
<div class="hero-logo">{logo('horizontal-color', h=330)}</div>
<div class="hero-cap">
 <div>{head('05', 'الشعار الرئيسي', 'Primary Logo')}</div>
 <p>التكوين الأفقي هو التوقيع الأساسي للعلامة ويُستخدم في أغلب التطبيقات. الاسم العربي والإنجليزي بنفس العرض بالضبط في كتلة واحدة متوازنة، يفصلها عن الرمز خط رفيع بلون الأكوا.</p>
</div>
''', cls='pearl', section=sec(5))

# 8 — lockups
page(f'''
{head('06', 'تكوينات الشعار', 'Logo Lockups', 'نظام مرن لكل مساحة واتجاه؛ اختر التكوين حسب شكل المساحة ولغة المحتوى.', cls='narrow')}
<div class="lockups">
  <div class="lk w2"><div class="lk-art">{logo('horizontal-color', h=130)}</div><b>أفقي — رئيسي</b><i>Horizontal · Primary</i></div>
  <div class="lk w2"><div class="lk-art">{logo('horizontal-ar-color', h=130)}</div><b>أفقي — للمحتوى العربي</b><i>Horizontal · RTL</i></div>
  <div class="lk tall"><div class="lk-art">{logo('vertical-color', h=300)}</div><b>عمودي</b><i>Stacked</i></div>
  <div class="lk w2"><div class="lk-art">{logo('signature-color', h=84)}</div><b>التوقيع المتماثل</b><i>Bilingual signature</i></div>
  <div class="lk"><div class="lk-art">{mark(150)}</div><b>الرمز منفردًا</b><i>Symbol</i></div>
  <div class="lk"><div class="lk-art" style="flex-direction:column;gap:18px">{logo('wordmark-ar-color', w=230)}{logo('wordmark-en-color', w=230)}</div><b>الاسم منفردًا</b><i>Wordmarks</i></div>
</div>
''', section=sec(6))

# 9 — wordmark
page(f'''
<div class="grid2 wm">
 <div>
  {head('07', 'الكتابة الشعارية', 'Wordmark',
        'الاسم مكتوب بخط <b>Readex Pro</b> بعد تحويله إلى مسارات. اخترناه لأن نقاط حروفه العربية مربعات مائلة 45°، أي أنها «رمز مصغّر» داخل الاسم نفسه.')}
  <ul class="facts">
   <li><b>العربي</b> Readex Pro Bold (700)</li>
   <li><b>الإنجليزي</b> Readex Pro SemiBold (600) · تباعد الحروف 30%</li>
   <li><b>المحاذاة</b> الاسمان بنفس العرض تمامًا في كل التكوينات</li>
  </ul>
 </div>
 <div class="wm-art">
  {logo('wordmark-ar-color', w=640)}
  {logo('wordmark-en-color', w=640, style='margin-top:40px')}
  <div class="dot-echo"><span class="dot"></span><span class="eq">=</span>{mark(110)}<em>نقطة الحرف تحمل زاوية الرمز نفسها</em></div>
 </div>
</div>
''', section=sec(7))

# 10 — clear space & min size
hx = 120  # px per X-unit for the diagram (X = 1/4 mark height)
lh = 320
X = lh / 4
lw = lh * SIZES['horizontal-color'][0] / SIZES['horizontal-color'][1]
page(f'''
{head('08', 'المساحة الآمنة', 'Clear Space & Minimum Size',
      'اترك حول الشعار مساحة خالية لا تقل عن <b>X</b> = ربع ارتفاع الرمز من كل الجهات.', cls='narrow')}
<div class="cs-row">
 <div class="cs-box" style="width:{lw+2*X:.0f}px;height:{lh+2*X:.0f}px">
   <div class="cs-inner" style="inset:{X:.0f}px"></div>
   <div style="position:absolute;inset:{X:.0f}px">{logo('horizontal-color', h=lh)}</div>
   <span class="xm" style="top:0;left:{X*2:.0f}px;height:{X:.0f}px">X</span>
   <span class="xm" style="bottom:0;left:{X*2:.0f}px;height:{X:.0f}px">X</span>
   <span class="xm h" style="left:0;top:{X*2:.0f}px;width:{X:.0f}px">X</span>
   <span class="xm h" style="right:0;top:{X*2:.0f}px;width:{X:.0f}px">X</span>
 </div>
 <div class="min">
  <h3>الحد الأدنى للحجم <i>Minimum size</i></h3>
  <div class="mi"><div class="mi-art">{logo('horizontal-color', h=30)}</div><p><b>أفقي</b> 35 مم طباعة · 140 بكسل شاشة</p></div>
  <div class="mi"><div class="mi-art">{logo('vertical-color', h=60)}</div><p><b>عمودي</b> 18 مم طباعة · 72 بكسل شاشة</p></div>
  <div class="mi"><div class="mi-art">{mark(26)}</div><p><b>الرمز</b> 6 مم طباعة · 20 بكسل شاشة</p></div>
 </div>
</div>
''', section=sec(8))

# 11 — color versions
def tile(bg, name, label, en, txt=INK, extra=''):
    return f'<div class="cv" style="background:{bg};color:{txt}">{extra}<div class="cv-art">{logo(name, h=110)}</div><b>{label}</b><i>{en}</i></div>'
page(f'''
{head('09', 'نسخ الشعار اللونية', 'Logo Color Versions', 'الملوّنة أولًا؛ المعكوسة على الخلفيات الداكنة والملوّنة؛ والأحادية للطباعة بلون واحد.', cls='narrow')}
<div class="cvs">
 {tile(WHITE, 'horizontal-color', 'الأساسية على الأبيض', 'Full color', extra='<span class="tag">الأفضل</span>')}
 {tile(PEARL, 'horizontal-color', 'على اللؤلؤي', 'On pearl')}
 {tile(DEEP, 'horizontal-reverse-deep', 'معكوسة على العمق', 'Reverse · Deep', WHITE)}
 {tile(TEAL, 'horizontal-reverse-teal', 'بيضاء على التركواز', 'Reverse · Teal', WHITE)}
 {tile(WHITE, 'horizontal-mono-ink', 'أحادية داكنة', 'Mono · Ink')}
 {tile(f'linear-gradient(135deg,{AQUA},{DEEP})', 'horizontal-mono-white', 'بيضاء على التدرّج', 'Mono · White', WHITE)}
</div>
''', section=sec(9))

# 12 — misuse
def bad(inner, label, bg=WHITE):
    return f'<div class="bad" style="background:{bg}"><div class="bad-art">{inner}</div><span class="no">✕</span><p>{label}</p></div>'
H0 = 'horizontal-color'
page(f'''
{head('10', 'الاستخدامات الخاطئة', 'Logo Misuse', 'للحفاظ على قوة العلامة تجنّب أي تعديل على الشعار. هذه أمثلة لما لا يجب فعله.', cls='narrow')}
<div class="bads">
 {bad(logo(H0, h=80, style='transform:scaleX(1.45)'), 'لا تمطّ الشعار أو تضغطه')}
 {bad(logo(H0, h=80, style='transform:rotate(-12deg)'), 'لا تُدِر الشعار')}
 {bad(logo('horizontal-mono-ink', h=80, style='filter:invert(20%) sepia(90%) saturate(3000%) hue-rotate(320deg)'), 'لا تغيّر ألوان الشعار')}
 {bad(logo(H0, h=80, style='filter:drop-shadow(8px 8px 6px rgba(0,0,0,.55))'), 'لا تضف ظلالًا أو مؤثرات')}
 {bad('<div style="display:flex;flex-direction:column;align-items:center;gap:8px">' + logo('wordmark-en-color', h=26) + '<div style="display:flex;align-items:flex-start;gap:10px">' + logo('wordmark-ar-color', h=58) + mark(34) + '</div></div>', 'لا تُعِد ترتيب العناصر')}
 {bad('<div style="display:flex;align-items:center;gap:18px">' + mark(80) + '<span style="font:56px/1 LZ;color:' + DEEP + '">شير آرت</span></div>', 'لا تكتب الاسم بخط آخر')}
 {bad(logo(H0, h=80), 'لا تضعه على خلفية بلا تباين', bg=TEAL)}
 {bad(logo(H0, h=80), 'لا تضعه على خلفية مزدحمة', bg=f'repeating-linear-gradient(45deg,{AQUA} 0 14px,#f7c948 14px 28px,{DEEP} 28px 42px)')}
</div>
''', section=sec(10))

# 13 — palette
def cmyk(h):
    r, g, b = (int(h[i:i+2], 16) / 255 for i in (1, 3, 5))
    k = 1 - max(r, g, b)
    if k >= 1: return '0 · 0 · 0 · 100'
    c, m, y = ((1 - x - k) / (1 - k) for x in (r, g, b))
    return ' · '.join(str(round(v * 100)) for v in (c, m, y, k))
def rgb(h): return ' · '.join(str(int(h[i:i+2], 16)) for i in (1, 3, 5))
def swatch(hexv, ar, en, pms, txt=WHITE, big=False):
    return (f'<div class="sw {"big" if big else ""}" style="background:{hexv};color:{txt}">'
            f'<div class="sw-name"><b>{ar}</b><i>{en}</i></div>'
            f'<div class="sw-codes"><span>HEX</span>{hexv.upper()}<span>RGB</span>{rgb(hexv)}<span>CMYK</span>{cmyk(hexv)}<span>PANTONE</span>{pms}</div></div>')
page(f'''
{head('11', 'لوحة الألوان', 'Color Palette', 'ألوان مستوحاة من عمق البحر وصفائه: تركواز واثق بثلاث درجات، تسنده ألوان محايدة هادئة.', cls='narrow')}
<div class="pal">
 <div class="pal-main">
  {swatch(TEAL, 'تركواز شير', 'Share Teal · Primary', '7711 C', big=True)}
  {swatch(DEEP, 'عمق المحيط', 'Deep Ocean', '3165 C')}
  {swatch(AQUA, 'أكوا', 'Aqua Glow', '7466 C')}
 </div>
 <div class="pal-neu">
  {swatch(INK, 'حبر', 'Ink · Text', 'Black 6 C')}
  {swatch(MIST, 'ضباب', 'Mist · Tint', '317 C', INK)}
  {swatch(PEARL, 'لؤلؤي', 'Pearl · Background', '—', INK)}
 </div>
</div>
<p class="note">قيم CMYK و Pantone مقترحة للبدء؛ تُعتمد نهائيًا بعد بروفة طباعة على الخامة الفعلية.</p>
''', section=sec(11))

# 14 — color balance & gradients
page(f'''
{head('12', 'نسب وتدرجات الألوان', 'Color Balance & Gradients', 'المساحات البيضاء هي أساس الفخامة؛ التركواز للتأكيد، والعمق للثقل، والأكوا لمسات ضوء.', cls='narrow')}
<div class="ratio">
 <div style="flex:50;background:{PEARL};color:{INK}"><b>50%</b>لؤلؤي / أبيض</div>
 <div style="flex:22;background:{DEEP}"><b>22%</b>عمق المحيط</div>
 <div style="flex:15;background:{TEAL}"><b>15%</b>تركواز</div>
 <div style="flex:8;background:{AQUA}"><b>8%</b>أكوا</div>
 <div style="flex:5;background:{INK}"><b>5%</b></div>
</div>
<div class="grads">
 <div class="gr" style="background:linear-gradient(135deg,{AQUA} 0%,{TEAL} 45%,{DEEP} 100%)"><b>تدرّج العلامة</b><i>Signature · 135°</i></div>
 <div class="gr" style="background:linear-gradient(135deg,{TEAL} 0%,{DEEP} 100%)"><b>تدرّج العمق</b><i>Depth · 135°</i></div>
 <div class="gr" style="background:linear-gradient(135deg,{WHITE} 0%,{MIST} 100%);color:{DEEP}"><b>تدرّج الضوء</b><i>Light · 135°</i></div>
 <div class="gr" style="background:{DEEP};overflow:hidden">{flow_lines(420, 300, AQUA, 0.5, n=6, step=60, cx=300, cy=150, scale=0.3)}<b>العمق + الخطوط</b><i>Deep + echo lines</i></div>
</div>
''', section=sec(12))

# 15 — typography
page(f'''
<div class="grid2 typo">
 <div>
  {head('13', 'الخطوط', 'Typography', 'عائلة خط واحدة للعربي والإنجليزي تضمن انسجامًا كاملًا بين اللغتين: <b>Readex Pro</b> — خط مجاني بترخيص مفتوح (OFL) من Google Fonts للاستخدام التجاري.')}
  <div class="specimen-big"><span>Aa</span>أبجد</div>
  <div class="weights">
   <span style="font-weight:200">رفيع Light</span><span style="font-weight:400">عادي Regular</span>
   <span style="font-weight:500">متوسط Medium</span><span style="font-weight:600">نصف عريض SemiBold</span><span style="font-weight:700">عريض Bold</span>
  </div>
 </div>
 <div class="hier">
  <div class="hl"><span class="lbl">عنوان رئيسي · Bold 700</span><div style="font:700 64px/1.2 RX;color:{DEEP}">نصنع الفكرة معًا</div></div>
  <div class="hl"><span class="lbl">عنوان فرعي · SemiBold 600</span><div style="font:600 36px/1.3 RX;color:{TEAL}">حلول إبداعية لعلامتك التجارية</div></div>
  <div class="hl"><span class="lbl">نص أساسي · Light 300</span><div style="font:300 24px/1.8 RX;color:{INK}">نؤمن أن التصميم الجيد يبدأ بالاستماع، ويكتمل بالتفاصيل الدقيقة التي تجعل رسالتك واضحة ومؤثرة في كل وسيط.</div></div>
  <div class="hl"><span class="lbl">Latin · Headline / Caption</span><div style="font:600 40px/1.2 RX;color:{DEEP}" dir="ltr">Creativity, shared.</div>
   <div style="font:500 16px RX;letter-spacing:.3em;color:{TEAL};margin-top:10px" dir="ltr">ADVERTISING · DESIGN · PRINT · VIDEO</div></div>
 </div>
</div>
''', section=sec(13))

# 16 — graphic elements
page(f'''
{head('14', 'العناصر الجرافيكية', 'Graphic Elements', 'عناصر مشتقة من الرمز نفسه، تُستخدم لإثراء التصاميم دون أن تنافس الشعار.', cls='narrow')}
<div class="ge">
 <div class="ge-c" style="background:{DEEP}">{pattern_svg(560, 420, 150, AQUA, 0.55, 1.4, 'p1')}<b>شبكة المشاركة</b><i>Share Grid pattern</i></div>
 <div class="ge-c" style="background:{TEAL}">{flow_lines(400, 560, WHITE, 0.55, n=9, step=55, cx=200, cy=250, scale=0.3)}<b>خطوط الصدى</b><i>Echo lines</i></div>
 <div class="ge-c" style="background:{PEARL}"><div class="chev"><span>نصنع<br>الفكرة معًا</span></div><b style="color:{DEEP}">إطار الزاوية 45°</b><i style="color:{TEAL}">45° corner frame</i></div>
 <div class="ge-c" style="background:{WHITE}"><div class="crop">{mark(720)}</div><b style="color:{DEEP}">الرمز المقصوص</b><i style="color:{TEAL}">Cropped symbol</i></div>
</div>
''', section=sec(14))

# 17 — stationery: business cards
page(f'''
{head('15', 'بطاقات العمل', 'Business Cards', 'مقاس 90 × 50 مم · ورق 400 جم مطفي مع طباعة بارزة (Spot UV) على الرمز.', cls='narrow')}
<div class="cards">
 <div class="bc front" style="background:{DEEP}">{flow_lines(630, 350, AQUA, 0.35, n=7, step=55, cx=470, cy=175, scale=0.42)}
   <div class="bc-logo">{logo('vertical-reverse-deep', h=170)}</div></div>
 <div class="bc back">
   <div class="bc-top">{logo('horizontal-ar-color', h=58)}</div>
   <div class="bc-name"><b>محمد أحمد</b><span>المدير الإبداعي · Creative Director</span></div>
   <div class="bc-info" dir="ltr"><span>{CONTACT['phone']}</span><span>{CONTACT['mail']}</span><span>{CONTACT['web']}</span></div>
   <div class="bc-corner"></div>
 </div>
</div>
''', cls='pearl', section=sec(15))

# 18 — letterhead & envelope
page(f'''
<div class="lh-grid">
 <div class="lh-right">
  {head('15', 'الورق الرسمي والظرف', 'Letterhead & Envelope', 'ورق A4 وظرف DL بتصميم هادئ يترك المساحة للمحتوى، مع لمسة الزاوية 45° في الركن.')}
  <div class="envs">
   <div class="env"><div class="env-logo">{logo('horizontal-ar-color', h=40)}</div>
     <div class="env-to">إلى السادة /<i></i><i></i></div>
     <div class="env-addr" dir="ltr">{CONTACT['web']}</div><div class="env-corner"></div></div>
   <div class="env" style="background:{DEEP}">{pattern_svg(480, 240, 100, AQUA, 0.35, 1.2, 'p2')}<div class="env-c">{mark(80, AQUA, WHITE)}</div></div>
  </div>
 </div>
 <div class="a4">
  <div class="a4-head">{logo('horizontal-ar-color', h=50)}<span class="a4-ref">التاريخ: &nbsp;&nbsp;/&nbsp;&nbsp;/ 1448هـ<br>المرجع:</span></div>
  <div class="a4-lines"><b>السادة / ......................... المحترمين</b>{''.join('<i></i>' for _ in range(14))}</div>
  <div class="a4-sign">مع التحية،<br><b>شير آرت</b></div>
  <div class="a4-foot" dir="ltr"><span>{CONTACT['web']}</span><span>{CONTACT['mail']}</span><span>{CONTACT['phone']}</span></div>
  <div class="a4-corner"></div>
 </div>
</div>
''', cls='pearl', section=sec(15))

# 19 — social
page(f'''
{head('16', 'السوشيال ميديا', 'Social Media', 'قوالب ثابتة تبني حضورًا متناسقًا: صورة الحساب بالرمز فقط، والمنشورات تعتمد المساحة والخطوط والعناصر الجرافيكية.', cls='narrow')}
<div class="social">
 <div class="avatar-col">
  <div class="avatar" style="background:linear-gradient(135deg,{AQUA},{DEEP})">{mark(120, WHITE, WHITE)}</div>
  <b>صورة الحساب</b><i>Profile avatar</i>
  <div class="avatar sm" style="background:{WHITE}">{mark(60)}</div>
 </div>
 <div class="post" style="background:{DEEP}">{flow_lines(380, 380, AQUA, 0.4, n=6, step=60, cx=300, cy=300, scale=0.4)}
   <span class="pe">ADVERTISING</span><h3>فكرتك تستحق<br>أن تُرى</h3>{logo('horizontal-mono-white', h=30, style='position:absolute;bottom:26px;right:26px')}</div>
 <div class="post" style="background:{PEARL}"><div class="post-num" style="color:{TEAL}">04</div>
   <h3 style="color:{DEEP}">إنتاج<br>الفيديو</h3><p style="color:{INK}">من السيناريو حتى المونتاج النهائي.</p>{logo('horizontal-color', h=30, style='position:absolute;bottom:26px;right:26px')}<div class="post-corner"></div></div>
 <div class="post" style="background:{TEAL}">{pattern_svg(380, 380, 90, WHITE, 0.25, 1, 'p3')}
   <div class="post-q">«التفاصيل ليست تفاصيل؛ إنها التصميم.»</div>{logo('horizontal-mono-white', h=30, style='position:absolute;bottom:26px;right:26px')}</div>
 <div class="story" style="background:linear-gradient(170deg,{TEAL},{DEEP})">{flow_lines(250, 444, WHITE, 0.3, n=6, step=60, cx=125, cy=200, scale=0.28)}
   <div class="st-c">{logo('vertical-mono-white', h=110)}<p>قريبًا<br><small>هويتنا الجديدة</small></p></div></div>
</div>
''', section=sec(16))

# 20 — video & motion
page(f'''
{head('17', 'الفيديو والموشن', 'Video & Motion', 'الفيديو من صميم خدمات شير آرت، لذلك للهوية حضور محسوب في كل إطار.', cls='narrow')}
<div class="video">
 <div class="frame scene">
   <div class="sky"></div><div class="bokeh b1"></div><div class="bokeh b2"></div><div class="bokeh b3"></div>
   <div class="bug">{mark(34, WHITE, WHITE)}</div>
   <div class="l3"><div class="l3-bar"></div><div><b>م. سارة خالد</b><span>مديرة الإنتاج · شير آرت</span></div></div>
   <span class="fl">الشريط السفلي والعلامة المائية · Lower third & bug</span>
 </div>
 <div class="frame end" style="background:{DEEP}">{flow_lines(560, 315, AQUA, 0.35, n=7, step=60, cx=280, cy=158, scale=0.26)}
   <div class="end-c">{logo('vertical-reverse-deep', h=150)}<p dir="ltr">{CONTACT['web']}</p></div>
   <span class="fl">شاشة الختام · End slate</span>
 </div>
 <div class="motion">
   <h4>حركة الرمز <i>Logo animation</i></h4>
   <div class="mseq">
     <div><svg width="70" height="98" viewBox="0 0 {MW:.0f} {MH:.0f}"><polygon fill="{AQUA}" points="{pts(G['top'])}" opacity=".45" transform="translate(-90,-90)"/><polygon fill="{AQUA}" points="{pts(G['top'])}"/></svg><span>01 دخول القطعة الأولى</span></div>
     <div><svg width="70" height="98" viewBox="0 0 {MW:.0f} {MH:.0f}"><polygon fill="{AQUA}" points="{pts(G['top'])}"/><polygon fill="{DEEP}" points="{pts(G['bot'])}" transform="translate(140,140)"/></svg><span>02 الثانية بدوران 180°</span></div>
     <div>{mark(98)}<span>03 التقاء وتثبيت</span></div>
     <div>{logo('vertical-color', h=98)}<span>04 ظهور الاسم</span></div>
   </div>
   <p>المدة 2–3 ثوانٍ · حركة ناعمة (Ease-out) · بدون ارتداد مبالغ فيه.</p>
 </div>
</div>
''', section=sec(17))

# 21 — applications
page(f'''
{head('18', 'التطبيقات', 'Brand Applications', 'نماذج توضيحية لتطبيق الهوية على الأصول الفعلية للوكالة.', cls='narrow')}
<div class="apps">
 <div class="wall">
   <div class="sign">{logo('horizontal-color', h=120)}</div>
   <span class="fl dark">لوحة الاستقبال · أكريليك ثلاثي الأبعاد على جدار رمادي</span>
 </div>
 <div class="badge-wrap">
   <div class="lanyard"></div>
   <div class="badge"><div class="b-top" style="background:{DEEP}">{pattern_svg(240, 130, 70, AQUA, 0.45, 1, 'p4')}<div class="b-m">{mark(64, AQUA, WHITE)}</div></div>
     <div class="b-photo"></div><b>نورة سعد</b><span>مصممة جرافيك</span>{logo('horizontal-color', h=24, style='margin-top:18px')}</div>
   <span class="fl dark">بطاقة الموظف</span>
 </div>
 <div class="folder">
   <div class="fd" style="background:{DEEP}">{flow_lines(330, 440, AQUA, 0.35, n=7, step=55, cx=230, cy=300, scale=0.32)}<div class="fd-l">{logo('horizontal-reverse-deep', h=40)}</div></div>
   <span class="fl dark">ملف العروض A4</span>
 </div>
</div>
''', cls='pearl', section=sec(18))

# 22 — back cover
page(f'''
<div class="cover-bg"></div>
{pattern_svg(1920, 1080, 210, AQUA, 0.22, 1.3, 'pb')}
<div class="back-c">
  {logo('vertical-reverse-deep', h=330)}
  <p class="tagline">نصنع الفكرة معًا<span dir="ltr">Creativity, shared.</span></p>
  <div class="back-info" dir="ltr"><span>{CONTACT['web']}</span><span>{CONTACT['mail']}</span><span>{CONTACT['handle']}</span></div>
</div>
''', cls='cover', num=False)

# ---------------------------------------------------------------- output
CSS = open(os.path.join(HERE, 'book.css')).read().replace('$DEEP', DEEP).replace('$TEAL', TEAL).replace('$AQUA', AQUA) \
    .replace('$MIST', MIST).replace('$INK', INK).replace('$PEARL', PEARL)
html = (f'<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>SHARE ART — Brand Guidelines</title>'
        f'<style>{CSS}</style></head><body>{"".join(PAGES)}</body></html>')
open(os.path.join(HERE, 'brandbook.html'), 'w').write(html)
print('pages:', len(PAGES))
