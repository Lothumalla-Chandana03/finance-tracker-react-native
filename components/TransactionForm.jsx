// Import basic React Native components and hooks
import { View, Text, TextInput, Button, StyleSheet, Alert, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";

// TransactionForm component: used to add or edit a transaction
// Props:
// - onSubmit: function to call when user submits the form
// - initialData: optional, pre-filled data when editing a transaction
export default function TransactionForm({ onSubmit, initialData }) {
  // 🔹 State variables to hold form input values
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // 🔹 Fill form if editing an existing transaction
  useEffect(() => {
    if (initialData) {
      setAmount(String(initialData.amount || ""));
      setType(initialData.type || "");
      setCategory(initialData.category || "");
      setDescription(initialData.description || "");
    }
  }, [initialData]);

  // 🔹 Handle form submission
  const handleSubmit = () => {
    // ✅ Validate required fields
    if (!amount || !type || !category) {
      Alert.alert("All fields are required");
      return;
    }

    // ✅ Call the parent function with form data
    onSubmit({
      type,
      amount: Number(amount),
      category,
      description,
      date: new Date(), // record current date
    });

    // ✅ Reset form fields after submission
    setAmount("");
    setType("");
    setCategory("");
    setDescription("");
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Amount Input */}
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* 🔹 Transaction Type Picker disguised as input */}
      <View style={styles.dropdownWrapper}>
        {/* Show selected type or placeholder */}
        <Text style={[styles.dropdownText, !type && styles.placeholder]}>
          {type === "income"
            ? "Income"
            : type === "expense"
            ? "Expense"
            : "Transaction Type"}
        </Text>

        {/* Invisible Picker on top to select type */}
        <Picker
          selectedValue={type}
          onValueChange={(val) => setType(val)}
          style={styles.hiddenPicker}
        >
          <Picker.Item label="Transaction Type" value="" />
          <Picker.Item label="Income" value="income" />
          <Picker.Item label="Expense" value="expense" />
        </Picker>
      </View>

      {/* 🔹 Category Input */}
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      {/* 🔹 Description Input */}
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      {/* 🔹 Submit Button */}
      <Button
        title={initialData ? "Update Transaction" : "Add Transaction"}
        onPress={handleSubmit}
      />
    </View>
  );
}

// 🔹 STYLES
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  // 🔹 Common style for all text inputs
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: "#f2ededff",
    color: "#000",
  },

  // 🔹 Wrapper for picker that looks like a text input
  dropdownWrapper: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: "#f2ededff",
  },

  // 🔹 Text showing selected value or placeholder
  dropdownText: {
    fontSize: 16,
    color: "#000",
  },

  // 🔹 Placeholder style when no value is selected
  placeholder: {
    color: "#888",
  },

  // 🔹 Make the Picker invisible but clickable
  hiddenPicker: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
  },
});
