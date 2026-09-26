import { FormKey, JsonFormItem, JsonFormOptions } from './json-form-schema';

/**
 * What every json-form field is handed by tb-json-form (the legacy `formProps` callbacks of
 * ReactSchemaForm): the model setter, the color/icon pickers, the ace editor fullscreen toggle.
 */
export interface JsonFormContext {
  options: JsonFormOptions;
  /** `formProps.onModelChange(key, val)`. */
  onChange(key: FormKey, value: any): void;
  /** `formProps.onColorClick`: pick a color starting at `color`; `done` gets the picked color. */
  onColorClick(event: Event, color: any, done: (color: any) => void): void;
  /** `formProps.onIconClick`: pick a material icon; `done` gets the picked icon. */
  onIconClick(event: Event, icon: any, done: (icon: any) => void): void;
  /** `formProps.onToggleFullscreen`: the ace field `field` (under the top-level item `root`) enters/leaves fullscreen. */
  onToggleFullscreen(root: JsonFormItem | undefined, field: JsonFormItem): void;
  /** The top-level item whose (nested) ace field is fullscreen, if any. */
  fullscreenRoot: JsonFormItem | null;
}
