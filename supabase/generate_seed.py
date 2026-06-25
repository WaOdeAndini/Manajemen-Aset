import random
from datetime import date, timedelta

random.seed(42)

TODAY = date(2026, 6, 19)

KATEGORI = [
    ("11111111-1111-1111-1111-000000000001", "Elektronik & TI"),
    ("11111111-1111-1111-1111-000000000002", "Kendaraan"),
    ("11111111-1111-1111-1111-000000000003", "Furnitur & Perlengkapan"),
    ("11111111-1111-1111-1111-000000000004", "Bangunan & Gedung"),
    ("11111111-1111-1111-1111-000000000005", "Lainnya"),
]

LOKASI = [
    ("22222222-2222-2222-2222-000000000001", "Kantor Pusat — Lt. 1", "Jl. Kebon Sirih No. 57, Jakarta Pusat"),
    ("22222222-2222-2222-2222-000000000002", "Kantor Pusat — Lt. 2", "Jl. Kebon Sirih No. 57, Jakarta Pusat"),
    ("22222222-2222-2222-2222-000000000003", "Kantor Pusat — Lt. 3", "Jl. Kebon Sirih No. 57, Jakarta Pusat"),
    ("22222222-2222-2222-2222-000000000004", "Kantor Pusat — Lt. 4", "Jl. Kebon Sirih No. 57, Jakarta Pusat"),
    ("22222222-2222-2222-2222-000000000005", "Gudang Arsip", "Jl. Kebon Sirih No. 57, Jakarta Pusat"),
    ("22222222-2222-2222-2222-000000000006", "Ruang Server", "Jl. Kebon Sirih No. 57, Jakarta Pusat"),
    ("22222222-2222-2222-2222-000000000007", "Ruang Rapat Utama", "Jl. Kebon Sirih No. 57, Jakarta Pusat"),
    ("22222222-2222-2222-2222-000000000008", "Garasi Kantor Pusat", "Jl. Kebon Sirih No. 57, Jakarta Pusat"),
    ("22222222-2222-2222-2222-000000000009", "Kantor Cabang Bandung", "Jl. Soekarno-Hatta No. 12, Bandung"),
    ("22222222-2222-2222-2222-00000000000a", "Kantor Cabang Surabaya", "Jl. Darmo No. 88, Surabaya"),
]

UNIT_KERJA = [
    "Divisi Pengumpulan", "Divisi Pendistribusian", "Divisi Keuangan",
    "Divisi SDM", "Divisi TI", "Sekretariat",
]

PIC = [
    "Siti Nurhaliza", "Ahmad Fauzan", "Rina Marlina", "Budi Santoso",
    "Dedi Kurniawan", "Maya Puspita", "Hendra Wijaya", "Indah Lestari",
    "Fajar Ramadhan", "Wahyu Hidayat",
]

# (nama_template, kategori_idx, rentang_nilai, kode_prefix)
ASET_TEMPLATE = {
    0: [  # Elektronik & TI
        ("Laptop Lenovo ThinkPad E14", (10_000_000, 15_000_000)),
        ("Laptop Asus Vivobook", (7_000_000, 10_000_000)),
        ("PC Desktop HP ProDesk", (8_000_000, 12_000_000)),
        ("Printer Epson L3210", (2_000_000, 2_800_000)),
        ("Printer Canon G2010", (2_200_000, 3_000_000)),
        ("Proyektor Epson EB-X06", (5_500_000, 7_500_000)),
        ("AC Split Daikin 1.5 PK", (4_800_000, 6_200_000)),
        ("AC Split Panasonic 1 PK", (3_600_000, 4_800_000)),
        ("Server Rack Dell PowerEdge T340", (65_000_000, 85_000_000)),
        ("Switch Jaringan Cisco 24 Port", (9_000_000, 13_000_000)),
        ("Router Mikrotik RB1100", (4_500_000, 6_000_000)),
        ("CCTV Hikvision (Set 8 Kamera)", (18_000_000, 24_000_000)),
        ("UPS APC 1000VA", (2_500_000, 3_500_000)),
        ("Telepon IP Yealink", (1_200_000, 1_800_000)),
        ("Scanner Dokumen Fujitsu", (6_500_000, 9_000_000)),
    ],
    1: [  # Kendaraan
        ("Toyota Avanza — Operasional", (210_000_000, 230_000_000)),
        ("Daihatsu Gran Max Box", (155_000_000, 175_000_000)),
        ("Honda Vario 125 — Operasional", (20_000_000, 23_000_000)),
        ("Toyota Hilux Double Cabin", (320_000_000, 360_000_000)),
        ("Mitsubishi Pajero Sport", (480_000_000, 520_000_000)),
        ("Yamaha NMAX — Operasional", (32_000_000, 36_000_000)),
    ],
    2: [  # Furnitur & Perlengkapan
        ("Lemari Arsip Besi 4 Pintu", (3_800_000, 4_800_000)),
        ("Meja Kerja Staf (Set 6 Unit)", (8_500_000, 11_000_000)),
        ("Kursi Kantor Ergonomis (Set 10 Unit)", (12_000_000, 16_000_000)),
        ("Kursi Tunggu Tamu (Set 4 Unit)", (6_500_000, 8_500_000)),
        ("Meja Rapat Besar", (9_000_000, 13_000_000)),
        ("Whiteboard Magnetic", (900_000, 1_400_000)),
        ("Filing Cabinet 4 Laci", (2_800_000, 3_600_000)),
        ("Rak Buku Besi", (1_800_000, 2_600_000)),
        ("Sofa Ruang Tamu", (7_500_000, 10_500_000)),
    ],
    3: [  # Bangunan & Gedung
        ("Gedung Kantor Layanan Mustahik", (4_200_000_000, 4_800_000_000)),
        ("Gedung Kantor Pusat", (8_500_000_000, 9_500_000_000)),
        ("Mushola Kantor", (650_000_000, 850_000_000)),
        ("Gudang Logistik Bantuan", (1_200_000_000, 1_600_000_000)),
    ],
    4: [  # Lainnya
        ("Genset Diesel 10kVA", (45_000_000, 60_000_000)),
        ("Dispenser Air Galon", (650_000, 950_000)),
        ("Mesin Fotokopi Canon", (28_000_000, 36_000_000)),
        ("Mesin Penghancur Dokumen", (3_200_000, 4_500_000)),
        ("Tenda Posko Bencana", (5_500_000, 7_500_000)),
        ("Kursi Roda Bantuan (Set 5 Unit)", (4_000_000, 5_500_000)),
    ],
}

KODE_PREFIX = {0: "ELK", 1: "KDR", 2: "FRN", 3: "BGN", 4: "LNN"}

# Target jumlah aset per kategori (total = 42)
TARGET_PER_KATEGORI = {0: 14, 1: 6, 2: 12, 3: 4, 4: 6}

# Distribusi kondisi -> sekitar 81% baik, 12% perlu pemeliharaan, 7% rusak
def pilih_kondisi():
    r = random.random()
    if r < 0.81:
        return "Baik"
    elif r < 0.93:
        return "Perlu Pemeliharaan"
    return "Rusak"

def pilih_status(kondisi, kategori_idx):
    if kondisi == "Rusak" and random.random() < 0.3:
        return "Dihapuskan" if random.random() < 0.3 else "Disimpan"
    if kategori_idx == 1 and random.random() < 0.15:
        return "Dipinjamkan"
    if random.random() < 0.08:
        return "Disimpan"
    return "Digunakan"

def tanggal_acak():
    # Sebar dalam 20 bulan terakhir, sedikit lebih padat di bulan2 baru-baru ini
    hari_mundur = int(random.triangular(0, 610, 60))
    return TODAY - timedelta(days=hari_mundur)

rows = []
kode_counter = {}

for kat_idx, jumlah in TARGET_PER_KATEGORI.items():
    templates = ASET_TEMPLATE[kat_idx]
    prefix = KODE_PREFIX[kat_idx]
    chosen = []
    # Pastikan tiap template terpakai minimal sekali sebelum mengulang
    pool = templates.copy()
    random.shuffle(pool)
    i = 0
    while len(chosen) < jumlah:
        chosen.append(pool[i % len(pool)])
        i += 1

    for nama, (lo, hi) in chosen:
        kode_counter[prefix] = kode_counter.get(prefix, 0) + 1
        kode = f"BZ-{prefix}-{(200 + kode_counter[prefix] * 7) % 999:04d}"
        nilai = random.randint(lo // 100, hi // 100) * 100
        kondisi = pilih_kondisi()
        status = pilih_status(kondisi, kat_idx)
        lokasi = random.choice(LOKASI)
        unit = random.choice(UNIT_KERJA)
        pic = random.choice(PIC)
        tgl = tanggal_acak()
        catatan = None
        if kondisi == "Rusak":
            catatan = "Menunggu tindak lanjut perbaikan/penghapusan."
        elif kondisi == "Perlu Pemeliharaan":
            catatan = "Dijadwalkan pemeliharaan rutin."

        rows.append({
            "kode": kode,
            "nama": nama,
            "kategori_id": KATEGORI[kat_idx][0],
            "lokasi_id": lokasi[0],
            "unit_kerja": unit,
            "tanggal_perolehan": tgl.isoformat(),
            "nilai_perolehan": nilai,
            "kondisi": kondisi,
            "status": status,
            "penanggung_jawab": pic,
            "catatan": catatan,
        })

# Pastikan kode unik
kodes = [r["kode"] for r in rows]
assert len(kodes) == len(set(kodes)), "Ada kode duplikat!"

def sql_str(v):
    if v is None:
        return "NULL"
    return "'" + str(v).replace("'", "''") + "'"

lines = []
lines.append("-- =====================================================================")
lines.append("-- SIMA BAZNAS — Seed Data")
lines.append("-- Jalankan SETELAH supabase/migrations/0001_schema.sql berhasil dijalankan.")
lines.append("-- Aman dijalankan berulang kali (idempotent) berkat ON CONFLICT DO NOTHING")
lines.append("-- dan penggunaan UUID tetap untuk kategori & lokasi.")
lines.append("-- =====================================================================")
lines.append("")
lines.append("-- ---------------------------------------------------------------------")
lines.append("-- 1. KATEGORI ASET")
lines.append("-- ---------------------------------------------------------------------")
lines.append("insert into public.kategori_aset (id, nama, deskripsi) values")
kat_desc = {
    0: "Perangkat komputer, jaringan, dan elektronik kantor",
    1: "Kendaraan dinas & operasional roda dua/empat",
    2: "Perabot dan perlengkapan kerja",
    3: "Gedung, ruang, dan bangunan milik BAZNAS",
    4: "Aset penunjang operasional lainnya",
}
kat_values = []
for idx, (kid, nama) in enumerate(KATEGORI):
    kat_values.append(f"  ({sql_str(kid)}, {sql_str(nama)}, {sql_str(kat_desc[idx])})")
lines.append(",\n".join(kat_values) + "\non conflict (id) do nothing;")
lines.append("")

lines.append("-- ---------------------------------------------------------------------")
lines.append("-- 2. LOKASI")
lines.append("-- ---------------------------------------------------------------------")
lines.append("insert into public.lokasi (id, nama, alamat) values")
lok_values = []
for lid, nama, alamat in LOKASI:
    lok_values.append(f"  ({sql_str(lid)}, {sql_str(nama)}, {sql_str(alamat)})")
lines.append(",\n".join(lok_values) + "\non conflict (id) do nothing;")
lines.append("")

lines.append("-- ---------------------------------------------------------------------")
lines.append(f"-- 3. ASET ({len(rows)} baris)")
lines.append("-- ---------------------------------------------------------------------")
lines.append(
    "insert into public.aset\n"
    "  (kode, nama, kategori_id, lokasi_id, unit_kerja, tanggal_perolehan,\n"
    "   nilai_perolehan, kondisi, status, penanggung_jawab, catatan)\nvalues"
)
aset_values = []
for r in rows:
    aset_values.append(
        "  (" + ", ".join([
            sql_str(r["kode"]), sql_str(r["nama"]), sql_str(r["kategori_id"]),
            sql_str(r["lokasi_id"]), sql_str(r["unit_kerja"]),
            sql_str(r["tanggal_perolehan"]), str(r["nilai_perolehan"]),
            sql_str(r["kondisi"]), sql_str(r["status"]), sql_str(r["penanggung_jawab"]),
            sql_str(r["catatan"]),
        ]) + ")"
    )
lines.append(",\n".join(aset_values) + "\non conflict (kode) do nothing;")
lines.append("")

# Aktivitas log — ambil beberapa aset acak untuk dijadikan riwayat aktivitas
lines.append("-- ---------------------------------------------------------------------")
lines.append("-- 4. AKTIVITAS LOG (contoh riwayat aktivitas terbaru)")
lines.append("-- ---------------------------------------------------------------------")

random.shuffle(rows)
sample = rows[:8]
aktivitas_defs = [
    ("menambahkan aset baru", "tambah", "Siti Nurhaliza"),
    ("memperbarui status aset", "ubah", "Ahmad Fauzan"),
    ("melaporkan kerusakan", "peringatan", "Budi Santoso"),
    ("menyelesaikan pemeliharaan", "selesai", "Fajar Ramadhan"),
    ("menghapuskan aset", "hapus", "Rina Marlina"),
    ("memindahkan lokasi aset", "ubah", "Dedi Kurniawan"),
    ("mencatat hasil audit aset", "ubah", "Maya Puspita"),
    ("menambahkan aset baru", "tambah", "Hendra Wijaya"),
]

lines.append(
    "insert into public.aktivitas_log (aset_id, aksi, tipe, pelaku_nama, keterangan, created_at)\nvalues"
)
akt_values = []
now_offsets = [10, 70, 180, 1500, 1450, 2900, 4200, 5800]  # menit lalu, makin lama makin besar
for (aset, (aksi, tipe, pelaku), menit_lalu) in zip(sample, aktivitas_defs, now_offsets):
    akt_values.append(
        "  ((select id from public.aset where kode = "
        + sql_str(aset["kode"])
        + "), "
        + sql_str(aksi) + ", " + sql_str(tipe) + ", " + sql_str(pelaku) + ", "
        + sql_str(aset["nama"]) + ", "
        + f"now() - interval '{menit_lalu} minutes')"
    )
lines.append(",\n".join(akt_values) + ";")
lines.append("")

with open("/home/claude/baznas-asset-dashboard/supabase/seed.sql", "w") as f:
    f.write("\n".join(lines) + "\n")

print(f"Generated {len(rows)} aset rows")
from collections import Counter
print("Per kategori:", Counter(r["kategori_id"] for r in rows))
print("Per kondisi:", Counter(r["kondisi"] for r in rows))
print("Total nilai:", sum(r["nilai_perolehan"] for r in rows))
