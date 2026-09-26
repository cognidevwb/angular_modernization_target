import { Directive, inject } from '@angular/core';
import { ElementRef } from '@angular/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbJsonToString` (module `tbJsonToString`) in src/app/components/tb-json-to-string.directive.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Directive({
  selector: '[tb-json-to-string]',
  standalone: true,
})
export class TbJsonToStringDirective {
  protected readonly element = inject(ElementRef);

  // TODO(port): link(scope, element, attr, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attr` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    ngModelCtrl.$parsers.push(this.into);
    ngModelCtrl.$formatters.push(this.out);
  }

  into = (input?: any, ...rest: any[]): any => {
    try {
        ngModelCtrl.$setValidity('invalidJSON', true);
        return JSON.parse(input);
    } catch (e: any) {
        ngModelCtrl.$setValidity('invalidJSON', false);
    }
    return undefined;
  };

  out = (data?: any, ...rest: any[]): any => {
    try {
        ngModelCtrl.$setValidity('invalidJSON', true);
        return JSON.stringify(data);
    } catch (e: any) {
        ngModelCtrl.$setValidity('invalidJSON', false);
    }
    return undefined;
  };
}
