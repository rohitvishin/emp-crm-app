import { BASE_URL } from "@/src/config";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


// Define type for a Leave item
type Leave = {
  id: string;
  title: string;
  location: string;
  date: string;
  status: string;
};

export default function ListLeaves() {
  const router = useRouter();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      setLoading(true);
      const response = await fetch(`${BASE_URL}/leave-list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();

      if (json.status && json.leaves?.data) {
        const formatted: Leave[] = json.leaves.data.map((item: any) => {
          const from = new Date(item.leave_from);
          const to = new Date(item.leave_to);

          const diffTime = Math.abs(to.getTime() - from.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

          return {
            id: String(item.id),
            title: `${item.leave_type} Leave`,
            location: item.reason,
            date:
              from.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              }) +
              (diffDays > 1
                ? ` - ${to.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })} (${diffDays} days)`
                : ` (${diffDays} day)`),
            status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          };
        });
        setLeaves(formatted);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem: ListRenderItem<Leave> = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
    >
      <View style={styles.cardRow}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            item.status === "Pending" ? styles.scheduled : styles.completed,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.cardSubtitle}>{item.location}</Text>
      <Text style={styles.cardDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaves List</Text>
        <TouchableOpacity onPress={() => router.push("/add-leave")}>
          <Feather name="plus" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Loader */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={leaves}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
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
    borderColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  card: {
    padding: 16,
    margin: 10,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardSubtitle: { fontSize: 14, color: "#555" },
  cardDate: { fontSize: 13, color: "#999", marginTop: 4 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scheduled: { backgroundColor: "#FFD700" },
  completed: { backgroundColor: "#4CAF50" },
  statusText: { fontSize: 12, fontWeight: "600", color: "#fff" },
});
