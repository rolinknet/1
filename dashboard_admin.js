const API_URL = "https://script.google.com/macros/s/AKfycbwa478EasSaGpOOrUMNP1j9Xd-TFJkZ7bigKr0MyDWf1Sr2WQ1nVlaV-0KwPnlE83pw/exec";

// Form Tambah Nasabah
const formTambahNasabah = document.getElementById('formTambahNasabah');
const tambahNasabahAlert = document.getElementById('tambahNasabahAlert');
const tabelNasabahBody = document.getElementById('nasabahBody');

// Form Tambah Transaksi
const formTambahTransaksi = document.getElementById('formTambahTransaksi');
const transaksiAlert = document.getElementById('transaksiAlert');

// Logout Button
const logoutBtn = document.getElementById('logoutBtn');

// Tambah Nasabah
if (formTambahNasabah) {
  formTambahNasabah.addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah form submit yang default

    // Reset alert
    tambahNasabahAlert.classList.add('d-none');
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

      const result = await response.json();

      // Debugging: Cek hasil dari server
      console.log('Result from server:', result);

      // Cek jika berhasil
      if (result.success) {
        alert('Nasabah berhasil ditambahkan!');
        formTambahNasabah.reset(); // Reset form setelah berhasil
        loadNasabahData(); // Reload daftar nasabah
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

// Load Data Nasabah
async function loadNasabahData() {
  try {
    const response = await fetch(API_URL + '?action=getAllUsers');
    const result = await response.json();

    if (result.success) {
      tabelNasabahBody.innerHTML = '';
      result.users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${user.fullName}</td>
          <td>${user.username}</td>
          <td>${user.role}</td>
          <td>${user.rekening}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editNasabah('${user.username}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="hapusNasabah('${user.username}')">Hapus</button>
          </td>
        `;
        tabelNasabahBody.appendChild(tr);
      });
    } else {
      console.error('Gagal memuat data nasabah');
    }
  } catch (err) {
    console.error('Error fetching nasabah data:', err);
  }
}

// Edit Nasabah
function editNasabah(username) {
  alert(`Fitur edit untuk ${username} akan datang`);
}

// Hapus Nasabah
async function hapusNasabah(username) {
  const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus nasabah ${username}?`);
  if (confirmDelete) {
    try {
      const response = await fetch(API_URL + '?action=deleteUser', {
        method: 'POST',
        body: JSON.stringify({ username }),
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();

      if (result.success) {
        alert('Nasabah berhasil dihapus!');
        loadNasabahData(); // Reload daftar nasabah
      } else {
        alert('Gagal menghapus nasabah.');
      }
    } catch (err) {
      console.error('Error during delete:', err);
      alert('Terjadi kesalahan saat menghapus nasabah.');
    }
  }
}

// Tambah Transaksi
if (formTambahTransaksi) {
  formTambahTransaksi.addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah form submit yang default

    // Reset alert
    transaksiAlert.classList.add('d-none');
    transaksiAlert.textContent = '';

    // Ambil data dari input form
    const trxUsername = document.getElementById('trxUsername').value.trim();
    const trxJenis = document.getElementById('trxJenis').value.trim();
    const trxJumlah = parseFloat(document.getElementById('trxJumlah').value.trim());

    // Validasi input
    if (!trxUsername || !trxJenis || isNaN(trxJumlah) || trxJumlah <= 0) {
      transaksiAlert.textContent = 'Semua kolom harus diisi dengan benar.';
      transaksiAlert.classList.remove('d-none');
      return;
    }

    try {
      const response = await fetch(API_URL + '?action=addTransaction', {
        method: 'POST',
        body: JSON.stringify({
          username: trxUsername,
          jenis: trxJenis,
          jumlah: trxJumlah
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (result.success) {
        alert('Transaksi berhasil ditambahkan!');
        formTambahTransaksi.reset(); // Reset form setelah berhasil
      } else {
        transaksiAlert.textContent = result.error || 'Gagal menambahkan transaksi.';
        transaksiAlert.classList.remove('d-none');
      }
    } catch (err) {
      console.error('Error during transaction:', err);
      transaksiAlert.textContent = 'Terjadi kesalahan jaringan.';
      transaksiAlert.classList.remove('d-none');
    }
  });
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    sessionStorage.clear(); // Clear session storage
    window.location.href = 'login.html'; // Redirect ke halaman login
  });
}

// Load Data Nasabah saat pertama kali buka dashboard
loadNasabahData();
