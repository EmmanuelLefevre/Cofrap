import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { BackgroundComponent } from '@shared/components/background/background.component';

@Component({
  selector: 'personal-space',
  imports: [
    BackgroundComponent,
    CommonModule,
    NgOptimizedImage,
    TranslateModule
  ],
  templateUrl: './personal-space.component.html',
  styleUrl: './personal-space.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PersonalSpaceComponent {

  readonly appNameKey = signal('META.DEFAULT.APP_NAME');

}
