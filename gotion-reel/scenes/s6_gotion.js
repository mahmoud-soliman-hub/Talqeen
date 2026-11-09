import './kit.js';
/* 3D — the edit timeline that Gotion builds… and its clips grow into sales bars */
MOTION.scene({ id: 's6', start: 20.75, end: 26,
  setup(ctx) {
    const { THREE, P } = ctx, st = this.st = ctx.stage3D({ fov: 30, camera: [0, 3, 15], env: 'room', tone: 'neutral', bloom: false });
    st.add(new THREE.DirectionalLight('#ffffff', 2.4)).position.set(-5, 8, 9);
    const g = this.g = new THREE.Group(); g.position.y = 1.05; st.add(g);
    const geo = new THREE.BoxGeometry(1, 1, 1), mat = c => new THREE.MeshStandardMaterial({ color: c, roughness: .5, metalness: 0, envMapIntensity: .55 });
    const D = [[0, -2, 1.7, P.acc, 0], [0, -.2, 1.2, P.hi], [0, 1.1, .9, P.deep], [1, -1.6, .9, P.deep, 1], [1, -.6, 2, P.acc], [2, -2, 1.2, P.hi], [2, -.7, .8, P.clay, 2], [2, .2, 1.8, P.deep], [3, -1.8, 2.4, P.clay, 3], [3, .7, 1.1, P.acc, 4]];
    const BARH = [.8, 1.3, 1.85, 2.45, 3.1], BC = [P.hi, '#9D88FF', P.acc, P.clay, P.deep];
    this.clips = D.map(([tr, x0, w, c, bar], i) => { const m = new THREE.Mesh(geo, mat(c)); g.add(m);
      return { m, i, A: [x0 + w / 2, 1.05 - tr * .68, 0, w, .46, .5], B: bar == null ? null : [-1.6 + bar * .8, -1.75 + BARH[bar] / 2, 0, .56, BARH[bar], .56], bar, c: new THREE.Color(c), bc: bar == null ? null : new THREE.Color(BC[bar]) }; });
    this.head = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: P.acc, toneMapped: false })); g.add(this.head);
    this.knob = new THREE.Mesh(new THREE.SphereGeometry(.13, 24, 16), new THREE.MeshBasicMaterial({ color: P.acc, toneMapped: false })); g.add(this.knob);
    this.floor = new THREE.Mesh(geo, mat(P.hi)); g.add(this.floor); this.v = new THREE.Vector3();
  },
  draw(t, lt, ctx) {
    const { X, P, at, lerp, clamp } = ctx, GK = window.GK;
    const a = ctx.lineSpan('l6a'), b = ctx.lineSpan('l6b'), c = ctx.lineSpan('l6c'), d = ctx.lineSpan('l6d');
    GK.bg(ctx, t, 'light');
    const m = at(t, d.s - .12, d.s + .62, 'expoInOut');
    this.clips.forEach(q => { const k = at(t, b.s - .25 + q.i * .07, b.s + .3 + q.i * .07, 'expoOut'), A = q.A, B = q.B || [A[0], A[1], A[2], 0, 0, 0];
      const grow = q.B ? 1 + .03 * at(t, d.s + .6, ctx.scene.end, 'sineInOut') * q.bar : 1;
      q.m.position.set(lerp(A[0], B[0], m) + (1 - k) * 7, lerp(A[1], B[1], m) + (q.B ? (grow - 1) * B[4] / 2 * m : 0), lerp(A[2], B[2], m));
      q.m.scale.set(Math.max(1e-4, lerp(A[3], B[3], m)), Math.max(1e-4, lerp(A[4], B[4] * grow, m)), Math.max(1e-4, lerp(A[5], B[5], m)));
      if (q.bc) q.m.material.color.copy(q.c).lerp(q.bc, m); q.m.visible = k > 0; });
    const hk = at(t, b.s + .1, c.s + .25, 'cubicInOut'), hx = lerp(-2.05, .62, hk), hs = (1 - m) * at(t, b.s - .1, b.s + .3, 'expoOut');
    this.head.position.set(hx, .03, .3); this.head.scale.set(.05 * hs + 1e-4, 2.9 * hs + 1e-4, .05); this.knob.position.set(hx, 1.5, .3); this.knob.scale.setScalar(hs + 1e-4);
    this.floor.position.set(0, -1.78, 0); this.floor.scale.set(4.2 * m + 1e-4, .05, 1.4);
    this.st.orbit(lerp(-.42, .3, at(lt, 0, ctx.scene.dur, 'sineInOut')), .2 + .05 * m, 15.6, [0, 0, 0]);
    this.st.draw(X);
    // «يوقّف»: the playhead stops — two rings where it stopped
    const rk = clamp((t - c.s - .2) / .9);
    if (rk > 0 && rk < 1 && m < .5) { this.v.set(hx, 1.5, .3); this.g.localToWorld(this.v); this.v.project(this.st.camera); const sx = (this.v.x * .5 + .5) * 1080, sy = (-this.v.y * .5 + .5) * 1920;
      for (let i = 0; i < 2; i++) { const kk = clamp(rk * 1.5 - i * .3); if (kk > 0 && kk < 1) { X.strokeStyle = `rgba(116,87,254,${1 - kk})`; X.lineWidth = 7; X.beginPath(); X.arc(sx, sy, 20 + ctx.E.expoOut(kk) * 110, 0, 6.2832); X.stroke(); } } }
    // logo (needed here: this is where the name is said)
    const lw = 440, lh = lw * GK.LOGO_AR, lx = 540 - lw / 2, ly = 180, wk = at(t, a.s - .1, a.s + .55, 'expoOut'), tk = at(t, a.s - .2, a.s + .25, 'expoOut');
    if (wk > 0) { X.save(); X.beginPath(); X.rect(lx, ly - 10, lw * wk, lh + 20); X.clip(); X.drawImage(ctx.img('wordN'), lx, ly, lw, lh); X.restore(); }
    if (tk > 0) { const tcx = lx + 210.5 / 1494 * lw, tcy = ly + 193.5 / 536 * lh, s = .6 + .4 * tk; X.save(); X.globalAlpha = tk; X.translate(tcx + (1 - tk) * 90, tcy); X.scale(s, s); X.translate(-tcx, -tcy); X.drawImage(ctx.img('tri'), lx, ly, lw, lh); X.restore(); }
    GK.line(ctx, t, 'l6b', 540, 1240, { size: 86, color: P.bg, hi: { 1: P.acc } });
    GK.line(ctx, t, 'l6c', 540, 1362, { size: 86, color: P.bg });
    GK.line(ctx, t, 'l6d', 540, 1486, { size: 96, color: P.acc });
  } });
