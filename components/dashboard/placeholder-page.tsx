import { type LucideIcon, Construction } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function PlaceholderPage({ title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <>
      <Header title={title} description={description} />
      <main className="flex-1 p-4 lg:p-6">
        <Card className="flex min-h-[60vh] items-center justify-center">
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
              <Icon className="size-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Halaman {title} sedang disiapkan</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Bagian ini dapat dikembangkan lebih lanjut sesuai kebutuhan modul {title.toLowerCase()} pada sistem.
              </p>
            </div>
            <div className="mt-2 flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
              <Construction className="size-3.5" />
              Dalam pengembangan
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
