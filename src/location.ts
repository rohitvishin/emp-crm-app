import * as Location from "expo-location";
import * as Notifications from 'expo-notifications';
import { Alert } from "react-native";
import { LOCATION_TASK_NAME } from "../background/locationTask";

export async function startLocationTracking() {
  try {
    let { status: notifStatus } = await Notifications.requestPermissionsAsync();
    if (notifStatus != 'granted') {
      Alert.alert("Permission required", "Please allow notification to continue.");
      return;
    }
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
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);   
      console.log("closing active background update");
    }

    // 3️⃣ Start updates
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Low,
      timeInterval: 30000, // 30 seconds
      distanceInterval: 10, // 10 m
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