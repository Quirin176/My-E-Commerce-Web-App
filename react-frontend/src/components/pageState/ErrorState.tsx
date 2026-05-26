import { Link } from "react-router-dom";

interface ErrorStateProps {
  title?: string;
  message?: string;
  retry?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  retry,
}: ErrorStateProps) {
  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-2">{title}</h1>
      <p className="text-gray-600 mb-6">{message}</p>

      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      )}

      <div className="mt-4">
        <Link to="/" className="text-blue-500 underline">
          Go Home
        </Link>
      </div>
    </div>
  );
}