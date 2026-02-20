import { api } from "./api";

export const getNotes = async (leadId: number | string) => {
  const res = await api.get(`/notes?leadId=${leadId}`);
  return res.data;
};

export const createNote = async (data: unknown) => {
  const res = await api.post("/notes", data);
  return res.data;
};
