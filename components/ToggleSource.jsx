import { View, Text, Switch } from "react-native";
import { useApiToggle } from "../contexts/ApiToggleContext";

export default function ToggleSource() {
  const { useAPI, setUseAPI } = useApiToggle();

  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
      <Text style={{ marginRight: 10 }}>
        {useAPI ? "API Mode" : "Local Mode"}
      </Text>
      <Switch value={useAPI} onValueChange={setUseAPI} />
    </View>
  );
}
