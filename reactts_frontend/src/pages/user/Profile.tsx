import { useEffect, useState } from "react";
import { Mail, NotebookText, Phone, User2, Star } from "lucide-react";
import { userApi } from "../../api/userApi";

export default function Profile() {
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phone: "",
    role: "",
    createdAt: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  // Load user profile from backend API
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await userApi.getProfile();
        setProfileData({
          username: data.username,
          email: data.email,
          phone: data.phone,
          role: data.role,
          createdAt: data.createdAt,
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const getStars = (role: string) => {
  const count =
    role === "Customer" ? 1 :
    role === "VIP" ? 2 :
    role === "Admin" ? 3 :
    0;

  return Array.from({ length: count }, (_, i) => (
    <Star key={i} className="w-6 h-6 text-yellow-500" fill="currentColor"/>
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

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {/* FORM */}
      <div className="bg-gray-200 shadow p-6 rounded-lg space-y-4">
        
{/* DISPLAY USERNAME */}
<div>
  <label className="text-xl font-semibold mb-1 flex items-center gap-2">
    <User2 className="w-6 h-6"/>
    Username
  </label>
  <div className="text-xl w-full border p-2 rounded bg-gray-50">
    {profileData.username}
  </div>
</div>

{/* DISPLAY EMAIL */}
<div>
  <label className="text-xl font-semibold mb-1 flex items-center gap-2">
    <Mail className="w-6 h-6"/>
    Email
  </label>
  <div className="text-xl w-full border p-2 rounded bg-gray-50">
    {profileData.email}
  </div>
</div>

{/* DISPLAY PHONE */}
<div>
  <label className="text-xl font-semibold mb-1 flex items-center gap-2">
    <Phone className="w-6 h-6"/>
    Phone
  </label>
  <div className="text-xl w-full border p-2 rounded bg-gray-50">
    {profileData.phone}
  </div>
</div>

{/* DISPLAY ROLE */}
<div>
  <label className="text-xl font-semibold mb-1 flex items-center gap-2">
    <Star className="w-6 h-6"/>
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
    <NotebookText className="w-6 h-6"/>
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