import { inject, Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ENVIRONMENT } from '@env/environment';

import { User } from '@core/_models/user/user.model';
import { AccountCreationResponse, LoginCredentials, MfaCreationResponse } from '@core/_models/auth/auth.model';

import { SnackbarService } from '../snackbar/snackbar.service';


const HAS_ACCOUNT_INIT = typeof localStorage !== 'undefined' ? localStorage.getItem('hasAccount') === 'true' : false;

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly snackbarService = inject(SnackbarService);

  private readonly apiGatewayUrl = ENVIRONMENT.k3sUrl;

  public readonly currentUser = signal<User | null>(null);
  public readonly hasAccount = signal<boolean>(HAS_ACCOUNT_INIT);
  public readonly isAuthenticated = computed(() => !!this.currentUser());

  public readonly currentRawPassword = signal<string | null>(null);
  public readonly currentPasswordQrCode = signal<string | null>(null);
  public readonly currentMfaQrCode = signal<string | null>(null);

  generateAccount(username: string): Observable<AccountCreationResponse> {
    return this.http.post<AccountCreationResponse>(`${this.apiGatewayUrl}/generate-password`, { username })
      .pipe(
        tap((res) => {
          this.currentPasswordQrCode.set(res.passwordQrCode);
          this.currentRawPassword.set(res.passwordRaw);
        })
      );
  }

  generateMfa(username: string): Observable<MfaCreationResponse> {
    return this.http.post<MfaCreationResponse>(`${this.apiGatewayUrl}/generate-mfa`, { username })
      .pipe(
        tap((res) => this.currentMfaQrCode.set(res.mfaQrCode))
      );
  }

  verifyMfa(username: string, totpCode: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiGatewayUrl}/verify-mfa`, { username, totpCode })
      .pipe(
        tap(() => {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('hasAccount', 'true');
          }
          this.hasAccount.set(true);
        })
      );
  }

  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<User>(`${this.apiGatewayUrl}/login`, credentials)
      .pipe(
        tap((user) => this.currentUser.set(user))
      );
  }

  logout(): void {
    const user = this.currentUser();

    if (user) {
      this.snackbarService.showNotification(
        'UI.SNACKBAR.AUTH.LOGOUT.SUCCESS',
        'logIn-logOut',
        { username: user.username }
      );

      this.clearSession();
    }
  }

  private clearSession(): void {
    this.currentUser.set(null);
    this.currentPasswordQrCode.set(null);
    this.currentMfaQrCode.set(null);
    this.currentRawPassword.set(null);
    this.router.navigate(['/']);
  }
}
