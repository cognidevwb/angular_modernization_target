import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { DashboardService } from '../../api/services/dashboard.service';
import { types } from '../../common/constants/types';
import { TbEntityListDirective } from '../../entity/tb-entity-list/tb-entity-list.directive';
import { RootState } from '../../../root-state';

/** What the dashboards page opens the dialog with. */
export interface ManageAssignedCustomersData {
  actionType: 'manage' | 'assign' | 'unassign';
  dashboardIds: string[];
  assignedCustomers?: string[];
}

/**
 * Ported from the AngularJS controller `ManageAssignedCustomersController` (module `thingsboard.dashboard`)
 * with its template src/app/dashboard/manage-assigned-customers.tpl.html. Closes with `true` once applied.
 */
@Component({
  selector: 'manage-assigned-customers',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatIconModule, MatDialogModule, MatButtonModule, FormsModule, TbEntityListDirective],
  templateUrl: './manage-assigned-customers.component.html',
})
export class ManageAssignedCustomersComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly dashboardService = inject(DashboardService);
  protected readonly dialogRef = inject(MatDialogRef<ManageAssignedCustomersComponent, boolean>);
  protected readonly dialogData: ManageAssignedCustomersData = inject(MAT_DIALOG_DATA);

  types: any = types;
  actionType = this.dialogData.actionType;
  dashboardIds = this.dialogData.dashboardIds;
  assignedCustomers: any = this.dialogData.actionType == 'manage' ? this.dialogData.assignedCustomers : [];
  actionName = '';
  labelText = '';
  titleText = '';

  constructor() {
    if (this.actionType == 'manage') {
      this.titleText = 'dashboard.manage-assigned-customers';
      this.labelText = 'dashboard.assigned-customers';
      this.actionName = 'action.update';
    } else if (this.actionType == 'assign') {
      this.titleText = 'dashboard.assign-to-customers';
      this.labelText = 'dashboard.assign-to-customers-text';
      this.actionName = 'action.assign';
    } else if (this.actionType == 'unassign') {
      this.titleText = 'dashboard.unassign-from-customers';
      this.labelText = 'dashboard.unassign-from-customers-text';
      this.actionName = 'action.unassign';
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    const tasks = this.dashboardIds.map((dashboardId) => {
      if (this.actionType == 'manage') {
        return this.dashboardService.updateDashboardCustomers(dashboardId, this.assignedCustomers);
      } else if (this.actionType == 'assign') {
        return this.dashboardService.addDashboardCustomers(dashboardId, this.assignedCustomers);
      }
      return this.dashboardService.removeDashboardCustomers(dashboardId, this.assignedCustomers);
    });
    Promise.all(tasks).then(() => this.dialogRef.close(true));
  }
}
