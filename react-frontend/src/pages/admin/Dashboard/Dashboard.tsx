import { useAuth } from "../../../hooks/auth/useAuth";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center w-full gap-4">
        <h1 className="text-3xl font-bold">Welcome back, {user?.username}!</h1>
        <p> Here is how your store is doing today.</p>
    </div>
  );
};
