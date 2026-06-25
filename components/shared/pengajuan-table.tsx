import { formatTanggal } from "@/lib/format";
import type { Pengajuan } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusPengajuanBadge, TipePengajuanBadge } from "@/components/shared/pengajuan-badges";

function DetailPengajuan({ p }: { p: Pengajuan }) {
  if (p.tipe === "keluhan") {
    return (
      <span>
        Kondisi dilaporkan: <span className="font-medium text-foreground">{p.kondisiDilaporkan}</span>
      </span>
    );
  }
  if (p.tipe === "peminjaman") {
    return (
      <span>
        {p.tanggalMulai && formatTanggal(p.tanggalMulai)} — {p.tanggalSelesai && formatTanggal(p.tanggalSelesai)}
      </span>
    );
  }
  return (
    <span>
      {p.lokasiAsalNama ?? "?"} → <span className="font-medium text-foreground">{p.lokasiTujuanNama ?? "?"}</span>
    </span>
  );
}

interface PengajuanTableProps {
  data: Pengajuan[];
  showPemohon?: boolean;
  emptyMessage?: string;
  actions?: (p: Pengajuan) => React.ReactNode;
}

export function PengajuanTable({
  data,
  showPemohon = false,
  emptyMessage = "Belum ada pengajuan.",
  actions,
}: PengajuanTableProps) {
  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Jenis</TableHead>
          <TableHead>Aset</TableHead>
          {showPemohon && <TableHead>Pemohon</TableHead>}
          <TableHead>Detail</TableHead>
          <TableHead>Tanggal Ajuan</TableHead>
          <TableHead>Status</TableHead>
          {actions && <TableHead className="w-10" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((p) => (
          <TableRow key={p.id}>
            <TableCell>
              <TipePengajuanBadge tipe={p.tipe} />
            </TableCell>
            <TableCell>
              <p className="font-medium text-foreground">{p.asetNama}</p>
              <p className="font-mono text-xs text-muted-foreground">{p.asetKode}</p>
            </TableCell>
            {showPemohon && (
              <TableCell className="text-muted-foreground">{p.pemohonNama}</TableCell>
            )}
            <TableCell className="max-w-[220px] text-xs text-muted-foreground">
              <DetailPengajuan p={p} />
              {p.deskripsi && <p className="mt-0.5 truncate" title={p.deskripsi}>{p.deskripsi}</p>}
            </TableCell>
            <TableCell className="text-muted-foreground">{formatTanggal(p.createdAt)}</TableCell>
            <TableCell>
              <StatusPengajuanBadge status={p.status} />
              {p.catatanAdmin && (
                <p className="mt-1 max-w-[160px] truncate text-xs text-muted-foreground" title={p.catatanAdmin}>
                  Catatan: {p.catatanAdmin}
                </p>
              )}
            </TableCell>
            {actions && <TableCell>{actions(p)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
