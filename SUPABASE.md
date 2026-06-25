# Menghubungkan SIMA BAZNAS ke Supabase

Dokumen ini menjelaskan cara menyalakan backend Supabase (Auth + Database)
untuk project ini, termasuk login, role admin/staf, dan modul pengajuan +
notifikasi.

## 1. Buat project Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **Project Settings > API**, catat:
   - `Project URL`
   - `anon public key`

## 2. Isi environment variable

```bash
cp .env.local.example .env.local
```

Isi `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
```

## 3. Jalankan migration (skema database)

Buka **SQL Editor** di Supabase Dashboard, jalankan **secara berurutan**:

1. `supabase/migrations/0001_schema.sql`
   → tabel `profiles`, `kategori_aset`, `lokasi`, `aset`, `aktivitas_log` + RLS.
2. `supabase/migrations/0002_pengajuan.sql`
   → tabel `pengajuan_aset`, `notifikasi` + trigger notifikasi otomatis.

> Lebih suka CLI? `supabase db push` (perlu `supabase link` ke project Anda
> lebih dulu) akan menjalankan semua file di `supabase/migrations/` sesuai urutan nama filenya.

## 4. Isi data contoh (seed)

Jalankan `supabase/seed.sql` di SQL Editor **setelah** kedua migration di atas.
Ini akan mengisi:

- 5 kategori aset, 10 lokasi
- 42 aset dengan kombinasi kategori/kondisi/tanggal yang realistis
- 8 entri `aktivitas_log` contoh

Aman dijalankan ulang (pakai `on conflict ... do nothing`).

Ingin data dengan jumlah/komposisi berbeda? Edit lalu jalankan ulang generatornya:

```bash
python3 supabase/generate_seed.py
```

File ini menulis ulang `supabase/seed.sql` — atur konstanta di bagian atas
script (`TARGET_PER_KATEGORI`, daftar lokasi, dll) sesuai kebutuhan.

## 5. Membuat akun admin & staf

Tidak ada form "Daftar" di aplikasi (sengaja — akun dibuatkan oleh
administrator). Cara membuat akun:

1. Supabase Dashboard → **Authentication → Users → Add user** → isi email & password.
2. Trigger `handle_new_user` otomatis membuat baris di tabel `profiles`
   dengan `role = 'admin'` (default).
3. Untuk membuat akun **staf**: buka **Table Editor → profiles**, cari baris
   user yang baru dibuat, ubah kolom `role` menjadi `staf`, dan isi `full_name`
   / `unit_kerja` jika perlu.

Akun dengan `role = 'admin'` masuk ke `/dashboard`. Akun dengan `role = 'staf'`
masuk ke `/staf/pengajuan`. Mengakses area yang salah akan otomatis di-redirect.

## 6. Jalankan aplikasi

```bash
npm install
npm run dev
```

Login di `http://localhost:3000/login` dengan akun yang sudah dibuat.

---

## Arsitektur akses (role-based)

| Path         | Akses        | Keterangan                                   |
|--------------|--------------|-----------------------------------------------|
| `/login`     | Publik       | Form login (Server Action `login`)            |
| `/dashboard/*` | `admin`    | Dashboard, Data Aset, **Pengajuan Staf**, dll  |
| `/staf/*`    | `staf`       | Ajukan Pengajuan, Riwayat Saya                 |

Proteksi berlapis:
- `proxy.ts` (middleware) — menolak request tanpa session ke `/dashboard/*` & `/staf/*`.
- `app/dashboard/layout.tsx` & `app/staf/layout.tsx` — mengambil `profiles.role` dan redirect ke area yang sesuai jika role tidak cocok.

## Modul Pengajuan Staf & Notifikasi Admin

Staf dapat mengajukan 3 jenis hal lewat **`/staf/pengajuan`**, semuanya
disimpan ke satu tabel `pengajuan_aset` (dibedakan kolom `tipe`):

| Tipe          | Form                          | Field khusus                                |
|---------------|--------------------------------|----------------------------------------------|
| `keluhan`     | Laporan kerusakan/keluhan aset | `kondisi_dilaporkan` (Perlu Pemeliharaan/Rusak) |
| `peminjaman`  | Pengajuan penggunaan/peminjaman | `tanggal_mulai`, `tanggal_selesai`           |
| `pemindahan`  | Laporan pemindahan lokasi      | `lokasi_asal_id`, `lokasi_tujuan_id`         |

Status pengajuan: `menunggu → disetujui/ditolak`, lalu `selesai` (khusus
peminjaman, setelah aset dikembalikan).

**Notifikasi otomatis (di database, bukan di kode aplikasi):**
Trigger `on_pengajuan_created` (lihat `0002_pengajuan.sql`) berjalan setiap
ada baris baru di `pengajuan_aset`, dan otomatis:
1. Menulis ke tabel `notifikasi` → muncul di lonceng notifikasi admin
   (`components/layout/notification-bell.tsx`, polling tiap 20 detik).
2. Menulis ke `aktivitas_log` → otomatis tampil juga di panel "Aktivitas
   Terbaru" pada dashboard utama.

Admin meninjau & memproses semua pengajuan di **`/dashboard/pengajuan`**.
Menyetujui pengajuan memberi efek nyata ke tabel `aset` (lihat
`setujuiPengajuan` di `lib/supabase/pengajuan-actions.ts`):
- `keluhan` disetujui → `aset.kondisi` diperbarui sesuai laporan.
- `peminjaman` disetujui → `aset.status = 'Dipinjamkan'` (kembali ke
  `'Digunakan'` saat admin menekan "Tandai Dikembalikan").
- `pemindahan` disetujui → `aset.lokasi_id` dipindah ke lokasi tujuan.

### Meningkatkan ke notifikasi realtime (opsional)

Saat ini notification bell memakai **polling** (setiap 20 detik) supaya
sederhana dan tidak bergantung pada konfigurasi Realtime di project Supabase
Anda. Untuk membuatnya live tanpa polling:

1. Di Supabase Dashboard, aktifkan Realtime untuk tabel `notifikasi`
   (Database → Replication).
2. Di `components/layout/notification-bell.tsx`, ganti `setInterval` dengan:
   ```ts
   const channel = supabase
     .channel("notifikasi-admin")
     .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifikasi" }, () => muat())
     .subscribe();
   ```

## Mutasi yang sudah tersambung nyata ke Supabase

Sebagai referensi pola Server Action + `revalidatePath` di project ini:

| Aksi | File |
|------|------|
| Login / Logout | `lib/supabase/actions.ts` |
| Hapus aset (admin) | `lib/supabase/actions.ts` → `deleteAset` |
| Buat pengajuan (staf) | `lib/supabase/pengajuan-actions.ts` → `buatPengajuan` |
| Setujui / tolak pengajuan (admin) | `lib/supabase/pengajuan-actions.ts` → `setujuiPengajuan`, `tolakPengajuan` |
| Tandai peminjaman selesai (admin) | `lib/supabase/pengajuan-actions.ts` → `tandaiPeminjamanSelesai` |
| Tandai notifikasi dibaca | `lib/supabase/pengajuan-actions.ts` → `tandaiNotifikasiDibaca` |

Form **Tambah/Edit Aset** di `/dashboard/aset` masih UI-only (belum
tersambung) — ikuti pola `buatPengajuan` di atas untuk menyambungkannya.

## Mengganti tipe Database hasil generate otomatis

`lib/supabase/types.ts` ditulis manual agar project ini bisa langsung
jalan tanpa CLI. Setelah project Supabase aktif, sebaiknya generate ulang
dari skema sungguhan:

```bash
npx supabase gen types typescript --project-id <project-id> > lib/supabase/types.ts
```

Lalu sesuaikan kembali alias tipe (`KondisiAset`, `TipePengajuan`, dst.) di
bagian atas file karena hasil generate otomatis tidak menyertakannya.
