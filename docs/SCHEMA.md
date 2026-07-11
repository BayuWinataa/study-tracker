# SCHEMA.md — Dokumentasi Skema Database

Dokumen ini menjelaskan skema database dalam bahasa manusia, termasuk **alasan desain** di balik tiap keputusan. Skema Prisma sesungguhnya ada di `prisma/schema.prisma` — file ini adalah pendampingnya supaya AI/manusia tidak salah asumsi soal relasi antar tabel.

## Entity Relationship (ringkas)

```
User 1───* CheckIn
User 1───1 Streak
User 1───* PointsLog
User 1───* UserBadge *───1 Badge
```

## 1. `User`

Menyimpan data siswa. Data profil dasar dari NextAuth (Google login).

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `name` | String | Nama tampilan |
| `email` | String (unique) | Dari Google OAuth |
| `image` | String? | Avatar dari Google |
| `createdAt` | DateTime | Default `now()` |

> Catatan: tabel `Account` dan `Session` juga akan ada karena requirement NextAuth Prisma Adapter — tidak dijelaskan detail di sini karena strukturnya standar dari NextAuth, lihat schema langsung.

## 2. `CheckIn`

Mencatat **setiap kali** siswa check-in (1 baris = 1 hari aktif).

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `userId` | String | FK ke `User` |
| `date` | DateTime (@db.Date) | Tanggal check-in, dalam basis **WIB**, disimpan sebagai date-only (bukan timestamp) |
| `createdAt` | DateTime | Waktu record dibuat (timestamp asli, untuk audit) |

**Constraint penting:** `@@unique([userId, date])` — mencegah user check-in dua kali di tanggal yang sama pada level database, bukan cuma di application logic. Ini pengaman lapis kedua kalau ada race condition.

**Kenapa disimpan sebagai tabel log, bukan cuma field boolean di `User`?**
Supaya kalender heatmap aktivitas bisa ditampilkan (butuh histori, bukan cuma status hari ini), dan supaya streak bisa dihitung ulang/diverifikasi kapan saja dari data mentah kalau ada bug.

## 3. `Streak`

Menyimpan **state terkini** streak per user (bukan histori — histori sudah ada di `CheckIn`). Ini semacam "cache" hasil kalkulasi supaya tidak perlu hitung ulang dari nol tiap kali dashboard dibuka.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `userId` | String (unique) | FK ke `User`, 1-1 relation |
| `currentStreak` | Int | Streak berjalan saat ini |
| `longestStreak` | Int | Rekor tertinggi yang pernah dicapai |
| `lastCheckInDate` | DateTime? (@db.Date) | Tanggal check-in terakhir (WIB) |
| `freezeAvailable` | Int | Jumlah freeze token tersisa (default sesuai kebijakan, misal 1/bulan) |
| `updatedAt` | DateTime | Auto-update tiap kali streak berubah |

**Kenapa perlu tabel terpisah, bukan dihitung on-the-fly dari `CheckIn` tiap request?**
Performa — kalkulasi streak (loop cek hari demi hari) lebih murah dilakukan sekali saat check-in terjadi, dibanding dihitung ulang tiap kali dashboard dibuka. Trade-off: butuh logic yang benar-benar konsisten saat update (lihat `docs/DECISIONS.md` untuk detail edge case).

## 4. `PointsLog`

Log setiap perolehan poin. **Ini sumber kebenaran untuk leaderboard** — bukan field total poin statis.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `userId` | String | FK ke `User` |
| `source` | Enum (`CHECK_IN`, `STREAK_BONUS`, `TUTORING_SESSION`, `QUIZ`) | Asal poin |
| `points` | Int | Jumlah poin (bisa beda-beda tergantung source) |
| `createdAt` | DateTime | Dipakai untuk filter periode (weekly vs all-time) |

**Kenapa log, bukan field `totalPoints` di `User`?**
Karena leaderboard butuh agregasi **per periode** (weekly reset tiap Senin, all-time dari awal). Kalau cuma simpan 1 angka total, tidak mungkin tahu berapa poin yang didapat *minggu ini saja* tanpa histori. Query weekly leaderboard tinggal `SUM(points) WHERE createdAt >= awal_minggu_ini GROUP BY userId`.

## 5. `Badge` & `UserBadge` (opsional, nice-to-have)

| Tabel | Kolom | Keterangan |
|---|---|---|
| `Badge` | `id`, `code` (unique), `name`, `description`, `icon` | Master data badge (seed manual, bukan dari user) |
| `UserBadge` | `id`, `userId`, `badgeId`, `earnedAt` | Badge yang sudah didapat user, `@@unique([userId, badgeId])` supaya tidak dobel |

## Query Kunci yang Perlu Diingat

**Weekly leaderboard:**
```ts
prisma.pointsLog.groupBy({
  by: ['userId'],
  where: { createdAt: { gte: startOfWeekWIB() } },
  _sum: { points: true },
  orderBy: { _sum: { points: 'desc' } },
})
```

**All-time leaderboard:** sama seperti di atas, tanpa filter `where`.

**Cek status check-in hari ini:**
```ts
prisma.checkIn.findUnique({
  where: { userId_date: { userId, date: getWIBDate() } }
})
```

## Hal yang Perlu Diverifikasi Ulang Saat Implementasi

- Pastikan `getWIBDate()` mengembalikan tipe yang cocok dengan kolom `@db.Date` di Prisma (biasanya perlu di-strip jam/menit/detiknya sebelum disimpan)
- `startOfWeekWIB()` harus konsisten pakai Senin sebagai awal minggu (bukan default locale yang kadang mulai Minggu)
