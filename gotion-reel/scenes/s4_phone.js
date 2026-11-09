/* s4 — الفوائد الثلاث على جوال 3D يلفّ: يعرض أنشطتكم · يوثّق مبادراتكم · يبني ثقة داعميكم */
import { C, TAU, bgLight, card, icon, rise, rgba, rr, tri, ring } from './lib.js';
const SW = 604, SH = 1320;
const E3 = k => 1 - Math.pow(1 - Math.max(0, Math.min(1, k)), 4);
function screen(x, idx, l, bp) {
  x.clearRect(0, 0, SW, SH); x.save(); x.beginPath(); x.roundRect(0, 0, SW, SH, 64); x.clip();
  const g = x.createLinearGradient(0, 0, 0, SH); g.addColorStop(0, '#FBFAFF'); g.addColorStop(1, '#ECE8FF'); x.fillStyle = g; x.fillRect(0, 0, SW, SH);
  x.fillStyle = C.ink; x.beginPath(); x.roundRect(SW / 2 - 90, 26, 180, 44, 22); x.fill();
  const bar = (X0, y, w, h, c) => { x.fillStyle = c; x.beginPath(); x.roundRect(X0, y, w, h, h / 2); x.fill(); };
  bar(SW - 60 - 250, 130, 250, 34, C.ink); bar(SW - 60 - 160, 184, 160, 20, rgba(C.ink, 0.25));
  if (idx === 0) {                                             // شبكة أنشطة
    const ic = ['box', 'book', 'drop', 'home', 'sprout', 'users'], col = [C.acc, C.deep, '#5B8DEF', C.deep, C.acc, '#5B8DEF'];
    for (let i = 0; i < 6; i++) {
      const k = E3((l - 0.2 - i * 0.11) / 0.5); if (k <= 0) continue; const cx = SW - 60 - 115 - (i % 2) * 254, cy = 420 + Math.floor(i / 2) * 290;
      x.save(); x.translate(cx, cy + (1 - k) * 70); x.scale(0.9 + 0.1 * k, 0.9 + 0.1 * k); x.globalAlpha = k;
      x.shadowColor = rgba(C.ink, 0.14); x.shadowBlur = 30; x.shadowOffsetY = 12; x.fillStyle = '#fff'; x.beginPath(); x.roundRect(-115, -130, 230, 260, 40); x.fill(); x.shadowColor = 'transparent';
      x.fillStyle = rgba(col[i], 0.14); x.beginPath(); x.arc(0, -36, 62, 0, TAU); x.fill(); icon(x, ic[i], 0, -36, 70, col[i], { lw: 2 });
      bar(-70, 56, 140, 18, rgba(C.ink, 0.75)); bar(-45, 88, 90, 14, rgba(C.ink, 0.2)); x.restore();
    }
  } else if (idx === 1) {                                      // توثيق: عدسة تسجيل + قائمة تتأشّر
    const k = E3((l - 0.15) / 0.5); x.save(); x.globalAlpha = k;
    x.fillStyle = C.ink; x.beginPath(); x.roundRect(50, 250, SW - 100, 470, 44); x.fill();
    x.strokeStyle = '#fff'; x.lineWidth = 7; x.lineCap = 'round'; const b = 50;
    [[90, 290, 1, 1], [SW - 90, 290, -1, 1], [90, 680, 1, -1], [SW - 90, 680, -1, -1]].forEach(([px, py, sx, sy]) => { x.beginPath(); x.moveTo(px + sx * b, py); x.lineTo(px, py); x.lineTo(px, py + sy * b); x.stroke(); });
    icon(x, 'users', SW / 2, 520, 190, C.hi, { lw: 1.6 }); icon(x, 'heart', SW / 2, 395, 84 * (1 + 0.1 * bp), C.acc, { fill: C.acc });
    if (Math.floor(l * 2.2) % 2 === 0) { x.fillStyle = '#FF5C7A'; x.beginPath(); x.arc(SW - 132, 322, 13, 0, TAU); x.fill(); }
    x.fillStyle = '#fff'; x.font = '700 30px Inter'; x.textAlign = 'right'; x.fillText('REC', SW - 156, 333); x.restore();
    for (let i = 0; i < 3; i++) {
      const kr = E3((l - 0.4 - i * 0.14) / 0.45); if (kr <= 0) continue; const y = 810 + i * 140, kc = E3((l - 0.85 - i * 0.3) / 0.3);
      x.save(); x.globalAlpha = kr; x.translate((1 - kr) * 80, 0); x.fillStyle = '#fff'; x.shadowColor = rgba(C.ink, 0.1); x.shadowBlur = 24; x.shadowOffsetY = 10; x.beginPath(); x.roundRect(50, y, SW - 100, 112, 34); x.fill(); x.shadowColor = 'transparent';
      x.fillStyle = kc > 0 ? C.acc : rgba(C.ink, 0.1); x.beginPath(); x.arc(SW - 108, y + 56, 30 * (kc > 0 ? 0.85 + 0.15 * kc : 1), 0, TAU); x.fill(); if (kc > 0) icon(x, 'check', SW - 108, y + 56, 40, '#fff', { lw: 3, k: kc });
      bar(SW - 160 - 220, y + 34, 220, 18, rgba(C.ink, 0.75)); bar(SW - 160 - 140 - i * 30, y + 66, 140 + i * 30, 14, rgba(C.ink, 0.2)); x.restore();
    }
  } else {                                                     // ثقة: قلب يمتلي + أعمدة تطلع + داعمين ينضمّون
    const k = E3((l - 0.15) / 0.5), f = E3((l - 0.3) / 1.4);
    x.save(); x.globalAlpha = k; x.fillStyle = '#fff'; x.shadowColor = rgba(C.ink, 0.12); x.shadowBlur = 30; x.shadowOffsetY = 12; x.beginPath(); x.roundRect(50, 250, SW - 100, 440, 44); x.fill(); x.shadowColor = 'transparent';
    const hs = 250 * (1 + 0.05 * bp); icon(x, 'heart', SW / 2, 470, hs, rgba(C.acc, 0.25), { fill: rgba(C.acc, 0.1), lw: 1.2 });
    x.save(); x.beginPath(); x.rect(0, 470 + hs / 2 - hs * f, SW, hs); x.clip(); icon(x, 'heart', SW / 2, 470, hs, C.acc, { fill: C.acc, lw: 1.2 }); x.restore(); x.restore();
    for (let i = 0; i < 5; i++) { const kb = E3((l - 0.45 - i * 0.1) / 0.6), h = (70 + i * 42) * kb, bx = 84 + i * 92; x.fillStyle = i === 4 ? C.acc : rgba(C.acc, 0.25 + i * 0.1); x.beginPath(); x.roundRect(bx, 1010 - h, 62, h, 20); x.fill(); }
    bar(60, 1022, SW - 120, 6, rgba(C.ink, 0.12));
    for (let i = 0; i < 5; i++) { const ka = E3((l - 0.7 - i * 0.13) / 0.4); if (ka <= 0) continue; const ax = SW - 110 - i * 78; x.save(); x.globalAlpha = ka; x.translate(ax, 1140); x.scale(0.8 + 0.2 * ka, 0.8 + 0.2 * ka); x.fillStyle = i === 4 ? C.acc : ['#C9BEFF', '#9BB8FF', '#4B3BC4', '#16154E'][i]; x.beginPath(); x.arc(0, 0, 50, 0, TAU); x.fill(); x.lineWidth = 7; x.strokeStyle = '#F3F0FF'; x.stroke();
      if (i === 4) { x.strokeStyle = '#fff'; x.lineWidth = 8; x.lineCap = 'round'; x.beginPath(); x.moveTo(-18, 0); x.lineTo(18, 0); x.moveTo(0, -18); x.lineTo(0, 18); x.stroke(); } else icon(x, 'users', 0, 2, 46, '#fff', { lw: 2.2 }); x.restore(); }
  }
  x.restore();
}
MOTION.scene({
  id: 's4', start: 15, end: 20,
  setup(ctx) {
    const { THREE } = ctx;
    this.st = ctx.stage3D({ fov: 24, camera: [0, 0, 35], lookAt: [0, 0, 0], env: 'room', tone: 'neutral', exposure: 1.0 });
    this.cv = document.createElement('canvas'); this.cv.width = SW; this.cv.height = SH; this.cx2 = this.cv.getContext('2d');
    this.tex = new THREE.CanvasTexture(this.cv); this.tex.colorSpace = THREE.SRGBColorSpace; this.tex.anisotropy = 8;
    this.phone = new THREE.Group();
    this.phone.add(new THREE.Mesh(new ctx.RoundedBoxGeometry(3.34, 7.0, 0.36, 8, 0.46), new THREE.MeshPhysicalMaterial({ color: '#16154E', roughness: 0.3, metalness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.2, envMapIntensity: 0.9 })));
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(3.04, 6.64), new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, toneMapped: false })); scr.position.z = 0.185; this.phone.add(scr);
    const dl = new THREE.DirectionalLight('#ffffff', 2.2); dl.position.set(-5, 6, 9); this.st.add(dl);
    this.st.add(this.phone);
  },
  draw(t, lt, ctx) {
    const { X, at } = ctx, S = ctx.scene.start, w = i => ctx.wordTime('l4', i);
    bgLight(ctx, t);
    const T = [S, w(2).s - 0.2, w(4).s - 0.2], idx = t < T[1] ? 0 : t < T[2] ? 1 : 2, bp = ctx.beatPulse(t, 7);
    const spin = at(t, T[1] - 0.38, T[1] + 0.38, 'cubicInOut') + at(t, T[2] - 0.38, T[2] + 0.38, 'cubicInOut');
    const inK = at(lt, -0.1, 0.8, 'expoOut');
    // مؤشّر الخطوات
    for (let i = 0; i < 3; i++) { const a = i === idx ? at(t, T[i] - 0.05, T[i] + 0.35, 'expoOut') : 0, wd = 34 + 74 * a, x = 540 + 96 - i * 96; rr(X, x - wd / 2, 226, wd, 18, 9); X.fillStyle = a > 0 ? C.acc : rgba(C.ink, 0.16); X.globalAlpha = inK; X.fill(); X.globalAlpha = 1; }
    // حلقات وزخارف حول الجوال
    const cy = 1050; ring(X, 540, cy, 420 + 10 * bp, 3, rgba(C.acc, 0.22), inK); ring(X, 540, cy, 520, 2, rgba(C.acc, 0.12), inK);
    const chips = [['heart', 165, 800], ['eye', 915, 900], ['video', 150, 1290], ['check', 900, 1330]];
    chips.forEach(([ic, x, y], i) => { const k = at(lt, 0.35 + i * 0.1, 0.9 + i * 0.1, 'expoOut'); if (k <= 0) return; const yy = y + Math.sin(t * 1.2 + i * 1.7) * 14 + (1 - k) * 60; X.save(); X.globalAlpha = k; card(X, x - 62, yy - 62, 124, 124, 62, '#fff', 0.14); icon(X, ic, x, yy, 62, i % 2 ? C.deep : C.acc, ic === 'heart' ? { fill: C.acc } : { lw: 2 }); X.restore(); });
    // ظل + الجوال
    X.save(); X.translate(540, 1525); X.scale(1, 0.16); const g = X.createRadialGradient(0, 0, 0, 0, 0, 330); g.addColorStop(0, rgba(C.ink, 0.3 * inK)); g.addColorStop(1, rgba(C.ink, 0)); X.fillStyle = g; X.fillRect(-330, -330, 660, 660); X.restore();
    screen(this.cx2, idx, t - T[idx] + (idx === 0 ? 0 : -0.1), bp); this.tex.needsUpdate = true;
    this.phone.position.set(0, -0.72 - (1 - inK) * 9, 0);
    this.phone.rotation.set(-0.06 + 0.05 * Math.sin(lt * 0.9), -0.3 + 0.22 * Math.sin(lt * 0.8 + 0.5) + TAU * spin, 0.02 * Math.sin(lt * 0.6));
    this.phone.scale.setScalar(1 + 0.012 * bp);
    this.st.draw(X);
    // العناوين
    const titles = [['يعرض أنشطتكم', 0], ['يوثّق مبادراتكم', 2], ['يبني ثقة داعميكم', 4]];
    titles.forEach(([s, wi], i) => rise(ctx, t, s, 540, 420, { size: 112, colors: i < 2 ? { 1: C.acc } : { 1: C.acc, 2: C.acc }, dur: 0.5 }, j => w(wi + Math.min(j, 1)).s - 0.08 + (j > 1 ? 0.3 : 0), i < 2 ? T[i + 1] - 0.3 : undefined));
  },
});
