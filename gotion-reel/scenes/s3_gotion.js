/* s3 — التحول: «خلّها علينا. جوشن.. فريق الجرافيك والموشن اللي يشتغل وراك.»
   مثلث التشغيل 3D على خلفية بنفسجي، وبعدها الشعار بيترسم خط خط */
import GO from './_lib.js';

MOTION.scene({
  id: 's3',
  setup(ctx) {
    const { THREE } = ctx;
    const st = this.st = ctx.stage3D({ fov: 30, camera: [0, 0, 12], env: 'room', tone: 'neutral', bloom: false, samples: 4 });
    const sh = new THREE.Shape(), R = 0.82, pts = [0, 1, 2].map(i => [Math.cos(i * 2.0944) * R, Math.sin(i * 2.0944) * R]);
    sh.moveTo(pts[0][0], pts[0][1]); sh.lineTo(pts[1][0], pts[1][1]); sh.lineTo(pts[2][0], pts[2][1]); sh.closePath();
    const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.4, bevelEnabled: true, bevelThickness: 0.16, bevelSize: 0.16, bevelSegments: 10, curveSegments: 4 });
    geo.center();
    this.prism = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: '#FFFFFF', roughness: 0.22, metalness: 0.0, clearcoat: 0.6, clearcoatRoughness: 0.2, envMapIntensity: 0.9 }));
    st.add(this.prism);
    const key = new THREE.DirectionalLight('#ffffff', 2.2); key.position.set(4, 6, 8); st.add(key);
    const rim = new THREE.DirectionalLight('#B8AAFF', 2.5); rim.position.set(-6, -3, 2); st.add(rim);
    this.orbs = [0, 1, 2, 3, 4, 5].map(i => ({ a: i * 1.047, r: 330 + (i % 3) * 40, sp: 0.5 + (i % 2) * 0.25, kind: i % 3 }));
  },
  draw(t, lt, ctx) {
    const { X, at, E } = ctx, C = GO.C;
    const w = i => ctx.wordTime('l3', i);
    const tB = w(2).s - 0.22;                       // لحظة القلب للشعار
    const kB = at(t, tB, tB + 0.55, 'expoInOut');

    // ── A: خلّها علينا (بنفسجي) ──
    if (kB < 1) {
      GO.bg(ctx, t, C.violet, '#8B74FA', { speed: 30, r: 3 });
      const kin = at(lt, -0.1, 0.7, 'expoOut');
      this.prism.rotation.set(0.25 * Math.sin(lt * 1.3), -1.2 + kin * 1.2 + lt * 0.55, Math.PI + 0.12 * Math.sin(lt * 0.9));
      this.prism.scale.setScalar((0.86 + 0.14 * kin) * (1 - 0.35 * kB));
      this.prism.position.set(0, 1.45 + kB * 0.5, 0);
      this.st.draw(X, { alpha: (1 - kB) });
      GO.say(ctx, t, 'خلّها', 540, 1010, { line: 'l3', from: 0, size: 200, color: '#fff', out: tB });
      GO.say(ctx, t, 'علينا', 540, 1250, { line: 'l3', from: 1, size: 200, color: C.night, out: tB });
      ctx.drawPath(X, [[270, 1318], [450, 1332], [640, 1320], [810, 1328]], at(t, w(1).s + 0.12, w(1).e + 0.1, 'cubicOut') * (1 - kB), { width: 14, color: '#fff' });
    }
    // ── B: الشعار (فاتح) يكشف من دايرة ──
    if (kB > 0) {
      X.save(); X.beginPath(); X.arc(540, 620, kB * 2100, 0, 6.2832); X.clip();
      GO.bg(ctx, t, C.paper, C.mist, { speed: 12 });
      // مدارات الأشكال حوالين الشعار
      const ko = at(t, tB + 0.2, tB + 1.0, 'expoOut');
      X.save(); X.translate(540, 700); X.globalAlpha = 0.9 * ko;
      X.strokeStyle = C.mist; X.lineWidth = 3; X.setLineDash([4, 16]);
      for (const r of [330, 370, 410]) { X.beginPath(); X.ellipse(0, 0, r * 1.3 * ko, r * 0.8 * ko, -0.2, 0, 6.2832); X.stroke(); }
      X.setLineDash([]);
      for (const o of this.orbs) {
        const a = o.a + t * o.sp, x = Math.cos(a) * o.r * 1.3, y = Math.sin(a) * o.r * 0.8, c = Math.cos(-0.2), s = Math.sin(-0.2), px = (x * c - y * s) * ko, py = (x * s + y * c) * ko;
        X.save(); X.translate(px, py); X.rotate(a * 1.5);
        if (o.kind === 0) { X.fillStyle = C.violet; X.beginPath(); X.arc(0, 0, 15, 0, 6.2832); X.fill(); }
        else if (o.kind === 1) { GO.rr(X, -15, -15, 30, 30, 7); X.fillStyle = C.navy; X.fill(); }
        else GO.tri(X, 0, 0, 34, { color: C.soft });
        X.restore();
      }
      X.restore();
      const kl = at(t, tB + 0.15, tB + 1.25, 'linear');
      GO.logo(ctx, { cx: 540, cy: 690, w: 760, k: kl, tri: at(t, tB + 0.75, tB + 1.2, 'linear'), tag: at(t, tB + 0.95, tB + 1.6, 'linear') });
      GO.say(ctx, t, 'فريق الجرافيك والموشن', 540, 1140, { line: 'l3', from: 3, size: 76, hi: { 1: C.violet, 2: C.violet } });
      GO.say(ctx, t, 'اللي يشتغل وراك', 540, 1280, { line: 'l3', from: 6, size: 86 });
      ctx.drawPath(X, [[330, 1322], [480, 1336], [620, 1324], [750, 1332]], at(t, w(8).s, w(8).e + 0.15, 'cubicOut'), { width: 12, color: C.violet });
      X.restore();
    }
  },
});
