import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { formatRupiah, formatTanggal } from "@/lib/format";
import type { Aset, KondisiAset } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const kondisiVariant: Record<KondisiAset, "success" | "warning" | "destructive"> = {
  Baik: "success",
  "Perlu Pemeliharaan": "warning",
  Rusak: "destructive",
};

export function RecentAssetsTable({ data }: { data: Aset[] }) {
  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Belum ada aset yang tercatat. Tambahkan aset pertama Anda.
      </p>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kode Aset</TableHead>
            <TableHead>Nama Aset</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead>Tgl. Perolehan</TableHead>
            <TableHead className="text-right">Nilai</TableHead>
            <TableHead>Kondisi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((aset) => (
            <TableRow key={aset.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {aset.kode}
              </TableCell>
              <TableCell>
                <div className="max-w-[220px]">
                  <p className="truncate font-medium text-foreground">{aset.nama}</p>
                  <p className="truncate text-xs text-muted-foreground">{aset.unitKerja}</p>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{aset.lokasi}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatTanggal(aset.tanggalPerolehan)}
              </TableCell>
              <TableCell className="text-right font-mono text-xs text-foreground">
                {formatRupiah(aset.nilaiPerolehan)}
              </TableCell>
              <TableCell>
                <Badge variant={kondisiVariant[aset.kondisi]}>{aset.kondisi}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-end">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/aset">
            Lihat semua data aset
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}
