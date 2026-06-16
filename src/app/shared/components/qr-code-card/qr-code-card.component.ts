import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'qr-code-card',
  imports: [
    TranslateModule
  ],
  templateUrl: './qr-code-card.component.html',
  styleUrls: ['./qr-code-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QrCodeCardComponent {

  private readonly sanitizer = inject(DomSanitizer);

  public readonly copied = output<string>();

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

  onCopy(): void {
    navigator.clipboard.writeText(this.rawValue());
    this.copied.emit(this.rawValue());
  }
}
