import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PengajuanReviewTable } from "@/components/dashboard/pengajuan-review-table";
import { createClient } from "@/lib/supabase/server";
import { getSemuaPengajuan } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function PengajuanStafPage() {
  const supabase = await createClient();
  const pengajuan = await getSemuaPengajuan(supabase);
  const menunggu = pengajuan.filter((p) => p.status === "menunggu").length;

  return (
    <>
      <Header
        title="Pengajuan Staf"
        description="Tinjau laporan keluhan, peminjaman, dan pemindahan lokasi aset dari staf"
      />

      <main className="flex-1 p-4 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengajuan</CardTitle>
            <CardDescription>
              {pengajuan.length} total pengajuan · {menunggu} menunggu tinjauan Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PengajuanReviewTable initialData={pengajuan} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
