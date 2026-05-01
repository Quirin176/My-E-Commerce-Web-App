import * as signalR from "@microsoft/signalr";

export const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://your-api.com/chatHub")
  .withAutomaticReconnect()
  .build();

connection.start().catch(err =>
  console.error("SignalR Connection Error:", err)
);