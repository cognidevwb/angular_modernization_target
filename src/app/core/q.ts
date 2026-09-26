/**
 * `$q` and `$timeout` as the ported code calls them, on native Promises and
 * timers — no AngularJS. `$q.defer()` gives a deferred ({promise, resolve,
 * reject}); `$q.all/when/resolve/reject` are Promise.all/resolve/reject;
 * `$timeout(fn, ms)` resolves with fn's result, and `$timeout.cancel(p)` stops it.
 */
export interface Deferred<T = any> {
  promise: Promise<T>;
  resolve: (value?: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

function defer<T = any>(): Deferred<T> {
  let resolve!: (value?: any) => void;
  let reject!: (reason?: any) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function all(values: any): Promise<any> {
  if (Array.isArray(values)) {
    return Promise.all(values);
  }
  const keys = Object.keys(values ?? {});
  return Promise.all(keys.map((k) => values[k])).then((results) => Object.fromEntries(keys.map((k, i) => [k, results[i]])));
}

export const $q: any = Object.assign(
  (resolver: (resolve: (v?: any) => void, reject: (r?: any) => void) => void) => new Promise(resolver),
  {
    defer,
    all,
    when: (value?: any) => Promise.resolve(value),
    resolve: (value?: any) => Promise.resolve(value),
    reject: (reason?: any) => Promise.reject(reason),
    race: (values: any[]) => Promise.race(values),
  },
);

const timers = new WeakMap<Promise<any>, ReturnType<typeof setTimeout>>();

export const $timeout: any = Object.assign(
  (fn?: () => any, delay = 0): Promise<any> => {
    let handle: ReturnType<typeof setTimeout>;
    const p = new Promise((resolve, reject) => {
      handle = setTimeout(() => {
        try {
          resolve(fn ? fn() : undefined);
        } catch (e) {
          reject(e);
        }
      }, delay);
    });
    timers.set(p, handle!);
    return p;
  },
  {
    cancel: (p?: Promise<any>): boolean => {
      const h = p && timers.get(p);
      if (h !== undefined) {
        clearTimeout(h);
        timers.delete(p!);
        return true;
      }
      return false;
    },
  },
);
