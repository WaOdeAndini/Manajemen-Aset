import { type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16: file ini menggantikan middleware.ts (lihat
// https://nextjs.org/docs/messages/middleware-to-proxy). Fungsinya tetap
// sama: refresh session Supabase di setiap request + proteksi route.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Jalankan proxy di semua path kecuali file statis & gambar,
     * supaya tidak membebani request aset Next.js (_next/static, _next/image, dll).
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
