
import { Slot } from "expo-router";
import { ApiToggleProvider } from "../contexts/ApiToggleContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ApiToggleProvider>
        <Slot /> {/* All screens and tabs will be rendered here */}
              <Stack
        screenOptions={{
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
      </ApiToggleProvider>
    </SafeAreaProvider>
  );
}
