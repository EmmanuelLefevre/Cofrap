import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
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

  public readonly confirmToggled = output<boolean>();
  public readonly copied = output<string>();

  public readonly showCheckbox = input<boolean>(false);
  public readonly showRawValue = input<boolean>(true);
  public readonly showCopyButton = input<boolean>(true);

  qrCode = input.required<string>();
  rawValue = input.required<string>();
  title = input.required<string>();

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
      this.snackbar.showNotification('UI.QR_CARD.COPY.SUCCESS', 'created');

      this.copied.emit(this.rawValue());
    }
    catch {
      this.snackbar.showNotification('UI.QR_CARD.COPY.ERROR', 'red-alert');
    }
  }

  onCheckboxChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.confirmToggled.emit(isChecked);
  }
}
