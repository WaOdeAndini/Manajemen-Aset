import { PlusCircle, RefreshCcw, AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";

import type { AktivitasItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const tipeStyle: Record<
  AktivitasItem["tipe"],
  { icon: typeof PlusCircle; wrap: string; icon_: string }
> = {
  tambah: { icon: PlusCircle, wrap: "bg-primary-soft", icon_: "text-primary" },
  ubah: { icon: RefreshCcw, wrap: "bg-secondary", icon_: "text-[var(--color-chart-3)]" },
  peringatan: { icon: AlertTriangle, wrap: "bg-warning-soft", icon_: "text-warning" },
  selesai: { icon: CheckCircle2, wrap: "bg-primary-soft", icon_: "text-primary" },
  hapus: { icon: Trash2, wrap: "bg-destructive-soft", icon_: "text-destructive" },
};

export function ActivityFeed({ data }: { data: AktivitasItem[] }) {
  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Belum ada aktivitas tercatat.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {data.map((item, idx) => {
        const style = tipeStyle[item.tipe];
        const Icon = style.icon;
        return (
          <li key={item.id} className="relative flex gap-3">
            {idx !== data.length - 1 && (
              <span className="absolute left-[15px] top-8 h-[calc(100%-0.5rem)] w-px bg-border" />
            )}
            <div
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
                style.wrap
              )}
            >
              <Icon className={cn("size-3.5", style.icon_)} />
            </div>
            <div className="min-w-0 flex-1 pb-0.5">
              <p className="text-sm text-foreground">
                <span className="font-medium">{item.pelaku}</span>{" "}
                <span className="text-muted-foreground">{item.aksi}</span>
              </p>
              <p className="truncate text-xs text-muted-foreground">{item.objek}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground/80">{item.waktu}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
