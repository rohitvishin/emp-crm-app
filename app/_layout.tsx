import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
       <StatusBar style="dark" backgroundColor="#ffffff"/>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />

          {/* Bottom Tabs */}
          <Stack.Screen name="(tabs)" />

          <Stack.Screen name="add-visit" />
          <Stack.Screen name="visit-detail" />
          <Stack.Screen name="report-visit" />
          <Stack.Screen name="add-expense" />
          <Stack.Screen name="add-leave" />
          <Stack.Screen name="list-leave" />
        </Stack>
    </SafeAreaProvider>
  );
}
