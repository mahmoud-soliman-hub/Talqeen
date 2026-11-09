import './kit.js';
/* company? shop? or just an idea? — three cards, icons drawn as lines */
const ICONS = [
  ['M40 180 V40 H130 V180', 'M130 90 H170 V180', 'M20 180 H185', 'M65 72 H82 M98 72 H110', 'M65 108 H82 M98 108 H110', 'M65 144 H82 M98 144 H110'],
  ['M30 85 L45 35 H155 L170 85', 'M30 85 Q47 112 65 85 Q82 112 100 85 Q117 112 135 85 Q152 112 170 85', 'M42 108 V178 H158 V108', 'M86 178 V132 H116 V178'],
  ['M76 136 C40 110 44 40 100 40 C156 40 160 110 124 136 V156 H76 V136', 'M84 176 H116', 'M100 16 V4', 'M38 44 L27 33', 'M162 44 L173 33'],
];
MOTION.scene({ id: 's4', start: 12.5, end: 16.5,
  draw(t, lt, ctx) {
    const { X, P, at } = ctx, GK = window.GK;
    GK.bg(ctx, t, 'light');
    GK.line(ctx, t, 'l4a', 540, 300, { text: 'عندك', size: 124, color: P.bg });
    const C = [{ id: 'l4a', off: 1, txt: 'شركة؟' }, { id: 'l4b', off: 0, txt: 'متجر؟' }, { id: 'l4c', off: 0, txt: 'ولا فكرة توّها براسك؟' }];
    C.forEach((c, i) => {
      const T = ctx.wordTime(c.id, c.off).s - .14, k = at(t, T, T + .5, 'expoOut'); if (k <= 0) return;
      const idea = i === 2, x = 90, y = 390 + i * 350, w = 900, h = 310, pop = idea ? 1 + .025 * at(t, T + .5, T + .9, 'cubicOut') : 1;
      X.save(); X.globalAlpha = Math.min(1, k * 1.6); X.translate((1 - k) * 300, 0); X.translate(540, y + h / 2); X.scale(pop, pop); X.translate(-540, -(y + h / 2));
      X.save(); X.shadowColor = idea ? 'rgba(116,87,254,.35)' : 'rgba(15,14,60,.12)'; X.shadowBlur = 50; X.shadowOffsetY = 22; X.fillStyle = idea ? P.acc : '#FFFFFF'; GK.rr(X, x, y, w, h, 52); X.fill(); X.restore();
      X.fillStyle = idea ? 'rgba(255,255,255,.14)' : P.light; GK.rr(X, x + w - 290, y + 30, 260, h - 60, 40); X.fill();
      X.save(); X.translate(x + w - 260, y + 55);
      const dk = at(t, T + .12, T + .95, 'linear');
      if (idea) { const on = at(t, T + .85, T + 1.15, 'cubicOut'); if (on > 0) { X.globalAlpha *= on; X.fillStyle = P.hi; X.fill(new Path2D(ICONS[2][0])); X.globalAlpha /= on; } }
      GK.strokes(ctx, ICONS[i], dk, { color: idea ? '#FFFFFF' : P.bg, width: 9 });
      X.restore();
      if (idea) GK.line(ctx, t, c.id, x + (w - 290) / 2, y + 138, { size: 68, maxWidth: 520, color: '#FFFFFF', lineHeight: 1.45 });
      else GK.line(ctx, t, c.id, x + (w - 290) / 2, y + 198, { text: c.txt, wordOffset: c.off, size: 128, color: P.bg });
      X.restore();
    });
  } });
