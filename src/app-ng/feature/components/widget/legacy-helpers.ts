import { formatDate } from '@angular/common';
import $ from 'jquery';

/**
 * The plain helper functions the legacy widget code calls: the shared JavaScript
 * classes the rewrite still imports as they are (src/app/api/subscription.js,
 * alias-controller.js, data-aggregator.js, the widget libraries) and the widget
 * types' own controller scripts stored on the server call `angular.copy`,
 * `angular.equals`, `angular.isDefined` … as globals. They are utilities, not the
 * framework: this file gives them as plain functions and installs them under the
 * global name those scripts read, so a stored widget keeps running unchanged.
 */

function isWindow(obj: any): boolean {
  return obj && obj.window === obj;
}

function isScope(obj: any): boolean {
  return obj && typeof obj.$evalAsync === 'function' && typeof obj.$watch === 'function';
}

/** A deep copy with AngularJS's semantics: Dates, RegExps, arrays and plain objects; `$$hashKey` dropped. */
export function legacyCopy(source: any, destination?: any): any {
  const seen = new Map<any, any>();
  const copyValue = (value: any): any => {
    if (value === null || typeof value !== 'object') {
      return value;
    }
    if (isWindow(value) || isScope(value) || value instanceof Node) {
      return value;
    }
    if (seen.has(value)) {
      return seen.get(value);
    }
    if (value instanceof Date) {
      return new Date(value.getTime());
    }
    if (value instanceof RegExp) {
      const re = new RegExp(value.source, value.flags);
      re.lastIndex = value.lastIndex;
      return re;
    }
    if (Array.isArray(value)) {
      const arr: any[] = [];
      seen.set(value, arr);
      for (const item of value) {
        arr.push(copyValue(item));
      }
      return arr;
    }
    const obj = Object.create(Object.getPrototypeOf(value));
    seen.set(value, obj);
    for (const key of Object.keys(value)) {
      if (key !== '$$hashKey') {
        obj[key] = copyValue(value[key]);
      }
    }
    return obj;
  };
  if (destination) {
    if (Array.isArray(destination)) {
      destination.length = 0;
      for (const item of source || []) {
        destination.push(copyValue(item));
      }
    } else {
      for (const key of Object.keys(destination)) {
        delete destination[key];
      }
      Object.assign(destination, copyValue(source));
    }
    return destination;
  }
  return copyValue(source);
}

/** Deep equality with AngularJS's semantics: `$`-prefixed keys and functions are ignored. */
export function legacyEquals(o1: any, o2: any): boolean {
  if (o1 === o2) {
    return true;
  }
  if (o1 === null || o2 === null) {
    return false;
  }
  // eslint-disable-next-line no-self-compare
  if (o1 !== o1 && o2 !== o2) {
    return true;
  }
  const t1 = typeof o1;
  if (t1 !== typeof o2 || t1 !== 'object') {
    return false;
  }
  if (Array.isArray(o1)) {
    if (!Array.isArray(o2) || o1.length !== o2.length) {
      return false;
    }
    return o1.every((v: any, i: number) => legacyEquals(v, o2[i]));
  }
  if (o1 instanceof Date) {
    return o2 instanceof Date && o1.getTime() === o2.getTime();
  }
  if (o1 instanceof RegExp) {
    return o2 instanceof RegExp && o1.toString() === o2.toString();
  }
  if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || Array.isArray(o2) || o2 instanceof Date || o2 instanceof RegExp) {
    return false;
  }
  const keys = new Set<string>();
  for (const key of Object.keys(o1)) {
    if (key.charAt(0) === '$' || typeof o1[key] === 'function') {
      continue;
    }
    if (!legacyEquals(o1[key], o2[key])) {
      return false;
    }
    keys.add(key);
  }
  for (const key of Object.keys(o2)) {
    if (!keys.has(key) && key.charAt(0) !== '$' && o2[key] !== undefined && typeof o2[key] !== 'function') {
      return false;
    }
  }
  return true;
}

function legacyMerge(dst: any, ...sources: any[]): any {
  for (const src of sources) {
    if (!src || typeof src !== 'object') {
      continue;
    }
    for (const key of Object.keys(src)) {
      const value = src[key];
      if (value && typeof value === 'object' && !(value instanceof Date) && !(value instanceof RegExp) && !(value instanceof Node)) {
        if (!dst[key] || typeof dst[key] !== 'object') {
          dst[key] = Array.isArray(value) ? [] : {};
        }
        legacyMerge(dst[key], value);
      } else {
        dst[key] = value;
      }
    }
  }
  return dst;
}

/** The value at a dotted path (`a.b.c`) of an object, as an AngularJS expression of one path read it. */
export function readPath(obj: any, path: string): any {
  let value = obj;
  for (const part of path.split('.')) {
    if (value === null || value === undefined) {
      return undefined;
    }
    value = value[part];
  }
  return value;
}

/** `$filter('orderBy')`: sorts by one or more `+prop` / `-prop` expressions (or getter functions). */
export function orderBy(array: any[], expression?: any, reverse?: boolean): any[] {
  if (!Array.isArray(array)) {
    return array;
  }
  const exprs: any[] = Array.isArray(expression) ? expression : [expression === undefined ? '+' : expression];
  const getters = exprs.map((expr: any) => {
    if (typeof expr === 'function') {
      return { get: expr, descending: false };
    }
    let path = String(expr ?? '');
    let descending = false;
    if (path.charAt(0) === '+' || path.charAt(0) === '-') {
      descending = path.charAt(0) === '-';
      path = path.substring(1);
    }
    if (/^(['"]).*\1$/.test(path)) {
      path = path.substring(1, path.length - 1);
    }
    if (path === '' || path === 'this') {
      return { get: (item: any) => item, descending };
    }
    const thisIndex = /^this\[(\d+)\]$/.exec(path);
    if (thisIndex) {
      const index = Number(thisIndex[1]);
      return { get: (item: any) => item?.[index], descending };
    }
    return { get: (item: any) => readPath(item, path), descending };
  });
  const compare = (a: any, b: any): number => {
    if (a === b) {
      return 0;
    }
    if (a === undefined || a === null) {
      return 1;
    }
    if (b === undefined || b === null) {
      return -1;
    }
    if (typeof a === 'string' && typeof b === 'string') {
      const la = a.toLowerCase();
      const lb = b.toLowerCase();
      return la < lb ? -1 : la > lb ? 1 : 0;
    }
    return a < b ? -1 : a > b ? 1 : 0;
  };
  const indexed = array.map((value, index) => ({ value, index }));
  indexed.sort((x, y) => {
    for (const g of getters) {
      const r = compare(g.get(x.value), g.get(y.value));
      if (r !== 0) {
        return g.descending ? -r : r;
      }
    }
    return x.index - y.index;
  });
  const result = indexed.map((e) => e.value);
  return reverse ? result.reverse() : result;
}

/** The AngularJS date format tokens map to Angular's one to one, except the named ones. */
const NAMED_DATE_FORMATS: Record<string, string> = {
  medium: 'MMM d, y h:mm:ss a',
  short: 'M/d/yy h:mm a',
  fullDate: 'EEEE, MMMM d, y',
  longDate: 'MMMM d, y',
  mediumDate: 'MMM d, y',
  shortDate: 'M/d/yy',
  mediumTime: 'h:mm:ss a',
  shortTime: 'h:mm a',
};

/**
 * `$filter(name)` for the legacy code: `translate`, `orderBy`, `date`, `number`,
 * `filter`, `limitTo`, `uppercase`, `lowercase`, `json`; any other name gives the identity.
 */
export function createLegacyFilter(translate: (key: string, params?: any) => string): (name: string) => any {
  return (name: string) => {
    switch (name) {
      case 'translate':
        return (key: any, params?: any) => (key ? translate(key, params) : key);
      case 'orderBy':
        return orderBy;
      case 'date':
        return (value: any, format?: string) => {
          if (value === null || value === undefined || value === '') {
            return value;
          }
          // AngularJS wrote milliseconds as `sss`; Angular's formatDate writes them as `SSS`.
          const f = format ? (NAMED_DATE_FORMATS[format] ?? format).replace(/sss/g, 'SSS') : NAMED_DATE_FORMATS['mediumDate'];
          try {
            return formatDate(value, f, 'en-US');
          } catch {
            return value;
          }
        };
      case 'number':
        return (value: any, fractionSize?: number) => {
          if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
            return '';
          }
          const num = Number(value);
          return fractionSize !== undefined
            ? num.toLocaleString('en-US', { minimumFractionDigits: fractionSize, maximumFractionDigits: fractionSize })
            : num.toLocaleString('en-US', { maximumFractionDigits: 3 });
        };
      case 'filter':
        return (array: any[], expr: any) => {
          if (!Array.isArray(array) || expr === undefined || expr === null || expr === '') {
            return array;
          }
          if (typeof expr === 'function') {
            return array.filter(expr);
          }
          // the default comparator: a case-insensitive substring of a primitive value; `$` is any property
          const contains = (value: any, needle: any): boolean => {
            if (needle === undefined || needle === null || needle === '') {
              return true;
            }
            if (value === null || value === undefined) {
              return false;
            }
            if (typeof value === 'object') {
              return Object.keys(value).some((k) => k.charAt(0) !== '$' && contains(value[k], needle));
            }
            if (typeof value === 'function') {
              return false;
            }
            return String(value).toLowerCase().indexOf(String(needle).toLowerCase()) > -1;
          };
          if (typeof expr === 'object') {
            return array.filter((item) =>
              Object.keys(expr).every((k) => (k === '$' ? contains(item, expr[k]) : contains(item?.[k], expr[k]))),
            );
          }
          return array.filter((item) => contains(item, expr));
        };
      case 'limitTo':
        return (input: any, limit: number, begin = 0) => (input && input.slice ? input.slice(begin, begin + limit) : input);
      case 'uppercase':
        return (s: any) => (typeof s === 'string' ? s.toUpperCase() : s);
      case 'lowercase':
        return (s: any) => (typeof s === 'string' ? s.toLowerCase() : s);
      case 'json':
        return (obj: any, spacing = 2) => JSON.stringify(obj, null, spacing);
      default:
        return (value: any) => value;
    }
  };
}

/**
 * A promise with AngularJS 1.5 `$q` semantics for the widget scripts stored on the server: a rejection
 * still propagates down the chain, but one nobody handles is not reported (1.5 had no "possibly unhandled
 * rejection"; a native promise would reach the app's error handler, e.g. an offline device's RPC reply).
 */
export function legacyPromise<T = any>(promise: PromiseLike<T> | null | undefined): any {
  if (!promise) {
    return promise;
  }
  const wrap = (p: Promise<any>): any => {
    p.catch(() => undefined);
    return {
      then: (onFulfilled?: any, onRejected?: any) => wrap(p.then(onFulfilled, onRejected)),
      catch: (onRejected?: any) => wrap(p.catch(onRejected)),
      finally: (onFinally?: any) => wrap(p.finally(onFinally)),
    };
  };
  return wrap(Promise.resolve(promise));
}

/** The helper object, under the name the legacy scripts call it by. */
export const legacyHelpers = {
  copy: legacyCopy,
  equals: legacyEquals,
  merge: legacyMerge,
  extend: (dst: any, ...sources: any[]) => Object.assign(dst, ...sources),
  forEach: (obj: any, iterator: (value: any, key: any, obj: any) => void, context?: any) => {
    if (!obj) {
      return obj;
    }
    if (Array.isArray(obj)) {
      obj.forEach((v, i) => iterator.call(context, v, i, obj));
    } else {
      for (const key of Object.keys(obj)) {
        iterator.call(context, obj[key], key, obj);
      }
    }
    return obj;
  },
  isDefined: (v: any) => typeof v !== 'undefined',
  isUndefined: (v: any) => typeof v === 'undefined',
  isString: (v: any) => typeof v === 'string',
  isNumber: (v: any) => typeof v === 'number',
  isFunction: (v: any) => typeof v === 'function',
  isObject: (v: any) => v !== null && typeof v === 'object',
  isArray: Array.isArray,
  isDate: (v: any) => v instanceof Date,
  isElement: (v: any) => !!(v && (v.nodeName || (v.prop && v.attr && v.find))),
  fromJson: (json: any) => (typeof json === 'string' ? JSON.parse(json) : json),
  toJson: (obj: any, pretty?: any) => JSON.stringify(obj, (k, v) => (typeof k === 'string' && k.charAt(0) === '$' && k.charAt(1) === '$' ? undefined : v), pretty === true ? 2 : pretty),
  element: (el: any) => $(el),
  noop: () => {},
  identity: (v: any) => v,
  lowercase: (s: any) => (typeof s === 'string' ? s.toLowerCase() : s),
  uppercase: (s: any) => (typeof s === 'string' ? s.toUpperCase() : s),
};

/** Installs the helpers globally once (the shared legacy classes and stored widget scripts read them from there). */
export function installLegacyHelpers(): void {
  const g = globalThis as any;
  if (!g.angular) {
    g.angular = legacyHelpers;
  }
}

installLegacyHelpers();
