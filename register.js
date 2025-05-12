// Ganti dengan URL web app Google Apps Script Anda
const API_URL = "https://script.google.com/macros/s/AKfycbxQNEzCw2OZsfSMAjLARg1_0tScr7z0efABLDn2R-eyWsT6uu0iK2WvybPpBSLvahOS/exec";

const formTambahNasabah = document.getElementById('formTambahNasabah');
const tambahNasabahAlert = document.getElementById('tambahNasabahAlert');

if (formTambahNasabah) {
  formTambahNasabah.addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah form submit yang default

    tambahNasabahAlert.classList.add('d-none'); // Reset alert
    tambahNasabahAlert.textContent = '';

    // Ambil data dari input form
    const fullName = document.getElementById('newFullName').value.trim();
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value.trim();

    // Validasi input
    if (!fullName || !username || !password) {
      tambahNasabahAlert.textContent = 'Semua kolom harus diisi.';
      tambahNasabahAlert.classList.remove('d-none');
      return;
    }

    try {
      // Kirim data ke API menggunakan POST
      const response = await fetch(API_URL + '?action=register', {
        method: 'POST',
        body: JSON.stringify({
          fullName,
          username,
          password,
          role: 'nasabah'
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json(); // Parse JSON dari server

      // Debugging: Cek hasil dari server
      console.log('Result from server:', result);

      // Cek jika berhasil
      if (result.success) {
        alert('Nasabah berhasil ditambahkan!');
        formTambahNasabah.reset(); // Reset form setelah berhasil
      } else {
        // Jika gagal, tampilkan pesan error
        tambahNasabahAlert.textContent = result.error || 'Gagal menambahkan nasabah.';
        tambahNasabahAlert.classList.remove('d-none');
      }
    } catch (err) {
      // Tangani jika terjadi kesalahan jaringan
      console.error('Error during registration:', err);
      tambahNasabahAlert.textContent = 'Terjadi kesalahan jaringan.';
      tambahNasabahAlert.classList.remove('d-none');
    }
  });
}
