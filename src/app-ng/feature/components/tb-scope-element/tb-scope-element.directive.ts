import { Component } from '@angular/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

/**
 * Ported from the AngularJS directive `tbScopeElement` (module `thingsboard.directives.scopeElement`) in src/app/components/scope-element.directive.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-scope-element',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbScopeElementDirective {

  pre(iElement?: any, iAttrs?: any, ...rest: any[]): any {
    (this as any)[iAttrs.tbScopeElement] = iElement;
  }
}
