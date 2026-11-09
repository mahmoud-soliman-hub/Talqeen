/* s7 — الختام: «جوشن. شريكك الإبداعي كل شهر. تواصل معنا الحين.» */
import GO from './_lib.js';

MOTION.scene({
  id: 's7',
  setup(ctx) {
    this.bits = ctx.particles2D({ count: 26, seed: 11, spawn: (i, r) => { const a = r() * 6.2832, v = r.range(160, 420); return { x: 540, y: 700, vx: Math.cos(a) * v * 1.4, vy: Math.sin(a) * v, r: r.range(7, 15), color: r.pick([GO.C.violet, GO.C.soft, GO.C.navy]), shape: r.pick(['circle', 'rect', 'tri']), delay: 0.75 + r() * 0.15, life: 1.1 }; }, drag: 2.4 });
  },
  draw(t, lt, ctx) {
    const { X, at } = ctx, C = GO.C, w = i => ctx.wordTime('l7', i);
    GO.bg(ctx, t, C.paper, C.mist, { speed: 10 });
    const t0 = w(0).s - 0.3;
    this.bits.draw(X, t - t0);
    GO.logo(ctx, { cx: 540, cy: 690, w: 800, k: at(t, t0, t0 + 0.95, 'linear'), tri: at(t, t0 + 0.6, t0 + 1.0, 'linear'), tag: at(t, t0 + 0.8, t0 + 1.4, 'linear') });
    GO.say(ctx, t, 'شريكك الإبداعي كل شهر', 540, 1110, { line: 'l7', from: 1, size: 74, hi: { 1: C.violet } });
    // زر التواصل
    const tc = w(5).s - 0.15, k = at(t, tc, tc + 0.4, 'expoOut');
    if (k > 0) {
      X.save(); X.translate(540, 1300 + (1 - k) * 40); X.scale(0.94 + 0.06 * k, 0.94 + 0.06 * k); X.globalAlpha = Math.min(1, k * 2);
      const pr = ((t - tc) * 0.9) % 1; X.save(); X.globalAlpha *= (1 - pr) * 0.45; X.strokeStyle = C.violet; X.lineWidth = 5; GO.rr(X, -340 - pr * 34, -78 - pr * 34, 680 + pr * 68, 156 + pr * 68, 78 + pr * 34); X.stroke(); X.restore();
      GO.rr(X, -340, -78, 680, 156, 78); X.fillStyle = C.violet; X.fill();
      X.fillStyle = '#fff'; X.beginPath(); X.arc(-262, 0, 50, 0, 6.2832); X.fill();
      GO.tri(X, -262 - 4 - 5 * Math.sin((t - tc) * 5), 0, 46, { color: C.violet });
      X.restore();
      X.save(); X.translate(0, (1 - k) * 40);
      GO.say(ctx, t, 'تواصل معنا الحين', 592, 1322, { line: 'l7', from: 5, size: 62, color: '#fff' });
      X.restore();
    }
  },
});
