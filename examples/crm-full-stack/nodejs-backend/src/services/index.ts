import { Prisma } from ".prisma/client";
import { prisma } from "../lib/prisma";

export async function createNote(data: Prisma.NoteUncheckedCreateInput) {
  const { agentId, customerId, message } = data;
  const user = await prisma.note.create({
    data: {
      agentId,
      customerId,
      message
    }
  })

  return user;
}

export async function getAllNotes() {
  const allUsers = await prisma.note.findMany();
  return allUsers;
}

export async function getNotesByCustomerId(customerId: string) {
  const allUsers = await prisma.note.findMany({ where: { customerId } });
  return allUsers;
}