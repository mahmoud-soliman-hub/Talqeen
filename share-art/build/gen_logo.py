"""Generate SHARE ART logo system as outlined SVGs (no live text)."""
import os, json
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'logo', 'svg')
os.makedirs(OUT, exist_ok=True)

# ---------- palette ----------
C = json.load(open(os.path.join(HERE, 'palette.json')))
DEEP, TEAL, AQUA, INK, WHITE, PEARL = (C[k] for k in ('deep', 'teal', 'aqua', 'ink', 'white', 'pearl'))

# ---------- fonts (static instances of Readex Pro) ----------
_fonts = {}
def font(wght):
    if wght not in _fonts:
        path = os.path.join(HERE, 'fonts', f'ReadexPro-{wght}.ttf')
        if not os.path.exists(path):
            vf = TTFont(os.path.join(HERE, 'fonts', 'ReadexPro-VF.ttf'))
            instantiateVariableFont(vf, {'wght': wght}, inplace=True)
            vf.save(path)
        tt = TTFont(path)
        blob = hb.Blob.from_file_path(path)
        _fonts[wght] = (tt, hb.Font(hb.Face(blob)), tt['head'].unitsPerEm)
    return _fonts[wght]

def shape(text, wght, size, tracking=0.0):
    """Return (svg path d, width, (ymin, ymax)) with baseline at y=0, x starting at 0."""
    tt, hbf, upm = font(wght)
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(hbf, buf, {})
    gs = tt.getGlyphSet(); order = tt.getGlyphOrder()
    s = size / upm
    pen = SVGPathPen(gs); bpen = BoundsPen(gs)
    x = 0.0
    n = len(buf.glyph_infos)
    for i, (info, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
        g = order[info.codepoint]
        t = (s, 0, 0, -s, (x + pos.x_offset) * s, -pos.y_offset * s)
        gs[g].draw(TransformPen(pen, t)); gs[g].draw(TransformPen(bpen, t))
        x += pos.x_advance
        if tracking and i < n - 1:
            x += tracking * upm
    b = bpen.bounds
    return pen.getCommands(), b

# ---------- the mark ----------
# Geometry rebuilt on a 45° module grid. In rotated space (u = x+y, v = x-y) the mark is
# two identical hooks, point-symmetric about the centre: stroke = 1 module, gaps = 7/8.
STROKE, GAP = 1.0, 0.875
S = 4 * STROKE + 3 * GAP                      # 6.625 modules square (rotated)
TOP_UV = [(0, S), (3.75, S), (3.75, S - 1), (1, S - 1), (1, 2.875), (4.75, 2.875), (4.75, 1.875), (0, 1.875)]
BOT_UV = [(S - u, S - v) for u, v in TOP_UV]
def _xy(u, v): return ((u + v) / 2, (u - v) / 2)
_all = [_xy(*p) for p in TOP_UV + BOT_UV]
_x0 = min(p[0] for p in _all); _y0 = min(p[1] for p in _all)
MODULE = 835 / S                              # source units per module (rotated)
TOP = [((x - _x0) * MODULE, (y - _y0) * MODULE) for x, y in map(lambda p: _xy(*p), TOP_UV)]
BOT = [((x - _x0) * MODULE, (y - _y0) * MODULE) for x, y in map(lambda p: _xy(*p), BOT_UV)]
MX, MY = 0, 0
MW = max(p[0] for p in TOP + BOT); MH = max(p[1] for p in TOP + BOT)

def poly(pts, ox, oy, k):
    return 'M' + ' L'.join(f'{(x-MX)*k+ox:.2f},{(y-MY)*k+oy:.2f}' for x, y in pts) + ' Z'

def mark(ox, oy, h, c_top, c_bot):
    k = h / MH
    return (f'<path fill="{c_top}" d="{poly(TOP, ox, oy, k)}"/>'
            f'<path fill="{c_bot}" d="{poly(BOT, ox, oy, k)}"/>'), MW * k

def text_el(d, b, ox, base, fill, k=1.0):
    return f'<path fill="{fill}" transform="translate({ox - b[0]*k:.2f},{base:.2f}) scale({k:.5f})" d="{d}"/>'

def fit_size(text, wght, tracking, target_w):
    _, b = shape(text, wght, 100, tracking)
    return 100 * target_w / (b[2] - b[0])

AR, EN = 'شير آرت', 'SHARE ART'
AR_W, EN_W = 700, 600

def svg(w, h, body, bg=None, title='SHARE ART'):
    rect = f'<rect width="{w:.0f}" height="{h:.0f}" fill="{bg}"/>' if bg else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" width="{w:.0f}" height="{h:.0f}">'
            f'<title>{title}</title>{rect}{body}</svg>')

# ---------- lockup builders (return body, width, height; origin top-left, no padding) ----------
EN_TRACK = 0.30

def text_block(ar_size):
    ar_d, ar_b = shape(AR, AR_W, ar_size)
    ar_wd = ar_b[2] - ar_b[0]
    en_size = fit_size(EN, EN_W, EN_TRACK, ar_wd)
    en_d, en_b = shape(EN, EN_W, en_size, EN_TRACK)
    return ar_d, ar_b, en_d, en_b

def lock_horizontal(cm_top, cm_bot, c_ar, c_en, c_rule, rtl=False):
    """Mark | rule | Arabic over English, both justified to the same width."""
    H = 400
    ar_d, ar_b, en_d, en_b = text_block(190)
    ar_h = ar_b[3] - ar_b[1]; ar_wd = ar_b[2] - ar_b[0]
    en_h = en_b[3] - en_b[1]
    gap_v = 52
    block_h = ar_h + gap_v + en_h
    top = (H - block_h) / 2
    gap = 70
    mw = H * MW / MH
    if rtl:
        tx = 0
        rule_x = ar_wd + gap
        m, _ = mark(rule_x + 4 + gap, 0, H, cm_top, cm_bot)
        total = rule_x + 4 + gap + mw
    else:
        m, _ = mark(0, 0, H, cm_top, cm_bot)
        rule_x = mw + gap
        tx = rule_x + 4 + gap
        total = tx + ar_wd
    ar_base = top - ar_b[1]
    en_base = top + ar_h + gap_v - en_b[1]
    body = m
    body += f'<rect x="{rule_x:.2f}" y="{H*0.14:.2f}" width="4" height="{H*0.72:.2f}" fill="{c_rule}"/>'
    body += text_el(ar_d, ar_b, tx, ar_base, c_ar)
    body += text_el(en_d, en_b, tx, en_base, c_en)
    return body, total, H

def lock_vertical(cm_top, cm_bot, c_ar, c_en):
    H = 420
    ar_d, ar_b, en_d, en_b = text_block(230)
    ar_h = ar_b[3] - ar_b[1]; ar_wd = ar_b[2] - ar_b[0]
    en_h = en_b[3] - en_b[1]
    W = max(ar_wd, H * MW / MH)
    m, mw = mark((W - H * MW / MH) / 2, 0, H, cm_top, cm_bot)
    y = H + 90
    body = m
    body += text_el(ar_d, ar_b, (W - ar_wd) / 2, y - ar_b[1], c_ar)
    y += ar_h + 56
    body += text_el(en_d, en_b, (W - ar_wd) / 2, y - en_b[1], c_en)
    return body, W, y + en_h

def lock_signature(cm_top, cm_bot, c_ar, c_en):
    """SHARE ART  [mark]  شير آرت — symmetric bilingual signature."""
    H = 300
    ar_d, ar_b = shape(AR, AR_W, 150)
    en_d, en_b = shape(EN, EN_W, 96, 0.12)
    ar_wd = ar_b[2] - ar_b[0]; en_wd = en_b[2] - en_b[0]
    side = max(ar_wd, en_wd)
    gap = 80
    m, mw = mark(side + gap, 0, H, cm_top, cm_bot)
    mid = H / 2
    body = m
    body += text_el(en_d, en_b, side - en_wd, mid - (en_b[1] + en_b[3]) / 2, c_en)
    body += text_el(ar_d, ar_b, side + gap * 2 + mw, mid - (ar_b[1] + ar_b[3]) / 2, c_ar)
    return body, side * 2 + gap * 2 + mw, H

def wordmark_ar(c):
    d, b = shape(AR, AR_W, 200)
    return text_el(d, b, 0, -b[1], c), b[2] - b[0], b[3] - b[1]

def wordmark_en(c):
    d, b = shape(EN, EN_W, 140, 0.10)
    return text_el(d, b, 0, -b[1], c), b[2] - b[0], b[3] - b[1]

def mark_only(ct, cb):
    body, w = mark(0, 0, 600, ct, cb)
    return body, w, 600

# ---------- write files ----------
def write(name, built, pad_ratio=0.12, bg=None):
    body, w, h = built
    p = h * pad_ratio
    W, H = w + 2 * p, h + 2 * p
    out = svg(W, H, f'<g transform="translate({p:.2f},{p:.2f})">{body}</g>', bg)
    open(os.path.join(OUT, name + '.svg'), 'w').write(out)
    # trimmed, transparent copy for layout use inside the brand book
    os.makedirs(os.path.join(HERE, 'trim'), exist_ok=True)
    open(os.path.join(HERE, 'trim', name + '.svg'), 'w').write(svg(w, h, body))
    return w, h

SCHEMES = {
    # name: (mark top, mark bottom, arabic, english, rule, bg)
    'color':        (AQUA, DEEP, DEEP, TEAL, AQUA, None),
    'reverse-teal': (WHITE, WHITE, WHITE, WHITE, WHITE, TEAL),
    'reverse-deep': (AQUA, WHITE, WHITE, AQUA, AQUA, DEEP),
    'mono-ink':     (INK, INK, INK, INK, INK, None),
    'mono-white':   (WHITE, WHITE, WHITE, WHITE, WHITE, None),
}

if __name__ == '__main__':
    meta = {}
    for s, (mt, mb, ca, ce, cr, bg) in SCHEMES.items():
        meta[f'horizontal-{s}'] = write(f'horizontal-{s}', lock_horizontal(mt, mb, ca, ce, cr), bg=bg)
        meta[f'horizontal-ar-{s}'] = write(f'horizontal-ar-{s}', lock_horizontal(mt, mb, ca, ce, cr, rtl=True), bg=bg)
        meta[f'vertical-{s}'] = write(f'vertical-{s}', lock_vertical(mt, mb, ca, ce), bg=bg)
        meta[f'signature-{s}'] = write(f'signature-{s}', lock_signature(mt, mb, ca, ce), bg=bg)
        meta[f'mark-{s}'] = write(f'mark-{s}', mark_only(mt, mb), bg=bg)
        meta[f'wordmark-ar-{s}'] = write(f'wordmark-ar-{s}', wordmark_ar(ca), bg=bg, pad_ratio=0.25)
        meta[f'wordmark-en-{s}'] = write(f'wordmark-en-{s}', wordmark_en(ce), bg=bg, pad_ratio=0.25)
    json.dump({'top': TOP, 'bot': BOT, 'w': MW, 'h': MH, 'module': MODULE, 'top_uv': TOP_UV, 'S': S}, open(os.path.join(HERE, 'geometry.json'), 'w'))
    json.dump(meta, open(os.path.join(OUT, '..', 'sizes.json'), 'w'), indent=1)
    print('wrote', len(meta), 'svgs')
