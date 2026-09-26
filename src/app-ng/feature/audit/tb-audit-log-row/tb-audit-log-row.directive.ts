import { Component, inject, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';

import { AuditLogDetailsDialogComponent } from '../audit-log-details-dialog/audit-log-details-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS directive `tbAuditLogRow` (src/app/audit/audit-log-row.directive.js): one audit log's
 * cells, and its details button opening the audit log details dialog (the legacy `$mdDialog.show`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: '[tb-audit-log-row]',
  standalone: true,
  templateUrl: './tb-audit-log-row.directive.html',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, TranslatePipe],
})
export class TbAuditLogRowDirective {
  protected readonly dialog = inject(MatDialog);

  @Input() auditLog: any;
  @Input() auditLogMode: any;
  protected readonly types: any = types;

  showAuditLogDetails($event?: MouseEvent): void {
    $event?.stopPropagation();
    this.dialog.open(AuditLogDetailsDialogComponent, {
      data: {
        auditLog: this.auditLog
      },
      panelClass: 'tb-dialog',
      maxWidth: '100vw',
    });
  }
}
