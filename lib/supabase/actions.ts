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

  // Kalau tidak ada tujuan spesifik (user datang langsung ke /login), arahkan
  // sesuai peran supaya tidak perlu bouncing dua kali lewat layout guard.
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

/**
 * Contoh nyata aksi tulis (mutasi) ke Supabase dari dashboard. Ikuti pola
 * yang sama (Server Action + revalidatePath) untuk membuat aksi tambah/edit
 * aset lainnya.
 */
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
