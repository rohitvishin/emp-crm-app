import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const ProfileScreen = () => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("emp_code");
      router.replace("/"); // Redirect to login screen
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Image */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageWrapper}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png" }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraIcon}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Info List */}
      <View style={styles.infoSection}>
        <TouchableOpacity style={styles.infoCard}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>John Michael Smith</Text>
          <MaterialIcons name="chevron-right" size={22} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoCard}>
          <Text style={styles.label}>Mobile</Text>
          <Text style={styles.value}>+1 (555) 123-4567</Text>
          <MaterialIcons name="chevron-right" size={22} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoCard}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>john.smith@company.com</Text>
          <MaterialIcons name="chevron-right" size={22} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoCard}>
          <Text style={styles.label}>Department</Text>
          <Text style={styles.value}>Engineering</Text>
          <MaterialIcons name="chevron-right" size={22} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoCard}>
          <Text style={styles.label}>Reporting Manager</Text>
          <View style={styles.managerRow}>
            <Text style={styles.value}>Sarah Johnson</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color="#aaa" />
        </TouchableOpacity>
        {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#f0f0f0",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#333",
    borderRadius: 20,
    padding: 6,
  },
  infoSection: {
    marginHorizontal: 16,
  },
  infoCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    color: "#888",
    position: "absolute",
    top: 6,
    left: 16,
  },
  value: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginTop: 10,
  },
  managerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  managerImage: {
    width: 25,
    height: 25,
    borderRadius: 12,
  },
  logoutBtn: { marginTop: 20, padding: 12, backgroundColor: "#000", borderRadius: 8, alignItems: "center" },
  logoutText: { color: "#fff", fontWeight: "600" },
});

export default ProfileScreen;
