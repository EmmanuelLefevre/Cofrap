import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'background',
  imports: [],
  templateUrl: './background.component.html',
  styleUrl: './background.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BackgroundComponent {}
