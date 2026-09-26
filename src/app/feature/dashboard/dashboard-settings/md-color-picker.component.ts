import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import tinycolor from 'tinycolor2';

/**
 * The `md-color-picker` field of the dashboard settings (the mdColorPicker directive): a swatch of the
 * colour, its icon and label, and the colour as text; the swatch or the text opens the browser's colour
 * picker (as the other ported colour pickers do). The model keeps the legacy format: an rgb(a) string,
 * the chosen colour taking the alpha the current one had.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: '[md-color-picker]',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MdColorPickerComponent), multi: true }],
  host: { class: 'md-color-picker-input-container', style: 'display: flex; flex-direction: row; align-items: center;' },
  template: `
    <div class="md-color-picker-preview" (click)="open()"
         [style.background]="value || default" style="width: 30px; height: 30px; margin-right: 12px; border-radius: 50%; cursor: pointer; box-shadow: 0 1px 3px rgba(0, 0, 0, .3);"></div>
    <mat-form-field style="flex: 1 1 auto;">
      <mat-label>{{ label }}</mat-label>
      @if (icon) {
        <mat-icon matPrefix class="material-icons" style="margin-right: 8px;">{{ icon }}</mat-icon>
      }
      <input matInput [value]="value || ''" [disabled]="disabled" (click)="openOnInput && open()" (change)="onText($any($event.target).value)">
    </mat-form-field>
  `,
})
export class MdColorPickerComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() icon = '';
  @Input() default = '';
  /** `open-on-input="true"`: a click on the text opens the picker too. */
  @Input('open-on-input') openOnInputAttr: any;

  private readonly document = inject(DOCUMENT);
  protected readonly element = inject(ElementRef);
  value: string | null = null;
  disabled = false;
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  get openOnInput(): boolean {
    return this.openOnInputAttr === true || this.openOnInputAttr === 'true';
  }

  writeValue(value: any): void {
    this.value = value ?? null;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  onText(text: string): void {
    const color = tinycolor(text);
    this.commit(text && color.isValid() ? color.toRgbString() : null);
  }

  open(): void {
    if (this.disabled) {
      return;
    }
    const current = tinycolor(this.value || this.default || '#fff');
    const input = this.document.createElement('input');
    input.type = 'color';
    input.value = current.toHexString();
    input.style.position = 'fixed';
    input.style.opacity = '0';
    input.style.pointerEvents = 'none';
    this.document.body.appendChild(input);
    input.addEventListener('change', () => {
      const picked = tinycolor(input.value);
      picked.setAlpha(current.getAlpha());
      this.commit(picked.toRgbString());
      input.remove();
    });
    input.addEventListener('blur', () => input.remove());
    input.click();
  }

  private commit(value: string | null): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
