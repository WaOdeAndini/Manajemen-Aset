import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AsetTableClient } from "@/components/dashboard/aset-table-client";
import { createClient } from "@/lib/supabase/server";
import { getAsetList, getKategoriOptions, getLokasiOptions } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function DataAsetPage() {
  const supabase = await createClient();

  const [asetList, kategoriRows, lokasiRows] = await Promise.all([
    getAsetList(supabase),
    getKategoriOptions(supabase),
    getLokasiOptions(supabase),
  ]);

  return (
    <>
      <Header
        title="Data Aset"
        description="Kelola seluruh aset BAZNAS yang tercatat dalam sistem"
      />
      <main className="flex-1 space-y-4 p-4 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Daftar Aset</CardTitle>
            <CardDescription>
              Menampilkan {asetList.length} aset tercatat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AsetTableClient
              initialData={asetList}
              kategoriOptions={kategoriRows.map((k) => k.nama)}
              kategoriWithId={kategoriRows}
              lokasiOptions={lokasiRows}
            />
          </CardContent>
        </Card>
      </main>
    </>
  );
}

// import { Header } from "@/components/layout/header";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { AsetTableClient } from "@/components/dashboard/aset-table-client";
// import { createClient } from "@/lib/supabase/server";
// import { getAsetList, getKategoriOptions } from "@/lib/supabase/queries";

// export const dynamic = "force-dynamic";

// export default async function DataAsetPage() {
//   const supabase = await createClient();

//   const [asetList, kategoriRows] = await Promise.all([
//     getAsetList(supabase),
//     getKategoriOptions(supabase),
//   ]);

//   return (
//     <>
//       <Header title="Data Aset" description="Kelola seluruh aset BAZNAS yang tercatat dalam sistem" />

//       <main className="flex-1 space-y-4 p-4 lg:p-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Daftar Aset</CardTitle>
//             <CardDescription>
//               Menampilkan {asetList.length} aset tercatat dari Supabase
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <AsetTableClient
//               initialData={asetList}
//               kategoriOptions={kategoriRows.map((k) => k.nama)}
//             />
//           </CardContent>
//         </Card>
//       </main>
//     </>
//   );
// }
