import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet, Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { ROUTES } from '@app/app.routes';
import { authGuard } from '@core/guards/auth/auth.guard';
import { AuthService } from '@core/_services/auth/auth.service';

@Component({
  selector: 'mock-layout',
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
class MockLayoutComponent {}

describe('App Routes', () => {

  let harness: RouterTestingHarness;
  let router: Router;

  const AUTH_SERVICE_MOCK = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentUser: signal<any>(undefined),
    isAdmin: vi.fn(),
    isAuthenticated: vi.fn()
  };

  const mockAuthGuard = vi.fn();

  beforeEach(async() => {
    AUTH_SERVICE_MOCK.isAuthenticated.mockReturnValue(false);
    mockAuthGuard.mockReturnValue(true);

    const TEST_ROUTES = ROUTES.map(route => {
      if (route.path === '' && route.children) {
        return {
          ...route,
          loadComponent: undefined,
          component: MockLayoutComponent
        };
      }
      return route;
    });

    TestBed.configureTestingModule({
      providers: [
        provideRouter(TEST_ROUTES),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService(),
        { provide: AuthService, useValue: AUTH_SERVICE_MOCK },
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unsafe-return
        { provide: authGuard, useValue: () => mockAuthGuard() }
      ]
    });

    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
  });

  it('should redirect empty path to /home', async() => {
    // --- ACT ---
    await harness.navigateByUrl('/');

    // --- ASSERT ---
    expect(TestBed.inject(Router).url).toBe('/home');
  });

  it('should navigate to /contact', async() => {
    // --- ACT ---
    const INSTANCE = await harness.navigateByUrl('/contact');

    // --- ASSERT ---
    expect(INSTANCE).toBeTruthy();
    expect(TestBed.inject(Router).url).toBe('/contact');
  });

  it('should navigate to /create-account', async() => {
    // --- ACT ---
    const INSTANCE = await harness.navigateByUrl('/create-account');

    // --- ASSERT ---
    expect(INSTANCE).toBeTruthy();
    expect(TestBed.inject(Router).url).toBe('/login');
  });

  it('should navigate to /login', async() => {
    // --- ACT ---
    const INSTANCE = await harness.navigateByUrl('/login');

    // --- ASSERT ---
    expect(INSTANCE).toBeTruthy();
    expect(TestBed.inject(Router).url).toBe('/login');
  });

  it('should navigate to unfound-error for unknown routes (wildcard)', async() => {
    // --- ACT ---
    await harness.navigateByUrl('/path/that/does/not/exist');

    // --- ASSERT ---
    expect(TestBed.inject(Router).url).toBe('/error/unfound-error');
  });

  it('should load error child routes correctly', async() => {
    // --- ACT ---
    await harness.navigateByUrl('/error/server-error');

    // --- ASSERT ---
    expect(TestBed.inject(Router).url).toBe('/error/server-error');
  });

  describe('Error Management Routes', () => {

    const ERROR_CASES = [
      { path: '/error/unauthorized-error' },
      { path: '/error/forbidden-error' },
      { path: '/error/unfound-error' },
      { path: '/error/server-error' },
      { path: '/error/generic-error' },
      { path: '/error/unknown-error' },
      { path: '/error/timeout-error' },
      { path: '/error/maintenance-error' },
    ];

    it.each(ERROR_CASES)('should successfully load component for $path', async({ path }) => {
      // --- ACT ---
      const COMPONENT_INSTANCE = await harness.navigateByUrl(path);

      // --- ASSERT ---
      expect(TestBed.inject(Router).url).toBe(path);
      expect(COMPONENT_INSTANCE).toBeTruthy();
    });
  });

  describe('Private Route', () => {

    it('should allow navigation to /private/personal-space if authGuard returns true', async() => {
      // --- ARRANGE ---
      mockAuthGuard.mockReturnValue(true);

      // --- ACT ---
      const INSTANCE = await harness.navigateByUrl('/private');

      // --- ASSERT ---
      expect(INSTANCE).toBeTruthy();
      expect(router.url).toBe('/private/personal-space');
    });

    it('should redirect to root (/) if authGuard rejects unauthenticated user', async() => {
      // --- ARRANGE ---
      mockAuthGuard.mockReturnValue(router.parseUrl('/'));

      // --- ACT ---
      await harness.navigateByUrl('/private');

      // --- ASSERT ---
      expect(router.url).toBe('/home');
    });
  });
});

describe('Route Configuration Integrity', () => {
  it('should be able to resolve the PublicLayoutComponent import', async() => {
    // --- ARRANGE ---
    const ROOT_ROUTE = ROUTES.find(r => r.path === '');

    // --- ACT ---
    const COMPONENT_IMPORT = await ROOT_ROUTE?.loadComponent!();

    // --- ASSERT ---
    expect(ROOT_ROUTE?.loadComponent).toBeDefined();
    expect(COMPONENT_IMPORT).toBeTruthy();
  });
});

describe('Route SEO Data Integrity', () => {
  // --- SETUP VARIABLES ---
  const publicLayoutRoute = ROUTES.find(r => r.path === '');
  const publicRoutes = publicLayoutRoute?.children || [];

  const errorLayoutRoute = publicRoutes.find(r => r.path === 'error');
  const errorRoutes = errorLayoutRoute?.children || [];

  it('should contain valid and EXACT SEO metadata for public views', () => {
    // --- ARRANGE ---
    const expectedPublicSeo = [
      { path: 'home', titleKey: 'META.PAGES.HOME.TITLE', descriptionKey: 'META.PAGES.HOME.DESCRIPTION' },
      { path: 'create-account', titleKey: 'META.PAGES.CREATE_ACCOUNT.TITLE', descriptionKey: 'META.PAGES.CREATE_ACCOUNT.DESCRIPTION' },
      { path: 'login', titleKey: 'META.PAGES.LOGIN.TITLE', descriptionKey: 'META.PAGES.LOGIN.DESCRIPTION' },
      { path: 'contact', titleKey: 'META.PAGES.CONTACT.TITLE', descriptionKey: 'META.PAGES.CONTACT.DESCRIPTION' }
    ];

    // --- ACT & ASSERT ---
    expectedPublicSeo.forEach(expected => {
      const route = publicRoutes.find(r => r.path === expected.path);

      expect(route).toBeDefined();
      expect(route?.data?.['seo']).toBeDefined();

      expect(route?.data?.['seo']?.titleKey).toBe(expected.titleKey);
      expect(route?.data?.['seo']?.descriptionKey).toBe(expected.descriptionKey);
    });
  });

  it('should contain valid and EXACT SEO metadata (including robots) for private views', () => {
    // --- ARRANGE ---
    const privateLayoutRoute = publicRoutes.find(r => r.path === 'private');
    const privateRoutes = privateLayoutRoute?.children || [];

    const expectedPrivateSeo = [
      { path: 'personal-space', titleKey: 'META.PAGES.PRIVATE.PERSONNAL_SPACE.TITLE', descriptionKey: 'META.PAGES.PRIVATE.PERSONNAL_SPACE.DESCRIPTION' }
    ];

    // --- ACT & ASSERT ---
    expectedPrivateSeo.forEach(expected => {
      const route = privateRoutes.find(r => r.path === expected.path);

      expect(route).toBeDefined();
      expect(route?.data?.['seo']).toBeDefined();

      expect(route?.data?.['seo']?.titleKey).toBe(expected.titleKey);
      expect(route?.data?.['seo']?.descriptionKey).toBe(expected.descriptionKey);

      expect(route?.data?.['seo']?.robots).toBe('noindex, nofollow');
    });
  });

  it('should contain valid and EXACT SEO metadata (including robots) for error views', () => {
    // --- ARRANGE ---
    const expectedErrorSeo = [
      { path: 'unauthorized-error', titleKey: 'META.PAGES.ERROR.401.TITLE', descriptionKey: 'META.PAGES.ERROR.401.DESCRIPTION' },
      { path: 'forbidden-error', titleKey: 'META.PAGES.ERROR.403.TITLE', descriptionKey: 'META.PAGES.ERROR.403.DESCRIPTION' },
      { path: 'unfound-error', titleKey: 'META.PAGES.ERROR.404.TITLE', descriptionKey: 'META.PAGES.ERROR.404.DESCRIPTION' },
      { path: 'server-error', titleKey: 'META.PAGES.ERROR.500.TITLE', descriptionKey: 'META.PAGES.ERROR.500.DESCRIPTION' },
      { path: 'generic-error', titleKey: 'META.PAGES.ERROR.GENERIC.TITLE', descriptionKey: 'META.PAGES.ERROR.GENERIC.DESCRIPTION' },
      { path: 'unknown-error', titleKey: 'META.PAGES.ERROR.UNKNOWN.TITLE', descriptionKey: 'META.PAGES.ERROR.UNKNOWN.DESCRIPTION' },
      { path: 'timeout-error', titleKey: 'META.PAGES.ERROR.408.TITLE', descriptionKey: 'META.PAGES.ERROR.408.DESCRIPTION' }
      ,
      { path: 'maintenance-error', titleKey: 'META.PAGES.ERROR.503.TITLE', descriptionKey: 'META.PAGES.ERROR.503.DESCRIPTION' }
    ];

    // --- ACT & ASSERT ---
    expectedErrorSeo.forEach(expected => {
      const route = errorRoutes.find(r => r.path === expected.path);

      expect(route).toBeDefined();
      expect(route?.data?.['seo']).toBeDefined();

      expect(route?.data?.['seo']?.titleKey).toBe(expected.titleKey);
      expect(route?.data?.['seo']?.descriptionKey).toBe(expected.descriptionKey);

      expect(route?.data?.['seo']?.robots).toBe('noindex, nofollow');
    });
  });

  it('should have a global "noindex, nofollow" on the parent error layout route', () => {
    // --- ACT & ASSERT ---
    expect(errorLayoutRoute?.data?.['seo']?.robots).toBe('noindex, nofollow');
  });
});

describe('Route Configuration Integrity (Lazy Loading)', () => {
  it('should successfully resolve all lazy-loaded components in the routing tree', async() => {
    // --- ARRANGE ---
    const checkRoutes = async(routes: Routes): Promise<void> => {
      for (const route of routes) {

        if (route.loadComponent) {
          const component = await route.loadComponent();
          expect(component).toBeTruthy();
        }

        if (route.children) {
          await checkRoutes(route.children);
        }
      }
    };

    // --- ACT & ASSERT ---
    await checkRoutes(ROUTES);
  });
});
