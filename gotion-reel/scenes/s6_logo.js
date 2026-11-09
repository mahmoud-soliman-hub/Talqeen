/* s6 — الختام: الشعار يترسم خط خط، ثم «أثركم يستحق أن يُرى» وزر التواصل */
import { C, bgLight, rr, tri, pulse, rise, drawLogo, rgba, ring } from './lib.js';
MOTION.scene({
  id: 's6', start: 25, end: 30.6,
  draw(t, lt, ctx) {
    const { X, at } = ctx, S = ctx.scene.start, w = i => ctx.wordTime('l6', i);
    bgLight(ctx, t);
    // زخارف هادية من هندسة الشعار (كبسولات ومثلثات) على الأطراف
    const deco = [[140, 300, 150, 62, -0.5], [930, 420, 110, 46, 0.6], [150, 1480, 120, 50, 0.5], [900, 1420, 170, 66, -0.4]];
    deco.forEach((d, i) => { const k = at(t, S + 0.3 + i * 0.1, S + 1.1 + i * 0.1, 'expoOut'); if (k <= 0) return; X.save(); X.translate(d[0], d[1] + Math.sin(t * 0.8 + i * 2) * 14 + (1 - k) * 60); X.rotate(d[4] + Math.sin(t * 0.3 + i) * 0.06); X.globalAlpha = 0.5 * k; rr(X, -d[2] / 2, -d[3] / 2, d[2], d[3], d[3] / 2); X.lineWidth = 7; X.strokeStyle = i % 2 ? C.hi : rgba(C.acc, 0.45); X.stroke(); X.restore(); });

    // الشعار
    const LW = 760, LX = 540, LY = 700, s = LW / 477;
    const breathe = 1 + 0.012 * Math.sin((t - S) * 1.6);
    X.save(); X.translate(LX, LY); X.scale(breathe, breathe); X.translate(-LX, -LY);
    const tT = S + 1.15, tx = LX + (151.4 - 320) * s, ty = LY + 0.4 * s;
    pulse(X, tx, ty, t, tT + 0.05, { r0: 30, r1: 330, n: 2, w: 8, a: 0.5 });
    drawLogo(ctx, LX, LY, LW, {
      k: i => at(t, S + 0.3 + i * 0.075, S + 1.05 + i * 0.075, 'cubicInOut'),
      tri: at(t, tT, tT + 0.4, 'expoOut'),
      tag: at(t, S + 1.45, S + 2.0, 'cubicOut'),
    });
    X.restore();

    // الجملة
    const boxes = rise(ctx, t, 'أثركم يستحق أن يُرى', 540, 1120, { size: 98, colors: { 3: C.acc }, dur: 0.55 }, i => w(i + 1).s - 0.06);
    const uk = at(t, w(4).s + 0.15, w(4).s + 0.6, 'cubicOut');
    if (boxes && uk > 0) { const b = boxes[3]; ctx.drawPath(X, [[b.x + b.w + 6, 1158], [b.cx, 1166], [b.x - 6, 1156]], uk, { width: 9, color: C.acc }); }

    // زر التواصل
    const cs = w(5).s - 0.08, ck = at(t, cs, cs + 0.45, 'expoOut');
    if (ck > 0) {
      const bw = 620, bh = 148, by = 1300;
      const loop = ((t - cs - 0.5) % 1.875 + 1.875) % 1.875 / 1.875;
      if (t > cs + 0.5) { X.save(); X.globalAlpha = (1 - loop) * 0.5; const g = loop * 46; rr(X, 540 - bw / 2 - g, by - bh / 2 - g, bw + 2 * g, bh + 2 * g, bh); X.lineWidth = 6; X.strokeStyle = C.acc; X.stroke(); X.restore(); }
      X.save(); X.translate(540, by + (1 - ck) * 40); X.scale(0.94 + 0.06 * ck, 0.94 + 0.06 * ck); X.globalAlpha = ck;
      X.shadowColor = rgba(C.acc, 0.42); X.shadowBlur = 50; X.shadowOffsetY = 22;
      rr(X, -bw / 2, -bh / 2, bw, bh, bh / 2); X.fillStyle = C.acc; X.fill(); X.shadowColor = 'transparent';
      X.beginPath(); X.arc(-bw / 2 + 74, 0, 46, 0, 6.2832); X.fillStyle = '#fff'; X.fill();
      tri(X, -bw / 2 + 70 - 5 * Math.max(0, Math.sin((t - cs) * 5)), 0, 38, { color: C.acc });
      ctx.text(X, 'تواصلوا معنا', 46, 24, { family: 'display', weight: 700, size: 68, color: '#fff' });
      X.restore();
    }
  },
});
