import { Badge } from "@/components/ui/badge";
import type { StatusPengajuan, TipePengajuan } from "@/lib/types";

const statusVariant: Record<StatusPengajuan, "secondary" | "success" | "destructive" | "info"> = {
  menunggu: "secondary",
  disetujui: "success",
  ditolak: "destructive",
  selesai: "info",
};

const statusLabel: Record<StatusPengajuan, string> = {
  menunggu: "Menunggu",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
  selesai: "Selesai",
};

export function StatusPengajuanBadge({ status }: { status: StatusPengajuan }) {
  return <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>;
}

const tipeLabel: Record<TipePengajuan, string> = {
  keluhan: "Laporan Kerusakan",
  peminjaman: "Peminjaman",
  pemindahan: "Pemindahan Lokasi",
};

export function TipePengajuanBadge({ tipe }: { tipe: TipePengajuan }) {
  return <Badge variant="outline">{tipeLabel[tipe]}</Badge>;
}
