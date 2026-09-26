import { Injectable, Type } from '@angular/core';

const SNAKE_CASE_REGEXP = /[A-Z]/g;

/** `snake_case('tbFilterNodeScriptConfig', '-')` → `tb-filter-node-script-config` (the legacy directive tag). */
export function snakeCase(name: string, separator = '_'): string {
  return name.replace(SNAKE_CASE_REGEXP, (letter: string, pos: number) => (pos ? separator : '') + letter.toLowerCase());
}

/**
 * Where a rule node's `configDirective` (from its node definition) resolves to its configuration UI:
 * an Angular component registered under that name, or a custom element whose tag is the directive's
 * kebab-case name (defined by the node's loaded ui resources). The legacy app `$compile`d an AngularJS
 * directive of that name instead.
 */
@Injectable({ providedIn: 'root' })
export class RuleNodeConfigRegistry {
  private readonly components = new Map<string, Type<unknown>>();

  register(configDirective: string, component: Type<unknown>): void {
    this.components.set(configDirective, component);
  }

  component(configDirective: string): Type<unknown> | undefined {
    return this.components.get(configDirective);
  }

  customElementTag(configDirective: string): string | undefined {
    const tag = snakeCase(configDirective, '-');
    return tag.indexOf('-') !== -1 && typeof customElements !== 'undefined' && customElements.get(tag) ? tag : undefined;
  }

  isDefined(configDirective: string): boolean {
    return !!this.component(configDirective) || !!this.customElementTag(configDirective);
  }
}
