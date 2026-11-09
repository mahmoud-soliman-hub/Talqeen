/* مكتبة مشتركة لكل المشاهد: الشعار المرسوم خط خط، مثلث التشغيل، الخلفيات، والنص المتزامن مع الصوت */
const GO = window.GO = {};
const TAU = Math.PI * 2;

GO.C = { night: '#131341', navy: '#1B1C54', violet: '#7459F6', deep: '#4F3BD1', soft: '#B8AAFF', paper: '#F6F5FB', white: '#FFFFFF', mist: '#E7E4F7', mut: '#8583A6' };

/* مستطيل بحواف دائرية */
GO.rr = (X, x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); X.beginPath(); X.moveTo(x + r, y); X.arcTo(x + w, y, x + w, y + h, r); X.arcTo(x + w, y + h, x, y + h, r); X.arcTo(x, y + h, x, y, r); X.arcTo(x, y, x + w, y, r); X.closePath(); };

/* مثلث التشغيل بتاع الشعار (حواف ناعمة). dir = -1 يشاور شمال زي الشعار، +1 يمين */
GO.tri = (X, cx, cy, size, o = {}) => {
  X.save(); X.translate(cx, cy); X.rotate(o.rot || 0); X.scale(o.dir || -1, 1);
  if (o.alpha != null) X.globalAlpha *= o.alpha;
  const h = size, w = size * 0.92, j = size * 0.12;
  X.beginPath(); X.moveTo(-w * 0.36, -h / 2 + j / 2); X.lineTo(-w * 0.36, h / 2 - j / 2); X.lineTo(w * 0.54 - j / 2, 0); X.closePath();
  X.lineJoin = 'round'; X.lineWidth = j;
  if (o.outline) { X.strokeStyle = o.color || GO.C.violet; X.lineWidth = o.outline; X.stroke(); }
  else { X.fillStyle = X.strokeStyle = o.color || GO.C.violet; X.fill(); X.stroke(); }
  X.restore();
};

/* خلفية فاتحة بشبكة نقط بتتحرك ببطء */
GO.bg = (ctx, t, color, dot, o = {}) => {
  const X = ctx.X; X.fillStyle = color; X.fillRect(0, 0, ctx.W, ctx.H);
  if (!dot) return;
  X.save(); X.fillStyle = dot; X.globalAlpha = o.alpha ?? 1;
  const g = o.gap || 72, oy = (t * (o.speed ?? 14)) % g, ox = (t * (o.speedX ?? 0)) % g;
  for (let y = -g; y < ctx.H + g; y += g) for (let x = -g; x < ctx.W + g; x += g) { X.beginPath(); X.arc(x + ox + ((y / g) % 2 ? g / 2 : 0), y + oy, o.r || 2.6, 0, TAU); X.fill(); }
  X.restore();
};

/* ───────── الشعار: مرسوم من قياسات صورة الشعار الأصلية (وحدات الصورة المكبرة) ───────── */
const LOGO = {
  cx: 1041, cy: 310, sw: 45, w: 1908,
  strokes: [
    { d: 'M379 172.5 A144 144 0 0 0 109 242.5 L109 377.5 A144 144 0 0 0 379 447.5', g: 1 },
    { d: 'M485.5 242.5 A144 144 0 0 1 773.5 242.5 L773.5 377.5 A144 144 0 0 1 485.5 377.5 Z' },
    { d: 'M630 251 L630 389' },
    { d: 'M863 99 L1127 99' },
    { d: 'M995.5 99 L995.5 521' },
    { d: 'M1217 99 L1217 521' },
    { d: 'M1307.5 242.5 A144 144 0 0 1 1595.5 242.5 L1595.5 377.5 A144 144 0 0 1 1307.5 377.5 Z' },
    { d: 'M1451.5 251 L1451.5 389' },
    { d: 'M1686 521 L1686 242.5 A143.5 143.5 0 0 1 1973 242.5 L1973 521' },
  ],
};
GO.LOGO = LOGO;
/* GO.logo(ctx, {cx, cy, w, k(رسم الخطوط 0..1), tri(ظهور المثلث 0..1), tag(ظهور السطر الإنجليزي 0..1), dark}) */
GO.logo = (ctx, o) => {
  const X = ctx.X, s = o.w / LOGO.w, k = o.k ?? 1, dark = !!o.dark;
  const ink = dark ? '#FFFFFF' : GO.C.navy;
  X.save(); X.translate(o.cx, o.cy); X.scale(s, s); X.translate(-LOGO.cx, -LOGO.cy);
  if (o.alpha != null) X.globalAlpha *= o.alpha;
  const grad = X.createLinearGradient(109, 0, 390, 0);
  grad.addColorStop(0, ink); grad.addColorStop(0.35, dark ? '#D9D2FF' : '#3A3091'); grad.addColorStop(1, dark ? GO.C.soft : '#6B52EE');
  LOGO.strokes.forEach((st, i) => {
    const kk = ctx.E.cubicInOut(ctx.clamp((k - i * 0.07) / 0.44));
    if (kk > 0) ctx.drawPath(X, st.d, kk, { width: LOGO.sw, color: st.g ? grad : ink, smooth: false });
  });
  const tk = o.tri ?? (k >= 1 ? 1 : 0);
  if (tk > 0) { const e = ctx.E.expoOut(ctx.clamp(tk)); GO.tri(X, 356 + (1 - e) * 120, 309, 151 * (0.9 + 0.1 * e), { color: dark ? GO.C.soft : GO.C.violet, alpha: ctx.clamp(tk * 2.5) }); }
  const gk = o.tag ?? (k >= 1 ? 1 : 0);
  if (gk > 0) {
    X.font = '200 150px "Readex Pro"'; X.textAlign = 'center'; X.textBaseline = 'alphabetic'; X.direction = 'ltr';
    const str = 'Graphic and Motion Services', tw = X.measureText(str).width, fs = 150 * (LOGO.w / tw);
    X.font = `200 ${fs}px "Readex Pro"`; X.fillStyle = ink; X.globalAlpha *= ctx.clamp(gk);
    X.save(); X.beginPath(); X.rect(80, 560, LOGO.w * ctx.E.expoOut(ctx.clamp(gk)) + 20, 240); X.clip();
    X.fillText(str, LOGO.cx, 700); X.restore();
  }
  X.restore();
};

/* ───────── نص متزامن مع الصوت: كل كلمة تطلع من تحت خطها لحظة ما تتقال ─────────
   GO.say(ctx, t, 'النص', x, y, {line:'l1', from:0, size, weight, color, hi:{index:color}, maxWidth, align, out, lead}) */
const _lay = new Map();
GO.say = (ctx, t, str, x, y, o = {}) => {
  const X = ctx.X, size = o.size || 90, key = [str, size, o.weight, o.maxWidth, o.lineHeight].join('|');
  if (!_lay.has(key)) _lay.set(key, ctx.text.layout(X, str, { family: 'display', weight: o.weight ?? 700, size, maxWidth: o.maxWidth, lineHeight: o.lineHeight || 1.25 }));
  const L = _lay.get(key), lead = o.lead ?? 0.1;
  let ga = 1; if (o.out != null) ga = 1 - ctx.at(t, o.out, o.out + (o.outDur || 0.22), 'cubicIn');
  if (ga <= 0) return null;
  X.save(); X.globalAlpha *= ga; if (o.out != null) X.translate(0, -(1 - ga) * (o.outDy ?? 40));
  const boxes = ctx.text.drawLayout(X, L, x, y, {
    align: o.align || 'center', color: o.color || GO.C.navy,
    perWord: (i) => {
      const s = o.times ? o.times[i] : ctx.wordTime(o.line, (o.from || 0) + i).s;
      const k = ctx.at(t, s - lead, s - lead + 0.34, 'expoOut');
      return { clipUp: 1, dy: (1 - k) * size * 1.05, alpha: k > 0 ? 1 : 0, color: o.hi && o.hi[i] };
    },
  });
  X.restore(); return boxes;
};

/* علامة صح مرسومة */
GO.check = (ctx, cx, cy, r, k, color) => ctx.drawPath(ctx.X, [[cx - r * 0.5, cy + r * 0.02], [cx - r * 0.12, cy + r * 0.38], [cx + r * 0.55, cy - r * 0.36]], k, { width: r * 0.24, color: color || '#fff', smooth: false });

export default GO;
