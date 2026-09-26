import { Directive, inject } from '@angular/core';
import { ElementRef } from '@angular/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let ngModel: any;

/**
 * Ported from the AngularJS directive `parseToNull` (module `thingsboard.extension`) in src/app/extension/index.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Directive({
  selector: '[parse-to-null]',
  standalone: true,
})
export class ParseToNullDirective {
  protected readonly element = inject(ElementRef);

  // TODO(port): link(scope, elem, attrs, ngModel) — `elem` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    ngModel.$parsers.push(function(value?: any) {
            if(value === "") {
                return null;
            }
            return value;
        })
  }
}
