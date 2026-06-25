import { Boxes, Wallet, Wrench, AlertTriangle } from "lucide-react";

import { Header } from "@/components/layout/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ConditionChart } from "@/components/dashboard/condition-chart";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentAssetsTable } from "@/components/dashboard/recent-assets-table";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRupiah } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import {
  getAsetList,
  getAktivitasTerbaru,
  hitungDistribusiKondisi,
  hitungRingkasanKategori,
  hitungRingkasanStat,
  hitungTrenPenambahan,
} from "@/lib/supabase/queries";

// Selalu ambil data terbaru — dashboard ini menampilkan kondisi aset real-time.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [asetList, aktivitas] = await Promise.all([
    getAsetList(supabase),
    getAktivitasTerbaru(supabase, 6),
  ]);

  const ringkasan = hitungRingkasanStat(asetList);
  const distribusiKondisi = hitungDistribusiKondisi(asetList);
  const ringkasanKategori = hitungRingkasanKategori(asetList);
  const tren = hitungTrenPenambahan(asetList, 6);
  const asetTerbaru = asetList.slice(0, 6);

  return (
    <>
      <Header
        title="Dashboard"
        description="Ringkasan pengelolaan aset BAZNAS secara real-time"
      />

      <main className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Aset Tercatat"
            value={ringkasan.totalAset.toLocaleString("id-ID")}
            icon={Boxes}
            tone="primary"
            trend={{
              value: `${ringkasan.pertumbuhanBulanIni}%`,
              positive: ringkasan.pertumbuhanBulanIni >= 0,
              caption: "dari bulan lalu",
            }}
          />
          <StatCard
            label="Total Nilai Aset"
            value={formatRupiah(ringkasan.totalNilai)}
            icon={Wallet}
            tone="info"
            caption="Estimasi nilai perolehan seluruh aset"
          />
          <StatCard
            label="Perlu Pemeliharaan"
            value={ringkasan.perluPemeliharaan.toString()}
            icon={Wrench}
            tone="warning"
            caption="Aset memerlukan tindak lanjut"
          />
          <StatCard
            label="Aset Rusak"
            value={ringkasan.rusak.toString()}
            icon={AlertTriangle}
            tone="destructive"
            caption="Menunggu perbaikan / penghapusan"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Tren Penambahan Aset</CardTitle>
              <CardDescription>Jumlah aset baru tercatat per bulan, 6 bulan terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              <TrendChart data={tren} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kondisi Aset</CardTitle>
              <CardDescription>Distribusi kondisi seluruh aset tercatat</CardDescription>
            </CardHeader>
            <CardContent>
              <ConditionChart data={distribusiKondisi} />
            </CardContent>
          </Card>
        </div>

        {/* Table + side column */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Aset Ditambahkan Terbaru</CardTitle>
              <CardDescription>6 aset terakhir yang tercatat ke dalam sistem</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentAssetsTable data={asetTerbaru} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>Riwayat aksi terbaru pada sistem</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed data={aktivitas} />
            </CardContent>
          </Card>
        </div>

        {/* Category breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Aset per Kategori</CardTitle>
            <CardDescription>Jumlah unit aset pada setiap kategori</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryChart data={ringkasanKategori} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
