import { Feather } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { useEffect } from "react";
import { Alert, BackHandler } from "react-native";

export default function TabLayout() {
  const pathname = usePathname();

  useEffect(() => {
    const backAction = () => {
      if (pathname === "/home" || pathname === "/(tabs)/home") {
        Alert.alert("Exit App", "Do you want to close the app?", [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => BackHandler.exitApp() },
        ]);
        return true; // prevent navigation
      }
      return false; // let navigation work normally
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [pathname]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#eee",
          height: 60,
          paddingBottom: 5,
          marginBottom: 10,
        },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="field-visits"
        options={{
          title: "Visits",
          tabBarIcon: ({ color, size }) => (
            <Feather name="map-pin" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="list-expense"
        options={{
          title: "Expenses",
          tabBarIcon: ({ color, size }) => (
            <Feather name="dollar-sign" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
