import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const visits = [
  {
    id: "1",
    title: "Client Meeting",
    location: "ABC Corp Office",
    date: "Jan 15, 2025 - 2:00 PM",
    status: "Scheduled",
  },
  {
    id: "2",
    title: "Site Inspection",
    location: "Downtown Project Site",
    date: "Jan 14, 2025 - 10:00 AM",
    status: "Completed",
  },
];

export default function FieldVisits() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Field Visits</Text>
        <TouchableOpacity onPress={() => router.push("/add-visit")}>
          <Feather name="plus" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Visit List */}
      <FlatList
        data={visits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push("/visit-detail")} style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={[styles.statusBadge, item.status === "Scheduled" ? styles.scheduled : styles.completed]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>{item.location}</Text>
            <Text style={styles.cardDate}>{item.date}</Text>
            <Feather name="chevron-right" size={20} color="#999" style={styles.arrow} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  card: { backgroundColor: "#f9f9f9", marginHorizontal: 16, marginTop: 12, borderRadius: 10, padding: 16, position: "relative" },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  scheduled: { backgroundColor: "#E6F0FF" },
  completed: { backgroundColor: "#E6FFE9" },
  statusText: { fontSize: 12, fontWeight: "600", color: "#333" },
  cardSubtitle: { fontSize: 14, color: "#555", marginBottom: 4 },
  cardDate: { fontSize: 13, color: "#777" },
  arrow: { position: "absolute", right: 12, bottom: 16 },
});
