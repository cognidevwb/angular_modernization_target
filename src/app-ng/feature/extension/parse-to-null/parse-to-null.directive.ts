import { Directive, ElementRef, forwardRef, inject } from '@angular/core';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Ported from the AngularJS directive `parseToNull` (module `thingsboard.extension`) in src/app/extension/index.js:24:
 * an emptied field reaches the model as `null` instead of `''`. The element keeps its native
 * value handling (a number input still yields a number).
 */
@Directive({
  selector: '[parse-to-null]',
  standalone: true,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ParseToNullDirective), multi: true }],
})
export class ParseToNullDirective extends DefaultValueAccessor {
  private readonly host = inject<ElementRef<HTMLInputElement>>(ElementRef);

  override registerOnChange(fn: (_: any) => {}): void {
    this.onChange = (value: any) => fn(this.parse(value));
  }

  private parse(value: any): any {
    if (value === '' || value === null || value === undefined) {
      return null;
    }
    return this.host.nativeElement.type === 'number' ? parseFloat(value) : value;
  }
}
