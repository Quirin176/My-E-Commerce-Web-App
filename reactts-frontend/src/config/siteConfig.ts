import { Laptop, Monitor, Keyboard, Mouse } from "lucide-react";

// export const API_URL = import.meta.env.VITE_API_URL;
export const API_URL = "http://localhost:5159/api";

export const siteConfig = {
  webName: "E-Commerce",


  colors: {
    primarycolor: "black",
    pricecolor: "red",
  },

  categories: [
    { id: 1, name: "Laptop", slug: "laptop", icon: Laptop },
    { id: 2, name: "Monitor", slug: "monitor", icon: Monitor },
    { id: 3, name: "Keyboard", slug: "keyboard", icon: Keyboard },
    { id: 4, name: "Mouse", slug: "mouse", icon: Mouse }
  ],

  // usermenuItems: [
  //   { "label": "Customer Service", "link": "/customer-service" },
  //   { "label": "Cart", "link": "/cart" }
  // ],

  adminmenuItems: [
    { "label": "Manage Products", "link": "/admin/products" },
    { "label": "User Management", "link": "/admin/users" }
  ],

      // Order's Status Options
    ORDER_STATUS_OPTIONS: [
        { value: "all", label: "All", color: "black" },
        { value: "pending", label: "Pending", color: "yellow" },
        { value: "confirmed", label: "Confirmed", color: "blue" },
        { value: "processing", label: "Processing", color: "purple" },
        { value: "shipping", label: "Shipping", color: "purple" },
        { value: "delivered", label: "Delivered", color: "green" },
        { value: "cancelled", label: "Cancelled", color: "red" },
        { value: "refunded", label: "Refunded", color: "gray" },
    ],

}
