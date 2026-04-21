import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { userApi } from "../../api/user/userApi";

const INITIAL_PROFILE_DATA = {
  username: "",
  email: "",
  phone: "",
  role: "",
  createdAt: "",
};

export const useUser = () => {
  const [user, setUser] = useState(INITIAL_PROFILE_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const userData = await userApi.getProfile();
        
        setUser({
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          createdAt: userData.createdAt,
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch profile";
        toast.error(message);
        setError(message);
      } finally {
        setLoading(false);
        setError(null);
      }
    };
    fetchUser();
  }, []);

  return { user, loading, error };
};
