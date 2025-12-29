import { View, Text } from "react-native";


export default function TransCard({ transaction }) {
  return (
    <View style={{ borderWidth: 1, padding: 10, marginBottom: 5 }}>
      <Text>Category: {transaction.category}</Text>
      <Text>Amount: ₹{transaction.amount}</Text>
      <Text>Description: {transaction.description || "-"}</Text>
      <Text>Type: {transaction.type}</Text>
      <Text>Date: {transaction.date}</Text>
    </View>
  );
}