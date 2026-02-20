import { api } from "./api";

export const getNotes = async (leadId: string) => {
  const cleanLeadId = leadId.trim();

  const res = await api.get("/notes", {
    params: { leadId: cleanLeadId },
  });

  return res.data;
};
export const createNote = async (data: unknown) => {
  const res = await api.post("/notes", data);
  return res.data;
};

export const getAllNotes = async () => {
  const res = await api.get("/notes");
  return res.data;
};
