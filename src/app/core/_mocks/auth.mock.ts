import { AccountCreationResponse, MfaCreationResponse } from '@core/_models/auth/auth.model';

export const MOCK_ACCOUNT_RESPONSE: AccountCreationResponse = {
  username: 'adminTest',
  passwordRaw: 'P@ssw0rd24CharsLong#12345',
  passwordQrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=P@ssw0rd24CharsLong%2312345'
};

export const MOCK_MFA_RESPONSE: MfaCreationResponse = {
  username: 'adminTest',
  mfaQrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MFA_SECRET_TEST_123'
};
