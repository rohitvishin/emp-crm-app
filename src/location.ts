import * as Location from "expo-location";
import { Alert } from "react-native";
import { LOCATION_TASK_NAME } from "../background/locationTask";

export async function startLocationTracking() {
  try {
    // 1️⃣ Make sure permissions are granted
    const { status: fg } = await Location.requestForegroundPermissionsAsync();
    if (fg !== "granted") {
      Alert.alert("Location permission not granted");
      return;
    }

    const { status: bg } = await Location.requestBackgroundPermissionsAsync();
    if (bg !== "granted") {
      Alert.alert("Background location denied");
      return;
    }

    // 2️⃣ Check if already running
    const alreadyRunning = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );

    if (alreadyRunning) {
      console.log("✅ Background location already running");
      return;
    }

    // 3️⃣ Start updates
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Low,
      timeInterval: 120000, // 1 minute
      distanceInterval: 100, // 50 m
      pausesUpdatesAutomatically: false,
      foregroundService: {
        notificationTitle: "Tracking Location",
        notificationBody: "Updating your location in the background",
      },
      mayShowUserSettingsDialog: true,
    });

    console.log("✅ Location tracking started");
  } catch (err) {
    console.error("❌ startLocationTracking error:", err);
    Alert.alert("Error", String(err));
  }
}
export async function stopLocationTracking() {
  const isRegistered = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isRegistered) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    console.log("🛑 Location tracking stopped");
  }
}
