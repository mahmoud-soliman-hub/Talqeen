/* s5 — «في جوشن نصمّم فيديوهات موشن جرافيك تُبرز أثركم باحتراف» — خلف الكواليس: لوحة تحريك حيّة */
import { C, TAU, bgDark, icon, rise, rgba, rr, tri, layoutOf, mix } from './lib.js';
const N = 60;
function shape(kind) {                                       // 60 نقطة على محيط دائرة/كبسولة/مثلث
  const pts = [];
  for (let i = 0; i < N; i++) {
    const a = i / N * TAU, c = Math.cos(a), s = Math.sin(a);
    if (kind === 0) pts.push([c * 70, s * 70]);
    else if (kind === 1) pts.push([c * 52 + 62 * Math.max(-1, Math.min(1, c * 3)), s * 52]);
    else { const V = [[-78, 0], [52, -78], [52, 78]], u = (i / N * 3 + 1.5) % 3, e = Math.floor(u), f = u - e, A = V[e], B = V[(e + 1) % 3]; pts.push([A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f]); }
  }
  return pts;
}
MOTION.scene({
  id: 's5', start: 20, end: 25,
  setup(ctx) {
    this.S = [shape(0), shape(1), shape(2)];
    this.tracks = [[[560, 900, C.acc], [150, 500, C.hi]], [[380, 820, '#9BB8FF']], [[620, 900, C.hi], [260, 560, C.acc]], [[150, 700, '#6C8CFF']]];
  },
  draw(t, lt, ctx) {
    const { X, at } = ctx, S = ctx.scene.start, w = i => ctx.wordTime('l5', i), bp = ctx.beatPulse(t, 7);
    bgDark(ctx, t);
    // ── النص ──
    rise(ctx, t, 'في جوشن', 540, 300, { size: 84, color: C.hi }, i => w(i).s - 0.08);
    rise(ctx, t, 'نصمّم فيديوهات', 540, 455, { size: 112, color: '#fff', dur: 0.5 }, i => w(i + 2).s - 0.08);
    const L = layoutOf(ctx, 'موشن جرافيك', { size: 104 }), pk = at(t, w(4).s - 0.14, w(4).s + 0.3, 'expoOut');
    if (pk > 0) { const pw = L.width + 110, x1 = 540 + pw / 2; X.save(); rr(X, x1 - pw * pk, 505, pw * pk, 158, 79); X.fillStyle = C.acc; X.shadowColor = rgba(C.acc, 0.5); X.shadowBlur = 50; X.shadowOffsetY = 18; X.fill(); X.restore(); }
    rise(ctx, t, 'موشن جرافيك', 540, 620, { size: 104, color: '#fff', dur: 0.45 }, i => w(i + 4).s - 0.06);
    rise(ctx, t, 'تُبرز أثركم باحتراف', 540, 1455, { size: 92, color: '#fff', colors: { 2: '#B3A5FF' }, dur: 0.5 }, i => w(i + 6).s - 0.08);

    // ── لوحة التحريك ──
    const kp = at(lt, 0.1, 0.8, 'expoOut'); if (kp <= 0) return;
    const PX = 80, PY = 735, PW = 920, PH = 600;
    X.save(); X.translate(0, (1 - kp) * 120); X.globalAlpha = kp;
    rr(X, PX, PY, PW, PH, 46); X.fillStyle = 'rgba(255,255,255,0.06)'; X.fill(); X.lineWidth = 3; X.strokeStyle = rgba('#FFFFFF', 0.14 + 0.1 * bp); X.stroke();
    // رأس اللوحة
    [0, 1, 2].forEach(i => { X.beginPath(); X.arc(PX + PW - 46 - i * 34, PY + 40, 9, 0, TAU); X.fillStyle = [C.acc, C.hi, 'rgba(255,255,255,.3)'][i]; X.fill(); });
    rr(X, PX + 36, PY + 28, 150, 24, 12); X.fillStyle = 'rgba(255,255,255,.12)'; X.fill();
    // منطقة المعاينة: شكل يتحوّل ويمشي على مسار
    const u = at(t, S + 0.8, S + 4.5, 'cubicInOut');
    const A = [870, 925], B = [690, 775], Cc = [400, 1010], Dd = [215, 880];
    const bez = k => { const m = 1 - k; return [m * m * m * A[0] + 3 * m * m * k * B[0] + 3 * m * k * k * Cc[0] + k * k * k * Dd[0], m * m * m * A[1] + 3 * m * m * k * B[1] + 3 * m * k * k * Cc[1] + k * k * k * Dd[1]]; };
    X.save(); X.setLineDash([3, 16]); X.lineCap = 'round'; X.lineWidth = 5; X.strokeStyle = 'rgba(255,255,255,.3)'; X.beginPath(); X.moveTo(A[0], A[1]); X.bezierCurveTo(B[0], B[1], Cc[0], Cc[1], Dd[0], Dd[1]); X.stroke(); X.restore();
    [[A, B], [Dd, Cc]].forEach(([p, h]) => { X.beginPath(); X.moveTo(p[0], p[1]); X.lineTo(h[0], h[1]); X.lineWidth = 3; X.strokeStyle = rgba(C.hi, 0.6); X.stroke(); X.fillStyle = '#fff'; X.fillRect(p[0] - 9, p[1] - 9, 18, 18); X.beginPath(); X.arc(h[0], h[1], 10, 0, TAU); X.fillStyle = C.hi; X.fill(); });
    const morph = k => { const a = k < 0.5 ? this.S[0] : this.S[1], b = k < 0.5 ? this.S[1] : this.S[2], f = ctx.E.cubicInOut(ctx.clamp(k < 0.5 ? (k - 0.12) / 0.3 : (k - 0.58) / 0.3)); return a.map((p, i) => [p[0] + (b[i][0] - p[0]) * f, p[1] + (b[i][1] - p[1]) * f]); };
    for (let gI = 3; gI >= 0; gI--) {
      const k = Math.max(0, u - gI * 0.035), p = bez(k), pts = morph(k);
      X.save(); X.translate(p[0], p[1]); X.rotate(-k * 0.5); X.globalAlpha *= gI ? 0.16 : 1; X.beginPath(); pts.forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); X.closePath();
      X.fillStyle = gI ? C.hi : C.acc; X.lineJoin = 'round'; X.lineWidth = 14; X.strokeStyle = X.fillStyle; if (!gI) { X.shadowColor = rgba(C.acc, 0.7); X.shadowBlur = 40; } X.fill(); X.stroke(); X.restore();
    }
    // التايملاين
    const TY = PY + 330, phX = 900 - 770 * u;
    X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(PX + 30, TY - 22, PW - 60, 2);
    this.tracks.forEach((tr, i) => {
      const y = TY + i * 60;
      tr.forEach(([x0, x1, col], j) => {
        const k = at(lt, 0.4 + i * 0.09 + j * 0.12, 0.95 + i * 0.09 + j * 0.12, 'expoOut'); if (k <= 0) return;
        const passed = phX < x1 ? 1 : 0.42; X.save(); X.globalAlpha *= passed; rr(X, x1 - (x1 - x0) * k, y, (x1 - x0) * k, 40, 20); X.fillStyle = col; X.fill(); X.restore();
        [x1 - 30, (x0 + x1) / 2, x0 + 30].forEach((kx, n) => { const kk = at(lt, 0.9 + i * 0.09 + n * 0.08, 1.2 + i * 0.09 + n * 0.08, 'expoOut'); if (kk <= 0) return; X.save(); X.translate(kx, y + 20); X.rotate(Math.PI / 4); X.scale(kk, kk); X.fillStyle = Math.abs(phX - kx) < 26 ? '#fff' : C.night; X.fillRect(-8, -8, 16, 16); X.restore(); });
      });
    });
    X.fillStyle = '#fff'; X.fillRect(phX - 2.5, TY - 40, 5, 290); X.save(); X.translate(phX, TY - 44); X.rotate(-Math.PI / 2); tri(X, 0, 0, 34, { color: '#fff' }); X.restore();
    X.restore();
  },
});
