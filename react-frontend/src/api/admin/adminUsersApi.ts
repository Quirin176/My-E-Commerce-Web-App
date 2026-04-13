import { apiClient } from "../apiClient";

export const adminUsersApi = {

  async getProfileByEmail(email: string) {
    const res = await apiClient.get(`/user/email/${email}`);
    return res.data;
  },

  async getProfileByPhone(phone: string) {
    const res = await apiClient.get(`/user/phone/${phone}`);
    return res.data;
  },

  async getAllProfile() {
    const res = await apiClient.get("/user");
    return res.data;
  },

  // updateProfile: async (profile) => {
  //   const res = await apiClient.put("/user/profile", profile);
  //   return res.data;
  // }
};
