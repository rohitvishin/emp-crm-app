import { BASE_URL } from "@/src/config";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddLeaveScreen = () => {
    const router = useRouter();
    const [fromDatePicker, setFromDatePicker] = useState(false);
    const [selectedToDate, setToDatePicker] = useState(false);
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    

  const handleSubmit = async () => {
    const leave_from=fromDate
          ? new Date(fromDate).toISOString().split("T")[0]
          : null;
    const leave_to=toDate
          ? new Date(toDate).toISOString().split("T")[0]
          : null;
   
    // handle API call here
    const token=await AsyncStorage.getItem('token');
    const payload={
      leave_type:category,
      reason:description,
      leave_from:leave_from,
      leave_to:leave_to,
    }
    console.log(payload);
    // handle API call here
    const response=await fetch(`${BASE_URL}/add-leaves`,{
        method:'POST',
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`,
        },
        body:JSON.stringify(payload)
    });
    const data = await response.json();
    if (response.ok) {
      Alert.alert("Success", "Leave request added!", [
        { text: "OK", onPress: () => router.push("/list-leave") },
      ]);
    } else {
      Alert.alert("Error", data.message || "Failed to add leave.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Leave</Text>
        <View style={{ width: 24 }} />
    </View>

      {/* Leave Dropdown */}
      <Text style={[styles.subLabel,{marginTop:15}]}>Leave Type</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Select leave type" value="" />
          <Picker.Item label="Sick Leave" value="sick" />
          <Picker.Item label="Casual Leave" value="casual" />
          <Picker.Item label="Earned Leave" value="earned" />
        </Picker>
      </View>
      {/* Date Picker */}
      <Text style={styles.subLabel}>Leave From Date</Text>
      <TouchableOpacity style={styles.inputWrapper} onPress={() => setFromDatePicker(true)}>
        <Text style={styles.placeholder}>
          {fromDate ? fromDate.toDateString() : "Select date"}
        </Text>
          <Feather name="calendar" size={20} color="#999" />
        </TouchableOpacity>
        {fromDatePicker && (
          <DateTimePicker
            value={fromDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedFromDate) => {
              setFromDatePicker(false);
              if (selectedFromDate) setFromDate(selectedFromDate);
            }}
          />
        )}
        {/* Date Picker */}
      <Text style={styles.subLabel}>Leave To Date</Text>
      <TouchableOpacity style={styles.inputWrapper} onPress={() => setToDatePicker(true)}>
        <Text style={styles.placeholder}>
          {toDate ? toDate.toDateString() : "Select date"}
        </Text>
          <Feather name="calendar" size={20} color="#999" />
        </TouchableOpacity>
        {selectedToDate && (
          <DateTimePicker
            value={toDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedToDate) => {
              setToDatePicker(false);
              if (selectedToDate) setToDate(selectedToDate);
            }}
          />
        )}
     

      {/* Reason */}
      <Text style={styles.subLabel}>Reason</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter reason"
        multiline
        numberOfLines={3}
        value={description}
        onChangeText={setDescription}
      />
      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Leave</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddLeaveScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#aaa",
    borderRadius: 8,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  uploadText: {
    color: "#555",
  },
  receiptImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
    inputWrapper: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 10 },
    placeholder: { fontSize: 14, color: "#777" },
    subLabel: { fontSize: 13, fontWeight: "500", marginTop: 10, marginBottom: 6 },
});
