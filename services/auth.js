import api from "./api"; // import the Axios instance configured with base URL and token
import AsyncStorage from "@react-native-async-storage/async-storage";

// Signup a new user by sending name, email, and password to backend
export const signupUser = async (name, email, password) => {
  const res = await api.post("/api/auth/signup", { name, email, password });
  return res.data; // return the response data from backend
};

// Login an existing user by sending email and password
export const loginUser = async (email, password) => {
  const res = await api.post("/api/auth/login", { email, password });
  const token = res.data.token; // get the token from response
  if (token) await AsyncStorage.setItem("token", token); // store token locally for future requests
  return res.data; // return the response data including token
};

// Logout the user by removing the stored token
export const logoutUser = async () => {
  await AsyncStorage.removeItem("token"); // remove token to sign out
};
