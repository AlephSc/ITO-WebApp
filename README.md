# ITO 2027 — Information Technology Olympiad

Landing page resmi **Information Technology Olympiad (ITO) XXVII** — **SMK Telekomunikasi Darul Ulum Jombang** (*Berhardware Teknologi, Bersoftware Religi*).

## Fitur Utama

- **Wayang Digital / Gunungan Voxel 3D (`Three.js InstancedMesh`)**: Objek 3D interaktif (drag inersia, hover repel & glow, klik ripple gelombang, dan transisi morph budaya → data → karya saat di-scroll).
- **Hero Build-on-Scroll (`GSAP ScrollTrigger` + `Lenis`)**: Kanvas bergaya video editor (HUD timecode, 3×3 frame grid, marquee dimensi live, timeline strip, dan 3 mode kursor kolaborator `panitia ITO`: pen, crosshair, arrow) yang merakit halaman dari nol mengikuti scroll di desktop maupun mobile.
- **Pinned Story 4 Bab**: Transisi teks naratif terpusat dengan jeda baca yang disinkronkan dengan transformasi gunungan 3D.

## Menjalankan Lokal

```bash
npm install
npm run dev
```

## Build Produksi

```bash
npm run build
npm run preview
```
