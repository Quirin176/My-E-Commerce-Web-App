import { User } from "../models/User";
import { SignupRequest } from "../dto/SignupRequest";
import { LoginRequest } from "../dto/LoginRequest";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signup: (data: SignupRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
