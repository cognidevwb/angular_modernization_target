/**
 * AngularJS's `attrs` (the third argument of a directive's `link`) for a
 * ported directive: the host element's attributes by their normalized
 * camelCase names, `$attr`, `$observe`, `$set` and the class helpers, read
 * live from the element. Written by the playbook.
 */
const camel = (name: string): string =>
  name.replace(/^(x|data)[:\-_]/i, '').replace(/[:\-_]+(.)/g, (_m: string, c: string) => c.toUpperCase());
const kebab = (key: string): string => key.replace(/[A-Z]/g, (c: string) => '-' + c.toLowerCase());

export function linkAttrs(el: Element): any {
  const attrs: any = { $attr: {} as Record<string, string> };
  for (const a of Array.from(el.attributes)) {
    const key = camel(a.name);
    attrs[key] = a.value;
    attrs.$attr[key] = a.name;
  }
  const nameOf = (key: string): string => attrs.$attr[key] || kebab(key);
  attrs.$normalize = camel;
  attrs.$observe = (key: string, fn: (value: any) => void): (() => void) => {
    const name = nameOf(key);
    queueMicrotask(() => fn(el.getAttribute(name) ?? undefined));
    const mo = new MutationObserver(() => fn(el.getAttribute(name) ?? undefined));
    mo.observe(el, { attributes: true, attributeFilter: [name] });
    return () => mo.disconnect();
  };
  attrs.$set = (key: string, value: any): void => {
    const name = nameOf(key);
    if (value === null || value === undefined || value === false) {
      el.removeAttribute(name);
    } else {
      el.setAttribute(name, String(value));
    }
    attrs[key] = value;
  };
  attrs.$addClass = (c: string): void => el.classList.add(...String(c).split(/\s+/).filter(Boolean));
  attrs.$removeClass = (c: string): void => el.classList.remove(...String(c).split(/\s+/).filter(Boolean));
  attrs.$updateClass = (add: string, remove: string): void => {
    attrs.$removeClass(remove);
    attrs.$addClass(add);
  };
  return attrs;
}
