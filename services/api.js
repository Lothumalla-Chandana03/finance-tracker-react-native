import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "https://finance-tracker-backend-ng8p.onrender.com",
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically to all requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// ---------- TRANSACTIONS ----------
export const fetchTransactions = async () => {
  const res = await api.get("/api/transactions/all");
  return res.data.transactions;
};

export const addTransactionAPI = async (tx) => {
  const res = await api.post("/api/transactions/add", tx);
  return res.data;
};

export const updateTransactionAPI = async (id, tx) => {
  const res = await api.put(`/api/transactions/update/${id}`, tx);
  return res.data.transaction;
};

export const deleteTransactionAPI = async (id) => {
  const res = await api.delete(`/api/transactions/delete/${id}`);
  return res.data;
};
