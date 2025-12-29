// Basic components from React Native
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";

// React state for handling input and loading
import { useState } from "react";

// Router for navigation between screens
import { useRouter } from "expo-router";

// Function to call backend login API
import { loginUser } from "../services/auth";

export default function Login() {
  const router = useRouter(); // initialize router to navigate

  // State variables for email, password and loading status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Function triggered when user presses login
  const handleLogin = async () => {
    // 🔹 Simple validation
    if (!email || !password) {
      Alert.alert("Please enter email and password");
      return;
    }

    setLoading(true); // show loading state on button

    try {
      // Call login API
      const data = await loginUser(email, password);
      console.log("LOGIN SUCCESS:", data);

      // Navigate to Home screen after login
      router.replace("/(tabs)/home");
    } catch (err) {
      // Show error alert if login fails
      Alert.alert(
        "Login Failed",
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      // Stop loading after API call completes
      setLoading(false);
    }
  };

  return (
    // Main container that centers content
    <View style={styles.container}>
      {/* Screen title */}
      <Text style={styles.title}>Login</Text>

      {/* Email input */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail} // update state on typing
        style={styles.input}
        keyboardType="email-address"
      />

      {/* Password input */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword} // update state on typing
        style={styles.input}
        secureTextEntry // hide password
      />

      {/* Login button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]} // disable style if loading
        onPress={handleLogin} // call login function
        disabled={loading} // disable button when loading
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"} {/* change text if loading */}
        </Text>
      </TouchableOpacity>

      {/* Navigate to Signup screen */}
      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.signupText}>
          Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// 🔹 Styles for the screen
const styles = StyleSheet.create({
  container: {
    flex: 1, // full screen
    backgroundColor: "#d7e3faff",
    justifyContent: "center", // vertically center
    alignItems: "center", // horizontally center
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    padding: 14,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
  },
  button: {
    width: "100%",
    maxWidth: 220,
    height: 45,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#8FBFFF", // lighter color when button disabled
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signupText: {
    marginTop: 20,
    fontSize: 14,
    color: "#000000ff",
    textAlign: "center",
  },
  signupLink: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
