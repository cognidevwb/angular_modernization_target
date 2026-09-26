import { Component, input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import beautify from 'js-beautify';
import tinycolor from 'tinycolor2';
import { UiAceDirective, UiAceOptions } from '../ui-ace/ui-ace.directive';
import { fixAceEditor } from '../ui-ace/ace-editor-fix';
import { JsonFormContext } from './json-form-context';
import { copyWithIndex, emptyArrayItem, fieldDefaultValue, JsonFormItem, selectOrSet, validateField } from './json-form-schema';

/** The field types the legacy ReactSchemaForm mapper knew; anything else is logged and skipped. */
const FIELD_TYPES = ['number', 'text', 'password', 'textarea', 'select', 'radios', 'date', 'image', 'checkbox', 'help', 'array',
  'javascript', 'json', 'html', 'css', 'color', 'rc-select', 'fieldset', 'icon'];
const ACE_MODES: Record<string, string> = { javascript: 'javascript', json: 'json', html: 'html', css: 'css' };

interface ArrayRow {
  id: number;
  forms: JsonFormItem[];
}

/**
 * One field of tb-json-form: the Angular form of the legacy React field components under
 * src/app/components/react (json-form-text / -number / -checkbox / -color / -icon / -image / -date /
 * -rc-select / -fieldset / -array / -ace-editor (javascript, json, html, css), and react-schema-form's
 * Select, Radios and Help), with json-form-base-component's value/default/validation rules.
 * Fieldsets and arrays render their items with this same component.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-json-form-field',
  standalone: true,
  imports: [
    NgClass, NgStyle, NgTemplateOutlet, FormsModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRadioModule,
    MatSelectModule, MatTooltipModule, UiAceDirective,
  ],
  templateUrl: './tb-json-form-field.component.html',
})
export class TbJsonFormFieldComponent implements OnInit {
  readonly form = input.required<JsonFormItem>();
  readonly model = input.required<any>();
  readonly ctx = input.required<JsonFormContext>();
  /** The top-level item this field is (nested) under. */
  readonly root = input<JsonFormItem | undefined>(undefined);

  value: any;
  valid = true;
  error: string | null = null;
  focused = false;

  color: any = null;
  icon = '';
  isFull = false;
  aceOptions: UiAceOptions = {};
  private aceEditor: any;
  arrayModel: any[] = [];
  private arrayKeys: number[] = [];
  arrayRows: ArrayRow[] = [];

  get type(): string {
    return this.form().type || '';
  }

  get known(): boolean {
    return FIELD_TYPES.indexOf(this.type) !== -1;
  }

  ngOnInit(): void {
    const form = this.form();
    if (!this.known) {
      console.log('Invalid field: "' + (form.key ? form.key[0] : '') + '"!');
      return;
    }
    if (this.type === 'fieldset' || this.type === 'help' || !form.schema) {
      return;
    }
    this.value = fieldDefaultValue(form, this.model());
    const result = validateField(form, this.value);
    this.valid = !!(result.valid || !this.value);
    this.error = !result.valid && this.value ? result.error?.message ?? null : null;
    this.initType();
    // componentDidMount: the initial value goes into the model once this field has rendered.
    Promise.resolve().then(() => {
      if (this.value !== undefined) {
        this.ctx().onChange(form.key || [], this.value);
      }
      if (this.type === 'array' && form.startEmpty !== true && this.arrayModel.length === 0) {
        this.onAppend();
      }
    });
  }

  private initType(): void {
    const form = this.form();
    switch (this.type) {
      case 'color': {
        const value = this.value ? this.value + '' : null;
        this.color = value != null ? tinycolor(value).toRgb() : null;
        break;
      }
      case 'icon':
        this.icon = this.value ? this.value : '';
        break;
      case 'array':
        this.arrayModel = selectOrSet(form.key || [], this.model()) || [];
        this.arrayKeys = this.arrayModel.map((_v, i) => i);
        this.buildRows();
        break;
      case 'javascript':
      case 'json':
      case 'html':
      case 'css':
        this.value = this.value ? this.value + '' : '';
        this.aceOptions = {
          mode: ACE_MODES[this.type],
          theme: 'github',
          advanced: { enableBasicAutocompletion: true, enableSnippets: true, enableLiveAutocompletion: true },
          onLoad: (editor: any) => {
            this.aceEditor = editor;
            fixAceEditor(editor);
          },
        };
        break;
    }
  }

  /** `form.condition`: the legacy builder skipped a field whose condition evaluated to false. */
  visible(): boolean {
    const form = this.form();
    if (!this.known) {
      return false;
    }
    if (form.condition) {
      try {
        return new Function('model', 'form', 'return (' + form.condition + ');')(this.model(), form) !== false;
      } catch {
        return true;
      }
    }
    return true;
  }

  /** json-form-base-component `onChangeValidate`: the raw value converted by the schema type, validated, handed on. */
  onChangeValidate(raw: any): void {
    const form = this.form();
    const schemaType = form.schema?.type;
    let value: any;
    if (schemaType === 'integer' || schemaType === 'number') {
      if (raw === null || raw === '' || raw === undefined) {
        value = undefined;
      } else if (typeof raw === 'number') {
        value = raw;
      } else {
        value = String(raw).indexOf('.') === -1 ? parseInt(raw, 10) : parseFloat(raw);
      }
    } else {
      value = raw;
    }
    const result = validateField(form, value);
    this.value = value;
    this.valid = result.valid;
    this.error = result.valid ? null : result.error?.message ?? null;
    this.ctx().onChange(form.key || [], value);
  }

  /** json-form-number: only numeric text reaches the model. */
  onNumberInput(text: string): void {
    if (text === null || text === '' || (!isNaN(Number(text)) && isFinite(Number(text)))) {
      this.onChangeValidate(text);
    }
  }

  onDateInput(text: string): void {
    this.onChangeValidate(text ? new Date(text) : undefined);
  }

  dateText(): string {
    const date = this.value ? new Date(this.value) : null;
    return date && !isNaN(date.getTime()) ? date.toISOString().substring(0, 10) : '';
  }

  lastKey(): string {
    const key = this.form().key || [];
    return key.length ? String(key[key.length - 1]) : '';
  }

  fieldClass(base = 'tb-field'): Record<string, boolean> {
    const form = this.form();
    return { [base]: true, 'tb-required': !!form.required, 'tb-readonly': !!form.readonly, 'tb-focused': this.focused };
  }

  colorBackground(): string {
    const c = this.color;
    return c != null ? `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})` : 'rgba(0,0,0,0)';
  }

  colorText(): string {
    return this.color != null ? tinycolor(this.color).toRgbString() : '';
  }

  onColorSwatchClick(event: Event): void {
    if (!this.form().readonly) {
      this.ctx().onColorClick(event, this.color, (color: any) => this.onColorValueChanged(color));
    }
  }

  onColorValueChanged(value: any): void {
    const color = value != null ? tinycolor(value) : null;
    this.color = value;
    let colorValue = '';
    if (color != null && color.getAlpha() != 1) {
      colorValue = color.toRgbString();
    } else if (color != null) {
      colorValue = color.toHexString();
    }
    this.onChangeValidate(colorValue);
  }

  onClearColor(event: Event): void {
    event.stopPropagation();
    this.onColorValueChanged(null);
  }

  onIconContainerClick(event: Event): void {
    this.ctx().onIconClick(event, this.icon, (icon: any) => this.onIconValueChanged(icon));
  }

  onIconValueChanged(value: any): void {
    this.icon = value;
    this.ctx().onChange(this.form().key || [], value);
  }

  onClearIcon(event: Event): void {
    event.stopPropagation();
    this.onIconValueChanged('');
  }

  onImageFile(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length) {
      this.readImage(files[0]);
    }
    (event.target as HTMLInputElement).value = '';
  }

  onImageDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.indexOf('image/') === 0) {
      this.readImage(file);
    }
  }

  private readImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => this.onChangeValidate(reader.result as string);
    reader.readAsDataURL(file);
  }

  onClearImage(event: Event): void {
    event.stopPropagation();
    this.onChangeValidate('');
  }

  onTidy(): void {
    if (!this.form().readonly) {
      const text = this.value || '';
      const tidy = this.type === 'css' ? beautify.css(text, { indent_size: 4 })
        : this.type === 'html' ? beautify.html(text, { indent_size: 4 })
        : this.type === 'javascript' ? beautify.js(text, { indent_size: 4, wrap_line_length: 60 })
        : beautify.js(text, { indent_size: 4 });
      this.onChangeValidate(tidy);
    }
  }

  onToggleFull(): void {
    this.isFull = !this.isFull;
    this.ctx().onToggleFullscreen(this.root() ?? this.form(), this.form());
    setTimeout(() => {
      if (this.aceEditor) {
        this.aceEditor.resize();
        this.aceEditor.renderer.updateFull();
      }
    });
  }

  rcSelectMultiple(): boolean {
    return this.form().schema?.type === 'array';
  }

  onRcSelectChange(value: any): void {
    this.onChangeValidate(this.rcSelectMultiple() ? [...(value || [])] : value);
  }

  onAppend(): void {
    this.arrayModel.push(emptyArrayItem(this.form(), this.ctx().options));
    const next = this.arrayKeys.length ? this.arrayKeys[this.arrayKeys.length - 1] + 1 : 0;
    this.arrayKeys.push(next);
    this.buildRows();
    this.onChangeValidate(this.arrayModel);
  }

  onDelete(index: number): void {
    this.arrayModel.splice(index, 1);
    this.arrayKeys.splice(index, 1);
    this.buildRows();
    this.onChangeValidate(this.arrayModel);
  }

  private buildRows(): void {
    const items: JsonFormItem[] = this.form().items || [];
    this.arrayRows = this.arrayModel.map((_v, i) => ({
      id: this.arrayKeys[i],
      forms: items.map((item) => copyWithIndex(item, i)),
    }));
  }
}
