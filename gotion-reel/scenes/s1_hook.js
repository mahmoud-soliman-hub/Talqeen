/* s1 — الهوك: «جمعيتكم تصنع أثرًا عظيمًا» كوكبة أنشطة حيّة… ثم تنطفي الأنوار: «لكن، من يراه؟» */
import { C, TAU, bgLight, card, icon, pulse, rise, mix, rgba, ring, rr } from './lib.js';
const SATS = ['book', 'drop', 'home', 'sprout', 'box', 'users'];
MOTION.scene({
  id: 's1', start: 0, end: 5,
  draw(t, lt, ctx) {
    const { X, at } = ctx, w = i => ctx.wordTime('l1', i);
    const tD = w(4).s - 0.12, D = at(t, tD, tD + 0.5, 'cubicInOut');           // 0 = نهار ، 1 = الأنوار انطفت
    bgLight(ctx, t, { color: mix(C.bg, C.night, D), a: 1 - 0.55 * D, dots: 1 - D });

    // ── الكوكبة ──
    const cx = 540, cy = 1120 + 30 * D, R = 318;
    const bp = ctx.beatPulse(t, 7) * (1 - D);
    const bi = ctx.beatIndex(t); if (bi >= 0 && D < 0.5) pulse(X, cx, cy, t, ctx.beatTime(bi), { r0: 115, r1: 360, n: 1, dur: 0.62, w: 7, a: 0.4 });
    ring(X, cx, cy, R, 3, D > 0 ? rgba(C.hi, 0.22) : rgba(C.acc, 0.22), at(lt, 0.2, 0.9, 'cubicOut'));
    SATS.forEach((name, i) => {
      const k = at(lt, 0.22 + i * 0.13, 0.75 + i * 0.13, 'expoOut'); if (k <= 0) return;
      const a = -Math.PI / 2 + i * TAU / 6 + lt * 0.2 * (1 - 0.7 * D) + 0.3, r = R * (0.55 + 0.45 * k);
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r + Math.sin(t * 1.3 + i) * 7, s = 172 * (0.9 + 0.1 * k) * (1 + 0.05 * bp);
      X.save(); X.globalAlpha = k * 0.3 * (1 - D); X.beginPath(); X.moveTo(cx, cy); X.lineTo(x, y); X.lineWidth = 4; X.strokeStyle = C.acc; X.setLineDash([2, 14]); X.lineCap = 'round'; X.stroke(); X.restore();
      X.save(); X.globalAlpha = k;
      if (D < 1) { X.save(); X.globalAlpha *= 1 - D; card(X, x - s / 2, y - s / 2, s, s, 48, '#fff', 0.14); X.restore(); }
      if (D > 0) { X.save(); X.globalAlpha *= D; rr(X, x - s / 2, y - s / 2, s, s, 48); X.lineWidth = 4; X.strokeStyle = rgba(C.hi, 0.28); X.stroke(); X.restore(); }
      icon(X, name, x, y, 92, mix([C.acc, C.deep, C.acc, C.deep, C.acc, C.deep][i], '#5E5C96', D), { alpha: 1 - 0.45 * D, lw: 1.9 });
      X.restore();
    });
    const kc = at(lt, 0.08, 0.6, 'expoOut');
    if (kc > 0) {
      const r = 122 * (0.9 + 0.1 * kc) * (1 + 0.06 * bp);
      X.save(); X.globalAlpha = kc;
      X.beginPath(); X.arc(cx, cy, r, 0, TAU); X.fillStyle = mix(C.acc, '#1D1B55', D);
      if (D < 1) { X.shadowColor = rgba(C.acc, 0.45 * (1 - D)); X.shadowBlur = 60; X.shadowOffsetY = 24; } X.fill(); X.shadowColor = 'transparent';
      if (D > 0) ring(X, cx, cy, r, 4, rgba(C.hi, 0.5), D);
      if (D < 1) icon(X, 'heart', cx, cy + 4, 120, '#fff', { fill: '#fff', alpha: 1 - D });
      if (D > 0) { const blink = at(t, w(6).s + 0.55, w(6).s + 0.8, 'cubicInOut'); icon(X, 'eye', cx, cy, 128, C.hi, { alpha: D, sy: 1 - 0.9 * blink, lw: 1.7 }); if (blink > 0.5) { X.save(); X.globalAlpha = (blink - 0.5) * 2; X.beginPath(); X.moveTo(cx - 50, cy + 50); X.lineTo(cx + 50, cy - 50); X.lineWidth = 9; X.lineCap = 'round'; X.strokeStyle = C.hi; X.stroke(); X.restore(); } }
      X.restore();
    }

    // ── النص ──
    rise(ctx, t, 'جمعيتكم تصنع', 540, 430, { size: 94, color: C.ink }, i => w(i).s - 0.08, tD - 0.1);
    rise(ctx, t, 'أثرًا عظيمًا', 540, 650, { size: 170, colors: { 0: C.acc }, dur: 0.6 }, i => w(i + 2).s - 0.08, tD - 0.05);
    rise(ctx, t, 'لكن..', 540, 430, { size: 90, color: C.hi }, () => w(4).s - 0.02);
    const kq = at(t, w(5).s - 0.06, w(5).s + 0.45, 'expoOut');
    if (kq > 0) {
      X.save(); X.globalAlpha = kq; X.beginPath(); X.rect(0, 440, 1080, 300); X.clip(); X.translate(0, (1 - kq) * 230);
      ctx.text.drawKashida(X, 'من يراه؟', 540, 670, 880, { family: 'display', weight: 700, size: 184, color: '#fff' }, at(t, w(6).s, w(6).s + 0.75, 'expoInOut'));
      X.restore();
    }
  },
});
