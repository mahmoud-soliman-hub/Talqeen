import './kit.js';
/* nobody reads (a page) → everybody watches (the page becomes a video, with an eye) */
MOTION.scene({ id: 's2', start: 4.75, end: 8.25,
  setup(ctx) { const r = ctx.rng(4); this.bars = Array.from({ length: 8 }, (_, i) => i % 4 === 3 ? .45 : r.range(.72, 1)); },
  draw(t, lt, ctx) {
    const { X, P, at, lerp, clamp, E } = ctx, GK = window.GK;
    const a = ctx.lineSpan('l2a'), b = ctx.lineSpan('l2b'), no = ctx.wordTime('l2a', 2);
    GK.bg(ctx, t, 'light');
    const m = at(t, b.s - .22, b.s + .3, 'expoInOut');                       // page → video
    const x = lerp(170, 250, m), y = lerp(240, 215, m), w = lerp(740, 580, m), h = lerp(600, 690, m), cx = x + w / 2, cy = y + h / 2;
    const inK = at(lt, -.1, .5, 'expoOut');
    X.save(); X.translate(0, (1 - inK) * 60); X.translate(cx, cy); X.rotate((-.035 * (1 - m)) + .012 * Math.sin(t * 1.3)); X.translate(-cx, -cy);
    X.save(); X.shadowColor = 'rgba(15,14,60,.18)'; X.shadowBlur = 60; X.shadowOffsetY = 26; X.fillStyle = '#FFFFFF'; GK.rr(X, x, y, w, h, 46); X.fill(); X.restore();
    if (m > 0) { X.globalAlpha = m; X.fillStyle = P.deep; GK.rr(X, x, y, w, h, 46); X.fill(); X.globalAlpha = 1; }
    // the page: grey lines nobody reads
    const dim = 1 - .62 * at(t, no.s - .05, no.s + .3, 'cubicOut');
    if (m < 1) {
      X.save(); X.globalAlpha = (1 - m) * dim;
      X.fillStyle = P.hi; X.beginPath(); X.arc(x + w - 86, y + 92, 38, 0, 6.2832); X.fill();
      X.fillStyle = '#D9D6EC'; GK.rr(X, x + w - 150 - 240, y + 66, 240, 22, 11); X.fill(); GK.rr(X, x + w - 150 - 150, y + 104, 150, 16, 8); X.fill();
      this.bars.forEach((f, i) => { const k = at(lt, .08 + i * .05, .4 + i * .05, 'expoOut'), bw = (w - 96) * f * k; X.fillStyle = i === 0 ? '#B9B5D6' : '#DDDAEE'; GK.rr(X, x + w - 48 - bw, y + 186 + i * 50, bw, i === 0 ? 26 : 20, 12); X.fill(); });
      X.restore();
      const sk = at(t, no.s, no.s + .38, 'expoOut');                          // the strike
      if (sk > 0) { X.save(); X.globalAlpha = 1 - m; ctx.drawPath(X, [[x + w - 60, y + 150], [x + w * .6, y + h * .5], [x + w * .42, y + h * .52], [x + 60, y + h - 70]], sk, { width: 18, color: P.acc }); X.restore(); }
    }
    // the video: an eye whose pupil is the play button
    if (m > 0) {
      const ek = at(t, b.s + .02, b.s + .6, 'expoOut'), bl = 1 - .9 * Math.sin(Math.PI * clamp((t - b.s - .95) / .16));
      X.save(); X.translate(cx, cy - 20); X.globalAlpha = m;
      X.save(); X.scale(1, bl);
      ctx.drawPath(X, 'M -210 0 Q 0 -190 210 0', ek, { width: 13, color: P.hi }); ctx.drawPath(X, 'M 210 0 Q 0 190 -210 0', ek, { width: 13, color: P.hi });
      X.restore();
      const s = .9 + .1 * at(t, b.s - .1, b.s + .4, 'expoOut'); X.scale(s, s * Math.max(.2, bl));
      X.fillStyle = P.acc; X.beginPath(); X.arc(0, 0, 92, 0, 6.2832); X.fill(); GK.tri(X, 6, 0, 66, '#FFFFFF');
      X.restore();
      const pk = clamp((t - b.s) / (ctx.scene.end - b.s + .3)), tw = w - 96;   // progress, right → left
      X.globalAlpha = m; X.fillStyle = 'rgba(255,255,255,.2)'; GK.rr(X, x + 48, y + h - 78, tw, 12, 6); X.fill();
      X.fillStyle = '#FFFFFF'; GK.rr(X, x + 48 + tw * (1 - pk), y + h - 78, tw * pk, 12, 6); X.fill(); X.beginPath(); X.arc(x + 48 + tw * (1 - pk), y + h - 72, 15, 0, 6.2832); X.fill(); X.globalAlpha = 1;
    }
    X.restore();
    GK.line(ctx, t, 'l2a', 540, 1080, { size: 84, color: P.bg, hi: { 2: P.mut, 3: P.mut }, alpha: 1 - .5 * at(t, b.s - .1, b.s + .2) });
    // «الناس تشوف» — rises, then stretches on «تشوف»
    const w1 = ctx.wordTime('l2b', 1), rk = at(t, b.s - .1, b.s + .32, 'expoOut');
    if (rk > 0) { X.save(); X.beginPath(); X.rect(0, 1130, 1080, 260); X.clip(); X.translate(0, (1 - rk) * 240);
      ctx.text.drawKashida(X, 'الناس تشوف', 540, 1320, 800, { family: 'display', weight: 700, size: 156, color: P.acc }, at(t, w1.s - .05, w1.s + .6, 'expoInOut')); X.restore(); }
  } });
