import { Component, inject } from '@angular/core';
import { ElementRef } from '@angular/core';
import { types } from '../../common/constants/types';

import { linkAttrs } from '../../../legacy-link';

/**
 * Ported from the AngularJS directive `tbAuditLogHeader` (module `thingsboard.auditLog`) in src/app/audit/index.js:23.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: '[tb-audit-log-header]',
  standalone: true,
  templateUrl: './tb-audit-log-header.directive.html',
})
export class TbAuditLogHeaderDirective {
  protected readonly typesRef: any = types;
  protected readonly element = inject(ElementRef);

  auditLogMode: any;
  types: any;

  constructor() {
    this.auditLogMode = this.attrs.auditLogMode;
    this.types = this.typesRef;
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
