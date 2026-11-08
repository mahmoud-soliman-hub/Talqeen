"""Lockups (mark + outlined wordmark) for the three Mr. Boma concepts.

Each function takes a palette dict and returns (svg_inner, width, height).
"""
from marks import mark1, mark1_mini, mark2, mark3, text_el, runs_el, fit_cap

TAG = "INVESTMENT · FINANCING · INSTALLMENTS"

# ------------------------------------------------------------------ palettes
P1 = {  # Heritage
    "color": {"frame": "#B8955A", "mono": "#0F2340", "key": "#B8955A", "word": "#0F2340", "tag": "#0F2340", "small": "#9C7B45", "bg": "#F5F0E6"},
    "white": {"frame": "#C9A96E", "mono": "#F5F0E6", "key": "#C9A96E", "word": "#F5F0E6", "tag": "#F5F0E6", "small": "#C9A96E", "bg": "#0F2340"},
    "black": {"frame": "#111111", "mono": "#111111", "key": "#111111", "word": "#111111", "tag": "#111111", "small": "#111111", "bg": "#FFFFFF"},
}
P2 = {  # Momentum
    "color": {"main": "#0A3A6B", "accent": "#F28C28", "word": "#0A3A6B", "dot": "#F28C28", "tag": "#4C6A8C", "bg": "#FFFFFF"},
    "white": {"main": "#FFFFFF", "accent": "#F28C28", "word": "#FFFFFF", "dot": "#F28C28", "tag": "#A9C3E0", "bg": "#0A3A6B"},
    "black": {"main": "#111111", "accent": "#111111", "word": "#111111", "dot": "#111111", "tag": "#111111", "bg": "#FFFFFF"},
}
P3 = {  # Horizon
    "color": {"sun": "#F2A541", "hill": "#1E5B45", "cut": "#FBF6EC", "word": "#1E5B45", "tag": "#1E5B45", "small": "#D98A1E", "bg": "#FBF6EC"},
    "white": {"sun": "#F2A541", "hill": "#FBF6EC", "cut": "#1E5B45", "word": "#FBF6EC", "tag": "#F2A541", "small": "#F2A541", "bg": "#1E5B45"},
    "black": {"sun": "#111111", "hill": "#111111", "cut": "#FFFFFF", "word": "#111111", "tag": "#111111", "small": "#111111", "bg": "#FFFFFF"},
}

BOD, JOST = "bodoni-600.ttf", "jost-500.ttf"
OUT7, OUT4 = "outfit-700.ttf", "outfit-400.ttf"
JK8, JK6 = "jakarta-800.ttf", "jakarta-600.ttf"


def g(inner, x=0, y=0, s=1):
    return f'<g transform="translate({x:.2f} {y:.2f}) scale({s})">{inner}</g>'


# ------------------------------------------------------------------ concept 1
def c1_horizontal(c):
    x0 = 172
    word, ww = text_el(BOD, "MR. BOMA", 40, x0, 100, c["word"], tracking=0.09, kern={"R.": -0.03})
    tcap = fit_cap(JOST, TAG, ww, 0.22)
    tag, _ = text_el(JOST, TAG, tcap, x0, 124, c["tag"], tracking=0.22)
    ft, fw = text_el(JOST, "FAIR TRADE", 8.5, x0, 52, c["small"], tracking=0.42)
    rule = f'<path d="M{x0 + fw + 12:.1f} 47.75 H{x0 + ww:.1f}" stroke="{c["small"]}" stroke-width="1"/>'
    div = f'<path d="M144 36 V124" stroke="{c["frame"]}" stroke-width="1"/>'
    return mark1(c) + div + ft + rule + word + tag, x0 + ww, 150


def c1_stacked(c):
    word, ww = text_el(BOD, "MR. BOMA", 40, 0, 0, c["word"], tracking=0.09, kern={"R.": -0.03})
    W = ww + 40
    cx = W / 2
    word, _ = text_el(BOD, "MR. BOMA", 40, cx, 218, c["word"], tracking=0.09, kern={"R.": -0.03}, anchor="middle")
    ft, fw = text_el(JOST, "FAIR TRADE", 8.5, cx, 244, c["small"], tracking=0.42, anchor="middle")
    l1 = f'<path d="M{cx - ww / 2:.1f} 239.75 H{cx - fw / 2 - 12:.1f} M{cx + fw / 2 + 12:.1f} 239.75 H{cx + ww / 2:.1f}" stroke="{c["small"]}" stroke-width="1"/>'
    tcap = fit_cap(JOST, TAG, ww, 0.22)
    tag, _ = text_el(JOST, TAG, tcap, cx, 266, c["tag"], tracking=0.22, anchor="middle")
    return g(mark1(c), cx - 60, 0) + word + ft + l1 + tag, W, 272


def c1_icon(c):
    return g(mark1(c), 0, 0), 120, 150


def c1_mini(c):
    return mark1_mini(c), 100, 100


# ------------------------------------------------------------------ concept 2
def c2_word(c, x, baseline, cap=46, anchor="start"):
    return runs_el(OUT7, [("MR", c["word"]), (".", c["dot"]), ("BOMA", c["word"])], cap, x, baseline,
                   tracking=0.035, kern={"R.": -0.06, ".B": -0.02}, anchor=anchor)


def c2_horizontal(c):
    x0 = 120
    word, ww = c2_word(c, x0, 58)
    tcap = fit_cap(OUT4, TAG, ww, 0.2)
    tag, _ = text_el(OUT4, TAG, tcap, x0, 84, c["tag"], tracking=0.2)
    return mark2(c) + word + tag, x0 + ww, 100


def c2_stacked(c):
    _, ww = c2_word(c, 0, 0)
    W = ww + 40
    cx = W / 2
    word, _ = c2_word(c, cx, 168, anchor="middle")
    tcap = fit_cap(OUT4, TAG, ww, 0.2)
    tag, _ = text_el(OUT4, TAG, tcap, cx, 194, c["tag"], tracking=0.2, anchor="middle")
    return g(mark2(c), cx - 50, 0) + word + tag, W, 200


def c2_icon(c):
    return mark2(c), 100, 100


# ------------------------------------------------------------------ concept 3
def c3_horizontal(c, uid="h"):
    x0 = 122
    word, ww = text_el(JK8, "MR. BOMA", 38, x0, 68, c["word"], tracking=0.07, kern={"R.": -0.04})
    ft, fw = text_el(JK6, "FAIR TRADE", 8, x0, 24, c["small"], tracking=0.4)
    tcap = fit_cap(JK6, TAG, ww, 0.16)
    tag, _ = text_el(JK6, TAG, tcap, x0, 87, c["tag"], tracking=0.16)
    return mark3(c, uid) + ft + word + tag, x0 + ww, 100


def c3_stacked(c, uid="hs"):
    _, ww = text_el(JK8, "MR. BOMA", 38, 0, 0, c["word"], tracking=0.07, kern={"R.": -0.04})
    W = ww + 40
    cx = W / 2
    ft, fw = text_el(JK6, "FAIR TRADE", 8, cx, 134, c["small"], tracking=0.4, anchor="middle")
    word, _ = text_el(JK8, "MR. BOMA", 38, cx, 180, c["word"], tracking=0.07, kern={"R.": -0.04}, anchor="middle")
    tcap = fit_cap(JK6, TAG, ww, 0.16)
    tag, _ = text_el(JK6, TAG, tcap, cx, 200, c["tag"], tracking=0.16, anchor="middle")
    return g(mark3(c, uid), cx - 50, 0) + ft + word + tag, W, 206


def c3_icon(c, uid="hi"):
    return mark3(c, uid), 100, 100


CONCEPTS = {
    "heritage": {"P": P1, "horizontal": c1_horizontal, "stacked": c1_stacked, "icon": c1_icon, "mini": c1_mini},
    "momentum": {"P": P2, "horizontal": c2_horizontal, "stacked": c2_stacked, "icon": c2_icon, "mini": c2_icon},
    "horizon": {"P": P3, "horizontal": c3_horizontal, "stacked": c3_stacked, "icon": c3_icon, "mini": c3_icon},
}


def svg(inner, w, h, pad=0, bg=None):
    W, H = w + 2 * pad, h + 2 * pad
    b = f'<rect width="{W:.2f}" height="{H:.2f}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.2f} {H:.2f}" width="{W:.0f}" height="{H:.0f}">'
            f'{b}<g transform="translate({pad} {pad})">{inner}</g></svg>')
