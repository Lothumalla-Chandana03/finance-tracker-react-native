import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  Button,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TransCard from "../../components/TransCard";
import { fetchTransactions } from "../../services/api";
import { useApiToggle } from "../../contexts/ApiToggleContext";

export default function Dashboard() {
  const { useAPI } = useApiToggle();
  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [incomeCount, setIncomeCount] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // ---------------- Load Transactions ----------------
  const loadTransactions = async () => {
    if (useAPI) {
      try {
        const tx = await fetchTransactions();
        setTransactions(tx);
        calculateTotals(tx);
      } catch (err) {
        console.log("API fetch failed:", err.message);
        Alert.alert("API fetch failed");
      }
    } else {
      const data = await AsyncStorage.getItem("transactions");
      const list = data ? JSON.parse(data) : [];
      const validTransactions = Array.isArray(list)
        ? list.filter((tx) => tx && tx.category && tx.amount && tx.type)
        : [];
      setTransactions(validTransactions);
      calculateTotals(validTransactions);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [useAPI])
  );

  const calculateTotals = (list) => {
    let income = 0,
      expense = 0,
      incomeC = 0,
      expenseC = 0;

    list.forEach((tx) => {
      const amount = Number(tx.amount || 0);
      if (tx.type === "income") {
        income += amount;
        incomeC++;
      }
      if (tx.type === "expense") {
        expense += amount;
        expenseC++;
      }
    });

    setTotalIncome(income);
    setTotalExpense(expense);
    setIncomeCount(incomeC);
    setExpenseCount(expenseC);
  };

  const balance = totalIncome - totalExpense;
  const lastThreeTransactions = [...transactions].slice(-3).reverse();

  // ---------------- Pull-to-refresh ----------------
  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

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
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* TOTAL SUMMARY */}
        <View style={[styles.card, styles.incomeCard]}>
          <Text>Total Income</Text>
          <Text style={styles.amount}>₹ {totalIncome}</Text>
        </View>

        <View style={[styles.card, styles.expenseCard]}>
          <Text>Total Expense</Text>
          <Text style={styles.amount}>₹ {totalExpense}</Text>
        </View>

        <View style={[styles.card, styles.balanceCard]}>
          <Text>Balance</Text>
          <Text style={styles.amount}>₹ {balance}</Text>
        </View>

        {/* SAVINGS INDICATOR */}
        <View
          style={[
            styles.card,
            balance >= 0 ? styles.savingCard : styles.overSpendCard,
          ]}
        >
          <Text>{balance >= 0 ? "Savings 👍" : "Overspending ⚠️"}</Text>
          <Text style={styles.amount}>₹ {Math.abs(balance)}</Text>
        </View>

        {/* TRANSACTION COUNTS */}
        <Text style={styles.subTitle}>Transaction Summary</Text>
        <View style={styles.row}>
          <View style={[styles.smallCard, styles.incomeCard]}>
            <Text>Total</Text>
            <Text style={styles.amount}>{transactions.length}</Text>
          </View>
          <View style={[styles.smallCard, styles.incomeCard]}>
            <Text>Income</Text>
            <Text style={styles.amount}>{incomeCount}</Text>
          </View>
          <View style={[styles.smallCard, styles.expenseCard]}>
            <Text>Expense</Text>
            <Text style={styles.amount}>{expenseCount}</Text>
          </View>
        </View>

        {/* LAST 3 TRANSACTIONS */}
        <Text style={styles.subTitle}>Last 3 Transactions</Text>
        {lastThreeTransactions.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 10 }}>
            No transactions yet
          </Text>
        ) : (
          lastThreeTransactions.map((tx) => (
            <TransCard key={tx._id} transaction={tx} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  /* 🔹 HEADER SAME AS HOME */
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

  title: { fontSize: 22, fontWeight: "bold" },
  subTitle: { fontSize: 18, marginVertical: 10 },

  card: { padding: 16, borderRadius: 10, marginBottom: 10},
  smallCard: { flex: 1, padding: 12, borderRadius: 10, alignItems: "center" },
  row: { flexDirection: "row", gap: 10, marginBottom: 10 },

  incomeCard: { backgroundColor: "#d4f8e8" },
  expenseCard: { backgroundColor: "#f8d4d4" },
  balanceCard: { backgroundColor: "#d4e6f8" },
  savingCard: { backgroundColor: "#c8f7c5" },
  overSpendCard: { backgroundColor: "#ffd6d6" },

  amount: { fontSize: 18, fontWeight: "bold" },
});
