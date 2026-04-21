import { apiClient } from "../apiClient";

export const adminUsersApi = {

  async getProfileByEmail(email: string) {
    const res = await apiClient.get(`/user/admin/email/${email}`);
    return res.data;
  },

  async getProfileByPhone(phone: string) {
    const res = await apiClient.get(`/user/admin/phone/${phone}`);
    return res.data;
  },

  async getAllProfile() {
    const res = await apiClient.get("/user/admin");
    return res.data;
  },

  async getProfilesByRole(role: string) {
    const res = await apiClient.get(`/user/admin/role/${role}`);
    return res.data;
  },

  // updateProfile: async (profile) => {
  //   const res = await apiClient.put("/user/profile", profile);
  //   return res.data;
  // }
};
