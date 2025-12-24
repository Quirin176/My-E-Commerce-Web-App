import { siteConfig } from "../../config/siteConfig";

const Home = () => {
  const colors = siteConfig.colors;

  return (
  <div className="flex flex-col items-center">

    {/* WARNING */}
    <h2 className="text-4xl font-bold mb-10 text-center" style={{ color: colors.primarycolor }}>
      ⚠️ This is a demo store for testing purposes only.
      <br/>
      No real orders will be processed. ⚠️
    </h2>

    {/* MAIN HEADER */}
    <h2 className="text-4xl font-bold mb-10 text-center" style={{ color: colors.primarycolor }}>Welcome to My Store</h2>

    {/* UNDERLINE */}
    <div className="w-2xl h-1 mb-10" style={{ borderRadius: 5, background: `linear-gradient(90deg, ${colors.primarycolor}, #ffff00)`, }}></div>

    {/* INTRO PARAGRAPH */}
    <p className="text-2xl text-black max-w-4xl text-center mb-10">
      Explore a wide range of high-quality products
      <br/>
      Carefully organized into categories to help you quickly find what you’re looking for
    </p>

    {/* CATEGORIES HEADER */}
    <h3 className="text-4xl font-bold mb-10 text-center" style={{ color: colors.primarycolor }}>Explore Shop's Products</h3>
  </div>
  );
};

export default Home;
