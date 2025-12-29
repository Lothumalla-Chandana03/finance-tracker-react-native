import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  Button,
} from "react-native";

// React hooks for state and lifecycle handling
import { useState, useCallback } from "react";

// Expo Router hooks
import { useFocusEffect, useRouter } from "expo-router";

// Local storage for offline transactions & auth token
import AsyncStorage from "@react-native-async-storage/async-storage";

// Transaction card UI component
import TransCard from "../../components/TransCard";

// API function to fetch transactions from backend
import { fetchTransactions } from "../../services/api";

// Context to know whether API mode is ON or OFF
import { useApiToggle } from "../../contexts/ApiToggleContext";

export default function Dashboard() {
  // Get API toggle value (true = API, false = local storage)
  const { useAPI } = useApiToggle();

  // Router used for navigation (logout → login screen)
  const router = useRouter();

  // ---------------- STATE VARIABLES ----------------

  // Store all transactions
  const [transactions, setTransactions] = useState([]);

  // Store calculated totals
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  // Count number of income & expense transactions
  const [incomeCount, setIncomeCount] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);

  // Used for pull-to-refresh loader
  const [refreshing, setRefreshing] = useState(false);

  // ---------------- LOAD TRANSACTIONS ----------------
  // This function loads data either from API or local storage
  const loadTransactions = async () => {
    if (useAPI) {
      // 🔹 API MODE
      try {
        const tx = await fetchTransactions(); // fetch from backend
        setTransactions(tx);                  // save to state
        calculateTotals(tx);                  // calculate totals
      } catch (err) {
        console.log("API fetch failed:", err.message);
        Alert.alert("API fetch failed");
      }
    } else {
      // 🔹 LOCAL STORAGE MODE
      const data = await AsyncStorage.getItem("transactions");
      const list = data ? JSON.parse(data) : [];

      // Filter out invalid or broken transaction objects
      const validTransactions = Array.isArray(list)
        ? list.filter((tx) => tx && tx.category && tx.amount && tx.type)
        : [];

      setTransactions(validTransactions);
      calculateTotals(validTransactions);
    }
  };

  // ---------------- SCREEN FOCUS EFFECT ----------------
  // Runs every time the Dashboard screen is opened or focused
  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [useAPI]) // reload when API toggle changes
  );

  // ---------------- CALCULATE TOTALS ----------------
  // Calculates income, expense, and transaction counts
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

  // Calculate balance
  const balance = totalIncome - totalExpense;

  // Get only last 3 transactions (latest first)
  const lastThreeTransactions = [...transactions].slice(-3).reverse();

  // ---------------- PULL TO REFRESH ----------------
  // Reloads data when user pulls down
  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  // ---------------- SIGN OUT ----------------
  // Clears token and redirects to login screen
  const handleSignOut = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 🔹 FIXED HEADER (same as Home screen) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance Tracker</Text>
        <Button title="Sign Out" onPress={handleSignOut} color="red" />
      </View>

      {/* 🔹 SCROLLABLE DASHBOARD CONTENT */}
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* TOTAL INCOME */}
        <View style={[styles.card, styles.incomeCard]}>
          <Text>Total Income</Text>
          <Text style={styles.amount}>₹ {totalIncome}</Text>
        </View>

        {/* TOTAL EXPENSE */}
        <View style={[styles.card, styles.expenseCard]}>
          <Text>Total Expense</Text>
          <Text style={styles.amount}>₹ {totalExpense}</Text>
        </View>

        {/* BALANCE */}
        <View style={[styles.card, styles.balanceCard]}>
          <Text>Balance</Text>
          <Text style={styles.amount}>₹ {balance}</Text>
        </View>

        {/* SAVINGS / OVERSPENDING INDICATOR */}
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
