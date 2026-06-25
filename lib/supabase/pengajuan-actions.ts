"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { TipePengajuan } from "@/lib/types";
import type { Database } from "@/lib/supabase/types";

type PengajuanInsert = Database["public"]["Tables"]["pengajuan_aset"]["Insert"];

export interface PengajuanFormState {
  error?: string;
  success?: string;
}

function judulOtomatis(tipe: TipePengajuan, namaAset: string): string {
  if (tipe === "keluhan") return `Laporan kerusakan/keluhan: ${namaAset}`;
  if (tipe === "peminjaman") return `Pengajuan peminjaman: ${namaAset}`;
  return `Pelaporan pemindahan lokasi: ${namaAset}`;
}

/**
 * Dipakai oleh ketiga form di /staf/pengajuan (Keluhan, Peminjaman,
 * Pemindahan) — dibedakan lewat field tersembunyi `tipe`.
 */
export async function buatPengajuan(
  _prevState: PengajuanFormState,
  formData: FormData
): Promise<PengajuanFormState> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Sesi Anda telah berakhir. Silakan masuk kembali." };
  }

  const tipe = String(formData.get("tipe") ?? "") as TipePengajuan;
  const asetId = String(formData.get("aset_id") ?? "");
  const deskripsi = String(formData.get("deskripsi") ?? "").trim();

  if (!asetId) {
    return { error: "Pilih aset terlebih dahulu." };
  }
  if (!["keluhan", "peminjaman", "pemindahan"].includes(tipe)) {
    return { error: "Jenis pengajuan tidak valid." };
  }

  const { data: aset, error: asetError } = await supabase
    .from("aset")
    .select("id, nama, lokasi_id")
    .eq("id", asetId)
    .single();

  if (asetError || !aset) {
    return { error: "Aset tidak ditemukan." };
  }

  const payload: PengajuanInsert = {
    tipe,
    aset_id: asetId,
    pemohon_id: user.id,
    judul: judulOtomatis(tipe, aset.nama),
    deskripsi: deskripsi || null,
  };

  if (tipe === "keluhan") {
    const kondisi = String(formData.get("kondisi_dilaporkan") ?? "");
    if (kondisi !== "Perlu Pemeliharaan" && kondisi !== "Rusak") {
      return { error: "Pilih perkiraan kondisi aset." };
    }
    if (!deskripsi) {
      return { error: "Jelaskan keluhan/kerusakan yang ditemukan." };
    }
    payload.kondisi_dilaporkan = kondisi;
  }

  if (tipe === "peminjaman") {
    const mulai = String(formData.get("tanggal_mulai") ?? "");
    const selesai = String(formData.get("tanggal_selesai") ?? "");
    if (!mulai || !selesai) {
      return { error: "Tanggal mulai dan selesai peminjaman wajib diisi." };
    }
    if (new Date(selesai) < new Date(mulai)) {
      return { error: "Tanggal selesai tidak boleh sebelum tanggal mulai." };
    }
    payload.tanggal_mulai = mulai;
    payload.tanggal_selesai = selesai;
  }

  if (tipe === "pemindahan") {
    const lokasiTujuan = String(formData.get("lokasi_tujuan_id") ?? "");
    if (!lokasiTujuan) {
      return { error: "Pilih lokasi tujuan pemindahan." };
    }
    if (lokasiTujuan === aset.lokasi_id) {
      return { error: "Lokasi tujuan sama dengan lokasi aset saat ini." };
    }
    payload.lokasi_asal_id = aset.lokasi_id;
    payload.lokasi_tujuan_id = lokasiTujuan;
  }

  const { error } = await supabase.from("pengajuan_aset").insert(payload);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/staf/riwayat");
  revalidatePath("/dashboard/pengajuan");
  revalidatePath("/dashboard");

  const labelTipe =
    tipe === "keluhan" ? "Laporan" : tipe === "peminjaman" ? "Pengajuan peminjaman" : "Laporan pemindahan";
  return { success: `${labelTipe} berhasil dikirim dan akan ditinjau oleh admin.` };
}

interface AksiResult {
  error?: string;
}

async function pastikanAdmin(): Promise<
  { ok: true; supabase: Awaited<ReturnType<typeof createClient>>; adminId: string } | { ok: false; error: string }
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesi telah berakhir." };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") {
    return { ok: false, error: "Hanya admin yang dapat memproses pengajuan ini." };
  }
  return { ok: true, supabase, adminId: user.id };
}

export async function setujuiPengajuan(
  pengajuanId: string,
  catatan?: string
): Promise<AksiResult> {
  const ctx = await pastikanAdmin();
  if (!ctx.ok) return { error: ctx.error };
  const { supabase, adminId } = ctx;

  const { data: pengajuan, error: fetchError } = await supabase
    .from("pengajuan_aset")
    .select("*")
    .eq("id", pengajuanId)
    .single();

  if (fetchError || !pengajuan) {
    return { error: "Pengajuan tidak ditemukan." };
  }

  const { error: updateError } = await supabase
    .from("pengajuan_aset")
    .update({
      status: "disetujui",
      diproses_oleh: adminId,
      diproses_pada: new Date().toISOString(),
      catatan_admin: catatan || null,
    })
    .eq("id", pengajuanId);

  if (updateError) return { error: updateError.message };

  // Efek nyata ke data aset, sesuai jenis pengajuan yang disetujui.
  if (pengajuan.tipe === "keluhan" && pengajuan.kondisi_dilaporkan) {
    await supabase
      .from("aset")
      .update({ kondisi: pengajuan.kondisi_dilaporkan })
      .eq("id", pengajuan.aset_id);
  } else if (pengajuan.tipe === "peminjaman") {
    await supabase.from("aset").update({ status: "Dipinjamkan" }).eq("id", pengajuan.aset_id);
  } else if (pengajuan.tipe === "pemindahan" && pengajuan.lokasi_tujuan_id) {
    await supabase
      .from("aset")
      .update({ lokasi_id: pengajuan.lokasi_tujuan_id })
      .eq("id", pengajuan.aset_id);
  }

  revalidatePath("/dashboard/pengajuan");
  revalidatePath("/dashboard/aset");
  revalidatePath("/dashboard");
  revalidatePath("/staf/riwayat");
  return {};
}

export async function tolakPengajuan(
  pengajuanId: string,
  catatan?: string
): Promise<AksiResult> {
  const ctx = await pastikanAdmin();
  if (!ctx.ok) return { error: ctx.error };
  const { supabase, adminId } = ctx;

  const { error } = await supabase
    .from("pengajuan_aset")
    .update({
      status: "ditolak",
      diproses_oleh: adminId,
      diproses_pada: new Date().toISOString(),
      catatan_admin: catatan || null,
    })
    .eq("id", pengajuanId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/pengajuan");
  revalidatePath("/staf/riwayat");
  return {};
}

export async function tandaiPeminjamanSelesai(pengajuanId: string): Promise<AksiResult> {
  const ctx = await pastikanAdmin();
  if (!ctx.ok) return { error: ctx.error };
  const { supabase } = ctx;

  const { data: pengajuan, error: fetchError } = await supabase
    .from("pengajuan_aset")
    .select("id, aset_id, tipe")
    .eq("id", pengajuanId)
    .single();

  if (fetchError || !pengajuan || pengajuan.tipe !== "peminjaman") {
    return { error: "Pengajuan peminjaman tidak ditemukan." };
  }

  const { error } = await supabase
    .from("pengajuan_aset")
    .update({ status: "selesai" })
    .eq("id", pengajuanId);

  if (error) return { error: error.message };

  await supabase.from("aset").update({ status: "Digunakan" }).eq("id", pengajuan.aset_id);

  revalidatePath("/dashboard/pengajuan");
  revalidatePath("/dashboard/aset");
  revalidatePath("/staf/riwayat");
  return {};
}

export async function tandaiNotifikasiDibaca(id: string): Promise<AksiResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("notifikasi").update({ dibaca: true }).eq("id", id);
  if (error) return { error: error.message };
  return {};
}

export async function tandaiSemuaNotifikasiDibaca(): Promise<AksiResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("notifikasi").update({ dibaca: true }).eq("dibaca", false);
  if (error) return { error: error.message };
  return {};
}
