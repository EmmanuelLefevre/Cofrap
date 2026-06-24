import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class FormValidationService {

  private readonly subscribedControls = new WeakSet<AbstractControl>();

  passwordMatch(otherFieldName: string): ValidatorFn {

    return (control: AbstractControl): Record<string, boolean> | null => {

      const parent = control.parent;
      if (!parent) {
        return null;
      }

      const otherControl = control.parent.get(otherFieldName);
      if (!otherControl) {
        return null;
      }

      if (!this.subscribedControls.has(control)) {
        this.subscribedControls.add(control);

        otherControl.valueChanges.subscribe(() => {
          control.updateValueAndValidity();
        });
      }

      // --- VALIDATION PURE ---
      if (control.value && control.value !== otherControl.value) {
        return { passwordMismatch: true };
      }

      return null;
    };
  }
}
