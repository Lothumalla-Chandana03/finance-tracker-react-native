// Import basic components from React Native
import { View, Text, Button } from "react-native";

// TransactionCard component displays info about a single transaction
// Props:
// - transaction: the transaction object to show
// - onEdit: function to call when user clicks Edit
// - onDelete: function to call when user clicks Delete
export default function TransactionCard({ transaction, onEdit, onDelete }) {
  return (
    // 🔹 Container for the transaction card
    <View style={{ borderWidth: 1, padding: 10, marginBottom: 5 }}>
      
      {/* 🔹 Show transaction type (income / expense) */}
      <Text>Type: {transaction.type}</Text>
      
      {/* 🔹 Show transaction amount */}
      <Text>Amount: ₹{transaction.amount}</Text>
      
      {/* 🔹 Show transaction category */}
      <Text>Category: {transaction.category}</Text>
      
      {/* 🔹 Show description, or '-' if empty */}
      <Text>Description: {transaction.description || "-"}</Text>
      
      {/* 🔹 Show formatted transaction date and time */}
      <Text>
        {new Date(transaction.date).toLocaleString()}
      </Text>

      {/* 🔹 Row for action buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
        {/* Edit button */}
        <Button title="Edit" onPress={onEdit} />
        
        {/* Delete button (red color) */}
        <Button title="Delete" onPress={onDelete} color="red" />
      </View>
    </View>
  );
}

