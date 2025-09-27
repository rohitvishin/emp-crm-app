import { RootState } from "@/src";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function VisitDetailScreen() {
  const [isStarted, setIsStarted] = useState(false);
  const [isCheckIn, setIsCheckedIn] = useState(false);
  const [isCheckOut, setIsCheckedOut] = useState(false);
  const router = useRouter();
  const visit=useSelector((state: RootState) => state.visit.selectedVisit)
  useEffect(()=>{
    updateVisit(visit)
  });
  const updateVisit=(visit:any)=>{
    if(visit.started_visit_at!=null || visit.started_visit_at!=undefined ){
      console.log(visit.started_visit_at);
      setIsStarted(true)
    }
    if(visit.check_in_time!=null || visit.check_in_time!=undefined ){
      setIsCheckedIn(true)
    }
    if(visit.check_out_time!=null || visit.check_out_time!=undefined ){
      setIsCheckedOut(true)
    }
  }

  if (!visit) {
    return (
      <SafeAreaView>
        <Text>No visit selected</Text>
      </SafeAreaView>
    );
  }
  const openMap = () => {
    const latitude = 19.2434938;
    const longitude = 72.8613462;
    const label = "Client Location";
    const url =`geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`
    Linking.openURL(url).catch(() =>
      alert("Unable to open maps. Please check your device settings.")
    );
  };

  const handleVisitToggle = () => {
    if(!isStarted){
      setIsStarted(true);
    }
    if(isStarted && !isCheckIn){
       setIsCheckedIn(true)
    }
    if (isStarted && isCheckIn && !isCheckOut) {
      setIsCheckedOut(true);
      // End Visit → go to Report screen
      router.push("/report-visit");
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
        <Text style={styles.label}>Client Info</Text>
        <View style={styles.clientRow}>
          <Feather name="user" size={32} color="#666" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.clientName}>Client: John</Text>
            <Text style={styles.clientType}>Visit Status: {visit.status}</Text>
          </View>
        </View>
      </View>

      {/* Client Address */}
      <View style={styles.card}>
        <Text style={styles.label}>Visit Detail</Text>
        <Text style={styles.text}>Purpose: {visit.purpose}</Text>
        <Text style={styles.text}>Date: {visit.date}</Text>
        <Text style={styles.text}>Time: {visit.visit_start_time}</Text>
      </View>

      {/* Client Location */}
      <View style={styles.card}>
        <Text style={styles.label}>Client Location</Text>
        <TouchableOpacity onPress={openMap} style={styles.mapView}>
          <Feather name="map-pin" size={28} color="#fff" />
          <Text style={styles.mapText}>Map View</Text>
          <Text style={styles.mapCoords}>40.7128° N, 74.0060° W</Text>
        </TouchableOpacity>
      </View>

      {/* Distance + Time */}
      {/* <View style={styles.cardRow}>
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
      </View> */}

      {/* Start Visit Button */}
      <TouchableOpacity style={styles.startBtn} onPress={handleVisitToggle}>
        <Feather name="play" size={18} color="#fff" />
        <Text style={styles.startBtnText}>{isStarted ? (isCheckIn?"End Meeting":"Reached Location") : "Start Visit"}</Text>
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
