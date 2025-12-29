// Import necessary components from React Native
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

// useState for managing state in the component
import { useState } from "react";

// Router for navigation between screens
import { useRouter } from "expo-router";

// Function to call backend signup API
import { signupUser } from "../services/auth";

export default function Signup() {
  const router = useRouter(); // initialize router to navigate

  // State variables for name, email, password and loading status
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Function triggered when user presses Signup button
  const handleSignup = async () => {
    // 🔹 Simple validation: check if all fields are filled
    if (!name || !email || !password) {
      Alert.alert("Validation Error", "Please fill all fields");
      return;
    }

    setLoading(true); // show loading state on button

    try {
      // Call backend API to create user
      const data = await signupUser(name, email, password);
      console.log("Signup success:", data);

      // Notify user that signup was successful
      Alert.alert("Success", "Signup successful! Please login.");

      // Navigate to login screen after successful signup
      router.replace("/login");
    } catch (err) {
      // Show error alert if signup fails
      console.log("Signup error:", err.response?.data);
      Alert.alert(
        "Signup Failed",
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false); // stop loading after API call completes
    }
  };

  return (
    // Main container that centers everything
    <View style={styles.container}>
      {/* Screen title */}
      <Text style={styles.title}>Signup</Text>

      {/* Name input */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName} // update name state when typing
      />

      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none" // email should not capitalize
        value={email}
        onChangeText={setEmail} // update email state when typing
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry // hide password input
        value={password}
        onChangeText={setPassword} // update password state when typing
      />

      {/* Signup button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]} // disable style if loading
        onPress={handleSignup} // call signup function
        disabled={loading} // disable button when loading
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing up..." : "Signup"} {/* show loading text */}
        </Text>
      </TouchableOpacity>

      {/* Link to navigate to Login screen */}
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.signupText}>
          Already have an account? <Text style={styles.signupLink}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// 🔹 Styles for the screen
const styles = StyleSheet.create({
  container: {
    flex: 1, // full screen
    backgroundColor: "#d8e4fbff",
    justifyContent: "center", // vertically center content
    alignItems: "center", // horizontally center content
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
    backgroundColor: "#34C759",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#A3E2B3", // lighter button when disabled
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
    color: "#34C759",
    fontWeight: "600",
  },
});
