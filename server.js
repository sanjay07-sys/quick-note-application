const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "notes.json");

fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "[]");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readNotes() {
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}
function saveNotes(notes) {
  fs.writeFileSync(dataFile, JSON.stringify(notes, null, 2));
}

app.get("/api/notes", (req, res) => res.json(readNotes()));

app.post("/api/notes", (req, res) => {
  const { title, content } = req.body;
  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ error: "Title and content are required." });
  }
  const notes = readNotes();
  const note = {
    id: Date.now().toString(),
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString()
  };
  notes.unshift(note);
  saveNotes(notes);
  res.status(201).json(note);
});

app.put("/api/notes/:id", (req, res) => {
  const notes = readNotes();
  const index = notes.findIndex(n => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Note not found." });

  const { title, content } = req.body;
  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  notes[index] = {
    ...notes[index],
    title: title.trim(),
    content: content.trim(),
    updatedAt: new Date().toISOString()
  };
  saveNotes(notes);
  res.json(notes[index]);
});

app.delete("/api/notes/:id", (req, res) => {
  const notes = readNotes();
  const filtered = notes.filter(n => n.id !== req.params.id);
  if (filtered.length === notes.length) {
    return res.status(404).json({ error: "Note not found." });
  }
  saveNotes(filtered);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Quick Note Application running at http://localhost:${PORT}`);
});