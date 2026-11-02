# ITO 2027 — Information Technology Olympiad XXVII

Landing page resmi **Information Technology Olympiad (ITO) XXVII** — **SMK Telekomunikasi Darul Ulum Jombang (SKATELDU)** (*Berhardware Teknologi, Bersoftware Religi*).

## Fitur Utama

1. **Wayang Digital / Gunungan Voxel 3D (`Three.js InstancedMesh`)**
   - Gunungan voxel interaktif yang berjalan mulus di `gsap.ticker` sepanjang halaman.
   - Mendukung *drag-to-rotate* dengan inersia, *hover repel & glow* via raycasting, *click ripple* gelombang radial, serta transisi morfologi (*pola → data → karya → ITO 27*) mengikuti posisi scroll.
2. **Full-Page Build-on-Scroll Editor UI (`GSAP ScrollTrigger` + `Lenis`)**
   - Seluruh **8 bagian halaman** (`#hero`, `#stats`, `#tentang`, `#lomba`, `#story`, `#timeline`, `.cta-final`, `.footer`) dirakit secara langsung saat di-scroll di dalam kanvas video/design editor (`.build-ui`: 4 sisi bingkai `.frame`, grid 3×3, *crop marks*, HUD `REC` + *timecode*, *timeline strip*, kotak seleksi `.marq` dengan dimensi `w × h` *real-time*, serta *snap guides* `.gx/.gy`).
   - Dikalibrasi dengan `start: "top 92%", end: "center 52%"` sehingga proses perakitan **selesai tepat 100% saat bagian berada di tengah layar**, diikuti pemudaran *chrome* editor agar konten bersih saat dibaca.
3. **Kursor Kolaborator Bergaya Adobe / Figma Suite**
   - 6 ikon alat vektor (`.fc-arrow` Selection, `.fc-pen` Bezier Pen, `.fc-ibeam` Type `T`, `.fc-move` 4-Way Move, `.fc-hand` Grab Handle, `.fc-cross` Precision Crosshair) dengan *badge* kolaborator yang otomatis berbalik (*flip*) di tepi kanan layar.
   - Bagian teks terpusat (`#story` `.s1`–`.s4`, `#stats`, `#tentang`, `#timeline`, `.cta-final`, `.footer`) menggunakan **1 kursor** (`panitia ITO`) dengan lintasan `.fromTo` deterministik pada *union bounding box* elemen (`0px` selisih terhadap sudut `.marq`).
   - Bagian multi-komponen paralel (`#hero` dan `#lomba` 4 kartu) menggunakan **2 kursor** (`panitia ITO` & `desainer UI`) pada zona terpisah tanpa saling menumpuk.
4. **Pinned Story 4 Bab (`#story`)**
   - 4 bab naratif terpusat di tengah bingkai yang dirakit satu per satu beserta tahanan baca dan transisi gunungan 3D di mobile maupun desktop.
5. **Responsif & Terverifikasi Hallmark V2 (`0 FAIL`)**
   - Simetris dan bebas *overflow* di resolusi mobile (`360×800`, `412×915`, `440×956`) serta desktop (`1280×800`, `1440×900`, `1920×1080`).

## Struktur Proyek

```text
├── index.html          # Markup semantik 8 bagian & kanvas editor #hero
├── public/
│   └── robots.txt      # Konfigurasi crawler
├── src/
│   ├── main.js         # Lenis, GSAP ScrollTrigger (8 section build), & Three.js Gunungan Voxel
│   └── style.css       # Design tokens, layout responsif, & styling .build-ui / .fcursor
├── package.json        # Dependensi (three, gsap, lenis, vite)
└── vite.config.js      # Konfigurasi bundler Vite
```

## Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

## Build Produksi

```bash
npm run build
npm run preview
```
