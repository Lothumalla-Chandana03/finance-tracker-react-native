// Stack is used to create screen-to-screen navigation
// (Login → Tabs → Other screens)
import { Stack } from "expo-router";

// Context provider to share API toggle (API / Local storage)
// across the entire app
import { ApiToggleProvider } from "../contexts/ApiToggleContext";

// SafeAreaProvider makes sure the app respects
// notches, status bars, and gesture areas on all devices
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    // Wrap the whole app so safe area works everywhere
    <SafeAreaProvider>

      {/* Provide API toggle context to all screens */}
      <ApiToggleProvider>

        {/* Stack handles navigation between screens */}
        <Stack
          screenOptions={{
            // Hide default header since we use custom headers
            headerShown: false,
          }}
        />

      </ApiToggleProvider>
    </SafeAreaProvider>
  );
}
