import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '@core/_services/auth/auth.service';
import { PublicLayoutComponent } from './public-layout.component';

describe('PublicLayoutComponent', () => {

  let component: PublicLayoutComponent;
  let fixture: ComponentFixture<PublicLayoutComponent>;

  const AUTH_SERVICE_MOCK = {
    isAuthenticated: vi.fn(() => false),
    currentUser: vi.fn(() => null)
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [
        PublicLayoutComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: AUTH_SERVICE_MOCK }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PublicLayoutComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Template rendering', () => {
    it('should render the header-nav component', () => {
      // --- ACT ---
      const headerNav = fixture.debugElement.query(By.css('header-nav'));

      // --- ASSERT ---
      expect(headerNav).toBeTruthy();
    });

    it('should render the router-outlet inside main tag', () => {
      // --- ACT ---
      const routerOutlet = fixture.debugElement.query(By.css('main.public-layout__main router-outlet'));

      // --- ASSERT ---
      expect(routerOutlet).toBeTruthy();
    });

    it('should render the scroll-to-top component', () => {
      // --- ACT ---
      const scrollToTop = fixture.debugElement.query(By.css('scroll-to-top'));

      // --- ASSERT ---
      expect(scrollToTop).toBeTruthy();
    });

    it('should render the main-footer component', () => {
      // --- ACT ---
      const mainFooter = fixture.debugElement.query(By.css('main-footer'));

      // --- ASSERT ---
      expect(mainFooter).toBeTruthy();
    });
  });
});
