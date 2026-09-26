/**
 * A service of the running app, for code outside Angular's injection
 * context (a class consumers `new`, module-level code): looked up in the
 * AngularJS injector — which holds the legacy services and the downgraded
 * Angular ones — when it is first used, not when the module loads. Works for
 * a service called as a function (`$http(config)`) and for its members.
 * Written by the playbook.
 */
import * as angular from 'angular';

export function legacyService(token: string): any {
  let real: any;
  const resolve = (): any => {
    if (real === undefined) {
      const injector = (angular.element(document.body) as any).injector?.();
      if (!injector) {
        throw new Error(`legacyService('${token}'): the AngularJS app has not started yet`);
      }
      real = injector.get(token);
    }
    return real;
  };
  return new Proxy(function () {}, {
    get: (_t, key) => {
      const v = resolve()[key];
      return typeof v === 'function' ? v.bind(resolve()) : v;
    },
    set: (_t, key, value) => {
      resolve()[key] = value;
      return true;
    },
    apply: (_t, self, args) => resolve().apply(self, args),
    construct: (_t, args) => new (resolve())(...args),
  });
}

/**
 * A ported service's methods bound to it. The AngularJS factory's functions
 * closed over its services, so callers could pass them around
 * (`promise.then(interceptor.request)`, `var fn = svc.method`); as class
 * methods they would lose `this`. Accessors are left as they are.
 */
export function bindMethods<T extends object>(instance: T): true {
  const self = instance as any;
  let proto = Object.getPrototypeOf(instance);
  while (proto && proto !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key === 'constructor' || Object.prototype.hasOwnProperty.call(self, key)) continue;
      const d = Object.getOwnPropertyDescriptor(proto, key);
      if (d && typeof d.value === 'function') self[key] = d.value.bind(instance);
    }
    proto = Object.getPrototypeOf(proto);
  }
  return true;
}
