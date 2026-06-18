import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormRawValue, FormFieldConfig } from '@core/_models/forms/form.model';
import { AuthService } from '@core/_services/auth/auth.service';
import { SnackbarService } from '@core/_services/snackbar/snackbar.service';

import { BackgroundComponent } from '@shared/components/background/background.component';
import { CloseButtonComponent } from '@app/shared/components/close-button/close-button.component';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { MainButtonComponent } from '@app/shared/shared';
import { QrCodeCardComponent } from '@shared/components/qr-code-card/qr-code-card.component';
import { Validators } from '@angular/forms';

const HTTP_STATUS_CONFLICT = 409;
const HTTP_STATUS_UNAUTHORIZED = 401;

const MIN_TOTP_LENGTH = 6;
const MAX_TOTP_LENGTH = 6;

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 15;

const FLIP_ANIMATION_DURATION_MS = 800;
const FLIP_ANIMATION_MIDPOINT_RATIO = 0.5;
const FLIP_ANIMATION_MIDPOINT_MS = FLIP_ANIMATION_DURATION_MS * FLIP_ANIMATION_MIDPOINT_RATIO;

type FlowStep = 'INIT' | 'PWD_DISPLAY' | 'MFA_DISPLAY';

@Component({
  selector: 'create-account-view',
  imports: [
    BackgroundComponent,
    CloseButtonComponent,
    DynamicFormComponent,
    MainButtonComponent,
    TranslateModule,
    QrCodeCardComponent
  ],
  templateUrl: './create-account-view.component.html',
  styleUrl: './create-account-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateAccountViewComponent {

  private readonly dynamicForm = viewChild(DynamicFormComponent);
  private readonly router = inject(Router);
  private readonly snackbar = inject(SnackbarService);

  public readonly authService = inject(AuthService);

  readonly currentUsername = signal<string>('');
  readonly flowStep = signal<FlowStep>('INIT');
  readonly isFlipping = signal(false);
  readonly isLoading = signal(false);
  readonly isPasswordConfirmed = signal(false);

  readonly usernameField: FormFieldConfig[] = [
    {
      name: 'username',
      label: 'UI.FORMS.LABELS.USERNAME',
      type: 'text',
      placeholder: 'UI.FORMS.PLACEHOLDERS.USERNAME',
      initialValue: '',
      customErrorKey: 'UI.FORMS.ERRORS.USERNAME_INVALID',
      validators: [
        Validators.required,
        Validators.minLength(MIN_USERNAME_LENGTH),
        Validators.maxLength(MAX_USERNAME_LENGTH)
      ],
      behaviors: {
        titleCase: true,
        autofocus: true
      }
    }
  ];

  readonly totpField: FormFieldConfig[] = [
    {
      name: 'totpCode',
      label: 'UI.FORMS.LABELS.TOTP_CODE',
      type: 'text',
      placeholder: 'UI.FORMS.PLACEHOLDERS.TOTP_CODE',
      initialValue: '',
      customErrorKey: 'UI.FORMS.ERRORS.TOTP_INVALID',
      validators: [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(MIN_TOTP_LENGTH),
        Validators.maxLength(MAX_TOTP_LENGTH)
      ],
      behaviors: {
        autofocus: true
      }
    }
  ];

  // Step 1 : username submission
  onUsernameSubmit(data: DynamicFormRawValue): void {
    this.isLoading.set(true);
    const username = data['username'] as string;
    this.currentUsername.set(username);

    this.authService.generateAccount(username).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.triggerFlip('PWD_DISPLAY');
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.snackbar.showNotification(
          err.status === HTTP_STATUS_CONFLICT ? 'UI.SNACKBAR.AUTH.ACCOUNT_EXISTS' : 'ERROR',
          'red-alert'
        );
      }
    });
  }

  // Step 2 : password copy confirmation
  confirmPasswordNoted(): void {
    const username = this.currentUsername();
    this.isLoading.set(true);

    this.authService.generateMfa(username).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.triggerFlip('MFA_DISPLAY');
      }
    });
  }

  // Step 3 : TOTP submission
  onTotpSubmit(data: DynamicFormRawValue): void {
    this.isLoading.set(true);
    const username = this.currentUsername();
    const totpCode = data['totpCode'] as string;

    this.authService.verifyMfa(username, totpCode).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.snackbar.showNotification(
          'UI.SNACKBAR.AUTH.ACCOUNT_CREATED', 'created', { username }
        );
        this.router.navigate(['/login'], { queryParams: { username: username } });
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);

        if (err.status === HTTP_STATUS_UNAUTHORIZED) {
          this.snackbar.showNotification('UI.SNACKBAR.AUTH.OTP_INVALID', 'red-alert');
        }
        else {
          this.snackbar.showNotification('UI.ERROR.GENERAL_ERROR', 'red-alert');
        }
      }
    });
  }

  onCancel(): void {
    this.authService.currentPasswordQrCode.set(null);
    this.authService.currentRawPassword.set(null);
    this.authService.currentMfaQrCode.set(null);
    this.isPasswordConfirmed.set(false);
    this.dynamicForm()?.resetForm();
    this.flowStep.set('INIT');
  }

  resetView(): void {
    this.authService.currentPasswordQrCode.set(null);
    this.dynamicForm()?.resetForm();
  }

  private triggerFlip(nextStep: FlowStep): void {
    if (this.isFlipping()) return;

    this.isFlipping.set(true);

    setTimeout(() => {
      this.flowStep.set(nextStep);
    }, FLIP_ANIMATION_MIDPOINT_MS);

    setTimeout(() => {
      this.isFlipping.set(false);
    }, FLIP_ANIMATION_DURATION_MS);
  }
}
