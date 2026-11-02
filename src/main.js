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

/* counter: cepat & serentak saat section stats dibangun */
const cio = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  cio.unobserve(e.target);
  const el = e.target, target = +el.dataset.target, t0 = performance.now();
  el.style.minWidth = el.dataset.target.length + "ch";
  (function tick(t) {
    const p = Math.min((t - t0) / 650, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}), { threshold: 0.25 });
document.querySelectorAll(".num").forEach((n) => cio.observe(n));

/* hero build: seluruh bagian hero dibangun CEPAT & BERBARENGAN saat di-scroll (desktop & mobile) */
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
    const ax = tr.w ? tr.cx : W / 2, ay = tr.w ? tr.cy : Hh * .82;
    L = { W, H: Hh, t, m: { x: mx, y: t.y - pad, w: mw, h: t.h + pad * 2 }, c, ax, ay, term: box(term), sub: box(sub) };
    gy.style.top = c.cy + "px";
  };
  measure();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  const fn = (f) => () => f(L);
  const cur = (on) => [[arrow, on === "arrow"], [cross, on === "cross"], [pen, on === "pen"]].map(([el, v]) => ({ el, v }));
  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    onUpdate: () => fc.classList.toggle("flip", +gsap.getProperty(fc, "x") > L.W * .96 - 115)
  });
  const tool = (on, at) => { const p = at ?? ">"; cur(on).forEach(({ el, v }) => tl.set(el, { autoAlpha: v ? 1 : 0 }, p)); };
  const click = (at) => tl.fromTo(ring, { scale: .3, autoAlpha: 1 }, { scale: 1.7, autoAlpha: 0, duration: .22, ease: "power1.out" }, at ?? ">");

  gsap.set(fc, { x: fn((l) => l.W * .04), y: fn((l) => l.H * .16), autoAlpha: 0 });
  gsap.set([arrow, cross, ring], { autoAlpha: 0 });
  gsap.set([ft, fbb, ...gh], { scaleX: 0 });
  gsap.set([fr, fl, ...gv], { scaleY: 0 });
  gsap.set([".crop", hud, ".layers", marq, tray, gx, gy, ".hero-meta", ".hero-hint"].map((s) => typeof s === "string" ? H.querySelectorAll(s) : s), { autoAlpha: 0 });
  gsap.set(".crop", { scale: 0 });
  gsap.set(term, { autoAlpha: 0, scale: .75 });
  gsap.set([...lns, sub], { clipPath: "inset(0 100% 0 0)" });
  gsap.set(cta, { x: fn((l) => l.ax - l.c.cx), y: fn((l) => l.ay - l.c.cy), scale: .88, autoAlpha: 0 });
  drop.v = 0;

  /* 1–5 dibangun CEPAT & SERENTAK (overlapping): bingkai + grid + judul + terminal/sub + CTA + 3D gunungan muncul berbarengan */
  tl.addLabel("grid", 0)
    .to(".build-hint", { autoAlpha: 0, duration: .12 }, 0)
    .to([hud, ".strip", fc, ".layers"], { autoAlpha: 1, duration: .12 }, 0)
    .to(ft, { scaleX: 1, duration: .22, ease: "none" }, 0)
    .to(fr, { scaleY: 1, duration: .22, ease: "none" }, .05)
    .to(fbb, { scaleX: 1, duration: .22, ease: "none" }, .10)
    .to(fl, { scaleY: 1, duration: .22, ease: "none" }, .15)
    .to(gv, { scaleY: 1, duration: .25, stagger: .04, ease: "none" }, .06)
    .to(gh, { scaleX: 1, duration: .25, stagger: .04, ease: "none" }, .08)
    .to(H.querySelectorAll(".crop"), { scale: 1, autoAlpha: 1, stagger: .03, duration: .18 }, .04);

  /* 2 judul: jalan berbarengan mulai t=0.08 */
  tl.addLabel("judul", .08);
  tool("arrow", .08);
  tl.to(fc, { x: fn((l) => l.m.x), y: fn((l) => l.m.y), duration: .14 }, .08)
    .to(fc, { x: fn((l) => l.m.x + l.m.w), y: fn((l) => l.m.y + l.m.h), duration: .28 }, .22)
    .fromTo(marq,
      { x: fn((l) => l.m.x), y: fn((l) => l.m.y), width: 0, height: 0, autoAlpha: 0 },
      {
        x: fn((l) => l.m.x), y: fn((l) => l.m.y), width: fn((l) => l.m.w), height: fn((l) => l.m.h), autoAlpha: 1, duration: .28, immediateRender: false,
        onUpdate() { dim.textContent = `${Math.round(gsap.getProperty(marq, "width"))} × ${Math.round(gsap.getProperty(marq, "height"))}`; }
      }, .22)
    .to(lns, { clipPath: "inset(0 0% 0 0)", stagger: .06, duration: .32 }, .20)
    .to(marq, { autoAlpha: 0, duration: .15 }, .52);

  /* 3 teks: terminal & subjudul muncul berbarengan mulai t=0.16 */
  tl.addLabel("teks", .16)
    .to(term, { autoAlpha: 1, scale: 1, duration: .28, ease: "back.out(1.7)" }, .16)
    .to(sub, { clipPath: "inset(0 0% 0 0)", duration: .34, ease: "none" }, .24);
  tool("pen", .50);
  tl.to(fc, { x: fn((l) => l.sub.x + l.sub.w), y: fn((l) => l.sub.y + l.sub.h), duration: .20 }, .50);

  /* 4 aset: tombol CTA & snap guide meluncur berbarengan mulai t=0.26 */
  tl.addLabel("aset", .26)
    .to(tray, { autoAlpha: 1, duration: .14 }, .26)
    .to(cta, { autoAlpha: 1, scale: 1, x: 0, y: 0, duration: .38 }, .30)
    .to([gx, gy], { autoAlpha: 1, duration: .12 }, .58)
    .to([gx, gy, tray], { autoAlpha: 0, duration: .16 }, .72);

  /* 5 gunungan: jatuh berbarengan mulai t=0.32 & klik kursor di sel kanan-atas */
  tl.addLabel("gunungan", .32);
  tool("cross", .70);
  tl.to(fc, { x: fn((l) => l.W * (l.W < 600 ? .68 : .76)), y: fn((l) => l.H * .28), duration: .22 }, .70);
  click(.88);
  tl.to(drop, { v: 1, duration: .55, ease: "back.out(1.4)" }, .32)
    .to([".hero-meta", ".hero-hint"].map((s) => $(s)), { autoAlpha: 1, stagger: .06, duration: .25 }, .55);

  /* 6 selesai: kursor & chrome editor memudar bersih di t=0.95 */
  tl.addLabel("selesai", .95)
    .to([fc, ...[".crop", ".layers", ".strip", ".hud", ".frame"].map((s) => H.querySelectorAll(s))], { autoAlpha: 0, duration: .22 }, .95)
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
    trigger: H, start: "top top", end: "+=160%", pin: true, scrub: .25, animation: tl,
    invalidateOnRefresh: true, onRefreshInit: measure,
    onUpdate: (self) => setHud(self.progress),
  });
}

/* build-on-scroll CEPAT & SERENTAK untuk SELURUH bagian lain (#stats, #tentang, #lomba, #story, #timeline, .cta-final, .footer)
   Setiap section mendapatkan kanvas editor lengkap: 4 sisi bingkai (.ft,.fr,.fb-b,.fl), grid 3×3 (.gv,.gh), crop marks,
   HUD rec + timecode, timeline strip (.strip), kotak seleksi oranye (.marq + dimensi w×h), snap guides (.gx,.gy),
   serta kursor kolaborator 'panitia ITO' (arrow/pen/cross + ring klik) yang merakit seluruh elemen section secara serentak! */
if (!reduced) {
  const pad2 = (n) => String(n).padStart(2, "0");
  const secConfigs = [
    { sel: "#stats", name: "statistik", target: ".stat", items: ".stat", clip: ".stat .label, .stat .num", start: "top 86%", end: "top 20%" },
    { sel: "#tentang", name: "tentang", target: ".about-grid", items: ".about-grid > *, .about-body p", clip: "h2, .about-body p", start: "top 84%", end: "top 16%" },
    { sel: "#lomba", name: "cabang lomba", target: ".cards", items: ".section-head > *, .card", clip: ".section-head h2, .section-note, .card h3, .card p", cards: true, start: "top 84%", end: "top 12%" },
    { sel: "#timeline", name: "timeline", target: ".tl-list", items: "h2, .tl-dot, .tl-list li", clip: "h2, .tl-list b, .tl-list p", start: "top 84%", end: "top 16%" },
    { sel: ".cta-final", name: "penutup", target: "h2", items: "h2, p, .cta-row", clip: "h2, p", start: "top 88%", end: "top 28%" },
    { sel: ".footer", name: "sekretariat", target: ".foot-grid", items: ".foot-col, .foot-bottom", clip: ".footer-brand, .foot-org, .foot-head", start: "top 94%", end: "bottom bottom" }
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
      <div class="fcursor">
        <svg class="fc-arrow" viewBox="0 0 16 22" width="18" height="24"><path d="M1 1v17l4.5-4 3 7 2.6-1.1-3-6.8H14z"/></svg>
        <svg class="fc-cross" viewBox="0 0 32 32" width="32" height="32"><circle cx="16" cy="16" r="6"/><path d="M16 0v10M16 22v10M0 16h10M22 16h10"/></svg>
        <svg class="fc-pen" viewBox="0 0 24 24" width="24" height="24"><path d="M2 22l3-9 9-9 6 6-9 9z M2 22l6.5-6.5"/><circle cx="10" cy="14" r="1.4"/></svg>
        <span class="fc-ring"></span><span class="fc-tag mono" data-txt="panitia ITO"></span>
      </div>`;
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
    const fc = $(".fcursor"), arrow = $(".fc-arrow"), cross = $(".fc-cross"), pen = $(".fc-pen"), ring = $(".fc-ring");
    const ft = $(".ft"), fr = $(".fr"), fbb = $(".fb-b"), fl = $(".fl"), gv = $$(".gv1,.gv2"), gh = $$(".gh1,.gh2"), crops = $$(".crop");
    const marq = $(".marq"), dim = $(".dim"), gx = $(".gx"), gy = $(".gy"), hud = $(".hud"), tc = $(".tc"), strip = $(".strip"), phw = $(".ph-wrap");
    const items = [...sec.querySelectorAll(cfg.items)], clips = [...sec.querySelectorAll(cfg.clip)], cardMarqs = [...sec.querySelectorAll(".card-marq")];
    const targetEl = sec.querySelector(cfg.target) || items[0] || sec;

    const sbox = (el) => {
      let x = 0, y = 0, e = el;
      while (e && e !== sec) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight, cx: x + el.offsetWidth / 2, cy: y + el.offsetHeight / 2 };
    };
    let SL = {};
    const smeasure = () => {
      const W = sec.offsetWidth, H = sec.offsetHeight, tb = sbox(targetEl);
      const mx = Math.max(W * .04, tb.x - 8), my = Math.max(H * .11, tb.y - 8);
      const mw = Math.min(W * .92 - mx, tb.w + 16), mh = Math.min(H * .86 - my, tb.h + 16);
      SL = { W, H, m: { x: mx, y: my, w: Math.max(80, mw), h: Math.max(40, mh), cx: mx + mw / 2, cy: my + mh / 2 } };
      gy.style.top = SL.m.cy + "px";
    };
    smeasure();
    const sfn = (f) => () => f(SL);
    const scur = (on) => [[arrow, on === "arrow"], [cross, on === "cross"], [pen, on === "pen"]].map(([el, v]) => ({ el, v }));

    const stl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onUpdate: () => fc.classList.toggle("flip", +gsap.getProperty(fc, "x") > SL.W * .97 - 115)
    });
    const stool = (on, at) => scur(on).forEach(({ el, v }) => stl.set(el, { autoAlpha: v ? 1 : 0 }, at));
    const sclick = (at) => stl.fromTo(ring, { scale: .3, autoAlpha: 1 }, { scale: 1.7, autoAlpha: 0, duration: .2, ease: "power1.out" }, at);

    gsap.set(fc, { x: sfn((l) => l.W * .04), y: sfn((l) => l.H * .12), autoAlpha: 0 });
    gsap.set([arrow, cross, ring], { autoAlpha: 0 });
    gsap.set([ft, fbb, ...gh], { scaleX: 0 });
    gsap.set([fr, fl, ...gv], { scaleY: 0 });
    gsap.set([crops, hud, strip, marq, gx, gy], { autoAlpha: 0 });
    gsap.set(crops, { scale: 0 });

    /* Seluruh bagian section dibangun CEPAT & BERBARENGAN (t=0.00..0.75), lalu chrome memudar di t=0.78..1.00 */
    stl.to([hud, strip, fc], { autoAlpha: 1, duration: .12 }, 0)
      .to(ft, { scaleX: 1, duration: .22, ease: "none" }, 0)
      .to(fr, { scaleY: 1, duration: .22, ease: "none" }, .04)
      .to(fbb, { scaleX: 1, duration: .22, ease: "none" }, .08)
      .to(fl, { scaleY: 1, duration: .22, ease: "none" }, .12)
      .to(gv, { scaleY: 1, duration: .24, stagger: .04, ease: "none" }, .05)
      .to(gh, { scaleX: 1, duration: .24, stagger: .04, ease: "none" }, .07)
      .to(crops, { scale: 1, autoAlpha: 1, stagger: .03, duration: .16 }, .04);

    stool("arrow", .06);
    stl.to(fc, { x: sfn((l) => l.m.x), y: sfn((l) => l.m.y), duration: .14 }, .06)
      .to(fc, { x: sfn((l) => Math.min(l.W * .95, l.m.x + l.m.w)), y: sfn((l) => Math.min(l.H * .86, l.m.y + l.m.h)), duration: .32 }, .20)
      .fromTo(marq,
        { x: sfn((l) => l.m.x), y: sfn((l) => l.m.y), width: 0, height: 0, autoAlpha: 0 },
        {
          x: sfn((l) => l.m.x), y: sfn((l) => l.m.y), width: sfn((l) => l.m.w), height: sfn((l) => l.m.h), autoAlpha: 1, duration: .32, immediateRender: false,
          onUpdate() { dim.dataset.txt = `${Math.round(gsap.getProperty(marq, "width"))} × ${Math.round(gsap.getProperty(marq, "height"))}`; }
        }, .20);
    sclick(.22);

    stl.fromTo(items,
      { y: 28, scale: .92, autoAlpha: 0 },
      { y: 0, scale: 1, autoAlpha: 1, duration: .42, stagger: .04, immediateRender: false },
      .12)
      .fromTo(clips,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: .44, stagger: .04, immediateRender: false },
        .14);

    if (cardMarqs.length) {
      stl.fromTo(cardMarqs, { autoAlpha: 1, scale: .96 }, { autoAlpha: 0, scale: 1, duration: .45, stagger: .05 }, .18);
    }

    stool("cross", .52);
    stl.to(fc, { x: sfn((l) => l.m.cx), y: sfn((l) => l.m.cy), duration: .20 }, .52)
      .to([gx, gy], { autoAlpha: 1, duration: .12 }, .54)
      .to([gx, gy, marq], { autoAlpha: 0, duration: .16 }, .68);
    sclick(.62);

    /* Selesai: seluruh chrome editor memudar bersih di dalam bingkai */
    stl.to([fc, hud, strip, ...crops, $(".frame")], { autoAlpha: 0, duration: .22 }, .78);

    ScrollTrigger.create({
      trigger: sec, start: cfg.start, end: cfg.end, scrub: .25, animation: stl,
      invalidateOnRefresh: true, onRefreshInit: smeasure,
      onUpdate: (self) => {
        const p = self.progress, f = Math.round(p * 4 * 25);
        tc.dataset.txt = `00:0${sIdx + 1}:${pad2(Math.floor(f / 25))}:${pad2(f % 25)}`;
        phw.style.setProperty("--p", p);
      }
    });
  });
}

/* story — pinned (mobile & desktop: tiap bab dibangun dengan kanvas editor + jeda kosong & tahanan baca panjang) */
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
    <p class="hud mono" data-txt="rec "><span class="rec"></span><span class="tc" data-txt="00:04:00:00"></span> <span class="hud-state" data-txt="narasi 3d"></span></p>
    <div class="strip"><span class="clip on"></span><span class="clip on"></span><span class="clip on"></span><span class="clip on"></span><span class="ph-wrap"><span class="ph"></span></span></div>
    <div class="fcursor">
      <svg class="fc-cross" viewBox="0 0 32 32" width="32" height="32"><circle cx="16" cy="16" r="6"/><path d="M16 0v10M16 22v10M0 16h10M22 16h10"/></svg>
      <span class="fc-ring"></span><span class="fc-tag mono" data-txt="panitia ITO"></span>
    </div>`;
  stSec.prepend(sui);
  const sfc = sui.querySelector(".fcursor"), stc = sui.querySelector(".tc"), sphw = sui.querySelector(".ph-wrap");
  const sft = sui.querySelector(".ft"), sfr = sui.querySelector(".fr"), sfbb = sui.querySelector(".fb-b"), sfl = sui.querySelector(".fl");
  const sgv = [...sui.querySelectorAll(".gv1,.gv2")], sgh = [...sui.querySelectorAll(".gh1,.gh2")], scrops = [...sui.querySelectorAll(".crop")];
  gsap.set([sft, sfbb, ...sgh], { scaleX: 0 });
  gsap.set([sfr, sfl, ...sgv], { scaleY: 0 });
  gsap.set([scrops, sui.querySelector(".hud"), sui.querySelector(".strip"), sfc], { autoAlpha: 0 });
  gsap.set(sfc, { x: () => stSec.offsetWidth * .18, y: () => stSec.offsetHeight * .26 });

  const pad2 = (n) => String(n).padStart(2, "0");
  gsap.timeline({
    scrollTrigger: {
      trigger: "#story", start: "top top", end: "+=900%", pin: true, scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        scrollN = self.progress;
        const f = Math.round(self.progress * 8 * 25);
        stc.dataset.txt = `00:04:${pad2(Math.floor(f / 25))}:${pad2(f % 25)}`;
        sphw.style.setProperty("--p", self.progress);
        sfc.classList.toggle("flip", +gsap.getProperty(sfc, "x") > stSec.offsetWidth * .96 - 115);
      }
    }
  })
    .to([sui.querySelector(".hud"), sui.querySelector(".strip"), sfc], { autoAlpha: 1, duration: .4 }, 0)
    .to([sft, sfbb, ...sgh], { scaleX: 1, duration: .6, stagger: .05 }, 0)
    .to([sfr, sfl, ...sgv], { scaleY: 1, duration: .6, stagger: .05 }, 0)
    .to(scrops, { autoAlpha: 1, duration: .4, stagger: .05 }, .1)
    .from(".s1", { autoAlpha: 0, y: 60, duration: 1 }, 0)
    .to(".s1", { y: 0, duration: 2.2 })
    .to(".s1", { autoAlpha: 0, yPercent: -45, duration: 1 })
    .to(sfc, { x: () => stSec.offsetWidth * .72, y: () => stSec.offsetHeight * .30, duration: .8 }, "<")
    .fromTo(".s2", { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1 }, "+=0.6")
    .to(".s2", { y: 0, duration: 2.2 })
    .to(".s2", { autoAlpha: 0, yPercent: -45, duration: 1 })
    .to(sfc, { x: () => stSec.offsetWidth * .24, y: () => stSec.offsetHeight * .68, duration: .8 }, "<")
    .fromTo(".s3", { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1 }, "+=0.6")
    .to(".s3", { y: 0, duration: 2.2 })
    .to(".s3", { autoAlpha: 0, yPercent: -45, duration: 1 })
    .to(sfc, { x: () => stSec.offsetWidth * .50, y: () => stSec.offsetHeight * .25, duration: .8 }, "<")
    .fromTo(".s4", { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 1 }, "+=0.6")
    .to(".s4", { scale: 1, duration: 1.8 })
    .to([sfc, sui.querySelector(".hud"), sui.querySelector(".strip"), ...scrops, sui.querySelector(".frame")], { autoAlpha: 0, duration: .6 });
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
