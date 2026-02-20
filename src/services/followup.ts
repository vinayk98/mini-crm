import { api } from "./api";

export const getFollowUps = async (leadId: number | string) => {
  const res = await api.get(`/followups`, { params: { leadId } });
  return res.data;
};

export const createFollowUp = async (data: unknown) => {
  const res = await api.post("/followups", data);
  return res.data;
};

export const getAllFollowUps = async () => {
  const res = await api.get(`/followups`);
  return res.data;
};
 
