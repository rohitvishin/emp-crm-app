import { BASE_URL } from "@/src/config";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const CLOUD_NAME = "dbxceuxef";
const UPLOAD_PRESET = "crm_app";

const AddExpenseScreen = () => {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
 
  const handleReceiptUpload = async () => {
    const mediaType =
    (ImagePicker as any).MediaType?.Image || ImagePicker.MediaTypeOptions.Images;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const originalUri = result.assets[0].uri;
      // 👇 Compress + resize before upload
      const manipulated = await ImageManipulator.manipulateAsync(
        originalUri,
        [{ resize: { width: 1000 } }],   // reduce long edge to 1000 px
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );
      setReceipt(manipulated.uri);
    }
  };

  const uploadToCloudinary = async (imageUri: string) => {
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
        console.log("Cloudinary upload result:", result);

        setUploading(false);

        if (result.secure_url) {
          console.log("✅ Cloudinary upload URL:", result.secure_url);
          return result.secure_url;
        } else {
          console.error("❌ Cloudinary error:", result);
          throw new Error(result.error?.message || "Upload failed");
        }
      } catch (error) {
        setUploading(false);
        console.error("Cloudinary upload error:", error);
        Alert.alert("Error", "Failed to upload receipt. Please try again.");
        return null;
      }
  };

  const handleSubmit = async () => {
    // disable handleSubmit button


    if (!category || !amount || !description) {
      Alert.alert("Validation Error", "Please fill all required fields.");
      return;
    }

    let receiptUrl = null;
    if (receipt) {
      receiptUrl = await uploadToCloudinary(receipt);
      if (!receiptUrl) return; // stop if upload failed
    }
    const token=await AsyncStorage.getItem('token');
    const payload={
      category:category,
      amount:amount,
      description:description,
      receipt: receiptUrl || "",
    }
    console.log("Submitting expense:", payload);
    // handle API call here
    const response=await fetch(`${BASE_URL}/add-expenses`,{
        method:'POST',
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`,
        },
        body:JSON.stringify(payload)
    });
    const data = await response.json();
    if (response.ok) {
      Alert.alert("Success", "Expense added successfully!", [
        { text: "OK", onPress: () => router.push("/list-expense") },
      ]);
    } else {
      Alert.alert("Error", data.message || "Failed to add expense.");
    }
        
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <View style={{ width: 24 }} />
       </View>

      {/* Category Dropdown */}
      <Text style={[styles.label,{marginTop:15}]}>Category</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Select category" value="" />
          <Picker.Item label="Travel" value="travel" />
          <Picker.Item label="Food" value="food" />
          <Picker.Item label="Supplies" value="supplies" />
        </Picker>
      </View>

      {/* Amount */}
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter description"
        multiline
        numberOfLines={3}
        value={description}
        onChangeText={setDescription}
      />

      {/* Receipt */}
      <Text style={styles.label}>Receipt (optional)</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={handleReceiptUpload}>
        {receipt ? (
          <Image source={{ uri: receipt }} style={styles.receiptImage} />
        ) : (
          <Text style={styles.uploadText}>📷 Take Photo or Upload</Text>
        )}
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={uploading}>
        <Text style={styles.submitText}>{uploading ? "Uploading..." : "Submit Expense"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddExpenseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
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
});
