import { Directive, inject } from '@angular/core';
import { ElementRef } from '@angular/core';

import $ from 'jquery';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $animate: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbNoAnimate` (module `thingsboard.directives.noAnimate`) in src/app/components/no-animate.directive.js:18.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Directive({
  selector: '[tb-no-animate]',
  standalone: true,
})
export class TbNoAnimateDirective {
  // TODO(port): '$animate' — @angular/animations
  protected readonly element = inject(ElementRef);

  $watch: any;

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $animate.enabled($(this.element.nativeElement), false);
    this.$watch(() => {
                $animate.enabled($(this.element.nativeElement), false)
            });
  }
}
