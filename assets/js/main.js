// assets/js/main.js
const navbarPlaceholder = document.getElementById("navbar-placeholder");

// pilih navbar mana yang mau ditampilkan
const navbarPath = window.location.pathname.includes("dashboard")
  ? "./components/navbar-dashboard.html"
  : "./components/navbar-landing.html";

fetch(navbarPath)
  .then((res) => res.text())
  .then((html) => {
    navbarPlaceholder.innerHTML = html;
  })
  .catch((err) => {
    console.error("Gagal load navbar:", err);
  });
