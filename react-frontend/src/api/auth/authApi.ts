import type { LoginRequest } from "../../types/dto/LoginRequest";
import type { SignupRequest } from "../../types/dto/SignupRequest";
import type { UserDto } from "../../types/dto/UserDto";
import { apiClient } from "../apiClient";

export const authApi = {
  async login(email: string, password: string): Promise<UserDto> {
    const payload: LoginRequest = { email, password };
    const res = await apiClient.post("/auth/login", payload, { withCredentials: true });
    return res.data;
  },

  async signup(user: SignupRequest): Promise<UserDto> {
    const res = await apiClient.post("/auth/signup", user, { withCredentials: true });
    return res.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout", {}, { withCredentials: true });
  }
};
