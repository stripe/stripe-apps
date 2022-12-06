import axios from "axios";
import { APIResponse } from "../types";

export async function addNoteAPI({ customerId, message, agentId }: { customerId: string, message: string, agentId: string }) {

  const response = await axios.post("http://localhost:3000/note", { agentId, customerId, message })

  return response.data;
}

export async function getAllNotesAPI(): Promise<APIResponse> {
  const response = await axios.get("http://localhost:3000/notes")
  return response.data;
}

export async function getNotesForCustomerAPI({ customerId }: { customerId: string }): Promise<APIResponse> {
  const response = await axios.get(`http://localhost:3000/notes/${customerId}`)

  return response.data;
}