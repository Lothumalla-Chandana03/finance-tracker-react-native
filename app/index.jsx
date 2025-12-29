// Basic UI components from React Native
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// Used to navigate between screens (Signup / Login)
import { useRouter } from "expo-router";

export default function Index() {
  // Router helps us move to different pages
  const router = useRouter();

  return (
    // Main container that centers everything on the screen
    <View style={styles.container}>

      {/* App main title */}
      <Text style={styles.title}>Finance Tracker</Text>

      {/* Small description below the title */}
      <Text style={styles.subtitle}>
        Manage income & expenses smartly
      </Text>

      {/* Card-like box that holds buttons */}
      <View style={styles.card}>

        {/* Signup button */}
        <TouchableOpacity
          style={[styles.button, styles.signupBtn]}
          // Navigate to signup screen when pressed
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>

        {/* Login button */}
        <TouchableOpacity
          style={[styles.button, styles.loginBtn]}
          // Navigate to login screen when pressed
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Footer text for branding */}
        <Text style={styles.footerText}>
          • Simple • Secure • Smart
        </Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Full-screen container with centered content
  container: {
    flex: 1,
    backgroundColor: "#ccdaf7ff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  // Main app heading style
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 6,
  },

  // Subtitle below the title
  subtitle: {
    fontSize: 20,
    color: "#000000ff",
    marginBottom: 30,
    textAlign: "center",
  },

  // Card container for buttons
  card: {
    width: "100%",
    backgroundColor: "#d1d9f3ff",
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",

    // Shadow for card effect (iOS + Android)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },

  // Common button style
  button: {
    height: 42,
    width: "100%",
    maxWidth: 220,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },

  // Login button color
  loginBtn: {
    backgroundColor: "#007AFF",
  },

  // Signup button color
  signupBtn: {
    backgroundColor: "#34C759",
  },

  // Text inside buttons
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  // Footer branding text
  footerText: {
    marginTop: 25,
    fontSize: 18,
    color: "#000000ff",
    textAlign: "center",
  },
});
