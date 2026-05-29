/* =============================================================
 * KONFIGURASI PANDUAN ABIZAR
 * Edit nilai di sini untuk update otomatis di seluruh halaman.
 *
 * Yang otomatis dihitung dari child.birthDate (oleh app.js):
 *   - Usia (bulan + hari, juga rounded month)
 *   - Tanggal periode roadmap (start/end = birthDate + N bulan)
 *   - "Update Terakhir" pakai tanggal hari ini
 *
 * Yang perlu update manual saat data berubah:
 *   - weight   (cek di posyandu/DSA)
 *   - formula  (kalau ganti susu)
 *   - sleep    (kalau pola tidur berubah)
 *   - allergy  (kalau status alergi berubah)
 *   - parents  / parentsQuote (jarang diubah)
 *
 * Yang pasif (sekali isi):
 *   - child.fullName, nickname, birthDate
 * ============================================================= */
const ABIZAR_CONFIG = {
  child: {
    fullName:  "Muhammad Abizar Kurniawan",
    nickname:  "Abi",
    birthDate: "2025-07-28"
  },

  weight: {
    value:      "10.72 kg",
    percentile: "P92",
    full:       "10.72 kg (P92, normal)",
    vsWho:      "10.72 kg vs kurva WHO"
  },

  formula: {
    full:     "Morinaga Chil\u00b7Mil P-HP",
    short:    "Morinaga P-HP",
    dailyVol: "P-HP 500-700 ml/hari"
  },

  allergy: {
    hero:    "Suspected CMPA ringan",
    profile: "Suspected CMPA ringan, asimptomatik di P-HP"
  },

  sleep: "18:30 \u2192 03:30 (perlu dioptimasi)",

  parents: {
    display: "Gilang & Rhuka"
  },

  parentsQuote: {
    body: [
      "Nak, ini hidupmu sayang.",
      "Kamu tidak ada kewajiban untuk membalas",
      "atas semua yang telah kami berikan.",
      "",
      "Untuk kami,",
      "membesarkanmu adalah tanggung jawab,",
      "bukan hutang yang nantinya harus kamu bayar."
    ],
    closing: ["TUMBUHLAH DENGAN BAHAGIA.", "TUMBUHLAH DENGAN BAIK."]
  },

  // Setiap fase: rentang bulan usia. Tanggal kalender dihitung dari birthDate.
  roadmap: [
    { months: [10, 12] },
    { months: [12, 16] },
    { months: [17, 19] },
    { months: [20, 22] },
    { months: [23, 24] }
  ]
};
window.ABIZAR_CONFIG = ABIZAR_CONFIG;
