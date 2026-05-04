import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./context/AuthProvider";
// import { CartProvider } from "./context/CartProvider";
import { ThemeProvider } from "./context/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        {/* <AuthProvider>
        <CartProvider> */}
        <App />
        {/* </CartProvider>
      </AuthProvider> */}
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
