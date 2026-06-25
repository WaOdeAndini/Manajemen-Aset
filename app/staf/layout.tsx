import { redirect } from "next/navigation";

import { Sidebar } from "@/components/layout/sidebar";
import { UserProvider } from "@/components/providers/user-provider";
import { createClient } from "@/lib/supabase/server";
import type { CurrentUser } from "@/lib/types";

function buatInisial(nama: string): string {
  return nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export default async function StafLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, unit_kerja")
    .eq("id", user.id)
    .single();

  // Halaman ini khusus staf — admin diarahkan balik ke dashboard admin.
  if (profile?.role !== "staf") {
    redirect("/dashboard");
  }

  const fullName = profile?.full_name || user.email?.split("@")[0] || "Staf";

  const currentUser: CurrentUser = {
    id: user.id,
    email: user.email ?? "",
    fullName,
    role: "staf",
    unitKerja: profile?.unit_kerja ?? null,
    initials: buatInisial(fullName) || "S",
  };

  return (
    <UserProvider user={currentUser}>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <div className="flex min-h-screen w-full flex-col lg:pl-64">{children}</div>
      </div>
    </UserProvider>
  );
}
