import { useEffect, useState } from "react";
import { userApi } from "../../api/userApi"; // Assuming userApi is correct

export default function Profile() {
  // Use a simpler state variable name since it's just display data
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const [isLoading, setIsLoading] = useState(true); // New state to handle loading status

  // Load user profile from backend API
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await userApi.getProfile();
        setProfileData({
          username: data.username,
          email: data.email,
          phone: data.phone,
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl p-6">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <p>Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {/* FORM */}
      <div className="bg-white shadow p-6 rounded-lg space-y-4">
        
        {/* DISPLAY USERNAME */}
        <div>
          <label className="font-semibold block mb-1">Username</label>
          <div className="w-full border p-2 rounded bg-gray-50">
            {profileData.username}
          </div>
        </div>

        {/* DISPLAY EMAIL */}
        <div>
          <label className="font-semibold block mb-1">Email</label>
          <div className="w-full border p-2 rounded bg-gray-50">
            {profileData.email}
          </div>
        </div>

        {/* DISPLAY PHONE */}
        <div>
          <label className="font-semibold block mb-1">Phone</label>
          <div className="w-full border p-2 rounded bg-gray-50">
            {profileData.phone}
          </div>
        </div>

        {/* REMOVED: Save button */}
      </div>
    </div>
  );
}