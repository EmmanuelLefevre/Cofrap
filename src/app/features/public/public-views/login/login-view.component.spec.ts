/* eslint-disable @typescript-eslint/no-explicit-any */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Signal, signal as coreSignal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { AuthService } from '@core/_services/auth/auth.service';

import { BackgroundComponent } from '@shared/components/background/background.component';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';

import { LoginViewComponent } from './login-view.component';

const NEXT_TICK_MS = 0;

describe('LoginViewComponent', () => {

  let component: LoginViewComponent;
  let fixture: ComponentFixture<LoginViewComponent>;

  const AUTH_SERVICE_MOCK = {
    generateAccount: vi.fn(),
    currentPasswordQrCode: coreSignal<string | null>(null)
  };

  const queryParamsSubject = new BehaviorSubject<{ username?: string }>({});

  const ACTIVATED_ROUTE_MOCK = {
    queryParams: queryParamsSubject.asObservable()
  };

  const MOCK_DATA = {
    username: 'adminCOFRAP'
  };

  beforeEach(async() => {
    queryParamsSubject.next({});

    await TestBed.configureTestingModule({
      imports: [
        LoginViewComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: AuthService, useValue: AUTH_SERVICE_MOCK },
        { provide: ActivatedRoute, useValue: ACTIVATED_ROUTE_MOCK }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginViewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.clearAllMocks();
    AUTH_SERVICE_MOCK.currentPasswordQrCode.set(null);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the BackgroundComponent wrapper', () => {
    // --- ACT ---
    const backgroundDebugElement = fixture.debugElement.query(By.directive(BackgroundComponent));

    // --- ASSERT ---
    expect(backgroundDebugElement).toBeTruthy();
  });

  it('should have isLoading signal set to false initially', () => {
    // --- ASSERT ---
    expect(component.isLoading()).toBe(false);
  });

  describe('ngOnInit (QueryParams Subscription)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should patch username if present in query parameters', () => {
      // --- ARRANGE ---
      const PATCH_VALUE_SPY = vi.fn();

      interface ComponentWithPrivateForm {
        dynamicForm: Signal<Partial<DynamicFormComponent> | undefined>;
      }

      vi.spyOn((component as unknown as ComponentWithPrivateForm), 'dynamicForm').mockReturnValue({
        patchValue: PATCH_VALUE_SPY
      });

      // --- ACT ---
      queryParamsSubject.next({ username: 'renewedAdmin' });

      vi.advanceTimersByTime(NEXT_TICK_MS);

      // --- ASSERT ---
      expect(PATCH_VALUE_SPY).toHaveBeenCalledWith({ username: 'renewedAdmin' });
    });
  });

  describe('onFormSubmit()', () => {

    it('should call authService.generateAccount and stop loading on success', () => {
      // --- ARRANGE ---
      AUTH_SERVICE_MOCK.generateAccount.mockReturnValue(of({}));

      // --- ACT ---
      component.onFormSubmit(MOCK_DATA);

      // --- ASSERT ---
      expect(AUTH_SERVICE_MOCK.generateAccount).toHaveBeenCalledWith(MOCK_DATA.username);
      expect(component.isLoading()).toBe(false);
    });

    it('should stop loading on error', () => {
      // --- ARRANGE ---
      AUTH_SERVICE_MOCK.generateAccount.mockReturnValue(throwError(() => new Error('API Error')));

      // --- ACT ---
      component.onFormSubmit(MOCK_DATA);

      // --- ASSERT ---
      expect(AUTH_SERVICE_MOCK.generateAccount).toHaveBeenCalledWith(MOCK_DATA.username);
      expect(component.isLoading()).toBe(false);
    });

    it('should abort and not call generateAccount if data fields are missing', () => {
      // --- ARRANGE ---
      const INVALID_DATA = { username: '' } as any;

      // --- ACT ---
      component.onFormSubmit(INVALID_DATA);

      // --- ASSERT ---
      expect(AUTH_SERVICE_MOCK.generateAccount).not.toHaveBeenCalled();
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('onCancel()', () => {
    it('should call resetForm on the dynamicForm viewChild', () => {
      // --- ARRANGE ---
      const RESET_SPY = vi.fn();

      interface ComponentWithPrivateForm {
        dynamicForm: Signal<Partial<DynamicFormComponent> | undefined>;
      }

      vi.spyOn((component as unknown as ComponentWithPrivateForm), 'dynamicForm')
        .mockReturnValue({ resetForm: RESET_SPY });

      // --- ACT ---
      component.onCancel();

      // --- ASSERT ---
      expect(RESET_SPY).toHaveBeenCalled();
    });
  });

  describe('resetView()', () => {
    it('should clear the qr code signal and reset the form', () => {
      // --- ARRANGE ---
      AUTH_SERVICE_MOCK.currentPasswordQrCode.set('existing-qr-code');
      const RESET_SPY = vi.fn();

      interface ComponentWithPrivateForm {
        dynamicForm: Signal<Partial<DynamicFormComponent> | undefined>;
      }

      vi.spyOn((component as unknown as ComponentWithPrivateForm), 'dynamicForm')
        .mockReturnValue({ resetForm: RESET_SPY });

      // --- ACT ---
      component.resetView();

      // --- ASSERT ---
      expect(AUTH_SERVICE_MOCK.currentPasswordQrCode()).toBeNull();
      expect(RESET_SPY).toHaveBeenCalled();
    });
  });
});

