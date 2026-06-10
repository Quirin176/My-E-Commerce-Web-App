export default function WelcomePanel() {

  return (
    <div className="h-full flex items-center justify-center rounded-2xl">
      <div className="text-center">
        <h2 className="text-(--brand-primary) text-4xl font-bold">
          Welcome to My Store
        </h2>
        <p className="text-gray-600 mt-4 text-2xl">
          Explore a wide range of products
        </p>
      </div>
    </div>
  );
}