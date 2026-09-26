import { inject } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

/**
 * The AngularJS `FormController` surface the ported templates read
 * (`theForm.$invalid`, `theForm.$dirty`, `theForm.name.$error`, `theForm.$setPristine()`),
 * answered live from an Angular `NgForm`.
 */
export interface LegacyForm {
  readonly $invalid: boolean;
  readonly $valid: boolean;
  readonly $dirty: boolean;
  readonly $pristine: boolean;
  $setPristine(): void;
  $setDirty(): void;
  readonly [control: string]: any;
}

/** Wraps `form` so code written against `FormController` keeps working. */
export function legacyForm(form: NgForm): LegacyForm {
  const control = (name: string) => {
    const c = form.controls[name];
    return c ? { $error: c.errors ?? {}, $invalid: c.invalid, $valid: c.valid, $dirty: c.dirty, $touched: c.touched } : undefined;
  };
  return new Proxy({} as LegacyForm, {
    get(_target, key) {
      switch (key) {
        case '$invalid':
          return !!form.invalid;
        case '$valid':
          return !!form.valid;
        case '$dirty':
          return !!form.dirty;
        case '$pristine':
          return !!form.pristine;
        case '$setPristine':
          return () => form.form.markAsPristine();
        case '$setDirty':
          return () => form.form.markAsDirty();
        case 'ngForm':
          return form;
        default:
          return typeof key === 'string' ? control(key) : undefined;
      }
    },
  });
}

/**
 * `viewProviders` for an entity details component (tb-device, tb-asset, …) whose
 * `ngModel` inputs must join the form of the page that hosts it — the grid's
 * details form, or an add dialog's `<form>` — as they did under AngularJS.
 */
export const joinParentForm = [
  { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true, optional: true }) },
];
