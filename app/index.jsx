
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* App Title */}
      <Text style={styles.title}>Finance Tracker</Text>
      <Text style={styles.subtitle}>
        Manage income & expenses smartly
      </Text>

      {/* Card */}
      <View style={styles.card}>

        <TouchableOpacity
          style={[styles.button, styles.signupBtn]}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={[styles.button, styles.loginBtn]}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>


        {/* Footer */}
        <Text style={styles.footerText}>
           • Simple • Secure • Smart
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ccdaf7ff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 40,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 20,
    color: "#000000ff",
    marginBottom: 30,
    textAlign: "center",
  },

  card: {
    width: "100%",
    backgroundColor: "#d1d9f3ff",
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",

    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },

  button: {
    height: 42,
    width: "100%",
    maxWidth: 220,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },

  loginBtn: {
    backgroundColor: "#007AFF",
  },

  signupBtn: {
    backgroundColor: "#34C759",
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  footerText: {
    marginTop: 25,
    fontSize: 18,
    color: "#000000ff",
    textAlign: "center",
  },
});
