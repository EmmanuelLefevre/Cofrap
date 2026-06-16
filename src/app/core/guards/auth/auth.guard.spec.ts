/* eslint-disable @typescript-eslint/no-explicit-any */

import { TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { AuthService } from '@core/_services/auth/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {

  let isAuthenticatedSignal: WritableSignal<boolean>;

  const ROUTER_MOCK = {
    parseUrl: vi.fn((url: string) => url as unknown as UrlTree),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    isAuthenticatedSignal = signal(true);

    const AUTH_SERVICE_MOCK = {
      isAuthenticated: isAuthenticatedSignal
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: AUTH_SERVICE_MOCK },
        { provide: Router, useValue: ROUTER_MOCK },
      ],
    });
  });

  it('should allow access if user is authenticated', () => {
    // --- ARRANGE ---
    isAuthenticatedSignal.set(true);

    // --- ACT ---
    const RESULT = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    // --- ASSERT ---
    expect(RESULT).toBe(true);
  });

  it('should redirect to unauthorized-error if user is NOT authenticated', () => {
    // --- ARRANGE ---
    isAuthenticatedSignal.set(false);

    // --- ACT ---
    const RESULT = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    // --- ASSERT ---
    expect(ROUTER_MOCK.parseUrl).toHaveBeenCalledWith('/error/unauthorized-error');
    expect(RESULT).toBe('/error/unauthorized-error');
  });
});
