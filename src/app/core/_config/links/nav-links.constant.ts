import { NavLink } from '@core/_models/links/nav-link.model';

export const HEADER_NAV_LINKS: NavLink[] = [
  // --- Publics Links ---
  {
    path: '/home',
    labelKey: 'LAYOUT.HEADER.NAV.WELCOME'
  },
  // --- Privates Links ---
  {
    path: '/private/personal-space',
    labelKey: 'LAYOUT.HEADER.NAV.PRIVATE.ACCOUNT',
    requiresAuth: true
  }
];
