const BASE_URL = "https://api-todo-list-pbw.vercel.app/auth";
const handleLogin = document.getElementById("login");
const handleRegister = document.getElementById("register");

if (handleRegister) {
  handleRegister.addEventListener("submit", async (e) => {
    e.preventDefault();

    const registerData = new FormData(register);
    const data = Object.fromEntries(registerData);

    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.ok) {
        alert(result.message || "Register failed");
        return;
      } else {
        alert("Register successful");
        console.log(result);
        window.location.href = "login.html";
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  });
}

if (handleLogin) {
  handleLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const loginData = new FormData(handleLogin);
    const data = Object.fromEntries(loginData);

    console.log("Data yang dikirim:", data); // cek input user

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Response object:", response);

      const result = await response.json();

      console.log("Result dari API:", result); // tampilkan hasil respon API

      if (!result.status) {
        alert(result.message || "Login failed");
        return;
      }

      // Simpan token dan ID user
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("userId", result.data._id);

      alert("Login successful!");
      console.log("Redirecting...");
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("Error caught:", err);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  });
}
