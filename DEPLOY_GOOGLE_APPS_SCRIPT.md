# Panduan Deploy QUEST Academy ke Google Apps Script (script.google.com)

Game **QUEST Academy** telah dikonfigurasi dengan plugin `vite-plugin-singlefile` sehingga saat di-*build*, seluruh file (React, Tailwind CSS, Web Audio API, Icon Lucide, dan Data Misi) dikompresi menjadi **satu file HTML tunggal (`dist/index.html`)**.

Format satu file tunggal ini adalah format resmi yang paling kompatibel dan stabil untuk dideploy sebagai **Web App** di **Google Apps Script**.

---

## Langkah 1: Buat Build File Tunggal

Jalankan perintah build di terminal / konsol project:

```bash
npm run build
```

Setelah selesai, file bernama `index.html` akan terbentuk di dalam folder `dist/` (ukuran ~730 KB, sudah mencakup seluruh JavaScript dan CSS secara *inlined*).

---

## Langkah 2: Buat Project di Google Apps Script

1. Buka browser dan kunjungi: **[https://script.google.com](https://script.google.com)**
2. Pastikan login dengan akun Google Anda (misalnya akun guru / sekolah).
3. Klik tombol **"+ Project Baru"** (*New Project*).
4. Beri nama project di pojok kiri atas, contoh: `QUEST Academy Game Edukasi`.

---

## Langkah 3: Masukkan Kode `Code.gs`

Pada file default **`Code.gs`**, hapus seluruh kode yang ada dan ganti dengan kode berikut:

```javascript
/**
 * QUEST Academy - Web App Handler
 * Educational AI Literacy Game - SD Lazuardi Global Competence School
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('QUEST Academy - Game Edukasi Literasi AI & Digital Adab')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL) // Mengizinkan di-embed di Google Sites / Classroom
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}
```

Klik ikon **Simpan** (💾 / *Save project*).

---

## Langkah 4: Buat File `index.html` di Google Apps Script

1. Di panel kiri editor Google Apps Script, klik tombol **"+"** di sebelah tulisan **Files**.
2. Pilih **HTML**.
3. Beri nama file: `index` (Google Apps Script akan otomatis menjadikannya `index.html`).
4. Buka file `dist/index.html` hasil build project ini di komputer Anda dengan text editor (VS Code, Notepad, dll).
5. **Salin seluruh isinya** (Ctrl+A lalu Ctrl+C).
6. Tempel (*paste*) ke dalam file `index.html` di editor Google Apps Script menggantikan seluruh kode bawaannya.
7. Klik ikon **Simpan** (💾).

---

## Langkah 5: Publikasikan sebagai Web App (Deployment)

1. Di pojok kanan atas editor Google Apps Script, klik tombol biru **Deploy** ➔ **New deployment** (Penerapan baru).
2. Di sebelah kiri (ikon roda gigi ⚙️ *Select type*), pilih **Web app**.
3. Isi konfigurasi penerapan:
   - **Description**: `Versi 1.0 - Game Literasi AI Siswa Kelas 5`
   - **Execute as** (Jalankan sebagai): **`Me`** (`email_anda@gmail.com`)
   - **Who has access** (Yang memiliki akses): **`Anyone`** (Siapa saja)  
     *(Penting: Pilih "Anyone" agar siswa dan guru dapat langsung membuka game tanpa kendala izin login rumit).*
4. Klik tombol **Deploy**.
5. Jika diminta verifikasi izin (*Authorize access*), klik akun Google Anda ➔ klik *Advanced* (Lanjutan) ➔ klik *Go to QUEST Academy (unsafe)* ➔ klik *Allow*.
6. Salin **Web App URL** yang diberikan:
   Contoh format:
   `https://script.google.com/macros/s/AKfycbx.../exec`

---

## Langkah 6: Cara Penggunaan oleh Siswa

- **Tautan Langsung**: Bagikan link Web App URL tersebut langsung ke siswa via WhatsApp Web, Google Classroom, atau QR Code di kelas.
- **Sematkan di Google Sites**:
  1. Buka Google Sites sekolah.
  2. Klik menu **Sematkan** (*Embed*) ➔ Pilih tab **Dengan URL** (*By URL*).
  3. Masukkan link Web App URL Google Script Anda.
  4. Game akan langsung tampil dan dapat dimainkan interaktif di dalam halaman Google Sites sekolah!
