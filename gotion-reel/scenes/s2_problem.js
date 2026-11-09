/* s2 — المشكلة: «كل شهر نفس القصة: مستقلّين يتأخرون، وجودة تطلع وتنزل.» */
import GO from './_lib.js';

MOTION.scene({
  id: 's2',
  draw(t, lt, ctx) {
    const { X, at } = ctx, C = GO.C;
    GO.bg(ctx, t, C.paper, C.mist, { speed: -12 });
    const w = i => ctx.wordTime('l2', i);

    // العنوان + صف تقويم بيتقلب كل شهر
    GO.say(ctx, t, 'كل شهر نفس القصة', 540, 330, { line: 'l2', from: 0, size: 104, hi: { 2: C.violet, 3: C.violet } });
    for (let i = 0; i < 6; i++) {
      const s = w(0).s + 0.1 + i * 0.13, k = at(t, s, s + 0.3, 'expoOut'); if (k <= 0) continue;
      const x = 1080 - 150 - i * 132 - 54, y = 420;
      X.save(); X.globalAlpha = Math.min(1, k * 2); X.translate(x + 54, y + 60 + (1 - k) * 30);
      GO.rr(X, -54, -52, 108, 112, 20); X.fillStyle = '#fff'; X.fill(); X.strokeStyle = C.mist; X.lineWidth = 3; X.stroke();
      GO.rr(X, -54, -52, 108, 34, 20); X.fillStyle = i === 5 ? C.violet : C.navy; X.fill(); X.fillRect(-54, -34, 108, 16);
      // علامة «نفس القصة» على كل شهر
      const kx = at(t, w(2).s + i * 0.07, w(2).s + 0.22 + i * 0.07, 'cubicOut');
      ctx.drawPath(X, [[-20, 2], [20, 42]], kx, { width: 9, color: C.violet, smooth: false });
      ctx.drawPath(X, [[20, 2], [-20, 42]], at(t, w(2).s + 0.1 + i * 0.07, w(2).s + 0.32 + i * 0.07, 'cubicOut'), { width: 9, color: C.violet, smooth: false });
      X.restore();
    }

    // مستقلّين يتأخرون: صفوف مهام وكل واحدة بتاخد ختم «متأخر»
    GO.say(ctx, t, 'مستقلّين يتأخرون', 984, 720, { line: 'l2', from: 4, size: 76, align: 'right' });
    for (let i = 0; i < 3; i++) {
      const s = w(4).s + 0.05 + i * 0.12, k = at(t, s, s + 0.36, 'expoOut'); if (k <= 0) continue;
      const y = 770 + i * 108;
      X.save(); X.globalAlpha = Math.min(1, k * 2); X.translate((1 - k) * 160, 0);
      GO.rr(X, 96, y, 888, 88, 26); X.fillStyle = '#fff'; X.fill(); X.strokeStyle = C.mist; X.lineWidth = 3; X.stroke();
      X.fillStyle = [C.soft, C.violet, C.navy][i]; X.beginPath(); X.arc(940, y + 44, 24, 0, 6.2832); X.fill();
      GO.rr(X, 640 - i * 40, y + 26, 250 + i * 40, 14, 7); X.fillStyle = C.mist; X.fill();
      GO.rr(X, 740, y + 52, 150, 12, 6); X.fill();
      // شريط تقدم واقف
      GO.rr(X, 330, y + 37, 240, 14, 7); X.fill();
      GO.rr(X, 330 + 240 * (1 - [0.3, 0.55, 0.18][i]), y + 37, 240 * [0.3, 0.55, 0.18][i], 14, 7); X.fillStyle = C.soft; X.fill();
      // ختم متأخر
      const ks = at(t, w(5).s + i * 0.11, w(5).s + 0.2 + i * 0.11, 'expoOut');
      if (ks > 0) { X.save(); X.globalAlpha *= ks; X.translate(210, y + 44); X.rotate(-0.07); X.scale(1.25 - 0.25 * ks, 1.25 - 0.25 * ks); GO.rr(X, -88, -30, 176, 60, 30); X.fillStyle = C.navy; X.fill(); ctx.text(X, 'متأخر', 0, 13, { family: 'display', weight: 600, size: 36, color: '#fff' }); X.restore(); }
      X.restore();
    }

    // جودة تطلع وتنزل: خط بياني بيترسم
    GO.say(ctx, t, 'وجودة تطلع وتنزل', 930, 1200, { line: 'l2', from: 6, size: 76, align: 'right', hi: { 1: C.violet, 2: C.violet } });
    const kc = at(t, w(6).s, w(8).e + 0.25, 'linear');
    if (kc > 0) {
      X.save(); X.strokeStyle = C.mist; X.lineWidth = 3;
      for (let i = 0; i < 4; i++) { X.beginPath(); X.moveTo(96, 1260 + i * 62); X.lineTo(930, 1260 + i * 62); X.stroke(); }
      X.restore();
      const pts = [[925, 1400], [830, 1290], [730, 1420], [620, 1275], [520, 1430], [410, 1300], [310, 1440], [200, 1330], [110, 1446]];
      const tip = ctx.drawPath(X, pts, ctx.E.cubicInOut(kc), { width: 13, color: C.violet });
      if (tip) { X.fillStyle = C.navy; X.beginPath(); X.arc(tip[0], tip[1], 17, 0, 6.2832); X.fill(); X.fillStyle = '#fff'; X.beginPath(); X.arc(tip[0], tip[1], 7, 0, 6.2832); X.fill(); }
    }
  },
});
