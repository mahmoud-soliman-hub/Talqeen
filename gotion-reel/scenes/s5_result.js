import './kit.js';
/* seen · understood · sold — three stretched words climbing with a line */
MOTION.scene({ id: 's5', start: 16.5, end: 20.75,
  draw(t, lt, ctx) {
    const { X, P, at } = ctx, GK = window.GK;
    GK.bg(ctx, t, 'navy');
    const W = [['l5b', 'تنشاف', 650], ['l5c', 'تنفهم', 940], ['l5d', 'وتنباع', 1230]];
    const s = W.map(w => ctx.lineSpan(w[0]));
    const pk = ctx.kf(t, [[s[0].s - .1, 0], [s[0].e, .34, 'cubicOut'], [s[1].s, .36], [s[1].e, .66, 'cubicOut'], [s[2].s, .68], [s[2].e + .25, 1, 'expoOut']]);
    const pts = [[120, 1420], [300, 1360], [420, 1170], [560, 1210], [690, 900], [820, 950], [960, 520]];
    X.save(); X.globalAlpha = .34; const tip = ctx.drawPath(X, pts, pk, { width: 12, color: P.hi }); X.restore();
    if (tip) { X.fillStyle = P.acc; X.beginPath(); X.arc(tip[0], tip[1], 22, 0, 6.2832); X.fill(); X.fillStyle = '#FFFFFF'; X.beginPath(); X.arc(tip[0], tip[1], 9, 0, 6.2832); X.fill(); }
    GK.line(ctx, t, 'l5a', 540, 320, { size: 70, color: P.hi });
    W.forEach((w, i) => {
      const sp = s[i], k = at(t, sp.s - .1, sp.s + .32, 'expoOut'); if (k <= 0) return;
      const y = w[2], st = at(t, sp.s, sp.s + .65, 'expoInOut');
      if (i === 2) { const pw = 820 * at(t, sp.s - .12, sp.s + .4, 'expoOut'); X.fillStyle = P.acc; GK.rr(X, 950 - pw, y - 182, pw, 250, 62); X.fill(); }
      X.save(); X.beginPath(); X.rect(0, y - 215, 1080, 290); X.clip(); X.translate(0, (1 - k) * 260);
      ctx.text.drawKashida(X, w[1], 540, y, 760, { family: 'display', weight: 700, size: 190, color: '#FFFFFF' }, st); X.restore();
    });
  } });
