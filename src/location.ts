import * as Location from "expo-location";
import { LOCATION_TASK_NAME } from "../background/locationTask";

export async function startLocationTracking() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.error("Permission to access location was denied");
    return;
  }

  const bgStatus = await Location.requestBackgroundPermissionsAsync();
  if (bgStatus.status !== "granted") {
    console.error("Background permission denied");
    return;
  }

  const isRegistered = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

  if (!isRegistered) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 60000, // every 1 minute
      distanceInterval: 50, // or every 50 meters
      showsBackgroundLocationIndicator: true, // iOS
      foregroundService: {
        notificationTitle: "Tracking Location",
        notificationBody: "We are tracking your location in background",
      },
    });
    console.log("✅ Location tracking started");
  }
}

export async function stopLocationTracking() {
  const isRegistered = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isRegistered) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    console.log("🛑 Location tracking stopped");
  }
}
