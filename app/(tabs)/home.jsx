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
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import TransactionForm from "../../components/TransactionForm";
import TransactionCard from "../../components/TransactionCard";

import {
  fetchTransactions,
  addTransactionAPI,
  updateTransactionAPI,
  deleteTransactionAPI,
} from "../../services/api";
import { useApiToggle } from "../../contexts/ApiToggleContext";

export default function Home() {
  const { useAPI, setUseAPI } = useApiToggle();
  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [editTx, setEditTx] = useState(null);
  const [search, setSearch] = useState("");

  // ---------------- Load Transactions ----------------
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Please login first");
        router.replace("/login");
        return;
      }

      try {
        if (useAPI) await fetchFromAPI();
        else await loadLocalTransactions();
      } catch (err) {
        console.log("TRANSACTION LOAD ERROR:", err);
        Alert.alert("Failed to load transactions");
      }
    })();
  }, [useAPI]);

  const loadLocalTransactions = async () => {
    const data = await AsyncStorage.getItem("transactions");
    setTransactions(data ? JSON.parse(data) : []);
  };

  const saveLocalTransactions = async (list) => {
    setTransactions(list);
    await AsyncStorage.setItem("transactions", JSON.stringify(list));
  };

  const fetchFromAPI = async () => {
    try {
      const data = await fetchTransactions();
      setTransactions(data || []);
    } catch (err) {
      console.log("Fetch error:", err.message);
      Alert.alert("Failed to fetch transactions");
    }
  };

  // ---------------- Add / Update ----------------
  const handleAddOrUpdate = async (tx) => {
    try {
      if (useAPI) {
        if (editTx) {
          await updateTransactionAPI(editTx._id, tx);
          setEditTx(null);
        } else {
          await addTransactionAPI(tx);
        }
        await fetchFromAPI();
      } else {
        let list = [...transactions];
        if (editTx) {
          const index = list.findIndex((t) => t === editTx);
          list[index] = tx;
          setEditTx(null);
        } else {
          list.push(tx);
        }
        saveLocalTransactions(list);
      }
    } catch (err) {
      console.log("Add/Update error:", err.message);
      Alert.alert("Transaction failed");
    }
  };

  // ---------------- Delete ----------------
  const handleDelete = async (tx) => {
    try {
      if (useAPI) {
        await deleteTransactionAPI(tx._id);
        await fetchFromAPI();
      } else {
        const list = transactions.filter((item) => item !== tx);
        saveLocalTransactions(list);
      }
    } catch (err) {
      console.log("Delete error:", err.message);
      Alert.alert("Delete failed");
    }
  };

  // ---------------- Filter ----------------
  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.category?.toLowerCase().includes(search.toLowerCase()) ||
      tx.description?.toLowerCase().includes(search.toLowerCase())
  );

  // ---------------- Sign Out ----------------
  const handleSignOut = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 🔹 FIXED HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance Tracker</Text>
        <Button title="Sign Out" onPress={handleSignOut} color="red" />
      </View>

      {/* 🔹 SCROLLABLE CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* API Toggle */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <Text style={{ marginRight: 10 }}>Use API:</Text>
          <Switch value={useAPI} onValueChange={setUseAPI} />
        </View>

        {/* Form */}
        <TransactionForm onSubmit={handleAddOrUpdate} initialData={editTx} />

        {/* Search */}
        <TextInput
          placeholder="Search by category or description"
          value={search}
          onChangeText={setSearch}
          style={{
            borderWidth: 1,
            padding: 8,
            marginVertical: 10,
            borderRadius: 5,
          }}
        />

        {/* List */}
        {filteredTransactions.map((tx) => (
          <TransactionCard
            key={tx._id}
            transaction={tx}
            onEdit={() => setEditTx(tx)}
            onDelete={() => handleDelete(tx)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    padding: 10,
    paddingTop: 10,
  },
});
