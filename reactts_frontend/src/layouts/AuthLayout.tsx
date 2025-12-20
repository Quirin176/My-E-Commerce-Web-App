import { Outlet, Link } from "react-router-dom";
export default function AuthLayout(){
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <div className="text-center mb-4">
          <Link to="/" className="font-semibold text-2xl">MyApp</Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
