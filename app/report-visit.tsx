import { BASE_URL } from "@/src/config";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import ImageView from "react-native-image-viewing";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { CLOUD_NAME, UPLOAD_PRESET } from "../src/config";

export default function ReportVisitScreen() {
  const router = useRouter();
  const [outcome, setOutcome] = useState("");
  const [rating, setRating] = useState<string>("Good");
  const [notes, setNotes] = useState<string>("");
  const [receipt, setReceipt] = useState<any>(null);
  const [newFile, setNewFile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [nextDate, setNextDate] = useState<Date | null>(new Date());
  const [nextTime, setNextTime] = useState<Date | null>(new Date());

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [visible, setIsVisible] = useState<boolean>(false);

  const visit = useSelector((state: RootState) => state.visit.selectedVisit)
  useEffect(() => {
    checkIfAlreadyReported();
  }, []);
  const checkIfAlreadyReported = async () => {
    console.log(visit.id);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/visit-detail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ visit_id: visit.id })
      });

      const data = await response.json();
      if (response.ok && data.visit.report_submitted_at) {
        setIsEdit(true);
        setOutcome(data.visit.outcome);
        setRating(data.visit.rating);
        setNotes(data.visit.report_notes);
        if (data.visit.next_visit_date) {
          setNextDate(new Date(data.visit.next_visit_date));
        }
        if (data.visit.attachment) {
          setReceipt(data.visit.attachment);
        }
      }
    }
    catch (error) {
      console.log("Error fetching visit details:", error);
    }

  }

  const ratingOptions = [
    { key: "Poor", label: "Poor", icon: "frown" },
    { key: "Fair", label: "Fair", icon: "meh" },
    { key: "Good", label: "Good", icon: "smile" },
    { key: "Great", label: "Great", icon: "thumbs-up" },
    { key: "Excellent", label: "Excellent", icon: "star" },
  ];
  const handleReceiptUpload = async () => {
    const mediaType =
      (ImagePicker as any).MediaType?.Image || ImagePicker.MediaTypeOptions.Images;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType,
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      const originalUri = result.assets[0].uri;
      // 👇 Compress + resize before upload
      const manipulated = await ImageManipulator.manipulateAsync(
        originalUri,
        [{ resize: { width: 750 } }],   // reduce long edge to 1000 px
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );
      setReceipt(manipulated.uri);
      setNewFile(true);
    }
  };

  function onDateChange(_: any, selected?: Date | undefined) {
    setShowDatePicker(false);
    if (selected) setNextDate(selected);
  }

  function onTimeChange(_: any, selected?: Date | undefined) {
    setShowTimePicker(false);
    if (selected) setNextTime(selected);
  }
  const uploadToCloudinary = async (imageUri: string) => {
    console.log("Uploading to Cloudinary:", imageUri);
    try {
      setUploading(true);

      const data = new FormData();
      data.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: `receipt_${Date.now()}.jpg`,
      } as any);
      data.append("upload_preset", UPLOAD_PRESET);
      data.append("cloud_name", CLOUD_NAME); // ✅ Important for unsigned uploads
      data.append("folder", "employee_app_receipts"); // optional

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
          headers: {
            "Accept": "application/json", // speeds up parsing
          },
        }
      );

      const result = await response.json();

      setUploading(false);

      if (result.secure_url) {
        return result.secure_url;
      } else {
        throw new Error(result.error?.message || "Upload failed");
      }
    } catch (error) {
      setUploading(false);
      Alert.alert("Error", "Failed to upload receipt. Please try again.");
      return null;
    }
  };
  const handleSubmit = async () => {
    const visit_Id = visit.id;
    if (!rating) {
      Alert.alert("Validation Error", "Please select a rating.");
      return;
    }
    if (!outcome) {
      Alert.alert("Validation Error", "Please select an outcome.");
      return;
    }
    if (!nextDate) {
      Alert.alert("Validation Error", "Please select the next visit date.");
      return;
    }
    if (!visit_Id) {
      Alert.alert("Validation Error", "Visit ID is missing.");
      return;
    }
    let receiptUrl = null;
    if (receipt && newFile) {
      receiptUrl = await uploadToCloudinary(receipt);
      if (!receiptUrl) return; // stop if upload failed
    }else if (!newFile && isEdit) {
      receiptUrl = receipt; // retain existing URL if not changed
    }
    const token = await AsyncStorage.getItem('token');
    const payload = {
      visit_id: visit_Id,
      rating: rating,
      outcome: outcome,
      report_notes: notes,
      next_visit_date: nextDate ? nextDate.toISOString().split("T")[0] : null,
      attachment: receiptUrl || "",
    };
    const response = await fetch(`${BASE_URL}/visit-report`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (response.ok) {
      Alert.alert("Success", "Report updated successfully!", [
        { text: "OK", onPress: () => router.push("/field-visits") },
      ]);
    } else {
      Alert.alert("Error", data.message || "Failed to add expense.");
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={"height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0} // adjust if you have a header
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <Feather name="arrow-left" size={20} color="#111" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{isEdit ? 'Edit Visit' : 'Visit Report'}</Text>
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
            {/* <Text style={styles.label}>Met with?</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter person name"
              placeholderTextColor="#888"
              value={person}
              onChangeText={setPerson}
            />
            <Ionicons name="person-outline" size={20} color="#666" />
          </View> */}

            {/* Next action */}
            <Text style={[styles.label, { marginTop: 15 }]}>Outcome</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={outcome}
                onValueChange={(itemValue) => setOutcome(itemValue)}
              >
                <Picker.Item label="Select outcome" value="" />
                <Picker.Item label="success" value="success" />
                <Picker.Item label="failed" value="failed" />
              </Picker>
            </View>

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
            {/* <Text style={styles.label}>Next action time?</Text>
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
          </TouchableOpacity> */}

            {/* {showTimePicker && (
            <DateTimePicker
              value={nextTime || new Date()}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              is24Hour={false}
              onChange={onTimeChange}
            />
          )} */}

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
            <Text style={styles.label}>Attachment (optional)</Text>
            <View style={styles.profileSection}>
              <View style={styles.profileImageWrapper}>
                {
                  visible ? (
                    <ImageView
                      images={[{ uri: receipt }]}
                      imageIndex={0}
                      onRequestClose={() => setIsVisible(false)}
                      visible={visible}
                      backgroundColor="black"
                    />
                  ) : <TouchableOpacity onPress={() => { setIsVisible(true) }}>
                    <Image
                      source={{ uri: receipt }}
                      style={styles.profileImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                }

                <TouchableOpacity onPress={handleReceiptUpload} style={styles.cameraIcon}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, uploading && { opacity: 0.6 }]}
              onPress={() => {
                if (!uploading) handleSubmit();
              }}
              activeOpacity={0.9}
              disabled={uploading} // prevent press during upload
            >
              <Text style={styles.submitText}>
                {uploading ? "Uploading..." : isEdit ? "Update Report" : "Submit Report"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* Styles */
const styles = StyleSheet.create({
  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#aaa",
    borderRadius: 8,
    height: 60,
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
  pickerBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 150,
    height: 80,
    backgroundColor: "#f0f0f0",
  },
  profileImageWrapper: {
    position: "relative",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#333",
    borderRadius: 20,
    padding: 6,
  },
});
