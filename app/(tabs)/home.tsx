import { BASE_URL } from "@/src/config";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import * as IntentLauncher from "expo-intent-launcher";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  // check punch_in_time in AsyncStorage to determine if user is checked in
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [LastPunchIn, setLastPunchIn] = useState('');
  const [user_name, setUserName] = useState('');
  const [total_visit, setTotalVisit] = useState('');
  const [total_leave, setTotalLeave] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkBtnColor1 = isCheckedIn ? "#de8181ff" : "#000";
  const checkBtnColor2 = isCheckedIn ? "#c63030ff" : "#000";
  const menuItems = [
    { id: "1", title: "Field Visits", icon: "map-pin", route: "/field-visits" },
    { id: "2", title: "Expenses", icon: "file-text", route: "/list-expense" },
    { id: "3", title: "Leave Requests", icon: "calendar", route: "/list-leave" },
  ];
  useFocusEffect(
    
    useCallback(() => {
      fetchDashboardData(); // Runs every time user visits the screen
    }, [])
  );
  const openAppSettings = async () => {
    try {
       await IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
      );
    } catch (error) {
      console.error("Failed to open settings:", error);
      Alert.alert("Error", "Unable to open settings. Please open it manually.");
    }
  };

  const checkPermissions = async () => {
  
  const { status } = await Location.getForegroundPermissionsAsync();

  if (status !== "granted") {
    Alert.alert(
      "Permission Required",
      "Location permission is needed to fetch dashboard data.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: openAppSettings },
      ]
    );
    return false;
  }

  return true;
};
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };
  const fetchDashboardData = async () => {
    const allowed = await checkPermissions();
    if (!allowed) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/home`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 401 || data?.message === "Unauthenticated.") {
        await AsyncStorage.removeItem("token"); // clear token
        Alert.alert("Session expired", "Please log in again.");
        router.replace("/"); // Redirect to login screen
        return null;
      }

      if (response.ok) {
        // Handle dashboard data if needed
        console.log(data);
        setUserName(data.data.user_name);
        setTotalLeave(data.data.total_leaves);
        setTotalVisit(data.data.total_visits);
        if (data.data.attendance && data.data.attendance.login_time) {
          setLastPunchIn(data.data.attendance.login_time?.slice(0, 5));
          setIsCheckedIn(true);
        }
        if (data.data.attendance && data.data.attendance.logout_time) {
          setLastPunchIn('');
          setIsCheckedIn(false);
        }
        setLoading(false);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong!");
    }
  }
  const handleCheckInOut = () => {
    const action = isCheckedIn ? "punch-out" : "punch-in";
    const label = isCheckedIn ? "Check-Out" : "Check-In";

    Alert.alert(
      "Confirmation",
      `Are you sure you want to ${label}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const response = await fetch(`${BASE_URL}/attendance/${action}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },

              });

              const data = await response.json();

              if (response.ok) {
                Alert.alert("Success", `${label} successful!`);
                if (!isCheckedIn) {
                  const punchInTime = new Date(data.attendance.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
                  setLastPunchIn(punchInTime);
                } else {
                  setLastPunchIn('');
                }
                setIsCheckedIn(!isCheckedIn);
              } else {
                Alert.alert("Error", data.message || `${label} failed`);
              }
            } catch (error) {
              Alert.alert("Error", "Something went wrong!");
            }
          },
        },
      ]
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        {/* Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>Welcome</Text>
            <Text style={styles.greeting}>{user_name}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Image
              source={require("../../assets/images/profile-pic.png")}
              style={styles.profileIcon}
            />
          </TouchableOpacity>
        </View>
        {/* Dashboard Cards */}
        <View style={styles.Card}>
          <TouchableOpacity
            style={styles.singleCard}
          // onPress={() => router.push("/list-leave")}
          >
            <Text style={{ fontSize: 20, color: "#764ba2" }}>{total_leave ? total_leave : 0}</Text>
            <Text style={styles.menuText}>Total Leaves</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.singleCard}
          // onPress={() => router.push("/field-visits")}
          >
            <Text style={{ fontSize: 20, color: "#764ba2" }}>{total_visit ? total_visit : 0}</Text>
            <Text style={styles.menuText}>Total Visit</Text>
          </TouchableOpacity>
        </View>

        {/* Menu List */}
        <FlatList
          scrollEnabled={false}
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => router.push(item.route as any)}
            >
              <Feather name={item.icon as any} size={20} color="#764ba2" />
              <Text style={styles.menuText}>{item.title}</Text>
              <Feather
                name="chevron-right"
                size={20}
                color="#999"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
          )}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
        ) : (
          <>
            {/* Check In / Out Buttons */}
            <View style={styles.TimeContainer}><Text style={{ fontSize: 16, fontWeight: 500 }}>{LastPunchIn ? 'Login time:' + LastPunchIn : ''}</Text></View>
            <View style={styles.checkContainer}>
              <TouchableOpacity onPress={handleCheckInOut} style={{ flex: 1, marginRight: 8 }}>
                <LinearGradient
                  colors={[checkBtnColor1, checkBtnColor2]}
                  style={styles.checkButton}
                >
                  <Feather name="clock" size={20} color="#fff" />
                  <Text style={styles.checkText}>{isCheckedIn ? "Check Out" : "Check In"}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  name: {
    fontSize: 16,
    color: "#666",
  },
  profileIcon: {
    width: 50,
    height: 50,
    // borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  checkContainer: {
    flexDirection: "row",
    margin: 20,
  },
  TimeContainer: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  checkButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  checkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  Card: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  singleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    paddingRight: 40,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 25,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
  },
});
