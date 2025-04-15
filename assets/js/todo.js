// assets/js/todos.js
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

// ✅ Auth guard
if (!token || !userId) {
  alert("Silakan login terlebih dahulu.");
  window.location.href = "login.html";
}

// DOM element
const todoContainer = document.getElementById("todo-container");
const addTodoForm = document.getElementById("add-todo-form");
const todoInput = document.getElementById("todo-input");
const logoutBtn = document.getElementById("logout-btn");

// ✅ GET All Todos
async function loadTodos() {
  try {
    const response = await fetch("https://api-todo-list-pbw.vercel.app/todo/getAllTodos", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!result.status) {
      alert(result.message || "Gagal mengambil data");
      return;
    }

    renderTodos(result.data);
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Error mengambil data todos.");
  }
}

// ✅ Render todos ke HTML
function renderTodos(todos) {
  todoContainer.innerHTML = "";
  todos.forEach((todo) => {
    const div = document.createElement("div");
    div.className = "todo-item";

    div.innerHTML = `
      <input type="text" value="${todo.text}" id="todo-${todo._id}" />
      <button onclick="editTodo('${todo._id}')">Edit</button>
      <button onclick="deleteTodo('${todo._id}')">Delete</button>
    `;

    todoContainer.appendChild(div);
  });
}

// ✅ Add Todo
addTodoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newTodo = todoInput.value.trim();

  if (newTodo === "") return;

  try {
    const response = await fetch("https://api-todo-list-pbw.vercel.app/todo/createTodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newTodo }),
    });

    const result = await response.json();

    if (result.status) {
      todoInput.value = "";
      loadTodos(); // reload todo
    } else {
      alert(result.message || "Gagal menambah todo");
    }
  } catch (error) {
    console.error("Add error:", error);
  }
});

// ✅ Edit Todo
window.editTodo = async function (todoId) {
  const newText = document.getElementById(`todo-${todoId}`).value;

  try {
    const response = await fetch(`https://api-todo-list-pbw.vercel.app/todo/updateTodo/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newText }),
    });

    const result = await response.json();
    if (result.status) {
      alert("Todo berhasil diedit!");
      loadTodos();
    } else {
      alert(result.message || "Gagal edit todo");
    }
  } catch (error) {
    console.error("Edit error:", error);
  }
};

// ✅ Delete Todo
window.deleteTodo = async function (todoId) {
  if (!confirm("Yakin ingin menghapus todo ini?")) return;

  try {
    const response = await fetch(`https://api-todo-list-pbw.vercel.app/todo/deleteTodo/${todoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (result.status) {
      loadTodos();
    } else {
      alert(result.message || "Gagal menghapus todo");
    }
  } catch (error) {
    console.error("Delete error:", error);
  }
};

// ✅ Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "login.html";
});

// ✅ Load semua todos saat halaman dibuka
loadTodos();
