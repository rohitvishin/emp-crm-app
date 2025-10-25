import { BASE_URL } from "@/src/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as TaskManager from "expo-task-manager";
export const LOCATION_TASK_NAME = "background-location-task";

let currentToken: string | null = null;
let currentVisitId: string | null = null;

export function setCurrentToken(token: string) {
  currentToken = token;
}

export function setCurrentVisitId(visitId: string) {
  currentVisitId = visitId;
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  const token = await AsyncStorage.getItem("token");
  const visitId = await AsyncStorage.getItem("visitId");
  if (token || visitId) {
    setCurrentToken(token!);
    setCurrentVisitId(visitId!);
  }
  
  if (error) {
    console.error("TaskManager Error:", error);
    return;
  }

  if (!data) return;
  const { locations } = data as any;
  const [location] = locations;
  if (!location) return;

  try {
    if (!currentToken || !currentVisitId) {
      console.log("⚠️ Missing token or visit ID, skipping route update");
      return;
    }
    const payload = {
      visit_id: currentVisitId,
      route: [
        {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
      ],
    };

    // ✅ Use Promise.race with timeout to prevent hanging
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${BASE_URL}/updateVisitRoute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.log("❌ Failed to update route:", res.status);
    } else {
      console.log("✅ Route updated in background");
    }
  } catch (err) {
    console.log("⚠️ Background API error:", err);
  }
});
