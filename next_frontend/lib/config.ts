import { Laptop, Monitor, Keyboard, Mouse } from "lucide-react";

export const siteConfig = {
  webName: "E-Commerce",

  API_URL: "http://localhost:5159/api",

  colors: {
    primarycolor: "dodgerblue",
  },

  categories: [
    // { label: "Computer", link: "computer", image: "https://pcmarket.vn/media/product/10239_340784857_799984757660921_1932046047919300131_n.jpg" },
    { label: "Laptop", link: "laptop", icon: Laptop },
    { label: "Monitor", link: "monitor", icon: Monitor },
    { label: "Keyboard", link: "keyboard", icon: Keyboard },
    { label: "Mouse", link: "mouse", icon: Mouse }
  ],

  // usermenuItems: [
  //   { "label": "Customer Service", "link": "/customer-service" },
  //   { "label": "Cart", "link": "/cart" }
  // ],

  adminmenuItems: [
    { "label": "Manage Products", "link": "/admin/products" },
    { "label": "User Management", "link": "/admin/users" }
  ],
}
