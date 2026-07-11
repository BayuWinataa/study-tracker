# CLAUDE.md

Dokumen ini adalah konteks utama untuk AI (Claude Code atau AI assistant lain) yang membantu development project ini. **Baca file ini di awal setiap sesi sebelum menulis kode apa pun.**

## Tentang Project

Fitur **Study Streak & Leaderboard** untuk platform Ajarin — mendorong siswa konsisten belajar (streak harian) dan bersaing sehat lewat poin (leaderboard weekly & all-time). Detail lengkap requirement ada di `docs/PRD.md` — baca file itu dulu kalau butuh konteks fitur.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| Package manager | **pnpm** — jangan pernah generate `package-lock.json` atau instruksi `npm install` |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL (hosted di **Neon**) |
| ORM | **Prisma** |
| Backend logic | **Server Actions** (`"use server"`) — bukan API routes (`route.ts`), kecuali untuk webhook/hal yang memang butuh HTTP endpoint eksplisit |
| Auth | **NextAuth** (Google provider + credential login) |
| Deploy | Vercel + Neon |

## Struktur Folder (target)

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── page.tsx              # dashboard: streak, kalender, ringkasan leaderboard
│   │   └── leaderboard/page.tsx  # halaman leaderboard penuh
│   ├── api/auth/[...nextauth]/route.ts
│   └── layout.tsx
├── actions/
│   ├── check-in.ts               # server action check-in
│   └── leaderboard.ts            # server action fetch leaderboard
├── lib/
│   ├── prisma.ts                 # prisma client singleton
│   ├── date.ts                   # util getWIBDate(), dsb
│   └── auth.ts                   # config NextAuth
├── components/
│   ├── streak-counter.tsx
│   ├── activity-calendar.tsx
│   └── leaderboard-table.tsx
prisma/
├── schema.prisma
└── seed.ts
docs/
├── PRD.md
├── SCHEMA.md
├── DECISIONS.md
    DESIGN.MD
└── TASKS.md
```

## Konvensi Kode

- **Naming**: `camelCase` untuk variabel/fungsi, `PascalCase` untuk komponen React, `kebab-case` untuk nama file
- **Server actions**: selalu diawali `"use server"`, ditaruh di `src/actions/`, bukan inline di komponen
- **Prisma client**: selalu import dari `src/lib/prisma.ts` (singleton pattern) — **jangan** `new PrismaClient()` di banyak tempat, ini menyebabkan connection pool exhaustion terutama di serverless/Vercel
- **Tanggal & waktu**: SELALU gunakan util `getWIBDate()` dari `src/lib/date.ts` untuk menentukan "hari ini". **Jangan** pakai `new Date()` mentah untuk logic streak — server Vercel berjalan di UTC, bukan WIB
- **Environment variables**: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — semua di `.env.local`, jangan pernah commit file ini

## Command Penting

```bash
pnpm install
pnpm dev
pnpm prisma generate       # generate Prisma Client setelah ubah schema
pnpm prisma migrate dev    # buat & jalankan migration saat development
pnpm prisma db seed        # jalankan seed.ts
pnpm build                 # cek build sebelum push, terutama sebelum deploy
```

## Aturan Ketat (jangan dilanggar AI maupun manusia)

1. **Jangan ubah `prisma/schema.prisma` tanpa membuat migration.** Selalu jalankan `pnpm prisma migrate dev --name <nama_perubahan>` setelah edit schema.
2. **Jangan hardcode logic timezone.** Semua perhitungan "hari" untuk streak harus lewat `getWIBDate()`.
3. **Jangan buat API route baru** untuk logic yang bisa jadi server action, kecuali ada kebutuhan spesifik (misal webhook eksternal).
4. **Jangan expose `DATABASE_URL` atau secret lain** ke client component atau ke response API.
5. **Selalu idempotent untuk check-in** — user yang check-in 2x di hari yang sama tidak boleh menambah poin/streak dua kali.
6. **Poin & streak dihitung dari `PointsLog`**, bukan field statis yang gampang tidak sinkron — lihat `docs/SCHEMA.md` untuk detail alasan desain ini.

## Ketika Ragu

- Kalau ada keputusan desain/teknis baru yang diambil selama development (ganti library, ubah pendekatan, dsb), **catat di `docs/DECISIONS.md`** beserta alasannya — bukan cuma diam-diam diubah.
- Kalau requirement tidak jelas, cek `docs/PRD.md` dulu sebelum menebak.
- Progress harian dicatat di `docs/TASKS.md`.
