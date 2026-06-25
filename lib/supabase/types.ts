// Tipe ini ditulis manual agar cocok dengan skema di `supabase/migrations/0001_schema.sql`.
// Setelah project Supabase aktif, Anda bisa menggantinya dengan tipe hasil generate otomatis:
//   npx supabase gen types typescript --project-id <project-id> > lib/supabase/types.ts

export type KondisiAset = "Baik" | "Perlu Pemeliharaan" | "Rusak";
export type StatusAset = "Digunakan" | "Disimpan" | "Dipinjamkan" | "Dihapuskan";
export type TipeAktivitas = "tambah" | "ubah" | "peringatan" | "selesai" | "hapus";
export type PeranPengguna = "admin" | "staf";
export type TipePengajuan = "keluhan" | "peminjaman" | "pemindahan";
export type StatusPengajuan = "menunggu" | "disetujui" | "ditolak" | "selesai";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: PeranPengguna;
          unit_kerja: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: PeranPengguna;
          unit_kerja?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      kategori_aset: {
        Row: {
          id: string;
          nama: string;
          deskripsi: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nama: string;
          deskripsi?: string | null;
        };
        Relationships: [];
        Update: Partial<Database["public"]["Tables"]["kategori_aset"]["Insert"]>;
      };
      lokasi: {
        Row: {
          id: string;
          nama: string;
          alamat: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nama: string;
          alamat?: string | null;
        };
        Relationships: [];
        Update: Partial<Database["public"]["Tables"]["lokasi"]["Insert"]>;
      };
      aset: {
        Row: {
          id: string;
          kode: string;
          nama: string;
          kategori_id: string | null;
          lokasi_id: string | null;
          unit_kerja: string | null;
          tanggal_perolehan: string;
          nilai_perolehan: number;
          kondisi: KondisiAset;
          status: StatusAset;
          penanggung_jawab: string | null;
          catatan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          kode: string;
          nama: string;
          kategori_id?: string | null;
          lokasi_id?: string | null;
          unit_kerja?: string | null;
          tanggal_perolehan: string;
          nilai_perolehan: number;
          kondisi?: KondisiAset;
          status?: StatusAset;
          penanggung_jawab?: string | null;
          catatan?: string | null;
        };
        Relationships: [];
        Update: Partial<Database["public"]["Tables"]["aset"]["Insert"]>;
      };
      aktivitas_log: {
        Row: {
          id: string;
          aset_id: string | null;
          aksi: string;
          tipe: TipeAktivitas;
          pelaku_id: string | null;
          pelaku_nama: string | null;
          keterangan: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          aset_id?: string | null;
          aksi: string;
          tipe?: TipeAktivitas;
          pelaku_id?: string | null;
          pelaku_nama?: string | null;
          keterangan?: string | null;
        };
        Relationships: [];
        Update: Partial<Database["public"]["Tables"]["aktivitas_log"]["Insert"]>;
      };
      pengajuan_aset: {
        Row: {
          id: string;
          tipe: TipePengajuan;
          aset_id: string;
          pemohon_id: string;
          judul: string;
          deskripsi: string | null;
          kondisi_dilaporkan: "Perlu Pemeliharaan" | "Rusak" | null;
          tanggal_mulai: string | null;
          tanggal_selesai: string | null;
          lokasi_asal_id: string | null;
          lokasi_tujuan_id: string | null;
          status: StatusPengajuan;
          catatan_admin: string | null;
          diproses_oleh: string | null;
          diproses_pada: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tipe: TipePengajuan;
          aset_id: string;
          pemohon_id: string;
          judul: string;
          deskripsi?: string | null;
          kondisi_dilaporkan?: "Perlu Pemeliharaan" | "Rusak" | null;
          tanggal_mulai?: string | null;
          tanggal_selesai?: string | null;
          lokasi_asal_id?: string | null;
          lokasi_tujuan_id?: string | null;
          status?: StatusPengajuan;
          catatan_admin?: string | null;
          diproses_oleh?: string | null;
          diproses_pada?: string | null;
        };
        Relationships: [];
        Update: Partial<Database["public"]["Tables"]["pengajuan_aset"]["Insert"]>;
      };
      notifikasi: {
        Row: {
          id: string;
          pengajuan_id: string | null;
          judul: string;
          pesan: string | null;
          dibaca: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          pengajuan_id?: string | null;
          judul: string;
          pesan?: string | null;
          dibaca?: boolean;
        };
        Relationships: [];
        Update: Partial<Database["public"]["Tables"]["notifikasi"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
