import { MapPinned } from "lucide-react";
import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function LokasiPage() {
  return (
    <PlaceholderPage
      title="Lokasi"
      description="Kelola data lokasi penempatan aset BAZNAS"
      icon={MapPinned}
    />
  );
}
