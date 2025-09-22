import { BASE_URL } from "@/src/config";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddVisit() {
  const router = useRouter();
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [employee, setEmployee] = useState("");
  const [customer, setCustomer] = useState("");
  const [purpose, setPurpose] = useState("");
  const [description, setDescription] = useState("");

   const customers = [
        { label: "John Smith", value: 1 },
        { label: "Alice Johnson", value: 2 },
        { label: "Michael Brown", value: 3 },
    ];
  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You are not logged in!");
        return;
      }

      // Build request payload
      const payload = {
        customer_id: customer,
        visit_date: date ? date.toISOString().split("T")[0] : null, // YYYY-MM-DD
        purpose: purpose,
        notes: description,
        visit_start_time: startTime
          ? new Date(startTime).toISOString().slice(0, 19).replace("T", " ")
          : null,
        visit_end_time: endTime
          ? new Date(endTime).toISOString().slice(0, 19).replace("T", " ")
          : null,
      };
      // Send to API
      const response = await fetch(`${BASE_URL}/visits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Visit saved successfully!", [
          { text: "OK", onPress: () => router.push("/field-visits") },
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to save visit.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while saving visit.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Visit</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>
      
        {/* Customer  */}        
        <Text style={styles.label}>Customer</Text>
        <RNPickerSelect
        onValueChange={(value) => setCustomer(value)}
        items={customers}
        value={customer}
        placeholder={{ label: "Select Customer", value: null }}
        style={{
          inputAndroid: styles.input, // Android style
        }}
      />

        {/* Visit Purpose */}
        <Text style={styles.label}>Visit Purpose</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter visit purpose"
          value={purpose}
          onChangeText={setPurpose}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.textInput, { height: 80 }]}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        {/* Date Picker */}
        <Text style={styles.label}>Visit Date</Text>
        <TouchableOpacity style={styles.inputWrapper} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.placeholder}>
            {date ? date.toDateString() : "Select date"}
          </Text>
          <Feather name="calendar" size={20} color="#999" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
        {/* Start Time Picker */}
        <Text style={styles.subLabel}>Visit Start Time</Text>
        <TouchableOpacity style={styles.inputWrapper} onPress={() => setShowStartPicker(true)}>
          <Text style={styles.placeholder}>
            {startTime ? startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Select start time"}
          </Text>
          <Feather name="clock" size={20} color="#999" />
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startTime || new Date()}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedTime) => {
              setShowStartPicker(false);
              if (selectedTime) setStartTime(selectedTime);
            }}
          />
        )}

        {/* End Time Picker */}
        <Text style={styles.subLabel}>Visit End Time</Text>
        <TouchableOpacity style={styles.inputWrapper} onPress={() => setShowEndPicker(true)}>
          <Text style={styles.placeholder}>
            {endTime ? endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Select end time"}
          </Text>
          <Feather name="clock" size={20} color="#999" />
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endTime || new Date()}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedTime) => {
              setShowEndPicker(false);
              if (selectedTime) setEndTime(selectedTime);
            }}
          />
        )}

        {/* Buttons */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save Visit</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    color: "#000",
    backgroundColor: "#fff",
  },
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  form: { padding: 16 },
  label: { fontSize: 14, fontWeight: "600", marginTop: 15, marginBottom: 6 },
  subLabel: { fontSize: 13, fontWeight: "500", marginTop: 10, marginBottom: 6 },
  inputWrapper: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 10 },
  placeholder: { fontSize: 14, color: "#777" },
  textInput: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 10, backgroundColor: "#fff" },
  saveBtn: { backgroundColor: "#000", paddingVertical: 14, borderRadius: 8, marginTop: 20, alignItems: "center" },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  cancelBtn: { paddingVertical: 14, borderRadius: 8, marginTop: 10, alignItems: "center", borderWidth: 1, borderColor: "#ddd" },
  cancelText: { color: "#333", fontSize: 16, fontWeight: "600" },
});
