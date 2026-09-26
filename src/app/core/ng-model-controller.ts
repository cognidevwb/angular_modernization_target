import { Directive, forwardRef, Provider, Type } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

/**
 * What a legacy directive with `require: 'ngModel'` read from its
 * `ngModelCtrl`, over Angular's forms API: `$viewValue`/`$modelValue`,
 * `$setViewValue(v)` (the value leaves to the form), `$render()` (called when
 * the form writes a value in — override it), `$setValidity(key, ok)` (the
 * errors the control reports), `$setDirty/$setTouched/$setPristine`,
 * `$isEmpty`. A subclass adds `providers: ngModelProviders(TheClass)`.
 */
@Directive()
export abstract class NgModelController implements ControlValueAccessor, Validator {
  $viewValue: any;
  $modelValue: any;
  $error: Record<string, boolean> = {};
  $valid = true;
  $invalid = false;
  $dirty = false;
  $pristine = true;
  $touched = false;
  $disabled = false;
  $parsers: Array<(v: any) => any> = [];
  $formatters: Array<(v: any) => any> = [];
  $viewChangeListeners: Array<() => void> = [];
  /** ngModelController's `$$lastCommittedViewValue`: what the form last wrote in, or the control last sent out. */
  private lastCommittedViewValue: any;
  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  /** The form wrote a value in: format it and render it (the legacy `$render`). */
  writeValue(value: any): void {
    this.$modelValue = value;
    this.$viewValue = this.lastCommittedViewValue = this.$formatters.reduceRight((v, f) => f(v), value);
    this.$render();
  }

  /** Override: show `$viewValue` in the element. */
  $render(): void {}

  /** As ngModelController's `$commitViewValue`, a value equal to the last committed one changes nothing. */
  $setViewValue(value: any): void {
    this.$viewValue = value;
    if (value === this.lastCommittedViewValue) {
      return;
    }
    this.lastCommittedViewValue = value;
    const model = this.$parsers.reduce((v, p) => p(v), value);
    this.$modelValue = model;
    this.$dirty = true;
    this.$pristine = false;
    this.onChange(model);
    this.$viewChangeListeners.forEach((l) => l());
  }

  $setValidity(key: string, isValid: boolean): void {
    if (isValid) {
      delete this.$error[key];
    } else {
      this.$error[key] = true;
    }
    this.$valid = Object.keys(this.$error).length === 0;
    this.$invalid = !this.$valid;
    this.onValidatorChange();
  }

  $setDirty(): void {
    this.$dirty = true;
    this.$pristine = false;
  }

  $setPristine(): void {
    this.$dirty = false;
    this.$pristine = true;
  }

  $setTouched(): void {
    this.$touched = true;
    this.onTouched();
  }

  $setUntouched(): void {
    this.$touched = false;
  }

  $isEmpty(value: any): boolean {
    return value === undefined || value === '' || value === null || value !== value;
  }

  $validate(): void {
    this.onValidatorChange();
  }

  registerOnChange(fn: (v: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.$disabled = disabled;
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    return this.$valid ? null : { ...this.$error };
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}

/** The providers that make a subclass a form control and a validator. */
export function ngModelProviders(type: Type<any>): Provider[] {
  return [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => type), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => type), multi: true },
  ];
}
