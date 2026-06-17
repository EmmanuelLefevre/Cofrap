import { Component, input, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { merge, startWith, switchMap } from 'rxjs';

import { FormFieldConfig } from '@core/_models/forms/form.model';

import { InputFocusDirective } from '@shared/_directives/input-focus/input-focus.directive';
import { InputTitleCaseDirective } from '@shared/_directives/input-title-case/input-title-case.directive';

@Component({
  selector: 'generic-input',
  imports: [
    ReactiveFormsModule,
    InputFocusDirective,
    InputTitleCaseDirective,
    TranslateModule
  ],
  templateUrl: './generic-input.component.html',
  styleUrl: './generic-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GenericInputComponent {

  protected readonly showPassword = signal(false);
  protected readonly isFocused = signal(false);
  protected readonly isPassword = computed(() => this.type() === 'password');

  readonly autocomplete = input<string>('off');

  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly control = input.required<FormControl>();
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly className = input<string>('');
  readonly behaviors = input<FormFieldConfig['behaviors']>();

  readonly customErrorKey = input<string | null>(null);

  private readonly control$ = toObservable(this.control);

  private readonly _stateTrigger = toSignal(
    this.control$.pipe(
      switchMap(ctrl =>
        merge(ctrl.statusChanges, ctrl.valueChanges).pipe(startWith(null))
      )
    )
  );

  protected readonly inputType = computed(() =>
    (this.isPassword() && this.showPassword()) ? 'text' : this.type()
  );

  protected togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  protected readonly errorKey = computed(() => {
    if (this.customErrorKey()) {
      return this.customErrorKey()!;
    }

    const TYPE = this.type().toUpperCase();

    return `UI.FORMS.ERRORS.${TYPE}_INVALID`;
  });

  /**
   * Helper to know if we display the error
   */
  protected readonly hasError = computed(() => {
    this._stateTrigger();
    const CTRL = this.control();

    return CTRL.invalid && (CTRL.dirty || CTRL.touched) && !this.isFocused();
  });
}
