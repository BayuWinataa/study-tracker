# Ajarin - Study Tracker & Gamification

## Overview

* **Fitur yang dibuat**: Sistem Autentikasi (Google OAuth & Email/Password), Daily Check-in & Streak System (dilengkapi fitur *Freeze/Shield*), Papan Peringkat Global (*Leaderboard*), Sistem Lencana (Badge Case), dan *Focus Room* (Timer Pomodoro 25 menit yang otomatis memberikan +20 poin saat selesai).
* **Masalah yang ingin diselesaikan**: Pelajar sering kehilangan motivasi untuk belajar konsisten setiap hari karena tidak ada bentuk apresiasi instan atau pelacakan rekam jejak yang menarik secara visual.
* **Mengapa solusi ini dapat meningkatkan engagement siswa**: Aplikasi ini memberikan *instant gratification* secara langsung. Saat selesai belajar, konfeti akan meledak dan poin bertambah. Tampilan bergaya *Brutalist/Minimalist* menjauhkan pengguna dari distraksi, sementara *Leaderboard* memancing jiwa kompetitif yang sehat antar pelajar.

## Technical Details

### Tech Stack
* **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, LottieFiles React, Canvas Confetti.
* **Backend**: Next.js Server Actions, NextAuth.js v5 (Auth.js).
* **Database & ORM**: PostgreSQL (via Neon Database) & Prisma ORM.
* **Form Validation**: React Hook Form & Zod.
* **UI Components**: shadcn/ui (Radix UI) & React Icons.
* **Testing**: Vitest.

### Architecture & Decisions
* **Struktur Project (App Router)**: Memisahkan Halaman Pemasaran (`/`) dari Halaman Aplikasi (`/dashboard`). Hal ini dilakukan agar logika autentikasi dan antarmuka berat tidak membebani halaman pendaratan (Landing Page) yang harus dimuat dengan sangat cepat.
* **Database Relasional (PostgreSQL)**: Dipilih karena data seperti rekaman poin (*PointsLog*), kehadiran harian (*CheckIn*), dan rentetan (*Streak*) memiliki kaitan yang kuat. Menggunakan relasi dan *unique constraint* (seperti `@@unique([userId, date])`) di level *database* sangat penting untuk menghindari manipulasi data (*double points*).
* **Server Actions**: Tidak ada API Routes (REST) klasik. Semua manipulasi data (*write operations*) dilakukan melalui Server Actions dengan keamanan sisi server, diikuti oleh `revalidatePath` agar UI segera mensinkronisasi data *real-time* tanpa perlu manajemen state (Redux/Zustand) yang rumit.

### Running Locally
1. Kloning repositori ini ke komputer Anda.
2. Buat file `.env.local` di *root directory* dan tambahkan *environment variables*:
   - `DATABASE_URL` (URL koneksi ke Postgres Anda)
   - `AUTH_SECRET` (Kunci rahasia acak untuk sesi pengguna)
   - `AUTH_GOOGLE_ID` & `AUTH_GOOGLE_SECRET` (Untuk login dengan Google)
3. Jalankan perintah `pnpm install`.
4. Dorong skema database ke server menggunakan `pnpm exec prisma db push`.
5. Mulai server pengembangan dengan perintah `pnpm dev`.

## Development Process

### AI Usage
* **AI/Agent yang digunakan**: Deepmind Antigravity Agent.
* **Workflow yang digunakan**: Pendekatan *Agentic AI* terpandu (*Human-in-the-loop*). Pengguna bertindak sebagai _Product Manager/Tech Lead_ yang memberikan instruksi spesifik, dan AI bertindak sebagai eksekutor penuh (*Full-Stack Engineer*) yang menulis kode, menjalankan perintah terminal, dan mendiagnosis log *error*.
* **Bagaimana AI membantu selama pengerjaan**: AI sangat otonom—mulai dari perancangan arsitektur *database* Prisma, mendesain UI/UX yang kompleks (Bento Grid, Brutalist UI, Animasi Lottie), mengeksekusi integrasi *third-party* kompleks seperti Zod dan RHF, hingga menemukan akar masalah pada log Vercel secara mandiri.

### Challenges & Tradeoffs
* **Tantangan Terbesar**: Mencegah *race condition* atau kecurangan pengguna (misal: menekan tombol *check-in* berkali-kali sangat cepat untuk melipatgandakan poin), dan menyelesaikan konflik *type-checking* (TypeScript) akibat perbedaan versi antara pustaka `zod` terbaru dengan *resolver* dari RHF yang menggagalkan proses *build* di CI/CD Vercel.
* **Bagaimana mengatasinya**: Mengimplementasikan validasi *server-side* yang ketat beserta *constraint unique* di tingkat *database*, serta menggunakan *type casting* (`as any`) secara terukur untuk membypass kesalahan tipe bawaan *library*.
* **Kompromi (Tradeoffs)**: Demi menyelesaikan fitur tepat waktu, logika Timer Pomodoro (*countdown*) saat ini 100% bergantung pada lapisan klien (*Client-side*). Jika pengguna me-refresh halaman, timer akan mengulang kembali.

### Future Improvements
1. Sinkronisasi status timer lintas perangkat via *real-time database* / *WebSocket*.
2. Fitur *Quests* (misi harian spesifik seperti "Selesaikan 3 Pomodoro hari ini").
3. Halaman profil publik agar *user* bisa memamerkan koleksi *Badge* mereka kepada teman.

## AI Conversation Summary

* **Tujuan & Ide Awal Project**: Membangun "Ajarin", platform pelacak kebiasaan belajar harian bergaya modern/brutalist untuk membangun rutinitas konsisten melalui metode gamifikasi yang elegan (tanpa elemen kekanak-kanakan).
* **Fitur yang Diimplementasikan**: Autentikasi Google/Kredensial, fitur absensi harian (*Check-In*), sistem pertahanan rentetan (*Streak Freeze*), koleksi pencapaian (*Badge Case*), Papan Peringkat Global (*Leaderboard*), dan *Focus Room* (Timer Pomodoro dengan apresiasi poin otomatis).
* **Keputusan Teknis**: Next.js App Router dengan Server Actions dipasangkan dengan PostgreSQL (Prisma). Alasannya agar status aplikasi lebih mudah diprediksi dan terhindar dari kerumitan merancang *client-state management*. Semua perubahan di sisi UI dikelola melalui sinkronisasi *cache* mutakhir.
* **Bug/Masalah yang Ditemukan**: 
  1. *Build error* di Vercel akibat ketidakcocokan *type definition* pada `zodResolver`.
  2. Poin Pomodoro sempat tidak bertambah pasca-penyelesaian karena `Prisma Client` di Node.js (saat proses *dev*) gagal mendeteksi enum `FOCUS_SESSION` baru.
  3. Kesalahan komputasi tanggal pada diagram Chart (error "Expected 0 arguments") dan masalah pergeseran hari yang tidak akurat karena ketidaksesuaian zona waktu server dengan WIB.
* **Cara Masalah Diselesaikan**: 
  1. Melakukan *cast* argumen dengan pengecualian tipe (`registerSchema as any`) untuk lolos dari *TypeScript checker* tanpa merusak fungsi validasi di *runtime*.
  2. Mengeksekusi ulang kompilasi skema dengan `pnpm exec prisma generate` serta me-restart server Next.js agar tipe data *database* yang baru segera dimuat ke dalam memori aplikasi.
  3. Memodifikasi fungsi utilitas `getWIBDate` agar dapat memproses parameter *custom date*, serta beralih menggunakan `.getUTCDay()` alih-alih `.getDay()` biasa untuk mengamankan data kalender UTC dari interferensi *local time* server.
* **Peran AI Selama Proses**: AI beroperasi layaknya *Senior Full-Stack Engineer*, dari merencanakan *Implementation Plan*, melacak masalah langsung dari bacaan *terminal output*, mengeksekusi integrasi *React Hook Form*, hingga menyusun *styling* aplikasi secara menyeluruh dan independen.
