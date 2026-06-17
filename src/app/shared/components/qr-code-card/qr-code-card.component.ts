import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { SnackbarService } from '@app/core/_services/snackbar/snackbar.service';

import { MainButtonComponent } from '@app/shared/shared';

@Component({
  selector: 'qr-code-card',
  imports: [
    MainButtonComponent,
    TranslateModule
  ],
  templateUrl: './qr-code-card.component.html',
  styleUrls: ['./qr-code-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QrCodeCardComponent {

  private readonly sanitizer = inject(DomSanitizer);
  private readonly snackbar = inject(SnackbarService);

  protected readonly isChecked = signal(false);
  protected readonly isHovered = signal(false);

  public readonly confirmToggled = output<boolean>();
  public readonly copied = output<string>();

  public readonly showCheckbox = input<boolean>(false);
  public readonly showRawValue = input<boolean>(true);
  public readonly showCopyButton = input<boolean>(true);

  qrCode = input.required<string>();
  rawValue = input.required<string>();

  get sanitizedQrCode(): SafeUrl {
    const value = this.qrCode();

    if (value.startsWith('http') || value.startsWith('data:image')) {
      return this.sanitizer.bypassSecurityTrustUrl(value);
    }

    return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${value}`);
  }

  async onCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.rawValue());
      this.snackbar.showNotification('UI.QR_CARD.BACKUP.SUCCESS', 'created');

      this.copied.emit(this.rawValue());

      if (this.showCheckbox() && !this.isChecked()) {
        this.isChecked.set(true);
        this.confirmToggled.emit(true);
      }
    }
    catch {
      this.snackbar.showNotification('UI.QR_CARD.BACKUP.ERROR', 'red-alert');
    }
  }

  onCheckboxChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.isChecked.set(isChecked);
    this.confirmToggled.emit(isChecked);
  }

  protected readonly labelKey = computed(() => {
    if (this.isChecked() && this.isHovered()) {
      return 'UI.QR_CARD.UNCONFIRM_BACKUP';
    }

    return 'UI.QR_CARD.CONFIRM_BACKUP';
  });
}
