// login.js
function login(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const params = new URLSearchParams({
    action: 'login',
    username,
    password,
    role,
  });

  fetch(`https://script.google.com/macros/s/AKfycby5JQZag5S6T92L2c8MBZvn08zxGt-o7pqr2EZB4cyg-BjbYVrKGFkkB5UmMetsYkIC/exec?${params.toString()}`)
    .then((res) => {
      if (!res.ok) throw new Error('HTTP error ' + res.status);
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.data));
        window.location.href = role === 'admin' ? 'admin.html' : 'nasabah.html';
      } else {
        document.getElementById("error-msg").innerText = data.error;
      }
    })
    .catch((err) => {
      document.getElementById("error-msg").innerText = "Kesalahan jaringan.";
      console.error("Login error:", err);
    });
}
