import { siteConfig } from "../../../config/siteConfig";

export default function WelcomePanel() {
  const colors = siteConfig.colors;

  return (
    <div className="h-full flex items-center justify-center rounded-2xl">
      <div className="text-center">
        <h2
          className="text-4xl font-bold"
          style={{ color: colors.primarycolor }}
        >
          Welcome to My Store
        </h2>
        <p className="text-gray-600 mt-4 text-2xl">
          Explore a wide range of products
        </p>
      </div>
    </div>
  );
}