
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
  Platform,
} from "react-native";

import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {jwtDecode} from "jwt-decode";
import * as Notifications from "expo-notifications";

import TransactionForm from "../../components/TransactionForm";
import TransactionCard from "../../components/TransactionCard";

import {
  fetchTransactions,
  addTransactionAPI,
  updateTransactionAPI,
  deleteTransactionAPI,
} from "../../services/api";

import { useApiToggle } from "../../contexts/ApiToggleContext";

// ---------------- PUSH NOTIFICATIONS ----------------
async function registerForPushNotificationsAsync() {
  if (Platform.OS === "web") return;

  // Android channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  // Request permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("Notification permission not granted");
    return;
  }

  try {
    const tokenData = await Notifications.getDevicePushTokenAsync();
    console.log("✅ FCM TOKEN:", tokenData.data); // For backend push notifications
    return tokenData.data;
  } catch (e) {
    console.log("FCM ERROR:", e);
    Alert.alert("Failed to get FCM token", e.message);
  }
}

// ---------------- HOME COMPONENT ----------------
export default function Home() {
  const router = useRouter();
  const { useAPI, setUseAPI } = useApiToggle();

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
      } catch {
        Alert.alert("Failed to load transactions");
      }
    })();
  }, [useAPI]);

  // ---------------- REGISTER FOR NOTIFICATIONS ON MOUNT ----------------
  useEffect(() => {
    if (Platform.OS !== "web") {
      registerForPushNotificationsAsync();

      // ---------------- DAILY REMINDER ----------------
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Daily Reminder",
          body: "Don't forget to log today's transactions!",
        },
        trigger: {
          hour: 19,
          minute: 5,
          repeats: true,
          channelId: "default",
          type: "time",
        },
      });
    }
  }, []);

  useEffect(() => {
  const subscription =
    Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      Alert.alert(title, body);
    });

  return () => subscription.remove();
}, []);


  // ---------------- SCHEDULE TEST NOTIFICATION ----------------
  const scheduleTestNotification = async () => {
    console.log("Button Pressed");
    if (Platform.OS === "web") return;

    console.log("Scheduling notification in 5s...");
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Finance Tracker Demo",
        body: "This is your test notification",
      },
      trigger: {
        seconds: 5,
        channelId: "default",
        type: "time",
      },
    });
    console.log("Notification scheduled ✅");
  };

  // ---------------- ADD / UPDATE TRANSACTION ----------------
  const handleAddOrUpdate = async (tx) => {
    if (!userId) return;
    const txWithUser = { ...tx, userId };

    try {
      if (useAPI) {
        if (editTx) {
          await updateTransactionAPI(editTx._id, txWithUser);
          setEditTx(null);
          // Notification for update
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Transaction Updated",
              body: `Updated ${tx.category} transaction`,
            },
            trigger: { seconds: 1, channelId: "default", type: "time" },
          });
        } else {
          await addTransactionAPI(txWithUser);
          // Notification for add
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Transaction Added",
              body: `Added ${tx.category} transaction of ₹${tx.amount}`,
            },
            trigger: { seconds: 1, channelId: "default", type: "time" },
          });
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
      Alert.alert("Failed to save transaction");
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

    // Notification for delete
    if (Platform.OS !== "web") {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Transaction Deleted",
          body: `Deleted ${tx.category} transaction of ₹${tx.amount}`,
        },
        trigger: { seconds: 1, channelId: "default", type: "time" },
      });
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance Tracker</Text>
        <Button title="Sign Out" onPress={handleSignOut} color="#ff3b30" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.toggleRow}>
          <Text>Use API</Text>
          <Switch value={useAPI} onValueChange={setUseAPI} />
        </View>

        <TransactionForm onSubmit={handleAddOrUpdate} initialData={editTx} />

        <TextInput
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />

        {filteredTransactions.map((tx, index) => (
          <TransactionCard
            key={index}
            transaction={tx}
            onEdit={() => setEditTx(tx)}
            onDelete={() => handleDelete(tx)}
          />
        ))}

        <Button
          title="Schedule Test Notification"
          onPress={scheduleTestNotification}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  content: { padding: 12, paddingBottom: 40 },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  search: {
    borderWidth: 1,
    borderColor: "#d2d1d1ff",
    borderRadius: 6,
    padding: 8,
    marginVertical: 10,
  },
});
