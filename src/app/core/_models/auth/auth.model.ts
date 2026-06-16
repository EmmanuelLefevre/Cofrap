export interface LoginCredentials {
  username: string;
  password: string;
  code2FA: string;
}

export interface AccountCreationResponse {
  username: string;
  passwordRaw: string;
  passwordQrCode: string;
}

export interface MfaCreationResponse {
  username: string;
  mfaQrCode: string;
}
