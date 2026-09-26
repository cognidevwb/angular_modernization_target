import { Directive, ElementRef, inject, input } from '@angular/core';

/**
 * Ported from the AngularJS directive `tbScopeElement` (module `thingsboard.directives.scopeElement`)
 * in src/app/components/scope-element.directive.js:16 — an attribute directive that handed its element
 * to the surrounding scope under the name in `tb-scope-element="name"`. Angular has no surrounding
 * scope: the page takes the element with `viewChild(TbScopeElementDirective)` (or a
 * `#ref="tbScopeElement"` reference) and reads `.element` / `.name()`.
 */
@Directive({
  selector: '[tb-scope-element]',
  standalone: true,
  exportAs: 'tbScopeElement',
})
export class TbScopeElementDirective {
  /** The name the legacy scope property had. */
  readonly name = input<string | undefined>(undefined, { alias: 'tb-scope-element' });
  /** The host element (the legacy scope got the jqLite wrapper; `[0]` of that is this). */
  readonly element: HTMLElement = inject(ElementRef).nativeElement;
}
