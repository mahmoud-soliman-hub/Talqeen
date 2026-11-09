/* s5 — العرض: «شراكة شهرية مستمرة.. بخصومات كبيرة ما تلقاها بالقطعة.» */
import GO from './_lib.js';

MOTION.scene({
  id: 's5',
  draw(t, lt, ctx) {
    const { X, at, E } = ctx, C = GO.C, w = i => ctx.wordTime('l5', i);
    GO.bg(ctx, t, C.night, '#23246A', { speed: 16 });
    const tB = w(3).s - 0.25, kB = at(t, tB, tB + 0.55, 'expoInOut');

    // حلقة الشهور: 12 علامة بتنور ورا بعض ومكملة لف — «مستمرة»
    const cy = 660 - kB * 250, sc = 1 - kB * 0.5, R = 330;
    X.save(); X.translate(540, cy); X.scale(sc, sc);
    const kr = at(lt, 0.0, 0.9, 'expoOut');
    X.strokeStyle = '#272A72'; X.lineWidth = 26; X.beginPath(); X.arc(0, 0, R, 0, 6.2832); X.stroke();
    const head = -1.5708 + lt * 2.4, len = 4.4 * kr;
    X.strokeStyle = C.violet; X.lineCap = 'round'; X.beginPath(); X.arc(0, 0, R, head - len, head); X.stroke();
    // راس السهم = مثلث الشعار
    X.save(); X.rotate(head); X.translate(R, 0); GO.tri(X, 0, 6, 74, { color: '#fff', dir: 1, rot: 1.5708 }); X.restore();
    for (let i = 0; i < 12; i++) {
      const a = -1.5708 + i * 0.5236, d = ((head - a) % 6.2832 + 6.2832) % 6.2832, lit = Math.exp(-d * 1.1) * kr;
      X.save(); X.rotate(a); X.fillStyle = C.soft; X.globalAlpha = (0.25 + 0.75 * lit) * kr; GO.rr(X, R + 44, -7, 30 + 22 * lit, 14, 7); X.fill(); X.restore();
    }
    X.restore();

    // A: شراكة شهرية + مستمرة بالكشيدة
    GO.say(ctx, t, 'شراكة', 540, 640, { line: 'l5', from: 0, size: 132, color: '#fff', out: tB });
    GO.say(ctx, t, 'شهرية', 540, 790, { line: 'l5', from: 1, size: 132, color: C.soft, out: tB });
    const kM = at(t, w(2).s - 0.1, w(2).s + 0.25, 'expoOut') * (1 - at(t, tB, tB + 0.25, 'cubicIn'));
    if (kM > 0) {
      X.save(); X.globalAlpha = kM; X.translate(0, (1 - kM) * 50);
      GO.rr(X, 150, 1150, 780, 190, 95); X.fillStyle = C.violet; X.fill();
      ctx.text.drawKashida(X, 'مستمرة', 540, 1284, 640, { family: 'display', weight: 700, size: 120, color: '#fff' }, at(t, w(2).s, w(2).e + 0.25, 'expoInOut'));
      X.restore();
    }

    // B: خصومات كبيرة
    if (kB > 0) {
      // علامة % كبيرة ورا النص
      const kp = at(t, tB + 0.1, tB + 0.8, 'expoOut');
      X.save(); X.globalAlpha = 0.5 * kp; X.translate(540, 985); X.rotate(-0.12 + 0.03 * Math.sin(t * 1.5)); X.scale(0.94 + 0.06 * kp, 0.94 + 0.06 * kp);
      X.strokeStyle = '#2E3088'; X.lineWidth = 46; X.lineCap = 'round';
      X.beginPath(); X.moveTo(250, -330); X.lineTo(-250, 330); X.stroke();
      X.beginPath(); X.arc(-215, -215, 105, 0, 6.2832); X.stroke(); X.beginPath(); X.arc(215, 215, 105, 0, 6.2832); X.stroke();
      X.restore();
      GO.say(ctx, t, 'خصومات', 540, 960, { line: 'l5', from: 3, size: 176, color: '#fff' });
      GO.say(ctx, t, 'كبيرة', 540, 1160, { line: 'l5', from: 4, size: 176, color: C.soft });
      ctx.drawPath(X, [[290, 1222], [450, 1238], [640, 1224], [790, 1234]], at(t, w(4).s + 0.1, w(4).e + 0.15, 'cubicOut'), { width: 14, color: C.violet });
      const bx = GO.say(ctx, t, 'ما تلقاها بالقطعة', 540, 1370, { line: 'l5', from: 5, size: 74, color: '#C9C6EA' });
      if (bx) { const b = bx[2]; ctx.drawPath(X, [[b.x + b.w + 10, b.cy + 2], [b.x - 10, b.cy - 4]], at(t, w(7).s + 0.18, w(7).e + 0.1, 'cubicOut'), { width: 9, color: C.violet, smooth: false }); }
    }
  },
});
