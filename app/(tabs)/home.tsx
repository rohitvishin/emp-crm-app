import { BASE_URL } from "@/src/config";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
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
  const checkBtnColor1= isCheckedIn? "#de8181ff" : "#000";
  const checkBtnColor2= isCheckedIn? "#c63030ff" : "#000";
  const menuItems = [
    { id: "1", title: "Field Visits", icon: "map-pin", route: "/field-visits" },
    { id: "2", title: "Expenses", icon: "file-text", route: "/list-expense" },
    { id: "3", title: "Leave Requests", icon: "calendar", route: "/list-leave" },
  ];
  useEffect(() => {
    const checkPunchInStatus = async () => {
      const punchInTime = await AsyncStorage.getItem("punch_in_time");
      if (punchInTime!='' && punchInTime!=null) {
        // if punchInTIme is not today's date, remove it from storage
        const punchDate = new Date(punchInTime).toDateString();
        const todayDate = new Date().toDateString();
        if(punchDate !== todayDate){
          await AsyncStorage.removeItem("punch_in_time");
          setIsCheckedIn(false);
          setLastPunchIn('');
          return;
        }
        setIsCheckedIn(true);
        setLastPunchIn(punchInTime);
      }
    };
    checkPunchInStatus();
  }, []);

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
                if(!isCheckedIn){
                  const punchInTime = new Date(data.attendance.created_at).toLocaleString();
                  await AsyncStorage.setItem("punch_in_time", punchInTime.toString());
                  setLastPunchIn(punchInTime.toString());
                }else{
                  setLastPunchIn('');
                  await AsyncStorage.removeItem("punch_in_time");
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
      {/* Greeting */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.name}>John Smith</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/profile")}>
            <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
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
      <View style={styles.TimeContainer}><Text>{LastPunchIn}</Text></View>
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
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  checkContainer: {
    flexDirection: "row",
    margin: 20,
  },
  TimeContainer: {
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
