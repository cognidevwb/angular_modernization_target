import { TranslatePipe } from '@ngx-translate/core';
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { types } from '../../common/constants/types';

/**
 * Ported from the AngularJS directive `tbAuditLogHeader` (src/app/audit/audit-log-header.directive.js): the column
 * titles of the audit log table, without the entity columns in entity mode and the user column in user mode.
 * The legacy link read `attrs.auditLogMode`; here it is an input.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: '[tb-audit-log-header]',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './tb-audit-log-header.directive.html',
})
export class TbAuditLogHeaderDirective {
  readonly auditLogMode = input<any>();

  protected readonly types: any = types;
}
