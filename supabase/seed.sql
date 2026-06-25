-- =====================================================================
-- SIMA BAZNAS — Seed Data
-- Jalankan SETELAH supabase/migrations/0001_schema.sql berhasil dijalankan.
-- Aman dijalankan berulang kali (idempotent) berkat ON CONFLICT DO NOTHING
-- dan penggunaan UUID tetap untuk kategori & lokasi.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. KATEGORI ASET
-- ---------------------------------------------------------------------
insert into public.kategori_aset (id, nama, deskripsi) values
  ('11111111-1111-1111-1111-000000000001', 'Elektronik & TI', 'Perangkat komputer, jaringan, dan elektronik kantor'),
  ('11111111-1111-1111-1111-000000000002', 'Kendaraan', 'Kendaraan dinas & operasional roda dua/empat'),
  ('11111111-1111-1111-1111-000000000003', 'Furnitur & Perlengkapan', 'Perabot dan perlengkapan kerja'),
  ('11111111-1111-1111-1111-000000000004', 'Bangunan & Gedung', 'Gedung, ruang, dan bangunan milik BAZNAS'),
  ('11111111-1111-1111-1111-000000000005', 'Lainnya', 'Aset penunjang operasional lainnya')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- 2. LOKASI
-- ---------------------------------------------------------------------
insert into public.lokasi (id, nama, alamat) values
  ('22222222-2222-2222-2222-000000000001', 'Kantor Pusat — Lt. 1', 'Jl. Kebon Sirih No. 57, Jakarta Pusat'),
  ('22222222-2222-2222-2222-000000000002', 'Kantor Pusat — Lt. 2', 'Jl. Kebon Sirih No. 57, Jakarta Pusat'),
  ('22222222-2222-2222-2222-000000000003', 'Kantor Pusat — Lt. 3', 'Jl. Kebon Sirih No. 57, Jakarta Pusat'),
  ('22222222-2222-2222-2222-000000000004', 'Kantor Pusat — Lt. 4', 'Jl. Kebon Sirih No. 57, Jakarta Pusat'),
  ('22222222-2222-2222-2222-000000000005', 'Gudang Arsip', 'Jl. Kebon Sirih No. 57, Jakarta Pusat'),
  ('22222222-2222-2222-2222-000000000006', 'Ruang Server', 'Jl. Kebon Sirih No. 57, Jakarta Pusat'),
  ('22222222-2222-2222-2222-000000000007', 'Ruang Rapat Utama', 'Jl. Kebon Sirih No. 57, Jakarta Pusat'),
  ('22222222-2222-2222-2222-000000000008', 'Garasi Kantor Pusat', 'Jl. Kebon Sirih No. 57, Jakarta Pusat'),
  ('22222222-2222-2222-2222-000000000009', 'Kantor Cabang Bandung', 'Jl. Soekarno-Hatta No. 12, Bandung'),
  ('22222222-2222-2222-2222-00000000000a', 'Kantor Cabang Surabaya', 'Jl. Darmo No. 88, Surabaya')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- 3. ASET (42 baris)
-- ---------------------------------------------------------------------
insert into public.aset
  (kode, nama, kategori_id, lokasi_id, unit_kerja, tanggal_perolehan,
   nilai_perolehan, kondisi, status, penanggung_jawab, catatan)
values
  ('BZ-ELK-0207', 'Server Rack Dell PowerEdge T340', '11111111-1111-1111-1111-000000000001', '22222222-2222-2222-2222-000000000009', 'Divisi TI', '2025-11-05', 65833100, 'Baik', 'Digunakan', 'Siti Nurhaliza', NULL),
  ('BZ-ELK-0214', 'Telepon IP Yealink', '11111111-1111-1111-1111-000000000001', '22222222-2222-2222-2222-000000000004', 'Divisi SDM', '2026-02-22', 1786500, 'Baik', 'Digunakan', 'Wahyu Hidayat', NULL),
  ('BZ-ELK-0221', 'AC Split Panasonic 1 PK', '11111111-1111-1111-1111-000000000001', '22222222-2222-2222-2222-000000000007', 'Divisi Keuangan', '2026-04-03', 3610600, 'Baik', 'Digunakan', 'Dedi Kurniawan', NULL),
  ('BZ-ELK-0228', 'AC Split Daikin 1.5 PK', '11111111-1111-1111-1111-000000000001', '22222222-2222-2222-2222-000000000002', 'Divisi Keuangan', '2025-10-17', 6050900, 'Baik', 'Digunakan', 'Maya Puspita', NULL),
  ('BZ-ELK-0235', 'Scanner Dokumen Fujitsu', '11111111-1111-1111-1111-000000000001', '22222222-2222-2222-2222-000000000007', 'Divisi Pengumpulan', '2026-02-16', 6642300, 'Baik', 'Digunakan', 'Fajar Ramadhan', NULL),
  ('BZ-ELK-0242', 'UPS APC 1000VA', '11111111-1111-1111-1111-000000000001', '22222222-2222-2222-2222-000000000001', 'Sekretariat', '2025-07-20', 3092500, 'Baik', 'Digunakan', 'Budi Santoso', NULL),
  ('BZ-ELK-0249', 'Proyektor Epson EB-X06', '11111111-1111-1111-1111-000000000001', '22222222-2222-2222-2222-000000000007', 'Divisi Keuangan', '2025-10-02', 5761400, 'Perlu Pemeliharaan', 'Digunakan', 'Indah Lestari', 'Dijadwalkan pemeliharaan rutin.'),
  ('BZ-ELK-0256', 'PC Desktop HP ProDesk', '11111111-1111-1111-1111-000000000001', '22222222-2222-2222-2222-000000000005', 'Sekretariat', '2025-10-15', 10390900, 'Baik', 'Digunakan', 'Ahmad Fauzan', NULL),
  ('BZ-ELK-0263', 'Switch Jaringan Cisco 24 Port', '11111111-1111-1111-1111-000000000001', '22222222-2222-2222-2222-000000000008', 'Divisi SDM', '2024-12-16', 10121500, 'Baik', 'Digunakan', 'Dedi Kurniawan', NULL),
  ('BZ-ELK-0270', 'Printer Epson L3210', '11111111-1111-1111-1111-000000000001', '22222222-2222-2222-2222-000000000006', 'Divisi Pengumpulan', '2025-06-19', 2524200, 'Baik', 'Digunakan', 'Budi Santoso', NULL),
  ('BZ-ELK-0277', 'Printer Canon G2010', '11111111-1111-1111-1111-000000000001', '22222222-2222-2222-2222-000000000004', 'Divisi TI', '2026-03-15', 2859400, 'Baik', 'Digunakan', 'Maya Puspita', NULL),
  ('BZ-ELK-0284', 'CCTV Hikvision (Set 8 Kamera)', '11111111-1111-1111-1111-000000000001', '22222222-2222-2222-2222-000000000008', 'Divisi Pendistribusian', '2026-04-08', 21271700, 'Baik', 'Digunakan', 'Dedi Kurniawan', NULL),
  ('BZ-ELK-0291', 'Laptop Lenovo ThinkPad E14', '11111111-1111-1111-1111-000000000001', '22222222-2222-2222-2222-00000000000a', 'Divisi SDM', '2026-01-09', 14882300, 'Baik', 'Digunakan', 'Wahyu Hidayat', NULL),
  ('BZ-ELK-0298', 'Laptop Asus Vivobook', '11111111-1111-1111-1111-000000000001', '22222222-2222-2222-2222-000000000001', 'Divisi Pengumpulan', '2025-10-06', 7718600, 'Rusak', 'Disimpan', 'Rina Marlina', 'Menunggu tindak lanjut perbaikan/penghapusan.'),
  ('BZ-KDR-0207', 'Mitsubishi Pajero Sport', '11111111-1111-1111-1111-000000000002', '22222222-2222-2222-2222-000000000001', 'Sekretariat', '2025-09-09', 511241700, 'Rusak', 'Digunakan', 'Ahmad Fauzan', 'Menunggu tindak lanjut perbaikan/penghapusan.'),
  ('BZ-KDR-0214', 'Honda Vario 125 — Operasional', '11111111-1111-1111-1111-000000000002', '22222222-2222-2222-2222-000000000005', 'Divisi SDM', '2025-12-20', 21759500, 'Baik', 'Digunakan', 'Rina Marlina', NULL),
  ('BZ-KDR-0221', 'Daihatsu Gran Max Box', '11111111-1111-1111-1111-000000000002', '22222222-2222-2222-2222-000000000003', 'Divisi TI', '2025-05-14', 173929200, 'Perlu Pemeliharaan', 'Digunakan', 'Ahmad Fauzan', 'Dijadwalkan pemeliharaan rutin.'),
  ('BZ-KDR-0228', 'Toyota Avanza — Operasional', '11111111-1111-1111-1111-000000000002', '22222222-2222-2222-2222-000000000006', 'Divisi Pendistribusian', '2025-02-19', 217823500, 'Perlu Pemeliharaan', 'Digunakan', 'Fajar Ramadhan', 'Dijadwalkan pemeliharaan rutin.'),
  ('BZ-KDR-0235', 'Toyota Hilux Double Cabin', '11111111-1111-1111-1111-000000000002', '22222222-2222-2222-2222-000000000002', 'Divisi Keuangan', '2026-03-07', 347805800, 'Perlu Pemeliharaan', 'Digunakan', 'Dedi Kurniawan', 'Dijadwalkan pemeliharaan rutin.'),
  ('BZ-KDR-0242', 'Yamaha NMAX — Operasional', '11111111-1111-1111-1111-000000000002', '22222222-2222-2222-2222-000000000008', 'Divisi Pengumpulan', '2025-07-25', 33578500, 'Perlu Pemeliharaan', 'Digunakan', 'Fajar Ramadhan', 'Dijadwalkan pemeliharaan rutin.'),
  ('BZ-FRN-0207', 'Whiteboard Magnetic', '11111111-1111-1111-1111-000000000003', '22222222-2222-2222-2222-000000000006', 'Divisi SDM', '2025-12-20', 1155300, 'Baik', 'Digunakan', 'Fajar Ramadhan', NULL),
  ('BZ-FRN-0214', 'Filing Cabinet 4 Laci', '11111111-1111-1111-1111-000000000003', '22222222-2222-2222-2222-00000000000a', 'Divisi TI', '2025-10-24', 3003000, 'Baik', 'Digunakan', 'Budi Santoso', NULL),
  ('BZ-FRN-0221', 'Lemari Arsip Besi 4 Pintu', '11111111-1111-1111-1111-000000000003', '22222222-2222-2222-2222-000000000004', 'Divisi Pengumpulan', '2025-05-23', 3811700, 'Baik', 'Digunakan', 'Siti Nurhaliza', NULL),
  ('BZ-FRN-0228', 'Kursi Tunggu Tamu (Set 4 Unit)', '11111111-1111-1111-1111-000000000003', '22222222-2222-2222-2222-000000000008', 'Divisi Pendistribusian', '2026-04-10', 6732100, 'Baik', 'Digunakan', 'Fajar Ramadhan', NULL),
  ('BZ-FRN-0235', 'Sofa Ruang Tamu', '11111111-1111-1111-1111-000000000003', '22222222-2222-2222-2222-000000000008', 'Divisi SDM', '2026-04-22', 10391300, 'Baik', 'Digunakan', 'Budi Santoso', NULL),
  ('BZ-FRN-0242', 'Meja Kerja Staf (Set 6 Unit)', '11111111-1111-1111-1111-000000000003', '22222222-2222-2222-2222-000000000008', 'Sekretariat', '2025-09-14', 10659300, 'Baik', 'Digunakan', 'Siti Nurhaliza', NULL),
  ('BZ-FRN-0249', 'Meja Rapat Besar', '11111111-1111-1111-1111-000000000003', '22222222-2222-2222-2222-000000000002', 'Divisi Pendistribusian', '2026-03-23', 9644900, 'Baik', 'Digunakan', 'Budi Santoso', NULL),
  ('BZ-FRN-0256', 'Rak Buku Besi', '11111111-1111-1111-1111-000000000003', '22222222-2222-2222-2222-000000000008', 'Divisi Pendistribusian', '2025-12-24', 2167500, 'Baik', 'Digunakan', 'Ahmad Fauzan', NULL),
  ('BZ-FRN-0263', 'Kursi Kantor Ergonomis (Set 10 Unit)', '11111111-1111-1111-1111-000000000003', '22222222-2222-2222-2222-000000000009', 'Divisi Pengumpulan', '2025-03-24', 15606600, 'Baik', 'Digunakan', 'Ahmad Fauzan', NULL),
  ('BZ-FRN-0270', 'Whiteboard Magnetic', '11111111-1111-1111-1111-000000000003', '22222222-2222-2222-2222-000000000004', 'Divisi SDM', '2026-03-31', 1093600, 'Baik', 'Digunakan', 'Siti Nurhaliza', NULL),
  ('BZ-FRN-0277', 'Filing Cabinet 4 Laci', '11111111-1111-1111-1111-000000000003', '22222222-2222-2222-2222-000000000008', 'Divisi Keuangan', '2025-09-02', 2801700, 'Rusak', 'Disimpan', 'Hendra Wijaya', 'Menunggu tindak lanjut perbaikan/penghapusan.'),
  ('BZ-FRN-0284', 'Lemari Arsip Besi 4 Pintu', '11111111-1111-1111-1111-000000000003', '22222222-2222-2222-2222-000000000004', 'Divisi Keuangan', '2025-01-28', 4710500, 'Baik', 'Digunakan', 'Budi Santoso', NULL),
  ('BZ-BGN-0207', 'Gudang Logistik Bantuan', '11111111-1111-1111-1111-000000000004', '22222222-2222-2222-2222-000000000009', 'Divisi Pendistribusian', '2025-02-09', 1223976800, 'Baik', 'Digunakan', 'Siti Nurhaliza', NULL),
  ('BZ-BGN-0214', 'Gedung Kantor Pusat', '11111111-1111-1111-1111-000000000004', '22222222-2222-2222-2222-000000000002', 'Sekretariat', '2026-01-08', 8634404700, 'Perlu Pemeliharaan', 'Disimpan', 'Budi Santoso', 'Dijadwalkan pemeliharaan rutin.'),
  ('BZ-BGN-0221', 'Mushola Kantor', '11111111-1111-1111-1111-000000000004', '22222222-2222-2222-2222-00000000000a', 'Divisi Pengumpulan', '2026-04-26', 847467000, 'Perlu Pemeliharaan', 'Digunakan', 'Wahyu Hidayat', 'Dijadwalkan pemeliharaan rutin.'),
  ('BZ-BGN-0228', 'Gedung Kantor Layanan Mustahik', '11111111-1111-1111-1111-000000000004', '22222222-2222-2222-2222-000000000005', 'Divisi Pendistribusian', '2026-03-07', 4751444500, 'Baik', 'Digunakan', 'Maya Puspita', NULL),
  ('BZ-LNN-0207', 'Genset Diesel 10kVA', '11111111-1111-1111-1111-000000000005', '22222222-2222-2222-2222-00000000000a', 'Divisi Pengumpulan', '2025-11-15', 46901600, 'Baik', 'Digunakan', 'Ahmad Fauzan', NULL),
  ('BZ-LNN-0214', 'Kursi Roda Bantuan (Set 5 Unit)', '11111111-1111-1111-1111-000000000005', '22222222-2222-2222-2222-000000000002', 'Divisi Pendistribusian', '2026-02-19', 4828800, 'Baik', 'Digunakan', 'Maya Puspita', NULL),
  ('BZ-LNN-0221', 'Tenda Posko Bencana', '11111111-1111-1111-1111-000000000005', '22222222-2222-2222-2222-00000000000a', 'Sekretariat', '2026-06-03', 6935800, 'Perlu Pemeliharaan', 'Digunakan', 'Fajar Ramadhan', 'Dijadwalkan pemeliharaan rutin.'),
  ('BZ-LNN-0228', 'Mesin Fotokopi Canon', '11111111-1111-1111-1111-000000000005', '22222222-2222-2222-2222-000000000003', 'Divisi Keuangan', '2025-04-28', 35269200, 'Baik', 'Digunakan', 'Ahmad Fauzan', NULL),
  ('BZ-LNN-0235', 'Dispenser Air Galon', '11111111-1111-1111-1111-000000000005', '22222222-2222-2222-2222-000000000004', 'Sekretariat', '2026-03-18', 876600, 'Baik', 'Digunakan', 'Maya Puspita', NULL),
  ('BZ-LNN-0242', 'Mesin Penghancur Dokumen', '11111111-1111-1111-1111-000000000005', '22222222-2222-2222-2222-000000000005', 'Divisi Pengumpulan', '2025-10-03', 4239100, 'Perlu Pemeliharaan', 'Digunakan', 'Ahmad Fauzan', 'Dijadwalkan pemeliharaan rutin.')
on conflict (kode) do nothing;

-- ---------------------------------------------------------------------
-- 4. AKTIVITAS LOG (contoh riwayat aktivitas terbaru)
-- ---------------------------------------------------------------------
insert into public.aktivitas_log (aset_id, aksi, tipe, pelaku_nama, keterangan, created_at)
values
  ((select id from public.aset where kode = 'BZ-LNN-0207'), 'menambahkan aset baru', 'tambah', 'Siti Nurhaliza', 'Genset Diesel 10kVA', now() - interval '10 minutes'),
  ((select id from public.aset where kode = 'BZ-FRN-0277'), 'memperbarui status aset', 'ubah', 'Ahmad Fauzan', 'Filing Cabinet 4 Laci', now() - interval '70 minutes'),
  ((select id from public.aset where kode = 'BZ-BGN-0207'), 'melaporkan kerusakan', 'peringatan', 'Budi Santoso', 'Gudang Logistik Bantuan', now() - interval '180 minutes'),
  ((select id from public.aset where kode = 'BZ-FRN-0284'), 'menyelesaikan pemeliharaan', 'selesai', 'Fajar Ramadhan', 'Lemari Arsip Besi 4 Pintu', now() - interval '1500 minutes'),
  ((select id from public.aset where kode = 'BZ-FRN-0270'), 'menghapuskan aset', 'hapus', 'Rina Marlina', 'Whiteboard Magnetic', now() - interval '1450 minutes'),
  ((select id from public.aset where kode = 'BZ-LNN-0214'), 'memindahkan lokasi aset', 'ubah', 'Dedi Kurniawan', 'Kursi Roda Bantuan (Set 5 Unit)', now() - interval '2900 minutes'),
  ((select id from public.aset where kode = 'BZ-KDR-0242'), 'mencatat hasil audit aset', 'ubah', 'Maya Puspita', 'Yamaha NMAX — Operasional', now() - interval '4200 minutes'),
  ((select id from public.aset where kode = 'BZ-ELK-0249'), 'menambahkan aset baru', 'tambah', 'Hendra Wijaya', 'Proyektor Epson EB-X06', now() - interval '5800 minutes');

