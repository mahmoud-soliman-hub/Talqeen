/* s2 — «التقارير تُنسى» رزمة ورق 3D تتكدّس وتغرق · «والأرقام وحدها لا تحرّك القلوب» أرقام رمادية وخط نبض مسطّح */
import { C, TAU, bgLight, icon, rise, mix, rgba, rr } from './lib.js';
function paperTex(ctx, i) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 704; const x = c.getContext('2d'), r = ctx.seeded(40 + i);
  x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, 512, 704);
  x.fillStyle = '#C9C9D6'; x.beginPath(); x.roundRect(272, 56, 190, 30, 15); x.fill();
  x.fillStyle = '#E2E2EA'; for (let j = 0; j < 5; j++) { const wd = 240 + r() * 170; x.beginPath(); x.roundRect(462 - wd, 130 + j * 44, wd, 16, 8); x.fill(); }
  for (let j = 0; j < 6; j++) { const h = 40 + r() * 150; x.fillStyle = j % 2 ? '#D3D3DE' : '#BDBDCC'; x.beginPath(); x.roundRect(70 + j * 66, 590 - h, 42, h, 10); x.fill(); }
  x.fillStyle = '#E2E2EA'; x.fillRect(50, 600, 412, 6);
  x.strokeStyle = '#E6E6EE'; x.lineWidth = 6; x.strokeRect(3, 3, 506, 698);
  return c;
}
MOTION.scene({
  id: 's2', start: 5, end: 10,
  setup(ctx) {
    const { THREE } = ctx;
    this.st = ctx.stage3D({ fov: 26, camera: [0, 19, 23], lookAt: [0, 4.6, 0], env: 'room', tone: 'neutral', exposure: 1.05 });
    this.pile = new THREE.Group(); this.st.add(this.pile);
    const r = ctx.seeded(9); this.pages = [];
    for (let i = 0; i < 9; i++) {
      const tex = new THREE.CanvasTexture(paperTex(ctx, i)); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
      const side = new THREE.MeshStandardMaterial({ color: '#DADAE4', roughness: 0.9 });
      const top = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, envMapIntensity: 0.5 });
      const m = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.07, 4.55), [side, side, top, side, side, side]);
      m.userData = { yaw: (r() - 0.5) * 0.7, ox: (r() - 0.5) * 0.5, oz: (r() - 0.5) * 0.4, land: 0.2 + i * 0.19 };
      this.pile.add(m); this.pages.push(m);
    }
    const dl = new THREE.DirectionalLight('#ffffff', 1.6); dl.position.set(-4, 9, 5); this.st.add(dl);
    this.cells = []; const q = ctx.seeded(21);
    for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) this.cells.push({ x: 810 - i * 270, y: 800 + j * 150, digits: 2 + Math.floor(q() * 3), rate: 2.5 + q() * 4, seed: q() * 99, bar: 90 + q() * 90 });
  },
  draw(t, lt, ctx) {
    const { X, at } = ctx, S = ctx.scene.start, w = i => ctx.wordTime('l2', i);
    bgLight(ctx, t, { color: C.greyBg, a: 0.35, dots: 0.8 });
    const tB = w(2).s - 0.3;                                  // بداية الجزء الثاني
    // ── الجزء 1: الورق ──
    const sink = at(t, tB - 0.25, tB + 0.3, 'cubicIn');
    if (sink < 1) {
      const sh = at(lt, 0.4, 1.4) * (1 - sink);
      X.save(); X.translate(540, 1290); X.scale(1, 0.3); const g = X.createRadialGradient(0, 0, 0, 0, 0, 380); g.addColorStop(0, rgba(C.ink, 0.22 * sh)); g.addColorStop(1, rgba(C.ink, 0)); X.fillStyle = g; X.fillRect(-380, -380, 760, 760); X.restore();
      this.pages.forEach((m, i) => {
        const u = m.userData, k = ctx.prog(lt, u.land - 0.42, u.land), e = k * k;
        m.visible = k > 0;
        m.position.set(u.ox * e, i * 0.075 + (1 - e) * 5.5, u.oz * e);
        m.rotation.set((1 - e) * 0.5, u.yaw * (0.3 + 0.7 * e) + (1 - e) * 1.2, (1 - e) * -0.35);
      });
      const squash = this.pages.reduce((a, m) => a + Math.exp(-14 * Math.max(0, lt - m.userData.land)) * (lt >= m.userData.land ? 1 : 0), 0);
      this.pile.position.y = -0.06 * squash - sink * 11; this.pile.rotation.y = -0.35 + lt * 0.12; this.pile.scale.setScalar(1 - 0.15 * sink);
      this.st.draw(X, { alpha: 1 - sink * 0.6 });
    }
    const fade = at(t, w(1).e, w(1).e + 0.8, 'cubicOut');
    rise(ctx, t, 'التقارير تُنسى', 540, 460, { size: 134, colors: { 1: mix(C.ink, '#C2C2D0', fade) }, dur: 0.55 }, i => w(i).s - 0.08, tB - 0.1);

    // ── الجزء 2: أرقام بلا روح ──
    rise(ctx, t, 'والأرقام وحدها', 540, 400, { size: 100, color: C.ink }, i => w(i + 2).s - 0.08);
    rise(ctx, t, 'لا تحرّك القلوب', 540, 560, { size: 118, color: C.ink, dur: 0.55 }, i => w(i + 4).s - 0.08);
    this.cells.forEach((c, i) => {
      const k = at(t, tB + 0.25 + i * 0.05, tB + 0.7 + i * 0.05, 'expoOut'); if (k <= 0) return;
      let n = ''; const step = Math.floor(t * c.rate); for (let d = 0; d < c.digits; d++) n += Math.floor(ctx.hash01(c.seed, d, step) * 10);
      X.save(); X.globalAlpha = k; X.translate(0, (1 - k) * 40);
      ctx.text(X, n, c.x, c.y, { family: 'num', weight: 800, size: 92, color: '#A9A9BC', dir: 'ltr', align: 'center' });
      rr(X, c.x - c.bar / 2, c.y + 28, c.bar, 14, 7); X.fillStyle = '#D4D4DF'; X.fill(); X.restore();
    });
    // خط النبض المسطّح + قلب رمادي
    const ke = at(t, w(4).s - 0.35, w(6).s + 0.2, 'cubicInOut');
    if (ke > 0) {
      const pts = []; for (let x = 990; x >= 90; x -= 30) pts.push([x, 1340 + (Math.abs(x - 540) < 120 ? 0 : 3 * Math.sin(x * 0.07))]);
      ctx.drawPath(X, pts, ke, { width: 8, color: '#B4B4C4', tip: { r: 10, color: '#9A9AB0' } });
      const kh = at(t, w(5).s, w(5).s + 0.45, 'expoOut');
      if (kh > 0) { X.save(); X.globalAlpha = kh; X.beginPath(); X.arc(540, 1340, 96, 0, TAU); X.fillStyle = C.greyBg; X.fill(); X.lineWidth = 5; X.strokeStyle = '#CFCFDB'; X.stroke(); icon(X, 'heart', 540, 1344, 100 * (0.92 + 0.08 * kh), '#A9A9BC', { lw: 2 }); X.restore(); }
    }
  },
});
