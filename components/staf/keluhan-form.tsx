"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";

import { buatPengajuan, type PengajuanFormState } from "@/lib/supabase/pengajuan-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AsetOption } from "@/lib/types";

const initialState: PengajuanFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        "Mengirim..."
      ) : (
        <>
          <Send /> Kirim Laporan
        </>
      )}
    </Button>
  );
}

export function KeluhanForm({ asetList }: { asetList: AsetOption[] }) {
  const [state, formAction] = useActionState(buatPengajuan, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {/* Server action buatPengajuan membedakan jenis pengajuan lewat field ini */}
      <input type="hidden" name="tipe" value="keluhan" />

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

      <div className="space-y-1.5">
        <Label htmlFor="aset_id">Pilih Aset</Label>
        <Select name="aset_id" required>
          <SelectTrigger id="aset_id" className="w-full">
            <SelectValue placeholder="Cari & pilih aset yang bermasalah..." />
          </SelectTrigger>
          <SelectContent>
            {asetList.map((aset) => (
              <SelectItem key={aset.id} value={aset.id}>
                {aset.kode} — {aset.nama} ({aset.lokasiNama})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="kondisi_dilaporkan">Perkiraan Kondisi</Label>
        <Select name="kondisi_dilaporkan" required>
          <SelectTrigger id="kondisi_dilaporkan" className="w-full">
            <SelectValue placeholder="Pilih perkiraan kondisi aset..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Perlu Pemeliharaan">Perlu Pemeliharaan</SelectItem>
            <SelectItem value="Rusak">Rusak</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Perkiraan Anda akan ditinjau admin sebelum status aset benar-benar diperbarui.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="deskripsi">Detail Keluhan / Kerusakan</Label>
        <Textarea
          id="deskripsi"
          name="deskripsi"
          placeholder="Jelaskan masalah yang Anda temukan pada aset ini, sejak kapan, dan dampaknya..."
          rows={4}
          required
        />
      </div>

      <SubmitButton />
    </form>
  );
}
