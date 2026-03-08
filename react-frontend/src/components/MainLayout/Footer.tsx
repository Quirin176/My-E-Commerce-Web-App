import { siteConfig } from "../../config/siteConfig";

export default function Footer() {
  return (
    <footer
    className="py-4 text-center text-white font-bold"
    style={{backgroundColor: siteConfig.colors.primarycolor}}
    >
      © {new Date().getFullYear()} E-Commerce Shop
    </footer>
  );
};
