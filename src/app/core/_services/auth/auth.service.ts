/* eslint-disable @typescript-eslint/no-unused-vars */

import { inject, Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ENVIRONMENT } from '@env/environment';

import { User } from '@core/_models/user/user.model';

import { LoginCredentials, AccountCreationResponse, MfaCreationResponse } from '@core/_models/auth/auth.model';


// Mocking imports
import { of, delay } from 'rxjs';
import { MOCK_ACCOUNT_RESPONSE, MOCK_MFA_RESPONSE } from '@app/core/_mocks/auth.mock';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly apiGatewayUrl = ENVIRONMENT.k8sUrl;

  // Signaux d'état
  public readonly currentUser = signal<User | null>(null);
  public readonly isAuthenticated = computed(() => !!this.currentUser());

  // Signaux pour le workflow de création
  public readonly currentRawPassword = signal<string | null>(null);
  public readonly currentPasswordQrCode = signal<string | null>(null);
  public readonly currentMfaQrCode = signal<string | null>(null);

  // generateAccount(username: string): Observable<AccountCreationResponse> {
  //   return this.http.post<AccountCreationResponse>(`${this.apiGatewayUrl}/generate-password`, { username })
  //     .pipe(
  //       tap((res) => {
  //         this.currentPasswordQrCode.set(res.passwordQrCode);
  //         this.currentRawPassword.set(res.passwordRaw);
  //       })
  //     );
  // }

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

  // generateMfa(username: string): Observable<MfaCreationResponse> {
  //   return this.http.post<MfaCreationResponse>(`${this.apiGatewayUrl}/generate-2fa`, { username })
  //     .pipe(
  //       tap((res) => this.currentMfaQrCode.set(res.mfaQrCode))
  //     );
  // }

  generateMfa(username: string): Observable<MfaCreationResponse> {
    return of(MOCK_MFA_RESPONSE).pipe(
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      delay(800),
      tap((res) => this.currentMfaQrCode.set(res.mfaQrCode))
    );
  }

  // verifyMfa(username: string, otpCode: string): Observable<boolean> {
  //   return this.http.post<boolean>(`${this.apiGatewayUrl}/verify-2fa`, { username, otpCode });
  // }

  verifyMfa(username: string, otpCode: string): Observable<boolean> {
    if (otpCode === '123456') {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      return of(true).pipe(delay(500));
    }
    else {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' })).pipe(delay(500));
    }
  }

  finalizeAccount(username: string): Observable<boolean> {
    return of(true).pipe(
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      delay(800),
      tap(() => {
        // Optionnel : tu pourrais ici définir un utilisateur factice
        // dans ton signal currentUser pour simuler la connexion
        // this.currentUser.set({ username, id: '123' } as User);
      })
    );
  }

  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<User>(`${this.apiGatewayUrl}/authenticate-user`, credentials)
      .pipe(
        tap((user) => this.currentUser.set(user))
      );
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
