"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";

import { simpanAset, type AsetFormState } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Aset } from "@/lib/types";

interface AsetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aset: Aset | null;
  kategoriOptions: { id: string; nama: string }[];
  lokasiOptions: { id: string; nama: string }[];
}

const initialState: AsetFormState = {};

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Menyimpan..." : (
        <><Save /> {isEdit ? "Simpan Perubahan" : "Tambah Aset"}</>
      )}
    </Button>
  );
}

export function AsetForm({
  open,
  onOpenChange,
  aset,
  kategoriOptions,
  lokasiOptions,
}: AsetFormProps) {
  const [state, formAction] = useActionState(simpanAset, initialState);
  const isEdit = !!aset;

  // Tutup sheet otomatis saat berhasil tersimpan
  const [lastSuccess, setLastSuccess] = useState(state.success);
  if (state.success !== lastSuccess) {
    setLastSuccess(state.success);
    if (state.success) onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="bg-card text-foreground border-border overflow-y-auto w-full sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Aset" : "Tambah Aset Baru"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Perbarui data aset yang sudah terdaftar."
              : "Isi data aset baru untuk didaftarkan ke sistem."}
          </SheetDescription>
        </SheetHeader>

        <form
          key={aset?.id ?? "new"}
          action={formAction}
          className="flex flex-col gap-4 px-5 pb-6 pt-2"
        >
          <input type="hidden" name="id" value={aset?.id ?? ""} />

          {state.error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive-soft px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}
          {state.success && (
            <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary-soft px-3 py-2.5 text-sm text-primary">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              <span>{state.success}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="kode">Kode Aset</Label>
              <Input
                id="kode"
                name="kode"
                placeholder="BZ-ELK-0001"
                defaultValue={aset?.kode ?? ""}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nama">Nama Aset</Label>
              <Input
                id="nama"
                name="nama"
                placeholder="Laptop Lenovo ThinkPad"
                defaultValue={aset?.nama ?? ""}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="kategori_id">Kategori</Label>
              <Select name="kategori_id" defaultValue={aset?.kategoriId ?? ""}>
                <SelectTrigger id="kategori_id">
                  <SelectValue placeholder="Pilih kategori..." />
                </SelectTrigger>
                <SelectContent>
                  {kategoriOptions.map((k) => (
                    <SelectItem key={k.id} value={k.id}>{k.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lokasi_id">Lokasi</Label>
              <Select name="lokasi_id" defaultValue={aset?.lokasiId ?? ""}>
                <SelectTrigger id="lokasi_id">
                  <SelectValue placeholder="Pilih lokasi..." />
                </SelectTrigger>
                <SelectContent>
                  {lokasiOptions.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="unit_kerja">Unit Kerja</Label>
              <Input
                id="unit_kerja"
                name="unit_kerja"
                placeholder="Divisi TI"
                defaultValue={aset?.unitKerja ?? ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="penanggung_jawab">Penanggung Jawab</Label>
              <Input
                id="penanggung_jawab"
                name="penanggung_jawab"
                placeholder="Nama staf..."
                defaultValue={aset?.penanggungJawab ?? ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tanggal_perolehan">Tanggal Perolehan</Label>
              <Input
                id="tanggal_perolehan"
                name="tanggal_perolehan"
                type="date"
                defaultValue={aset?.tanggalPerolehan ?? ""}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nilai_perolehan">Nilai Perolehan (Rp)</Label>
              <Input
                id="nilai_perolehan"
                name="nilai_perolehan"
                type="number"
                min="0"
                placeholder="12500000"
                defaultValue={aset?.nilaiPerolehan ?? ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="kondisi">Kondisi</Label>
              <Select name="kondisi" defaultValue={aset?.kondisi ?? "Baik"}>
                <SelectTrigger id="kondisi">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baik">Baik</SelectItem>
                  <SelectItem value="Perlu Pemeliharaan">Perlu Pemeliharaan</SelectItem>
                  <SelectItem value="Rusak">Rusak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={aset?.status ?? "Digunakan"}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Digunakan">Digunakan</SelectItem>
                  <SelectItem value="Disimpan">Disimpan</SelectItem>
                  <SelectItem value="Dipinjamkan">Dipinjamkan</SelectItem>
                  <SelectItem value="Dihapuskan">Dihapuskan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="catatan">Catatan (opsional)</Label>
            <Textarea
              id="catatan"
              name="catatan"
              placeholder="Keterangan tambahan tentang aset ini..."
              defaultValue={aset?.catatan ?? ""}
              rows={3}
            />
          </div>

          <SubmitButton isEdit={isEdit} />
        </form>
      </SheetContent>
    </Sheet>
  );
}