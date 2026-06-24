import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class FormValidationService {

  passwordMatch(otherFieldName: string): ValidatorFn {
    return (control: AbstractControl): Record<string, boolean> | null => {

      console.log(`[Validateur] Valeur tapée : "${control.value}"`);

      if (!control.parent) {
        return null;
      }

      const otherControl = control.parent.get(otherFieldName);

      if (!otherControl) {
        return null;
      }

      if (control.value !== otherControl.value) {
        return { passwordMismatch: true };
      }

      return null;
    };
  }
}
