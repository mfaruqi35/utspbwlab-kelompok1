const BASE_URL = "https://api-todo-list-pbw.vercel.app/auth";
const handleLogin = document.getElementById("login");
const handleRegister = document.getElementById("register");

function showPopup(message, isSuccess) {
  // Create popup elements
  const popupContainer = document.createElement("div");
  popupContainer.className = `fixed top-5 right-5 p-4 rounded-lg shadow-lg ${
    isSuccess ? "bg-green-100" : "bg-red-100"
  } transition-opacity duration-300 flex items-center`;

  const iconContainer = document.createElement("div");
  iconContainer.className = `mr-3 ${
    isSuccess ? "text-green-500" : "text-red-500"
  }`;

  // Add icon based on success/error
  iconContainer.innerHTML = isSuccess
    ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';

  const messageContainer = document.createElement("div");
  messageContainer.className = `text-sm ${
    isSuccess ? "text-green-800" : "text-red-800"
  } font-medium`;
  messageContainer.textContent = message;

  // Assemble popup
  popupContainer.appendChild(iconContainer);
  popupContainer.appendChild(messageContainer);
  document.body.appendChild(popupContainer);

  // Remove popup after 3 seconds
  setTimeout(() => {
    popupContainer.classList.add("opacity-0");
    setTimeout(() => {
      document.body.removeChild(popupContainer);
    }, 300);
  }, 3000);
}

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

      if (!result.status) {
        showPopup(result.message || "Register failed", false);
        return;
      } else {
        showPopup(
          "Registration successful! Redirecting to login page...",
          true
        );
        console.log(result);
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      }
    } catch (err) {
      console.log("Error: ", err);
      showPopup("Something gone wrong. Please try again.", false);
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
        showPopup(result.message || "Login failed", false);
        return;
      }

      // Simpan token dan ID user
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("userId", result.data._id);
      localStorage.setItem("fullName", result.data.fullName);

      showPopup(`Welcome back, ${result.data.fullName}! Redirecting to dashboard...`, true);
      console.log("Redirecting...");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } catch (err) {
      console.error("Error caught:", err);
      showPopup("Something gone wrong, please try again.", false);
    }
  });
}
