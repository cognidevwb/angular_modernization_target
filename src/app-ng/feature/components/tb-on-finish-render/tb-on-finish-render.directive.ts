import { Directive, inject } from '@angular/core';
import { ElementRef } from '@angular/core';
import { linkAttrs } from '../../../legacy-link';

/**
 * Ported from the AngularJS directive `tbOnFinishRender` (module `thingsboard.directives.finishRender`) in src/app/components/finish-render.directive.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Directive({
  selector: '[tb-on-finish-render]',
  standalone: true,
})
export class TbOnFinishRenderDirective {
  protected readonly element = inject(ElementRef);

  $emit: any;
  $last: any;

  // TODO(port): link(scope, element, attr) — `element` is the element (ElementRef.nativeElement) and `attr` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    if (this.$last === true) {
                setTimeout(() => {
                    this.finishRender.next(this.attrs.tbOnFinishRender);
                });
            }
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
