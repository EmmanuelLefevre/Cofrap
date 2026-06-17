import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth/auth.guard';

export const ROUTES: Routes = [
  // --- PUBLIC AREA ---
  {
    path: '',
    // Public Layout
    loadComponent: () => import(
      '@features/public/public-layout.component')
      .then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import(
          '@features/public/public-views/home/home-view.component')
          .then(m => m.HomeViewComponent),
        data: {
          seo: { titleKey: 'META.PAGES.HOME.TITLE', descriptionKey: 'META.PAGES.HOME.DESCRIPTION' }
        }
      },
      {
        path: 'create-account',
        loadComponent: () => import(
          '@features/public/public-views/create-account/create-account-view.component')
          .then(m => m.CreateAccountViewComponent),
        data: {
          seo: { titleKey: 'META.PAGES.CREATE_ACCOUNT.TITLE', descriptionKey: 'META.PAGES.CREATE_ACCOUNT.DESCRIPTION' }
        }
      },
      {
        path: 'login',
        loadComponent: () => import(
          '@features/public/public-views/login/login-view.component')
          .then(m => m.LoginViewComponent),
        data: {
          seo: { titleKey: 'META.PAGES.LOGIN.TITLE', descriptionKey: 'META.PAGES.LOGIN.DESCRIPTION' }
        }
      },
      {
        path: 'contact',
        loadComponent: () => import(
          '@features/public/public-views/contact/contact-view.component')
          .then(m => m.ContactViewComponent),
        data: {
          seo: { titleKey: 'META.PAGES.CONTACT.TITLE', descriptionKey: 'META.PAGES.CONTACT.DESCRIPTION' }
        }
      },
      // Add 'about', 'other public views'...

      // --- PRIVATE AREA ---
      {
        path: 'private',
        loadComponent: () => import(
          '@features/private/private.component')
          .then(m => m.PrivateComponent),
        canActivate: [authGuard],
        children: [
          {
            path: '',
            redirectTo: 'personal-space',
            pathMatch: 'full'
          },
          {
            path: 'personal-space',
            loadComponent: () => import(
              '@features/private/private-views/personal-space/personal-space.component')
              .then(m => m.PersonalSpaceComponent),
            data: {
              seo: {
                titleKey: 'META.PAGES.PERSONNAL_SPACE.TITLE',
                descriptionKey: 'META.PAGES.PERSONNAL_SPACE.DESCRIPTION',
                robots: 'noindex, nofollow'
              }
            }
          }
        ]
      },

      // --- ERROR MANAGEMENT ---
      {
        path: 'error',
        loadComponent: () => import(
          '@shared/error-handler/error-handler.component')
          .then(m => m.ErrorHandlerComponent),
        data: {
          seo: {
            robots: 'noindex, nofollow'
          }
        },
        children: [
          { path: 'unauthorized-error',
            loadComponent: () => import(
              '@shared/error-handler/error-views/unauthorized-error/unauthorized-error.component')
              .then(m => m.UnauthorizedErrorComponent),
            data: {
              seo: {
                titleKey: 'META.PAGES.ERROR.401.TITLE',
                descriptionKey: 'META.PAGES.ERROR.401.DESCRIPTION',
                robots: 'noindex, nofollow'
              }
            }
          },
          { path: 'forbidden-error',
            loadComponent: () => import(
              '@shared/error-handler/error-views/forbidden-error/forbidden-error.component')
              .then(m => m.ForbiddenErrorComponent),
            data: {
              seo: {
                titleKey: 'META.PAGES.ERROR.403.TITLE',
                descriptionKey: 'META.PAGES.ERROR.403.DESCRIPTION',
                robots: 'noindex, nofollow'
              }
            }
          },
          { path: 'unfound-error',
            loadComponent: () => import(
              '@shared/error-handler/error-views/unfound-error/unfound-error.component')
              .then(m => m.UnfoundErrorComponent),
            data: {
              seo: {
                titleKey: 'META.PAGES.ERROR.404.TITLE',
                descriptionKey: 'META.PAGES.ERROR.404.DESCRIPTION',
                robots: 'noindex, nofollow'
              }
            }
          },
          { path: 'server-error',
            loadComponent: () => import(
              '@shared/error-handler/error-views/server-error/server-error.component')
              .then(m => m.ServerErrorComponent),
            data: {
              seo: {
                titleKey: 'META.PAGES.ERROR.500.TITLE',
                descriptionKey: 'META.PAGES.ERROR.500.DESCRIPTION',
                robots: 'noindex, nofollow'
              }
            }
          },
          { path: 'generic-error',
            loadComponent: () => import(
              '@shared/error-handler/error-views/generic-error/generic-error.component')
              .then(m => m.GenericErrorComponent),
            data: {
              seo: {
                titleKey: 'META.PAGES.ERROR.GENERIC.TITLE',
                descriptionKey: 'META.PAGES.ERROR.GENERIC.DESCRIPTION',
                robots: 'noindex, nofollow'
              }
            }
          },
          { path: 'unknown-error',
            loadComponent: () => import(
              '@shared/error-handler/error-views/unknown-error/unknown-error.component')
              .then(m => m.UnknownErrorComponent),
            data: {
              seo: {
                titleKey: 'META.PAGES.ERROR.UNKNOWN.TITLE',
                descriptionKey: 'META.PAGES.ERROR.UNKNOWN.DESCRIPTION',
                robots: 'noindex, nofollow'
              }
            }
          },
          { path: 'timeout-error',
            loadComponent: () => import(
              '@shared/error-handler/error-views/timeout-error/timeout-error.component')
              .then(m => m.TimeoutErrorComponent),
            data: {
              seo: {
                titleKey: 'META.PAGES.ERROR.408.TITLE',
                descriptionKey: 'META.PAGES.ERROR.408.DESCRIPTION',
                robots: 'noindex, nofollow'
              }
            }
          },
          { path: 'maintenance-error',
            loadComponent: () => import(
              '@shared/error-handler/error-views/maintenance-error/maintenance-error.component')
              .then(m => m.MaintenanceErrorComponent),
            data: {
              seo: {
                titleKey: 'META.PAGES.ERROR.503.TITLE',
                descriptionKey: 'META.PAGES.ERROR.503.DESCRIPTION',
                robots: 'noindex, nofollow'
              }
            }
          }
        ]
      },
    ]
  },

  // --- WILDCARD ROUTE ---
  {
    path: '**',
    redirectTo: '/error/unfound-error'
  }
];
