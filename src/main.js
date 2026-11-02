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

/* counter: nilai diikat langsung ke progress scroll build #stats (tidak muncul sebelum animasi build dimulai) */
document.querySelectorAll(".num").forEach((n) => {
  n.style.minWidth = n.dataset.target.length + "ch";
  if (reduced) n.textContent = n.dataset.target;
});

/* generator SVG kursor multi-kolaborator (Adobe / Figma suite: Selection Arrow, Pen Bezier, Type I-Beam, Move 4-Way, Hand Grab, Precision Crosshair) */
const mkCursorHTML = (tag, cls = "") => `
  <div class="fcursor ${cls}">
    <svg class="fc-arrow" viewBox="0 0 16 22" width="18" height="24"><path d="M1 1v17l4.5-4 3 7 2.6-1.1-3-6.8H14z"/></svg>
    <svg class="fc-cross" viewBox="0 0 32 32" width="32" height="32"><circle cx="16" cy="16" r="6"/><path d="M16 0v10M16 22v10M0 16h10M22 16h10"/></svg>
    <svg class="fc-pen" viewBox="0 0 24 24" width="24" height="24"><path d="M2 22l3-9 9-9 6 6-9 9z M2 22l6.5-6.5"/><circle cx="10" cy="14" r="1.4"/></svg>
    <svg class="fc-ibeam" viewBox="0 0 20 24" width="20" height="24"><path d="M6 3h8M10 3v18M6 21h8"/></svg>
    <svg class="fc-move" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2v20M2 12h20M12 2l-3 3m3-3l3 3M12 22l-3-3m3 3l3-3M2 12l3-3m-3 3l3 3M22 12l-3-3m3 3l-3 3"/></svg>
    <svg class="fc-hand" viewBox="0 0 22 22" width="22" height="22"><rect x="3" y="3" width="16" height="16" rx="3"/><circle cx="11" cy="11" r="2.2"/></svg>
    <span class="fc-ring"></span><span class="fc-tag mono" data-txt="${tag}"></span>
  </div>`;
const bindCursor = (el) => {
  const icons = {
    arrow: el.querySelector(".fc-arrow"), cross: el.querySelector(".fc-cross"), pen: el.querySelector(".fc-pen"),
    ibeam: el.querySelector(".fc-ibeam"), move: el.querySelector(".fc-move"), hand: el.querySelector(".fc-hand")
  };
  const ring = el.querySelector(".fc-ring");
  const allIcons = Object.values(icons).filter(Boolean);
  return {
    el, ring, allIcons,
    setTool(tl, on, at) { allIcons.forEach((ic) => tl.set(ic, { autoAlpha: ic === icons[on] ? 1 : 0 }, at)); },
    click(tl, at) { tl.fromTo(ring, { scale: .3, autoAlpha: 1 }, { scale: 1.7, autoAlpha: 0, duration: .22, ease: "power1.out" }, at); },
    flip(W) { el.classList.toggle("flip", +gsap.getProperty(el, "x") > W * .96 - 120); }
  };
};

/* hero build: seluruh bagian hero dibangun CEPAT & BERBARENGAN oleh 3 KURSOR SEKALIGUS (panitia ITO, desainer UI, dev 3D) */
const drop = { v: 1 }; /* dibaca loop 3D: 0 = gunungan di atas layar, 1 = mendarat */
if (!reduced) {
  document.documentElement.classList.add("build");
  const H = document.getElementById("hero"), $ = (s) => H.querySelector(s), $$ = (s) => [...H.querySelectorAll(s)];
  const bui = $(".build-ui");
  /* tambahkan SVG Adobe (ibeam, move, hand) ke kursor utama + spawn 2 kursor kolaborator ekstra di hero */
  const fc0El = $(".fcursor");
  fc0El.insertAdjacentHTML("afterbegin", `
    <svg class="fc-ibeam" viewBox="0 0 20 24" width="20" height="24"><path d="M6 3h8M10 3v18M6 21h8"/></svg>
    <svg class="fc-move" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2v20M2 12h20M12 2l-3 3m3-3l3 3M12 22l-3-3m3 3l3-3M2 12l3-3m-3 3l3 3M22 12l-3-3m3 3l-3 3"/></svg>
    <svg class="fc-hand" viewBox="0 0 22 22" width="22" height="22"><rect x="3" y="3" width="16" height="16" rx="3"/><circle cx="11" cy="11" r="2.2"/></svg>`);
  /* 2 kursor di Hero dengan zona terpisah:
     - c1 (panitia ITO): merakit bingkai & teks judul (.marq + .ln + .hero-sub)
     - c2 (desainer UI): merakit komponen tombol CTA (.tray -> .cta-row) & gunungan 3D */
  bui.insertAdjacentHTML("beforeend", mkCursorHTML("desainer UI", "c-alt"));
  const [c1, c2] = $$(".fcursor").map(bindCursor);
  const fc = c1.el;
  const ft = $(".ft"), fr = $(".fr"), fbb = $(".fb-b"), fl = $(".fl"), gv = $$(".gv1,.gv2"), gh = $$(".gh1,.gh2"), lns = $$(".ln"), clips = $$(".clip"), layerLis = $$(".layers li");
  const term = $(".terminal"), title = $(".hero-title"), sub = $(".hero-sub"), cta = $(".cta-row"), tray = $(".tray");
  const marq = $(".marq"), dim = $(".dim"), gx = $(".gx"), gy = $(".gy"), hud = $(".hud"), tc = $(".tc"), state = $(".hud-state"), phw = $(".ph-wrap");
  /* posisi tanpa pengaruh transform (offset chain), relatif ke hero */
  const box = (el) => { let x = 0, y = 0, e = el; while (e && e !== H) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return { x, y, w: el.offsetWidth, h: el.offsetHeight, cx: x + el.offsetWidth / 2, cy: y + el.offsetHeight / 2 }; };
  let L = {};
  const measure = () => {
    const W = H.offsetWidth, Hh = H.offsetHeight, t = box(title), c = box(cta), tr = box(tray);
    const pad = W < 600 ? 6 : 12, mx = Math.max(8, t.x - pad), mw = Math.min(W - 16, t.w + pad * 2);
    const ax = tr.w ? tr.cx : W / 2, ay = tr.w ? tr.cy : Hh * .82;
    L = { W, H: Hh, t, m: { x: mx, y: t.y - pad, w: mw, h: t.h + pad * 2 }, c, ax, ay, term: box(term), sub: box(sub) };
    gy.style.top = c.cy + "px";
  };
  measure();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  const fn = (f) => () => f(L);
  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    onUpdate: () => { c1.flip(L.W); c2.flip(L.W); }
  });

  gsap.set(c1.el, { x: fn((l) => l.W * .04), y: fn((l) => l.H * .16), autoAlpha: 0 });
  gsap.set(c2.el, { x: fn((l) => l.term.x), y: fn((l) => l.term.cy), autoAlpha: 0 });
  gsap.set([...c1.allIcons, ...c2.allIcons, c1.ring, c2.ring], { autoAlpha: 0 });
  gsap.set([ft, fbb, ...gh], { scaleX: 0 });
  gsap.set([fr, fl, ...gv], { scaleY: 0 });
  gsap.set([".crop", hud, ".layers", marq, tray, gx, gy, ".hero-meta", ".hero-hint"].map((s) => typeof s === "string" ? H.querySelectorAll(s) : s), { autoAlpha: 0 });
  gsap.set(".crop", { scale: 0 });
  gsap.set(term, { autoAlpha: 0, scale: .75 });
  gsap.set([...lns, sub], { clipPath: "inset(0 100% 0 0)" });
  gsap.set(cta, { x: fn((l) => l.ax - l.c.cx), y: fn((l) => l.ay - l.c.cy), scale: .88, autoAlpha: 0 });
  drop.v = 0;

  c1.setTool(tl, "pen", 0);
  c2.setTool(tl, "ibeam", 0);
  tl.addLabel("grid", 0)
    .to(".build-hint", { autoAlpha: 0, duration: .12 }, 0)
    .to([hud, ".strip", c1.el, c2.el, ".layers"], { autoAlpha: 1, duration: .12 }, 0)
    .to(ft, { scaleX: 1, duration: .22, ease: "none" }, 0)
    .to(fr, { scaleY: 1, duration: .22, ease: "none" }, .05)
    .to(fbb, { scaleX: 1, duration: .22, ease: "none" }, .10)
    .to(fl, { scaleY: 1, duration: .22, ease: "none" }, .15)
    .to(gv, { scaleY: 1, duration: .25, stagger: .04, ease: "none" }, .06)
    .to(gh, { scaleX: 1, duration: .25, stagger: .04, ease: "none" }, .08)
    .to(H.querySelectorAll(".crop"), { scale: 1, autoAlpha: 1, stagger: .03, duration: .18 }, .04);

  /* Kursor 1 (panitia ITO — Pen -> Arrow): dari sudut bingkai ke kiri-atas judul, lalu tarik .marq presisi hingga sudut kanan-bawah judul */
  tl.addLabel("judul", .06);
  c1.setTool(tl, "arrow", .14);
  tl.fromTo(c1.el,
    { x: fn((l) => l.W * .04), y: fn((l) => l.H * .16) },
    { x: fn((l) => l.m.x), y: fn((l) => l.m.y), duration: .14, immediateRender: false }, .04)
    .fromTo(c1.el,
      { x: fn((l) => l.m.x), y: fn((l) => l.m.y) },
      { x: fn((l) => l.m.x + l.m.w), y: fn((l) => l.m.y + l.m.h), duration: .44, immediateRender: false }, .18)
    .fromTo(marq,
      { x: fn((l) => l.m.x), y: fn((l) => l.m.y), width: 0, height: 0, autoAlpha: 0 },
      {
        x: fn((l) => l.m.x), y: fn((l) => l.m.y), width: fn((l) => l.m.w), height: fn((l) => l.m.h), autoAlpha: 1, duration: .44, immediateRender: false,
        onUpdate() { dim.textContent = `${Math.round(gsap.getProperty(marq, "width"))} × ${Math.round(gsap.getProperty(marq, "height"))}`; }
      }, .18)
    .to(lns, { clipPath: "inset(0 0% 0 0)", stagger: .07, duration: .38 }, .18)
    .to(marq, { autoAlpha: 0, duration: .15 }, .68);
  c1.click(tl, .62);

  /* Kursor 2 (desainer UI — I-Beam -> Move): ketik .terminal (0.04..0.18), sapu .hero-sub (0.20..0.48), lalu tempatkan .cta-row (0.48..0.72) */
  tl.addLabel("teks", .12);
  tl.fromTo(c2.el,
    { x: fn((l) => l.term.x), y: fn((l) => l.term.cy) },
    { x: fn((l) => l.term.x + l.term.w), y: fn((l) => l.term.cy), duration: .14, immediateRender: false }, .04)
    .to(term, { autoAlpha: 1, scale: 1, duration: .22, ease: "back.out(1.7)" }, .06);
  c2.click(tl, .16);

  tl.fromTo(c2.el,
    { x: fn((l) => l.term.x + l.term.w), y: fn((l) => l.term.cy) },
    { x: fn((l) => l.sub.x), y: fn((l) => l.sub.cy), duration: .06, immediateRender: false }, .18)
    .fromTo(c2.el,
      { x: fn((l) => l.sub.x), y: fn((l) => l.sub.cy) },
      { x: fn((l) => Math.min(l.W * .93, l.sub.x + l.sub.w)), y: fn((l) => l.sub.y + l.sub.h), duration: .28, ease: "none", immediateRender: false }, .24)
    .to(sub, { clipPath: "inset(0 0% 0 0)", duration: .28, ease: "none" }, .24);

  tl.addLabel("aset", .30);
  c2.setTool(tl, "move", .52);
  tl.to(tray, { autoAlpha: 1, duration: .12 }, .28)
    .fromTo(c2.el,
      { x: fn((l) => Math.min(l.W * .93, l.sub.x + l.sub.w)), y: fn((l) => l.sub.y + l.sub.h) },
      { x: fn((l) => l.c.x + l.c.w), y: fn((l) => l.c.cy), duration: .22, immediateRender: false }, .52)
    .to(cta, { autoAlpha: 1, scale: 1, x: 0, y: 0, duration: .38 }, .34)
    .to([gx, gy], { autoAlpha: 1, duration: .12 }, .72)
    .to([gx, gy, tray], { autoAlpha: 0, duration: .16 }, .82);
  c2.click(tl, .74);

  tl.addLabel("gunungan", .28)
    .to(drop, { v: 1, duration: .55, ease: "back.out(1.4)" }, .28)
    .to([".hero-meta", ".hero-hint"].map((s) => $(s)), { autoAlpha: 1, stagger: .06, duration: .25 }, .58);

  /* 6 selesai: kedua kursor & chrome editor memudar bersih di t=0.92 */
  tl.addLabel("selesai", .92)
    .to([c1.el, c2.el, ...[".crop", ".layers", ".strip", ".hud", ".frame"].map((s) => H.querySelectorAll(s))], { autoAlpha: 0, duration: .20 }, .92)
    .addLabel("end");

  const names = ["grid", "judul", "teks", "aset", "gunungan", "selesai"];
  const dur = tl.duration(), starts = names.map((n) => tl.labels[n]), ends = [...starts.slice(1), dur];
  clips.forEach((c, i) => { c.style.left = (starts[i] / dur * 100) + "%"; c.style.width = `calc(${(ends[i] - starts[i]) / dur * 100}% - 3px)`; });
  let lastIdx = -1;
  const pad = (n) => String(n).padStart(2, "0");
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
    trigger: H, start: "top top", end: "+=190%", pin: true, scrub: .35, animation: tl,
    invalidateOnRefresh: true, onRefreshInit: measure,
    onUpdate: (self) => setHud(self.progress),
  });
}

/* story — pinned (mobile & desktop: tiap bab adalah 1 teks terpusat, sehingga CUKUP 1 KURSOR yang membangun tepat di tengah lalu memudar saat dibaca)
   DIDeklarasikan SEBELUM secConfigs agar pin-spacer #story sudah ada saat ScrollTrigger #timeline, .cta-final, .footer dihitung! */
if (!reduced) {
  document.documentElement.classList.add("story-pin");
  const stSec = document.getElementById("story");
  stSec.classList.add("sec-build");
  const sui = document.createElement("div");
  sui.className = "build-ui";
  sui.setAttribute("aria-hidden", "true");
  sui.innerHTML = `
    <div class="frame">
      <span class="fb ft"></span><span class="fb fr"></span><span class="fb fb-b"></span><span class="fb fl"></span>
      <span class="gl gv1"></span><span class="gl gv2"></span>
      <span class="gl gh1"></span><span class="gl gh2"></span>
    </div>
    <span class="crop c1"></span><span class="crop c2"></span><span class="crop c3"></span><span class="crop c4"></span>
    <p class="hud mono" data-txt="rec "><span class="rec"></span><span class="tc" data-txt="00:04:00:00"></span> <span class="hud-state" data-txt="bab 01 / pola"></span></p>
    <div class="marq"><span class="dim mono" data-txt=""></span></div>
    <span class="guide gx"></span><span class="guide gy"></span>
    <div class="strip"><span class="clip on"></span><span class="clip"></span><span class="clip"></span><span class="clip"></span><span class="ph-wrap"><span class="ph"></span></span></div>
    ${mkCursorHTML("panitia ITO", "")}`;
  stSec.prepend(sui);

  const sc1 = bindCursor(sui.querySelector(".fcursor"));
  const stc = sui.querySelector(".tc"), shudState = sui.querySelector(".hud-state"), sphw = sui.querySelector(".ph-wrap"), sclips = [...sui.querySelectorAll(".clip")];
  const sft = sui.querySelector(".ft"), sfr = sui.querySelector(".fr"), sfbb = sui.querySelector(".fb-b"), sfl = sui.querySelector(".fl");
  const sgv = [...sui.querySelectorAll(".gv1,.gv2")], sgh = [...sui.querySelectorAll(".gh1,.gh2")], scrops = [...sui.querySelectorAll(".crop")];
  const smarq = sui.querySelector(".marq"), sdim = sui.querySelector(".dim"), sgx = sui.querySelector(".gx"), sgy = sui.querySelector(".gy");
  const scEls = [".s1", ".s2", ".s3", ".s4"].map((s) => stSec.querySelector(s));
  const scH2s = scEls.map((el) => el.querySelector("h2"));

  let StL = { W: 1000, H: 800, b: [] };
  const stMeasure = () => {
    const W = stSec.offsetWidth, H = stSec.offsetHeight;
    const padX = W < 600 ? 10 : 16, padY = 10;
    const b = scH2s.map((h2) => {
      const x = Math.max(W * .05, h2.offsetLeft - padX);
      const y = Math.max(H * .18, h2.offsetTop - padY);
      const w = Math.min(W * .90 - x, Math.max(160, h2.offsetWidth + padX * 2));
      const h = Math.max(44, h2.offsetHeight + padY * 2);
      return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
    });
    StL = { W, H, b };
    if (b[0]) sgy.style.top = b[0].cy + "px";
  };
  stMeasure();

  gsap.set([sft, sfbb, ...sgh], { scaleX: 0 });
  gsap.set([sfr, sfl, ...sgv], { scaleY: 0 });
  gsap.set([scrops, sui.querySelector(".hud"), sui.querySelector(".strip"), sc1.el, smarq, sgx, sgy, ...sc1.allIcons, sc1.ring], { autoAlpha: 0 });
  gsap.set(sc1.el, { x: () => StL.W * .04, y: () => StL.H * .16 });
  gsap.set(scEls, { autoAlpha: 0, y: 0 });
  gsap.set(scH2s, { clipPath: "inset(0 100% 0 0)" });

  const pad2 = (n) => String(n).padStart(2, "0");
  const stNames = ["bab 01 / pola", "bab 02 / data", "bab 03 / karya", "bab 04 / ito 27"];
  const stTl = gsap.timeline({
    onUpdate: () => sc1.flip(StL.W),
    scrollTrigger: {
      trigger: "#story", start: "top top", end: "+=920%", pin: true, scrub: .8,
      invalidateOnRefresh: true, onRefreshInit: stMeasure,
      onUpdate: (self) => {
        scrollState.story = self.progress;
        const f = Math.round(self.progress * 16 * 25);
        stc.dataset.txt = `00:04:${pad2(Math.floor(f / 25))}:${pad2(f % 25)}`;
        sphw.style.setProperty("--p", self.progress);
        const bi = Math.min(3, Math.floor(self.progress * 4));
        shudState.dataset.txt = stNames[bi];
        sclips.forEach((c, i) => c.classList.toggle("on", i <= bi));
        sc1.flip(StL.W);
      }
    }
  });

  /* Bingkai & grid 3x3 digambar di awal #story oleh 1 kursor */
  sc1.setTool(stTl, "pen", 0);
  stTl.to([sui.querySelector(".hud"), sui.querySelector(".strip"), sc1.el], { autoAlpha: 1, duration: .25 }, 0)
    .to([sft, sfbb, ...sgh], { scaleX: 1, duration: .45, stagger: .05 }, 0)
    .to([sfr, sfl, ...sgv], { scaleY: 1, duration: .45, stagger: .05 }, 0)
    .to(scrops, { autoAlpha: 1, duration: .30, stagger: .04 }, .06);

  /* Setiap bab (.s1, .s2, .s3, .s4) dibangun oleh 1 kursor (sc1) tepat di batas h2 dari kiri-atas ke kanan-bawah tanpa overlap tween */
  const tools1 = ["arrow", "ibeam", "pen", "move"];
  scEls.forEach((el, i) => {
    const h2 = scH2s[i];
    const startAt = i === 0 ? 0.16 : "+=0.55";
    stTl.addLabel(`b${i}`, startAt);
    sc1.setTool(stTl, tools1[i], `b${i}`);
    stTl.set(sc1.el, { autoAlpha: 1 }, `b${i}`)
      .fromTo(sc1.el,
        { x: () => i === 0 ? StL.W * .04 : StL.b[i - 1].x + StL.b[i - 1].w, y: () => i === 0 ? StL.H * .16 : StL.b[i - 1].y + StL.b[i - 1].h },
        { x: () => StL.b[i].x, y: () => StL.b[i].y, duration: .22, immediateRender: false }, `b${i}`)
      .set(el, { autoAlpha: 1, y: 0, scale: 1 }, `b${i}+=0.20`)
      .fromTo(smarq,
        { x: () => StL.b[i].x, y: () => StL.b[i].y, width: 0, height: 0, autoAlpha: 0 },
        {
          x: () => StL.b[i].x, y: () => StL.b[i].y, width: () => StL.b[i].w, height: () => StL.b[i].h, autoAlpha: 1, duration: .72, immediateRender: false,
          onUpdate() { sdim.dataset.txt = `${Math.round(gsap.getProperty(smarq, "width"))} × ${Math.round(gsap.getProperty(smarq, "height"))}`; }
        }, `b${i}+=0.22`)
      .fromTo(sc1.el,
        { x: () => StL.b[i].x, y: () => StL.b[i].y },
        { x: () => StL.b[i].x + StL.b[i].w, y: () => StL.b[i].y + StL.b[i].h, duration: .72, immediateRender: false }, `b${i}+=0.22`)
      .fromTo(h2, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: .72, immediateRender: false }, `b${i}+=0.22`);
    sc1.click(stTl, `b${i}+=0.94`);
    stTl.to([sgx, sgy], { autoAlpha: 1, duration: .14 }, `b${i}+=0.94`)
      .to([sgx, sgy, smarq, sc1.el], { autoAlpha: 0, duration: .20 }, `b${i}+=1.16`)
      .to(el, { y: 0, duration: 1.9 }); /* selesai di-build pas di tengah: bersih tanpa kursor menutupi teks */
    if (i < 3) {
      stTl.to(el, { autoAlpha: 0, y: -36, duration: .80 });
    } else {
      stTl.to([sui.querySelector(".hud"), sui.querySelector(".strip"), ...scrops, sui.querySelector(".frame")], { autoAlpha: 0, duration: .45 });
    }
  });
}

/* build-on-scroll SELESAI PAS DI TENGAH LAYAR ("end: center 52%"):
   - Mulai dibangun saat section masuk dari bawah layar ("top 92%")
   - Tepat saat bagian tengah section mencapai tengah layar ("center 52%"), proses build mencapai 100% (selesai tepat di tengah, bukan di bawah atau di atas!)
   - Kotak .marq & lintasan kursor dihitung dari union bounding box seluruh elemen konten section (bukan 1 sub-elemen), dengan .fromTo deterministik agar ujung kursor selalu menempel presisi pada tepi/sudut elemen yang sedang dibangun. */
if (!reduced) {
  const pad2 = (n) => String(n).padStart(2, "0");
  const secConfigs = [
    { sel: "#stats", name: "statistik", boxEls: ".stat", items: ".stat", clip: ".stat .num, .stat .label", stats: true, cursors: [["panitia ITO", "", "arrow", "cross"]], start: "top 92%", end: "center 52%" },
    { sel: "#tentang", name: "tentang", boxEls: "h2, .about-body p", items: ".about-grid > *, .about-body p", clip: "h2, .about-body p", cursors: [["panitia ITO", "", "ibeam", "arrow"]], start: "top 92%", end: "center 52%" },
    { sel: "#lomba", name: "cabang lomba", boxEls: ".section-head h2, .card", boxElsMobile: ".section-head h2, .card:nth-child(-n+2)", items: ".section-head > *, .card", clip: ".section-head h2, .section-note, .card-idx, .card h3, .card p", cards: true, cursors: [["panitia ITO", "", "arrow", "move"], ["desainer UI", "c-alt", "pen", "cross"]], start: "top 92%", end: "center 52%" },
    { sel: "#timeline", name: "timeline", boxEls: ".tl-dot, .tl-list b, .tl-when, .tl-list p", items: "h2, .tl-dot, .tl-list li", clip: "h2, .tl-list b, .tl-when, .tl-list p", cursors: [["panitia ITO", "", "pen", "cross"]], start: "top 92%", end: "center 52%" },
    { sel: ".cta-final", name: "penutup", boxEls: "h2, p, .cta-row", items: "h2, p, .cta-row", clip: "h2, p", cursors: [["panitia ITO", "", "arrow", "move"]], start: "top 92%", end: "center 56%" },
    { sel: ".footer", name: "sekretariat", boxEls: ".foot-col, .foot-bottom", boxElsMobile: ".foot-col:nth-child(-n+2)", items: ".foot-col, .foot-bottom", clip: ".footer-brand, .foot-org, .foot-head", cursors: [["panitia ITO", "", "arrow", "hand"]], start: "top 95%", end: "bottom 99%" }
  ];

  secConfigs.forEach((cfg, sIdx) => {
    const sec = document.querySelector(cfg.sel);
    if (!sec) return;
    sec.classList.add("sec-build");

    const ui = document.createElement("div");
    ui.className = "build-ui";
    ui.setAttribute("aria-hidden", "true");
    ui.innerHTML = `
      <div class="frame">
        <span class="fb ft"></span><span class="fb fr"></span><span class="fb fb-b"></span><span class="fb fl"></span>
        <span class="gl gv1"></span><span class="gl gv2"></span>
        <span class="gl gh1"></span><span class="gl gh2"></span>
      </div>
      <span class="crop c1"></span><span class="crop c2"></span><span class="crop c3"></span><span class="crop c4"></span>
      <p class="hud mono" data-txt="rec "><span class="rec"></span><span class="tc" data-txt="00:0${sIdx + 1}:00:00"></span> <span class="hud-state" data-txt="${cfg.name}"></span></p>
      <div class="marq"><span class="dim mono" data-txt=""></span></div>
      <span class="guide gx"></span><span class="guide gy"></span>
      <div class="strip"><span class="clip on"></span><span class="clip on"></span><span class="clip on"></span><span class="ph-wrap"><span class="ph"></span></span></div>
      ${cfg.cursors.map(([tag, cls]) => mkCursorHTML(tag, cls)).join("")}`;
    sec.prepend(ui);

    if (cfg.cards) {
      sec.querySelectorAll(".card").forEach((c) => {
        const cm = document.createElement("span");
        cm.className = "card-marq";
        cm.setAttribute("aria-hidden", "true");
        c.appendChild(cm);
      });
    }

    const $ = (s) => ui.querySelector(s), $$ = (s) => [...ui.querySelectorAll(s)];
    const cs = $$(".fcursor").map(bindCursor);
    const ft = $(".ft"), fr = $(".fr"), fbb = $(".fb-b"), fl = $(".fl"), gv = $$(".gv1,.gv2"), gh = $$(".gh1,.gh2"), crops = $$(".crop");
    const marq = $(".marq"), dim = $(".dim"), gx = $(".gx"), gy = $(".gy"), hud = $(".hud"), tc = $(".tc"), strip = $(".strip"), phw = $(".ph-wrap");
    const items = [...sec.querySelectorAll(cfg.items)], clips = [...sec.querySelectorAll(cfg.clip)], cardMarqs = [...sec.querySelectorAll(".card-marq")];
    const statNums = cfg.stats ? [...sec.querySelectorAll(".num")] : [];
    const cardEls = cfg.cards ? [...sec.querySelectorAll(".card")] : [];

    const sbox = (el) => {
      let x = 0, y = 0, e = el;
      while (e && e !== sec) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight, r: x + el.offsetWidth, b: y + el.offsetHeight, cx: x + el.offsetWidth / 2, cy: y + el.offsetHeight / 2 };
    };
    let SL = {};
    const smeasure = () => {
      const W = sec.offsetWidth, H = sec.offsetHeight;
      const sel = (W < 760 && cfg.boxElsMobile) ? cfg.boxElsMobile : cfg.boxEls;
      const bEls = [...sec.querySelectorAll(sel)].filter((el) => el.offsetWidth > 0 && el.offsetHeight > 0);
      const boxes = (bEls.length ? bEls : items).map(sbox);
      let minX = Math.min(...boxes.map((b) => b.x));
      let minY = Math.min(...boxes.map((b) => b.y));
      let maxR = Math.max(...boxes.map((b) => b.r));
      let maxB = Math.max(...boxes.map((b) => b.b));
      if (cfg.sel === "#timeline") {
        const h2El = sec.querySelector("h2");
        if (h2El) minY = Math.min(minY, sbox(h2El).y);
      }
      const mx = Math.max(W * .03, minX - 8), my = Math.max(H * .09, minY - 8);
      const mr = Math.min(W * .95, maxR + 8), mb = Math.min(H * .89, maxB + 8);
      const mw = Math.max(80, mr - mx), mh = Math.max(40, mb - my);

      /* Koordinat Kursor 2 khusus #lomba: menempel pada sudut kartu nyata (Card 02 pada mobile, Card 01->03 pada desktop) */
      let p2Start = { x: W * .5, y: H * .3 }, p2End = { x: W * .7, y: H * .6 };
      if (cardEls.length >= 2) {
        if (W < 760) {
          const cb = sbox(cardEls[1]);
          p2Start = { x: cb.x, y: cb.y };
          p2End = { x: Math.min(W * .94, cb.r), y: Math.min(H * .88, cb.b) };
        } else {
          const cA = sbox(cardEls[0]), cB = sbox(cardEls[2] || cardEls[1]);
          p2Start = { x: cA.x, y: cA.y };
          p2End = { x: cB.r, y: cB.b };
        }
      }
      SL = {
        W, H,
        m: { x: mx, y: my, w: mw, h: mh, cx: mx + mw / 2, cy: my + mh / 2 },
        p2Start, p2End
      };
      gy.style.top = SL.m.cy + "px";
    };
    smeasure();
    const sfn = (f) => () => f(SL);

    const stl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onUpdate: () => cs.forEach((c) => c.flip(SL.W))
    });

    /* Sembunyikan seluruh isi & nomor SEBELUM animasi build dimulai */
    gsap.set(cs[0].el, { x: sfn((l) => l.W * .03), y: sfn((l) => l.H * .09), autoAlpha: 0 });
    if (cs[1]) gsap.set(cs[1].el, { x: sfn((l) => l.p2Start.x), y: sfn((l) => l.p2Start.y), autoAlpha: 0 });
    cs.forEach((c) => gsap.set([...c.allIcons, c.ring], { autoAlpha: 0 }));
    gsap.set([ft, fbb, ...gh], { scaleX: 0 });
    gsap.set([fr, fl, ...gv], { scaleY: 0 });
    gsap.set([crops, hud, strip, marq, gx, gy], { autoAlpha: 0 });
    gsap.set(crops, { scale: 0 });
    gsap.set(items, { y: 24, scale: .94, autoAlpha: 0 });
    gsap.set(clips, { clipPath: "inset(0 100% 0 0)" });
    if (cardMarqs.length) gsap.set(cardMarqs, { autoAlpha: 0, scale: .96 });

    /* Seluruh bagian section dibangun dengan kecepatan terukur di TENGAH LAYAR oleh kursor di section (t=0.00..0.86) */
    cs.forEach((c, idx) => c.setTool(stl, cfg.cursors[idx][2], 0));
    stl.to([hud, strip, ...cs.map((c) => c.el)], { autoAlpha: 1, duration: .12 }, 0)
      .to(ft, { scaleX: 1, duration: .24, ease: "none" }, 0)
      .to(fr, { scaleY: 1, duration: .24, ease: "none" }, .04)
      .to(fbb, { scaleX: 1, duration: .24, ease: "none" }, .08)
      .to(fl, { scaleY: 1, duration: .24, ease: "none" }, .12)
      .to(gv, { scaleY: 1, duration: .26, stagger: .04, ease: "none" }, .05)
      .to(gh, { scaleX: 1, duration: .26, stagger: .04, ease: "none" }, .07)
      .to(crops, { scale: 1, autoAlpha: 1, stagger: .03, duration: .18 }, .04);

    /* Kursor 1: dari sudut bingkai ke kiri-atas .marq (0.04..0.18), lalu tarik .marq presisi hingga sudut kanan-bawah .marq (0.18..0.74) */
    stl.fromTo(cs[0].el,
      { x: sfn((l) => l.W * .03), y: sfn((l) => l.H * .09) },
      { x: sfn((l) => l.m.x), y: sfn((l) => l.m.y), duration: .14, immediateRender: false }, .04)
      .fromTo(cs[0].el,
        { x: sfn((l) => l.m.x), y: sfn((l) => l.m.y) },
        { x: sfn((l) => l.m.x + l.m.w), y: sfn((l) => l.m.y + l.m.h), duration: .56, immediateRender: false }, .18)
      .fromTo(marq,
        { x: sfn((l) => l.m.x), y: sfn((l) => l.m.y), width: 0, height: 0, autoAlpha: 0 },
        {
          x: sfn((l) => l.m.x), y: sfn((l) => l.m.y), width: sfn((l) => l.m.w), height: sfn((l) => l.m.h), autoAlpha: 1, duration: .56, immediateRender: false,
          onUpdate() { dim.dataset.txt = `${Math.round(gsap.getProperty(marq, "width"))} × ${Math.round(gsap.getProperty(marq, "height"))}`; }
        }, .18);
    cs[0].click(stl, .18);

    /* Kursor 2 (khusus #lomba): bergerak dari sudut kiri-atas kartu menuju sudut kanan-bawah kartu secara presisi */
    if (cs[1]) {
      cs[1].click(stl, .18);
      stl.fromTo(cs[1].el,
        { x: sfn((l) => l.p2Start.x), y: sfn((l) => l.p2Start.y) },
        { x: sfn((l) => l.p2End.x), y: sfn((l) => l.p2End.y), duration: .56, immediateRender: false }, .18);
      cs[1].setTool(stl, cfg.cursors[1][3], .62);
      cs[1].click(stl, .74);
    }

    stl.to(items,
      { y: 0, scale: 1, autoAlpha: 1, duration: .56, stagger: { amount: .16 } },
      .14)
      .to(clips,
        { clipPath: "inset(0 0% 0 0)", duration: .56, stagger: { amount: .16 } },
        .16);

    if (cardMarqs.length) {
      stl.fromTo(cardMarqs, { autoAlpha: 1, scale: .96 }, { autoAlpha: 0, scale: 1, duration: .54, stagger: { amount: .14 }, immediateRender: false }, .18);
    }

    cs[0].setTool(stl, cfg.cursors[0][3], .72);
    stl.to([gx, gy], { autoAlpha: 1, duration: .12 }, .74)
      .to([gx, gy, marq], { autoAlpha: 0, duration: .12 }, .86);
    cs[0].click(stl, .78);

    /* Selesai di-build PAS DI TENGAH LAYAR (end: "center 52%", t=0.88..1.00): seluruh kursor & chrome editor memudar tepat saat section mencapai tengah layar */
    stl.to([...cs.map((c) => c.el), hud, strip, ...crops, $(".frame")], { autoAlpha: 0, duration: .12 }, .88);

    ScrollTrigger.create({
      trigger: sec, start: cfg.start, end: cfg.end, scrub: .3, animation: stl,
      invalidateOnRefresh: true, onRefreshInit: smeasure,
      onUpdate: (self) => {
        const p = self.progress, f = Math.round(p * 4 * 25);
        tc.dataset.txt = `00:0${sIdx + 1}:${pad2(Math.floor(f / 25))}:${pad2(f % 25)}`;
        phw.style.setProperty("--p", p);
        cs.forEach((c) => c.flip(SL.W));
        if (statNums.length) {
          const cp = Math.max(0, Math.min(1, (p - .14) / .68));
          const ease = 1 - Math.pow(1 - cp, 3);
          statNums.forEach((n) => { n.textContent = Math.round(+n.dataset.target * ease); });
        }
      }
    });
  });
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
