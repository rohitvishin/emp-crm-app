import * as IntentLauncher from "expo-intent-launcher";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { LOCATION_TASK_NAME } from "../background/locationTask";

export async function ensureBackgroundTracking(){
  try {
    // Check if location updates are already running
    const isRegistered = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

    if (!isRegistered) {
      console.log("📍 Restarting background tracking...");
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 60000, // 1 minute
          distanceInterval: 50, // 50 m
          pausesUpdatesAutomatically: false,
          foregroundService: {
            notificationTitle: "Tracking Location",
            notificationBody: "Updating your location in the background",
          },
          mayShowUserSettingsDialog: true,
      });
      console.log("✅ Background tracking resumed");
    } else {
      console.log("📍 Background tracking already active");
    }
  } catch (error) {
    console.error("⚠️ Error ensuring background tracking:", error);
  }
};
export async function startLocationTracking() {
  try {
    // 1️⃣ Make sure permissions are granted
    const fg = await Location.requestForegroundPermissionsAsync();
    if (fg.status !== "granted") {
      Alert.alert("Permission required", "Please allow location access to continue.");
      return;
    }

    const { status: bg } = await Location.requestBackgroundPermissionsAsync();
    if (bg !== "granted") {
      Alert.alert(
        "Background Access Needed",
        "Please allow background location in settings for continuous tracking."
      );
      return;
    }
      try {
        const pkg = "com.rohitvish.employeeapp";
        await IntentLauncher.startActivityAsync(
          IntentLauncher.ActivityAction.IGNORE_BATTERY_OPTIMIZATION_SETTINGS,
          { data: `package:${pkg}` }
        );
        console.log("✅ Prompted user to disable battery optimization");
      } catch (e) {
        console.log("Battery optimization settings not available:", e);
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
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 60000, // 1 minute
      distanceInterval: 50, // 50 m
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
