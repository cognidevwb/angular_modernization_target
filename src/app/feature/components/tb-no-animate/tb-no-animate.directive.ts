import { Directive } from '@angular/core';

/**
 * Ported from the AngularJS directive `tbNoAnimate` (module `thingsboard.directives.noAnimate`) in src/app/components/no-animate.directive.js:18.
 * `$animate.enabled(element, false)` turned off the ngAnimate transitions of this element (its show/hide).
 * The rewrite animates with CSS only (no @angular/animations), so the directive marks the element with the
 * `tb-no-animate` class, whose global rule (styles.scss) turns off transitions and animations on it and inside it.
 */
@Directive({
  selector: '[tb-no-animate]',
  standalone: true,
  host: { class: 'tb-no-animate' },
})
export class TbNoAnimateDirective {}
