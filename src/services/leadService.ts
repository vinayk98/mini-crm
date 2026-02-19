import { api } from "./api";

export const getLeads = async () => {
  const res = await api.get("/leads");
  return res.data;
};

export const getLeadById = async (id: number) => {
  const res = await api.get(`/leads/${id}`);
  return res.data;
};

export const createLead = async (data: unknown) => {
  const res = await api.post("/leads", data);
  return res.data;
};

export const updateLead = async (id: number, data: unknown) => {
  const res = await api.put(`/leads/${id}`, data);
  return res.data;
};

export const deleteLead = async (id: number) => {
  await api.delete(`/leads/${id}`);
};
