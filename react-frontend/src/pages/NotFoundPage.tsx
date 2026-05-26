import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-gray-600 mb-6">The page you were looking for doesn’t exist.</p>

      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}