export interface PasswordResetRequest {
  email: string;
  otp: string;
  new_password: string;
}
