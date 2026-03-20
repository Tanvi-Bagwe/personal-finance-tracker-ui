export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ResetPasswordRequest {
  user_id: number;
  token: string;
  new_password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}
