-- =====================================================================
-- SIMA BAZNAS — Skema Database
-- Jalankan file ini lebih dulu (lewat Supabase SQL Editor atau CLI)
-- sebelum menjalankan supabase/seed.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. PROFILES
-- Tabel tambahan yang menempel ke auth.users (Supabase Auth) untuk
-- menyimpan data profil & peran pengguna di dalam SIMA.
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'staf')),
  unit_kerja text,
  avatar_url text,
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Profil & peran pengguna SIMA, 1:1 dengan auth.users.';

-- ---------------------------------------------------------------------
-- 2. KATEGORI ASET
-- ---------------------------------------------------------------------
create table if not exists public.kategori_aset (
  id uuid primary key default gen_random_uuid(),
  nama text not null unique,
  deskripsi text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. LOKASI
-- ---------------------------------------------------------------------
create table if not exists public.lokasi (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  alamat text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 4. ASET
-- ---------------------------------------------------------------------
create table if not exists public.aset (
  id uuid primary key default gen_random_uuid(),
  kode text not null unique,
  nama text not null,
  kategori_id uuid references public.kategori_aset (id) on delete set null,
  lokasi_id uuid references public.lokasi (id) on delete set null,
  unit_kerja text,
  tanggal_perolehan date not null default current_date,
  nilai_perolehan numeric(16, 2) not null default 0 check (nilai_perolehan >= 0),
  kondisi text not null default 'Baik'
    check (kondisi in ('Baik', 'Perlu Pemeliharaan', 'Rusak')),
  status text not null default 'Digunakan'
    check (status in ('Digunakan', 'Disimpan', 'Dipinjamkan', 'Dihapuskan')),
  penanggung_jawab text,
  catatan text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aset_kategori_id_idx on public.aset (kategori_id);
create index if not exists aset_lokasi_id_idx on public.aset (lokasi_id);
create index if not exists aset_kondisi_idx on public.aset (kondisi);
create index if not exists aset_tanggal_perolehan_idx on public.aset (tanggal_perolehan);

-- ---------------------------------------------------------------------
-- 5. AKTIVITAS LOG
-- Mencatat aksi pada aset untuk ditampilkan di feed "Aktivitas Terbaru".
-- pelaku_id sengaja boleh NULL (on delete set null) + pelaku_nama
-- didenormalisasi, supaya riwayat tetap terbaca walau akun pelaku dihapus.
-- ---------------------------------------------------------------------
create table if not exists public.aktivitas_log (
  id uuid primary key default gen_random_uuid(),
  aset_id uuid references public.aset (id) on delete set null,
  aksi text not null,
  tipe text not null default 'ubah'
    check (tipe in ('tambah', 'ubah', 'peringatan', 'selesai', 'hapus')),
  pelaku_id uuid references public.profiles (id) on delete set null,
  pelaku_nama text,
  keterangan text,
  created_at timestamptz not null default now()
);

create index if not exists aktivitas_log_created_at_idx on public.aktivitas_log (created_at desc);
create index if not exists aktivitas_log_aset_id_idx on public.aktivitas_log (aset_id);

-- =====================================================================
-- TRIGGERS
-- =====================================================================

-- updated_at otomatis terisi setiap kali baris `aset` diubah.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists aset_set_updated_at on public.aset;
create trigger aset_set_updated_at
  before update on public.aset
  for each row
  execute function public.set_updated_at();

-- Otomatis membuat baris `profiles` setiap kali ada user baru di Supabase
-- Auth (sign up lewat aplikasi, undangan, atau dibuat manual di Studio).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'admin')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- =====================================================================
-- ROW LEVEL SECURITY
-- Sistem ini adalah aplikasi internal (semua pengguna sudah login lewat
-- Supabase Auth dianggap staf/admin BAZNAS), jadi aturan dasarnya:
--   - Wajib login untuk membaca ATAU mengubah data apa pun.
--   - Pengguna hanya bisa mengubah profilnya sendiri.
-- Persempit lebih lanjut berdasarkan kolom `role` bila diperlukan.
-- =====================================================================

alter table public.profiles enable row level security;
alter table public.kategori_aset enable row level security;
alter table public.lokasi enable row level security;
alter table public.aset enable row level security;
alter table public.aktivitas_log enable row level security;

-- profiles
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- kategori_aset
drop policy if exists "kategori_aset_all_authenticated" on public.kategori_aset;
create policy "kategori_aset_all_authenticated"
  on public.kategori_aset for all
  to authenticated
  using (true)
  with check (true);

-- lokasi
drop policy if exists "lokasi_all_authenticated" on public.lokasi;
create policy "lokasi_all_authenticated"
  on public.lokasi for all
  to authenticated
  using (true)
  with check (true);

-- aset
drop policy if exists "aset_all_authenticated" on public.aset;
create policy "aset_all_authenticated"
  on public.aset for all
  to authenticated
  using (true)
  with check (true);

-- aktivitas_log
drop policy if exists "aktivitas_log_all_authenticated" on public.aktivitas_log;
create policy "aktivitas_log_all_authenticated"
  on public.aktivitas_log for all
  to authenticated
  using (true)
  with check (true);
