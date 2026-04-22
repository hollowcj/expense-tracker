export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export interface ProtectedRequest {
  user: {
    _id: string;
    name: string;
    email: string;
  };
}