import { api } from "./api";

export const login = async (email: string, password: string) => {
  const res = await api.get(`/users?email=${email}&password=${password}`);
  return res.data[0];
};
