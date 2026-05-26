# Panduan Mengisi Progress Sleep Training Abi

Dokumen ini bukan log harian. **Log harian ada di `progress.html`** (bisa
dibuka dari landing page). Dokumen ini cuma berisi instruksi cara
menambahkan entry baru ke `progress.html` setiap pagi.

---

## Kapan Mengisi

- **Pagi setelah malam berlangsung**, saat ingatan masih segar.
- Bukan tengah malam. Tengah malam fokus ke Abi dulu.
- Kalau lupa pagi, isi maksimal H+1 supaya detail belum hilang.

---

## Apa Saja yang Dicatat

Setiap entry malam wajib punya 6 bagian:

1. **Konteks** — kondisi awal Abi malam itu (usia, kesehatan, nap siang,
   makan malam, hal khusus).
2. **Timeline** — jam-jam kunci: bedtime, night waking, durasi tantrum,
   apa yang dilakukan kapan, jam akhirnya tidur.
3. **Strategi Yang Dipakai** — fase camping out yang sedang dijalani,
   posisi ortu, sentuhan, respons terhadap rewel.
4. **Hasil** — total durasi proses, apakah komitmen dipegang
   (tanpa dot, tanpa gendong, tanpa pindah ruang), kondisi pagi.
5. **Insight untuk Malam Berikutnya** — apa yang berhasil, apa yang
   tidak, hipotesis untuk diuji besok.
6. **Tag warna** — pilih satu: rough, better, atau success (lihat di
   bawah).

---

## Tag Warna untuk Header Malam

Pakai class CSS pada `<span class="night-tag tag-...">`:

- **`tag-rough`** (merah) — tantrum >60 menit, ortu kewalahan,
  komitmen sempat goyah.
- **`tag-better`** (kuning) — tantrum 20-60 menit, ada penurunan dari
  malam sebelumnya, komitmen pegang.
- **`tag-success`** (hijau) — tantrum <20 menit atau self-resolve,
  Abi tidur lewati 22:00 tanpa intervensi besar.

Border atas card juga ada variant warna:

- `class="night is-current"` — malam yang sedang berjalan (oranye)
- `class="night is-rough"` — border merah
- `class="night is-success"` — border hijau
- tanpa modifier — border abu-abu (default)

---

## Template Entry Baru

Buka `progress.html`, cari section dengan komentar `<!-- TEMPLATE -->`
atau langsung tambah `<article class="night">` baru di dalam
`<div class="nights">`. Pakai template ini, ganti placeholder `[...]`:

```html
<article class="night [is-current|is-success|is-rough]">
  <div class="night-head">
    <span class="night-num">Malam [N]</span>
    <span class="night-date">[DD Bulan YYYY] &middot; [Hari]</span>
    <span class="night-tag [tag-rough|tag-better|tag-success]">[Label]</span>
  </div>

  <div class="night-section">
    <h4>Konteks</h4>
    <p>[Usia, kondisi kesehatan, nap siang (jam berapa, durasi),
       makan malam, hal khusus malam ini]</p>
  </div>

  <div class="night-section">
    <h4>Timeline</h4>
    <ul class="timeline">
      <li data-time="[HH:MM]">[Apa yang terjadi]</li>
      <li data-time="[HH:MM]">[Apa yang terjadi]</li>
      <li data-time="[HH:MM-HH:MM]">[Periode]</li>
    </ul>
  </div>

  <div class="night-section">
    <h4>Strategi Yang Dipakai</h4>
    <p>[Fase camping out yang dijalani, posisi ortu, jenis sentuhan,
       respons terhadap rewel, ada deviasi atau tidak]</p>
  </div>

  <div class="night-section">
    <h4>Hasil</h4>
    <p>[Total durasi dari bedtime sampai tidur lelap,
       komitmen 5 poin dipegang/tidak, kondisi pagi]</p>
  </div>

  <div class="night-section">
    <h4>Insight untuk Malam [N+1]</h4>
    <ul class="insight-list">
      <li>[Pelajaran 1]</li>
      <li>[Pelajaran 2]</li>
      <li>[Hipotesis untuk diuji besok]</li>
    </ul>
  </div>
</article>
```

---

## Update Header & Stats Setiap Malam Baru

Setelah menambah `<article class="night">`, update juga:

1. **Hero stat di atas** — ubah angka di `<div class="hero-stat" id="prog-night-count">`:
   ```html
   <strong>Malam [N]</strong> dari 21
   ```

2. **Stats grid** — ubah:
   - `id="prog-stat-nights"` &rarr; angka malam sekarang
   - `id="prog-stat-phase"` &rarr; "Fase 1" / "Fase 2" / dst
   - `id="prog-stat-phase-sub"` &rarr; "menempel" / "geser 30cm" /
     "kursi di kamar" / "keluar kamar"

3. **Toggle class `is-current`** &mdash; pindah dari Malam sebelumnya
   ke Malam yang baru ditambahkan.

4. **Hapus card "Belum diisi"** untuk malam yang baru saja diisi.

---

## Aturan Fase (Berbasis Hiscock 2007)

Update `prog-stat-phase` mengikuti pemetaan ini:

| Malam | Fase | Sub-label | Posisi Ortu |
|-------|------|-----------|-------------|
| 1-5   | Fase 1 | menempel | Berbaring di samping, tangan statis di dada Abi |
| 6-10  | Fase 2 | geser 30-50cm | Tetap di kasur tapi tidak menempel |
| 11-15 | Fase 3 | kursi di kamar | Pindah dari kasur ke kursi/sudut kamar |
| 16-21 | Fase 4 | keluar kamar | Di luar pintu, kembali kalau perlu |

Geser ke fase berikutnya **hanya kalau** dua malam terakhir di fase
saat ini tag `tag-better` atau `tag-success`. Kalau Malam 5 masih
`tag-rough`, perpanjang Fase 1 sampai stabil.

---

## Yang Tidak Boleh Dilakukan Sepanjang Training

Catat di Hasil kalau salah satu break:

1. **Kasih dot di tengah malam** &mdash; reset 4x peluang weaning
   (riset cold turkey).
2. **Gendong** &mdash; bikin asosiasi baru: "nangis = digendong".
3. **Pindah ke ruang tamu / kasur ortu lain** &mdash; bingung tempat tidur.
4. **Nyalakan lampu terang / TV / HP nyala** &mdash; melatonin drop.
5. **Pasangan beda strategi** &mdash; align dulu sebelum mulai malam.
6. **Ganti metode tiap 2-3 hari** &mdash; minimal 7 malam baru evaluasi.

---

## Indikator Kemajuan (Per Hiscock 2007)

Bandingkan tiap malam dengan baseline ini. Kalau jauh meleset 3+ malam
berturut, layak konsultasi DSA.

| Periode | Ekspektasi |
|---------|------------|
| Malam 1-3 | Tantrum 30-90 menit saat night waking, intensitas tinggi |
| Malam 4-7 | Durasi turun ke 15-45 menit, intensitas menurun |
| Malam 8-14 | Night waking sporadis, mostly self-resolve <10 menit |
| Malam 15-21 | Pola konsolidasi, jarang bangun atau cuma micro-arouse |

---

## Red Flag &mdash; Stop Training, Konsultasi DSA

- Demam >38.5&deg;C
- Tantrum + muntah berulang
- Tidak responsif terhadap nama/sentuhan (lethargy)
- Tantrum tidak juga reda 3+ malam berturut dengan strategi konsisten
- Regresi perkembangan (lupa skill yang sudah bisa)
- BB turun signifikan dalam minggu training

---

## Hari Terakhir (Malam 21)

Setelah Malam 21, buat **summary akhir** di bagian atas `progress.html`:

- Total durasi training
- Status: berhasil / partial / butuh konsultasi
- Pola tidur baru: jam tidur, jam bangun, night waking rata-rata
- Catatan untuk dokter/posyandu kalau perlu

Arsipkan progress lama dengan rename file ke `progress-arsip-YYYYMM.html`,
lalu mulai `progress.html` baru kalau ada training berikutnya
(misal: pindah ke kamar sendiri, lepas susu malam total).

---

## Referensi Inti

- Hiscock H et al. (2007). "Improving infant sleep and maternal mental
  health: a cluster randomised trial." *Arch Dis Child* 92(11):952-8.
- Price AM et al. (2012). "Five-year follow-up of harms and benefits of
  behavioral infant sleep intervention." *Pediatrics* 130(4):643-51.
- Mindell JA et al. (2006). "Behavioral treatment of bedtime problems
  and night wakings in infants and young children." *Sleep* 29(10):1263-76.
- Sadeh A et al. (2009). "Sleep and sleep ecology in the first 3 years."
  *J Sleep Res* 18(1):60-73.
- Cooney MR et al. (2018). "An open trial of bedtime fading for sleep
  disturbances in preschool children." *Sleep Med* 46:98-106.