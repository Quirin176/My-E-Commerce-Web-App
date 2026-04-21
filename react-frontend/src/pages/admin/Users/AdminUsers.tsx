import { useCallback, useEffect, useState } from "react";
import { adminUsersApi } from "../../../api/admin/adminUsersApi";
import type { User } from "../../../types/models/auth/User";
import { useAuth } from "../../../hooks/auth/useAuth";
import toast from "react-hot-toast";
import AdminUserCard from "../../../components/Admin/Users/AdminUserCard";

const ROLE = [
    { Id: 1, Role: "Admin" },
    { Id: 2, Role: "Customer" }
]

export default function AdminUsers() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [selectedRole, setSelectedRole] = useState<string>("Admin")
    const [sortBy, setSortBy] = useState<string>("Id");

    const fetchData = useCallback(async () => {
        if (user !== null && user.role !== "Admin") return;

        try {
            setLoading(true);
            const usersData = await adminUsersApi.getProfilesByRole(selectedRole);
            setUsers(usersData);
        } catch (error) {
            toast.error("Failed to load product details");
        } finally {
            setLoading(false);
        }
    }, [selectedRole, sortBy])

    useEffect(() => {
        fetchData()
    }, [fetchData]);

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

            <div className="flex flex-col gap-y-6">
                <h1 className="text-2xl font-bold">
                    Admin Users Management
                </h1>

                <div className="flex flex-row items-center justify-between">
                    <div className="flex gap-4">
                        {ROLE.map((role, index) => {
                            const isActive = role.Role == selectedRole;
                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedRole(role.Role)}
                                    className={`text-lg border-2 px-2 w-32 rounded-full cursor-pointer transition
                                        ${isActive
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "text-blue-600 bg-white hover:bg-blue-600 hover:text-white border-blue-600"
                                        }`}
                                >
                                    {role.Role}
                                </button>
                            )
                        })}
                    </div>

                    <select name="sort" id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border-2 rounded-full px-2 py-1 w-36">
                        <option value="Id">ID</option>
                        <option value="Joining Date">Joining Date</option>
                    </select>
                </div>

                <div className="flex flex-col gap-y-4">
                    {users.map((u) => (
                        <AdminUserCard key={u.id} user={u} />
                    ))}
                </div>
            </div>
        </div>
    );
}