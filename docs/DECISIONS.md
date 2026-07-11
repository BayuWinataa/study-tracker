# DECISIONS.md — Architecture Decision Record (Ringkas)

Dokumen ini mencatat keputusan teknis penting selama development, beserta alasan dan alternatif yang dipertimbangkan. Tujuannya supaya proses berpikir terlihat jelas — bukan cuma hasil akhir — dan supaya keputusan tidak berubah-ubah tanpa alasan di tengah jalan.

Format tiap entri: **Keputusan → Alasan → Alternatif yang dipertimbangkan**

---

## 1. Database: Neon (Postgres) dipilih dibanding Supabase/PlanetScale

**Keputusan:** Menggunakan Neon sebagai hosting PostgreSQL.

**Alasan:** Serverless Postgres dengan free tier yang cukup generous untuk project skala kecil, integrasi mudah dengan Vercel, tidak perlu manage server sendiri.

**Alternatif dipertimbangkan:** Supabase (juga bagus, tapi fitur tambahannya seperti auth/storage tidak dibutuhkan di sini — Neon lebih fokus murni sebagai Postgres).

---

## 2. ORM: Prisma dipilih dibanding Drizzle

**Keputusan:** Menggunakan Prisma sebagai ORM.

**Alasan:** Developer lebih familiar dengan Prisma, tooling migration & Prisma Studio memudahkan inspeksi data selama development, dan schema declarative-nya (`schema.prisma`) mudah dijadikan dokumentasi hidup.

**Alternatif dipertimbangkan:** Drizzle (lebih ringan & lebih dekat ke SQL murni, sempat jadi pilihan awal), tapi Prisma dipilih karena kecepatan development lebih diprioritaskan untuk timeline <1 minggu.

---

## 3. Backend Logic: Server Actions dibanding API Routes

**Keputusan:** Logic check-in dan leaderboard menggunakan Next.js Server Actions, bukan `route.ts` terpisah.

**Alasan:** Mengurangi boilerplate (tidak perlu fetch manual + handle response di client), cocok untuk App Router modern, dan cukup untuk kebutuhan project ini yang tidak butuh endpoint publik/webhook eksternal.

**Alternatif dipertimbangkan:** API Routes — akan dipakai kalau nanti butuh endpoint yang diakses dari luar (misal webhook), tapi untuk sekarang tidak diperlukan.

---

## 4. Auth: NextAuth dengan Google Provider

**Keputusan:** Menggunakan NextAuth dengan Google OAuth sebagai metode login utama.

**Alasan:** Siswa kemungkinan besar sudah punya akun Google (terutama untuk keperluan sekolah), mengurangi friksi pendaftaran dibanding bikin sistem credential sendiri, dan NextAuth punya Prisma Adapter yang tinggal pakai.

**Alternatif dipertimbangkan:** Demo login tanpa auth sungguhan (lebih cepat dibuat), tapi dipilih NextAuth karena ingin menunjukkan implementasi yang lebih mendekati production-ready.

---

## 5. Timezone: Semua perhitungan tanggal berbasis WIB (UTC+7), bukan UTC server

**Keputusan:** Semua logic streak/check-in menggunakan util `getWIBDate()` yang secara eksplisit mengonversi ke WIB, bukan mengandalkan `new Date()` bawaan server.

**Alasan:** Server Vercel berjalan di UTC. Tanpa konversi eksplisit, siswa yang check-in jam 23:30 WIB bisa salah dianggap sudah masuk "hari berikutnya" (karena di UTC baru jam 16:30), menyebabkan streak salah hitung.

**Alternatif dipertimbangkan:** Simpan tanggal sesuai timezone user masing-masing (lebih akurat untuk siswa luar negeri), tapi tidak diperlukan karena target user 100% siswa Indonesia.

---

## 6. Poin & Leaderboard: Disimpan sebagai log (`PointsLog`), bukan field total statis

**Keputusan:** Poin dicatat per transaksi di tabel `PointsLog`, leaderboard dihitung via agregasi (`SUM` + `GROUP BY`), bukan field `totalPoints` yang di-update langsung.

**Alasan:** Weekly leaderboard butuh filter berdasarkan rentang waktu (poin minggu ini saja). Field total statis tidak bisa menjawab pertanyaan "berapa poin yang didapat minggu ini" tanpa histori.

**Alternatif dipertimbangkan:** Field total statis + reset manual tiap Senin (lebih sederhana tapi rawan bug — kalau job reset gagal jalan, data jadi tidak akurat dan tidak bisa diperbaiki karena histori sudah hilang).

---

## 7. Streak: Disimpan sebagai cache (`Streak` table), dihitung ulang saat check-in — bukan on-the-fly dari histori

**Keputusan:** State streak (`currentStreak`, `longestStreak`) disimpan dan diupdate saat check-in terjadi, bukan dihitung ulang dari `CheckIn` history setiap kali dashboard dibuka.

**Alasan:** Performa — dashboard sering diakses, sementara check-in hanya terjadi sekali per hari per user. Lebih murah hitung sekali saat event terjadi dibanding hitung ulang tiap request.

**Alternatif dipertimbangkan:** Hitung on-the-fly dari `CheckIn` (lebih "aman" dari bug inkonsistensi, tapi lebih mahal secara query). Risiko inkonsistensi dimitigasi dengan memastikan logic update di server action benar-benar diuji untuk semua edge case (lihat unit test logic streak).

---

## 8. Package Manager: pnpm dibanding npm

**Keputusan:** Menggunakan pnpm untuk seluruh project.

**Alasan:** Install lebih cepat, lebih hemat disk (content-addressable store), lebih strict soal phantom dependency yang bisa menyebabkan bug tersembunyi saat production build.

**Alternatif dipertimbangkan:** npm (lebih default/universal), tidak dipilih karena developer sudah familiar dengan pnpm dan tidak ada blocker kompatibilitas dengan Vercel.

---

