// CATATAN: file ini TIDAK lagi dipakai oleh aplikasi sejak terhubung ke
// Supabase. Disimpan hanya sebagai referensi bentuk data / contoh seed.
// Data asli sekarang berasal dari `lib/supabase/queries.ts`.
//
// Data dummy — siap diganti dengan data dari API/database sesungguhnya.

export type KondisiAset = "Baik" | "Perlu Pemeliharaan" | "Rusak";
export type StatusAset = "Digunakan" | "Disimpan" | "Dipinjamkan" | "Dihapuskan";

export interface Aset {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  lokasi: string;
  unitKerja: string;
  tanggalPerolehan: string;
  nilaiPerolehan: number;
  kondisi: KondisiAset;
  status: StatusAset;
  penanggungJawab: string;
}

export const dataAset: Aset[] = [
  {
    id: "1",
    kode: "BZ-ELK-0231",
    nama: "Laptop Lenovo ThinkPad E14",
    kategori: "Elektronik & TI",
    lokasi: "Kantor Pusat — Lt. 3",
    unitKerja: "Divisi Pengumpulan",
    tanggalPerolehan: "2024-02-11",
    nilaiPerolehan: 12500000,
    kondisi: "Baik",
    status: "Digunakan",
    penanggungJawab: "Siti Nurhaliza",
  },
  {
    id: "2",
    kode: "BZ-KDR-0089",
    nama: "Toyota Avanza B 1542 BZN",
    kategori: "Kendaraan",
    lokasi: "Garasi Kantor Pusat",
    unitKerja: "Divisi Pendistribusian",
    tanggalPerolehan: "2021-08-04",
    nilaiPerolehan: 215000000,
    kondisi: "Perlu Pemeliharaan",
    status: "Digunakan",
    penanggungJawab: "Ahmad Fauzan",
  },
  {
    id: "3",
    kode: "BZ-FRN-0512",
    nama: "Lemari Arsip Besi 4 Pintu",
    kategori: "Furnitur & Perlengkapan",
    lokasi: "Gudang Arsip — Lt. 1",
    unitKerja: "Sekretariat",
    tanggalPerolehan: "2019-05-22",
    nilaiPerolehan: 4200000,
    kondisi: "Baik",
    status: "Disimpan",
    penanggungJawab: "Rina Marlina",
  },
  {
    id: "4",
    kode: "BZ-ELK-0314",
    nama: "Proyektor Epson EB-X06",
    kategori: "Elektronik & TI",
    lokasi: "Ruang Rapat Utama",
    unitKerja: "Sekretariat",
    tanggalPerolehan: "2022-11-30",
    nilaiPerolehan: 6800000,
    kondisi: "Rusak",
    status: "Disimpan",
    penanggungJawab: "Budi Santoso",
  },
  {
    id: "5",
    kode: "BZ-KDR-0102",
    nama: "Daihatsu Gran Max Box",
    kategori: "Kendaraan",
    lokasi: "Garasi Kantor Cabang Bandung",
    unitKerja: "Divisi Pendistribusian",
    tanggalPerolehan: "2020-01-17",
    nilaiPerolehan: 165000000,
    kondisi: "Baik",
    status: "Dipinjamkan",
    penanggungJawab: "Dedi Kurniawan",
  },
  {
    id: "6",
    kode: "BZ-ELK-0298",
    nama: "Printer Epson L3210",
    kategori: "Elektronik & TI",
    lokasi: "Kantor Pusat — Lt. 2",
    unitKerja: "Divisi Keuangan",
    tanggalPerolehan: "2023-06-09",
    nilaiPerolehan: 2350000,
    kondisi: "Baik",
    status: "Digunakan",
    penanggungJawab: "Maya Puspita",
  },
  {
    id: "7",
    kode: "BZ-BGN-0011",
    nama: "Gedung Kantor Layanan Mustahik",
    kategori: "Bangunan & Gedung",
    lokasi: "Jl. Kebon Sirih No. 57",
    unitKerja: "Sekretariat",
    tanggalPerolehan: "2016-03-01",
    nilaiPerolehan: 4500000000,
    kondisi: "Baik",
    status: "Digunakan",
    penanggungJawab: "Hendra Wijaya",
  },
  {
    id: "8",
    kode: "BZ-FRN-0488",
    nama: "Meja Kerja Staf (Set 6 unit)",
    kategori: "Furnitur & Perlengkapan",
    lokasi: "Kantor Pusat — Lt. 4",
    unitKerja: "Divisi SDM",
    tanggalPerolehan: "2022-09-14",
    nilaiPerolehan: 9600000,
    kondisi: "Perlu Pemeliharaan",
    status: "Digunakan",
    penanggungJawab: "Indah Lestari",
  },
  {
    id: "9",
    kode: "BZ-ELK-0355",
    nama: "AC Split Daikin 1.5 PK",
    kategori: "Elektronik & TI",
    lokasi: "Ruang Server",
    unitKerja: "Divisi TI",
    tanggalPerolehan: "2021-12-02",
    nilaiPerolehan: 5400000,
    kondisi: "Rusak",
    status: "Digunakan",
    penanggungJawab: "Fajar Ramadhan",
  },
  {
    id: "10",
    kode: "BZ-KDR-0077",
    nama: "Honda Vario 125 — Operasional",
    kategori: "Kendaraan",
    lokasi: "Garasi Kantor Cabang Surabaya",
    unitKerja: "Divisi Pendistribusian",
    tanggalPerolehan: "2023-02-19",
    nilaiPerolehan: 21500000,
    kondisi: "Baik",
    status: "Digunakan",
    penanggungJawab: "Wahyu Hidayat",
  },
  {
    id: "11",
    kode: "BZ-FRN-0501",
    nama: "Kursi Tunggu Tamu (Set 4 unit)",
    kategori: "Furnitur & Perlengkapan",
    lokasi: "Lobi Kantor Pusat",
    unitKerja: "Sekretariat",
    tanggalPerolehan: "2020-07-08",
    nilaiPerolehan: 7200000,
    kondisi: "Baik",
    status: "Digunakan",
    penanggungJawab: "Rina Marlina",
  },
  {
    id: "12",
    kode: "BZ-ELK-0367",
    nama: "Server Rack Dell PowerEdge T340",
    kategori: "Elektronik & TI",
    lokasi: "Ruang Server",
    unitKerja: "Divisi TI",
    tanggalPerolehan: "2022-04-25",
    nilaiPerolehan: 78000000,
    kondisi: "Baik",
    status: "Digunakan",
    penanggungJawab: "Fajar Ramadhan",
  },
];

export const ringkasanKategori = [
  { kategori: "Elektronik & TI", jumlah: 186, nilai: 2_840_000_000 },
  { kategori: "Kendaraan", jumlah: 42, nilai: 7_950_000_000 },
  { kategori: "Furnitur & Perlengkapan", jumlah: 314, nilai: 1_120_000_000 },
  { kategori: "Bangunan & Gedung", jumlah: 9, nilai: 28_400_000_000 },
  { kategori: "Lainnya", jumlah: 57, nilai: 410_000_000 },
];

export const distribusiKondisi = [
  { name: "Baik", value: 512, color: "var(--color-chart-1)" },
  { name: "Perlu Pemeliharaan", value: 68, color: "var(--color-chart-2)" },
  { name: "Rusak", value: 28, color: "var(--color-chart-5)" },
];

export const trenPenambahanAset = [
  { bulan: "Jan", jumlah: 18, nilai: 320 },
  { bulan: "Feb", jumlah: 24, nilai: 410 },
  { bulan: "Mar", jumlah: 16, nilai: 280 },
  { bulan: "Apr", jumlah: 31, nilai: 560 },
  { bulan: "Mei", jumlah: 22, nilai: 390 },
  { bulan: "Jun", jumlah: 27, nilai: 470 },
  { bulan: "Jul", jumlah: 19, nilai: 330 },
  { bulan: "Agu", jumlah: 35, nilai: 610 },
  { bulan: "Sep", jumlah: 29, nilai: 500 },
  { bulan: "Okt", jumlah: 33, nilai: 580 },
  { bulan: "Nov", jumlah: 25, nilai: 440 },
  { bulan: "Des", jumlah: 21, nilai: 360 },
];

export const aktivitasTerbaru = [
  {
    id: "a1",
    aksi: "menambahkan aset baru",
    objek: "Laptop Lenovo ThinkPad E14",
    pelaku: "Siti Nurhaliza",
    waktu: "10 menit lalu",
    tipe: "tambah" as const,
  },
  {
    id: "a2",
    aksi: "memperbarui status aset",
    objek: "Toyota Avanza B 1542 BZN",
    pelaku: "Ahmad Fauzan",
    waktu: "1 jam lalu",
    tipe: "ubah" as const,
  },
  {
    id: "a3",
    aksi: "melaporkan kerusakan",
    objek: "Proyektor Epson EB-X06",
    pelaku: "Budi Santoso",
    waktu: "3 jam lalu",
    tipe: "peringatan" as const,
  },
  {
    id: "a4",
    aksi: "menyelesaikan pemeliharaan",
    objek: "AC Split Daikin 1.5 PK",
    pelaku: "Fajar Ramadhan",
    waktu: "Kemarin, 16:42",
    tipe: "selesai" as const,
  },
  {
    id: "a5",
    aksi: "menghapuskan aset",
    objek: "Kursi Kantor (rusak permanen)",
    pelaku: "Rina Marlina",
    waktu: "Kemarin, 09:15",
    tipe: "hapus" as const,
  },
  {
    id: "a6",
    aksi: "memindahkan lokasi aset",
    objek: "Daihatsu Gran Max Box",
    pelaku: "Dedi Kurniawan",
    waktu: "2 hari lalu",
    tipe: "ubah" as const,
  },
];

export const ringkasanStat = {
  totalAset: 1024,
  totalNilai: 40_720_000_000,
  perluPemeliharaan: 68,
  rusak: 28,
  pertumbuhanBulanIni: 4.8,
};

export function formatRupiah(value: number): string {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)} Jt`;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatTanggal(value: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
