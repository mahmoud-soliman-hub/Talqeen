/* s3 — التحوّل: «أمّا الفيديو…» مثلث التشغيل يدخل والنبض يرجع · الأرقام الرمادية تتحوّل «قصـة تُرى وتُحَسّ» */
import { C, TAU, bgLight, card, icon, pulse, rise, mix, rgba, rr, tri, blob } from './lib.js';
const beatY = (u) => { u = ((u % 1) + 1) % 1; if (u < 0.08) return -18 * Math.sin(u / 0.08 * Math.PI); if (u < 0.13) return 26 * (u - 0.08) / 0.05; if (u < 0.19) return 26 - 176 * (u - 0.13) / 0.06; if (u < 0.26) return -150 + 215 * (u - 0.19) / 0.07; if (u < 0.31) return 65 - 65 * (u - 0.26) / 0.05; if (u < 0.5) return -30 * Math.sin((u - 0.31) / 0.19 * Math.PI); return 0; };
MOTION.scene({
  id: 's3', start: 10, end: 15,
  setup(ctx) { const q = ctx.seeded(5); this.nums = []; for (let j = 0; j < 4; j++) for (let i = 0; i < 2; i++) this.nums.push({ x: 460 - i * 290, y: 200 + j * 140, n: String(Math.floor(100 + q() * 899)), bar: 80 + q() * 80 });
    this.hearts = ctx.particles2D({ count: 16, seed: 8, spawn: (i, r) => ({ x: r.range(90, 490), y: r.range(420, 560), vx: r.gauss() * 14, vy: -r.range(60, 150), r: r.range(7, 16), color: r.pick([C.acc, C.hi, '#fff']), delay: r.range(0, 2.6), life: r.range(1.2, 2), shape: 'circle' }) }); },
  draw(t, lt, ctx) {
    const { X, at } = ctx, S = ctx.scene.start, w = i => ctx.wordTime('l3', i);
    bgLight(ctx, t);
    const t2 = w(2).s - 0.2, p2 = at(t, t2, t2 + 0.65, 'expoInOut'), bp = ctx.beatPulse(t, 7);
    // ── خط النبض الحي ──
    const ecgA = (1 - p2) * at(lt, 0, 0.5);
    if (ecgA > 0) {
      const y0 = 1340, spd = 1 / 1.25; X.save(); X.globalAlpha = ecgA; X.beginPath();
      for (let x = 90; x <= 990; x += 6) { const u = (x / 620) + (t - S) * spd, y = y0 + beatY(u) * (Math.abs(x - 540) < 110 ? 0 : 1) * at(lt, 0.1, 0.7, 'expoOut'); x === 90 ? X.moveTo(x, y) : X.lineTo(x, y); }
      X.lineWidth = 9; X.lineJoin = 'round'; X.lineCap = 'round'; X.strokeStyle = C.acc; X.stroke();
      const hs = 1 + 0.14 * bp; X.beginPath(); X.arc(540, y0, 98 * hs, 0, TAU); X.fillStyle = '#fff'; X.shadowColor = rgba(C.acc, 0.35); X.shadowBlur = 44; X.shadowOffsetY = 16; X.fill(); X.shadowColor = 'transparent';
      icon(X, 'heart', 540, y0 + 4, 104 * hs, C.acc, { fill: C.acc }); X.restore();
    }
    // ── بطاقة الفيديو ──
    const FX = 225, FY = 690, FW = 630, FH = 770;
    if (p2 > 0) {
      const q = at(t, w(4).s + 0.1, w(5).s + 0.55, 'cubicInOut');            // مسح من اليمين: أرقام → قصة
      X.save(); X.translate(540, FY + FH / 2 + (1 - p2) * 120); X.scale(0.92 + 0.08 * p2, 0.92 + 0.08 * p2); X.translate(-540, -(FY + FH / 2)); X.globalAlpha = p2;
      card(X, FX, FY, FW, FH, 52, '#fff', 0.2);
      X.save(); rr(X, FX, FY, FW, FH, 52); X.clip(); X.translate(FX, FY);
      // (أ) أرقام رمادية
      X.fillStyle = '#F1F1F6'; X.fillRect(0, 0, FW, FH);
      this.nums.forEach(c => { ctx.text(X, c.n, c.x, c.y, { family: 'num', weight: 800, size: 84, color: '#B4B4C6', dir: 'ltr' }); rr(X, c.x - c.bar / 2, c.y + 26, c.bar, 13, 7); X.fillStyle = '#DADAE4'; X.fill(); });
      // (ب) القصة الملوّنة
      if (q > 0) {
        const ex = FW * (1 - q); X.save(); X.beginPath(); X.rect(ex, 0, FW - ex, FH); X.clip();
        const g = X.createLinearGradient(0, 0, 0, FH); g.addColorStop(0, '#E4DEFF'); g.addColorStop(0.6, '#F4F1FF'); g.addColorStop(1, '#FFFFFF'); X.fillStyle = g; X.fillRect(0, 0, FW, FH);
        blob(X, 440, 150, 260, C.acc, 0.35); X.beginPath(); X.arc(440, 150, 62, 0, TAU); X.fillStyle = '#fff'; X.fill();
        X.fillStyle = rgba(C.acc, 0.16); X.beginPath(); X.ellipse(120, 690, 400, 190, 0, 0, TAU); X.fill();
        X.fillStyle = rgba(C.sky, 0.38); X.beginPath(); X.ellipse(520, 740, 380, 170, 0, 0, TAU); X.fill();
        const ls = t - (w(5).s - 0.1), hb = 1 + 0.1 * bp, gk = at(ls, 0.1, 0.8, 'expoOut');
        icon(X, 'users', 300, 500 + (1 - gk) * 50, 250, C.ink, { lw: 1.5, alpha: gk });
        icon(X, 'heart', 300, 265 - 12 * Math.sin(ls * 2.2) + (1 - gk) * 40, 176 * hb, C.acc, { fill: C.acc, alpha: gk });
        this.hearts.draw(X, Math.max(0, ls), 0.8);
        icon(X, 'sprout', 520, 520, 130 * at(ls, 0.5, 1.2, 'expoOut'), C.deep, { lw: 1.8 });
        // شريط التشغيل
        rr(X, 50, 692, FW - 100, 16, 8); X.fillStyle = rgba(C.ink, 0.12); X.fill();
        const pk = Math.min(1, Math.max(0, ls) / 4.2), pw = (FW - 100) * (0.08 + 0.9 * pk);
        rr(X, FW - 50 - pw, 692, pw, 16, 8); X.fillStyle = C.acc; X.fill(); X.beginPath(); X.arc(FW - 50 - pw, 700, 17, 0, TAU); X.fillStyle = '#fff'; X.shadowColor = rgba(C.ink, 0.3); X.shadowBlur = 12; X.fill();
        X.restore();
        if (q < 1) { X.fillStyle = C.acc; X.fillRect(ex - 5, 0, 10, FH); X.fillStyle = rgba(C.acc, 0.18); X.fillRect(ex - 40, 0, 40, FH); }
      }
      X.restore(); X.restore();
    }
    // ── مثلث التشغيل ──
    const kT = at(lt, 0.05, 0.85, 'expoOut'), gone = at(t, w(4).s + 0.1, w(4).s + 0.45, 'cubicIn');
    if (kT > 0 && gone < 1) {
      const ty = ctx.lerp(880, FY + FH / 2, p2), ts = ctx.lerp(360, 150, p2) * (0.9 + 0.1 * kT) * (1 + 0.05 * bp) * (1 + 0.5 * gone);
      pulse(X, 540, 880, t, S + 0.28, { r0: 120, r1: 520, n: 3, w: 12, a: 0.5 });
      const bi = ctx.beatIndex(t); if (bi >= 0 && p2 < 0.5 && lt > 1) pulse(X, 540, ty, t, ctx.beatTime(bi), { r0: 200, r1: 240, n: 1, dur: 0.6, w: 6, a: 0.35 });
      if (p2 > 0.3) { X.save(); X.globalAlpha = (p2 - 0.3) / 0.7 * (1 - gone); X.beginPath(); X.arc(540, ty, ts * 0.86, 0, TAU); X.fillStyle = '#fff'; X.shadowColor = rgba(C.ink, 0.25); X.shadowBlur = 40; X.shadowOffsetY = 14; X.fill(); X.restore(); }
      tri(X, 540 + ts * 0.06, ty, ts, { sx: Math.cos((1 - kT) * Math.PI * 3), alpha: kT * (1 - gone), shadow: p2 < 0.3 });
    }
    // ── النص ──
    rise(ctx, t, 'أمّا الفيديو..', 540, 450, { size: 138, colors: { 1: C.acc }, dur: 0.55 }, i => w(i).s - 0.08, t2 - 0.05);
    rise(ctx, t, 'يحوّل أرقامكم إلى', 540, 350, { size: 84, color: C.ink, colors: { 1: C.mut } }, i => w(i + 2).s - 0.06);
    const kq = at(t, w(5).s - 0.08, w(5).s + 0.4, 'expoOut');
    if (kq > 0) { X.save(); X.globalAlpha = kq; X.beginPath(); X.rect(0, 360, 1080, 290); X.clip(); X.translate(0, (1 - kq) * 220); ctx.text.drawKashida(X, 'قصة', 540, 590, 620, { family: 'display', weight: 700, size: 200, color: C.acc }, at(t, w(5).s + 0.1, w(5).s + 0.8, 'expoInOut')); X.restore(); }
    // شارات «تُرى» و«تُحَسّ»
    [['تُرى', 'eye', 850, 745, 0.07, 6], ['تُحَسّ', 'heart', 235, 1400, -0.07, 7]].forEach(([txt, ic, x, y, rot, wi]) => {
      const k = at(t, w(wi).s - 0.05, w(wi).s + 0.4, 'expoOut'); if (k <= 0) return;
      X.save(); X.translate(x, y + (1 - k) * 40 + Math.sin(t * 1.6 + wi) * 6); X.rotate(rot); X.scale(0.93 + 0.07 * k, 0.93 + 0.07 * k); X.globalAlpha = k;
      card(X, -150, -62, 300, 124, 62, C.ink, 0.25); icon(X, ic, 92, 0, 62, C.hi, ic === 'heart' ? { fill: C.hi } : {});
      ctx.text(X, txt, -28, 22, { family: 'display', weight: 700, size: 62, color: '#fff' }); X.restore();
    });
  },
});
