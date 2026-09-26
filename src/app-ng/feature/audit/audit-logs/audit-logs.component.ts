import { Component, forwardRef } from '@angular/core';
import { types } from '../../common/constants/types';
import { TbAuditLogTableDirective } from '../tb-audit-log-table/tb-audit-log-table.directive';

/**
 * Ported from the AngularJS controller `AuditLogsController` (module `thingsboard.auditLog`) in src/app/audit/index.js:23.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'audit-logs',
  standalone: true,
  imports: [forwardRef(() => TbAuditLogTableDirective)],
  templateUrl: './audit-logs.component.html',
})
export class AuditLogsComponent {
  protected readonly typesRef: any = types;

  types: any;

  constructor() {
    this.types = this.typesRef;
  }
}
