import "./style.css";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add("js");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* lenis smooth scroll, synced with ScrollTrigger */
const lenis = new Lenis({ lerp: 0.09 });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

/* terminal typing — loop berhenti saat hero keluar viewport (anti idle-rAF, riset batch2) */
const strings = ["./ito-2027 --register", "menggelorakan inovasi", "teknologi dan kreativitas", "karya anak bangsa"];
const typed = document.getElementById("typed");
if (reduced) {
  typed.textContent = strings[0];
} else {
  let si = 0, ci = 0, del = false, timer = 0;
  const type = () => {
    const s = strings[si];
    typed.textContent = s.slice(0, ci);
    let d = 70;
    if (!del && ci < s.length) ci++;
    else if (!del) { del = true; d = 1700; }
    else if (ci > 0) { ci--; d = 38; }
    else { del = false; si = (si + 1) % strings.length; d = 320; }
    timer = setTimeout(type, d);
  };
  ScrollTrigger.create({
    trigger: "#hero", start: "top bottom", end: "bottom top",
    onToggle: (self) => { clearTimeout(timer); if (self.isActive) type(); },
  });
}

/* nav scene-index: bab aktif ikut progress scroll (HUD jujur, pattern Ghost Pitcher) */
const scLinks = [...document.querySelectorAll(".nav-links a")];
[["#tentang", 0], ["#lomba", 1], ["#timeline", 2]].forEach(([sel, i]) => {
  ScrollTrigger.create({
    trigger: sel, start: "top center", end: "bottom center",
    onToggle: (s) => { if (s.isActive) scLinks.forEach((a, j) => a.classList.toggle("on", i === j)); },
  });
});

/* CLS guard: reserve space for the async Google-Fonts stylesheet (CLS=0.12 dari swap font) */
{
  const probe = document.createElement("span");
  probe.className = "font-probe";
  probe.textContent = "Hg";
  document.body.appendChild(probe);
  document.fonts.ready.then(() => {
    requestAnimationFrame(() => { probe.remove(); ScrollTrigger.refresh(); });
  });
}

/* counter: reserve ruang digit final sejak awal — angka 0 vs 300 beda lebar (CLS culprit #stats) */
const cio = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  cio.unobserve(e.target);
  const el = e.target, target = +el.dataset.target, t0 = performance.now();
  el.style.minWidth = el.dataset.target.length + "ch";
  (function tick(t) {
    const p = Math.min((t - t0) / 1300, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}), { threshold: 0.5 });
document.querySelectorAll(".num").forEach((n) => cio.observe(n));

/* reveals */
const rio = new IntersectionObserver((es) => es.forEach((e) =>
  e.target.classList.toggle("in", e.isIntersecting)
), { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => rio.observe(el));

/* cascade cards */
gsap.utils.toArray(".card").forEach((card, i) => {
  gsap.from(card, {
    xPercent: (i % 2 ? 10 : -10) * 1.6, autoAlpha: 0, duration: 1.1, ease: "expo.out",
    scrollTrigger: { trigger: card, start: "top 88%" }
  });
});

/* hero build: halaman disusun dari nol oleh kursor palsu, scroll = playhead (desktop & mobile) */
const drop = { v: 1 }; /* dibaca loop 3D: 0 = gunungan di atas layar, 1 = mendarat */
if (!reduced) {
  document.documentElement.classList.add("build");
  const H = document.getElementById("hero"), $ = (s) => H.querySelector(s), $$ = (s) => [...H.querySelectorAll(s)];
  const fc = $(".fcursor"), arrow = $(".fc-arrow"), cross = $(".fc-cross"), pen = $(".fc-pen"), ring = $(".fc-ring");
  const ft = $(".ft"), fr = $(".fr"), fbb = $(".fb-b"), fl = $(".fl"), gv = $$(".gv1,.gv2"), gh = $$(".gh1,.gh2"), lns = $$(".ln"), clips = $$(".clip"), layerLis = $$(".layers li");
  const term = $(".terminal"), title = $(".hero-title"), sub = $(".hero-sub"), cta = $(".cta-row"), tray = $(".tray");
  const marq = $(".marq"), dim = $(".dim"), gx = $(".gx"), gy = $(".gy"), hud = $(".hud"), tc = $(".tc"), state = $(".hud-state"), phw = $(".ph-wrap");
  /* posisi tanpa pengaruh transform (offset chain), relatif ke hero */
  const box = (el) => { let x = 0, y = 0, e = el; while (e && e !== H) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return { x, y, w: el.offsetWidth, h: el.offsetHeight, cx: x + el.offsetWidth / 2, cy: y + el.offsetHeight / 2 }; };
  let L = {};
  const measure = () => {
    const W = H.offsetWidth, Hh = H.offsetHeight, t = box(title), c = box(cta), tr = box(tray);
    const pad = W < 600 ? 6 : 12, mx = Math.max(8, t.x - pad), mw = Math.min(W - 16, t.w + pad * 2);
    /* di mobile .tray disembunyikan → tombol datang dari bawah-tengah hero */
    const ax = tr.w ? tr.cx : W / 2, ay = tr.w ? tr.cy : Hh * .82;
    L = { W, H: Hh, t, m: { x: mx, y: t.y - pad, w: mw, h: t.h + pad * 2 }, c, ax, ay, term: box(term), sub: box(sub) };
    gy.style.top = c.cy + "px";
  };
  measure();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  const fn = (f) => () => f(L); /* nilai dihitung ulang tiap refresh/resize */
  const cur = (on) => [[arrow, on === "arrow"], [cross, on === "cross"], [pen, on === "pen"]].map(([el, v]) => ({ el, v }));
  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onUpdate: () => fc.classList.toggle("flip", +gsap.getProperty(fc, "x") > L.W * .96 - 115)
  });
  const tool = (on, at) => { const p = at ?? ">"; cur(on).forEach(({ el, v }) => tl.set(el, { autoAlpha: v ? 1 : 0 }, p)); };
  const click = (at) => tl.fromTo(ring, { scale: .3, autoAlpha: 1 }, { scale: 1.7, autoAlpha: 0, duration: .35, ease: "power1.out" }, at ?? ">");

  gsap.set(fc, { x: fn((l) => l.W * .04), y: fn((l) => l.H * .16), autoAlpha: 0 });
  gsap.set([arrow, cross, ring], { autoAlpha: 0 });
  gsap.set([ft, fbb, ...gh], { scaleX: 0 });
  gsap.set([fr, fl, ...gv], { scaleY: 0 });
  gsap.set([".crop", hud, ".layers", marq, tray, gx, gy, ".hero-meta", ".hero-hint"].map((s) => typeof s === "string" ? H.querySelectorAll(s) : s), { autoAlpha: 0 });
  gsap.set(".crop", { scale: 0 });
  gsap.set(term, { autoAlpha: 0, scale: .6 });
  gsap.set([...lns, sub], { clipPath: "inset(0 100% 0 0)" });
  gsap.set(cta, { x: fn((l) => l.ax - l.c.cx), y: fn((l) => l.ay - l.c.cy), scale: .85, autoAlpha: 0 });
  drop.v = 0;

  /* 1 grid: pen tool menggambar 4 sisi bingkai satu-per-satu mengikuti ujung pen (atas → kanan → bawah → kiri), lalu crosshair memasang grid 3×3 */
  tl.addLabel("grid")
    .to(".build-hint", { autoAlpha: 0, duration: .3 }, 0)
    .to([hud, ".strip", fc], { autoAlpha: 1, duration: .25 }, 0)
    .to(fc, { x: fn((l) => l.W * .96), duration: .45, ease: "none" })
    .to(ft, { scaleX: 1, duration: .45, ease: "none" }, "<")
    .to(fc, { y: fn((l) => l.H * .9), duration: .4, ease: "none" })
    .to(fr, { scaleY: 1, duration: .4, ease: "none" }, "<")
    .to(fc, { x: fn((l) => l.W * .04), duration: .45, ease: "none" })
    .to(fbb, { scaleX: 1, duration: .45, ease: "none" }, "<")
    .to(fc, { y: fn((l) => l.H * .16), duration: .4, ease: "none" })
    .to(fl, { scaleY: 1, duration: .4, ease: "none" }, "<")
    .to(H.querySelectorAll(".crop"), { scale: 1, autoAlpha: 1, stagger: .06, duration: .25 });
  tool("cross");
  tl.to(fc, { x: fn((l) => l.W / 2), y: fn((l) => l.H * .53), duration: .5 })
    .to(gv, { scaleY: 1, duration: .5, stagger: .1, ease: "none" })
    .to(gh, { scaleX: 1, duration: .5, stagger: .1, ease: "none" }, "<.12")
    .to(".layers", { autoAlpha: 1, duration: .3 }, "<");

  /* 2 judul: panah marquee-drag area judul (fromTo + invalidateOnRefresh aman saat ganti dimensi DevTools), klik, baris judul muncul */
  tl.addLabel("judul");
  tool("arrow");
  tl.to(fc, { x: fn((l) => l.m.x), y: fn((l) => l.m.y), duration: .6 })
    .to(fc, { x: fn((l) => l.m.x + l.m.w), y: fn((l) => l.m.y + l.m.h), duration: .9 })
    .fromTo(marq,
      { x: fn((l) => l.m.x), y: fn((l) => l.m.y), width: 0, height: 0, autoAlpha: 0 },
      {
        x: fn((l) => l.m.x), y: fn((l) => l.m.y), width: fn((l) => l.m.w), height: fn((l) => l.m.h), autoAlpha: 1, duration: .9, immediateRender: false,
        onUpdate() { dim.textContent = `${Math.round(gsap.getProperty(marq, "width"))} × ${Math.round(gsap.getProperty(marq, "height"))}`; }
      }, "<");
  click();
  tl.to(lns, { clipPath: "inset(0 0% 0 0)", stagger: .25, duration: .6, ease: "power2.out" }, "<")
    .to(marq, { autoAlpha: 0, duration: .3 });

  /* 3 teks: klik terminal, pen menulis subjudul */
  tl.addLabel("teks")
    .to(fc, { x: fn((l) => l.term.cx), y: fn((l) => l.term.cy), duration: .6 });
  click();
  tl.to(term, { autoAlpha: 1, scale: 1, duration: .4, ease: "back.out(2)" }, "<");
  tool("pen");
  tl.to(fc, { x: fn((l) => l.sub.x), y: fn((l) => l.sub.y + l.sub.h), duration: .5 })
    .to(fc, { x: fn((l) => l.sub.x + l.sub.w), duration: .9, ease: "none" })
    .to(sub, { clipPath: "inset(0 0% 0 0)", duration: .9, ease: "none" }, "<");

  /* 4 aset: panah ambil tombol dari panel aset, drag ke tengah, guide snap */
  tl.addLabel("aset");
  tool("arrow");
  tl.to([tray, cta], { autoAlpha: (i) => i ? .45 : 1, duration: .3 })
    .to(fc, { x: fn((l) => l.ax), y: fn((l) => l.ay), duration: .6 }, "<");
  click();
  tl.to(cta, { autoAlpha: 1, scale: 1, duration: .2 }, "<")
    .to(fc, { x: fn((l) => l.c.cx), y: fn((l) => l.c.cy), duration: 1 })
    .to(cta, { x: 0, y: 0, duration: 1 }, "<")
    .to([gx, gy], { autoAlpha: 1, duration: .15 }, "-=.3")
    .to([gx, gy], { autoAlpha: 0, duration: .25 })
    .to(tray, { autoAlpha: 0, duration: .3 }, "<");

  /* 5 gunungan: crosshair klik di dalam sel kanan-atas bingkai, gunungan jatuh & memantul */
  tl.addLabel("gunungan");
  tool("cross");
  tl.to(fc, { x: fn((l) => l.W * (l.W < 600 ? .68 : .76)), y: fn((l) => l.H * .28), duration: .6 });
  click();
  tl.to(drop, { v: 1, duration: 1.3, ease: "bounce.out" }, "<")
    .to([".hero-meta", ".hero-hint"].map((s) => $(s)), { autoAlpha: 1, stagger: .15, duration: .4 }, "-=.4");

  /* 6 selesai: kursor & seluruh chrome editor memudar di dalam bingkai (tidak pernah keluar batas) */
  tl.addLabel("selesai")
    .to([fc, ...[".crop", ".layers", ".strip", ".hud", ".frame"].map((s) => H.querySelectorAll(s))], { autoAlpha: 0, duration: .4 })
    .addLabel("end");

  const names = ["grid", "judul", "teks", "aset", "gunungan", "selesai"];
  const dur = tl.duration(), starts = names.map((n) => tl.labels[n]), ends = [...starts.slice(1), dur];
  clips.forEach((c, i) => { c.style.left = (starts[i] / dur * 100) + "%"; c.style.width = `calc(${(ends[i] - starts[i]) / dur * 100}% - 3px)`; });
  let lastIdx = -1;
  const pad = (n) => String(n).padStart(2, "0");
  /* timecode jujur: progress scrub hero memetakan TC per frame 25fps (riset batch3 — HUD tak boleh bohong) */
  const setHud = (p) => {
    const f = Math.round(p * 12 * 25);
    tc.textContent = `00:00:${pad(Math.floor(f / 25))}:${pad(f % 25)}`;
    phw.style.setProperty("--p", p);
    const t = p * dur;
    let idx = 0;
    starts.forEach((s, i) => { if (t >= s - .01) idx = i; });
    if (idx === lastIdx) return;
    lastIdx = idx;
    layerLis.forEach((li, i) => li.classList.toggle("on", i === idx));
    clips.forEach((c, i) => c.classList.toggle("on", i <= idx));
    state.textContent = names[idx];
  };
  ScrollTrigger.create({
    trigger: H, start: "top top", end: "+=420%", pin: true, scrub: .75, animation: tl,
    invalidateOnRefresh: true, onRefreshInit: measure,
    onUpdate: (self) => setHud(self.progress),
  });
  /* di mobile tanpa .build, TC tetap membaca progress halaman keseluruhan */
  if (reduced) tc.textContent = "00:00:12:00";
  else if (!document.documentElement.classList.contains("build")) {
    ScrollTrigger.create({
      trigger: "body", start: "top top", end: "bottom bottom",
      onUpdate: (self) => {
        const f = Math.round(self.progress * 12 * 25);
        tc.textContent = `00:00:${pad(Math.floor(f / 25))}:${pad(f % 25)}`;
      },
    });
  }
}

/* story — pinned (mobile & desktop: tiap bab muncul satu-per-satu dengan jeda kosong & tahanan baca panjang) */
if (!reduced) {
  document.documentElement.classList.add("story-pin");
  gsap.timeline({
    scrollTrigger: {
      trigger: "#story", start: "top top", end: "+=900%", pin: true, scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => { scrollN = self.progress; }
    }
  })
    .from(".s1", { autoAlpha: 0, y: 60, duration: 1 })
    .to(".s1", { y: 0, duration: 2.2 })
    .to(".s1", { autoAlpha: 0, yPercent: -45, duration: 1 })
    .fromTo(".s2", { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1 }, "+=0.6")
    .to(".s2", { y: 0, duration: 2.2 })
    .to(".s2", { autoAlpha: 0, yPercent: -45, duration: 1 })
    .fromTo(".s3", { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1 }, "+=0.6")
    .to(".s3", { y: 0, duration: 2.2 })
    .to(".s3", { autoAlpha: 0, yPercent: -45, duration: 1 })
    .fromTo(".s4", { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 1 }, "+=0.6")
    .to(".s4", { scale: 1, duration: 2.4 });
}

/* 3D gunungan */
let scrollN = 0, in3D = true;
/* satu pemicu visibility: render mati saat hero & story keduanya keluar viewport (dulu dua listener dobel) */
ScrollTrigger.create({ trigger: "main", start: "top bottom", end: "#timeline top", onToggle: (s) => { in3D = s.isActive; } });
async function boot3D() {
const canvas = document.getElementById("bg3d");
const THREE = await import("three").catch((e) => { console.warn("three failed", e); return null; });
if (!THREE) return;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0d24, 0.03);
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 2.2, 14);
camera.lookAt(0, 0.4, 0);

scene.add(new THREE.AmbientLight(0x7c5cff, 1.1));
const key = new THREE.PointLight(0xff9e3d, 90); key.position.set(6, 9, 6); scene.add(key);
const fill = new THREE.PointLight(0x7c5cff, 55); fill.position.set(-9, 4, -5); scene.add(fill);

/* gunungan: profile lebar bawah → puncak, lengkung sinus */
const CUBE = 0.55, cells = [];
for (let x = -6; x <= 6; x++) for (let z = -6; z <= 6; z++) {
  const r = Math.hypot(x, z); if (r > 6.2) continue;
  const h = Math.max(0, 10 - r * 2.2) + Math.sin(r * 1.5) * 0.8;
  for (let y = 0; y < h; y++) cells.push([x * CUBE, y * CUBE, z * CUBE, r, y]);
}
const geo = new THREE.BoxGeometry(CUBE * 0.92, CUBE * 0.92, CUBE * 0.92);
const mat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.45 });
const mesh = new THREE.InstancedMesh(geo, mat, cells.length);
const dummy = new THREE.Object3D(), col = new THREE.Color();
const cCool = new THREE.Color(0x7c5cff), cWarm = new THREE.Color(0xff9e3d);
cells.forEach(([x, y, z, r, yi], i) => {
  dummy.position.set(x, y - 3.5, z); dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix);
  const t = yi / 10;
  mesh.setColorAt(i, col.clone().lerpColors(cCool, cWarm, t * t));
});
mesh.instanceColor.needsUpdate = true;
scene.add(mesh);
const baseCol = cells.map((_, i) => { const c = new THREE.Color(); mesh.getColorAt(i, c); return c; });
const cGlow = new THREE.Color(0xffd29a);

/* posisi awal tiap kubus untuk transisi story (urai → naik) */
const home = cells.map(([x, y, z, r]) => ({ x, y: y - 3.5, z, spread: 1 }));

/* interaksi: tilt pointer, drag putar + inersia, hover repel + glow, klik ripple (listener hanya saat 3D hidup) */
let mx = 0, my = 0, dragRot = 0, vel = 0, dragging = false, px = 0;
const ndc = new THREE.Vector2(9, 9), ray = new THREE.Raycaster();
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const hit = new THREE.Vector3(), local = new THREE.Vector3(), ripple = new THREE.Vector3();
let hover = false, rippleT = -9;
const interactive = (e) => !e.target.closest("a,button,input,textarea,.terminal");
const onMove = (e) => {
  mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5;
  ndc.set(mx * 2, -my * 2);
  if (dragging) { const d = (e.clientX - px) * 0.006; dragRot += d; vel = d; }
  px = e.clientX;
};
const onDown = (e) => {
  if (!interactive(e)) return;
  dragging = true; px = e.clientX;
  if (hover) { ripple.copy(local); rippleT = clock.getElapsedTime(); }
};
const onUp = () => { dragging = false; };
const onLeave = () => ndc.set(9, 9);
addEventListener("pointermove", onMove, { passive: true });
addEventListener("pointerdown", onDown, { passive: true });
addEventListener("pointerup", onUp, { passive: true });
addEventListener("pointerleave", onLeave);
addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
renderer.setSize(innerWidth, innerHeight);

const clock = new THREE.Clock();
/* ticker tunggal: render 3D dititipkan ke gsap.ticker (dulu rAF sendiri = 2x wake-up per frame) */
gsap.ticker.add(() => {
  if (!in3D) return;
  const t = clock.getElapsedTime();
  /* scrollN 0→1: kubus mengambang melebar (urai) lalu kembali rapat (satu) */
  const burst = Math.sin(Math.min(scrollN, 1) * Math.PI) * 2.2;
  /* titik kursor di ruang lokal gunungan */
  ray.setFromCamera(ndc, camera);
  hover = !!ray.ray.intersectPlane(plane, hit) && ndc.x < 2;
  if (hover) { local.copy(hit); mesh.worldToLocal(local); }
  const rAge = t - rippleT;
  for (let i = 0; i < cells.length; i++) {
    const c = cells[i], h = home[i];
    const wob = Math.sin(t * 1.2 + i * 0.35) * 0.06;
    let x = h.x * (1 + burst * 0.14) + wob;
    let y = h.y + Math.sin(t * 0.7 + c[3]) * 0.12 + burst * 0.5;
    let z = h.z * (1 + burst * 0.14);
    let glow = 0;
    if (hover) { /* repel: kubus dekat kursor terdorong keluar & menyala */
      const dx = x - local.x, dy = y - local.y, dz = z - local.z;
      const d = Math.hypot(dx, dy, dz);
      if (d < 2.4) { const f = (1 - d / 2.4) ** 2; x += dx / (d || 1) * f * 1.3; y += dy / (d || 1) * f * 1.3; z += dz / (d || 1) * f * 1.3; glow = f; }
    }
    if (rAge < 2.2) { /* ripple gelombang dari titik klik */
      const d = Math.hypot(h.x - ripple.x, h.y - ripple.y, h.z - ripple.z);
      const w = Math.exp(-((d - rAge * 6) ** 2)) * (1 - rAge / 2.2);
      y += w * 1.1; glow = Math.max(glow, w);
    }
    dummy.position.set(x, y, z);
    dummy.scale.setScalar(1 + glow * 0.35);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    mesh.setColorAt(i, col.copy(baseCol[i]).lerp(cGlow, glow));
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.instanceColor.needsUpdate = true;
  /* auto-rotate + drag dengan inersia + tilt pointer */
  if (!dragging) { dragRot += vel; vel *= 0.94; }
  mesh.rotation.y = t * 0.12 + dragRot + mx * 0.5 + scrollN * 1.6;
  mesh.rotation.x = my * 0.15;
  mesh.position.y = Math.sin(t * 0.5) * 0.2 + 0.6 + (1 - drop.v) * 11;
  renderer.render(scene, camera);
});
}
/* 3D gunungan: lazy, hanya di desktop mampu */
const canvasEl = document.getElementById("bg3d");
if (reduced || innerWidth < 768 || (navigator.deviceMemory || 8) < 4) {
  canvasEl.style.display = "none";
} else {
  requestIdleCallback ? requestIdleCallback(boot3D) : setTimeout(boot3D, 200);
}
