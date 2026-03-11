export interface JwtPayload {
  sub: number;       // user ID
  email: string;
  role: string;
  username: string;
}
