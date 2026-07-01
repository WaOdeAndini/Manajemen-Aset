"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export interface LoginState {
  error?: string;
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/dashboard");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("invalid login credentials")) {
      return { error: "Email atau password salah." };
    }
    return { error: error.message };
  }

  if (redirectTo === "/dashboard" && authData.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    redirect(profile?.role === "staf" ? "/staf/keluhan" : "/dashboard");
  }

  redirect(redirectTo.startsWith("/") ? redirectTo : "/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}


export async function deleteAset(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("aset").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/aset");
  revalidatePath("/dashboard");
  return {};
}
// -----------------------------------------------------------------------
// TAMBAH / EDIT ASET
// -----------------------------------------------------------------------
export interface AsetFormState {
  error?: string;
  success?: string;
}

export async function simpanAset(
  _prevState: AsetFormState,
  formData: FormData
): Promise<AsetFormState> {
  const supabase = await createClient();

  const id              = String(formData.get("id")                ?? "").trim();
  const kode            = String(formData.get("kode")              ?? "").trim();
  const nama            = String(formData.get("nama")              ?? "").trim();
  const kategoriId      = String(formData.get("kategori_id")       ?? "").trim() || null;
  const lokasiId        = String(formData.get("lokasi_id")         ?? "").trim() || null;
  const unitKerja       = String(formData.get("unit_kerja")        ?? "").trim() || null;
  const tglPerolehan    = String(formData.get("tanggal_perolehan") ?? "").trim();
  const nilaiRaw        = String(formData.get("nilai_perolehan")   ?? "").trim();
  const kondisi         = String(formData.get("kondisi")           ?? "").trim();
  const status          = String(formData.get("status")            ?? "").trim();
  const penanggungJawab = String(formData.get("penanggung_jawab")  ?? "").trim() || null;
  const catatan         = String(formData.get("catatan")           ?? "").trim() || null;

  if (!kode)         return { error: "Kode aset wajib diisi." };
  if (!nama)         return { error: "Nama aset wajib diisi." };
  if (!tglPerolehan) return { error: "Tanggal perolehan wajib diisi." };

  const nilaiPerolehan = Number(nilaiRaw.replace(/\D/g, ""));
  if (isNaN(nilaiPerolehan) || nilaiPerolehan < 0) {
    return { error: "Nilai perolehan tidak valid." };
  }

  const kondisiValue = (
    ["Baik", "Perlu Pemeliharaan", "Rusak"].includes(kondisi) ? kondisi : "Baik"
  ) as "Baik" | "Perlu Pemeliharaan" | "Rusak";

  const statusValue = (
    ["Digunakan", "Disimpan", "Dipinjamkan", "Dihapuskan"].includes(status) ? status : "Digunakan"
  ) as "Digunakan" | "Disimpan" | "Dipinjamkan" | "Dihapuskan";

  const payload = {
    kode,
    nama,
    kategori_id:       kategoriId,
    lokasi_id:         lokasiId,
    unit_kerja:        unitKerja,
    tanggal_perolehan: tglPerolehan,
    nilai_perolehan:   nilaiPerolehan,
    kondisi:           kondisiValue,
    status:            statusValue,
    penanggung_jawab:  penanggungJawab,
    catatan,
  };

  if (id) {
    const { error } = await supabase.from("aset").update(payload).eq("id", id);
    if (error) {
      if (error.code === "23505") return { error: "Kode aset ini sudah digunakan aset lain." };
      return { error: error.message };
    }
  } else {
    const { error } = await supabase.from("aset").insert(payload);
    if (error) {
      if (error.code === "23505") return { error: "Kode aset ini sudah digunakan aset lain." };
      return { error: error.message };
    }
  }

  revalidatePath("/dashboard/aset");
  revalidatePath("/dashboard");
  return { success: id ? "Aset berhasil diperbarui." : "Aset berhasil ditambahkan." };
}
