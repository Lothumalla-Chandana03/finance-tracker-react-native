// Import Tabs from Expo Router to create bottom tab navigation
import { Tabs } from "expo-router";

// Import Ionicons for tab icons (Home, Dashboard icons)
import { Ionicons } from "@expo/vector-icons";

// SafeAreaView ensures content doesn’t overlap with
// mobile notch, status bar, or bottom gesture area
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
  return (
    // SafeAreaView wraps the entire tab layout
    // edges=["top","bottom"] means apply safe area padding
    // only to top and bottom (not left/right)
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>

      {/* Tabs component creates bottom tab navigation */}
      <Tabs
        screenOptions={{
          // Hide header on all tab screens
          headerShown: false,

          // Color for active (selected) tab icon & text
          tabBarActiveTintColor: "#007AFF",

          // Color for inactive (unselected) tab icon & text
          tabBarInactiveTintColor: "#8e8e93",

          // Styling for the bottom tab bar
          tabBarStyle: {
            height: 60,        // Height of tab bar
            paddingBottom: 5,  // Space below icons/text
          },
        }}
      >

        {/* HOME TAB */}
        <Tabs.Screen
          name="home" // Must match file name: app/(tabs)/home.jsx
          options={{
            title: "Home", // Label shown below the icon

            // Icon shown in the tab bar
            tabBarIcon: ({ color, size }) => (
              // Home icon from Ionicons
              <Ionicons
                name="home-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />

        {/* DASHBOARD TAB */}
        <Tabs.Screen
          name="dashboard" // Must match file name: app/(tabs)/dashboard.jsx
          options={{
            title: "Dashboard", // Label shown below the icon

            // Icon shown in the tab bar
            tabBarIcon: ({ color, size }) => (
              // Stats / analytics icon
              <Ionicons
                name="stats-chart-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />

      </Tabs>
    </SafeAreaView>
  );
}
