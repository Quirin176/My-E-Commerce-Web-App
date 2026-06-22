import { useEffect, useState } from "react";
import { adminUsersApi } from "../../../api/admin/adminUsersApi";
import type { User } from "../../../types/models/auth/User";
import { useAuth } from "../../../hooks/auth/useAuth";

import { useUserUrlFilters } from "../../../hooks/useUserUrlFilters";
import { usePagination } from "../../../hooks/usePagination";

import toast from "react-hot-toast";
import LoadingState from "../../../components/pageState/LoadingState";
import AdminUserCard from "../../../components/admin/users/AdminUserCard";
import PaginationControl from "../../../components/PaginationControl";

const ROLE = [
    { Id: 1, Role: "Admin" },
    { Id: 2, Role: "Customer" }
]

const PAGE_SIZE = 10;

export default function AdminUsers() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [selectedRole, setSelectedRole] = useState<string>("Admin")

    const [totalCount, setTotalCount] = useState<number>(0);

    // ──────────────────── URL-driven filter state ────────────────────
    const { page, role, sortBy, sortOrder, updateUrl } = useUserUrlFilters();

    useEffect(() => {
        const fetchData = async () => {
            if (user !== null && user.role !== "Admin") return;

            try {
                setLoading(true);
                const res = await adminUsersApi.getProfilesByFilters("", selectedRole, sortBy, sortOrder, page, PAGE_SIZE);
                const usersData = res.data;
                setUsers(usersData);
                setTotalCount(res.pagination.totalCount);
            } catch {
                toast.error("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, selectedRole, sortBy, sortOrder, page]);

    // ──────────────────── Pagination ────────────────────
    const { totalPages, goToPage } = usePagination({
        totalCount: totalCount,
        pageSize: PAGE_SIZE,
        currentPage: page,
        onPageChange: (p) => updateUrl({ page: p }),
    });

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        updateUrl({ role: role, page: 1 });
    }

    {/* LOADING OVERLAY */ }
    if (loading) {
        return (
            <LoadingState
                message="Loading user details…"
                subMessage="Please wait..."
            />
        );
    }

    return (
        <div className="w-full h-full flex flex-col gap-y-8 p-8 bg-(--bg-muted)">
            <div className="flex flex-row items-center justify-between">
                <div className="flex gap-4">
                    {ROLE.map((role, index) => {
                        const isActive = role.Role == selectedRole;
                        return (
                            <button
                                key={index}
                                onClick={() => handleRoleChange(role.Role)}
                                className={`text-lg border-2 px-2 w-32 rounded-full cursor-pointer transition
                                        ${isActive ? "bg-(--brand-primary) text-white"
                                        : "text-(--brand-primary) bg-(--bg-surface) hover:bg-(--brand-primary) hover:text-white"
                                    }`}
                            >
                                {role.Role}
                            </button>
                        )
                    })}
                </div>

                <div className="flex flex-row items-center justify-between gap-4">
                    <span className="text-lg font-semibold">Sort By</span>
                    <select
                        name="sortBy"
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => updateUrl({ sortBy: e.target.value, page: 1 })}
                        className="border-2 rounded-full px-2 py-1 w-36 cursor-pointer">
                        <option value="Id" className="bg-(--bg-surface)">ID</option>
                        <option value="Joining Date" className="bg-(--bg-surface)">Joining Date</option>
                    </select>
                </div>

                <div className="flex flex-row items-center justify-between gap-4">
                    <span className="text-lg font-semibold">Sort Order</span>
                    <select
                        name="sortOrder"
                        id="sortOrder"
                        value={sortOrder}
                        onChange={(e) => updateUrl({ sortOrder: e.target.value, page: 1 })}
                        className="border-2 rounded-full px-2 py-1 w-36 cursor-pointer">
                        <option value="asc" className="bg-(--bg-surface)">Ascending</option>
                        <option value="desc" className="bg-(--bg-surface)">Descending</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                {users.map((u) => (
                    <div className="rounded-2xl border bg-(--bg-surface) p-4">
                        <AdminUserCard key={u.id} user={u} />
                    </div>
                ))}
            </div>
            {/* Pagination Controls */}
            <PaginationControl
                currentPage={page}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={PAGE_SIZE}
                onPageChange={goToPage}
                showGoTo={true}
            />
        </div>
    );
}