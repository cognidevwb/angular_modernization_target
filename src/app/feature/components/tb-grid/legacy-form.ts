import { inject } from '@angular/core';
import { AbstractControl, ControlContainer, NgForm } from '@angular/forms';

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
  /** The legacy `<form name="…">` (the add dialogs' `theForm`), when the wrapper was given one. */
  readonly $name: string | undefined;
  $setPristine(): void;
  $setDirty(): void;
  $setValidity(key: string, valid: boolean): void;
  readonly [control: string]: any;
}

/** Wraps `form` so code written against `FormController` keeps working; `name` is its legacy `$name`. */
export function legacyForm(form: NgForm, name?: string): LegacyForm {
  const control = (name: string) => {
    const c = form.controls[name];
    return c
      ? {
          $error: c.errors ?? {},
          $invalid: c.invalid,
          $valid: c.valid,
          $dirty: c.dirty,
          $pristine: c.pristine,
          $touched: c.touched,
          $setValidity: (key: string, valid: boolean) => setValidity(c, key, valid),
          $setDirty: () => c.markAsDirty(),
          $setPristine: () => c.markAsPristine(),
          $setTouched: () => c.markAsTouched(),
        }
      : undefined;
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
        case '$name':
          return name;
        case '$setPristine':
          return () => form.form.markAsPristine();
        case '$setDirty':
          return () => form.form.markAsDirty();
        case '$setValidity':
          return (key: string, valid: boolean) => setValidity(form.form, key, valid);
        case '$error':
          return form.errors ?? {};
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

/** `ngModel.$setValidity(key, valid)`: sets or clears the `key` error, leaving the control's other errors. */
function setValidity(control: AbstractControl, key: string, valid: boolean): void {
  const errors = { ...(control.errors ?? {}) };
  if (valid) {
    delete errors[key];
  } else {
    errors[key] = true;
  }
  control.setErrors(Object.keys(errors).length ? errors : null);
}

const lateForms = new WeakMap<object, { form: NgForm | null }>();

/**
 * The legacy `theForm` of a component whose `<form name="theForm" #theFormRef="ngForm">` is a view child:
 * usable from the constructor on (a form not rendered yet reads as valid and pristine, and its setters do
 * nothing), and live over the NgForm once `attachLegacyForm` hands it over.
 */
export function lateLegacyForm(name?: string): LegacyForm {
  const slot: { form: NgForm | null } = { form: null };
  const pristine: Record<string, any> = { $invalid: false, $valid: true, $dirty: false, $pristine: true, $name: name, $error: {} };
  const proxy = new Proxy({} as LegacyForm, {
    get(_target, key) {
      if (slot.form) {
        return (legacyForm(slot.form, name) as any)[key];
      }
      if (typeof key === 'string' && key in pristine) {
        return pristine[key];
      }
      return typeof key === 'string' && key.startsWith('$') ? () => undefined : undefined;
    },
  });
  lateForms.set(proxy, slot);
  return proxy;
}

/** Hands the rendered NgForm to a `lateLegacyForm` (from a `@ViewChild('theFormRef')` setter). */
export function attachLegacyForm(legacy: LegacyForm, form: NgForm | undefined | null): void {
  const slot = lateForms.get(legacy);
  if (slot) {
    slot.form = form ?? null;
  }
}
