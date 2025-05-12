const API_URL = "https://script.google.com/macros/s/AKfycbwa478EasSaGpOOrUMNP1j9Xd-TFJkZ7bigKr0MyDWf1Sr2WQ1nVlaV-0KwPnlE83pw/exec";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;
  const errorDiv = document.getElementById("loginError");

  errorDiv.textContent = "";

  try {
    const res = await fetch(`${API_URL}?action=login&username=${username}&password=${password}&role=${role}`);
    const data = await res.json();

    if (data.success) {
      sessionStorage.setItem("user", JSON.stringify(data.data));
      if (role === "admin") {
        window.location.href = "dashboard_admin.html";
      } else {
        window.location.href = "dashboard_nasabah.html";
      }
    } else {
      errorDiv.textContent = data.error || "Login gagal.";
    }
  } catch (err) {
    errorDiv.textContent = "Terjadi kesalahan jaringan.";
    console.error(err);
  }
});
