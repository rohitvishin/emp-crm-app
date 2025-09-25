import { BASE_URL } from "@/src/config";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Expense = {
  id: string;
  category: string;
  description: string;
  created_at: string;
  amount: string;
  status: "pending" | "approved" | "rejected" | string; // extendable
};

export default function ListExpense() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",  // Jan, Feb, Mar...
      day: "2-digit",  // 01, 02, ...
      year: "numeric",
    });
  };

  const fetchExpenses = async () => {
    try {
      const token=await AsyncStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/expenses`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      if (json.status && json.data) {
        setExpenses(json.data);
      }
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expense Lists</Text>
        <TouchableOpacity onPress={() => router.push("/add-expense")}>
          <Feather name="plus" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Expense List */}
      <FlatList<Expense>
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.cardTitle}>{item.category}</Text>
              <View style={[styles.statusBadge, item.status === "Pending" ? styles.scheduled : styles.completed]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>{item.description}</Text>
            <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
            <Text style={styles.arrow}>{item.amount} INR</Text>
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
