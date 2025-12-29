// Import basic React Native components
import { View, Text, Switch } from "react-native";

// Import custom context hook to get and set API toggle
import { useApiToggle } from "../contexts/ApiToggleContext";

export default function ToggleSource() {
  // 🔹 Get current toggle state and function to change it
  const { useAPI, setUseAPI } = useApiToggle();

  return (
    // 🔹 Container for text and switch in a row
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
      
      {/* 🔹 Display current mode */}
      <Text style={{ marginRight: 10 }}>
        {useAPI ? "API Mode" : "Local Mode"} 
        {/* Shows "API Mode" if useAPI is true, else "Local Mode" */}
      </Text>

      {/* 🔹 Switch component to toggle between API and Local mode */}
      <Switch 
        value={useAPI}           // current state of toggle
        onValueChange={setUseAPI} // function to update toggle state
      />
    </View>
  );
}
