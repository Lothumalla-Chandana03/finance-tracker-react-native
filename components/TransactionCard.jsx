import { View, Text, Button } from "react-native";


export default function TransactionCard({ transaction, onEdit, onDelete }) {
  return (
    <View style={{ borderWidth: 1, padding: 10, marginBottom: 5 }}>
      <Text>Type: {transaction.type}</Text>
      <Text>Amount: ₹{transaction.amount}</Text>
      <Text>Category: {transaction.category}</Text>
      
      <Text>Description: {transaction.description || "-"}</Text>
      
      <Text>Date: {transaction.date}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
        <Button title="Edit" onPress={onEdit} />
        <Button title="Delete" onPress={onDelete} color="red" />
      </View>
    </View>
  );
}
