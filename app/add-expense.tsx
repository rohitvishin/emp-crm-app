import { BASE_URL } from "@/src/config";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
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

const AddExpenseScreen = () => {
    const router = useRouter();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [receipt, setReceipt] = useState<any>(null);

  const handleReceiptUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri);
      setReceipt(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const token=await AsyncStorage.getItem('token');
    const payload={
      category:category,
      amount:amount,
      description:description,
      receipt:'receipt',
    }
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
      <Text style={styles.label}>Receipt</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={handleReceiptUpload}>
        {receipt ? (
          <Image source={{ uri: receipt }} style={styles.receiptImage} />
        ) : (
          <Text style={styles.uploadText}>📷 Take Photo or Upload</Text>
        )}
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Expense</Text>
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
