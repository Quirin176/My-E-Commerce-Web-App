import * as signalR from "@microsoft/signalr";
import { API_URL } from "../../config/siteConfig";

// Singleton — created once, shared across the app
const HUB_URL = API_URL.replace("/api", "") + "/chatHub";

export const connection = new signalR.HubConnectionBuilder()
  .withUrl(HUB_URL, {
    // Cookies are sent automatically with withCredentials — no manual token needed
    withCredentials: true,
  })
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Warning)
  .build();

let startPromise: Promise<void> | null = null;

// Call this once before using the connection — safe to call multiple times
export async function ensureConnected() {
  if (connection.state === signalR.HubConnectionState.Connected) return;
  if (!startPromise) {
    startPromise = connection.start().catch((err) => {
      startPromise = null;
      console.error("SignalR connection failed:", err);
      throw err;
    });
  }
  return startPromise;
}