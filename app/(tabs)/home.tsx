import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
       {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Employee App</Text>
        </View>
      <View style={styles.card}>
        {/* Greeting */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.username}>Bablu bhaiya</Text>
          </View>
          {/* <FontAwesome5 name="user-circle" size={40} color="#000" /> */}
          <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
          style={styles.avatar}
        />
        </View>

        {/* Check In / Out */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.checkBtn, { backgroundColor: "#e9ffcdff" }]}>
             <Image
            source={{ uri:"https://www.iconpacks.net/icons/1/free-user-login-icon-305-thumb.png"}}
            style={{ width: 24, height: 24 }}
            />
            {/* <Feather name="clock" size={22} color="#444" /> */}
            <Text style={styles.checkText}>Check In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.checkBtn, { backgroundColor: "#ffe0e0ff" }]}>
            <Feather name="clock" size={22} color="#444" />
            <Text style={styles.checkText}>Check Out</Text>
          </TouchableOpacity>
        </View>

        {/* Menu items */}
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/field-visits")}>
          <MaterialIcons name="location-on" size={20} color="#444" />
          <Text style={styles.menuText}>Field Visits</Text>
          <Feather name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/list-expense")}>
          <MaterialIcons name="receipt" size={20} color="#444" />
          <Text style={styles.menuText}>Expenses</Text>
          <Feather name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/list-leave")}>
          <MaterialIcons name="event" size={20} color="#444" />
          <Text style={styles.menuText}>Leave Requests</Text>
          <Feather name="chevron-right" size={20} color="#999" />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  container: { flex: 1, backgroundColor: "#fff"},
  title: { fontSize: 22, fontWeight: "600", marginBottom: 20, textAlign: "center" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  greeting: { fontSize: 18, fontWeight: "600" },
  username: { fontSize: 14, color: "#777" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  checkBtn: { flex: 1, backgroundColor: "#e9e9e9", padding: 15, borderRadius: 8, alignItems: "center", marginHorizontal: 5 },
  checkText: { marginTop: 5, fontSize: 14, fontWeight: "500" },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
  menuText: { flex: 1, fontSize: 15, marginLeft: 10, fontWeight: "500" },
});
