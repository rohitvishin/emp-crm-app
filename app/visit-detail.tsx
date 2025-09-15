import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VisitDetailScreen() {
  const [isStarted, setIsStarted] = useState(false);
  const router = useRouter();
  const handleVisitToggle = () => {
    if (isStarted) {
      // End Visit → go to Report screen
      router.push("/report-visit");
    } else {
      // Start Visit → just toggle state
      setIsStarted(true);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visit Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Client Info */}
      <View style={styles.card}>
        <Text style={styles.label}>Client Name</Text>
        <View style={styles.clientRow}>
          <Feather name="user" size={32} color="#666" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.clientName}>John Anderson</Text>
            <Text style={styles.clientType}>Premium Client</Text>
          </View>
        </View>
      </View>

      {/* Client Address */}
      <View style={styles.card}>
        <Text style={styles.label}>Client Address</Text>
        <Text style={styles.text}>1234 Business Avenue</Text>
        <Text style={styles.text}>Suite 567, Floor 12</Text>
        <Text style={styles.text}>New York, NY 10001</Text>
      </View>

      {/* Client Location */}
      <View style={styles.card}>
        <Text style={styles.label}>Client Location</Text>
        <View style={styles.mapView}>
          <Feather name="map-pin" size={28} color="#fff" />
          <Text style={styles.mapText}>Map View</Text>
          <Text style={styles.mapCoords}>40.7128° N, 74.0060° W</Text>
        </View>
      </View>

      {/* Distance + Time */}
      <View style={styles.cardRow}>
        <View style={styles.rowItem}>
          <Feather name="navigation" size={16} color="#555" />
          <Text style={styles.rowLabel}>Distance</Text>
          <Text style={styles.rowValue}>2.3 km</Text>
        </View>
        <View style={styles.rowItem}>
          <Feather name="clock" size={16} color="#555" />
          <Text style={styles.rowLabel}>Est. Travel Time</Text>
          <Text style={styles.rowValue}>8 mins</Text>
        </View>
      </View>

      {/* Start Visit Button */}
      <TouchableOpacity style={styles.startBtn} onPress={handleVisitToggle}>
        <Feather name="play" size={18} color="#fff" />
        <Text style={styles.startBtnText}>{isStarted ? "End Visit" : "Start Visit"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
  },
  clientType: {
    fontSize: 13,
    color: "#777",
  },
  text: {
    fontSize: 14,
    color: "#444",
    marginBottom: 2,
  },
  mapView: {
    backgroundColor: "#6b7280",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  mapText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
  },
  mapCoords: {
    color: "#ddd",
    fontSize: 12,
    marginTop: 2,
  },
  rowItem: {
    alignItems: "center",
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  startBtn: {
    flexDirection: "row",
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  startBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
});
