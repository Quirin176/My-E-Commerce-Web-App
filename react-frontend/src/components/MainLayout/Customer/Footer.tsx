import { siteConfig } from "../../../config/siteConfig";

export default function Footer() {
  return (
    <footer
    className="flex items-center shadow-md py-6 text-center text-white font-bold"
    style={{backgroundColor: siteConfig.colors.primarycolor}}
    >
      © {new Date().getFullYear()} E-Commerce Shop
    </footer>
  );
};
