import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PengajuanTable } from "@/components/shared/pengajuan-table";
import { createClient } from "@/lib/supabase/server";
import { getPengajuanSaya } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function RiwayatPengajuanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const pengajuan = user ? await getPengajuanSaya(supabase, user.id) : [];
  const menunggu = pengajuan.filter((p) => p.status === "menunggu").length;

  return (
    <>
      <Header
        title="Riwayat Pengajuan Saya"
        description="Status pengajuan yang pernah Anda ajukan"
      />

      <main className="flex-1 p-4 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Semua Pengajuan</CardTitle>
            <CardDescription>
              {pengajuan.length} pengajuan tercatat · {menunggu} masih menunggu tinjauan admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PengajuanTable
              data={pengajuan}
              emptyMessage="Anda belum pernah mengajukan laporan/peminjaman/pemindahan."
            />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
