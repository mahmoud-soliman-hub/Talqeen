/* s6 — الاتفاق: «أنت جيب العملاء.. والتنفيذ علينا.» — نص الشاشة ليك ونصها لنا */
import GO from './_lib.js';

MOTION.scene({
  id: 's6',
  draw(t, lt, ctx) {
    const { X, at } = ctx, C = GO.C, w = i => ctx.wordTime('l6', i);
    GO.bg(ctx, t, C.paper, C.mist, { speed: 12 });
    // فوق: أنت جيب العملاء
    GO.say(ctx, t, 'أنت جيب العملاء', 540, 470, { line: 'l6', from: 0, size: 108, hi: { 2: C.violet } });
    const cols = [C.navy, C.violet, C.soft, C.navy, C.violet];
    for (let i = 0; i < 5; i++) {
      const s = w(1).s + i * 0.08, k = at(t, s, s + 0.4, 'expoOut'); if (k <= 0) continue;
      const x = 540 + (2 - i) * 172, y = 680, side = i % 2 ? 1 : -1;
      X.save(); X.globalAlpha = Math.min(1, k * 2); X.translate(x + side * (1 - k) * 320, y + 6 * Math.sin(t * 2.4 + i)); X.scale(1.25, 1.25);
      X.fillStyle = '#fff'; X.beginPath(); X.arc(0, 0, 62, 0, 6.2832); X.fill(); X.strokeStyle = C.mist; X.lineWidth = 3; X.stroke();
      X.fillStyle = cols[i]; X.beginPath(); X.arc(0, -14, 20, 0, 6.2832); X.fill(); X.beginPath(); X.arc(0, 50, 40, 3.1416, 0); X.fill();
      X.restore();
    }
    // تحت: والتنفيذ علينا — لوحة بنفسجي بتطلع
    const tB = w(3).s - 0.3, kB = at(t, tB, tB + 0.5, 'expoInOut');
    if (kB > 0) {
      const top = 1920 - kB * 1040;
      X.save(); GO.rr(X, 0, top, 1080, 1200, 70); X.clip();
      GO.bg(ctx, t, C.violet, '#8B74FA', { speed: 26, r: 3 });
      X.restore();
      X.save(); X.translate(0, top - 880);
      GO.say(ctx, t, 'والتنفيذ علينا', 540, 1180, { line: 'l6', from: 3, size: 124, color: '#fff', hi: { 1: C.night } });
      // 3 كروت تسليم وكل واحدة بتاخد صح
      for (let i = 0; i < 3; i++) {
        const s = w(3).s + 0.12 + i * 0.12, k = at(t, s, s + 0.4, 'expoOut'); if (k <= 0) continue;
        const x = 540 + (1 - i) * 250;
        X.save(); X.globalAlpha = Math.min(1, k * 2); X.translate(x, 1340 + (1 - k) * 80);
        GO.rr(X, -105, -75, 210, 150, 30); X.fillStyle = '#fff'; X.fill();
        GO.rr(X, -20, -42, 100, 16, 8); X.fillStyle = C.mist; X.fill(); GO.rr(X, 10, -12, 70, 16, 8); X.fill();
        X.fillStyle = C.violet; X.beginPath(); X.arc(-58, -26, 26, 0, 6.2832); X.fill();
        GO.check(ctx, -58, -26, 26, at(t, s + 0.3, s + 0.55, 'cubicOut'));
        GO.rr(X, -80, 26, 160, 16, 8); X.fillStyle = C.mist; X.fill();
        GO.rr(X, 80 - 160 * at(t, s + 0.15, s + 0.6, 'cubicOut'), 26, 160 * at(t, s + 0.15, s + 0.6, 'cubicOut'), 16, 8); X.fillStyle = C.navy; X.fill();
        X.restore();
      }
      X.restore();
      // وصلة النص: دايرة فيها مثلث الشعار
      X.save(); X.translate(540, top); const ks = at(t, tB + 0.2, tB + 0.6, 'expoOut'); X.scale(0.9 + 0.1 * ks, 0.9 + 0.1 * ks); X.globalAlpha = ks;
      X.fillStyle = C.night; X.beginPath(); X.arc(0, 0, 76, 0, 6.2832); X.fill();
      const pr = (t * 1.2) % 1; X.strokeStyle = C.night; X.lineWidth = 5; X.globalAlpha = ks * (1 - pr) * 0.5; X.beginPath(); X.arc(0, 0, 76 + pr * 50, 0, 6.2832); X.stroke(); X.globalAlpha = ks;
      GO.tri(X, 0, 4, 64, { color: '#fff', dir: 1, rot: 1.5708 });
      X.restore();
    }
  },
});
