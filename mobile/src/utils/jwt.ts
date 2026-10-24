// Updated import to use named export
import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

export const extractUserId = (token: string): string | null => {
  try {
    // Changed to use jwtDecode instead of jwt_decode
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.sub || null;
  } catch {
    return null;
  }
};