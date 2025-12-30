// SafeAreaView keeps UI away from notch, status bar, and bottom gestures
import { SafeAreaView } from "react-native-safe-area-context";


import {
  View,
  ScrollView,
  Text,
  Switch,
  TextInput,
  Alert,
  Button,
  StyleSheet,
} from "react-native";

// React hooks for state and lifecycle
import { useEffect, useState } from "react";

// AsyncStorage for saving token and offline transactions
import AsyncStorage from "@react-native-async-storage/async-storage";

// Expo Router for navigation
import { useRouter } from "expo-router";

// Used to decode JWT token and get user ID
import { jwtDecode } from "jwt-decode";

// Form component for adding/updating transactions
import TransactionForm from "../../components/TransactionForm";

// Card component to display each transaction
import TransactionCard from "../../components/TransactionCard";

// API functions for backend operations
import {
  fetchTransactions,
  addTransactionAPI,
  updateTransactionAPI,
  deleteTransactionAPI,
} from "../../services/api";

// Context to toggle between API mode and local storage mode
import { useApiToggle } from "../../contexts/ApiToggleContext";

export default function Home() {
  // Router used for redirecting to login on logout
  const router = useRouter();

  // Get API toggle state from context
  const { useAPI, setUseAPI } = useApiToggle();

  // ---------------- STATE VARIABLES ----------------

  // Stores all transactions
  const [transactions, setTransactions] = useState([]);

  // Holds transaction being edited (null = add mode)
  const [editTx, setEditTx] = useState(null);

  // Search text for filtering transactions
  const [search, setSearch] = useState("");

  // Logged-in user ID (decoded from token)
  const [userId, setUserId] = useState(null);

  // ---------------- LOAD USER & TRANSACTIONS ----------------
  useEffect(() => {
    (async () => {
      // Get token from storage
      const token = await AsyncStorage.getItem("token");

      // If token missing → force login
      if (!token) {
        Alert.alert("Please login first");
        router.replace("/login");
        return;
      }

      // Decode token to extract user ID
      const decoded = jwtDecode(token);
      const uid = decoded.id;

      // Save user ID in state
      setUserId(uid);

      try {
        // If API mode ON → fetch from backend
        if (useAPI) {
          const data = await fetchTransactions(uid);
          setTransactions(data || []);
        }
        // If API mode OFF → load from local storage
        else {
          const local = await AsyncStorage.getItem("transactions");
          setTransactions(local ? JSON.parse(local) : []);
        }
      } catch (err) {
        Alert.alert("Failed to load transactions");
      }
    })();
  }, [useAPI]); // Reload when API toggle changes


 
  // ---------------- ADD / UPDATE TRANSACTION ----------------
  const handleAddOrUpdate = async (tx) => {
    if (!userId) return;

    // Attach userId to transaction
    const txWithUser = { ...tx, userId };

    try {
      if (useAPI) {
        // API update or add
        if (editTx) {
          await updateTransactionAPI(editTx._id, txWithUser);
          setEditTx(null);
        } else {
          await addTransactionAPI(txWithUser);
        }

        // Refresh list from backend
        const data = await fetchTransactions(userId);
        setTransactions(data || []);
      } else {
        // Local storage update or add
        const list = editTx
          ? transactions.map((t) => (t === editTx ? txWithUser : t))
          : [...transactions, txWithUser];

        setTransactions(list);
        await AsyncStorage.setItem("transactions", JSON.stringify(list));
        setEditTx(null);
      }
    } catch {
      Alert.alert("Transaction failed");
    }
  };

  // ---------------- DELETE TRANSACTION ----------------
  const handleDelete = async (tx) => {
    if (useAPI) {
      // Delete from backend
      await deleteTransactionAPI(tx._id);
      const data = await fetchTransactions(userId);
      setTransactions(data || []);
    } else {
      // Delete from local storage
      const list = transactions.filter((t) => t !== tx);
      setTransactions(list);
      await AsyncStorage.setItem("transactions", JSON.stringify(list));
    }
  };

  // ---------------- SIGN OUT ----------------
  const handleSignOut = async () => {
    // Remove token and redirect to login
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  // ---------------- SEARCH FILTER ----------------
  // Filters transactions based on category or description
  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.category?.toLowerCase().includes(search.toLowerCase()) ||
      tx.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* 🔹 HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance Tracker</Text>
        <Button title="Sign Out" onPress={handleSignOut} color="#ff3b30" />
      </View>

      {/* 🔹 MAIN CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* API Toggle */}
        <View style={styles.toggleRow}>
          <Text>Use API</Text>
          <Switch value={useAPI} onValueChange={setUseAPI} />
        </View>

        {/* Add / Edit Transaction Form */}
        <TransactionForm
          onSubmit={handleAddOrUpdate}
          initialData={editTx}
        />

        {/* Search Input */}
        <TextInput
          placeholder="Search by category or description"
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />

        {/* Transaction List */}
        {filteredTransactions.map((tx) => (
          <TransactionCard
            key={tx._id}
            transaction={tx}
            onEdit={() => setEditTx(tx)}
            onDelete={() => handleDelete(tx)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },

  content: {
    padding: 12,
    paddingBottom: 40,
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginVertical: 10,
  },
});
