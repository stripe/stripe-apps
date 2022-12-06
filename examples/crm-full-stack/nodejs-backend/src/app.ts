import { Prisma } from ".prisma/client";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { createNote, getAllNotes, getNotesByCustomerId } from "./services";

const app = express();

app.use(helmet());
app.use(cors());
cors({ credentials: true, origin: true })

app.use(express.json());

app.post("/note", async (req, res) => {
  const { agentId, customerId, message } = req.body;

  const newNote: Prisma.NoteUncheckedCreateInput = { agentId, customerId, message }

  await createNote(newNote);
  res.json({ error: false, data: {} })
})

app.get("/notes", async (req, res) => {
  const notes = await getAllNotes();
  res.json({ error: false, data: { notes } })
})

app.get("/notes/:customerId", async (req, res) => {
  const customerId = req.params.customerId;

  const notes = await getNotesByCustomerId(customerId);
  res.json({ error: false, data: { notes } })
})

export default app;
