import {siteConfig} from "../../config/siteConfig";
import CategoryTabs from "../../components/CategoryTabs";

export default function Home() {
  const categories = siteConfig.categories;
  const colors = siteConfig.colors;

  return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", }}>

    {/* WARNING */}
    <h2 style={{ fontSize: 40, color: colors.primarycolor, fontWeight: "bold", marginBottom: 10, textAlign: "center", }}>
      ⚠️ This is a demo store for testing purposes only.
      <br/>
      No real orders will be processed. ⚠️
    </h2>

    {/* MAIN HEADER */}
    <h2 style={{ fontSize: 40, color: colors.primarycolor, fontWeight: "bold", marginBottom: 10, textAlign: "center", }}>Welcome to My Store</h2>

    {/* UNDERLINE */}
    <div style={{ width: 600, height: 5, borderRadius: 5, background: `linear-gradient(90deg, ${colors.primarycolor}, #ffff00)`, marginBottom: 25, }}></div>

    {/* INTRO PARAGRAPH */}
    <p style={{ fontSize: 24, color: "Black", maxWidth: "700px", textAlign: "center", marginBottom: 40, lineHeight: 1.5, }}>
      Explore a wide range of high-quality products, carefully organized into categories
      to help you quickly find what you’re looking for.
    </p>

    {/* CATEGORIES HEADER */}
    <h3 style={{ fontSize: 40, color: colors.primarycolor, fontWeight: "bold", marginBottom: 20, textAlign: "center", }}>Explore Shop's Products</h3>

    <CategoryTabs products={categories} />
  </div>
  );
};
