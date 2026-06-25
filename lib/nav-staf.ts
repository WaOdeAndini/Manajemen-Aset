import { Wrench, FilePlus2, History } from "lucide-react";

import type { NavItem } from "@/lib/nav";

export const navItemsStaf: NavItem[] = [
  { label: "Laporan/Keluhan Aset", href: "/staf/keluhan", icon: Wrench },
  { label: "Pengajuan Lainnya", href: "/staf/pengajuan", icon: FilePlus2 },
  { label: "Riwayat Saya", href: "/staf/riwayat", icon: History },
];
