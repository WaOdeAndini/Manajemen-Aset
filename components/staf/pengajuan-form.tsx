"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Send, Wrench, CalendarRange, MapPinned } from "lucide-react";

import { buatPengajuan, type PengajuanFormState } from "@/lib/supabase/pengajuan-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AsetOption, LokasiOption } from "@/lib/types";

const initialState: PengajuanFormState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Mengirim..." : <><Send /> {label}</>}
    </Button>
  );
}

function FeedbackBox({ state }: { state: PengajuanFormState }) {
  if (state.error) {
    return (
      <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive-soft px-3 py-2.5 text-sm text-destructive">
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
        <span>{state.error}</span>
      </div>
    );
  }
  if (state.success) {
    return (
      <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary-soft px-3 py-2.5 text-sm text-primary">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
        <span>{state.success}</span>
      </div>
    );
  }
  return null;
}

function AsetSelect({ asetList, name = "aset_id" }: { asetList: AsetOption[]; name?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>Pilih Aset</Label>
      <Select name={name} required>
        <SelectTrigger id={name} className="w-full">
          <SelectValue placeholder="Cari & pilih aset..." />
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
  );
}

interface PengajuanFormProps {
  asetList: AsetOption[];
  lokasiList: LokasiOption[];
}

export function PengajuanForm({ asetList, lokasiList }: PengajuanFormProps) {
  const [keluhanState, keluhanAction] = useActionState(buatPengajuan, initialState);
  const [peminjamanState, peminjamanAction] = useActionState(buatPengajuan, initialState);
  const [pemindahanState, pemindahanAction] = useActionState(buatPengajuan, initialState);

  return (
    <Tabs defaultValue="keluhan">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="keluhan">
          <Wrench className="mr-1.5 size-4" /> Keluhan
        </TabsTrigger>
        <TabsTrigger value="peminjaman">
          <CalendarRange className="mr-1.5 size-4" /> Peminjaman
        </TabsTrigger>
        <TabsTrigger value="pemindahan">
          <MapPinned className="mr-1.5 size-4" /> Pemindahan
        </TabsTrigger>
      </TabsList>

      {/* === KELUHAN / LAPORAN KERUSAKAN === */}
      <TabsContent value="keluhan">
        <form action={keluhanAction} className="space-y-4">
          <input type="hidden" name="tipe" value="keluhan" />
          <p className="text-sm text-muted-foreground">
            Laporkan aset yang rusak atau bermasalah agar segera ditindaklanjuti admin.
          </p>

          <FeedbackBox state={keluhanState} />

          <AsetSelect asetList={asetList} />

          <div className="space-y-1.5">
            <Label htmlFor="kondisi_dilaporkan">Perkiraan Kondisi</Label>
            <Select name="kondisi_dilaporkan" required>
              <SelectTrigger id="kondisi_dilaporkan" className="w-full">
                <SelectValue placeholder="Pilih perkiraan kondisi..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Perlu Pemeliharaan">Perlu Pemeliharaan</SelectItem>
                <SelectItem value="Rusak">Rusak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="deskripsi_keluhan">Detail Keluhan</Label>
            <Textarea
              id="deskripsi_keluhan"
              name="deskripsi"
              placeholder="Jelaskan masalah yang ditemukan pada aset ini..."
              required
            />
          </div>

          <SubmitButton label="Kirim Laporan" />
        </form>
      </TabsContent>

      {/* === PEMINJAMAN / PENGGUNAAN === */}
      <TabsContent value="peminjaman">
        <form action={peminjamanAction} className="space-y-4">
          <input type="hidden" name="tipe" value="peminjaman" />
          <p className="text-sm text-muted-foreground">
            Ajukan penggunaan/peminjaman aset untuk keperluan tugas Anda.
          </p>

          <FeedbackBox state={peminjamanState} />

          <AsetSelect asetList={asetList} />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
              <Input id="tanggal_mulai" name="tanggal_mulai" type="date" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
              <Input id="tanggal_selesai" name="tanggal_selesai" type="date" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="deskripsi_pinjam">Keperluan</Label>
            <Textarea
              id="deskripsi_pinjam"
              name="deskripsi"
              placeholder="Jelaskan untuk keperluan apa aset ini digunakan..."
            />
          </div>

          <SubmitButton label="Ajukan Peminjaman" />
        </form>
      </TabsContent>

      {/* === PEMINDAHAN LOKASI === */}
      <TabsContent value="pemindahan">
        <form action={pemindahanAction} className="space-y-4">
          <input type="hidden" name="tipe" value="pemindahan" />
          <p className="text-sm text-muted-foreground">
            Laporkan jika sebuah aset berpindah lokasi dari pencatatan saat ini.
          </p>

          <FeedbackBox state={pemindahanState} />

          <AsetSelect asetList={asetList} />

          <div className="space-y-1.5">
            <Label htmlFor="lokasi_tujuan_id">Lokasi Tujuan</Label>
            <Select name="lokasi_tujuan_id" required>
              <SelectTrigger id="lokasi_tujuan_id" className="w-full">
                <SelectValue placeholder="Pilih lokasi tujuan..." />
              </SelectTrigger>
              <SelectContent>
                {lokasiList.map((lokasi) => (
                  <SelectItem key={lokasi.id} value={lokasi.id}>
                    {lokasi.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="deskripsi_pindah">Alasan Pemindahan</Label>
            <Textarea
              id="deskripsi_pindah"
              name="deskripsi"
              placeholder="Jelaskan alasan pemindahan lokasi aset ini..."
            />
          </div>

          <SubmitButton label="Kirim Laporan Pemindahan" />
        </form>
      </TabsContent>
    </Tabs>
  );
}
