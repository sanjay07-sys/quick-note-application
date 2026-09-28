const composer = document.getElementById("composer");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const notesEl = document.getElementById("notes");
const emptyEl = document.getElementById("empty");
const countEl = document.getElementById("count");
const heading = document.getElementById("formHeading");
const saveBtn = document.getElementById("saveBtn");
let editingId = null;

async function loadNotes() {
  const res = await fetch("/api/notes");
  const notes = await res.json();
  renderNotes(notes);
}

function renderNotes(notes) {
  notesEl.innerHTML = "";
  countEl.textContent = `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;
  emptyEl.style.display = notes.length ? "none" : "block";

  notes.forEach(note => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${escapeHtml(note.title)}</h3>
      <p>${escapeHtml(note.content)}</p>
      <small>${new Date(note.updatedAt || note.createdAt).toLocaleString()}</small>
      <div class="card-actions">
        <button class="secondary" onclick="editNote('${note.id}')">Edit</button>
        <button class="secondary" onclick="deleteNote('${note.id}')">Delete</button>
      </div>`;
    notesEl.appendChild(card);
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}

document.getElementById("newNoteBtn").onclick = () => openComposer();
document.getElementById("cancelBtn").onclick = closeComposer;

function openComposer(note = null) {
  composer.classList.add("open");
  editingId = note?.id || null;
  heading.textContent = note ? "Edit note" : "Create a note";
  saveBtn.textContent = note ? "Update Note" : "Save Note";
  titleInput.value = note?.title || "";
  contentInput.value = note?.content || "";
  titleInput.focus();
}

function closeComposer() {
  composer.classList.remove("open");
  editingId = null;
  titleInput.value = "";
  contentInput.value = "";
}

saveBtn.onclick = async () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (!title || !content) return alert("Please enter both a title and content.");

  const method = editingId ? "PUT" : "POST";
  const url = editingId ? `/api/notes/${editingId}` : "/api/notes";
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  });

  if (!res.ok) {
    const err = await res.json();
    return alert(err.error || "Something went wrong.");
  }

  closeComposer();
  loadNotes();
};

window.editNote = async id => {
  const notes = await fetch("/api/notes").then(r => r.json());
  const note = notes.find(n => n.id === id);
  if (note) openComposer(note);
};

window.deleteNote = async id => {
  if (!confirm("Delete this note?")) return;
  await fetch(`/api/notes/${id}`, { method: "DELETE" });
  loadNotes();
};

loadNotes();