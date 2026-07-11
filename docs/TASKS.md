# TASKS.md — Progress Tracker

Checklist harian development. Update tiap hari — centang yang selesai, tambah catatan kalau ada blocker atau perubahan rencana (dan sinkronkan ke `docs/DECISIONS.md` kalau itu keputusan teknis).

---

## Hari 0 — Dokumentasi (selesai)
- [x] `docs/PRD.md`
- [x] `CLAUDE.md`
- [x] `docs/SCHEMA.md`
- [x] `docs/DECISIONS.md`
- [x] `docs/TASKS.md`
- [x] `docs/DESIGN.md`

---

## Hari 1 — Setup Project
- [x] Install shadcn/ui + komponen dasar yang dibutuhkan
- [ ] Buat project Neon, ambil connection string (Sudah saya buatkan dummy di .env.local)
- [x] Install Prisma (`pnpm add prisma @prisma/client`), `prisma init`
- [x] Setup `.env.local` (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`), pastikan masuk `.gitignore`
- [x] Setup NextAuth + Google provider + Prisma Adapter
- [ ] Init git, buat repo GitHub, push initial commit
- [ ] Verifikasi: bisa login pakai Google di localhost

**Catatan/blocker:**
- *Menunggu User memasukkan koneksi database Neon dan Google OAuth credentials asli di .env.local sebelum verifikasi login.*

---

## Hari 2 — Database & Seed
- [x] Tulis `prisma/schema.prisma`: `User`, `CheckIn`, `Streak`, `PointsLog` (+ `Badge`/`UserBadge` kalau sempat)
- [x] Jalankan `pnpm prisma migrate dev --name init`
- [x] Buat `prisma/seed.ts` — beberapa user dummy dengan variasi streak & poin
- [x] Jalankan seed, cek data via `pnpm prisma studio`
- [x] Buat util `getWIBDate()` dan `startOfWeekWIB()` di `src/lib/date.ts`

**Catatan/blocker:**

---

## Hari 3 — Server Actions (Logic Inti)
- [x] Server action `checkIn()` — idempotent, handle logic streak (lanjut/reset/freeze)
- [x] Server action `getLeaderboard(period: 'weekly' | 'all-time')`
- [x] Server action `getUserStreak(userId)` + `getUserRank(userId)`
- [x] Unit test logic streak: hari sama, kemarin, bolong 2+ hari, freeze token terpakai, freeze habis
- [x] Test manual lewat Prisma Studio: ubah `lastCheckInDate` manual, jalankan check-in, cek hasil

**Catatan/blocker:**

---

## Hari 4 — UI Dashboard
- [x] Komponen `StreakCounter` (angka streak + current/longest)
- [x] Komponen `ActivityCalendar` (heatmap ala GitHub, dari data `CheckIn`)
- [x] Tombol "Check-in Hari Ini" (disabled kalau sudah check-in hari ini)
- [x] Ringkasan posisi leaderboard di dashboard
- [x] Loading & empty state (user baru belum pernah check-in)

**Catatan/blocker:**

---

## Hari 5 — Halaman Leaderboard
- [x] Halaman `/leaderboard`
- [x] Komponen Toggle "Weekly" / "All-Time" (bisa pakai `?period=weekly` di URL)
- [x] Tabel/Daftar peringkat: Rank, Avatar/Nama, Total Poin, Badge "Top 3"
- [x] Integrasi dengan server action `getLeaderboard(period)`
- [x] Responsive check (mobile — reviewer kemungkinan buka dari HP)
- [x] Badge sederhana (opsional, kalau waktu masih ada)
- [x] Review ulang bareng AI: cek edge case yang mungkin terlewat

**Catatan/blocker:**

---

## Hari 6 — Deploy & Submission
- [ ] `pnpm build` lokal, pastikan tidak ada error
- [ ] Push final code ke GitHub
- [ ] Connect repo ke Vercel, set semua environment variable di dashboard Vercel
- [ ] Deploy, test alur penuh di URL production (bukan cuma localhost)
- [ ] Cek: Google OAuth callback URL sudah ditambahkan untuk domain production (bukan cuma localhost)
- [ ] Tulis `README.md` sesuai template Ajarin (fitur, cara run lokal, link deploy, pemanfaatan AI selama development)
- [ ] Final check: link deploy aktif, repo accessible, README lengkap
- [ ] Submit

**Catatan/blocker:**

---

## Log Perubahan Rencana

Kalau ada penyesuaian timeline/scope di tengah jalan, catat di sini:

| Tanggal | Perubahan | Alasan |
|---|---|---|
| | | |
