import { Stack } from "expo-router";

export default function RootLayout() {
  return (
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
  );
}
