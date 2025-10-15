import { store } from "@/src";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Provider } from "react-redux";
export default function RootLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "#171616ff",
            marginTop: -insets.top,
          }}
        >
          <StatusBar style="dark" backgroundColor="#ffffff" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: "#fff",
              },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="add-visit" />
            <Stack.Screen name="visit-detail" />
            <Stack.Screen name="report-visit" />
            <Stack.Screen name="add-expense" />
            <Stack.Screen name="add-leave" />
            <Stack.Screen name="list-leave" />
            <Stack.Screen name="change-password" />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}
