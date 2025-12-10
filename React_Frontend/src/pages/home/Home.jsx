import {siteConfig} from "../../config/siteConfig";
import CategoryTabs from "../../components/CategoryTabs";

const Home = () => {
  const categories = siteConfig.categories;

  return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", }}>
    {/* MAIN HEADER */}
    <h1 style={{ fontSize: 40, color: siteConfig.colors.headerBg, fontWeight: "bold", marginBottom: 10, textAlign: "center", letterSpacing: 2, }}>Welcome to My Store</h1>

    {/* UNDERLINE */}
    <div style={{ width: 120, height: 5, borderRadius: 5, background: `linear-gradient(90deg, ${siteConfig.colors.headerBg}, #777)`, marginBottom: 25, }}></div>

    {/* INTRO PARAGRAPH */}
    <p style={{ fontSize: 24, color: "#444", maxWidth: "700px", textAlign: "center", marginBottom: 40, lineHeight: 1.5, }}>
      Explore a wide range of high-quality products, carefully organized into categories
      to help you quickly find what you’re looking for.
    </p>

    {/* CATEGORIES HEADER */}
    <h2 style={{ fontSize: 40, color: siteConfig.colors.headerBg, fontWeight: "bold", marginBottom: 20, textAlign: "center", }}>Explore Shop's Products</h2>

    <CategoryTabs products={categories} />
  </div>
  );
};

export default Home;
