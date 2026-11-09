import './kit.js';
/* HOOK — a real 3-second stopwatch: 3 → 2 → 1 → swipe */
MOTION.scene({ id: 's1', start: 0, end: 4.75,
  draw(t, lt, ctx) {
    const { X, P, at, E, clamp } = ctx, GK = window.GK;
    const T0 = ctx.wordTime('l1a', 1).s, c = ctx.lineSpan('l1c'), p = clamp((t - T0) / (c.s - T0)), sec = p * 3;
    GK.bg(ctx, t, 'navy');
    const cx = 540, cy = 610, R = 290, inK = at(lt, 0, .6, 'expoOut');
    const tick = t > T0 && p < 1 ? Math.exp(-9 * (sec % 1)) : 0, done = at(t, c.s, c.s + .25, 'expoOut');
    X.save(); X.translate(cx, cy); const sc = (.95 + .05 * inK) * (1 + .03 * tick) * (1 - .05 * done); X.scale(sc, sc);
    // stopwatch ticks
    for (let i = 0; i < 60; i++) {
      const a = -Math.PI / 2 + i / 60 * 6.2832, spent = (i + .5) / 60 < p, big = i % 5 === 0, r0 = R + 44, r1 = r0 + (big ? 40 : 22);
      const kin = clamp(.45 + inK * 1.6 - i / 60 * .6);
      X.strokeStyle = spent ? 'rgba(255,255,255,.14)' : (big ? '#FFFFFF' : P.hi); X.globalAlpha = kin; X.lineWidth = big ? 7 : 4; X.lineCap = 'round';
      X.beginPath(); X.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); X.lineTo(Math.cos(a) * r1, Math.sin(a) * r1); X.stroke();
    }
    X.globalAlpha = 1;
    X.lineWidth = 26; X.strokeStyle = 'rgba(255,255,255,.09)'; X.beginPath(); X.arc(0, 0, R, 0, 6.2832); X.stroke();
    if (p < 1) { const a0 = -Math.PI / 2 + p * 6.2832; X.strokeStyle = P.acc; X.lineCap = 'round'; X.beginPath(); X.arc(0, 0, R, a0, -Math.PI / 2 + 6.2832); X.stroke();
      X.fillStyle = '#FFFFFF'; X.beginPath(); X.arc(Math.cos(a0) * R, Math.sin(a0) * R, 19, 0, 6.2832); X.fill(); }
    // numeral 3 → 2 → 1 → 0 (rolls like an odometer)
    X.save(); X.beginPath(); X.arc(0, 0, R - 34, 0, 6.2832); X.clip();
    const n = p >= 1 ? 0 : 3 - Math.floor(sec), f = p >= 1 ? clamp((t - c.s) / .22) : (t > T0 ? clamp((sec % 1) / .2) : 1), e = E.expoOut(f);
    const num = (v, dy, al, col) => ctx.text(X, String(v), 0, 122 + dy, { family: 'num', weight: 900, size: 350, color: col, alpha: al, dir: 'ltr' });
    if (n < 3 && f < 1) num(n + 1, -e * 330, 1 - e, '#FFFFFF');
    num(n, n < 3 ? (1 - e) * 330 : 0, 1, n === 0 ? P.hi : '#FFFFFF');
    X.restore(); X.restore();
    // words, exactly when spoken
    GK.line(ctx, t, 'l1a', 540, 1140, { size: 84, hi: { 1: P.hi, 2: P.hi } });
    GK.line(ctx, t, 'l1b', 540, 1272, { size: 84, under: b => { const w = ctx.wordTime('l1b', 1), k = at(t, w.s - .06, w.s + .32, 'expoOut'), bx = b[1]; if (k > 0) { const W = bx.w + 52; X.fillStyle = P.acc; GK.rr(X, bx.x - 26 + W * (1 - k), bx.base - 86, W * k, 118, 28); X.fill(); } } });
    GK.line(ctx, t, 'l1c', 540, 1404, { size: 84, color: 'rgba(255,255,255,.55)' });
    // the thumb that swipes you away
    const s0 = ctx.scene.end - .42, k = clamp((t - s0) / .55);
    if (k > 0 && k < 1) { const y = 1380 - E.expoInOut(k) * 760, al = Math.sin(Math.PI * k);
      X.fillStyle = `rgba(255,255,255,${.22 * al})`; X.strokeStyle = `rgba(255,255,255,${.75 * al})`; X.lineWidth = 5;
      X.beginPath(); X.ellipse(540, y, 58, 58 + 46 * Math.sin(Math.PI * k), 0, 0, 6.2832); X.fill(); X.stroke(); }
  } });
