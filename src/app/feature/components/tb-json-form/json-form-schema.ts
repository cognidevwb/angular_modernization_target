import { cloneDeep, isEqual } from 'lodash-es';

/**
 * The JSON-schema form model the legacy tb-json-form rendered through react-schema-form 0.3:
 * `merge(schema, form)` (schema defaults + the form definition → one form object per field),
 * `selectOrSet` (read/write a model value by key path), `validate` / `validateBySchema`
 * (tv4-style validation) and the field default-value rule of json-form-base-component.jsx.
 * Pure functions, no framework.
 */

export type FormKey = Array<string | number>;

/** One merged form item (react-schema-form's form object). */
export interface JsonFormItem {
  key?: FormKey;
  type?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  schema?: any;
  items?: any[];
  titleMap?: Array<{ name: string; value: any }>;
  condition?: string;
  startEmpty?: boolean;
  default?: any;
  validationMessage?: string;
  arrayIndex?: number;
  [prop: string]: any;
}

export interface ValidationResult {
  valid: boolean;
  error: { message: string; dataPath: string } | null;
}

export interface JsonFormOptions {
  formDefaults?: Record<string, any>;
  supressPropertyTitles?: boolean;
  setSchemaDefaults?: boolean;
}

/** ObjectPath.parse: `a.b[0]['c']` → `['a', 'b', '0', 'c']`; `a[].b` → `['a', '', 'b']`. */
export function parseKey(key: string): string[] {
  const parts: string[] = [];
  const re = /\[\s*(['"])(.*?)\1\s*\]|\[\s*(\d*)\s*\]|([^.[\]]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(key)) !== null) {
    parts.push(m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4]);
  }
  return parts;
}

function keyId(path: FormKey): string {
  return JSON.stringify(path.map((p) => String(p)));
}

function stripNullType(type: any): any {
  if (Array.isArray(type) && type.length === 2) {
    if (type[0] === 'null') {
      return type[1];
    }
    if (type[1] === 'null') {
      return type[0];
    }
  }
  return type;
}

function enumToTitleMap(enm: any[]): Array<{ name: string; value: any }> {
  return enm.map((name) => ({ name, value: name }));
}

function canonicalTitleMap(titleMap: any, originalEnum?: any[]): Array<{ name: string; value: any }> {
  if (Array.isArray(titleMap)) {
    return titleMap;
  }
  if (originalEnum) {
    return originalEnum.map((value) => ({ name: titleMap[value], value }));
  }
  return Object.keys(titleMap).map((k) => ({ name: k, value: titleMap[k] }));
}

interface DefaultsContext {
  path: FormKey;
  required: boolean;
  lookup: Record<string, JsonFormItem>;
  global: JsonFormOptions;
}

function stdFormObj(name: string, schema: any, options: DefaultsContext): JsonFormItem {
  const f: JsonFormItem = options.global.formDefaults ? cloneDeep(options.global.formDefaults) : {};
  f.title = options.global.supressPropertyTitles === true ? schema.title : schema.title || name;
  if (schema.description) {
    f.description = schema.description;
  }
  if (options.required === true || schema.required === true) {
    f.required = true;
  }
  if (schema.maxLength) {
    f['maxlength'] = schema.maxLength;
  }
  if (schema.minLength) {
    f['minlength'] = schema.minLength;
  }
  if (schema.readOnly || schema.readonly) {
    f.readonly = true;
  }
  if (schema.minimum) {
    f['minimum'] = schema.minimum + (schema.exclusiveMinimum ? 1 : 0);
  }
  if (schema.maximum) {
    f['maximum'] = schema.maximum - (schema.exclusiveMaximum ? 1 : 0);
  }
  if (schema.validationMessage) {
    f.validationMessage = schema.validationMessage;
  }
  if (schema.enumNames) {
    f.titleMap = canonicalTitleMap(schema.enumNames, schema['enum']);
  }
  f.schema = schema;
  return f;
}

function leaf(type: string, name: string, schema: any, options: DefaultsContext): JsonFormItem {
  const f = stdFormObj(name, schema, options);
  f.key = options.path;
  f.type = type;
  options.lookup[keyId(options.path)] = f;
  return f;
}

function defaultFormDefinition(name: string, schema: any, options: DefaultsContext): JsonFormItem | undefined {
  const type = stripNullType(schema.type);
  let def: JsonFormItem | undefined;
  switch (type) {
    case 'string':
      def = leaf(schema['enum'] ? 'select' : 'text', name, schema, options);
      if (schema['enum'] && !def.titleMap) {
        def.titleMap = enumToTitleMap(schema['enum']);
      }
      break;
    case 'number':
    case 'integer':
      def = leaf('number', name, schema, options);
      break;
    case 'boolean':
      def = leaf('checkbox', name, schema, options);
      break;
    case 'date':
      def = leaf('date', name, schema, options);
      break;
    case 'object':
      def = fieldsetDefinition(name, schema, options);
      break;
    case 'array':
      def = arrayDefinition(name, schema, options);
      break;
  }
  if (def && def.schema['x-schema-form'] && typeof def.schema['x-schema-form'] === 'object') {
    def = Object.assign(def, def.schema['x-schema-form']);
  }
  return def;
}

function fieldsetDefinition(name: string, schema: any, options: DefaultsContext): JsonFormItem {
  const f = stdFormObj(name, schema, options);
  f.type = 'fieldset';
  f.items = [];
  options.lookup[keyId(options.path)] = f;
  for (const k of Object.keys(schema.properties || {})) {
    const def = defaultFormDefinition(k, schema.properties[k], {
      path: [...options.path, k],
      required: !!(Array.isArray(schema.required) && schema.required.indexOf(k) !== -1),
      lookup: options.lookup,
      global: options.global,
    });
    if (def) {
      f.items.push(def);
    }
  }
  return f;
}

function arrayDefinition(name: string, schema: any, options: DefaultsContext): JsonFormItem {
  const f = stdFormObj(name, schema, options);
  if (schema.items && schema.items['enum']) {
    f.key = options.path;
    f.type = 'checkboxes';
    if (!f.titleMap) {
      f.titleMap = enumToTitleMap(schema.items['enum']);
    }
    options.lookup[keyId(options.path)] = f;
    return f;
  }
  f.type = 'array';
  f.key = options.path;
  options.lookup[keyId(options.path)] = f;
  if (schema.items !== undefined) {
    const last = options.path[options.path.length - 1];
    const def = defaultFormDefinition(name, schema.items, {
      path: [...options.path, ''],
      required: !!(Array.isArray(schema.required) && schema.required.indexOf(last) !== -1),
      lookup: options.lookup,
      global: options.global,
    });
    // Without a definition the items are the key/value list of an rc-select.
    f.items = def ? [def] : schema.items;
  }
  return f;
}

function getDefaults(schema: any, options: JsonFormOptions): { form: JsonFormItem[]; lookup: Record<string, JsonFormItem> } {
  const form: JsonFormItem[] = [];
  const lookup: Record<string, JsonFormItem> = {};
  if (stripNullType(schema.type) !== 'object') {
    throw new Error('Not implemented. Only type "object" allowed at root level of schema.');
  }
  for (const k of Object.keys(schema.properties || {})) {
    const def = defaultFormDefinition(k, schema.properties[k], {
      path: [k],
      lookup,
      required: !!(Array.isArray(schema.required) && schema.required.indexOf(k) !== -1),
      global: options,
    });
    if (def) {
      form.push(def);
    }
  }
  return { form, lookup };
}

/** react-schema-form `utils.merge(schema, form, ignore, options)`. */
export function mergeSchemaForm(schema: any, form: any[] | undefined, options: JsonFormOptions = {}, readonly?: boolean,
                                stdForm = getDefaults(schema, options)): JsonFormItem[] {
  let items: any[] = form || ['*'];
  readonly = readonly || schema.readonly || schema.readOnly;
  const idx = items.indexOf('*');
  if (idx !== -1) {
    items = items.slice(0, idx).concat(stdForm.form).concat(items.slice(idx + 1));
  }
  const lookup = stdForm.lookup;
  return items.map((entry: any) => {
    let obj: JsonFormItem = typeof entry === 'string' ? { key: entry as any } : entry;
    if (obj.key && typeof obj.key === 'string') {
      obj.key = parseKey(obj.key);
    }
    if (obj.titleMap) {
      obj.titleMap = canonicalTitleMap(obj.titleMap);
    }
    if (obj['itemForm']) {
      const itemForm = obj['itemForm'];
      obj.items = (lookup[keyId(obj.key || [])]?.items || []).map((item: JsonFormItem) => ({ ...cloneDeep(itemForm), key: item.key }));
    }
    if (obj.key) {
      const schemaDefaults = lookup[keyId(obj.key)];
      if (schemaDefaults) {
        for (const k of Object.keys(schemaDefaults)) {
          if (obj[k] === undefined) {
            obj[k] = schemaDefaults[k];
          }
        }
      }
    }
    if (readonly === true) {
      obj.readonly = true;
    }
    if (obj.items && obj.items.length > 0) {
      obj.items = mergeSchemaForm(schema, obj.items, options, obj.readonly, stdForm);
    }
    if (obj['tabs']) {
      obj['tabs'].forEach((tab: any) => {
        tab.items = mergeSchemaForm(schema, tab.items, options, obj.readonly, stdForm);
      });
    }
    if (obj.type === 'checkbox' && obj.schema && obj.schema['default'] === undefined) {
      obj.schema['default'] = false;
    }
    obj = obj as JsonFormItem;
    return obj;
  });
}

/** react-schema-form `utils.selectOrSet`: reads the value at `key`, or writes `valueToSet` there. */
export function selectOrSet(projection: FormKey | string, obj: any, valueToSet?: any): any {
  const numRe = /^\d+$/;
  if (!obj) {
    return undefined;
  }
  const parts: FormKey = typeof projection === 'string' ? parseKey(projection) : projection;
  if (valueToSet !== undefined && parts.length === 1) {
    obj[parts[0]] = valueToSet;
    return obj;
  }
  if (valueToSet !== undefined && obj[parts[0]] === undefined) {
    obj[parts[0]] = parts.length > 2 && numRe.test(String(parts[1])) ? [] : {};
  }
  let value = obj[parts[0]];
  for (let i = 1; i < parts.length; i++) {
    if (parts[i] === '') {
      return undefined;
    }
    if (valueToSet !== undefined) {
      if (i === parts.length - 1) {
        value[parts[i]] = valueToSet;
        return valueToSet;
      }
      let tmp = value[parts[i]];
      if (tmp === undefined || tmp === null) {
        tmp = numRe.test(String(parts[i + 1])) ? [] : {};
        value[parts[i]] = tmp;
      }
      value = tmp;
    } else if (value) {
      value = value[parts[i]];
    }
  }
  return value;
}

/** The json-form directive's own model setter: an `undefined` value removes the key. */
export function setModelValue(projection: FormKey, obj: any, valueToSet: any): boolean {
  const numRe = /^\d+$/;
  const setValue = (target: any, key: string | number, val: any): boolean => {
    if (!target) {
      return false;
    }
    if (val === undefined) {
      if (target[key] !== undefined) {
        delete target[key];
        return true;
      }
      return false;
    }
    const changed = !isEqual(target[key], val);
    target[key] = val;
    return changed;
  };
  if (!obj) {
    return false;
  }
  if (projection.length === 1) {
    return setValue(obj, projection[0], valueToSet);
  }
  if (obj[projection[0]] === undefined) {
    obj[projection[0]] = projection.length > 2 && numRe.test(String(projection[1])) ? [] : {};
  }
  let value = obj[projection[0]];
  for (let i = 1; i < projection.length; i++) {
    if (projection[i] === '') {
      return false;
    }
    if (i === projection.length - 1) {
      return setValue(value, projection[i], valueToSet);
    }
    let tmp = value[projection[i]];
    if (tmp === undefined || tmp === null) {
      tmp = numRe.test(String(projection[i + 1])) ? [] : {};
      value[projection[i]] = tmp;
    }
    value = tmp;
  }
  return false;
}

/** react-schema-form `utils.traverseSchema`. */
export function traverseSchema(schema: any, fn: (schema: any, path: FormKey) => void, path: FormKey = [], ignoreArrays = true): void {
  fn(schema, path);
  for (const k of Object.keys(schema.properties || {})) {
    traverseSchema(schema.properties[k], fn, [...path, k], ignoreArrays);
  }
  if (!ignoreArrays && schema.items) {
    traverseSchema(schema.items, fn, [...path, ''], ignoreArrays);
  }
}

/** react-schema-form `utils.traverseForm`. */
export function traverseForm(form: JsonFormItem, fn: (form: JsonFormItem) => void): void {
  fn(form);
  (form.items || []).forEach((f: any) => traverseForm(f, fn));
  (form['tabs'] || []).forEach((tab: any) => tab.items.forEach((f: any) => traverseForm(f, fn)));
}

function typeOf(value: any): string {
  if (value === null) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  return typeof value;
}

function typeMatches(value: any, type: string): boolean {
  switch (type) {
    case 'integer':
      return typeof value === 'number' && Math.floor(value) === value;
    case 'number':
      return typeof value === 'number';
    case 'array':
      return Array.isArray(value);
    case 'null':
      return value === null;
    case 'object':
      return value !== null && typeof value === 'object' && !Array.isArray(value);
    case 'any':
      return true;
    default:
      return typeof value === type;
  }
}

/** The tv4 checks json-form relied on: type, enum, required, properties, items, bounds, lengths, pattern. */
function check(value: any, schema: any, dataPath: string): ValidationResult {
  const fail = (message: string, path = dataPath): ValidationResult => ({ valid: false, error: { message, dataPath: path } });
  if (!schema || typeof schema !== 'object') {
    return { valid: true, error: null };
  }
  if (schema.type !== undefined) {
    const types: string[] = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((t) => typeMatches(value, t))) {
      return fail('Invalid type: ' + typeOf(value) + ' (expected ' + types.join('/') + ')');
    }
  }
  if (Array.isArray(schema['enum']) && !schema['enum'].some((e: any) => isEqual(e, value))) {
    return fail('No enum match for: ' + JSON.stringify(value));
  }
  if (typeof value === 'number') {
    if (schema.multipleOf !== undefined && (value / schema.multipleOf) % 1 !== 0) {
      return fail('Value ' + value + ' is not a multiple of ' + schema.multipleOf);
    }
    if (schema.minimum !== undefined && (value < schema.minimum || (schema.exclusiveMinimum && value === schema.minimum))) {
      return fail('Value ' + value + ' is less than minimum ' + schema.minimum);
    }
    if (schema.maximum !== undefined && (value > schema.maximum || (schema.exclusiveMaximum && value === schema.maximum))) {
      return fail('Value ' + value + ' is greater than maximum ' + schema.maximum);
    }
  }
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      return fail('String is too short (' + value.length + ' chars), minimum ' + schema.minLength);
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      return fail('String is too long (' + value.length + ' chars), maximum ' + schema.maxLength);
    }
    if (schema.pattern !== undefined && !new RegExp(schema.pattern).test(value)) {
      return fail('String does not match pattern: ' + schema.pattern);
    }
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      return fail('Array is too short (' + value.length + '), minimum ' + schema.minItems);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      return fail('Array is too long (' + value.length + '), maximum ' + schema.maxItems);
    }
    if (schema.items) {
      for (let i = 0; i < value.length; i++) {
        const itemSchema = Array.isArray(schema.items) ? schema.items[i] : schema.items;
        const result = check(value[i], itemSchema, dataPath + '/' + i);
        if (!result.valid) {
          return result;
        }
      }
    }
  }
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    if (Array.isArray(schema.required)) {
      for (const key of schema.required) {
        if (value[key] === undefined) {
          return fail('Missing required property: ' + key, dataPath + '/' + key);
        }
      }
    }
    for (const key of Object.keys(schema.properties || {})) {
      if (value[key] !== undefined) {
        const result = check(value[key], schema.properties[key], dataPath + '/' + key);
        if (!result.valid) {
          return result;
        }
      }
    }
  }
  return { valid: true, error: null };
}

/** react-schema-form `utils.validateBySchema(schema, value)` (tv4.validateResult). */
export function validateBySchema(schema: any, value: any): ValidationResult {
  return check(value, schema, '');
}

/** react-schema-form `utils.validate(form, value)`: one field's value against its schema (and `required`). */
export function validateField(form: JsonFormItem | undefined, value: any): ValidationResult {
  if (!form || !form.schema || !form.key) {
    return { valid: true, error: null };
  }
  if (value === '') {
    value = undefined;
  }
  if (form.type === 'number' && (value === null || isNaN(parseFloat(value)))) {
    value = undefined;
  }
  const propName = String(form.key[form.key.length - 1]);
  const wrap: any = { type: 'object', properties: { [propName]: form.schema } };
  if (form.required) {
    wrap.required = [propName];
  }
  const valueWrap: any = {};
  if (value !== undefined) {
    valueWrap[propName] = value;
  }
  const result = check(valueWrap, wrap, '');
  if (!result.valid && result.error && form.validationMessage != null && value !== undefined) {
    result.error.message = form.validationMessage;
  }
  return result;
}

/** json-form-base-component.jsx `defaultValue()`: the model value, else the form/schema default, else the first title. */
export function fieldDefaultValue(form: JsonFormItem, model: any): any {
  let value = selectOrSet(form.key || [], model);
  const schemaType = form.schema?.type;
  const schemaDefault = form.schema ? form.schema['default'] : undefined;
  if (schemaType === 'boolean') {
    if (typeof value !== 'boolean' && form['default']) {
      value = form['default'];
    }
    if (typeof value !== 'boolean' && schemaDefault) {
      value = schemaDefault;
    }
    if (typeof value !== 'boolean' && form.schema && form.required) {
      value = false;
    }
  } else if (schemaType === 'integer' || schemaType === 'number') {
    if (typeof value !== 'number' && form['default']) {
      value = form['default'];
    }
    if (typeof value !== 'number' && schemaDefault) {
      value = schemaDefault;
    }
    if (typeof value !== 'number' && form.titleMap && form.titleMap[0].value) {
      value = form.titleMap[0].value;
    }
    if (value && typeof value === 'string') {
      value = value.indexOf('.') === -1 ? parseInt(value, 10) : parseFloat(value);
    }
  } else {
    if (!value && form['default']) {
      value = form['default'];
    }
    if (!value && schemaDefault) {
      value = schemaDefault;
    }
    if (!value && form.titleMap && form.titleMap[0].value) {
      value = form.titleMap[0].value;
    }
  }
  return value;
}

/** A copy of an array item's form with the item index in place of the `''` key segment (ThingsboardArray.copyWithIndex). */
export function copyWithIndex(form: JsonFormItem, index: number): JsonFormItem {
  const copy = cloneDeep(form);
  copy.arrayIndex = index;
  traverseForm(copy, (f) => {
    if (f.key) {
      const at = f.key.indexOf('');
      if (at !== -1) {
        f.key[at] = index;
      }
    }
  });
  return copy;
}

/** ThingsboardArray.onAppend: the empty value of a new array item, with the schema defaults set. */
export function emptyArrayItem(form: JsonFormItem, options?: JsonFormOptions): any {
  const items = form.schema?.items;
  if (!items) {
    return undefined;
  }
  const setDefaults = !options || options.setSchemaDefaults !== false;
  if (items.type && items.type.indexOf('object') !== -1) {
    let empty: any = {};
    if (setDefaults) {
      empty = items['default'] !== undefined ? items['default'] : empty;
      if (empty) {
        traverseSchema(items, (prop, path) => {
          if (prop['default'] !== undefined && path.length) {
            selectOrSet(path, empty, prop['default']);
          }
        });
      }
    }
    return empty;
  }
  if (items.type && items.type.indexOf('array') !== -1) {
    return setDefaults ? items['default'] || [] : [];
  }
  return setDefaults ? items['default'] : undefined;
}
