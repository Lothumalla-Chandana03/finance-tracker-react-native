import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  ScrollView,
  Text,
  Switch,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from "react-native";

import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import TransactionForm from "../../components/TransactionForm";
import TransactionCard from "../../components/TransactionCard";
import { useApiToggle } from "../../contexts/ApiToggleContext";
import {
  fetchTransactions,
  addTransactionAPI,
  updateTransactionAPI,
  deleteTransactionAPI,
} from "../../services/api";

// Register push notifications and get Expo push token


/*async function registerForPushNotificationsAsync() {
  if (Platform.OS === "web") return;
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Notification permission not granted");
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("PUSH TOKEN:", token);

  // Android channel setup
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}
*/

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "web") return;

  let { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("Notification permission not granted");
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("PUSH TOKEN:", token);

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}

export default function Home() {
  const router = useRouter();
  const { useAPI, setUseAPI } = useApiToggle();

  // ---------------- STATE ----------------
  const [transactions, setTransactions] = useState([]);
  const [editTx, setEditTx] = useState(null);
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState(null);

  // ---------------- LOAD USER & TRANSACTIONS ----------------
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Please login first");
        router.replace("/login");
        return;
      }

      // Decode JWT to get user ID
      const decoded = jwtDecode(token);
      const uid = decoded.id;
      setUserId(uid);

      try {
        if (useAPI) {
          const data = await fetchTransactions(uid);
          setTransactions(data || []);
        } else {
          const local = await AsyncStorage.getItem("transactions");
          setTransactions(local ? JSON.parse(local) : []);
        }
      } catch (err) {
        Alert.alert("Failed to load transactions");
      }
    })();
  }, [useAPI]);

  // ---------------- PUSH NOTIFICATIONS ----------------
 
    const scheduleNotification = async () => {
      await registerForPushNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: { title: "Finance Tracker", body: "This is your test notification" },
        trigger: { seconds: 5 },
      });
    };

      // ---------------- PUSH NOTIFICATIONS ----------------
  
    const scheduleNotification = async () => {
      await registerForPushNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: { title: "Finance Tracker", body: "This is your test notification" },
        trigger: { seconds: 5 },
      });
    };
      



    useEffect(() => {
      scheduleNotification();
    }, []);
  
  

  // ---------------- ADD / UPDATE TRANSACTION ----------------
  const handleAddOrUpdate = async (tx) => {
    if (!userId) return;

    const txWithUser = { ...tx, userId };

    try {
      if (useAPI) {
        if (editTx) {
          await updateTransactionAPI(editTx._id, txWithUser);
          setEditTx(null);
        } else {
          await addTransactionAPI(txWithUser);
        }

        const data = await fetchTransactions(userId);
        setTransactions(data || []);
      } else {
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
      await deleteTransactionAPI(tx._id);
      const data = await fetchTransactions(userId);
      setTransactions(data || []);
    } else {
      const list = transactions.filter((t) => t !== tx);
      setTransactions(list);
      await AsyncStorage.setItem("transactions", JSON.stringify(list));
    }
  };

  // ---------------- SIGN OUT ----------------
  const handleSignOut = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  // ---------------- SEARCH FILTER ----------------
  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.category?.toLowerCase().includes(search.toLowerCase()) ||
      tx.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance Tracker</Text>
        <Button title="Sign Out" onPress={handleSignOut} color="#ff3b30" />
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* API Toggle */}
        <View style={styles.toggleRow}>
          <Text>Use API</Text>
          <Switch value={useAPI} onValueChange={setUseAPI} />
        </View>

        {/* Add / Edit Transaction Form */}
        <TransactionForm onSubmit={handleAddOrUpdate} initialData={editTx} />

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

        <Button title="schedulecNotification" onPress={scheduleNotification} />

      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  content: { padding: 12, paddingBottom: 40 },
  toggleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  search: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 8, marginVertical: 10 },
});
