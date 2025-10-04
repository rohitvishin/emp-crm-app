import * as Location from "expo-location";
import { Alert } from "react-native";
import { LOCATION_TASK_NAME } from "../background/locationTask";

export async function startLocationTracking() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission to access location was denied");
    return;
  }

  const servicesEnabled = await Location.hasServicesEnabledAsync();
  if (!servicesEnabled) {
    // show custom popup
    Alert.alert(
      "Location Required",
      "Please enable location services (GPS) in your settings."
    );
  }

  const bgStatus = await Location.requestBackgroundPermissionsAsync();
  if (bgStatus.status !== "granted") {
    Alert.alert("Background permission denied");
    return;
  }
  
  const isRegistered = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

  if (!isRegistered) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 60000, // every 1 minute
      distanceInterval: 50, // or every 50 meters
      // showsBackgroundLocationIndicator: true, // iOS
      foregroundService: {
        notificationTitle: "Tracking Location",
        notificationBody: "We are tracking your location in background",
      },
    });
    console.log("✅ Location tracking started");
  }else{
    Alert.alert("location tracking disabled");
  }
}

export async function stopLocationTracking() {
  const isRegistered = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isRegistered) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    console.log("🛑 Location tracking stopped");
  }
}
