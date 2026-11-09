import './kit.js';
/* 3D — one video card; a hundred little pictures swirl behind it and fall away */
MOTION.scene({ id: 's3', start: 8.25, end: 12.5,
  setup(ctx) {
    const { THREE, P } = ctx, GK = window.GK;
    const st = this.st = ctx.stage3D({ fov: 30, camera: [0, 0, 16], env: 'room', tone: 'neutral', bloom: false });
    st.add(new THREE.DirectionalLight('#ffffff', 2.2)).position.set(4, 6, 8);
    const g = this.card = new THREE.Group();
    g.add(new THREE.Mesh(new ctx.RoundedBoxGeometry(2.36, 3.96, .24, 6, .2), new THREE.MeshPhysicalMaterial({ color: P.clay, roughness: .45, clearcoat: .5, envMapIntensity: .6 })));
    const c = document.createElement('canvas'); c.width = 660; c.height = 1110; const x = c.getContext('2d');
    x.fillStyle = P.acc; GK.rr(x, 0, 0, 660, 1110, 56); x.fill();
    x.fillStyle = 'rgba(255,255,255,.16)'; x.beginPath(); x.arc(330, 500, 170, 0, 6.2832); x.fill();
    GK.tri(x, 342, 500, 150, '#FFFFFF');
    x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); x.arc(580, 84, 34, 0, 6.2832); x.fill(); GK.rr(x, 300, 62, 220, 20, 10); x.fill();
    x.fillStyle = 'rgba(255,255,255,.5)'; GK.rr(x, 380, 98, 140, 14, 7); x.fill();
    x.fillStyle = 'rgba(255,255,255,.28)'; GK.rr(x, 50, 1010, 560, 14, 7); x.fill(); x.fillStyle = '#FFFFFF'; GK.rr(x, 250, 1010, 360, 14, 7); x.fill(); x.beginPath(); x.arc(250, 1017, 18, 0, 6.2832); x.fill();
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const f = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3.7), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false })); f.position.z = .125; g.add(f);
    g.position.y = .85; st.add(g);
    const N = this.N = 100, r = ctx.rng(11), cols = [P.hi, '#FFFFFF', '#3B388C', '#8C8AB8', '#9D88FF', '#55529E'];
    const pc = document.createElement('canvas'); pc.width = pc.height = 128; const px = pc.getContext('2d');
    px.fillStyle = '#FFFFFF'; GK.rr(px, 4, 4, 120, 120, 22); px.fill(); px.fillStyle = 'rgba(15,14,60,.3)'; px.beginPath(); px.arc(42, 42, 13, 0, 6.2832); px.fill();
    px.beginPath(); px.moveTo(14, 104); px.lineTo(50, 62); px.lineTo(70, 84); px.lineTo(90, 56); px.lineTo(114, 104); px.closePath(); px.fill();
    const ptex = new THREE.CanvasTexture(pc); ptex.colorSpace = THREE.SRGBColorSpace;
    this.tiles = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ toneMapped: false, map: ptex, alphaTest: .5 }), N);
    this.T = []; const col = new THREE.Color();
    for (let i = 0; i < N; i++) { this.T.push({ a: i * 2.39996, r: r.range(1.55, 2.75), z: r.range(-4.5, -1), w: r.range(.4, .62), h: r.range(.4, .62), sp: r.range(.8, 1.25) }); this.tiles.setColorAt(i, col.set(r.pick(cols))); }
    this.tiles.instanceColor.needsUpdate = true; st.add(this.tiles); this.M = new THREE.Matrix4(); this.V = new THREE.Vector3(); this.Sc = new THREE.Vector3(); this.Q = new THREE.Quaternion();
  },
  draw(t, lt, ctx) {
    const { X, P, at } = ctx, GK = window.GK, b = ctx.lineSpan('l3b'), last = ctx.wordTime('l3b', -1);
    GK.bg(ctx, t, 'navy');
    const inK = at(lt, -.2, .75, 'expoOut'), out = at(t, last.s + .1, last.s + .75, 'expoInOut');
    this.card.rotation.set(.05 * Math.sin(lt * .9), -1.1 * (1 - inK) - .22 + .16 * Math.sin(lt * 1.1), 0);
    this.card.scale.setScalar(.8 * (.86 + .14 * inK) * (1 + .09 * out));
    const T1 = b.s - .1;
    for (let i = 0; i < this.N; i++) { const q = this.T[i], k = at(t, T1 + i / this.N * 1.15, T1 + i / this.N * 1.15 + .5, 'expoOut'), a = q.a + (t - T1) * .22 * q.sp, rr = q.r * (1 + out * 1.5);
      this.V.set(Math.cos(a) * rr * 1.5, Math.sin(a) * rr * .7 + .85, q.z - (1 - k) * 16); const s = k * (1 - out);
      this.Sc.set(q.w * s + 1e-4, q.h * s + 1e-4, 1); this.tiles.setMatrixAt(i, this.M.compose(this.V, this.Q, this.Sc)); }
    this.tiles.instanceMatrix.needsUpdate = true;
    this.st.orbit(.1 * Math.sin(lt * .7), .02, 16 - .8 * inK);
    this.st.draw(X);
    GK.line(ctx, t, 'l3a', 540, 262, { size: 92, hi: { 1: P.hi } });
    GK.line(ctx, t, 'l3b', 540, 1378, { text: 'يوصّل اللي ما توصّله', size: 66, color: P.hi });
    GK.line(ctx, t, 'l3b', 540, 1488, { text: 'مية صورة', size: 104, wordOffset: 4 });
  } });
