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
    // Ajout du préfixe si absent
    const base64 = this.qrCode().startsWith('data:image')
      ? this.qrCode()
      : `data:image/png;base64,${this.qrCode()}`;

    return this.sanitizer.bypassSecurityTrustUrl(base64);
  }

  onCopy(): void {
    navigator.clipboard.writeText(this.rawValue());
    this.copied.emit(this.rawValue());
  }
}
