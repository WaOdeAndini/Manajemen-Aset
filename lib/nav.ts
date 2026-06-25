import {
  LayoutDashboard,
  Boxes,
  FolderTree,
  MapPinned,
  FileBarChart2,
  Users,
  Settings,
  Inbox,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Data Aset", href: "/dashboard/aset", icon: Boxes },
  { label: "Pengajuan Staf", href: "/dashboard/pengajuan", icon: Inbox },
  { label: "Kategori Aset", href: "/dashboard/kategori", icon: FolderTree },
  { label: "Lokasi", href: "/dashboard/lokasi", icon: MapPinned },
  { label: "Laporan", href: "/dashboard/laporan", icon: FileBarChart2 },
  { label: "Pengguna", href: "/dashboard/pengguna", icon: Users },
];

export const navItemsBawah: NavItem[] = [
  { label: "Pengaturan", href: "/dashboard/pengaturan", icon: Settings },
];
