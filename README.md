# SIMA BAZNAS — Sistem Informasi Manajemen Aset

Dashboard admin + portal staf untuk pengelolaan aset BAZNAS, dibangun dengan
**Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, komponen
**shadcn/ui**, dan **Supabase** (Auth + Database).

➡️ **Setup backend (Supabase, migration, seed, akun admin/staf): lihat [`SUPABASE.md`](./SUPABASE.md).**

## Fitur

### Area Admin (`/dashboard`, role `admin`)
- Dashboard ringkasan: statistik, tren aset, kondisi aset, kategori, aktivitas terbaru.
- Data Aset: tabel + pencarian + filter + hapus (tersambung Supabase).
- **Pengajuan Staf**: tinjau & proses laporan keluhan, peminjaman, dan pemindahan lokasi dari staf — menyetujui pengajuan otomatis memperbarui data aset terkait.
- Notifikasi real-time-ish (polling) saat ada pengajuan baru dari staf.
- Kategori, Lokasi, Laporan, Pengguna, Pengaturan — placeholder, siap dikembangkan.

### Area Staf (`/staf`, role `staf`)
- **Ajukan Pengajuan**: form 3-in-1 (tab) untuk laporan kerusakan/keluhan,
  pengajuan peminjaman/penggunaan, dan pelaporan pemindahan lokasi aset.
- **Riwayat Saya**: status seluruh pengajuan yang pernah diajukan.

### Autentikasi & Otorisasi
- Login via Supabase Auth (email/password), session di-refresh lewat `proxy.ts` (middleware Next.js 16).
- Role disimpan di tabel `profiles` (`admin` | `staf`); masing-masing area saling menolak akses role yang salah.

## Menjalankan proyek

```bash
npm install
cp .env.local.example .env.local   # isi kredensial Supabase Anda
npm run dev
```

Lihat [`SUPABASE.md`](./SUPABASE.md) untuk migration, seed data, dan cara membuat akun admin/staf pertama.

## Struktur penting

```
app/
  login/                       # halaman & server action login
  dashboard/                   # area admin (layout = role guard)
    page.tsx                   # dashboard ringkasan
    aset/                      # data aset (tabel + hapus)
    pengajuan/                 # review pengajuan staf
    kategori/, lokasi/, laporan/, pengguna/, pengaturan/  # placeholder
  staf/                        # area staf (layout = role guard)
    pengajuan/                 # form ajukan keluhan/peminjaman/pemindahan
    riwayat/                   # riwayat pengajuan staf yang login
components/
  layout/                      # Sidebar (role-aware), Header, NotificationBell
  dashboard/                   # StatCard, chart-chart, tabel, review pengajuan
  staf/                        # form pengajuan 3-tab
  shared/                      # badge & tabel pengajuan (dipakai admin+staf)
  ui/                          # komponen dasar ala shadcn/ui
lib/
  supabase/
    client.ts, server.ts        # Supabase client (browser/server)
    middleware.ts               # helper refresh session, dipakai proxy.ts
    queries.ts                  # query + agregasi data dashboard
    actions.ts                  # login, logout, hapus aset
    pengajuan-actions.ts        # buat/setujui/tolak pengajuan, notifikasi
    types.ts                    # tipe Database (hand-written)
  types.ts                      # tipe domain (Aset, Pengajuan, dll)
  nav.ts / nav-staf.ts          # konfigurasi menu sidebar per role
proxy.ts                        # middleware Next.js 16 — proteksi route + refresh session
supabase/
  migrations/0001_schema.sql     # tabel inti (aset, kategori, lokasi, profiles, log)
  migrations/0002_pengajuan.sql  # pengajuan_aset, notifikasi, trigger otomatis
  seed.sql                        # data contoh (jalankan setelah migration)
  generate_seed.py                # script untuk regenerate seed.sql
```

## Menambahkan komponen shadcn/ui lain

Komponen di `components/ui/` ditulis manual mengikuti pola resmi shadcn/ui
(Tailwind v4 + Radix UI), karena registry CLI butuh akses internet yang
dibatasi di environment pembuatan project ini. Jika environment Anda punya
akses internet penuh, Anda tetap bisa menjalankan `npx shadcn@latest add <komponen>`
untuk menambah komponen baru secara konsisten.
