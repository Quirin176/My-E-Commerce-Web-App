import { Laptop, Monitor, Keyboard, Mouse } from "lucide-react";

// export const API_URL = import.meta.env.VITE_API_URL;
export const API_URL = "http://localhost:5159/api";

export const siteConfig = {
  webName: "E-Commerce",

  colors: {
    primarycolor: "#4169E1",
    pricecolor: "red",
    backgroundcolor: "GhostWhite",
  },

  // Order's Status Options
  ORDER_STATUS_OPTIONS: [
    { value: "all", label: "All", color: "black" },
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "confirmed", label: "Confirmed", color: "blue" },
    // { value: "processing", label: "Processing", color: "purple" },
    { value: "shipped", label: "Shipped", color: "purple" },
    { value: "delivered", label: "Delivered", color: "green" },
    { value: "cancelled", label: "Cancelled", color: "red" },
    { value: "refunded", label: "Refunded", color: "gray" },
  ],
};

export const categoriesIcon: Record<string, React.ElementType> = {
  laptop: Laptop,
  monitor: Monitor,
  keyboard: Keyboard,
  mouse: Mouse
};
