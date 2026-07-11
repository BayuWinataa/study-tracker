# PRD — Study Streak & Leaderboard (Ajarin)

## 1. Latar Belakang & Masalah

Ajarin adalah platform edukasi "dari siswa, untuk siswa" dengan program peer tutoring, Bootcamp UTBK, dan webinar. Saat ini belum ada mekanisme yang mendorong siswa untuk **konsisten** kembali menggunakan platform maupun **terlibat aktif** dalam program-program yang tersedia.

Tanpa insentif yang jelas, engagement cenderung menurun setelah kunjungan pertama — siswa ikut satu sesi lalu tidak kembali. Dibutuhkan mekanisme yang mendorong kebiasaan belajar rutin sekaligus menciptakan rasa kompetisi yang sehat antar siswa.

## 2. Tujuan

- Meningkatkan **retention** siswa (jumlah siswa yang kembali mengakses platform dari hari ke hari)
- Mendorong siswa memanfaatkan lebih banyak fitur Ajarin (tutoring, kuis, webinar), bukan hanya satu aktivitas
- Menciptakan elemen kompetisi sehat yang memotivasi tanpa membuat siswa baru merasa tertinggal jauh

## 3. Target Pengguna

Siswa terdaftar di platform Ajarin, khususnya peserta program Bootcamp UTBK dan peer tutoring yang membutuhkan motivasi belajar konsisten dalam jangka waktu tertentu (persiapan ujian).

## 4. Ruang Lingkup Fitur

### 4.1 Study Streak
Menghitung berapa hari berturut-turut siswa aktif (check-in atau menyelesaikan aktivitas belajar).

**User story:**
> Sebagai siswa, saya ingin melihat berapa hari saya sudah konsisten belajar, supaya saya termotivasi untuk tidak memutus rangkaian tersebut.

**Fitur detail:**
| Fitur | Deskripsi |
|---|---|
| Check-in harian | Siswa menandai "sudah belajar hari ini" (manual, atau otomatis saat menyelesaikan sesi tutoring/kuis) |
| Streak counter | Menampilkan jumlah hari berturut-turut aktif (contoh: "🔥 5 hari") |
| Longest streak | Rekor streak terpanjang yang pernah dicapai siswa |
| Kalender aktivitas | Visualisasi heatmap ala GitHub contribution graph, menampilkan hari mana saja siswa aktif dalam sebulan terakhir |
| Freeze streak | Siswa mendapat token freeze terbatas (misal 1/bulan) yang otomatis terpakai jika 1 hari terlewat, agar streak tidak reset ke 0 |

**Aturan bisnis streak:**
- Batas hari dihitung berdasarkan zona waktu **WIB (UTC+7)**
- Jika check-in dilakukan pada hari yang sama → tidak ada perubahan (idempotent)
- Jika check-in terakhir = kemarin → streak +1
- Jika check-in terakhir < kemarin (lebih dari 1 hari terlewat) → streak reset ke 1, kecuali freeze token tersedia dan otomatis dipakai

### 4.2 Leaderboard
Peringkat siswa berdasarkan poin yang dikumpulkan dari berbagai aktivitas.

**User story:**
> Sebagai siswa, saya ingin melihat posisi saya dibanding siswa lain, supaya saya termotivasi untuk lebih aktif belajar dan berkontribusi.

**Fitur detail:**
| Fitur | Deskripsi |
|---|---|
| Weekly leaderboard | Peringkat berdasarkan poin yang dikumpulkan minggu ini (reset tiap Senin 00:00 WIB) |
| All-time leaderboard | Peringkat berdasarkan total poin sepanjang waktu |
| Posisi pribadi | Siswa selalu bisa melihat posisi & poinnya sendiri, meski tidak masuk top 10 |
| Sumber poin | Poin didapat dari: check-in harian, kelipatan streak tertentu (bonus), mengikuti sesi tutoring, menyelesaikan kuis/latihan soal |

**Skema poin (contoh awal, bisa disesuaikan):**
| Aktivitas | Poin |
|---|---|
| Check-in harian | +10 |
| Bonus tiap kelipatan 7 hari streak | +20 |
| Mengikuti sesi tutoring | +15 |
| Menyelesaikan kuis/latihan soal | sesuai skor (misal +1 per soal benar) |

### 4.3 (Opsional / Nice-to-have jika waktu memungkinkan)
- Badge sederhana untuk milestone tertentu ("Streak 7 hari", "Top 3 minggu ini") sebagai pelengkap visual dari sistem poin

## 5. Di Luar Ruang Lingkup (Out of Scope)

- Sistem reward berupa hadiah fisik/redemption poin
- Notifikasi push/reminder otomatis (bisa jadi pengembangan lanjutan)
- Anti-cheat kompleks untuk mencegah kecurangan check-in (untuk versi ini cukup 1x check-in/hari per user)
- Challenge system mingguan (dipisah sebagai fitur lain jika ada waktu tambahan)

## 6. Metrik Keberhasilan

- Rata-rata panjang streak aktif siswa meningkat dari minggu ke minggu
- Jumlah siswa dengan streak ≥ 7 hari
- Partisipasi mingguan di leaderboard (jumlah siswa yang mendapat poin minggu tersebut)

## 7. Alur Pengguna (User Flow)

1. Siswa login ke Ajarin
2. Dashboard menampilkan: streak saat ini, kalender aktivitas, dan ringkasan posisi di leaderboard
3. Siswa menekan "Check-in Hari Ini" atau otomatis ter-trigger dari aktivitas lain
4. Sistem menghitung ulang streak & menambah poin
5. Siswa dapat membuka halaman Leaderboard untuk melihat peringkat lengkap (weekly/all-time)

## 8. Pertimbangan Teknis (ringkas)

- **Next.js (App Router) + TypeScript**
- **PostgreSQL (Neon) + Drizzle ORM**
- Entitas utama: `users`, `check_ins`, `streaks`, `points_log`, (opsional `badges`, `user_badges`)
- Leaderboard dihitung dari agregasi `points_log`, bukan tabel terpisah, agar mudah dihitung ulang per periode (weekly/all-time)
- Deploy: Vercel (Next.js) + Neon (Postgres)

## 9. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Siswa frustrasi karena streak reset akibat lupa 1 hari | Freeze token |
| Siswa baru merasa tidak mungkin bersaing di leaderboard all-time | Weekly leaderboard yang reset rutin |
| Kesalahan hitung streak akibat perbedaan zona waktu server vs user | Semua perhitungan tanggal menggunakan WIB (UTC+7) secara eksplisit |
