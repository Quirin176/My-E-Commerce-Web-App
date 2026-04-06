import { Mail, NotebookText, Phone, User2, Star } from "lucide-react";
import { useUser } from "../../hooks/users/useUser";

export default function Profile() {
  const { user: profileData, loading: isLoading, error: errorMessage } = useUser();

  const getStars = (role: string) => {
    const count =
      role === "Customer" ? 1 :
        role === "VIP" ? 2 :
          role === "Admin" ? 3 :
            0;

    return Array.from({ length: count }, (_, i) => (
      <Star key={i} className="w-6 h-6 text-yellow-500" fill="currentColor" />
    ));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <p>Loading profile data...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <p className="text-red-500">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {/* FORM */}
      <div className="bg-gray-100 shadow p-6 rounded-lg space-y-4">

        {/* DISPLAY USERNAME */}
        <div>
          <label className="text-xl font-semibold mb-1 flex items-center gap-2">
            <User2 className="w-6 h-6" />
            Username
          </label>
          <div className="text-xl w-full border p-2 rounded bg-gray-50">
            {profileData.username}
          </div>
        </div>

        {/* DISPLAY EMAIL */}
        <div>
          <label className="text-xl font-semibold mb-1 flex items-center gap-2">
            <Mail className="w-6 h-6" />
            Email
          </label>
          <div className="text-xl w-full border p-2 rounded bg-gray-50">
            {profileData.email}
          </div>
        </div>

        {/* DISPLAY PHONE */}
        <div>
          <label className="text-xl font-semibold mb-1 flex items-center gap-2">
            <Phone className="w-6 h-6" />
            Phone
          </label>
          <div className="text-xl w-full border p-2 rounded bg-gray-50">
            {profileData.phone}
          </div>
        </div>

        {/* DISPLAY ROLE */}
        <div>
          <label className="text-xl font-semibold mb-1 flex items-center gap-2">
            <Star className="w-6 h-6" />
            Type
            <div className="flex items-center gap-1">
              {getStars(profileData.role)}
            </div>
          </label>

          <div className="flex items-center gap-2 text-xl w-full border p-2 rounded bg-gray-50">
            {profileData.role}
          </div>
        </div>

        {/* DISPLAY CREATED AT */}
        <div>
          <label className="text-xl font-semibold mb-1 flex items-center gap-2">
            <NotebookText className="w-6 h-6" />
            Account Created At
          </label>
          <div className="text-xl w-full border p-2 rounded bg-gray-50">
            {profileData.createdAt}
          </div>
        </div>
      </div>
    </div>
  );
}