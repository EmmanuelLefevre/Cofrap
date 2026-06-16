/* eslint-disable @typescript-eslint/no-explicit-any */

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

import { User } from '@core/_models/user/user.model';
import { LoginCredentials } from '@core/_models/auth/auth.model';

import { ENVIRONMENT } from '@env/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: any;

  const API_URL = ENVIRONMENT.k8sUrl;
  const MOCK_USER: User = { id: '123-uuid', username: 'adminCOFRAP' };

  beforeEach(() => {
    const ROUTER_MOCK = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: ROUTER_MOCK }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateAccount()', () => {

    it('should POST to generate-password and set qrCode signal', () => {
      const USERNAME = 'newAdmin';
      const MOCK_RESPONSE = { username: USERNAME, passwordQrCode: 'base64-qr-code-string' };

      service.generateAccount(USERNAME).subscribe();

      const REQ = httpMock.expectOne(`${API_URL}/generate-password`);
      expect(REQ.request.method).toBe('POST');
      expect(REQ.request.body).toEqual({ username: USERNAME });

      REQ.flush(MOCK_RESPONSE);

      expect(service.currentPasswordQrCode()).toBe(MOCK_RESPONSE.passwordQrCode);
    });
  });

  describe('generateMfa()', () => {

    it('should POST to generate-2fa and set mfa signal', () => {
      const USERNAME = 'adminCOFRAP';
      const MOCK_RESPONSE = { username: USERNAME, mfaQrCode: 'base64-mfa-code' };

      service.generateMfa(USERNAME).subscribe();

      const REQ = httpMock.expectOne(`${API_URL}/generate-2fa`);
      expect(REQ.request.method).toBe('POST');
      expect(REQ.request.body).toEqual({ username: USERNAME });

      REQ.flush(MOCK_RESPONSE);

      expect(service.currentMfaQrCode()).toBe(MOCK_RESPONSE.mfaQrCode);
    });
  });

  describe('login()', () => {

    const MOCK_CREDS: LoginCredentials = {
      username: 'admin',
      password: '123',
      code2FA: '000000'
    };

    it('should POST to authenticate-user, set user signal and navigate', () => {
      service.login(MOCK_CREDS).subscribe();

      const REQ = httpMock.expectOne(`${API_URL}/authenticate-user`);
      expect(REQ.request.method).toBe('POST');
      expect(REQ.request.body).toEqual(MOCK_CREDS);

      REQ.flush(MOCK_USER);

      expect(service.currentUser()).toEqual(MOCK_USER);
    });
  });

  describe('logout()', () => {

    it('should clear session signals and navigate to root', () => {
      service.currentUser.set(MOCK_USER);
      service.currentPasswordQrCode.set('old-qr-code');
      service.currentMfaQrCode.set('old-mfa-code');

      service.logout();

      expect(service.currentUser()).toBeNull();
      expect(service.currentPasswordQrCode()).toBeNull();
      expect(service.currentMfaQrCode()).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Computed Signals', () => {

    it('should correctly compute isAuthenticated', () => {
      service.currentUser.set(null);
      expect(service.isAuthenticated()).toBe(false);

      service.currentUser.set(MOCK_USER);
      expect(service.isAuthenticated()).toBe(true);
    });
  });
});
