/* =============================================================
 * APP.JS  -  isi nilai dinamis ke dalam markup statis index.html.
 *
 * Strategi: hanya menulis textContent ke elemen ber-id yang
 * sudah ada. Tidak menambah atau menghapus tag, tidak mengubah
 * class, tidak menyentuh hierarki DOM. Jika JS gagal load,
 * halaman tetap menampilkan fallback statis.
 * ============================================================= */
(function () {
  "use strict";

  const cfg = window.ABIZAR_CONFIG;
  if (!cfg) return;

  const MONTHS_LONG  = ["Januari","Februari","Maret","April","Mei","Juni",
                        "Juli","Agustus","September","Oktober","November","Desember"];
  const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","Mei","Jun",
                        "Jul","Agt","Sep","Okt","Nov","Des"];

  function parseDate(iso) {
    const parts = iso.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  function addMonths(d, n) {
    const x = new Date(d.getTime());
    x.setMonth(x.getMonth() + n);
    return x;
  }
  function fmtFullDate(d) {
    return d.getDate() + " " + MONTHS_LONG[d.getMonth()] + " " + d.getFullYear();
  }
  function fmtBirthShort(d) {
    return d.getDate() + " " + MONTHS_SHORT[d.getMonth()] + " " + d.getFullYear();
  }
  function diffMonthsDays(from, to) {
    let years  = to.getFullYear() - from.getFullYear();
    let months = to.getMonth()    - from.getMonth();
    let days   = to.getDate()     - from.getDate();
    if (days < 0) {
      months -= 1;
      days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    }
    if (months < 0) { years -= 1; months += 12; }
    return { months: years * 12 + months, days: days };
  }

  // Label kalender sebuah rentang usia (X-Y bulan). Aturan label disesuaikan
  // dengan konvensi dokumen asli:
  //   - startOffset & endOffset menggeser anchor agar label kalender match
  //     dengan cara author original menulis (lihat callsite).
  //   - Kalau tahun sama, pakai "Bulan - Bulan Tahun".
  //   - Kalau beda tahun, pakai "Bulan Tahun - Bulan Tahun".
  function periodLabel(startMonth, endMonth, birth, startOffset, endOffset, useShort) {
    const a = addMonths(birth, startMonth + (startOffset || 0));
    const b = addMonths(birth, endMonth   + (endOffset   || 0));
    const M = useShort ? MONTHS_SHORT : MONTHS_LONG;
    if (a.getFullYear() === b.getFullYear()) {
      return M[a.getMonth()] + " - " + M[b.getMonth()] + " " + b.getFullYear();
    }
    return M[a.getMonth()] + " " + a.getFullYear() +
           " - " + M[b.getMonth()] + " " + b.getFullYear();
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function render() {
    const today = new Date();
    const birth = parseDate(cfg.child.birthDate);
    const age   = diffMonthsDays(birth, today);
    const ageMo = age.days >= 15 ? age.months + 1 : age.months;

    // ---- Hero ----
    setText("abi-hero-age",      ageMo + " bulan");
    setText("abi-hero-birth",    fmtBirthShort(birth));
    setText("abi-hero-weight",   cfg.weight.value);
    setText("abi-hero-pct",      cfg.weight.percentile);
    setText("abi-hero-formula",  cfg.formula.short);
    setText("abi-hero-allergy",  cfg.allergy.hero);
    setText("abi-subtitle-name", cfg.child.fullName);

    // ---- Photo banner ----
    setText("abi-photo-nick",    cfg.child.nickname);
    setText("abi-photo-text",
      cfg.child.fullName + ", " + ageMo + " bulan, BB " + cfg.weight.value +
      ". Dokumen ini disusun khusus untuk mendukung tumbuh kembang " +
      cfg.child.nickname + " sampai usia 2 tahun, dengan pertimbangan riwayat alergi " +
      "ringan susu sapi yang sudah resolved sejak pindah ke " + cfg.formula.short + ".");

    // ---- Profil ----
    setText("abi-profile-fullname",  cfg.child.fullName);
    setText("abi-profile-birth",     fmtFullDate(birth));
    setText("abi-profile-age",       age.months + " bulan " + age.days + " hari (" + ageMo + " bln)");
    setText("abi-profile-weight",    cfg.weight.full);
    setText("abi-profile-formula",   cfg.formula.full);
    setText("abi-profile-allergy",   cfg.allergy.profile);
    setText("abi-profile-sleep",     cfg.sleep);
    setText("abi-profile-updated",   fmtFullDate(today));

    // ---- Doc cards ----
    setText("abi-doc-utama-title",   "Panduan Susu & MPASI Usia " + ageMo + " Bulan");
    setText("abi-doc-utama-period",  "Bulan " + cfg.roadmap[0].months[0] + " - " + cfg.roadmap[0].months[1] +
      " (" + periodLabel(cfg.roadmap[0].months[0], cfg.roadmap[0].months[1], birth, 0, 1, false) + ")");
    setText("abi-doc-utama-desc",
      "Konsolidasi " + cfg.formula.short.replace(/^Morinaga\s+/, "") +
      ", MPASI bergizi, persiapan transisi susu sapi, milk ladder bertahap, dan pola tidur optimal.");
    setText("abi-doc-utama-vol",     "Volume susu " + cfg.formula.dailyVol);

    // Rentang transisi 12-24: start dari bulan kalender setelah ulang tahun 1
    // (offset +1), end persis di ulang tahun ke-2 (offset 0).
    setText("abi-doc-transisi-period",
      "Bulan 12 - 24 (" + periodLabel(12, 24, birth, 1, 0, true) + ")");

    setText("abi-doc-trouble-period", "Untuk Bulan 10 - 24 (Periode Transisi)");
    setText("abi-doc-trouble-bb",     "Analisis BB " + cfg.child.nickname + " vs kurva WHO");

    // ---- Roadmap (5 timeline-item statis, kita isi h4 + tandai .now) ----
    const PHASE_TITLES = [
      "Konsolidasi P-HP & MPASI, pola tidur optimal, milk ladder tangga 1-3.",
      "Fase 1 transisi: sufor \u2192 UHT bertahap (rasio 3:1 sampai 1:3).",
      "Fase 2: full UHT, stop susu malam, biasakan air putih.",
      "Fase 3: encerkan UHT, kurangi dot, transisi ke gelas/sippy cup.",
      "Fase 4: susu opsional, makan keluarga normal, target tercapai."
    ];
    const PHASE_REFS = [
      "Panduan Utama",
      "Panduan Transisi (Fase 1)",
      "Panduan Transisi (Fase 2)",
      "Panduan Transisi (Fase 3)",
      "Panduan Transisi (Fase 4)"
    ];

    cfg.roadmap.forEach(function (item, idx) {
      const next      = cfg.roadmap[idx + 1];
      const upper     = next ? next.months[0] - 1 : item.months[1];
      const isNow     = ageMo >= item.months[0] && ageMo <= upper;
      // Roadmap fase pertama: anchor start di bulan masuk usia X.
      // Fase berikutnya: anchor start di bulan kalender berikutnya
      // (agar tidak overlap dengan label fase sebelumnya).
      const startOffset = (idx === 0) ? 0 : 1;
      const periodTxt   = periodLabel(item.months[0], item.months[1], birth, startOffset, 1, false);
      const monthRng  = "Bulan " + item.months[0] + "-" + item.months[1];

      const headEl = document.getElementById("abi-roadmap-h-" + idx);
      const itemEl = document.getElementById("abi-roadmap-" + idx);
      if (headEl) {
        // Set ulang teks dasar + sisipkan badge SEKARANG kalau active.
        headEl.textContent = periodTxt + " \u00b7 " + monthRng;
        if (isNow) {
          const badge = document.createElement("span");
          badge.className   = "badge-now";
          badge.textContent = "SEKARANG";
          headEl.appendChild(document.createTextNode(" "));
          headEl.appendChild(badge);
        }
      }
      if (itemEl) {
        if (isNow) itemEl.classList.add("now");
        else       itemEl.classList.remove("now");
      }
    });

    // ---- Akses cepat ----
    setText("abi-action-vol",  cfg.formula.dailyVol);
    setText("abi-action-bb",   cfg.weight.vsWho);

    // ---- Parents ----
    setText("abi-parents-name", cfg.parents.display);

    const quoteEl = document.getElementById("abi-parents-quote");
    if (quoteEl && Array.isArray(cfg.parentsQuote.body)) {
      // String utuh dengan \n; CSS .parents-quote em sudah punya line-break alami via <br>.
      // Kita pakai innerHTML hanya untuk <br><br>, dengan escape manual aman.
      const lines = cfg.parentsQuote.body.map(escapeHtml);
      quoteEl.innerHTML = "<em>\u201c" + lines.join("<br>") + "\u201d</em>";
    }

    const closingEl = document.getElementById("abi-parents-closing");
    if (closingEl && Array.isArray(cfg.parentsQuote.closing)) {
      closingEl.innerHTML = cfg.parentsQuote.closing.map(escapeHtml).join("<br>");
    }

    // ---- Footer ----
    setText("abi-footer-fullname", cfg.child.fullName);
    setText("abi-footer-birth",    fmtFullDate(birth));
    setText("abi-footer-updated",  fmtFullDate(today));

    // ---- Halaman panduan-utama-10-bulan.html ----
    setText("abi-pu-age",        age.months + " bulan " + age.days + " hari (memasuki bulan ke-" + ageMo + ")");
    setText("abi-pu-table-ctx",  ageMo + " bln, " + fmtFullDate(today));
    setText("abi-pu-footer-ctx", cfg.child.nickname + " " + age.months + " bulan " + age.days + " hari, " +
                                 cfg.formula.full + ", riwayat alergi ringan");

    // ---- Halaman panduan-transisi-12-24-bulan.html ----
    setText("abi-cover-fullname", cfg.child.fullName);
    setText("abi-cover-nick",     cfg.child.nickname);
    setText("abi-cover-birth",    fmtFullDate(birth));
    setText("abi-profile-nick",   cfg.child.nickname);

    // ---- Halaman panduan-troubleshooting.html ----
    setText("abi-pts-age",        age.months + " bulan " + age.days + " hari (memasuki bulan ke-" + ageMo + ")");
    setText("abi-pts-pill-age",   ageMo + " bln");
    setText("abi-pts-pill-bb",    cfg.weight.value);
    setText("abi-pts-card-name",  cfg.child.fullName + ", " + ageMo + " bulan, BB " + cfg.weight.value);
    setText("abi-footer-bb",      cfg.weight.value);

    // ---- Halaman progress.html ----
    setText("abi-prog-nick",    cfg.child.nickname);
    setText("abi-prog-updated", fmtFullDate(today));
  }

  ready(render);
  // Re-render tiap menit supaya usia & tanggal update tanpa reload manual.
  setInterval(render, 60 * 1000);
  // Re-render saat tab kembali aktif (mis. setelah malam dibiarkan terbuka).
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) render();
  });

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();