import { RootState } from "@/src";
import { BASE_URL } from "@/src/config";
import { startLocationTracking, stopLocationTracking } from "@/src/location";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function VisitDetailScreen() {
  const [isStarted, setIsStarted] = useState(false);
  const [isCheckIn, setIsCheckedIn] = useState(false);
  const [isCheckOut, setIsCheckedOut] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [visitId, setVisitId] = useState(0);
  const router = useRouter();
  const visit=useSelector((state: RootState) => state.visit.selectedVisit)
  useEffect(()=>{
    updateVisit(visit)
  });

  const updateVisit=async (visit:any)=>{
    const visit_Id=await AsyncStorage.getItem("visitId");
    console.log(visit);
    if(visit.started_visit_at!=null || visit.started_visit_at!=undefined ){
      setIsStarted(true)
    }
    if(visit.check_in_time!=null || visit.check_in_time!=undefined ){
      setIsCheckedIn(true)
    }
    if(visit.check_out_time!=null || visit.check_out_time!=undefined ){
      setIsCheckedOut(true)
    }
    if(visit.id!=null || visit.id!=undefined){
      setVisitId(visit.id)
    }
    if(visit_Id == visit.id){
      // if visit already started
      setIsStarted(true);
      setShowButton(true);
    }else if(visit_Id!='' || visit_Id!=null){
      // if another visit is active
      setShowButton(false);
    }else{
      setShowButton(true);
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
    const latitude = visit.meeting_latitude;
    const longitude = visit.meeting_longitude;
    console.log(longitude)
    const label = "Client Location";
    const url =`geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`
    Linking.openURL(url).catch(() =>
      alert("Unable to open maps. Please check your device settings.")
    );
  };
  const handleVisitToggle = async () => {
     Alert.alert(
      "Confirm Action",
      `Are you sure ?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
              try{
                  let actionType = "";
                    if (!isStarted) {
                      setIsStarted(true);
                      actionType = "start_visit";
                      // update visitId in AsyncStorage
                      await AsyncStorage.setItem("visitId", visit.id);
                      startLocationTracking();
                    } else if (isStarted && !isCheckIn) {
                      setIsCheckedIn(true);
                      actionType = "reached_at";
                       stopLocationTracking();
                      await AsyncStorage.removeItem("visitId");
                    } else if (isStarted && isCheckIn && !isCheckOut) {
                      setIsCheckedOut(true);
                      actionType = "meeting_end";
                    }

                    if (actionType !== "") {
                      const payload={
                        action_type:actionType,
                        visit_id:visitId,
                      }
                      console.log(payload);
                      const token=await AsyncStorage.getItem('token');
                      const response=await fetch(`${BASE_URL}/update-visit`,{
                          method:'POST',
                          headers:{
                            "Content-Type":"application/json",
                            Authorization:`Bearer ${token}`,
                          },
                          body:JSON.stringify(payload)
                      });
                      const data = await response.json();
                      if (response.ok) {
                        if (actionType === "meeting_end") {
                          // End Visit → go to Report screen
                          router.push("/field-visits");
                        }
                      } else {
                        Alert.alert("Error", data.message || "Failed to update visit");
                      }
                  }
                }catch (error) {
                  console.error(error);
                  Alert.alert("Error", "Something went wrong while updating visit");
                }
          }
        }
      ]);
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
            <Text style={styles.clientName}>Client: {visit.customer}</Text>
            <Text style={styles.clientType}>Visit Status: {isCheckIn ? (isCheckOut ? "Completed" : "Reached Location") : "Pending"}</Text>
          </View>
        </View>
      </View>

      {/* Client Address */}
      <View style={styles.card}>
        <Text style={styles.label}>Visit Detail</Text>
        <Text style={styles.text}>Purpose: {visit.purpose}</Text>
        <Text style={styles.text}>Date & Time: {visit.visit_start_time}</Text>
        <Text style={styles.text}>Notes: {visit.notes}</Text>
      </View>

      {/* Client Location */}
      <View style={styles.card}>
        <Text style={styles.label}>Meeting Location: {visit.location}</Text>
        <TouchableOpacity onPress={openMap} style={styles.mapView}>
          <Feather name="map-pin" size={28} color="#fff" />
          <Text style={styles.mapText}>Map View</Text>
          <Text style={styles.mapCoords}>{visit.meeting_latitude}°, {visit.meeting_longitude}°</Text>
        </TouchableOpacity>
      </View>
      {showButton && !isCheckOut && (
        <TouchableOpacity style={styles.startBtn} onPress={handleVisitToggle}>
          <Feather name="play" size={18} color="#fff" />
          <Text style={styles.startBtnText}>
            {isStarted ? (isCheckIn ? "End Meeting" : "Reached Location") : "Start Visit"}
          </Text>
        </TouchableOpacity>
      )}
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
