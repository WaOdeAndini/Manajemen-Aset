import type {
  KondisiAset,
  StatusAset,
  TipeAktivitas,
  PeranPengguna,
  TipePengajuan,
  StatusPengajuan,
} from "@/lib/supabase/types";

export type { KondisiAset, StatusAset, TipeAktivitas, PeranPengguna, TipePengajuan, StatusPengajuan };

export interface Aset { //ini yg diedit
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  kategoriId: string | null;
  lokasi: string;
  lokasiId: string | null;
  unitKerja: string;
  tanggalPerolehan: string;
  nilaiPerolehan: number;
  kondisi: KondisiAset;
  status: StatusAset;
  penanggungJawab: string;
  catatan: string | null;
}

export interface AktivitasItem {
  id: string;
  aksi: string;
  objek: string;
  pelaku: string;
  waktu: string;
  tipe: TipeAktivitas;
}

export interface RingkasanStat {
  totalAset: number;
  totalNilai: number;
  perluPemeliharaan: number;
  rusak: number;
  pertumbuhanBulanIni: number;
}

export interface KategoriRingkasan {
  kategori: string;
  jumlah: number;
  nilai: number;
}

export interface KondisiRingkasanItem {
  name: KondisiAset;
  value: number;
  color: string;
}

export interface TrenBulanan {
  bulan: string;
  jumlah: number;
}

export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  role: PeranPengguna;
  unitKerja: string | null;
  initials: string;
}

export interface AsetOption {
  id: string;
  kode: string;
  nama: string;
  lokasiId: string | null;
  lokasiNama: string;
  kategoriId: string | null;
  kategoriNama: string;
}

export interface LokasiOption {
  id: string;
  nama: string;
}

export interface Pengajuan {
  id: string;
  tipe: TipePengajuan;
  asetId: string;
  asetNama: string;
  asetKode: string;
  pemohonId: string;
  pemohonNama: string;
  judul: string;
  deskripsi: string | null;
  kondisiDilaporkan: "Perlu Pemeliharaan" | "Rusak" | null;
  tanggalMulai: string | null;
  tanggalSelesai: string | null;
  lokasiAsalNama: string | null;
  lokasiTujuanNama: string | null;
  status: StatusPengajuan;
  catatanAdmin: string | null;
  createdAt: string;
}

export interface NotifikasiItem {
  id: string;
  pengajuanId: string | null;
  judul: string;
  pesan: string | null;
  dibaca: boolean;
  createdAt: string;
}
