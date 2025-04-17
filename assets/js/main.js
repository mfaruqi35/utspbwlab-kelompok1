// DOM Elements
const todoContainer = document.querySelector(".todo-container");
const inputTodo = document.getElementById("input-todo");
const addTodo = document.getElementById("add-todo");
const addTaskSidebar = document.getElementById("add-task-sidebar");
const addTaskMain = document.getElementById("add-task-main");
const modalBG = document.querySelector(".modal-background");
const editModalBG = document.querySelector(".edit-modal-background");
const closeModalButtons = document.querySelectorAll(".close-modal");
const newTodo = document.getElementById("edit-todo-name");
const editTodoCompleted = document.getElementById("edit-todo-completed");
const saveTodo = document.getElementById("save-todo");
const loadingOverlay = document.getElementById("loading-overlay");
const toggleSidebarBtn = document.getElementById("toggle-sidebar");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("main-content");
const emptyState = document.getElementById("empty-state");
const dropdownToggle = document.querySelector(".dropdown-toggle");
const profileDropdown = document.getElementById("profile-dropdown");
const logoutBtn = document.getElementById("logout-btn");
const userInitial = document.getElementById("user-initial");
const userFirstname = document.getElementById("user-firstname");
// const userFullname = document.getElementById("user-fullname");

const BASE_URL = "https://api-todo-list-pbw.vercel.app/todo";

// Auth data
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const fullName = localStorage.getItem("fullName");

let todoArray = [];
let currentEditTodo = null;

// Auth guard
if (!token || !userId) {
  alert("Silakan login terlebih dahulu.");
  window.location.href = "login.html";
} else {
  // Set user info
  const userName = fullName.split(" ")[0];
  userFirstname.textContent = userName;
  // userFullname.textContent = fullName;
  userInitial.textContent = userName.charAt(0).toUpperCase();
}

// Show loading
function showLoading() {
  loadingOverlay.classList.remove("hidden");
}

// Hide loading
function hideLoading() {
  loadingOverlay.classList.add("hidden");
}

// Toggle empty state
function toggleEmptyState() {
  if (todoArray.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }
}

async function getTodos() {
  showLoading();
  try {
    const response = await fetch(`${BASE_URL}/getAllTodos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    // Cek jika response memiliki properti data yang berisi array
    if (data && Array.isArray(data.data)) {
      return data.data; // Mengembalikan array todos
    }

    // Fallback jika struktur tidak sesuai
    console.error("Unexpected API response structure:", data);
    return []; // Kembalikan array kosong sebagai fallback
  } catch (err) {
    console.error("Error: ", err);
    return []; // Kembalikan array kosong jika error
  } finally {
    hideLoading();
  }
}

function displayTodos(todoArr) {

  todoContainer.innerHTML = "";
  
  // Pastikan parameter adalah array
  if (!Array.isArray(todoArr)) {
    console.error("displayTodos expects an array, got:", todoArr);
    return;
  }

  todoArr.forEach((todoElem) => {
    let todo = document.createElement("div");
    todo.classList.add("todo", "bg-white", "rounded-md", "p-3", "shadow-sm", "hover:shadow-md", "transition", "flex", "items-center");

    // Todo text
    let todoText = document.createElement("span");
    todoText.classList.add("todo-name", "flex-grow");
    todoText.textContent = todoElem.text;

    // Actions container yang muncul saat hover
    let todoActions = document.createElement("div");
    todoActions.classList.add("todo-actions", "flex", "items-center", "space-x-2");

    // Edit button
    let editBtn = document.createElement("button");
    editBtn.classList.add("text-gray-500", "hover:text-[#ff0072]");
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.addEventListener("click", () => {
      openEditModal(todoElem);
    });

    // Delete button
    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("text-gray-500", "hover:text-[#ff0072]");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener("click", () => {
      deleteTodos(todoElem);
    });

    // Append actions
    todoActions.appendChild(editBtn);
    todoActions.appendChild(deleteBtn);

    // Append all elements to todo
    todo.appendChild(todoText);
    todo.appendChild(todoActions);

    // Append todo to container
    todoContainer.appendChild(todo);
  });

  // Toggle empty state based on todos count
  toggleEmptyState();
}

async function addTodos() {
  if (!inputTodo.value.trim()) return;

  showLoading();
  try {
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: inputTodo.value.trim(),
      }),
    };
    const response = await fetch(`${BASE_URL}/createTodo`, options);
    const data = await response.json();

    if (data.status) {
      inputTodo.value = "";
      modalBG.classList.add("hidden");

      // Reload todos and update UI
      todoArray = await getTodos();
      displayTodos(todoArray);
    } else {
      alert(data.message || "Gagal menambahkan todo");
    }
  } catch (error) {
    console.error("Gagal menambahkan todo:", error);
  } finally {
    hideLoading();
  }
}

function openEditModal(todoElem) {
  currentEditTodo = todoElem;
  newTodo.value = todoElem.text;
  editModalBG.classList.remove("hidden");
}

async function editTodos(todoElem) {
  showLoading();
  try {
    let options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: newTodo.value.trim(),
        onCheckList: true,
      }),
    };

    const response = await fetch(
      `${BASE_URL}/updateTodo/${todoElem._id}`,
      options
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Raw API Error Response:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        alert(`Error: ${errorData.message || response.statusText}`);
      } catch (e) {
        alert(`Error: ${response.status} ${response.statusText}`);
      }
      return null;
    }

    const data = await response.json();

    if (data.status) {
      editModalBG.classList.add("hidden");

      // Reload todos
      todoArray = await getTodos();
      displayTodos(todoArray);
    } else {
      alert(data.message || "Gagal mengubah todo");
    }
  } catch (error) {
    console.error("Gagal mengubah todo:", error);
  } finally {
    hideLoading();
  }
}

async function deleteTodos(todoElem) {
  showLoading();
  try {
    const response = await fetch(`${BASE_URL}/deleteTodo/${todoElem._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    
    if (data.status) {
      // Reload todos
      todoArray = await getTodos();
      displayTodos(todoArray);
    } else {
      alert(data.message || "Gagal Menghapus todo");
    }
  } catch (err) {
    console.error("Error deleting todo:", err);
  } finally {
    hideLoading();
  }
}

// Function to handle logout
function handleLogout() {
  // Clear local storage
  localStorage.removeItem("fullName");
  localStorage.removeItem("token");
  localStorage.removeItem("userId");

  // Redirect to login page
  window.location.href = "login.html";
}

// Open modal
addTaskSidebar.addEventListener("click", () => modalBG.classList.remove("hidden"));
addTaskMain.addEventListener("click", () => modalBG.classList.remove("hidden"));

// Close modals
closeModalButtons.forEach(button => {
  button.addEventListener("click", () => {
    modalBG.classList.add("hidden");
    editModalBG.classList.add("hidden");
  });
});

// Add todo
addTodo.addEventListener("click", addTodos);
inputTodo.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodos();
  }
});

// Save edit
saveTodo.addEventListener("click", (e) => {
  e.preventDefault();
  if (currentEditTodo) {
    editTodos(currentEditTodo);
  }
});

// Profile dropdown
dropdownToggle.addEventListener("click", () => {
  profileDropdown.classList.toggle("hidden");
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown-toggle") && !profileDropdown.classList.contains("hidden")) {
    profileDropdown.classList.add("hidden");
  }
});

// Logout
logoutBtn.addEventListener("click", handleLogout);

// Load todos on page load
getTodos()
  .then((todoArr) => {
    todoArray = todoArr;
    displayTodos(todoArray);
  })
  .catch((err) => console.log(err));

// Check auth when page visibility changes
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (!token || !userId) {
      window.location.href = "login.html";
    }
  }
});