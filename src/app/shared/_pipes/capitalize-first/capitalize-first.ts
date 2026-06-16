import { Pipe, PipeTransform } from '@angular/core';

const FIRST_CHAR_INDEX = 0;
const AFTER_FIRST_CHAR_INDEX = 1;

@Pipe({
  name: 'capitalizeFirst',
  standalone: true,
})

export class CapitalizeFirstPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';

    return value.charAt(FIRST_CHAR_INDEX).toUpperCase() + value.slice(AFTER_FIRST_CHAR_INDEX);
  }
}
