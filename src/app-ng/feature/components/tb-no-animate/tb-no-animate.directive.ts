import { Directive, HostBinding } from '@angular/core';

/**
 * Ported from the AngularJS directive `tbNoAnimate` (module `thingsboard.directives.noAnimate`) in src/app/components/no-animate.directive.js:18.
 * `$animate.enabled(element, false)` disabled ngAnimate animations on this element; the Angular equivalent is the `@.disabled` host binding, which disables Angular's animations on the element (and its children).
 */
@Directive({
  selector: '[tb-no-animate]',
  standalone: true,
})
export class TbNoAnimateDirective {
  @HostBinding('@.disabled')
  protected readonly animationsDisabled = true;
}
