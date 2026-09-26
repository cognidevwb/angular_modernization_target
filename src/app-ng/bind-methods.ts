// Written by the playbook (scaffold-units) for a rewrite: plain TypeScript, no AngularJS.

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
