import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

import { BackgroundComponent } from '@shared/components/background/background.component';
import { HomeViewComponent } from './home-view.component';

describe('HomeViewComponent', () => {

  let component: HomeViewComponent;
  let fixture: ComponentFixture<HomeViewComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [
        HomeViewComponent,
        TranslateModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeViewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the default appNameKey signal value', () => {
    expect(component.appNameKey()).toBe('META.DEFAULT.APP_NAME');
  });

  it('should render the BackgroundComponent wrapper', () => {
    // --- ACT ---
    const backgroundDebugElement = fixture.debugElement.query(By.directive(BackgroundComponent));

    // --- ASSERT ---
    expect(backgroundDebugElement).toBeTruthy();
  });

  it('should render the logo image with the correct ngSrc path', () => {
    // --- ACT ---
    const logoElement = fixture.debugElement.query(By.css('.home__logo')).nativeElement;

    // --- ASSERT ---
    expect(logoElement.getAttribute('ngSrc')).toBe('assets/logos/logo.png');
  });

  describe('Translations', () => {
    it('should render the correct translation key for the title', () => {
      // --- ACT ---
      const titleElement = fixture.debugElement.query(By.css('.home__title')).nativeElement;

      // --- ASSERT ---
      expect(titleElement.textContent.trim()).toBe('PAGES.HOME.HERO.TITLE');
    });

    it('should render the app name key and the description translation key', () => {
      // --- ACT ---
      const accentElement = fixture.debugElement.query(By.css('.home__accent')).nativeElement;
      const descriptionElement = fixture.debugElement.query(By.css('.home__description')).nativeElement;

      // --- ASSERT ---
      expect(accentElement.textContent.trim()).toBe('META.DEFAULT.APP_NAME');
      expect(descriptionElement.textContent).toContain('PAGES.HOME.HERO.DESCRIPTION');
    });

    it('should set the logo alt attribute to the app name translation key', () => {
      // --- ACT ---
      const logoElement = fixture.debugElement.query(By.css('.home__logo')).nativeElement;

      // --- ASSERT ---
      expect(logoElement.getAttribute('alt')).toBe('META.DEFAULT.APP_NAME');
    });
  });
});
