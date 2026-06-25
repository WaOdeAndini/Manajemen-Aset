"use client";

import { useMemo, useState, useTransition } from "react";
import { Search, Plus, MoreHorizontal, Pencil, Trash2, Eye, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRupiah, formatTanggal } from "@/lib/format";
import type { Aset, KondisiAset } from "@/lib/types";
import { deleteAset } from "@/lib/supabase/actions";

const kondisiVariant: Record<KondisiAset, "success" | "warning" | "destructive"> = {
  Baik: "success",
  "Perlu Pemeliharaan": "warning",
  Rusak: "destructive",
};

interface AsetTableClientProps {
  initialData: Aset[];
  kategoriOptions: string[];
}

export function AsetTableClient({ initialData, kategoriOptions }: AsetTableClientProps) {
  const [query, setQuery] = useState("");
  const [kategori, setKategori] = useState<string>("semua");
  const [kondisi, setKondisi] = useState<string>("semua");
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return initialData.filter((aset) => {
      const matchQuery =
        query.trim() === "" ||
        aset.nama.toLowerCase().includes(query.toLowerCase()) ||
        aset.kode.toLowerCase().includes(query.toLowerCase());
      const matchKategori = kategori === "semua" || aset.kategori === kategori;
      const matchKondisi = kondisi === "semua" || aset.kondisi === kondisi;
      return matchQuery && matchKategori && matchKondisi;
    });
  }, [initialData, query, kategori, kondisi]);

  function handleDelete(aset: Aset) {
    const yakin = window.confirm(`Hapus aset "${aset.nama}"? Tindakan ini tidak dapat dibatalkan.`);
    if (!yakin) return;

    setPendingId(aset.id);
    startTransition(async () => {
      const result = await deleteAset(aset.id);
      setPendingId(null);
      if (result?.error) {
        window.alert(`Gagal menghapus aset: ${result.error}`);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau kode aset..."
            className="pl-8"
          />
        </div>
        <Select value={kategori} onValueChange={setKategori}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Kategori</SelectItem>
            {kategoriOptions.map((k) => (
              <SelectItem key={k} value={k}>
                {k}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={kondisi} onValueChange={setKondisi}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Kondisi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Kondisi</SelectItem>
            <SelectItem value="Baik">Baik</SelectItem>
            <SelectItem value="Perlu Pemeliharaan">Perlu Pemeliharaan</SelectItem>
            <SelectItem value="Rusak">Rusak</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm">
            <Download />
            Ekspor
          </Button>
          <Button size="sm">
            <Plus />
            Tambah Aset
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kode</TableHead>
            <TableHead>Nama Aset</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead>Penanggung Jawab</TableHead>
            <TableHead>Tgl. Perolehan</TableHead>
            <TableHead className="text-right">Nilai</TableHead>
            <TableHead>Kondisi</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((aset) => (
            <TableRow
              key={aset.id}
              className={pendingId === aset.id && isPending ? "opacity-50" : undefined}
            >
              <TableCell className="font-mono text-xs text-muted-foreground">
                {aset.kode}
              </TableCell>
              <TableCell className="font-medium text-foreground">{aset.nama}</TableCell>
              <TableCell className="text-muted-foreground">{aset.kategori}</TableCell>
              <TableCell className="text-muted-foreground">{aset.lokasi}</TableCell>
              <TableCell className="text-muted-foreground">{aset.penanggungJawab}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatTanggal(aset.tanggalPerolehan)}
              </TableCell>
              <TableCell className="text-right font-mono text-xs">
                {formatRupiah(aset.nilaiPerolehan)}
              </TableCell>
              <TableCell>
                <Badge variant={kondisiVariant[aset.kondisi]}>{aset.kondisi}</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye /> Lihat Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil /> Edit Aset
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => handleDelete(aset)}>
                      <Trash2 /> Hapus Aset
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                Tidak ada aset yang cocok dengan pencarian/filter ini.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
