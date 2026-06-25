import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, KondisiAset } from "@/lib/supabase/types";
import type {
  Aset,
  AktivitasItem,
  RingkasanStat,
  KategoriRingkasan,
  KondisiRingkasanItem,
  TrenBulanan,
  AsetOption,
  LokasiOption,
  Pengajuan,
  NotifikasiItem,
} from "@/lib/types";
import { waktuRelatif } from "@/lib/format";

type TypedClient = SupabaseClient<Database>;

const NAMA_BULAN = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

const WARNA_KONDISI: Record<KondisiAset, string> = {
  Baik: "var(--color-chart-1)",
  "Perlu Pemeliharaan": "var(--color-chart-2)",
  Rusak: "var(--color-chart-5)",
};

/**
 * Mengambil seluruh baris `aset`, beserta nama kategori & lokasi terkait.
 * Sengaja melakukan join secara manual di JS (bukan PostgREST embed) supaya
 * tetap aman secara tipe terhadap `Database` yang ditulis manual, dan mudah
 * dibaca/di-maintain.
 */
export async function getAsetList(supabase: TypedClient): Promise<Aset[]> {
  const [{ data: asetRows, error: asetError }, kategoriMap, lokasiMap] = await Promise.all([
    supabase.from("aset").select("*").order("created_at", { ascending: false }),
    getKategoriMap(supabase),
    getLokasiMap(supabase),
  ]);

  if (asetError) throw asetError;

  return (asetRows ?? []).map((row) => ({
    id: row.id,
    kode: row.kode,
    nama: row.nama,
    kategori: (row.kategori_id && kategoriMap.get(row.kategori_id)) || "Tanpa Kategori",
    lokasi: (row.lokasi_id && lokasiMap.get(row.lokasi_id)) || "Tanpa Lokasi",
    unitKerja: row.unit_kerja || "-",
    tanggalPerolehan: row.tanggal_perolehan,
    nilaiPerolehan: Number(row.nilai_perolehan),
    kondisi: row.kondisi,
    status: row.status,
    penanggungJawab: row.penanggung_jawab || "-",
  }));
}

export async function getKategoriMap(supabase: TypedClient): Promise<Map<string, string>> {
  const { data, error } = await supabase.from("kategori_aset").select("id, nama");
  if (error) throw error;
  return new Map((data ?? []).map((k) => [k.id, k.nama]));
}

export async function getLokasiMap(supabase: TypedClient): Promise<Map<string, string>> {
  const { data, error } = await supabase.from("lokasi").select("id, nama");
  if (error) throw error;
  return new Map((data ?? []).map((l) => [l.id, l.nama]));
}

export async function getKategoriOptions(
  supabase: TypedClient
): Promise<{ id: string; nama: string }[]> {
  const { data, error } = await supabase.from("kategori_aset").select("id, nama").order("nama");
  if (error) throw error;
  return data ?? [];
}

export async function getLokasiOptions(
  supabase: TypedClient
): Promise<{ id: string; nama: string }[]> {
  const { data, error } = await supabase.from("lokasi").select("id, nama").order("nama");
  if (error) throw error;
  return data ?? [];
}

export function hitungRingkasanStat(asetList: Aset[]): RingkasanStat {
  const totalAset = asetList.length;
  const totalNilai = asetList.reduce((sum, a) => sum + a.nilaiPerolehan, 0);
  const perluPemeliharaan = asetList.filter((a) => a.kondisi === "Perlu Pemeliharaan").length;
  const rusak = asetList.filter((a) => a.kondisi === "Rusak").length;

  const now = new Date();
  const bulanIni = now.getMonth();
  const tahunIni = now.getFullYear();
  const bulanLaluDate = new Date(tahunIni, bulanIni - 1, 1);

  const hitungBulan = (bulan: number, tahun: number) =>
    asetList.filter((a) => {
      const d = new Date(a.tanggalPerolehan);
      return d.getMonth() === bulan && d.getFullYear() === tahun;
    }).length;

  const asetBulanIni = hitungBulan(bulanIni, tahunIni);
  const asetBulanLalu = hitungBulan(bulanLaluDate.getMonth(), bulanLaluDate.getFullYear());

  const pertumbuhanBulanIni =
    asetBulanLalu === 0
      ? asetBulanIni > 0 ? 100 : 0
      : Math.round(((asetBulanIni - asetBulanLalu) / asetBulanLalu) * 1000) / 10;

  return { totalAset, totalNilai, perluPemeliharaan, rusak, pertumbuhanBulanIni };
}

export function hitungDistribusiKondisi(asetList: Aset[]): KondisiRingkasanItem[] {
  const urutan: KondisiAset[] = ["Baik", "Perlu Pemeliharaan", "Rusak"];
  return urutan.map((kondisi) => ({
    name: kondisi,
    value: asetList.filter((a) => a.kondisi === kondisi).length,
    color: WARNA_KONDISI[kondisi],
  }));
}

export function hitungRingkasanKategori(asetList: Aset[]): KategoriRingkasan[] {
  const map = new Map<string, { jumlah: number; nilai: number }>();
  for (const a of asetList) {
    const current = map.get(a.kategori) ?? { jumlah: 0, nilai: 0 };
    current.jumlah += 1;
    current.nilai += a.nilaiPerolehan;
    map.set(a.kategori, current);
  }
  return Array.from(map.entries())
    .map(([kategori, v]) => ({ kategori, ...v }))
    .sort((a, b) => b.jumlah - a.jumlah);
}

export function hitungTrenPenambahan(asetList: Aset[], jumlahBulan = 6): TrenBulanan[] {
  const now = new Date();
  const hasil: TrenBulanan[] = [];

  for (let i = jumlahBulan - 1; i >= 0; i--) {
    const target = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const jumlah = asetList.filter((a) => {
      const d = new Date(a.tanggalPerolehan);
      return d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear();
    }).length;

    hasil.push({ bulan: NAMA_BULAN[target.getMonth()], jumlah });
  }

  return hasil;
}

export async function getAktivitasTerbaru(
  supabase: TypedClient,
  limit = 6
): Promise<AktivitasItem[]> {
  const { data, error } = await supabase
    .from("aktivitas_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    aksi: row.aksi,
    objek: row.keterangan ?? "",
    pelaku: row.pelaku_nama ?? "Sistem",
    waktu: waktuRelatif(row.created_at),
    tipe: row.tipe,
  }));
}

// ---------------------------------------------------------------------
// Opsi untuk dropdown form pengajuan staf
// ---------------------------------------------------------------------
export async function getAsetOptions(supabase: TypedClient): Promise<AsetOption[]> {
  const [{ data: asetRows, error }, lokasiMap, kategoriMap] = await Promise.all([
    supabase.from("aset").select("id, kode, nama, lokasi_id, kategori_id").order("nama"),
    getLokasiMap(supabase),
    getKategoriMap(supabase),   // ← ditambahkan
  ]);
  if (error) throw error;

  return (asetRows ?? []).map((row) => ({
    id: row.id,
    kode: row.kode,
    nama: row.nama,
    lokasiId: row.lokasi_id,
    lokasiNama: (row.lokasi_id && lokasiMap.get(row.lokasi_id)) || "Tanpa Lokasi",
    kategoriId: row.kategori_id,                                              // ← baru
    kategoriNama: (row.kategori_id && kategoriMap.get(row.kategori_id)) || "Tanpa Kategori", // ← baru
  }));
}

export async function getLokasiOptionsSederhana(
  supabase: TypedClient
): Promise<LokasiOption[]> {
  const { data, error } = await supabase.from("lokasi").select("id, nama").order("nama");
  if (error) throw error;
  return data ?? [];
}

// ---------------------------------------------------------------------
// Pengajuan (staf <-> admin)
// ---------------------------------------------------------------------
async function petakanPengajuan(
  supabase: TypedClient,
  rows: Database["public"]["Tables"]["pengajuan_aset"]["Row"][]
): Promise<Pengajuan[]> {
  if (rows.length === 0) return [];

  const asetIds = Array.from(new Set(rows.map((r) => r.aset_id)));
  const pemohonIds = Array.from(new Set(rows.map((r) => r.pemohon_id)));
  const lokasiIds = Array.from(
    new Set(
      rows.flatMap((r) => [r.lokasi_asal_id, r.lokasi_tujuan_id]).filter((v): v is string => !!v)
    )
  );

  const [{ data: asetRows }, { data: profilRows }, { data: lokasiRows }] = await Promise.all([
    asetIds.length
      ? supabase.from("aset").select("id, kode, nama").in("id", asetIds)
      : Promise.resolve({ data: [] as { id: string; kode: string; nama: string }[] }),
    pemohonIds.length
      ? supabase.from("profiles").select("id, full_name").in("id", pemohonIds)
      : Promise.resolve({ data: [] as { id: string; full_name: string | null }[] }),
    lokasiIds.length
      ? supabase.from("lokasi").select("id, nama").in("id", lokasiIds)
      : Promise.resolve({ data: [] as { id: string; nama: string }[] }),
  ]);

  const asetMap = new Map((asetRows ?? []).map((a) => [a.id, a]));
  const profilMap = new Map((profilRows ?? []).map((p) => [p.id, p.full_name]));
  const lokasiMap = new Map((lokasiRows ?? []).map((l) => [l.id, l.nama]));

  return rows.map((row) => {
    const aset = asetMap.get(row.aset_id);
    return {
      id: row.id,
      tipe: row.tipe,
      asetId: row.aset_id,
      asetNama: aset?.nama ?? "Aset tidak ditemukan",
      asetKode: aset?.kode ?? "-",
      pemohonId: row.pemohon_id,
      pemohonNama: profilMap.get(row.pemohon_id) || "Staf",
      judul: row.judul,
      deskripsi: row.deskripsi,
      kondisiDilaporkan: row.kondisi_dilaporkan,
      tanggalMulai: row.tanggal_mulai,
      tanggalSelesai: row.tanggal_selesai,
      lokasiAsalNama: row.lokasi_asal_id ? lokasiMap.get(row.lokasi_asal_id) ?? null : null,
      lokasiTujuanNama: row.lokasi_tujuan_id ? lokasiMap.get(row.lokasi_tujuan_id) ?? null : null,
      status: row.status,
      catatanAdmin: row.catatan_admin,
      createdAt: row.created_at,
    };
  });
}

export async function getPengajuanSaya(
  supabase: TypedClient,
  userId: string
): Promise<Pengajuan[]> {
  const { data, error } = await supabase
    .from("pengajuan_aset")
    .select("*")
    .eq("pemohon_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return petakanPengajuan(supabase, data ?? []);
}

export async function getSemuaPengajuan(supabase: TypedClient): Promise<Pengajuan[]> {
  const { data, error } = await supabase
    .from("pengajuan_aset")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return petakanPengajuan(supabase, data ?? []);
}

// ---------------------------------------------------------------------
// Notifikasi (admin)
// ---------------------------------------------------------------------
export async function getNotifikasi(
  supabase: TypedClient,
  limit = 8
): Promise<NotifikasiItem[]> {
  const { data, error } = await supabase
    .from("notifikasi")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    pengajuanId: row.pengajuan_id,
    judul: row.judul,
    pesan: row.pesan,
    dibaca: row.dibaca,
    createdAt: row.created_at,
  }));
}

export async function getJumlahNotifikasiBelumDibaca(supabase: TypedClient): Promise<number> {
  const { count, error } = await supabase
    .from("notifikasi")
    .select("id", { count: "exact", head: true })
    .eq("dibaca", false);

  if (error) throw error;
  return count ?? 0;
}
