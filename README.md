# Kartika Devi Lestari Portfolio

Website portfolio pribadi yang sederhana, modern, responsif, dan siap dipakai untuk kebutuhan magang atau kerja.

## Menjalankan lokal

```bash
python3 -m http.server 4173
```

Buka `http://127.0.0.1:4173/`.

## Mengubah konten

- Edit teks utama di `index.html`.
- Ganti avatar atau sertifikat di folder `assets/`.
- Ubah data kontak dan skill di `index.html` serta `scripts/generate-cv.mjs`.

## Regenerate CV PDF

```bash
node scripts/generate-cv.mjs
```

File output tersimpan di `assets/Kartika-Devi-Lestari-CV.pdf`.
