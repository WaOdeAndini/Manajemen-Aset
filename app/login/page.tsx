import Link from "next/link";
import { LandPlot, ShieldCheck, BarChart3, Boxes } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.redirectTo ?? "/dashboard";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel brand */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-sidebar-primary/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 size-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <LandPlot className="size-5" />
          </div>
          <span className="text-sm font-semibold">SIMA BAZNAS</span>
        </div>

        <div className="relative max-w-md space-y-6">
          <h1 className="text-3xl font-semibold leading-tight">
            Satu sistem terpadu untuk seluruh aset BAZNAS.
          </h1>
          <p className="text-sm text-sidebar-muted-foreground">
            Catat, pantau, dan kelola kondisi aset di seluruh unit kerja secara
            real-time — dari kantor pusat hingga cabang.
          </p>

          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2.5">
              <Boxes className="size-4 text-accent" />
              Pencatatan aset terpusat & terstandarisasi
            </li>
            <li className="flex items-center gap-2.5">
              <BarChart3 className="size-4 text-accent" />
              Dashboard & laporan kondisi aset real-time
            </li>
            <li className="flex items-center gap-2.5">
              <ShieldCheck className="size-4 text-accent" />
              Akses dikontrol berdasarkan peran pengguna
            </li>
          </ul>
        </div>

        <p className="relative text-xs text-sidebar-muted-foreground">
          © {new Date().getFullYear()} BAZNAS — Sistem Informasi Manajemen Aset
        </p>
      </div>

      {/* Panel form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LandPlot className="size-5" />
            </div>
            <span className="text-sm font-semibold text-foreground">SIMA BAZNAS</span>
          </div>

          <div className="mb-6 space-y-1">
            <h2 className="text-xl font-semibold text-foreground">Masuk ke akun Anda</h2>
            <p className="text-sm text-muted-foreground">
              Gunakan akun yang telah didaftarkan oleh administrator sistem.
            </p>
          </div>

          <LoginForm redirectTo={redirectTo} />

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Butuh akses?{" "}
            <Link href="#" className="font-medium text-primary hover:underline">
              Hubungi administrator
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
