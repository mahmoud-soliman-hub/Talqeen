"""Mr. Boma logo concepts — geometry for marks and outlined wordmarks.

All text is converted to outlines with fontTools so the SVGs don't depend on
installed fonts. Colors are passed in, so the same geometry produces the color,
reversed and mono versions (and CSS-variable versions for the presentation page).
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

FONT_DIR = Path(__file__).parent / "fonts"
_cache = {}


def font(name):
    if name not in _cache:
        _cache[name] = TTFont(FONT_DIR / name)
    return _cache[name]


def text_outline(fontname, text, cap_px, tracking=0.0, kern=None):
    """Outline `text` so that its cap height is `cap_px`.

    Returns (d, width, cap_px). Origin: x=0 at left ink edge, y=0 at baseline,
    caps reaching y=-cap_px. `tracking` is in em; `kern` maps pairs to em.
    """
    f = font(fontname)
    gs = f.getGlyphSet()
    cmap = f.getBestCmap()
    capu = f["OS/2"].sCapHeight or f["head"].unitsPerEm * 0.7
    s = cap_px / capu
    em = f["head"].unitsPerEm * s
    kern = kern or {}
    pen = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
    x = 0.0
    first_lsb = None
    right = 0.0
    for i, ch in enumerate(text):
        g = cmap[ord(ch)]
        if ch != " ":
            bp = BoundsPen(gs)
            gs[g].draw(bp)
            if bp.bounds:
                if first_lsb is None:
                    first_lsb = bp.bounds[0] * s
                right = x + bp.bounds[2] * s
            gs[g].draw(TransformPen(pen, (s, 0, 0, -s, x, 0)))
        x += gs[g].width * s + tracking * em
        if i + 1 < len(text):
            x += kern.get(text[i:i + 2], 0) * em
    d = pen.getCommands()
    first_lsb = first_lsb or 0
    return d, first_lsb, right - first_lsb


def text_el(fontname, text, cap_px, x, baseline, fill, tracking=0.0, kern=None, anchor="start"):
    d, lsb, w = text_outline(fontname, text, cap_px, tracking, kern)
    if anchor == "middle":
        tx = x - w / 2 - lsb
    elif anchor == "end":
        tx = x - w - lsb
    else:
        tx = x - lsb
    return f'<path transform="translate({tx:.2f} {baseline:.2f})" fill="{fill}" d="{d}"/>', w


def runs_el(fontname, runs, cap_px, x, baseline, tracking=0.0, kern=None, anchor="start"):
    """Like text_el but `runs` is [(text, fill), ...] laid out as one line."""
    f = font(fontname)
    gs = f.getGlyphSet(); cmap = f.getBestCmap()
    capu = f["OS/2"].sCapHeight
    s = cap_px / capu
    em = f["head"].unitsPerEm * s
    kern = kern or {}
    text = "".join(t for t, _ in runs)
    fills = [fl for t, fl in runs for _ in t]
    pos, cx = [], 0.0
    lsb, right = None, 0.0
    for i, ch in enumerate(text):
        g = cmap[ord(ch)]
        pos.append(cx)
        if ch != " ":
            bp = BoundsPen(gs); gs[g].draw(bp)
            if bp.bounds:
                if lsb is None: lsb = bp.bounds[0] * s
                right = cx + bp.bounds[2] * s
        cx += gs[g].width * s + tracking * em
        if i + 1 < len(text): cx += kern.get(text[i:i + 2], 0) * em
    w = right - lsb
    tx = {"start": x - lsb, "middle": x - w / 2 - lsb, "end": x - w - lsb}[anchor]
    out = []
    groups = {}
    for i, ch in enumerate(text):
        if ch == " ": continue
        groups.setdefault(fills[i], []).append(i)
    for fl, idx in groups.items():
        pen = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
        for i in idx:
            gs[cmap[ord(text[i])]].draw(TransformPen(pen, (s, 0, 0, -s, pos[i], 0)))
        out.append(f'<path transform="translate({tx:.2f} {baseline:.2f})" fill="{fl}" d="{pen.getCommands()}"/>')
    return "".join(out), w


def fit_cap(fontname, text, target_w, tracking):
    """Cap height that makes `text` exactly `target_w` wide at `tracking`."""
    _, _, w = text_outline(fontname, text, 10, tracking)
    return 10 * target_w / w


# ---------------------------------------------------------------- concept 1
# Heritage — Bodoni M+B ligature (shared stem) under a doorway arch.

def mark1(c):
    """viewBox 0 0 120 150. c: frame, mono, key"""
    f = font("bodoni-600.ttf")
    gs = f.getGlyphSet(); cm = f.getBestCmap()
    s = 54 / 1500  # cap height 54px
    pen = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
    gs[cm[ord("M")]].draw(TransformPen(pen, (s, 0, 0, -s, 0, 0)))
    gs[cm[ord("B")]].draw(TransformPen(pen, (s, 0, 0, -s, 1110 * s, 0)))
    d = pen.getCommands()
    left = 52 * s
    right = (1110 + 1276) * s
    w = right - left
    tx = 60 - w / 2 - left
    mono = f'<path transform="translate({tx:.2f} 108)" fill="{c["mono"]}" d="{d}"/>'
    # arch frame: outer + inner hairline, keystone diamond
    arch_o = "M8 146 V62 A52 52 0 0 1 112 62 V146 Z"
    arch_i = "M14.5 139.5 V62 A45.5 45.5 0 0 1 105.5 62 V139.5 Z"
    key = "M60 3 L66 10 L60 17 L54 10 Z"
    return (f'<path d="{arch_o}" fill="none" stroke="{c["frame"]}" stroke-width="3"/>'
            f'<path d="{arch_i}" fill="none" stroke="{c["frame"]}" stroke-width="1"/>'
            f'<path d="{key}" fill="{c["key"]}"/>'
            f'{mono}'
            f'<path d="M51 122 H69" stroke="{c["key"]}" stroke-width="1.6"/>')


def mark1_mini(c):
    """Reduced Heritage mark for favicons: the MB ligature alone, viewBox 0 0 100 100."""
    f = font("bodoni-600.ttf")
    gs = f.getGlyphSet(); cm = f.getBestCmap()
    s = 50 / 1500
    pen = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
    gs[cm[ord("M")]].draw(TransformPen(pen, (s, 0, 0, -s, 0, 0)))
    gs[cm[ord("B")]].draw(TransformPen(pen, (s, 0, 0, -s, 1110 * s, 0)))
    w = (1110 + 1276 - 52) * s
    tx = 50 - w / 2 - 52 * s
    return f'<path transform="translate({tx:.2f} 75)" fill="{c["mono"]}" d="{pen.getCommands()}"/>'


# ---------------------------------------------------------------- concept 2
# Momentum — a geometric B whose two bowls are forward chevrons.

def mark2(c):
    """viewBox 0 0 100 100. c: main, cut (counter fill; 'none' leaves it transparent)"""
    outer = "M14 8 H58 L76 26 V33 L65 46 L80 61 V74 L62 92 H14 Z"
    house = "M31 41 V30 L45.5 19 L60 30 V41 Z"
    lower = "M30 55 H59 L65 61 V70 L59 76 H30 Z"
    return (f'<path fill-rule="evenodd" fill="{c["main"]}" d="{outer} {house} {lower}"/>'
            f'<rect x="43" y="31" width="5" height="5" fill="{c["accent"]}"/>')


# ---------------------------------------------------------------- concept 3
# Horizon — sun disc, green hill, the house as negative space.

def mark3(c, uid="h"):
    """viewBox 0 0 100 100. Sun disc over striped fields; house as negative space."""
    return (f'<defs><clipPath id="{uid}"><circle cx="50" cy="50" r="46"/></clipPath></defs>'
            f'<g clip-path="url(#{uid})">'
            f'<rect x="0" y="0" width="100" height="62" fill="{c["sun"]}"/>'
            f'<g fill="{c["hill"]}"><rect x="0" y="66" width="100" height="8"/><rect x="0" y="78" width="100" height="6.5"/>'
            f'<rect x="0" y="88.5" width="100" height="5"/><rect x="0" y="97.5" width="100" height="4"/></g>'
            f'</g>'
            f'<path d="M25 58 L50 35 L75 58" fill="none" stroke="{c["cut"]}" stroke-width="6.5" stroke-linejoin="miter"/>'
            f'<path d="M33.5 51 V62 M66.5 51 V62" stroke="{c["cut"]}" stroke-width="6.5"/>'
            f'<g fill="{c["cut"]}"><rect x="44.5" y="46" width="5" height="5"/><rect x="50.5" y="46" width="5" height="5"/>'
            f'<rect x="44.5" y="52" width="5" height="5"/><rect x="50.5" y="52" width="5" height="5"/></g>')
