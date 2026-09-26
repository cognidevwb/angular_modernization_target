import { Component, inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { AuditLogDetailsDialogComponent } from '../audit-log-details-dialog/audit-log-details-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS directive `tbAuditLogRow` (module `thingsboard.auditLog`) in src/app/audit/index.js:23.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: '[tb-audit-log-row]',
  standalone: true,
  templateUrl: './tb-audit-log-row.directive.html',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, TranslatePipe],
})
export class TbAuditLogRowDirective {
  protected readonly dialog = inject(MatDialog);
  protected readonly document = inject(DOCUMENT);

  @Input() auditLog: any;
  @Input() auditLogMode: any;
  protected readonly types: any = types;

  async showAuditLogDetails($event?: MouseEvent): Promise<any> {
    const result = await firstValueFrom(this.dialog.open(AuditLogDetailsDialogComponent, {
      data: {
        auditLog: this.auditLog
      },
      panelClass: 'tb-dialog'
    }).afterClosed());
    if (result !== undefined) {
      return result;
    } else {
      return Promise.reject();
    }
  }
}
