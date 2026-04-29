import type { User } from "../../../types/models/auth/User";

interface UserCardProp {
    user: User;
}

export default function AdminUserCard({ user }: UserCardProp) {

    return (
        <div className="grid grid-cols-1 md:grid-cols-6">
            <div className="flex flex-col items-center">
                <p className="text-sm text-gray-700">UserID</p>
                <p className="font-bold">{user.id}</p>
            </div>

            <div className="flex flex-col items-center">
                <p className="text-sm text-gray-700">Name</p>
                <p className="font-bold">{user.username}</p>
            </div>

            <div className="flex flex-col items-center">
                <p className="text-sm text-gray-700">Email</p>
                <p className="font-bold">{user.email}</p>
            </div>

            <div className="flex flex-col items-center">
                <p className="text-sm text-gray-700">Phone</p>
                <p className="font-bold">{user.phone}</p>
            </div>

            <div className="flex flex-col items-center">
                <p className="text-sm text-gray-700">Role</p>
                <p className="font-bold">{user.role}</p>
            </div>

            <div className="flex flex-col items-center">
                <p className="text-sm text-gray-700">Created At</p>
                <p className="font-bold">{user.createdAt}</p>
            </div>
        </div>
    );
}