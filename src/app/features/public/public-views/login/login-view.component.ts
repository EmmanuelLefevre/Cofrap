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
import { QrCodeCardComponent } from '@shared/components/qr-code-card/qr-code-card.component';

const HTTP_STATUS_CONFLICT = 409;

type FlowStep = 'INIT' | 'PWD_DISPLAY' | 'MFA_DISPLAY';

@Component({
  selector: 'login-view',
  imports: [
    BackgroundComponent,
    CloseButtonComponent,
    DynamicFormComponent,
    TranslateModule,
    QrCodeCardComponent
  ],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoginViewComponent {

  private readonly dynamicForm = viewChild(DynamicFormComponent);
  private readonly router = inject(Router);
  private readonly snackbar = inject(SnackbarService);

  public readonly authService = inject(AuthService);

  readonly flowStep = signal<FlowStep>('INIT');
  readonly isLoading = signal(false);
  readonly currentUsername = signal<string>('');

  readonly loginFields: FormFieldConfig[] = [
    {
      name: 'username',
      label: 'UI.FORMS.LABELS.USERNAME',
      type: 'text',
      placeholder: 'UI.FORMS.PLACEHOLDERS.USERNAME',
      initialValue: ''
    }
  ];

  onFormSubmit(data: DynamicFormRawValue): void {
    this.isLoading.set(true);
    const username = data['username'] as string;
    this.currentUsername.set(username);

    this.authService.generateAccount(username).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.flowStep.set('PWD_DISPLAY');
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

  confirmPasswordNoted(): void {
    const username = this.currentUsername();
    this.isLoading.set(true);

    this.authService.generateMfa(username).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.flowStep.set('MFA_DISPLAY');
      }
    });
  }

  onCancel(): void {
    this.authService.currentPasswordQrCode.set(null);
    this.authService.currentRawPassword.set(null);
    this.authService.currentMfaQrCode.set(null);
    this.dynamicForm()?.resetForm();
    this.flowStep.set('INIT');
  }

  resetView(): void {
    this.authService.currentPasswordQrCode.set(null);
    this.dynamicForm()?.resetForm();
  }

  finalize(): void {
    this.router.navigate(['/account']);
  }
}
