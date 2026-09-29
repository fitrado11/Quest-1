# Panduan Deploy QUEST Academy ke Google Apps Script (script.google.com)

Game ini sudah dirancang menggunakan `vite-plugin-singlefile`, sehingga seluruh aplikasi (React, Tailwind CSS, Lucide icons, audio synth, dan gambar) secara otomatis dikemas menjadi **1 file HTML tunggal** (`dist/index.html`).

---

## ⚠️ Mengapa Muncul Error "npm : The term 'npm' is not recognized"?

Error tersebut muncul di komputer Anda karena **Node.js belum terpasang (installed)** atau **path environment belum terdaftar** di sistem Windows Anda.

### Solusi 1: Jika Ingin Menjalankan `npm` di Komputer Anda
1. Kunjungi situs resmi: [https://nodejs.org/](https://nodejs.org/)
2. Unduh versi **LTS (Long Term Support)** untuk Windows.
3. Jalankan file `.msi` instalasi hingga selesai (centang opsi *"Automatically install the necessary tools"* bila diminta).
4. **Tutup semua jendela PowerShell / Terminal / VS Code**, lalu buka kembali PowerShell yang baru.
5. Cek dengan mengetik:
   ```powershell
   node -v
   npm -v
   ```
   Jika muncul versi (misalnya `v20.x.x` dan `10.x.x`), maka Anda sudah bisa menjalankan perintah:
   ```powershell
   npm install
   npm run build
   ```

---

## 🚀 Solusi Praktis: Deploy ke Google Apps Script

Anda **tidak wajib** meng-compile ulang di laptop jika sudah memiliki file hasil build `dist/index.html`!

### Langkah 1: Buka Google Apps Script
1. Buka browser dan kunjungi: [https://script.google.com/](https://script.google.com/)
2. Klik tombol **New project** (Proyek baru) di pojok kiri atas.
3. Beri nama proyek, misalnya: `QUEST Academy Game`.

### Langkah 2: Buat File Server Backend (`Code.gs`)
Pada file default `Code.gs`, hapus kodenya dan ganti dengan kode berikut:

```javascript
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('QUEST Academy - Game Edukasi Literasi AI & Digital Adab')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
}
```

### Langkah 3: Buat File Tampilan (`Index.html`)
1. Di panel kiri Google Apps Script, klik tombol **+** di sebelah tulisan *Files* (File).
2. Pilih **HTML**.
3. Beri nama file: `Index` *(Google Script akan otomatis menambahkan ekstensi `.html` sehingga menjadi `Index.html`)*.
4. Hapus seluruh template bawaan Google Script.
5. Buka file `dist/index.html` dari project ini, **Salin (Copy) seluruh isinya**, lalu **Tempel (Paste)** ke dalam file `Index.html` di Google Apps Script.
6. Simpan project dengan menekan ikon Disket (Save) atau `Ctrl + S`.

### Langkah 4: Publikasikan (Deploy) Web App
1. Di pojok kanan atas, klik tombol biru **Deploy** -> pilih **New deployment** (Penerapan baru).
2. Di samping tulisan *Select type* (ikon gerigi), pilih **Web app**.
3. Atur konfigurasi berikut:
   - **Description**: `QUEST Academy v1.0`
   - **Execute as**: `Me (email-anda@gmail.com)`
   - **Who has access**: `Anyone` (Siapa saja, agar siswa/pengguna dapat memainkan tanpa login akun Google admin).
4. Klik tombol **Deploy**.
5. Salin link **Web App URL** yang muncul (format: `https://script.google.com/macros/s/AKfycb.../exec`).
6. Buka link tersebut di tab baru atau bagikan ke siswa! Game akan langsung berjalan secara interaktif dan lancar di browser desktop maupun smartphone.
