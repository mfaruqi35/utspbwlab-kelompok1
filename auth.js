// Hapus definisi kosong sebelumnya (yang pakai async tapi tanpa isi)

export function registerUser(email, username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
  
    // Cek apakah email sudah terdaftar
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      return { success: false, message: "Email sudah terdaftar!" };
    }
  
    // Simpan user baru
    const newUser = { email, username, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, user: newUser };
  }
  
  export function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
  
    // Cari user dengan email dan password cocok
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      return { success: true, user };
    }
  
    return { success: false, message: "Email atau password salah." };
  }
  
