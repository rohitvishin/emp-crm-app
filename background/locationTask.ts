import { BASE_URL } from "@/src/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as TaskManager from "expo-task-manager";
export const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  console.log("inside backgroundscript");
  if (error) {
    console.error("TaskManager Error:", error);
    return;
  }

  if (data) {
    const { locations } = data as any;
    const [location] = locations;
    const token = await AsyncStorage.getItem("token");
    const visitId = await AsyncStorage.getItem("visitId");
    if (location) {
      console.log("📍 Background Location:", location.coords);
      console.log([
          {
            lat: location.coords.latitude,
            lng: location.coords.longitude
          }
        ]);
      //send to API
      await fetch(`${BASE_URL}/updateVisitRoute`, {
        method: "POST",
        headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}`, },
        body: JSON.stringify({
        visit_id: visitId,
        route: [
          {
            lat: location.coords.latitude,
            lng: location.coords.longitude
          }
        ]
      }),
      });
    }
  }
});
