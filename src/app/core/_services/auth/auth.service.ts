/* eslint-disable @typescript-eslint/no-unused-vars */

import { inject, Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ENVIRONMENT } from '@env/environment';

import { User } from '@core/_models/user/user.model';

import { AccountCreationResponse, LoginCredentials, MfaCreationResponse } from '@core/_models/auth/auth.model';

// --- MOCK imports (supprimer une fois l'API en service) ---
import { of, delay } from 'rxjs';
import { MOCK_ACCOUNT_RESPONSE, MOCK_MFA_RESPONSE } from '@app/core/_mocks/auth.mock';

const HAS_ACCOUNT_INIT = typeof localStorage !== 'undefined' ? localStorage.getItem('hasAccount') === 'true' : false;

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly apiGatewayUrl = ENVIRONMENT.k8sUrl;

  // Signaux d'état
  public readonly currentUser = signal<User | null>(null);
  public readonly hasAccount = signal<boolean>(HAS_ACCOUNT_INIT);
  public readonly isAuthenticated = computed(() => !!this.currentUser());

  // Signaux pour le workflow de création
  public readonly currentRawPassword = signal<string | null>(null);
  public readonly currentPasswordQrCode = signal<string | null>(null);
  public readonly currentMfaQrCode = signal<string | null>(null);

  // --- Real Method (décommenter une fois l'API en service) ---
  // generateAccount(username: string): Observable<AccountCreationResponse> {
  //   return this.http.post<AccountCreationResponse>(`${this.apiGatewayUrl}/generate-password`, { username })
  //     .pipe(
  //       tap((res) => {
  //         this.currentPasswordQrCode.set(res.passwordQrCode);
  //         this.currentRawPassword.set(res.passwordRaw);
  //       })
  //     );
  // }

  // --- MOCK (supprimer une fois l'API en service) ---
  generateAccount(username: string): Observable<AccountCreationResponse> {
    return of(MOCK_ACCOUNT_RESPONSE).pipe(
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      delay(800),
      tap((res) => {
        this.currentPasswordQrCode.set(res.passwordQrCode);
        this.currentRawPassword.set(res.passwordRaw);
      })
    );
  }

  // --- Real Method (décommenter une fois l'API en service) ---
  // generateMfa(username: string): Observable<MfaCreationResponse> {
  //   return this.http.post<MfaCreationResponse>(`${this.apiGatewayUrl}/generate-mfa`, { username })
  //     .pipe(
  //       tap((res) => this.currentMfaQrCode.set(res.mfaQrCode))
  //     );
  // }

  // --- MOCK (supprimer une fois l'API en service) ---
  generateMfa(username: string): Observable<MfaCreationResponse> {
    return of(MOCK_MFA_RESPONSE).pipe(
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      delay(800),
      tap((res) => this.currentMfaQrCode.set(res.mfaQrCode))
    );
  }

  // --- Real Method (décommenter une fois l'API en service) ---
  // verifyMfa(username: string, totpCode: string): Observable<boolean> {
  //   return this.http.post<boolean>(`${this.apiGatewayUrl}/verify-mfa`, { username, totpCode })
  //     .pipe(
  //       tap(() => {
  //         if (typeof localStorage !== 'undefined') {
  //           localStorage.setItem('hasAccount', 'true');
  //         }
  //         this.hasAccount.set(true);
  //       })
  //     );
  // }

  // --- MOCK (supprimer une fois l'API en service) ---
  verifyMfa(username: string, totpCode: string): Observable<boolean> {
    if (totpCode === '123456') {
      return of(true).pipe(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        delay(800),
        tap(() => {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('hasAccount', 'true');
          }
          this.hasAccount.set(true);
        })
      );
    }
    else {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' })).pipe(delay(500));
    }
  }

  // --- Real Method (décommenter une fois l'API en service) ---
  // login(credentials: LoginCredentials): Observable<User> {
  //   return this.http.post<User>(`${this.apiGatewayUrl}/login`, credentials)
  //     .pipe(
  //       tap((user) => this.currentUser.set(user))
  //     );
  // }

  // --- MOCK (supprimer une fois l'API en service) ---
  login(credentials: LoginCredentials): Observable<User> {
    if (credentials.totpCode === '123456') {

      const mockUser: User = {
        id: 'mock-id-98765',
        username: credentials.username
      } as User;

      return of(mockUser).pipe(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        delay(800),
        tap((user) => {
          this.currentUser.set(user);
        })
      );
    }
    else {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' })).pipe(delay(500));
    }
  }

  logout(): void {
    this.clearSession();
  }

  private clearSession(): void {
    this.currentUser.set(null);
    this.currentPasswordQrCode.set(null);
    this.currentMfaQrCode.set(null);
    this.currentRawPassword.set(null);
    this.router.navigate(['/']);
  }
}
