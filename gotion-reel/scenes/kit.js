/* shared helpers for all Gotion scenes → window.GK */
const GK = window.GK = window.GK || {};
const cache = new Map();
GK.rr = (X, x, y, w, h, r) => { X.beginPath(); X.roundRect(x, y, w, h, r); };
/* brand play triangle: points LEFT like the logo, rounded corners */
GK.tri = (X, cx, cy, s, color, rot = 0, alpha = 1) => {
  X.save(); X.translate(cx, cy); X.rotate(rot); X.globalAlpha *= alpha;
  const p = [[-s * .58, 0], [s * .42, -s * .6], [s * .42, s * .6]], r = s * .13;
  X.beginPath(); X.moveTo((p[0][0] + p[1][0]) / 2, (p[0][1] + p[1][1]) / 2);
  X.arcTo(p[1][0], p[1][1], p[2][0], p[2][1], r); X.arcTo(p[2][0], p[2][1], p[0][0], p[0][1], r); X.arcTo(p[0][0], p[0][1], p[1][0], p[1][1], r);
  X.closePath(); X.fillStyle = color; X.fill(); X.restore();
};
GK.bg = (ctx, t, mode) => {
  const { X, P } = ctx, navy = mode !== 'light';
  X.fillStyle = navy ? P.bg : P.light; X.fillRect(0, 0, 1080, 1920);
  const d = Math.sin(t * .5) * 24, e = Math.cos(t * .4) * 20;
  X.fillStyle = navy ? 'rgba(116,87,254,.13)' : 'rgba(201,192,255,.38)';
  X.beginPath(); X.arc(960 + d, 250 + e, 430, 0, 6.2832); X.fill();
  X.fillStyle = navy ? 'rgba(255,255,255,.035)' : 'rgba(116,87,254,.10)';
  X.beginPath(); X.arc(90 - d, 1640 - e, 520, 0, 6.2832); X.fill();
  X.fillStyle = navy ? 'rgba(255,255,255,.07)' : 'rgba(15,14,60,.07)';
  const off = (t * 14) % 72;
  for (let y = -72 + off; y < 1920; y += 72) for (let x = 36; x < 1080; x += 72) X.fillRect(x - 2, y - 2, 4, 4);
};
/* a VO line, each word rising out of its baseline exactly when it is spoken */
GK.line = (ctx, t, id, x, y, o = {}) => {
  const X = ctx.X, str = o.text || ctx.lineSpan(id).text.replace(/\.\./g, ''), fam = o.family || 'display', wt = o.weight || 700, size = o.size || 84;
  const key = [str, fam, wt, size, o.maxWidth || 0].join('|');
  let L = cache.get(key); if (!L) { L = ctx.text.layout(X, str, { family: fam, weight: wt, size, maxWidth: o.maxWidth, lineHeight: o.lineHeight || 1.32 }); cache.set(key, L); }
  const off = o.wordOffset || 0, a = (o.alpha == null ? 1 : o.alpha);
  if (a <= 0) return [];
  if (o.under) o.under(ctx.text.drawLayout(X, L, x, y, { align: o.align || 'center', perWord: () => ({ skip: 1 }) }));
  X.save(); X.globalAlpha *= a;
  const b = ctx.text.drawLayout(X, L, x, y, { align: o.align || 'center', color: o.color || ctx.P.ink,
    perWord: i => { const w = ctx.wordTime(id, i + off), k = ctx.at(t, w.s - .1, w.s + .3, 'expoOut'); return { clipUp: 1, dy: (1 - k) * size * 1.0, alpha: k > 0 ? 1 : 0, color: o.hi && o.hi[i] }; } });
  X.restore(); return b;
};
/* line drawing: several strokes, drawn one after the other */
GK.strokes = (ctx, list, k, o = {}) => { const n = list.length; list.forEach((d, i) => { const ki = ctx.clamp(k * (n * .55 + .45) - i * .55); if (ki > 0) ctx.drawPath(ctx.X, d, ctx.E.cubicOut(ki), { width: o.width || 9, color: o.color, smooth: false }); }); };
/* logo layers share one canvas size (1494×536) → draw them at the same rect */
GK.LOGO_AR = 536 / 1494;
