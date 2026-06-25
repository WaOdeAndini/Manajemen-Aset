-- =====================================================================
-- SIMA BAZNAS — Modul Pengajuan Staf & Notifikasi Admin
-- Jalankan SETELAH 0001_schema.sql.
--
-- Mencakup 3 jenis pengajuan dari staf:
--   1. keluhan     — laporan kerusakan/keluhan terhadap suatu aset
--   2. peminjaman  — pengajuan penggunaan/peminjaman aset
--   3. pemindahan  — pelaporan pemindahan lokasi aset
-- Setiap pengajuan baru otomatis membuat notifikasi untuk admin DAN
-- entri di `aktivitas_log` (lewat trigger), tanpa perlu logika tambahan
-- di sisi aplikasi.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. HELPER: role pengguna saat ini (dipakai di RLS policy di bawah)
-- ---------------------------------------------------------------------
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---------------------------------------------------------------------
-- 1. PENGAJUAN_ASET
-- ---------------------------------------------------------------------
create table if not exists public.pengajuan_aset (
  id uuid primary key default gen_random_uuid(),
  tipe text not null check (tipe in ('keluhan', 'peminjaman', 'pemindahan')),
  aset_id uuid not null references public.aset (id) on delete cascade,
  pemohon_id uuid not null references public.profiles (id) on delete cascade,
  judul text not null,
  deskripsi text,
  -- khusus tipe = 'keluhan': perkiraan kondisi aset menurut pelapor
  kondisi_dilaporkan text check (kondisi_dilaporkan in ('Perlu Pemeliharaan', 'Rusak')),
  -- khusus tipe = 'peminjaman'
  tanggal_mulai date,
  tanggal_selesai date,
  -- khusus tipe = 'pemindahan'
  lokasi_asal_id uuid references public.lokasi (id),
  lokasi_tujuan_id uuid references public.lokasi (id),
  status text not null default 'menunggu'
    check (status in ('menunggu', 'disetujui', 'ditolak', 'selesai')),
  catatan_admin text,
  diproses_oleh uuid references public.profiles (id),
  diproses_pada timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pengajuan_aset_pemohon_idx on public.pengajuan_aset (pemohon_id);
create index if not exists pengajuan_aset_status_idx on public.pengajuan_aset (status);
create index if not exists pengajuan_aset_aset_id_idx on public.pengajuan_aset (aset_id);
create index if not exists pengajuan_aset_created_at_idx on public.pengajuan_aset (created_at desc);

drop trigger if exists pengajuan_aset_set_updated_at on public.pengajuan_aset;
create trigger pengajuan_aset_set_updated_at
  before update on public.pengajuan_aset
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 2. NOTIFIKASI (khusus admin)
-- ---------------------------------------------------------------------
create table if not exists public.notifikasi (
  id uuid primary key default gen_random_uuid(),
  pengajuan_id uuid references public.pengajuan_aset (id) on delete cascade,
  judul text not null,
  pesan text,
  dibaca boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifikasi_created_at_idx on public.notifikasi (created_at desc);
create index if not exists notifikasi_dibaca_idx on public.notifikasi (dibaca);

-- ---------------------------------------------------------------------
-- 3. TRIGGER: setiap pengajuan baru -> notifikasi admin + aktivitas_log
-- ---------------------------------------------------------------------
create or replace function public.notify_admin_pengajuan_baru()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_aset_nama text;
  v_pemohon_nama text;
  v_judul text;
  v_pesan text;
  v_tipe_aktivitas text;
begin
  select nama into v_aset_nama from public.aset where id = new.aset_id;
  select full_name into v_pemohon_nama from public.profiles where id = new.pemohon_id;
  v_pemohon_nama := coalesce(v_pemohon_nama, 'Staf');
  v_aset_nama := coalesce(v_aset_nama, 'aset');

  if new.tipe = 'keluhan' then
    v_judul := 'Laporan kerusakan/keluhan aset baru';
    v_pesan := v_pemohon_nama || ' melaporkan masalah pada ' || v_aset_nama;
    v_tipe_aktivitas := 'peringatan';
  elsif new.tipe = 'peminjaman' then
    v_judul := 'Pengajuan peminjaman aset baru';
    v_pesan := v_pemohon_nama || ' mengajukan peminjaman ' || v_aset_nama;
    v_tipe_aktivitas := 'ubah';
  else
    v_judul := 'Pelaporan pemindahan lokasi aset';
    v_pesan := v_pemohon_nama || ' melaporkan pemindahan lokasi ' || v_aset_nama;
    v_tipe_aktivitas := 'ubah';
  end if;

  insert into public.notifikasi (pengajuan_id, judul, pesan)
  values (new.id, v_judul, v_pesan);

  insert into public.aktivitas_log (aset_id, aksi, tipe, pelaku_id, pelaku_nama, keterangan)
  values (new.aset_id, v_judul, v_tipe_aktivitas, new.pemohon_id, v_pemohon_nama, v_aset_nama);

  return new;
end;
$$;

drop trigger if exists on_pengajuan_created on public.pengajuan_aset;
create trigger on_pengajuan_created
  after insert on public.pengajuan_aset
  for each row
  execute function public.notify_admin_pengajuan_baru();

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.pengajuan_aset enable row level security;
alter table public.notifikasi enable row level security;

-- pengajuan_aset: staf hanya melihat & membuat pengajuan miliknya sendiri;
-- admin bisa melihat & memproses (update status) semua pengajuan.
drop policy if exists "pengajuan_select_own_or_admin" on public.pengajuan_aset;
create policy "pengajuan_select_own_or_admin"
  on public.pengajuan_aset for select
  to authenticated
  using (pemohon_id = auth.uid() or public.current_user_role() = 'admin');

drop policy if exists "pengajuan_insert_own" on public.pengajuan_aset;
create policy "pengajuan_insert_own"
  on public.pengajuan_aset for insert
  to authenticated
  with check (pemohon_id = auth.uid());

drop policy if exists "pengajuan_update_admin" on public.pengajuan_aset;
create policy "pengajuan_update_admin"
  on public.pengajuan_aset for update
  to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- notifikasi: khusus admin (insert hanya lewat trigger di atas, yang
-- berjalan sebagai security definer sehingga tidak butuh policy insert).
drop policy if exists "notifikasi_select_admin" on public.notifikasi;
create policy "notifikasi_select_admin"
  on public.notifikasi for select
  to authenticated
  using (public.current_user_role() = 'admin');

drop policy if exists "notifikasi_update_admin" on public.notifikasi;
create policy "notifikasi_update_admin"
  on public.notifikasi for update
  to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');
