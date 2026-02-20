import type { Lead } from "../types/lead";
import { api } from "./api";

export const getLeads = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  assignedTo?: number;
  search?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("_page", String(params.page));
  if (params?.limit) queryParams.append("_limit", String(params.limit));
  if (params?.status) queryParams.append("status", params.status);
  if (params?.assignedTo)
    queryParams.append("assignedTo", String(params.assignedTo));
  if (params?.search) queryParams.append("q", params.search);

  const res = await api.get(`/leads?${queryParams.toString()}`);
  return res.data;
};

export const getLeadById = async (id: number | string): Promise<Lead> => {
  const res = await api.get(`/leads/${id}`);
  console.log(res, "123123");
  return res.data;
};

export const createLead = async (
  data: Omit<Lead, "id">,
): Promise<Lead> => {
  const res = await api.post("/leads", data);
  return res.data;
};

export const updateLead = async (
  id: number,
  data: Partial<Lead>,
): Promise<Lead> => {
  const res = await api.put(`/leads/${id}`, data);
  return res.data;
};

export const deleteLead = async (id: number): Promise<void> => {
  await api.delete(`/leads/${id}`);
};
