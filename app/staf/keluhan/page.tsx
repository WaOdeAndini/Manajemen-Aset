import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KeluhanForm } from "@/components/staf/keluhan-form";
import { PengajuanTable } from "@/components/shared/pengajuan-table";
import { createClient } from "@/lib/supabase/server";
import { getAsetOptions, getPengajuanSaya } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function KeluhanAsetPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [asetList, semuaPengajuanSaya] = await Promise.all([
    getAsetOptions(supabase),
    user ? getPengajuanSaya(supabase, user.id) : Promise.resolve([]),
  ]);

  const riwayatKeluhan = semuaPengajuanSaya.filter((p) => p.tipe === "keluhan");
  const menunggu = riwayatKeluhan.filter((p) => p.status === "menunggu").length;

  return (
    <>
      <Header
        title="Laporan / Keluhan Aset"
        description="Laporkan aset yang rusak atau bermasalah agar segera ditindaklanjuti admin"
      />

      <main className="flex-1 space-y-4 p-4 lg:p-6">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Buat Laporan Baru</CardTitle>
            <CardDescription>
              Pilih aset yang bermasalah, lalu jelaskan kondisinya. Admin akan menerima
              notifikasi secara otomatis untuk meninjau laporan Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KeluhanForm asetList={asetList} />
          </CardContent>
        </Card>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Riwayat Laporan Saya</CardTitle>
            <CardDescription>
              {riwayatKeluhan.length} laporan tercatat · {menunggu} masih menunggu tinjauan admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PengajuanTable
              data={riwayatKeluhan}
              emptyMessage="Anda belum pernah membuat laporan/keluhan aset."
            />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
