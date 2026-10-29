"""Arabic font proposal for the SHARE ART wordmark: same lockup, 12 candidate typefaces."""
import os, json
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
import gen_logo as L

HERE = os.path.dirname(os.path.abspath(__file__))
FD = os.path.join(HERE, 'fonts', 'options')
INST = os.path.join(FD, 'inst')
OUT = os.path.join(HERE, 'options')
os.makedirs(INST, exist_ok=True); os.makedirs(OUT, exist_ok=True)
P = json.load(open(os.path.join(HERE, 'palette.json')))
DEEP, TEAL, AQUA, MIST, INK, WHITE, PEARL = (P[k] for k in ('deep', 'teal', 'aqua', 'mist', 'ink', 'white', 'pearl'))

# (file, weight or None for static, Arabic name, English name, style, why it suits, license)
OPTIONS = [
    ('ReemKufi[wght].ttf', 700, 'ريم كوفي', 'Reem Kufi', 'كوفي هندسي',
     'خطوط مستقيمة وزوايا حادة؛ أقرب خط لهندسة الرمز وزاوية 45°.', 'OFL · مجاني تجاريًا'),
    ('Alexandria[wght].ttf', 700, 'الإسكندرية', 'Alexandria', 'هندسي عصري',
     'حروف عريضة واثقة بطابع معماري فخم، واضح جدًا في اللوحات.', 'OFL · مجاني تجاريًا'),
    ('Kufam[wght].ttf', 700, 'كوفام', 'Kufam', 'كوفي معاصر',
     'كوفي بلمسة فنية في نهايات الحروف؛ يجمع الهندسة والإبداع.', 'OFL · مجاني تجاريًا'),
    ('Changa[wght].ttf', 700, 'تشانجا', 'Changa', 'مربّع تقني',
     'حروف مربعة مضغوطة بطابع قوي وحديث، مناسب للفيديو والموشن.', 'OFL · مجاني تجاريًا'),
    ('Almarai-ExtraBold.ttf', None, 'المراعي', 'Almarai', 'عصري نظيف',
     'بسيط ومفتوح بروح سعودية معاصرة، هادئ وسهل التذكّر.', 'OFL · مجاني تجاريًا'),
    ('IBMPlexSansArabic-Bold.ttf', None, 'آي بي إم بلكس', 'IBM Plex Arabic', 'مؤسسي دقيق',
     'طابع احترافي هادئ يعطي إحساس الشركات الكبيرة والثقة.', 'OFL · مجاني تجاريًا'),
    ('Zain-ExtraBold.ttf', None, 'زين', 'Zain', 'معاصر حيوي',
     'انحناءات ناعمة وحيوية، شبابي ومناسب للسوشيال ميديا.', 'OFL · مجاني تجاريًا'),
    ('ElMessiri[wght].ttf', 700, 'المسيري', 'El Messiri', 'أنيق راقٍ',
     'أناقة بلمسة نسخية حديثة؛ فخم ومميز بدون تعقيد.', 'OFL · مجاني تجاريًا'),
    ('thmanyahseriftext-Bold.otf', None, 'ثمانية سيرف', 'Thmanyah Serif', 'فخم تحريري',
     'زوائد كلاسيكية بطابع تحريري راقٍ، فخامة عالية.', 'مجاني من ثمانية · يُراجع شرط الترخيص'),
    ('ArefRuqaa-Bold.ttf', None, 'عارف رقعة', 'Aref Ruqaa', 'خط عربي فني',
     'روح الخط العربي اليدوي؛ يعبّر عن كلمة «آرت» ويربط الهوية بالفن.', 'OFL · مجاني تجاريًا'),
    ('Lalezar-Regular.ttf', None, 'لاليزار', 'Lalezar', 'إعلاني عريض',
     'عريض ولافت بطابع إعلاني جريء؛ يُرى من بعيد ويُتذكّر بسرعة.', 'OFL · مجاني تجاريًا'),
    ('Lemonada[wght].ttf', 600, 'ليمونادة', 'Lemonada', 'دائري ودود',
     'حواف دائرية مرحة؛ قريب من الجمهور وخفيف الظل.', 'OFL · مجاني تجاريًا'),
]

_cache = {}
def load(fname, wght):
    key = (fname, wght)
    if key in _cache: return _cache[key]
    path = os.path.join(FD, fname)
    if wght is not None:
        out = os.path.join(INST, f'{fname.split("[")[0].split(".")[0]}-{wght}.ttf')
        if not os.path.exists(out):
            vf = TTFont(path)
            loc = {a.axisTag: (wght if a.axisTag == 'wght' else a.defaultValue) for a in vf['fvar'].axes}
            instantiateVariableFont(vf, loc, inplace=True)
            vf.save(out)
        path = out
    tt = TTFont(path)
    _cache[key] = (path, tt, hb.Font(hb.Face(hb.Blob.from_file_path(path))), tt['head'].unitsPerEm)
    return _cache[key]

def shape(fname, wght, text, size):
    path, tt, hbf, upm = load(fname, wght)
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(hbf, buf, {})
    gs = tt.getGlyphSet(); order = tt.getGlyphOrder(); s = size / upm
    pen = SVGPathPen(gs); bpen = BoundsPen(gs); x = 0
    space = tt.getBestCmap().get(32)
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        if order[info.codepoint] == space:      # some faces ship a hairline space
            x += max(pos.x_advance, 0.28 * upm); continue
        t = (s, 0, 0, -s, (x + pos.x_offset) * s, -pos.y_offset * s)
        g = gs[order[info.codepoint]]
        g.draw(TransformPen(pen, t)); g.draw(TransformPen(bpen, t))
        x += pos.x_advance
    return pen.getCommands(), bpen.bounds

AR = 'شير آرت'
_, _rb = L.shape(AR, L.AR_W, 190)
AR_AREA = (_rb[2] - _rb[0]) * (_rb[3] - _rb[1])   # visual area of the current Readex name

def arabic(opt):
    """Size every face to the same ink area so tall and wide designs carry equal weight."""
    fname, wght = opt[0], opt[1]
    _, b = shape(fname, wght, AR, 100)
    size = 100 * (0.85 * AR_AREA / ((b[2] - b[0]) * (b[3] - b[1]))) ** 0.5
    return shape(fname, wght, AR, size)

def lockup(opt, mt, mb, ca, ce, cr):
    """Horizontal lockup identical to the approved system; only the Arabic face changes."""
    H = 400
    ar_d, ar_b = arabic(opt)
    ar_w = ar_b[2] - ar_b[0]; ar_h = ar_b[3] - ar_b[1]
    en_size = min(L.fit_size(L.EN, L.EN_W, L.EN_TRACK, ar_w), 80)
    track = L.EN_TRACK
    if en_size == 80:   # very wide Arabic: keep English size, open the tracking instead
        lo, hi = L.EN_TRACK, 1.2
        for _ in range(40):
            mid = (lo + hi) / 2
            _, bb = L.shape(L.EN, L.EN_W, 80, mid)
            lo, hi = (lo, mid) if bb[2] - bb[0] > ar_w else (mid, hi)
        track = lo
    en_d, en_b = L.shape(L.EN, L.EN_W, en_size, track)
    en_h = en_b[3] - en_b[1]
    gap_v = 52
    top = (H - (ar_h + gap_v + en_h)) / 2
    m, mw = L.mark(0, 0, H, mt, mb)
    rule_x = mw + 70; tx = rule_x + 4 + 70
    body = m + f'<rect x="{rule_x:.2f}" y="{H*0.14:.2f}" width="4" height="{H*0.72:.2f}" fill="{cr}"/>'
    body += L.text_el(ar_d, ar_b, tx, top - ar_b[1], ca)
    body += L.text_el(en_d, en_b, tx, top + ar_h + gap_v - en_b[1], ce)
    return body, tx + ar_w, H

def wordmark(opt, color):
    d, b = arabic(opt)
    return L.text_el(d, b, 0, -b[1], color), b[2] - b[0], b[3] - b[1]

def save(name, built, pad=0.0):
    body, w, h = built
    p = h * pad
    open(os.path.join(OUT, name + '.svg'), 'w').write(
        L.svg(w + 2 * p, h + 2 * p, f'<g transform="translate({p:.2f},{p:.2f})">{body}</g>'))
    return w + 2 * p, h + 2 * p

if __name__ == '__main__':
    sizes = {}
    for i, opt in enumerate(OPTIONS, 1):
        sizes[f'{i:02d}-color'] = save(f'{i:02d}-color', lockup(opt, AQUA, DEEP, DEEP, TEAL, AQUA))
        sizes[f'{i:02d}-reverse'] = save(f'{i:02d}-reverse', lockup(opt, AQUA, WHITE, WHITE, AQUA, AQUA))
        sizes[f'{i:02d}-word'] = save(f'{i:02d}-word', wordmark(opt, DEEP))
    json.dump(sizes, open(os.path.join(OUT, 'sizes.json'), 'w'))
    json.dump([{'no': i, 'file': load(o[0], o[1])[0], 'ar': o[2], 'en': o[3], 'style': o[4], 'why': o[5], 'lic': o[6],
                'w': o[1] or o[0].rsplit('-', 1)[-1].split('.')[0]}
               for i, o in enumerate(OPTIONS, 1)], open(os.path.join(OUT, 'options.json'), 'w'), ensure_ascii=False)
    print('options:', len(OPTIONS))
