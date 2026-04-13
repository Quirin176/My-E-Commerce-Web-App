import { useEffect, useState } from "react";
import { adminUsersApi } from "../../../api/admin/adminUsersApi";
import type { User } from "../../../types/models/auth/User";
import { useAuth } from "../../../hooks/users/useAuth";
import toast from "react-hot-toast";
import AdminUserCard from "../../../components/Admin/Users/AdminUserCard";

export default function AdminUsers() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        if (user !== null && user.role !== "Admin") return;

        try {
            const usersData = await adminUsersApi.getAllProfile();
            setUsers(usersData);
        } catch (error) {
            toast.error("Failed to load product details");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <div>
            {/* LOADING OVERLAY */}
            {loading && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                    <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
                        <p className="font-semibold text-black">Loading...</p>
                    </div>
                </div>
            )}

            <div>
                <h1 className="text-2xl font-bold pb-6">
                    Admin Users Management
                </h1>
                <div className="flex flex-col gap-y-4">
                    {users.map((u) => (
                        <AdminUserCard key={u.id} user={u} />
                    ))}
                </div>
            </div>
        </div>
    );
}