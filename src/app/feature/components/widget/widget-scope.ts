import { legacyCopy, legacyEquals, readPath } from './legacy-helpers';

type Listener = (event: ScopeEvent, ...args: any[]) => any;

/** The event object a scope listener receives first, shaped as the legacy one. */
export interface ScopeEvent {
  name: string;
  targetScope: WidgetScope;
  currentScope: WidgetScope | null;
  defaultPrevented: boolean;
  preventDefault(): void;
  stopPropagation(): void;
}

interface Watcher {
  get: () => any;
  listener: (newValue: any, oldValue: any, scope: WidgetScope) => void;
  mode: 'ref' | 'deep' | 'collection';
  last: any;
}

const INITIAL = {};

/** Where a top-level `$emit` goes after the widget's own scopes: the app's root events. */
export interface ScopeRoot {
  $emit(name: string, ...args: any[]): any;
  [key: string]: any;
}

/**
 * The `$scope` a widget type's controller script and the shared legacy classes
 * (Subscription) are handed: `ctx.$scope`, `subscriptionContext.$scope`.
 *
 * Stored widget scripts (server data) keep values on it, broadcast to the ported
 * table/knob/… components (`ctx.$scope.$broadcast('entities-table-data-updated', id)`),
 * and Subscription registers `$on` / `$watch` on it. There is no AngularJS scope tree
 * here: this object keeps listeners and watchers itself; the owning widget component
 * runs `$digest()` from its change detection (`ngDoCheck`), which is when a digest ran.
 * A child scope reads its parent's values through the prototype, as a child scope did.
 */
export class WidgetScope {
  [key: string]: any;

  $parent: WidgetScope | null = null;
  $root: ScopeRoot;
  $$listeners: Map<string, Listener[]> = new Map();
  $$watchers: Watcher[] = [];
  $$children: WidgetScope[] = [];
  $$asyncQueue: (() => void)[] = [];
  $$destroyed = false;

  constructor(root: ScopeRoot) {
    this.$root = root;
  }

  /** Edit mode of the widget editor, a `$rootScope` value every scope inherited. */
  get widgetEditMode(): any {
    return this.$root ? this.$root['widgetEditMode'] : undefined;
  }

  /** A script that sets it keeps its own value on this scope, as an assignment on a child scope did. */
  set widgetEditMode(value: any) {
    Object.defineProperty(this, 'widgetEditMode', { value, writable: true, configurable: true, enumerable: true });
  }

  /** A child scope: reads fall through to this one, events and watchers are its own. */
  $new(): WidgetScope {
    const child: WidgetScope = Object.create(this);
    child.$parent = this;
    child.$$listeners = new Map();
    child.$$watchers = [];
    child.$$children = [];
    child.$$asyncQueue = [];
    child.$$destroyed = false;
    this.$$children.push(child);
    return child;
  }

  $on(name: string, listener: Listener): () => void {
    let list = this.$$listeners.get(name);
    if (!list) {
      list = [];
      this.$$listeners.set(name, list);
    }
    list.push(listener);
    return () => {
      const current = this.$$listeners.get(name);
      if (current) {
        const index = current.indexOf(listener);
        if (index > -1) {
          current.splice(index, 1);
        }
      }
    };
  }

  private newEvent(name: string): ScopeEvent & { stopped: boolean } {
    return {
      name,
      targetScope: this,
      currentScope: this,
      defaultPrevented: false,
      stopped: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
      stopPropagation() {
        this.stopped = true;
      },
    };
  }

  private notify(event: ScopeEvent, args: any[]): void {
    const list = this.$$listeners.get(event.name);
    if (!list) {
      return;
    }
    event.currentScope = this;
    for (const listener of [...list]) {
      try {
        listener(event, ...args);
      } catch (e) {
        console.error(e);
      }
    }
  }

  /** To this scope and every scope below it. */
  $broadcast(name: string, ...args: any[]): ScopeEvent {
    const event = this.newEvent(name);
    const visit = (target: WidgetScope) => {
      target.notify(event, args);
      for (const child of [...target.$$children]) {
        visit(child);
      }
    };
    visit(this);
    event.currentScope = null;
    return event;
  }

  /** To this scope and its parents; past the widget's top scope it reaches the app's root events. */
  $emit(name: string, ...args: any[]): ScopeEvent {
    const event = this.newEvent(name);
    let current: WidgetScope | null = this;
    while (current && !event.stopped) {
      current.notify(event, args);
      current = current.$parent;
    }
    if (!event.stopped && this.$root) {
      this.$root.$emit(name, ...args);
    }
    event.currentScope = null;
    return event;
  }

  $eval(expr?: any, locals?: any): any {
    if (typeof expr === 'function') {
      return expr(this, locals);
    }
    if (typeof expr !== 'string' || !expr.trim()) {
      return undefined;
    }
    const path = expr.trim();
    if (locals && path.split('.')[0] in locals) {
      return readPath(locals, path);
    }
    if (/^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/.test(path)) {
      return readPath(this, path);
    }
    if (/^'[^']*'$|^"[^"]*"$/.test(path)) {
      return path.substring(1, path.length - 1);
    }
    if (path !== '' && !isNaN(Number(path))) {
      return Number(path);
    }
    if (path === 'true' || path === 'false') {
      return path === 'true';
    }
    return undefined;
  }

  private addWatcher(expr: any, listener: any, mode: Watcher['mode']): () => void {
    const watcher: Watcher = {
      get: () => this.$eval(expr),
      listener: typeof listener === 'function' ? listener : () => {},
      mode,
      last: INITIAL,
    };
    this.$$watchers.push(watcher);
    return () => {
      const index = this.$$watchers.indexOf(watcher);
      if (index > -1) {
        this.$$watchers.splice(index, 1);
      }
    };
  }

  $watch(expr: any, listener?: (newValue: any, oldValue: any, scope: WidgetScope) => void, deep?: boolean): () => void {
    return this.addWatcher(expr, listener, deep ? 'deep' : 'ref');
  }

  $watchCollection(expr: any, listener?: (newValue: any, oldValue: any, scope: WidgetScope) => void): () => void {
    return this.addWatcher(expr, listener, 'collection');
  }

  private static changed(watcher: Watcher, value: any): boolean {
    const last = watcher.last;
    if (last === INITIAL) {
      return true;
    }
    switch (watcher.mode) {
      case 'deep':
        return !legacyEquals(value, last);
      case 'collection':
        if (value === last) {
          return false;
        }
        if (!value || !last || typeof value !== 'object' || typeof last !== 'object') {
          return !(Number.isNaN(value) && Number.isNaN(last));
        }
        {
          const k1 = Object.keys(value);
          const k2 = Object.keys(last);
          return k1.length !== k2.length || k1.some((k) => value[k] !== last[k]);
        }
      default:
        return value !== last && !(Number.isNaN(value) && Number.isNaN(last));
    }
  }

  private static snapshot(watcher: Watcher, value: any): any {
    if (watcher.mode === 'deep') {
      return legacyCopy(value);
    }
    if (watcher.mode === 'collection' && value && typeof value === 'object') {
      return Array.isArray(value) ? [...value] : { ...value };
    }
    return value;
  }

  private digestOnce(): boolean {
    let dirty = false;
    while (this.$$asyncQueue.length) {
      const fn = this.$$asyncQueue.shift();
      try {
        fn?.();
      } catch (e) {
        console.error(e);
      }
      dirty = true;
    }
    for (const watcher of [...this.$$watchers]) {
      let value: any;
      try {
        value = watcher.get();
      } catch (e) {
        console.error(e);
        continue;
      }
      if (WidgetScope.changed(watcher, value)) {
        const oldValue = watcher.last === INITIAL ? value : watcher.last;
        watcher.last = WidgetScope.snapshot(watcher, value);
        try {
          watcher.listener(value, oldValue, this);
        } catch (e) {
          console.error(e);
        }
        dirty = true;
      }
    }
    for (const child of [...this.$$children]) {
      dirty = child.digestOnce() || dirty;
    }
    return dirty;
  }

  /** Runs the watchers of this scope and the ones below it until nothing changes (at most 10 rounds). */
  $digest(): void {
    if (this.$$destroyed) {
      return;
    }
    let rounds = 0;
    while (this.digestOnce() && ++rounds < 10) {
      // keep going until stable
    }
  }

  private top(): WidgetScope {
    let current: WidgetScope = this;
    while (current.$parent) {
      current = current.$parent;
    }
    return current;
  }

  $apply(fn?: any): any {
    let result: any;
    try {
      result = typeof fn === 'function' ? fn(this) : this.$eval(fn);
    } finally {
      this.top().$digest();
    }
    return result;
  }

  $applyAsync(fn?: any): void {
    queueMicrotask(() => this.$apply(fn));
  }

  $evalAsync(fn?: any): void {
    this.$$asyncQueue.push(() => (typeof fn === 'function' ? fn(this) : this.$eval(fn)));
    queueMicrotask(() => this.top().$digest());
  }

  $destroy(): void {
    if (this.$$destroyed) {
      return;
    }
    this.$broadcast('$destroy');
    this.$$destroyed = true;
    if (this.$parent) {
      const index = this.$parent.$$children.indexOf(this);
      if (index > -1) {
        this.$parent.$$children.splice(index, 1);
      }
    }
    this.$$listeners = new Map();
    this.$$watchers = [];
    this.$$children = [];
    this.$$asyncQueue = [];
  }
}

/**
 * Listens for `name` broadcast on a widget context's scope (what the widget type's script
 * calls `self.ctx.$scope.$broadcast(name, …)` with); the returned function stops listening.
 */
export function onWidgetEvent(ctx: any, name: string, listener: (event: ScopeEvent, ...args: any[]) => any): (() => void) | null {
  const widgetScope: WidgetScope | undefined = ctx ? ctx['$scope'] : undefined;
  return widgetScope && typeof widgetScope.$on === 'function' ? widgetScope.$on(name, listener) : null;
}
