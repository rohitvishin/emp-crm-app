import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="field-visits" options={{ headerShown: false }} />
      <Stack.Screen name="add-visit" options={{ headerShown: false }} />
      <Stack.Screen name="visit-detail" options={{ headerShown: false }} />
    </Stack>
  );
}
