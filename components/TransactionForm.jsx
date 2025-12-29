/*import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";

export default function TransactionForm({ onSubmit, initialData }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setAmount(String(initialData.amount || ""));
      setType(initialData.type || "");
      setCategory(initialData.category || "");
      setDescription(initialData.description || "");
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!amount || !type || !category) {
      Alert.alert("All fields are required");
      return;
    }

const transaction = {
  type: type.trim(),
  amount: Number(amount),
  category: category.trim(),
  description: description.trim(),
  date: new Date()
};

    console.log("Submitting transaction:", transaction);

    onSubmit(transaction);

    setAmount("");
    setType("");
    setCategory("");
    setDescription("");
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} style={styles.input} keyboardType="numeric"/>



<Picker
  selectedValue={type}
  onValueChange={setType}
  style={styles.input}
>
  <Picker.Item label="Transaction Type" value="" />
  
  <Picker.Item label="Income" value="income" />
  <Picker.Item label="Expense" value="expense" />
</Picker>




      
      <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={styles.input}/>
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input}/>
      <Button title={initialData ? "Update Transaction" : "Add Transaction"} onPress={handleSubmit}/>
    </View>
  );
}



const styles = StyleSheet.create({
  container: { marginBottom: 20 },

  input: {
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 5,
    height: 48,
    backgroundColor: "#f2ededff",
    color: "#000",
  },

  picker: {
    borderWidth: 10,
    borderColor: "#000",
  //  borderRadius: 5,
    marginBottom: 8,
    height: 28,
    backgroundColor: "#833838ff",
   
  },
});
*/

import { View, Text, TextInput, Button, StyleSheet, Alert, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";

export default function TransactionForm({ onSubmit, initialData }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setAmount(String(initialData.amount || ""));
      setType(initialData.type || "");
      setCategory(initialData.category || "");
      setDescription(initialData.description || "");
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!amount || !type || !category) {
      Alert.alert("All fields are required");
      return;
    }

    onSubmit({
      type,
      amount: Number(amount),
      category,
      description,
      date: new Date(),
    });

    setAmount("");
    setType("");
    setCategory("");
    setDescription("");
  };

  return (
    <View style={styles.container}>
      {/* Amount */}
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* Transaction Type (TextInput look + Picker dropdown) */}
      <View style={styles.dropdownWrapper}>
        <Text style={[styles.dropdownText, !type && styles.placeholder]}>
          {type === "income"
            ? "Income"
            : type === "expense"
            ? "Expense"
            : "Transaction Type"}
        </Text>

        {/* Invisible Picker */}
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

      {/* Category */}
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      {/* Description */}
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <Button
        title={initialData ? "Update Transaction" : "Add Transaction"}
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  /* 🔹 COMMON INPUT STYLE */
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

  /* 🔹 DROPDOWN LOOKS EXACTLY LIKE INPUT */
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

  dropdownText: {
    fontSize: 16,
    color: "#000",
  },

  placeholder: {
    color: "#888",
  },

  /* 🔹 INVISIBLE PICKER OVER INPUT */
  hiddenPicker: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
  },
});
