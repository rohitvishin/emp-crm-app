import { Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    console.log("Logging in with:");
    // Normally validate credentials here
    router.replace("/home"); // Navigate to Home
  };

  return (
    <SafeAreaView style={styles.container}>
      <View></View>
      
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.logoWrapper}
        >
          <MaterialIcons name="login" size={40} color="white" />         
        </LinearGradient>
        
     
      <Text style={styles.welcome}>Welcome Back</Text>
      <Text style={styles.subText}>Sign in to your employee account</Text>

      <View style={styles.formBox}>
        <Text style={styles.formTitle}>Sign In</Text>
        <Text style={styles.formSubtitle}>Enter your credentials to access your account</Text>

        <Text style={styles.label}>Email</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="email" size={20} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="lock" size={20} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#999" />
          </TouchableOpacity>
        </View>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={{
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        </LinearGradient>
        

        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 20 },
  logoWrapper: { width: 70, height: 70, borderRadius: 35, justifyContent: "center", alignItems: "center", marginBottom: 15 },
  welcome: { fontSize: 20, fontWeight: "700", marginBottom: 5 },
  subText: { fontSize: 14, color: "#777", marginBottom: 20 },
  formBox: { width: "100%", backgroundColor: "#f9f9f9", padding: 20, borderRadius: 10 },
  formTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  formSubtitle: { fontSize: 13, color: "#777", marginBottom: 15 },
  label: { fontSize: 13, fontWeight: "500", marginBottom: 6 },
  inputWrapper: { flexDirection: "row", alignItems: "center", borderColor: "#ddd", borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, backgroundColor: "#fff" },
  icon: { marginRight: 8 },
  input: { flex: 1, height: 45 },
  button: {borderRadius: 8, alignItems: "center", width: "100%"},
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  forgot: { fontSize: 13, color: "#4A57FF", textAlign: "center", marginTop: 10 },
});
