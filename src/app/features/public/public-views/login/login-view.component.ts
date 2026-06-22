

import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DynamicFormRawValue, FormFieldConfig } from '@core/_models/forms/form.model';
import { LoginCredentials } from '@core/_models/auth/auth.model';
import { User as AppUser } from '@core/_models/user/user.model';

import { AuthService } from '@core/_services/auth/auth.service';
import { SnackbarService } from '@core/_services/snackbar/snackbar.service';

import { CloseButtonComponent } from '@shared/components/close-button/close-button.component';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { Validators } from '@angular/forms';

const MIN_TOTP_LENGTH = 6;
const MAX_TOTP_LENGTH = 6;

const MIN_PASSWORD_LENGTH = 24;

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 15;

@Component({
  selector: 'login-view',
  imports: [
    CloseButtonComponent,
    DynamicFormComponent,
    TranslateModule
  ],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoginViewComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackbarService = inject(SnackbarService);

  private readonly dynamicForm = viewChild(DynamicFormComponent);

  readonly isRegisterMode = signal(false);
  readonly isLoading = signal(false);
  readonly isFlipping = signal(false);

  readonly loginFields = signal<FormFieldConfig[]>([]);

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const usernameParam = params['username'] || '';

      this.loginFields.set([
        {
          name: 'username',
          label: 'UI.FORMS.LABELS.USERNAME',
          type: 'text',
          placeholder: 'UI.FORMS.PLACEHOLDERS.USERNAME',
          initialValue: usernameParam,
          customErrorKey: 'UI.FORMS.ERRORS.USERNAME_INVALID',
          validators: [
            Validators.required,
            Validators.minLength(MIN_USERNAME_LENGTH),
            Validators.maxLength(MAX_USERNAME_LENGTH)
          ],
          behaviors: { titleCase: true, autofocus: true }
        },
        {
          name: 'password',
          label: 'UI.FORMS.LABELS.PASSWORD',
          type: 'password',
          placeholder: 'UI.FORMS.PLACEHOLDERS.PASSWORD',
          customErrorKey: 'UI.FORMS.ERRORS.PASSWORD_FORMAT',
          validators: [
            Validators.required,
            Validators.minLength(MIN_PASSWORD_LENGTH),
            Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).+$')
          ],
          behaviors: {
            hasPasswordToggle: true,
            autofocus: true
          }
        },
        {
          name: 'confirmPassword',
          label: 'UI.FORMS.LABELS.CONFIRM_PASSWORD',
          type: 'password',
          placeholder: 'UI.FORMS.PLACEHOLDERS.CONFIRM_PASSWORD',
          customErrorKey: 'UI.FORMS.ERRORS.PASSWORD_FORMAT',
          validators: [
            // Validators.required,
            Validators.minLength(MIN_PASSWORD_LENGTH),
            Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).+$')
          ],
          behaviors: {
            hasPasswordToggle: true
          }
        },
        {
          name: 'totpCode',
          label: 'UI.FORMS.LABELS.TOTP_CODE',
          type: 'text',
          placeholder: 'UI.FORMS.PLACEHOLDERS.TOTP_CODE',
          customErrorKey: 'UI.FORMS.ERRORS.TOTP_INVALID',
          validators: [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(MIN_TOTP_LENGTH),
            Validators.maxLength(MAX_TOTP_LENGTH)
          ],
        }
      ]);
    });
  }

  onLoginSubmit(data: DynamicFormRawValue): void {
    this.isLoading.set(true);

    const { username: USERNAME, password: PASSWORD, totpCode: TOTP_CODE } = data;

    if (typeof USERNAME !== 'string' || typeof PASSWORD !== 'string' || typeof TOTP_CODE !== 'string') {
      this.isLoading.set(false);
      return;
    }

    const LOGIN_DATA: LoginCredentials = {
      username: USERNAME,
      password: PASSWORD,
      totpCode: TOTP_CODE
    };

    this.authService.login(LOGIN_DATA).subscribe({
      next: (user: AppUser) => {
        this.isLoading.set(false);
        this.router.navigate(['/private/personal-space']);

        this.snackbarService.showNotification(
          'UI.SNACKBAR.AUTH.LOGIN.SUCCESS',
          'logIn-logOut',
          { username: user.username }
        );
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onCancel(): void {
    this.dynamicForm()?.resetForm();
  }
}
