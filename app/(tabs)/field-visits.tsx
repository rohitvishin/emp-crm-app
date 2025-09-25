import { BASE_URL } from "@/src/config";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FieldVisits() {
  const router = useRouter();
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      fetchVisits();
    }, []);

  const fetchVisits = async () => {
  try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await fetch(`${BASE_URL}/visits`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.visits?.data) {
        // Transform API data to match UI structure
        const visits = data.visits.data.map((v: any) => ({
          id: String(v.id),
          title: v.purpose || "No Purpose",
          location: `Get customer addr by ID: ${v.customer_id}`, // adjust if API returns customer name
          date: v.visit_date,
          status: v.outcome,
          groupDate: v.visit_date, // group by date
        }));

        // Group visits by groupDate for SectionList
        const grouped = Object.values(
          visits.reduce((acc: any, visit: any) => {
            if (!acc[visit.groupDate]) {
              acc[visit.groupDate] = { title: visit.groupDate, data: [] };
            }
            acc[visit.groupDate].data.push(visit);
            return acc;
          }, {})
        );

        setSections(grouped);
      } else {
        console.error("Error fetching visits:", data);
      }
    } catch (error) {
      console.error("Fetch visits error:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visit List</Text>
        <TouchableOpacity onPress={() => router.push("/add-visit")}>
          <Feather name="plus" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push("/visit-detail")}
              style={styles.card}
            >
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === "Pending"
                      ? styles.scheduled
                      : styles.completed,
                  ]}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.cardSubtitle}>{item.location}</Text>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Feather
                name="chevron-right"
                size={20}
                color="#999"
                style={styles.arrow}
              />
            </TouchableOpacity>
          )}
        />
      )
    }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
   sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    paddingLeft: 20,
    paddingVertical: 10,
    marginTop: 10,
    backgroundColor: "#f9f9f9",
  },
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
