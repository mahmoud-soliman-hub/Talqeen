/* مكتبة مشتركة لمشاهد جوشن: الألوان، الخلفيات، الشعار المتجهي، الأيقونات، ومساعدات النص */
import { TAGLINE } from './tagline.js';

export const C = {
  bg: '#F6F5FC', ink: '#16154E', acc: '#7458FB', deep: '#4B3BC4', hi: '#C9BEFF', soft: '#E9E5FB',
  mut: '#8E8CAB', white: '#FFFFFF', grey: '#B4B4C4', greyBg: '#ECEBF2', night: '#100F3A', sky: '#9BB8FF',
};
export const TAU = Math.PI * 2;
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const mix = (a, b, k) => { const A = hex(a), B = hex(b); k = Math.max(0, Math.min(1, k)); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`; };
export const rgba = (h, a) => { const A = hex(h); return `rgba(${A[0]},${A[1]},${A[2]},${Math.max(0, Math.min(1, a))})`; };

/* ───────── خلفيات ───────── */
let _dots = null;
function dots() {
  if (_dots) return _dots;
  _dots = document.createElement('canvas'); _dots.width = 1080; _dots.height = 1920;
  const x = _dots.getContext('2d'); x.fillStyle = '#16154E';
  for (let j = 0; j < 33; j++) for (let i = 0; i < 19; i++) { x.beginPath(); x.arc(30 + i * 60, 30 + j * 60, 2.2, 0, TAU); x.fill(); }
  return _dots;
}
export function blob(X, x, y, r, color, a) {
  const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(color, a)); g.addColorStop(1, rgba(color, 0));
  X.fillStyle = g; X.fillRect(x - r, y - r, 2 * r, 2 * r);
}
export function bgLight(ctx, t, o = {}) {
  const X = ctx.X, a = o.a ?? 1;
  X.fillStyle = o.color || C.bg; X.fillRect(0, 0, 1080, 1920);
  blob(X, 180 + 70 * Math.sin(t * 0.45), 330 + 90 * Math.cos(t * 0.33), 640, C.acc, 0.17 * a);
  blob(X, 930 + 80 * Math.cos(t * 0.38), 1540 + 70 * Math.sin(t * 0.5), 720, C.sky, 0.24 * a);
  X.globalAlpha = 0.07 * (o.dots ?? 1); X.drawImage(dots(), 0, 0, 1080, 1920); X.globalAlpha = 1;
}
export function bgDark(ctx, t, o = {}) {
  const X = ctx.X;
  X.fillStyle = o.color || C.night; X.fillRect(0, 0, 1080, 1920);
  blob(X, 880 + 80 * Math.sin(t * 0.4), 380 + 70 * Math.cos(t * 0.3), 700, C.acc, 0.30);
  blob(X, 160 + 60 * Math.cos(t * 0.36), 1560 + 80 * Math.sin(t * 0.44), 760, C.deep, 0.34);
  X.save(); X.globalCompositeOperation = 'lighter'; X.globalAlpha = 0.05; X.filter = 'invert(1)'; X.drawImage(dots(), 0, 0, 1080, 1920); X.restore();
}

/* ───────── أشكال ───────── */
export function rr(X, x, y, w, h, r) { X.beginPath(); X.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2)); }
export function card(X, x, y, w, h, r, fill, sh = 0.16) {
  X.save();
  if (sh) { X.shadowColor = rgba(C.ink, sh); X.shadowBlur = 44; X.shadowOffsetY = 18; }
  rr(X, x, y, w, h, r); X.fillStyle = fill; X.fill(); X.restore();
}
/* مثلث التشغيل من الشعار — رأسه لليسار (اتجاه القراءة العربية) */
export function tri(X, cx, cy, s, o = {}) {
  X.save(); X.translate(cx, cy); if (o.rot) X.rotate(o.rot); X.scale((o.sx ?? 1) * (o.flip ? -1 : 1), o.sy ?? 1);
  if (o.alpha != null) X.globalAlpha *= o.alpha;
  X.beginPath(); X.moveTo(-0.56 * s, 0); X.lineTo(0.38 * s, -0.56 * s); X.lineTo(0.38 * s, 0.56 * s); X.closePath();
  X.lineJoin = 'round'; X.lineWidth = s * 0.14; X.strokeStyle = o.color || C.acc; X.fillStyle = o.color || C.acc;
  if (o.shadow) { X.shadowColor = rgba(C.acc, 0.45); X.shadowBlur = 50; X.shadowOffsetY = 22; }
  X.fill(); X.shadowColor = 'transparent'; X.stroke(); X.restore();
}
export function ring(X, cx, cy, r, w, color, a = 1) {
  if (r <= 0 || a <= 0) return; X.save(); X.globalAlpha *= a; X.beginPath(); X.arc(cx, cy, r, 0, TAU); X.lineWidth = w; X.strokeStyle = color; X.stroke(); X.restore();
}
/* حلقات نبض تخرج من نقطة */
export function pulse(X, cx, cy, t, t0, o = {}) {
  const n = o.n || 3, dur = o.dur || 0.9;
  for (let i = 0; i < n; i++) { const k = (t - t0 - i * (o.gap || 0.14)) / dur; if (k <= 0 || k >= 1) continue; const e = 1 - Math.pow(1 - k, 3); ring(X, cx, cy, (o.r0 || 40) + e * (o.r1 || 420), (o.w || 10) * (1 - k), o.color || C.acc, (1 - k) * (o.a || 0.6)); }
}

/* ───────── أيقونات خطّية (شبكة 24) ───────── */
const ICONS = {
  heart: 'M12 20.5s-7.3-4.5-9.2-9.1C1.3 7.8 3.4 4.5 6.8 4.5c2 0 3.6 1 5.2 3 1.6-2 3.2-3 5.2-3 3.4 0 5.5 3.3 4 6.9-1.9 4.6-9.2 9.1-9.2 9.1z',
  book: 'M12 6.5C10.3 5 8 4.5 3.5 4.5v13.5c4.5 0 6.8.5 8.5 2 1.7-1.5 4-2 8.5-2V4.5C16 4.5 13.700 5 12 6.5z M12 6.500V20',
  drop: 'M12 3.200s6.3 6.800 6.3 11.300a6.300 6.300 0 0 1-12.600 0C5.700 10 12 3.200 12 3.200z',
  home: 'M3.500 11.500L12 4l8.500 7.500 M5.500 9.800V19.500h13V9.800 M10 19.500v-5.500h4v5.500',
  sprout: 'M12 20.500v-8.500 M12 12c0-3.500-2.500-6-7.500-6 0 4.200 2.700 6.500 7.500 6z M12 14.500c0-3 2.200-5.200 7-5.200 0 3.700-2.300 5.700-7 5.200z',
  box: 'M3.500 8L12 3.500 20.500 8v8.500L12 21l-8.500-4.500z M3.500 8L12 12.500 20.500 8 M12 12.500V21',
  users: 'M9 11a3.500 3.500 0 1 0 0-7 3.500 3.500 0 0 0 0 7z M2.500 20c0-3.600 2.900-6 6.500-6s6.500 2.400 6.500 6 M16.200 4.300a3.500 3.500 0 0 1 0 6.400 M18 14.300c2.200.8 3.500 2.900 3.500 5.700',
  check: 'M5 12.500l4.500 4.500L19 7.500',
  video: 'M3.500 7.500A1.500 1.500 0 0 1 5 6h9a1.500 1.500 0 0 1 1.500 1.500v9A1.500 1.500 0 0 1 14 18H5a1.500 1.500 0 0 1-1.500-1.500z M15.500 10.500l5-3v9l-5-3',
  eye: 'M2 12s3.600-6.500 10-6.500S22 12 22 12s-3.600 6.500-10 6.500S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  file: 'M6 3h8l4 4v13.500a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5z M14 3v4h4 M9 12h6 M9 16h6',
  hand: 'M3 14.500l3.500-3h4.200c1 0 1.800.8 1.800 1.800s-.8 1.700-1.800 1.700H8.500 M12.300 14l5.200-2.300c.9-.4 2 0 2.400.9.400.9 0 1.900-.8 2.400L12.500 19H6.500L3 20.500',
};
const _ip = {};
export function icon(X, name, cx, cy, size, color, o = {}) {
  const p = _ip[name] || (_ip[name] = new Path2D(ICONS[name])), s = size / 24;
  X.save(); X.translate(cx, cy); if (o.rot) X.rotate(o.rot); X.scale(s * (o.sx ?? 1), s * (o.sy ?? 1)); X.translate(-12, -12);
  if (o.alpha != null) X.globalAlpha *= o.alpha;
  X.lineCap = 'round'; X.lineJoin = 'round'; X.lineWidth = o.lw || 1.9;
  if (o.fill) { X.fillStyle = o.fill; X.fill(p); }
  if (o.k != null && o.k < 1) X.setLineDash([o.k * 90, 200]);
  X.strokeStyle = color; X.stroke(p); X.restore();
}

/* ───────── نص: كلمات تطلع من تحت خط الأساس على توقيت الصوت ───────── */
const _L = new Map();
export function layoutOf(ctx, str, o) {
  const key = str + '|' + [o.family, o.weight, o.size, o.maxWidth].join(',');
  let L = _L.get(key);
  if (!L) { L = ctx.text.layout(ctx.X, str, { family: o.family || 'display', weight: o.weight || 700, size: o.size, maxWidth: o.maxWidth, lineHeight: o.lineHeight || 1.3 }); _L.set(key, L); }
  return L;
}
/* startOf(i) = وقت دخول الكلمة i ؛ out = وقت الخروج (اختياري) */
export function rise(ctx, t, str, x, y, o, startOf, out) {
  const L = layoutOf(ctx, str, o), ko = out != null ? ctx.at(t, out, out + (o.outDur || 0.28), 'cubicIn') : 0;
  if (ko >= 1) return null;
  return ctx.text.drawLayout(ctx.X, L, x, y, {
    align: o.align || 'center', color: o.color || C.ink, perWord: (i) => {
      const s = startOf(i), k = ctx.at(t, s, s + (o.dur || 0.5), 'expoOut');
      if (k <= 0) return { alpha: 0 };
      return { clipUp: 1, dy: (1 - k) * o.size * 1.45 - ko * o.size * 0.5, alpha: 1 - ko, color: o.colors && o.colors[i] };
    },
  });
}

/* ───────── شعار جوشن — مقاس من ملف الشعار الأصلي (إحداثيات 640×640) ───────── */
const LOGO = {
  box: { x: 81.5, y: 248.5, w: 477, h: 117 }, cx: 320, cy: 307,
  sw: 11,
  g: 'M155.5 276.5 A35.5 35.5 0 0 0 87 289.5 L87 324.5 A35.5 35.5 0 0 0 155.5 337.5',
  tri: [[128.1, 307.4], [163, 287.3], [163, 327.5]],
  strokes: [                                   // بترتيب الرسم (من اليسار لليمين مثل قراءة الاسم اللاتيني)
    { d: 'M181 324 L181 290 A36 36 0 0 1 253 290 L253 324 A36 36 0 0 1 181 324', w: 11 },   // O
    { d: 'M217 293 L217 326', w: 10 },
    { d: 'M275.5 254 L341.5 254', w: 11 }, { d: 'M308.5 254 L308.5 360', w: 11 },            // T
    { d: 'M364 254 L364 360', w: 11 },                                                       // I
    { d: 'M386 324 L386 290 A36.5 36 0 0 1 459 290 L459 324 A36.5 36 0 0 1 386 324', w: 11 },// O
    { d: 'M422.5 293 L422.5 326', w: 10 },
    { d: 'M481 360 L481 290 A36 36 0 0 1 553 290 L553 360', w: 11 },                         // N
  ],
};
let _tag = null;
/* drawLogo(ctx, cx, cy, width, { k:(i)=>0..1 تقدّم رسم كل جزء (0=G ، 1..8 الباقي) , tri:0..1 , tag:0..1 , ink , mono })
   المركز (cx,cy) = مركز كلمة GOTION نفسها. */
export function drawLogo(ctx, cx, cy, width, o = {}) {
  const X = ctx.X, s = width / LOGO.box.w, k = o.k || (() => 1), ink = o.ink || C.ink;
  X.save(); X.translate(cx, cy); X.scale(s, s); X.translate(-LOGO.cx, -LOGO.cy);
  X.lineCap = 'round'; X.lineJoin = 'round';
  const stroke = (d, w, kk, style) => { if (kk <= 0) return; const P = ctx.pathInfo(d); X.save(); X.lineWidth = w; X.strokeStyle = style; if (kk < 1) X.setLineDash([kk * P.len, P.len + 20]); X.stroke(P.path); X.restore(); };
  const g = X.createLinearGradient(87, 0, 158, 0); g.addColorStop(0, o.mono || '#1B1A58'); g.addColorStop(1, o.mono || '#7058F6');
  stroke(LOGO.g, LOGO.sw, k(0), g);
  LOGO.strokes.forEach((p, i) => stroke(p.d, p.w, k(i + 1), ink));
  const tk = o.tri ?? 1;
  if (tk > 0) {
    const T = LOGO.tri, mx = 151.4, my = 307.4;
    X.save(); X.translate(mx, my); X.scale(tk, tk); X.translate(-mx, -my);
    X.beginPath(); X.moveTo(T[0][0], T[0][1]); X.lineTo(T[1][0], T[1][1]); X.lineTo(T[2][0], T[2][1]); X.closePath();
    X.fillStyle = o.mono || C.acc; X.strokeStyle = o.mono || C.acc; X.lineWidth = 2.2; X.fill(); X.stroke(); X.restore();
  }
  const tg = o.tag ?? 1;
  if (tg > 0) { _tag = _tag || new Path2D(TAGLINE); X.save(); X.globalAlpha *= tg; X.translate(0, (1 - tg) * 10); X.fillStyle = o.tagColor || ink; X.fill(_tag); X.restore(); }
  X.restore();
}
export const LOGO_GEOM = LOGO;
