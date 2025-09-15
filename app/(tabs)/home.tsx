import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const checkBtnColor1= isCheckedIn? "#de8181ff" : "#667eea";
  const checkBtnColor2= isCheckedIn? "#c63030ff" : "#764ba2";
  const menuItems = [
    { id: "1", title: "Field Visits", icon: "map-pin", route: "/field-visits" },
    { id: "2", title: "Expenses", icon: "file-text", route: "/list-expense" },
    { id: "3", title: "Leave Requests", icon: "calendar", route: "/list-leave" },
  ];

  const handleCheckInOut = () => {
    const action = isCheckedIn ? "Check-Out" : "Check-In";

    Alert.alert(
      "Confirmation",
      `Are you sure you want to ${action}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => setIsCheckedIn(!isCheckedIn),
        },
      ]
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Greeting */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.name}>John Smith</Text>
        </View>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.profileIcon}
        >
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Feather name="user" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
      {/* Dashboard Cards */}
      <View style={styles.Card}>
        <TouchableOpacity
          style={styles.singleCard}
          // onPress={() => router.push("/list-leave")}
        >
          <Text style={{ fontSize: 20, color: "#764ba2" }}>2</Text>
          <Text style={styles.menuText}>Total Leaves</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.singleCard}
          // onPress={() => router.push("/field-visits")}
        >
          <Text style={{ fontSize: 20, color: "#764ba2" }}>2</Text>
          <Text style={styles.menuText}>Total Visit</Text>
        </TouchableOpacity>
      </View>
      
      {/* Menu List */}
      <FlatList
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

      {/* Check In / Out Buttons */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
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
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  checkContainer: {
    flexDirection: "row",
    margin: 20,
  },
  checkButton: {
    flexDirection: "column",
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
  Card:{
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
