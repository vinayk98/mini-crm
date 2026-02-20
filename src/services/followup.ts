import { api } from "./api";

export const getFollowUps = async (leadId: number | string) => {
  const res = await api.get(`/followups?leadId=${leadId}`);
  return res.data;
};

export const createFollowUp = async (data: unknown) => {
  const res = await api.post("/followups", data);
  return res.data;
};
