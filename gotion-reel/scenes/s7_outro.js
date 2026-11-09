import './kit.js';
/* OUTRO — the logo assembles, the idea moves, call to action */
MOTION.scene({ id: 's7', start: 26, end: 30,
  draw(t, lt, ctx) {
    const { X, P, at, lerp } = ctx, GK = window.GK, a = ctx.lineSpan('l7a'), b = ctx.lineSpan('l7b');
    GK.bg(ctx, t, 'navy');
    const lw = 800, lh = lw * GK.LOGO_AR, lx = 140, ly = 430, tcx = lx + 210.5 / 1494 * lw, tcy = ly + 193.5 / 536 * lh;
    ctx.drawPath(X, 'M 540 140 A 440 440 0 1 1 539 140', at(lt, 0, 1.4, 'expoOut'), { width: 3, color: 'rgba(201,192,255,.22)' });
    // the play triangle arrives first and lands in its place
    const tk = at(lt, -.1, .65, 'expoOut'), s = lerp(3.4, 1, tk), press = 1 - .12 * Math.sin(Math.PI * ctx.clamp((lt - .75) / .25));
    X.save(); X.translate(lerp(540, tcx, tk), lerp(590, tcy, tk)); X.rotate((1 - tk) * -2.1); X.scale(s * press, s * press); X.translate(-tcx, -tcy); X.drawImage(ctx.img('tri'), lx, ly, lw, lh); X.restore();
    const wk = at(lt, .42, 1.15, 'expoOut');
    if (wk > 0) { X.save(); X.beginPath(); X.rect(lx, ly - 10, lw * wk + 4, lh * .74); X.clip(); X.drawImage(ctx.img('word'), lx, ly, lw, lh); X.restore(); }
    const gk = at(lt, .85, 1.35, 'expoOut');
    if (gk > 0) { X.save(); X.globalAlpha = gk; X.beginPath(); X.rect(lx, ly + lh * .74, lw, lh * .3); X.clip(); X.drawImage(ctx.img('tag'), lx, ly + (1 - gk) * 40, lw, lh); X.restore(); }
    // «فكرتك تتحرّك»
    const w1 = ctx.wordTime('l7a', 1), w2 = ctx.wordTime('l7a', 2), rk = at(t, w1.s - .1, w1.s + .32, 'expoOut');
    if (rk > 0) { X.save(); X.beginPath(); X.rect(0, 860, 1080, 230); X.clip(); X.translate(0, (1 - rk) * 220);
      ctx.text.drawKashida(X, 'فكرتك تتحرّك', 540, 1030, 860, { family: 'display', weight: 700, size: 132, color: '#FFFFFF' }, at(t, w2.s - .05, w2.s + .7, 'expoInOut')); X.restore(); }
    // CTA
    const ck = at(t, b.s - .2, b.s + .3, 'expoOut');
    if (ck > 0) { const pw = 640 * ck; X.fillStyle = P.acc; GK.rr(X, 540 - pw / 2, 1150, pw, 128, 64); X.fill();
      GK.line(ctx, t, 'l7b', 540, 1236, { size: 60, color: '#FFFFFF' }); }
    const k1 = at(t, b.s + .35, b.s + .75, 'expoOut'), k2 = at(t, b.s + .47, b.s + .87, 'expoOut');
    if (k1 > 0) ctx.text(X, 'gotionmedia.com', 540, 1370 + (1 - k1) * 30, { family: 'num', weight: 600, size: 50, color: P.hi, alpha: k1, dir: 'ltr' });
    if (k2 > 0) ctx.text(X, '@gotionmedia   ·   +966 54 466 6388', 540, 1452 + (1 - k2) * 30, { family: 'num', weight: 500, size: 38, color: '#FFFFFF', alpha: .85 * k2, dir: 'ltr' });
  } });
