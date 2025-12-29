import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// create an axios instance with the backend base URL and JSON headers
const api = axios.create({
  baseURL: "https://finance-tracker-backend-ng8p.onrender.com",
  headers: { "Content-Type": "application/json" },
});

// attach token automatically to all requests if token exists in AsyncStorage
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// fetch all transactions from backend
export const fetchTransactions = async () => {
  const res = await api.get("/api/transactions/all");
  return res.data.transactions;
};

// add a new transaction to backend
export const addTransactionAPI = async (tx) => {
  const res = await api.post("/api/transactions/add", tx);
  return res.data;
};

// update an existing transaction by id
export const updateTransactionAPI = async (id, tx) => {
  const res = await api.put(`/api/transactions/update/${id}`, tx);
  return res.data.transaction;
};

// delete a transaction by id
export const deleteTransactionAPI = async (id) => {
  const res = await api.delete(`/api/transactions/delete/${id}`);
  return res.data;
};
