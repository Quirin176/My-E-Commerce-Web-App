export const siteConfig = {
  webName: "E-Commerce",

  API_URL: "http://localhost:5159/api",

  colors: {
    headerText: "white",
    headerBg: "royalblue",

    categoryTextColor: "white",
    categorylistHoverBg: "gray",

    navText: "white"
  },

  categories: [
    // { label: "Computer", link: "computer", image: "https://pcmarket.vn/media/product/10239_340784857_799984757660921_1932046047919300131_n.jpg" },
    { label: "Laptop", link: "laptop", image: "https://i.insider.com/6499818d65b9ce0018a4bb4e?width=1300&format=jpeg&auto=webp" },
    { label: "Monitor", link: "monitor", image: "https://i5.walmartimages.com/seo/24-Inch-Monitor-16-9-FHD-1080P-Thin-LED-Screen-Computer-75Hz-Refresh-Rate-HDMI-VGA-Audio-Built-in-Speaker-VESA-Compatible-Eye-Care_6d4aac19-7faa-4c86-8ade-f4552a9eff26.e155a44f6151d5b0854b8725d7221c8d.jpeg" },
    { label: "Keyboard", link: "keyboard", image: "https://m.media-amazon.com/images/I/71ZRus2YNcL._AC_UF894,1000_QL80_.jpg" },
    { label: "Mouse", link: "mouse", image: "https://cdn.tgdd.vn/Products/Images/86/252625/chuot-khong-day-rapoo-m216-den-1-1-750x500.jpg" }
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
