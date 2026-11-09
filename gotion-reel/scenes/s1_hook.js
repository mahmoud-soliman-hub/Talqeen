/* s1 — الهوك: «عميلك يبي التصميم اليوم.. وفريقك ما يلحّق؟»
   رسايل العميل بتنزل ورا بعض، «اليوم» بتتمد بالكشيدة، وشريط التنفيذ واقف مكانه */
import GO from './_lib.js';

MOTION.scene({
  id: 's1',
  setup(ctx) {
    this.msgs = [
      { txt: 'وين التصميم؟', side: 1, y: 300, s: 0.06 },
      { txt: 'نبيه اليوم!', side: -1, y: 422, s: 0.42 },
      { txt: 'العميل ينتظر', side: 1, y: 544, s: 0.86 },
    ];
  },
  bubble(ctx, m, t) {
    const { X, at } = ctx, C = GO.C, k = at(t, m.s, m.s + 0.3, 'expoOut'); if (k <= 0) return;
    X.save(); X.font = ctx.font('display', 500, 46); const tw = X.measureText(m.txt).width, w = tw + 84, h = 96;
    const x = m.side > 0 ? 1080 - 96 - w : 96;
    X.globalAlpha = Math.min(1, k * 1.6); X.translate(x + w / 2 + m.side * (1 - k) * 90, m.y + h / 2 + (1 - k) * 26); X.scale(0.94 + 0.06 * k, 0.94 + 0.06 * k);
    GO.rr(X, -w / 2, -h / 2, w, h, 44); X.fillStyle = m.side > 0 ? C.violet : '#272A72'; X.fill();
    X.beginPath(); const tx = m.side * (w / 2 - 30); X.moveTo(tx, h / 2 - 8); X.lineTo(tx + m.side * 26, h / 2 + 20); X.lineTo(tx - m.side * 26, h / 2 - 4); X.closePath(); X.fill();
    ctx.text(X, m.txt, 0, 16, { family: 'display', weight: 500, size: 46, color: '#fff' });
    X.restore();
  },
  draw(t, lt, ctx) {
    const { X, at, E } = ctx, C = GO.C;
    GO.bg(ctx, t, C.night, '#23246A', { speed: 18 });
    const wToday = ctx.wordTime('l1', 3), wTeam = ctx.wordTime('l1', 4), wLate = ctx.wordTime('l1', 6);

    // رسايل العميل
    const push = at(t, wTeam.s - 0.15, wTeam.s + 0.35, 'expoOut');
    X.save(); X.translate(0, -push * 40);
    for (const m of this.msgs) this.bubble(ctx, m, t);
    // نقط «يكتب…» بعد آخر رسالة
    const ty = at(t, 1.25, 1.5, 'expoOut');
    if (ty > 0) { X.save(); X.globalAlpha = ty; GO.rr(X, 96, 668, 150, 76, 38); X.fillStyle = '#272A72'; X.fill(); for (let i = 0; i < 3; i++) { const b = 0.5 + 0.5 * Math.sin(t * 9 - i * 0.9); X.fillStyle = C.soft; X.globalAlpha = ty * (0.35 + 0.65 * b); X.beginPath(); X.arc(140 + i * 31, 706 - b * 7, 8.5, 0, 6.2832); X.fill(); } X.restore(); }
    X.restore();

    // الجملة
    GO.say(ctx, t, 'عميلك يبي التصميم', 540, 870, { line: 'l1', from: 0, size: 98, color: '#fff' });
    const kT = at(t, wToday.s - 0.1, wToday.s + 0.22, 'expoOut');
    if (kT > 0) {
      const stretch = at(t, wToday.s, wToday.e + 0.3, 'expoInOut');
      X.save(); X.globalAlpha = Math.min(1, kT * 2); X.translate(0, (1 - kT) * 70);
      ctx.text.drawKashida(X, 'اليوم', 540, 1100, 800, { family: 'display', weight: 700, size: 236, color: C.soft }, stretch);
      X.restore();
      // خط تحت الكلمة بيترسم
      ctx.drawPath(X, [[170, 1168], [420, 1180], [700, 1170], [900, 1176]], at(t, wToday.s + 0.2, wToday.e + 0.35, 'cubicOut'), { width: 12, color: C.violet });
    }
    GO.say(ctx, t, 'وفريقك ما يلحّق؟', 540, 1318, { line: 'l1', from: 4, size: 92, color: '#fff' });

    // شريط التنفيذ الواقف
    const kb = at(t, wTeam.s + 0.1, wTeam.s + 0.5, 'expoOut');
    if (kb > 0) {
      const sh = ctx.MK ? ctx.MK.shake(t, wLate.s + 0.05, 9) : [0, 0];
      X.save(); X.globalAlpha = kb; X.translate(sh[0], (1 - kb) * 40);
      GO.rr(X, 170, 1392, 740, 30, 15); X.fillStyle = '#272A72'; X.fill();
      const fill = 0.08 + 0.26 * at(t, wTeam.s + 0.2, wLate.s, 'cubicOut') + 0.012 * Math.sin(t * 20);
      GO.rr(X, 170 + 740 * (1 - fill), 1392, 740 * fill, 30, 15); X.fillStyle = C.violet; X.fill();
      // دايرة الانتظار
      X.translate(540, 1468); X.strokeStyle = C.soft; X.lineWidth = 7; X.lineCap = 'round';
      X.beginPath(); X.arc(0, 0, 24, t * 7, t * 7 + 4.2); X.stroke();
      X.restore();
    }
  },
});
