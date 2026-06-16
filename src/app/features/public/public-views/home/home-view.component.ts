import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { BackgroundComponent } from '@shared/components/background/background.component';

@Component({
  selector: 'home-view',
  imports: [
    BackgroundComponent,
    CommonModule,
    NgOptimizedImage,
    TranslateModule
  ],
  templateUrl: './home-view.component.html',
  styleUrl: './home-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HomeViewComponent {

  readonly appNameKey = signal('META.DEFAULT.APP_NAME');

}
