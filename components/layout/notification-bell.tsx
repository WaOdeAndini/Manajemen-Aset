"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { waktuRelatif } from "@/lib/format";
import type { NotifikasiItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  tandaiNotifikasiDibaca,
  tandaiSemuaNotifikasiDibaca,
} from "@/lib/supabase/pengajuan-actions";

const POLL_MS = 20_000;

export function NotificationBell() {
  const [items, setItems] = useState<NotifikasiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const muat = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notifikasi")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8);

    if (!error && data) {
      setItems(
        data.map((row) => ({
          id: row.id,
          pengajuanId: row.pengajuan_id,
          judul: row.judul,
          pesan: row.pesan,
          dibaca: row.dibaca,
          createdAt: row.created_at,
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Fetch saat mount lalu polling berkala — setState terjadi async di
    // dalam `muat()` setelah request selesai, bukan sinkron di body effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    muat();
    const interval = setInterval(muat, POLL_MS);
    return () => clearInterval(interval);
  }, [muat]);

  const belumDibaca = items.filter((i) => !i.dibaca).length;

  async function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) await muat();
  }

  async function handleItemClick(item: NotifikasiItem) {
    if (item.dibaca) return;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, dibaca: true } : i)));
    await tandaiNotifikasiDibaca(item.id);
  }

  async function handleTandaiSemua() {
    setItems((prev) => prev.map((i) => ({ ...i, dibaca: true })));
    await tandaiSemuaNotifikasiDibaca();
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {belumDibaca > 0 && (
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-card" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between text-sm font-medium text-foreground">
          Notifikasi
          {belumDibaca > 0 && <Badge variant="destructive">{belumDibaca} baru</Badge>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading ? (
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-muted-foreground">
            Belum ada notifikasi.
          </p>
        ) : (
          items.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="flex flex-col items-start gap-0.5 py-2"
            >
              <span className="flex w-full items-start gap-2 text-sm text-foreground">
                {!item.dibaca && (
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                )}
                <span className={item.dibaca ? "text-muted-foreground" : "font-medium"}>
                  {item.judul}
                </span>
              </span>
              {item.pesan && (
                <span className="pl-3.5 text-xs text-muted-foreground">{item.pesan}</span>
              )}
              <span className="pl-3.5 text-[11px] text-muted-foreground/80">
                {waktuRelatif(item.createdAt)}
              </span>
            </DropdownMenuItem>
          ))
        )}

        {belumDibaca > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary" onClick={handleTandaiSemua}>
              Tandai semua sudah dibaca
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
