/* ============================================================
   TaskFlow — app.js
   API Base URL — change this to your FastAPI server
   ============================================================ */

const API_BASE = "http://localhost:8000";  // ← update as needed

/* ---------------------------------------------------------------
   User detection (from OS username, browser env, or prompt)
--------------------------------------------------------------- */
function initUser() {
  let name = localStorage.getItem("tf_username");
  if (!name) {
    name = prompt("Welcome to TaskFlow! Enter your name:", "Robin") || "User";
    localStorage.setItem("tf_username", name.trim());
  }
  const displayName = name.trim();
  document.getElementById("userName").textContent = displayName;
  document.getElementById("userAvatar").textContent = displayName.charAt(0).toUpperCase();
}

/* ---------------------------------------------------------------
   Toast
--------------------------------------------------------------- */
function showToast(msg, type = "success") {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = `toast ${type} show`;
  setTimeout(() => { el.className = "toast"; }, 3000);
}

/* ---------------------------------------------------------------
   Form message
--------------------------------------------------------------- */
function setMsg(elId, msg, type) {
  const el = document.getElementById(elId);
  el.textContent = msg;
  el.className = `form-msg ${type}`;
  if (msg) setTimeout(() => { el.className = "form-msg"; }, 4000);
}

/* ---------------------------------------------------------------
   State
--------------------------------------------------------------- */
let tasks = [];
let currentFilter = "all";
let editingTaskName = null;   // identify by name (unique key)

/* ---------------------------------------------------------------
   Stats
--------------------------------------------------------------- */
function updateStats() {
  const done    = tasks.filter(t => t.status === 1).length;
  const pending = tasks.filter(t => t.status === 0).length;
  document.getElementById("statDone").textContent    = `${done} done`;
  document.getElementById("statPending").textContent = `${pending} pending`;
}

/* ---------------------------------------------------------------
   Render Task List
--------------------------------------------------------------- */
function renderTasks(list) {
  const container   = document.getElementById("taskList");
  const emptyState  = document.getElementById("emptyState");
  const search      = document.getElementById("searchInput").value.toLowerCase().trim();

  let filtered = list;

  // Apply filter tab
  if (currentFilter === "pending") filtered = filtered.filter(t => t.status === 0);
  if (currentFilter === "done")    filtered = filtered.filter(t => t.status === 1);

  // Apply search
  if (search) {
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(search) ||
      t.description.toLowerCase().includes(search) ||
      t.type.toLowerCase().includes(search)
    );
  }

  // Remove old cards (keep emptyState)
  [...container.querySelectorAll(".task-card")].forEach(c => c.remove());

  if (filtered.length === 0) {
    emptyState.style.display = "flex";
    return;
  }

  emptyState.style.display = "none";

  filtered.forEach(task => {
    const card = buildCard(task);
    container.appendChild(card);
  });
}

function typeEmoji(type) {
  const map = {
    feature: "🚀", bug: "🐛", research: "🔍",
    review: "👁", meeting: "📅", deployment: "⚙️", other: "📌"
  };
  return map[type] || "📌";
}

function buildCard(task) {
  const isDone = task.status === 1;
  const card = document.createElement("div");
  card.className = `task-card ${isDone ? "done" : ""}`;
  card.dataset.name = task.name;

  card.innerHTML = `
    <div class="task-check" title="Toggle done" data-action="toggle">
      ${isDone ? "✓" : ""}
    </div>
    <div class="task-body">
      <div class="task-name" title="${escHtml(task.name)}">${escHtml(task.name)}</div>
      <div class="task-desc">${escHtml(task.description)}</div>
      <div class="task-meta">
        <span class="task-badge">${typeEmoji(task.type)} ${escHtml(task.type)}</span>
        <span class="task-status ${isDone ? "done" : "pending"}">${isDone ? "Done" : "Pending"}</span>
      </div>
    </div>
    <div class="task-actions">
      <button class="action-btn edit"   title="Edit"   data-action="edit">✎</button>
      <button class="action-btn delete" title="Delete" data-action="delete">✕</button>
    </div>
  `;

  // Event delegation on the card
  card.addEventListener("click", e => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === "toggle") toggleDone(task.name);
    if (action === "edit")   openEdit(task.name);
    if (action === "delete") deleteTask(task.name);
  });

  return card;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ---------------------------------------------------------------
   API — Fetch Tasks (GET /task_list)
--------------------------------------------------------------- */
async function fetchTasks() {
  try {
    const res = await fetch(`${API_BASE}/task_list`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // FastAPI returns array directly
    tasks = data.tasks // support both { tasks: [...] } and [...] formats
    console.log("Normalized tasks:", tasks);
    tasks = Array.isArray(data) ? data : (data.tasks || []);
    updateStats();
    renderTasks(tasks);     
  } catch (err) {
    console.error("Fetch tasks error:", err);
    showToast("Could not load tasks — check API connection", "error");
  }
}

/* ---------------------------------------------------------------
   API — Create Task (POST /tasks)
--------------------------------------------------------------- */
async function fetchTasks() {
  try {
    const res = await fetch(`${API_BASE}/task_list`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // Handles { status, tasks: [...] } shape from your FastAPI endpoint
    tasks = Array.isArray(data) ? data : (data.tasks || []);
    updateStats();
    renderTasks(tasks);
  } catch (err) {
    console.error("Fetch tasks error:", err);
    showToast("Could not load tasks — check API connection", "error");
  }
}

/* ---------------------------------------------------------------
   API — Update Task (PUT /tasks/{name})
   ↑ Implement this endpoint in FastAPI: PUT /tasks/{name}
--------------------------------------------------------------- */
async function updateTask(originalName, payload) {
  const res = await fetch(`${API_BASE}/tasks/${encodeURIComponent(originalName)}`, {
    method:  "PUT",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

/* ---------------------------------------------------------------
   API — Delete Task (DELETE /tasks/{name})
   ↑ Implement this endpoint in FastAPI: DELETE /tasks/{name}
--------------------------------------------------------------- */
async function deleteTaskApi(name) {
  const res = await fetch(`${API_BASE}/tasks/${encodeURIComponent(name)}`, {
    method: "DELETE"
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

/* ---------------------------------------------------------------
   API — Toggle Status (PATCH /tasks/{name}/status)
   ↑ Implement this endpoint in FastAPI: PATCH /tasks/{name}/status
   Body: { "status": 0 or 1 }
--------------------------------------------------------------- */
async function patchTaskStatus(name, status) {
  const res = await fetch(`${API_BASE}/tasks/${encodeURIComponent(name)}/status`, {
    method:  "PATCH",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ status })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

/* ---------------------------------------------------------------
   Form Submit — Add Task
--------------------------------------------------------------- */
document.getElementById("taskForm").addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("taskName").value.trim();
  const desc = document.getElementById("taskDesc").value.trim();
  const type = document.getElementById("taskType").value;

  if (!name || !desc || !type) {
    setMsg("formMsg", "All fields are required.", "error");
    return;
  }

  const btn = document.getElementById("submitBtn");
  btn.disabled = true;
  btn.querySelector(".btn-text").textContent = "Adding…";

  try {
    await createTask({ name, description: desc, type, status: 0 });
    setMsg("formMsg", "Task added!", "success");
    showToast(`"${name}" added ✓`, "success");
    document.getElementById("taskForm").reset();
    await fetchTasks();
  } catch (err) {
    setMsg("formMsg", err.message || "Failed to add task.", "error");
    showToast("Failed to add task", "error");
  } finally {
    btn.disabled = false;
    btn.querySelector(".btn-text").textContent = "Add Task";
  }
});

/* Clear form */
document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("taskForm").reset();
  setMsg("formMsg", "", "");
});

/* ---------------------------------------------------------------
   Toggle Done
--------------------------------------------------------------- */
async function toggleDone(name) {
  const task = tasks.find(t => t.name === name);
  if (!task) return;
  const newStatus = task.status === 1 ? 0 : 1;
  try {
    await patchTaskStatus(name, newStatus);
    showToast(newStatus === 1 ? `"${name}" marked done ✓` : `"${name}" marked pending`, "success");
    await fetchTasks();
  } catch (err) {
    showToast("Could not update status", "error");
  }
}

/* ---------------------------------------------------------------
   Delete Task
--------------------------------------------------------------- */
async function deleteTask(name) {
  if (!confirm(`Delete "${name}"?`)) return;
  try {
    await deleteTaskApi(name);
    showToast(`"${name}" deleted`, "success");
    await fetchTasks();
  } catch (err) {
    showToast("Could not delete task", "error");
  }
}

/* ---------------------------------------------------------------
   Edit Modal
--------------------------------------------------------------- */
const modalOverlay = document.getElementById("modalOverlay");

function openEdit(name) {
  const task = tasks.find(t => t.name === name);
  if (!task) return;
  editingTaskName = name;

  document.getElementById("editName").value = task.name;
  document.getElementById("editDesc").value = task.description;
  document.getElementById("editType").value = task.type;
  setMsg("modalMsg", "", "");

  modalOverlay.classList.add("open");
}

function closeModal() {
  modalOverlay.classList.remove("open");
  editingTaskName = null;
}

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalCancelBtn").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) closeModal();
});

document.getElementById("modalSaveBtn").addEventListener("click", async () => {
  const name = document.getElementById("editName").value.trim();
  const desc = document.getElementById("editDesc").value.trim();
  const type = document.getElementById("editType").value;

  if (!name || !desc || !type) {
    setMsg("modalMsg", "All fields are required.", "error");
    return;
  }

  const btn = document.getElementById("modalSaveBtn");
  btn.disabled = true;
  btn.textContent = "Saving…";

  try {
    await updateTask(editingTaskName, { name, description: desc, type });
    showToast("Task updated ✓", "success");
    closeModal();
    await fetchTasks();
  } catch (err) {
    setMsg("modalMsg", err.message || "Failed to update.", "error");
    showToast("Update failed", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Save Changes →";
  }
});

/* ---------------------------------------------------------------
   Filter tabs
--------------------------------------------------------------- */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentFilter = tab.dataset.filter;
    renderTasks(tasks);
  });
});

/* ---------------------------------------------------------------
   Search
--------------------------------------------------------------- */
document.getElementById("searchInput").addEventListener("input", () => {
  renderTasks(tasks);
});

/* ---------------------------------------------------------------
   Init
--------------------------------------------------------------- */
initUser();
fetchTasks();

// Auto-refresh every 30 seconds
// setInterval(fetchTasks, 30000);