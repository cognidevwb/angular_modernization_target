import { Component, DOCUMENT, effect, inject, model, untracked, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import tinycolor from 'tinycolor2';
import inspector from 'schema-inspector';
import { cloneDeep, isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { MaterialIconsDialogComponent } from '../material-icons-dialog/material-icons-dialog.component';
import { TbExpandFullscreenDirective } from '../tb-expand-fullscreen/tb-expand-fullscreen.directive';
import { TbJsonFormFieldComponent } from './tb-json-form-field.component';
import { JsonFormContext } from './json-form-context';
import { FormKey, JsonFormItem, JsonFormOptions, mergeSchemaForm, setModelValue, validateBySchema } from './json-form-schema';

/** A settings group of the legacy form (`groupInfoes`): a titled, collapsible section over `form[formIndex]`. */
interface JsonFormGroup {
  info: any;
  items: JsonFormItem[];
  show: boolean;
}

/**
 * Ported from the AngularJS directive `tbJsonForm` (src/app/components/json-form.directive.js), which rendered
 * react-schema-form through ngReact. Renders the JSON-schema form in Angular: `schema` + `form` (+ `groupInfoes`)
 * become fields (tb-json-form-field); every edit is written into `model` in place (the legacy `onModelChange`),
 * the model is validated against the schema and `formControl` gets `$setDirty` / `$setValidity('jsonForm', …)`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-json-form',
  standalone: true,
  imports: [NgTemplateOutlet, TbExpandFullscreenDirective, TbJsonFormFieldComponent],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    tb-json-form .SchemaForm.SchemaFormFullscreen { position: absolute; top: 0; right: 0; bottom: 0; left: 0; }
    tb-json-form .SchemaForm.SchemaFormFullscreen > div:not(.fullscreen-form-field) { display: none !important; }
    tb-json-form .SchemaForm.SchemaFormFullscreen > div.fullscreen-form-field { position: relative; width: 100%; height: 100%; }
    tb-json-form .SchemaForm.SchemaFormFullscreen .fullscreen-form-field .tb-container.fullscreen-form-field,
    tb-json-form .SchemaForm.SchemaFormFullscreen .fullscreen-form-field .json-form-ace-editor { height: 100%; }
    tb-json-form .json-form-error { position: relative; bottom: -5px; font-size: 12px; line-height: 12px; color: rgb(244, 67, 54); }
    tb-json-form .tb-container { position: relative; padding: 10px 0; margin-top: 32px; }
    tb-json-form label.tb-label { position: absolute; bottom: 100%; left: 0; color: rgba(0, 0, 0, .54);
      transform: translate3d(0, 6px, 0) scale(.75); transform-origin: left top; }
    tb-json-form label.tb-label.tb-focused { color: rgb(96, 125, 139); }
    tb-json-form label.tb-label.tb-required::after { font-size: 13px; color: rgba(0, 0, 0, .54); vertical-align: top; content: " *"; }
    tb-json-form .tb-head-label { color: rgba(0, 0, 0, .54); }
    tb-json-form .SchemaGroupname { padding: 10px 20px; background-color: #f1f1f1; cursor: pointer; }
    tb-json-form .invisible { display: none; }
    tb-json-form .json-form-ace-editor .title-panel { display: flex; align-items: center; }
    tb-json-form .tb-dropzone { display: block; cursor: pointer; padding: 10px; border: 2px dashed rgba(0, 0, 0, .27); }
  `],
  template: `
    <div style="background: #fff;" tb-expand-fullscreen [tbExpandFullscreen]="isFullscreen" [hideExpandButton]="true" [fullscreenZindex]="100">
      <div name="ReactSchemaForm">
        @if (groups.length) {
          <div>
            @for (group of groups; track $index) {
              <section class="md-whiteframe-z1" style="margin-top: 10px;">
                <div class="SchemaGroupname md-button-toggle" (click)="group.show = !group.show">
                  {{ group.info.GroupTitle }}<span class="pull-right fa fa-chevron-down md-toggle-icon" [class.tb-toggled]="!group.show"></span>
                </div>
                <div style="padding: 20px;" [class.invisible]="!group.show">
                  <ng-container [ngTemplateOutlet]="schemaForm" [ngTemplateOutletContext]="{ $implicit: group.items }"></ng-container>
                </div>
              </section>
            }
          </div>
        } @else if (hasForm) {
          <ng-container [ngTemplateOutlet]="schemaForm" [ngTemplateOutletContext]="{ $implicit: items }"></ng-container>
        }
      </div>
    </div>
    <ng-template #schemaForm let-formItems>
      <div style="width: 100%;" class="SchemaForm" [class.SchemaFormFullscreen]="isFullscreen">
        @for (item of formItems; track item) {
          <div [class.fullscreen-form-field]="context.fullscreenRoot === item">
            <tb-json-form-field [form]="item" [model]="formModel" [ctx]="context" [root]="item"></tb-json-form-field>
          </div>
        }
      </div>
    </ng-template>
  `,
})
export class TbJsonFormDirective {
  readonly schema = model<any>();
  readonly form = model<any>();
  readonly model = model<any>();
  /** The enclosing form: a legacy-shaped `{ $setDirty(), $setValidity(key, valid) }` or an Angular NgForm / AbstractControl. */
  readonly formControl = model<any>();
  readonly groupInfoes = model<any>();
  readonly readonly = model<any>();

  protected readonly document = inject(DOCUMENT);
  protected readonly dialog = inject(MatDialog);

  isFullscreen = false;
  hasForm = false;
  items: JsonFormItem[] = [];
  groups: JsonFormGroup[] = [];
  /** The model the fields read and write (the legacy `formProps.model`). */
  formModel: any = {};
  private options: JsonFormOptions = { formDefaults: { startEmpty: true } };
  private lastInputs?: any[];
  private modelSnapshot: any;
  private watching = false;

  readonly context: JsonFormContext = {
    options: this.options,
    fullscreenRoot: null,
    onChange: (key: FormKey, value: any) => this.onModelChange(key, value),
    onColorClick: (event: Event, color: any, done: (color: any) => void) => this.showColorPicker(event, color, done),
    onIconClick: (event: Event, icon: any, done: (icon: any) => void) => this.openIconDialog(event, icon, done),
    onToggleFullscreen: (root: JsonFormItem | undefined) => {
      this.isFullscreen = !this.isFullscreen;
      this.context.fullscreenRoot = this.isFullscreen && root ? root : null;
    },
  };

  constructor() {
    /** The legacy `$watch`es on readonly / schema / form / groupInfoes and the model reference: rebuild the form. */
    effect(() => {
      const inputs = [this.readonly(), this.schema(), this.form(), this.groupInfoes(), this.model()];
      untracked(() => {
        if (!this.lastInputs || inputs.some((value, i) => value !== this.lastInputs?.[i])) {
          this.updateValues();
          this.lastInputs = [this.readonly(), this.schema(), this.form(), this.groupInfoes(), this.model()];
        }
      });
    });
  }

  /** `formProps.onModelChange(key, val)`: the value goes into the model; the deep model `$watch` validates and marks dirty. */
  private onModelChange(key: FormKey, val: any): void {
    if (typeof val === 'string' && val === '') {
      val = undefined;
    }
    setModelValue(key, this.model(), val);
    this.formModel = this.model();
    if (this.watching && !isEqual(this.model(), this.modelSnapshot)) {
      this.modelSnapshot = cloneDeep(this.model());
      this.validate();
      this.setDirty();
    }
  }

  updateValues(): void {
    this.watching = false;
    const readonly = this.readonly() === true;
    const schema: any = this.schema() ? cloneDeep(this.schema()) : { type: 'object' };
    schema.strict = true;
    const form: any[] = this.form() ? cloneDeep(this.form()) : ['*'];
    const groupInfoes: any[] = this.groupInfoes() ? cloneDeep(this.groupInfoes()) : [];
    const sanitized = inspector.sanitize(schema, this.model() || {}).data;
    if (sanitized !== this.model()) {
      this.model.set(sanitized);
    }
    this.options.formDefaults = { startEmpty: true, readonly };
    this.formModel = sanitized;
    this.hasForm = form.length > 0;
    this.isFullscreen = false;
    this.context.fullscreenRoot = null;
    if (groupInfoes.length > 0) {
      this.items = [];
      this.groups = groupInfoes.map((info: any) => ({ info, items: mergeSchemaForm(schema, form[info.formIndex], this.options), show: true }));
    } else {
      this.groups = [];
      this.items = this.hasForm ? mergeSchemaForm(schema, form, this.options) : [];
    }
    // The fields write their defaults while they initialise; the model watch starts after that.
    setTimeout(() => {
      this.modelSnapshot = cloneDeep(this.model());
      this.watching = true;
      this.validate();
    });
  }

  validate(): void {
    if (this.schema() && this.model()) {
      const result = validateBySchema(this.schema(), this.model());
      this.setValidity('jsonForm', result.valid);
    }
  }

  private setDirty(): void {
    const formControl = this.formControl();
    if (!formControl) {
      return;
    }
    if (typeof formControl.$setDirty === 'function') {
      formControl.$setDirty();
    } else {
      (formControl.form ?? formControl).markAsDirty?.();
    }
  }

  private setValidity(key: string, valid: boolean): void {
    const formControl = this.formControl();
    if (!formControl) {
      return;
    }
    if (typeof formControl.$setValidity === 'function') {
      formControl.$setValidity(key, valid);
      return;
    }
    const control = formControl.form ?? formControl;
    if (typeof control.setErrors === 'function') {
      const errors = { ...(control.errors || {}) };
      if (valid) {
        delete errors[key];
      } else {
        errors[key] = true;
      }
      control.setErrors(Object.keys(errors).length ? errors : null);
    }
  }

  /** `$mdColorPicker.show(…)`: the browser's color picker, starting at the field's color. */
  showColorPicker(event: Event, color: any, done: (color: any) => void): void {
    event?.stopPropagation();
    const colorInput = this.document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = tinycolor(color || '#fff').toHexString();
    colorInput.style.position = 'fixed';
    colorInput.style.opacity = '0';
    colorInput.style.pointerEvents = 'none';
    this.document.body.appendChild(colorInput);
    colorInput.addEventListener('change', () => {
      done(tinycolor(colorInput.value).toRgb());
      colorInput.remove();
    });
    colorInput.addEventListener('blur', () => colorInput.remove());
    colorInput.click();
  }

  openIconDialog(event: Event, icon: any, done: (icon: any) => void): void {
    event?.stopPropagation();
    firstValueFrom(this.dialog.open(MaterialIconsDialogComponent, {
      data: { icon },
      panelClass: 'tb-dialog',
    }).afterClosed()).then((selected?: any) => {
      if (selected !== undefined) {
        done(selected);
      }
    });
  }
}
