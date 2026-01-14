export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    phone: string;
    role: string;
  };
}
