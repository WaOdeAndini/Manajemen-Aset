import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PengajuanForm } from "@/components/staf/pengajuan-form";
import { createClient } from "@/lib/supabase/server";
import { getAsetOptions, getLokasiOptionsSederhana } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function StafPengajuanPage() {
  const supabase = await createClient();

  const [asetList, lokasiList] = await Promise.all([
    getAsetOptions(supabase),
    getLokasiOptionsSederhana(supabase),
  ]);

  return (
    <>
      <Header
        title="Ajukan Pengajuan"
        description="Laporkan keluhan, ajukan peminjaman, atau laporkan pemindahan lokasi aset"
      />

      <main className="flex-1 p-4 lg:p-6">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Form Pengajuan</CardTitle>
            <CardDescription>
              Pilih jenis pengajuan, lalu lengkapi detailnya. Admin akan menerima notifikasi
              dan meninjau pengajuan Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PengajuanForm asetList={asetList} lokasiList={lokasiList} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
