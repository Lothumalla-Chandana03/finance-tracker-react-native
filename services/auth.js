import api from "./api"; // import the Axios instance
import AsyncStorage from "@react-native-async-storage/async-storage";

// Signup
export const signupUser = async (name, email, password) => {
  const res = await api.post("/api/auth/signup", { name, email, password });
  return res.data;
};

// Login
export const loginUser = async (email, password) => {
  const res = await api.post("/api/auth/login", { email, password });
  const token = res.data.token;
  if (token) await AsyncStorage.setItem("token", token); // store token
  return res.data;
};

// Logout
export const logoutUser = async () => {
  await AsyncStorage.removeItem("token");
};
