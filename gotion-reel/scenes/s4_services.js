/* s4 — الخدمات: «موشن جرافيك، تصاميم سوشل ميديا، وفيديوهات إعلانية.» — 3 لوحات ورا بعض */
import GO from './_lib.js';

MOTION.scene({
  id: 's4',
  // لوحة 1: موشن جرافيك — شكل بيتحول وهو ماشي على مسار + تايم لاين
  motion(ctx, t, s0) {
    const { X, at, E } = ctx, C = GO.C, lt = t - s0;
    GO.bg(ctx, t, C.night, '#23246A', { speed: 18 });
    const path = [[900, 420], [700, 300], [500, 520], [340, 700], [200, 520], [330, 360], [560, 420], [760, 640], [880, 800]];
    const kp = at(lt, 0.0, 1.5, 'cubicInOut');
    ctx.drawPath(X, path, Math.min(1, kp * 1.15), { width: 5, color: '#3A3C8C' });
    const info = ctx.pathInfo(path);
    for (let g = 5; g >= 0; g--) {
      const k = Math.max(0, kp - g * 0.035), p = info.at(info.len * k), m = 0.5 + 0.5 * Math.sin(k * 9), sz = 74 - g * 6;
      X.save(); X.translate(p[0], p[1]); X.rotate(k * 7); X.globalAlpha = g === 0 ? 1 : 0.16;
      GO.rr(X, -sz, -sz, sz * 2, sz * 2, sz * (0.18 + 0.82 * m)); X.fillStyle = g === 0 ? C.violet : C.soft; X.fill();
      if (g === 0) GO.tri(X, 0, 0, sz * 0.9, { color: '#fff', dir: 1, rot: -k * 7 });
      X.restore();
    }
    // تايم لاين
    const kt = at(lt, 0.05, 0.5, 'expoOut');
    X.save(); X.globalAlpha = kt; X.translate(0, (1 - kt) * 40);
    for (let r = 0; r < 3; r++) {
      const y = 900 + r * 46; GO.rr(X, 130, y, 820, 30, 15); X.fillStyle = '#1E2060'; X.fill();
      const a = [0.08, 0.3, 0.16][r], b = [0.62, 0.9, 0.48][r];
      GO.rr(X, 130 + 820 * a, y, 820 * (b - a), 30, 15); X.fillStyle = [C.violet, C.soft, '#4F3BD1'][r]; X.fill();
      for (const d of [a, b]) { X.save(); X.translate(130 + 820 * d, y + 15); X.rotate(0.785); X.fillStyle = '#fff'; X.fillRect(-8, -8, 16, 16); X.restore(); }
    }
    const ph = 130 + 820 * at(lt, 0.1, 1.6, 'linear'); X.fillStyle = '#fff'; X.fillRect(ph - 2.5, 880, 5, 150); X.beginPath(); X.moveTo(ph - 14, 868); X.lineTo(ph + 14, 868); X.lineTo(ph, 890); X.closePath(); X.fill();
    X.restore();
    GO.say(ctx, t, 'موشن جرافيك', 540, 1290, { line: 'l4', from: 0, size: 122, color: '#fff', hi: { 0: C.soft } });
  },
  // لوحة 2: تصاميم سوشل ميديا — بوستات بتتفرد زي الكروت
  social(ctx, t, s0) {
    const { X, at } = ctx, C = GO.C, lt = t - s0;
    GO.bg(ctx, t, C.paper, C.mist, { speed: -14 });
    const cards = [{ c: C.navy, a: C.soft }, { c: C.violet, a: '#fff' }, { c: '#fff', a: C.violet }];
    cards.forEach((cd, i) => {
      const k = at(lt, 0.02 + i * 0.09, 0.55 + i * 0.09, 'expoOut'), off = (i - 1);
      X.save(); X.translate(540 + off * 250 * k, 640 + Math.abs(off) * 50 * k + (1 - k) * 220); X.rotate(off * 0.13 * k + 0.02 * Math.sin(t * 1.6 + i)); X.globalAlpha = Math.min(1, k * 2);
      X.shadowColor = 'rgba(27,28,84,.18)'; X.shadowBlur = 40; X.shadowOffsetY = 18;
      GO.rr(X, -170, -212, 340, 424, 34); X.fillStyle = cd.c; X.fill(); X.shadowColor = 'transparent';
      if (cd.c === '#fff') { X.strokeStyle = C.mist; X.lineWidth = 3; X.stroke(); }
      // محتوى البوست: دايرة بتكبر + سطور + مثلث
      const kk = at(lt, 0.3 + i * 0.09, 0.9 + i * 0.09, 'expoOut');
      X.fillStyle = cd.a; X.beginPath(); X.arc(0, -70, 86 * kk, 0, 6.2832); X.fill();
      GO.tri(X, 6, -70, 70 * kk, { color: cd.c === '#fff' ? '#fff' : cd.c, dir: 1 });
      X.globalAlpha *= 0.85; X.fillStyle = cd.a;
      GO.rr(X, 130 - 240 * kk, 70, 240 * kk, 22, 11); X.fill(); GO.rr(X, 130 - 160 * kk, 112, 160 * kk, 22, 11); X.fill();
      X.restore();
    });
    // صف تفاعل: قلب ما في — نقط مؤشر كاروسيل
    for (let i = 0; i < 4; i++) { const on = Math.floor(lt * 2.2) % 4 === i; X.fillStyle = on ? C.violet : C.mist; GO.rr(X, 540 + 54 - i * 36 - (on ? 14 : 0), 990, on ? 40 : 14, 14, 7); X.fill(); }
    GO.say(ctx, t, 'تصاميم', 540, 1210, { line: 'l4', from: 2, size: 130 });
    GO.say(ctx, t, 'سوشل ميديا', 540, 1380, { line: 'l4', from: 3, size: 130, hi: { 0: C.violet, 1: C.violet } });
  },
  // لوحة 3: فيديوهات إعلانية — شاشة ريل بزر تشغيل وموجة صوت
  video(ctx, t, s0) {
    const { X, at } = ctx, C = GO.C, lt = t - s0;
    GO.bg(ctx, t, C.violet, '#8B74FA', { speed: 24, r: 3 });
    const k = at(lt, 0.0, 0.5, 'expoOut');
    X.save(); X.translate(540, 640 + (1 - k) * 200); X.rotate(-0.05 + 0.05 * k); X.globalAlpha = Math.min(1, k * 2);
    X.shadowColor = 'rgba(19,19,65,.35)'; X.shadowBlur = 60; X.shadowOffsetY = 26;
    GO.rr(X, -205, -360, 410, 720, 54); X.fillStyle = C.night; X.fill(); X.shadowColor = 'transparent';
    GO.rr(X, -187, -342, 374, 684, 40); X.fillStyle = '#1E2060'; X.fill();
    // موجة صوت
    for (let i = 0; i < 17; i++) { const h = 18 + 70 * Math.abs(Math.sin(t * 6 + i * 0.8) * Math.cos(t * 2.3 + i * 0.37)); GO.rr(X, -150 + i * 18, 120 - h / 2, 9, h, 4.5); X.fillStyle = i / 17 < at(lt, 0.2, 1.4, 'linear') ? C.soft : '#3A3C8C'; X.fill(); }
    // زر التشغيل + حلقة نبض
    const pr = (lt * 1.4) % 1; X.strokeStyle = '#fff'; X.globalAlpha *= (1 - pr) * 0.6; X.lineWidth = 5; X.beginPath(); X.arc(0, -100, 86 + pr * 70, 0, 6.2832); X.stroke(); X.globalAlpha = Math.min(1, k * 2);
    X.fillStyle = '#fff'; X.beginPath(); X.arc(0, -100, 86, 0, 6.2832); X.fill();
    GO.tri(X, 8, -100, 78, { color: C.violet, dir: 1 });
    // شريط التقدم
    GO.rr(X, -150, 250, 300, 12, 6); X.fillStyle = '#3A3C8C'; X.fill(); const pw = 300 * at(lt, 0.2, 1.4, 'linear'); GO.rr(X, -150, 250, Math.max(12, pw), 12, 6); X.fillStyle = '#fff'; X.fill();
    X.beginPath(); X.arc(-150 + pw, 256, 13, 0, 6.2832); X.fill();
    X.restore();
    GO.say(ctx, t, 'فيديوهات', 540, 1250, { line: 'l4', from: 5, size: 130, color: '#fff', times: [ctx.wordTime('l4', 5).s] });
    GO.say(ctx, t, 'إعلانية', 540, 1410, { line: 'l4', from: 6, size: 130, color: C.night });
  },
  draw(t, lt, ctx) {
    const { X, at } = ctx, w = i => ctx.wordTime('l4', i);
    const panels = [['motion', ctx.scene.start], ['social', w(2).s - 0.28], ['video', w(5).s - 0.28]];
    // كل لوحة بتزق اللي قبلها لفوق
    panels.forEach(([fn, s0], i) => {
      const kin = i === 0 ? 1 : at(t, s0, s0 + 0.42, 'expoInOut'), nx = panels[i + 1], kout = nx ? at(t, nx[1], nx[1] + 0.42, 'expoInOut') : 0;
      if (kin <= 0 || kout >= 1) return;
      X.save(); X.translate(0, (1 - kin) * ctx.H - kout * ctx.H); X.beginPath(); X.rect(0, 0, ctx.W, ctx.H); X.clip();
      this[fn](ctx, t, s0); X.restore();
    });
    // مؤشر الخدمات (3 نقط)
    const cur = t >= panels[2][1] + 0.2 ? 2 : t >= panels[1][1] + 0.2 ? 1 : 0;
    for (let i = 0; i < 3; i++) { X.fillStyle = i === cur ? (cur === 1 ? GO.C.navy : '#fff') : (cur === 1 ? '#CFCBEA' : 'rgba(255,255,255,.35)'); GO.rr(X, 540 + 50 - i * 44 - (i === cur ? 16 : 0), 200, i === cur ? 48 : 16, 16, 8); X.fill(); }
  },
});
