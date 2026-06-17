import { NgControl } from '@angular/forms';
import { Directive, ElementRef, EventEmitter, HostListener, inject, input, Output } from '@angular/core';

const FIRST_CHAR_INDEX = 0;
const NEXT_CHAR_OFFSET = 1;
const NOT_FOUND_INDEX = -1;

@Directive({
  selector: '[inputTitleCase]',
})

export class InputTitleCaseDirective {
  @Output() readonly ngModelChange = new EventEmitter();

  private readonly el = inject(ElementRef);
  private readonly control = inject(NgControl);

  readonly inputTitleCase = input<boolean | undefined>(true);

  @HostListener('input') onInput(): void {
    if (this.inputTitleCase() === false) {
      return;
    }

    const rawValue = this.el.nativeElement.value;

    if (rawValue) {
      const start = this.el.nativeElement.selectionStart;
      const end = this.el.nativeElement.selectionEnd;

      const transformedText = this.transformTitleCase(rawValue);

      if (rawValue !== transformedText) {
        // Vue update (DOM)
        this.el.nativeElement.value = transformedText;

        // Model update (Angular Forms)
        this.control.control?.setValue(transformedText, {
          emitEvent: false,
          emitModelToViewChange: true,
          emitViewToModelChange: true
        });

        this.el.nativeElement.setSelectionRange(start, end);
      }
    }
  }

  transformTitleCase(text: string): string {
    if (!text) return '';

    return text
      .split(' ')
      .map(word => {
        let transformedWord = word;

        // Apostrophes and hyphens management (e.g.: Jean-Luc,  O'Connor)
        transformedWord = this.capitalizeAfterChar(transformedWord, '-');
        transformedWord = this.capitalizeAfterChar(transformedWord, '\'');

        // Capitalize first letter
        return transformedWord.charAt(FIRST_CHAR_INDEX).toUpperCase() +
          transformedWord.slice(NEXT_CHAR_OFFSET);
      })
      .join(' ');
  }

  private capitalizeAfterChar(word: string, char: string): string {
    const INDEX = word.indexOf(char);

    // Using named constants (no variable assigned to object injection)
    if (INDEX !== NOT_FOUND_INDEX && INDEX < word.length - NEXT_CHAR_OFFSET) {
      const NEXT_INDEX = INDEX + NEXT_CHAR_OFFSET;

      return word.substring(FIRST_CHAR_INDEX, NEXT_INDEX) +
        word.charAt(NEXT_INDEX).toUpperCase() +
        word.substring(NEXT_INDEX + NEXT_CHAR_OFFSET);
    }
    return word;
  }
}
