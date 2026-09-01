# BEPCal - Kalkulator Titik Impas (Break-Even Point) UMKM

Aplikasi kalkulator finansial modern berbasis web murni (HTML5, CSS3, Vanilla JavaScript) yang dirancang untuk membantu para pelaku UMKM (*Usaha Mikro, Kecil, dan Menengah*) di Indonesia menghitung titik impas penjualan dengan cepat, presisi, dan visual.

---

## 🎯 Fitur Utama

1. **Kalkulasi Titik Impas Presisi**:
   - **BEP Unit**: Jumlah minimum unit yang harus terjual per bulan dan per hari agar biaya operasional tertutupi tanpa merugi.
   - **BEP Rupiah**: Total omzet minimum yang harus masuk ke rekening usaha.
   - **Margin Kontribusi per Unit**: Selisih harga jual dikurangi biaya variabel untuk menutup biaya tetap.
   - **Rasio Margin Kontribusi (%)**: Efisiensi margin dari setiap Rupiah penjualan.

2. **Simulasi Laba & Batas Keamanan (Advanced)**:
   - **Target Laba Bulanan**: Menghitung berapa unit yang wajib terjual untuk menghasilkan laba bersih tertentu.
   - **Margin of Safety**: Persentase batas penurunan penjualan sebelum usaha mulai menderita kerugian.

3. **Grafik Kurva Titik Impas Interaktif (Interactive SVG BEP Crossover Chart)**:
   - Visualisasi kurva garis Biaya Tetap, Total Biaya, dan Pendapatan.
   - Shading warna dinamis untuk **Zona Rugi** (merah halus) dan **Zona Laba** (hijau emerald).
   - **Interactive Hover Coordinate Tracker**: Arahkan kursor / sentuh layar di titik mana saja pada grafik untuk melihat simulasi volume, omzet, total biaya, dan estimasi laba/rugi secara real-time.

4. **Preset Profil Bisnis UMKM**:
   - Pilihan profil instan: *Kedai Kopi Susu*, *Sablon Kaos Distro*, *Bakery & Pastry*, dan *Cuci Sepatu Premium*.

5. **Kalkulator Rincian Biaya (Cost Itemizer)**:
   - Modal interaktif untuk merinci pos Biaya Tetap (sewa, gaji karyawan, listrik/internet, perawatan alat) dan Biaya Variabel (bahan baku, cup/kemasan, bumbu, plastik, komisi).

6. **Tabel Sensitivitas Penjualan**:
   - Matriks skenario penjualan: 50% BEP, 75% BEP, 100% BEP (Impas), 125% BEP, 150% BEP, serta target custom.

7. **Desain Modern Anti-Slop (Taste-Skill UI)**:
   - Tipografi modern: `Plus Jakarta Sans` & `JetBrains Mono`.
   - Palet warna *Fintech Emerald Slate*.
   - Arsitektur komponen *Double-Bezel* (Doppelrand).
   - Mode Gelap & Terang (Dark / Light Mode) dengan penyimpanan preferensi lokal.
   - Siap cetak (Print / PDF Report Sheet) berformat rapi untuk keperluan proposal usaha atau pengajuan modal kerja (KUR).

---

## 📐 Rumus Matematika Finansial

$$\text{Margin Kontribusi per Unit} = \text{Harga Jual per Unit} - \text{Biaya Variabel per Unit}$$

$$\text{BEP (Unit)} = \frac{\text{Biaya Tetap Total}}{\text{Margin Kontribusi per Unit}}$$

$$\text{BEP (Rupiah)} = \text{BEP (Unit)} \times \text{Harga Jual per Unit}$$

$$\text{Rasio Margin Kontribusi} = \left( \frac{\text{Margin Kontribusi}}{\text{Harga Jual}} \right) \times 100\%$$

$$\text{Unit untuk Target Laba} = \frac{\text{Biaya Tetap Total} + \text{Target Laba}}{\text{Margin Kontribusi per Unit}}$$

$$\text{Margin of Safety (\%)} = \left( \frac{\text{Estimasi Penjualan (Unit)} - \text{BEP (Unit)}}{\text{Estimasi Penjualan (Unit)}} \right) \times 100\%$$

---

## 🚀 Cara Menjalankan

Aplikasi ini 100% client-side tanpa dependensi server atau node build:

1. Buka folder `BEPCal`.
2. Klik ganda file `index.html` untuk langsung membukanya di peramban favorit Anda (Chrome, Edge, Firefox, Safari).
3. Atau jalankan menggunakan local server sederhana (misal Live Server di VS Code atau `npx serve .`).

---

## 📁 Struktur Direktori

```
BEPCal/
├── index.html          # Markup HTML5 semantik dan struktur aplikasi
├── css/
│   └── style.css       # Master stylesheet, variabel tema, double-bezel & print style
├── js/
│   └── app.js          # Logika kalkulasi, SVG chart engine, presets, dan itemizer
└── README.md           # Dokumentasi teknis aplikasi
```

---

## 🔒 Privasi & Keamanan Data

Aplikasi ini memproses seluruh data di memori peramban lokal perangkat Anda. Tidak ada data finansial yang dikirimkan ke server eksternal mana pun.
