import { Feather, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportVisitScreen() {
  const router = useRouter();

  const [rating, setRating] = useState<string>("Good");
  const [person, setPerson] = useState<string>("");
  const [nextAction, setNextAction] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [nextDate, setNextDate] = useState<Date | null>(new Date());
  const [nextTime, setNextTime] = useState<Date | null>(new Date());

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const ratingOptions = [
    { key: "Poor", label: "Poor", icon: "frown" },
    { key: "Fair", label: "Fair", icon: "meh" },
    { key: "Good", label: "Good", icon: "smile" },
    { key: "Great", label: "Great", icon: "thumbs-up" },
    { key: "Excellent", label: "Excellent", icon: "star" },
  ];

  function onDateChange(_: any, selected?: Date | undefined) {
    setShowDatePicker(false);
    if (selected) setNextDate(selected);
  }

  function onTimeChange(_: any, selected?: Date | undefined) {
    setShowTimePicker(false);
    if (selected) setNextTime(selected);
  }

  function handleSubmit() {
    const payload = {
      rating,
      person,
      nextAction,
      nextDate: nextDate ? nextDate.toISOString() : null,
      nextTime: nextTime ? nextTime.toISOString() : null,
      notes,
    };
    console.log("Report payload:", payload);

    // TODO: send to backend here
    // After submit redirect to home (or wherever)
    router.replace("/home");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Feather name="arrow-left" size={20} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Visit Report</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* How was the visit */}
          <Text style={styles.label}>How was the visit?</Text>
          <View style={styles.ratingsRow}>
            {ratingOptions.map((opt) => {
              const selected = rating === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.ratingBtn, selected && styles.ratingBtnSelected]}
                  onPress={() => setRating(opt.key)}
                  activeOpacity={0.8}
                >
                  <Feather
                    name={opt.icon as any}
                    size={18}
                    color={selected ? "#fff" : "#666"}
                  />
                  <Text style={[styles.ratingLabel, selected && styles.ratingLabelSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Met with */}
          <Text style={styles.label}>Met with?</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter person name"
              placeholderTextColor="#888"
              value={person}
              onChangeText={setPerson}
            />
            <Ionicons name="person-outline" size={20} color="#666" />
          </View>

          {/* Next action */}
          <Text style={styles.label}>What's the next action?</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Describe the next action required..."
            placeholderTextColor="#888"
            multiline
            value={nextAction}
            onChangeText={setNextAction}
          />

          {/* Next action date */}
          <Text style={styles.label}>Next action date?</Text>
          <TouchableOpacity
            style={styles.inputRow}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.inputText}>
              {nextDate ? nextDate.toLocaleDateString() : "Select date"}
            </Text>
            <Feather name="calendar" size={18} color="#666" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={nextDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
            />
          )}

          {/* Next action time */}
          <Text style={styles.label}>Next action time?</Text>
          <TouchableOpacity
            style={styles.inputRow}
            onPress={() => setShowTimePicker(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.inputText}>
              {nextTime
                ? nextTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "Select time"}
            </Text>
            <Feather name="clock" size={18} color="#666" />
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={nextTime || new Date()}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              is24Hour={false}
              onChange={onTimeChange}
            />
          )}

          {/* Additional notes */}
          <Text style={styles.label}>Additional Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Any additional comments or observations..."
            placeholderTextColor="#888"
            multiline
            value={notes}
            onChangeText={setNotes}
          />

          {/* Submit */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.9}>
            <Feather name="send" size={16} color="#fff" />
            <Text style={styles.submitText}> Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Styles */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f3f4f6" },
  container: {
    padding: 20,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },

  label: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 8,
    marginTop: 8,
    fontWeight: "500",
  },

  ratingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  ratingBtn: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E6E9EE",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  ratingBtnSelected: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  ratingLabel: {
    marginTop: 6,
    fontSize: 12,
    color: "#374151",
  },
  ratingLabelSelected: {
    color: "#fff",
    fontWeight: "600",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6E9EE",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E6E9EE",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
    backgroundColor: "#fff",
    color: "#111827",
  },
  inputText: {
    fontSize: 14,
    color: "#111827",
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },

  submitBtn: {
    marginTop: 12,
    backgroundColor: "#0f172a",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
