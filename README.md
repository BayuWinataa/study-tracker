## AI Conversation Summary

**Tujuan & Ide Awal Project**
Membangun "Ajarin Study Tracker", sebuah platform pelacak kebiasaan belajar harian bergaya *Mindful Moments*. Tujuannya bukan sekadar melacak waktu, melainkan membangun rutinitas yang konsisten melalui gamifikasi elegan.

**Fitur yang Direncanakan dan Diimplementasikan**
- **Sistem Autentikasi**: *Login* dan Registrasi menggunakan Google OAuth serta Email/Password (*Credentials Auth*) dengan enkripsi *bcrypt*.
- **Daily Check-In & Streak**: Sistem pelacak kehadiran harian (*streak*) dengan fitur perlindungan bolong (*Freeze/Shield*).
- **Gamifikasi Trophy & Leaderboard**: Sistem piala dinamis yang otomatis terbuka saat mencapai target (*Badge Case*), serta papan peringkat global secara *real-time*.
- **UI/UX Modern**: Desain *Bento Grid*, *Sidebar Layout*, dan interaktivitas tingkat lanjut (*Confetti*, visual kalender).

**Keputusan Teknis & Alasannya**
- **Next.js App Router & Server Actions**: Mengurangi kerumitan *client-side state* dan mempercepat interaksi database.
- **Prisma ORM & PostgreSQL (Neon)**: Relasi data yang kuat. Menggunakan Constraint `@@unique([userId, date])` untuk memastikan integritas data *check-in* harian per pengguna.
- **WIB Time Normalization**: Karena server menyimpan waktu dalam UTC, sebuah utilitas waktu khusus dibuat (`getWIBDate`) untuk memastikan pergantian hari dan pengecekan rentetan (*streak*) akurat sesuai zona waktu Jakarta.

**Bug/Masalah yang Ditemukan & Penyelesaian**
1. **Spam Tombol Check-In (Concurrency Issue)**: Ditemukan *bug* di mana *user* bisa menekan tombol berkali-kali secara instan untuk melipatgandakan poin. Diselesaikan dengan mengganti `upsert` menjadi transaksi atomik `create` yang dilindungi *constraint unique database*.
2. **Auth.js v5 Environment Variables**: Gagal *login* Google karena format *env var* berubah dari `NEXTAUTH_` ke `AUTH_`. Diselesaikan dengan penyesuaian nama *environment*.

**Peran AI Selama Proses Development**
AI bertindak sebagai rekan *pair-programming* penuh—mulai dari arsitek UI/UX yang membangun desain "Mindful Moments" dan tata letak responsif, teknisi *database* yang merancang relasi Prisma dan memperbaiki *race-conditions*, hingga mentor debugging yang menyelesaikan isu kompabilitas rilis terbaru NextAuth v5.
