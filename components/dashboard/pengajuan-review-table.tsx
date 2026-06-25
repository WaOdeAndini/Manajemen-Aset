"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, X, RotateCcw } from "lucide-react";

import { formatTanggal } from "@/lib/format";
import type { Pengajuan, StatusPengajuan } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusPengajuanBadge, TipePengajuanBadge } from "@/components/shared/pengajuan-badges";
import {
  setujuiPengajuan,
  tolakPengajuan,
  tandaiPeminjamanSelesai,
} from "@/lib/supabase/pengajuan-actions";

function DetailPengajuan({ p }: { p: Pengajuan }) {
  if (p.tipe === "keluhan") {
    return <span>Kondisi dilaporkan: <strong className="text-foreground">{p.kondisiDilaporkan}</strong></span>;
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
      {p.lokasiAsalNama ?? "?"} → <strong className="text-foreground">{p.lokasiTujuanNama ?? "?"}</strong>
    </span>
  );
}

export function PengajuanReviewTable({ initialData }: { initialData: Pengajuan[] }) {
  const [statusFilter, setStatusFilter] = useState<"semua" | StatusPengajuan>("menunggu");
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (statusFilter === "semua") return initialData;
    return initialData.filter((p) => p.status === statusFilter);
  }, [initialData, statusFilter]);

  function jalankan(id: string, aksi: () => Promise<{ error?: string }>) {
    setPendingId(id);
    startTransition(async () => {
      const result = await aksi();
      setPendingId(null);
      if (result?.error) window.alert(result.error);
    });
  }

  function handleSetujui(p: Pengajuan) {
    if (!window.confirm(`Setujui pengajuan "${p.judul}"? Data aset terkait akan diperbarui otomatis.`)) return;
    jalankan(p.id, () => setujuiPengajuan(p.id));
  }

  function handleTolak(p: Pengajuan) {
    const catatan = window.prompt("Catatan penolakan (opsional):") ?? undefined;
    jalankan(p.id, () => tolakPengajuan(p.id, catatan));
  }

  function handleSelesai(p: Pengajuan) {
    if (!window.confirm(`Tandai peminjaman "${p.asetNama}" sudah dikembalikan?`)) return;
    jalankan(p.id, () => tandaiPeminjamanSelesai(p.id));
  }

  return (
    <div className="space-y-4">
      <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
        <SelectTrigger className="w-full sm:w-52">
          <SelectValue placeholder="Filter status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="menunggu">Menunggu Tinjauan</SelectItem>
          <SelectItem value="disetujui">Disetujui</SelectItem>
          <SelectItem value="ditolak">Ditolak</SelectItem>
          <SelectItem value="selesai">Selesai</SelectItem>
          <SelectItem value="semua">Semua Status</SelectItem>
        </SelectContent>
      </Select>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Tidak ada pengajuan pada status ini.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Jenis</TableHead>
              <TableHead>Aset</TableHead>
              <TableHead>Pemohon</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead>Tanggal Ajuan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-44">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => {
              const sedangProses = isPending && pendingId === p.id;
              return (
                <TableRow key={p.id} className={sedangProses ? "opacity-50" : undefined}>
                  <TableCell>
                    <TipePengajuanBadge tipe={p.tipe} />
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">{p.asetNama}</p>
                    <p className="font-mono text-xs text-muted-foreground">{p.asetKode}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.pemohonNama}</TableCell>
                  <TableCell className="max-w-[200px] text-xs text-muted-foreground">
                    <DetailPengajuan p={p} />
                    {p.deskripsi && (
                      <p className="mt-0.5 truncate" title={p.deskripsi}>
                        {p.deskripsi}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatTanggal(p.createdAt)}</TableCell>
                  <TableCell>
                    <StatusPengajuanBadge status={p.status} />
                  </TableCell>
                  <TableCell>
                    {p.status === "menunggu" && (
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="outline" disabled={sedangProses} onClick={() => handleSetujui(p)}>
                          <Check /> Setujui
                        </Button>
                        <Button size="sm" variant="ghost" disabled={sedangProses} onClick={() => handleTolak(p)}>
                          <X /> Tolak
                        </Button>
                      </div>
                    )}
                    {p.status === "disetujui" && p.tipe === "peminjaman" && (
                      <Button size="sm" variant="outline" disabled={sedangProses} onClick={() => handleSelesai(p)}>
                        <RotateCcw /> Tandai Dikembalikan
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
