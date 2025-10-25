import { BASE_URL } from "@/src/config";
import { setSelectedVisit } from "@/src/visitSlice";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

export default function FieldVisits() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [sections, setSections] = useState<any[]>([]);
  const [upcomingSections, setUpcomingSections] = useState<any[]>([]);
  const [pastSections, setPastSections] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchVisits();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVisits();
    setRefreshing(false);
  };

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${BASE_URL}/visits`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Fetched visits data:", data);
      if (response.ok && data.visits) {
        const visits = data.visits.map((v: any) => ({
          id: String(v.id),
          customer: v.customer?.name || "No name",
          purpose: v.purpose || "No Purpose",
          notes: v.notes || "No Notes",
          visit_start_time: v.meeting_scheduled_from,
          started_visit_at: v.started_visit_at || null,
          check_in_time: v.check_in_time || null,
          check_out_time: v.check_out_time || null,
          location: v.meetup_address || null,
          date: v.visit_date,
          status: v.outcome,
          groupDate: v.visit_date,
          meeting_latitude: v.meeting_latitude,
          meeting_longitude: v.meeting_longitude,
        }));

        // Group visits by date for SectionList
        const grouped = Object.values(
          visits.reduce((acc: any, visit: any) => {
            if (!acc[visit.groupDate]) {
              acc[visit.groupDate] = { title: visit.groupDate, data: [] };
            }
            acc[visit.groupDate].data.push(visit);
            return acc;
          }, {})
        );

        grouped.sort((a: any, b: any) => {
          return new Date(b.title).getTime() - new Date(a.title).getTime();
        });

        // Separate upcoming & past visits
        const today = new Date().toISOString().split("T")[0];
        const upcoming = grouped.filter((g: any) => g.title >= today);
        const past = grouped.filter((g: any) => g.title < today);

        setUpcomingSections(upcoming);
        setPastSections(past);
        setSections(grouped);
      }
    } catch (error) {
      console.error("Fetch visits error:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentSections = activeTab === "upcoming" ? upcomingSections : pastSections;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visits</Text>
        <View />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "past" && styles.activeTab]}
          onPress={() => setActiveTab("past")}
        >
          <Text
            style={[styles.tabText, activeTab === "past" && styles.activeTabText]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : currentSections.length === 0 ||
        currentSections.every((s) => s.data.length === 0) ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={{ alignItems: "center", marginTop: 80 }}>
            <Image
              source={require("../../assets/images/no-data.png")}
              style={{ width: 150, height: 150, resizeMode: "contain" }}
            />
            <Text style={{ color: "#666", marginTop: 10 }}>
              No {activeTab} visits found
            </Text>
          </View>
        </ScrollView>
      ) : (
        <SectionList
          sections={currentSections}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                dispatch(setSelectedVisit(item));
                router.push("/visit-detail");
              }}
              style={styles.card}
            >
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{item.purpose}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.check_out_time
                      ? styles.completed
                      : styles.scheduled,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {item.check_out_time ? "Completed" : "Pending"}
                  </Text>
                </View>
              </View>
              <Text style={styles.cardSubtitle}>{item.notes}</Text>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Feather
                name="chevron-right"
                size={20}
                color="#999"
                style={styles.arrow}
              />
            </TouchableOpacity>
          )}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "600" },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f2f2f2",
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "#353535ff",
  },
  tabText: {
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
  },

  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    paddingLeft: 20,
    paddingVertical: 10,
    marginTop: 10,
    backgroundColor: "#f9f9f9",
  },
  card: {
    backgroundColor: "#f9f9f9",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 10,
    padding: 16,
    position: "relative",
  },
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
