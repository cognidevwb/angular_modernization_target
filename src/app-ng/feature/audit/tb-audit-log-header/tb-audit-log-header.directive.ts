import { Directive, inject } from '@angular/core';
import { ElementRef } from '@angular/core';
import { types } from '../../common/constants/types';

import $ from 'jquery';
import { linkAttrs } from '../../../legacy-link';
import auditLogHeaderTemplate from '../../../../app/audit/audit-log-header.tpl.html';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbAuditLogHeader` (module `thingsboard.auditLog`) in src/app/audit/index.js:23.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Directive({
  selector: '[tb-audit-log-header]',
  standalone: true,
})
export class TbAuditLogHeaderDirective {
  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly typesRef: any = types;
  protected readonly element = inject(ElementRef);

  protected template: any = $templateCache.get(auditLogHeaderTemplate);
  auditLogMode: any;
  types: any;

  // TODO(port): link(scope, element, attrs) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.auditLogMode = this.attrs.auditLogMode;
    this.types = this.typesRef;
    $compile($(this.element.nativeElement).contents())(this);
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
