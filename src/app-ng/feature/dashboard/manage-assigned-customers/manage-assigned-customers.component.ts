import { Component, forwardRef, inject } from '@angular/core';
import { DashboardService } from '../../api/services/dashboard.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbEntityListDirective } from '../../entity/tb-entity-list/tb-entity-list.directive';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `ManageAssignedCustomersController` (module `thingsboard.dashboard`) in src/app/dashboard/index.js:50.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'manage-assigned-customers',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatIconModule, MatDialogModule, MatButtonModule, FormsModule, forwardRef(() => TbEntityListDirective)],
  templateUrl: './manage-assigned-customers.component.html',
})
export class ManageAssignedCustomersComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialog = inject(MatDialog);
  protected readonly typesRef: any = types;
  protected readonly dashboardService = inject(DashboardService);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  types: any;
  actionType: any;
  dashboardIds: any;
  assignedCustomers: any;
  actionName: any;
  labelText: any;
  titleText: any;

  constructor() {
    this.types = this.typesRef;
    this.actionType = this.dialogData.actionType;
    this.dashboardIds = this.dialogData.dashboardIds;
    this.assignedCustomers = this.dialogData.assignedCustomers;
    if (this.dialogData.actionType != 'manage') {
        this.assignedCustomers = [];
    }
    if (this.dialogData.actionType == 'manage') {
        this.titleText = 'dashboard.manage-assigned-customers';
        this.labelText = 'dashboard.assigned-customers';
        this.actionName = 'action.update';
    } else if (this.dialogData.actionType == 'assign') {
        this.titleText = 'dashboard.assign-to-customers';
        this.labelText = 'dashboard.assign-to-customers-text';
        this.actionName = 'action.assign';
    } else if (this.dialogData.actionType == 'unassign') {
        this.titleText = 'dashboard.unassign-from-customers';
        this.labelText = 'dashboard.unassign-from-customers-text';
        this.actionName = 'action.unassign';
    }
    this.submit = this.submit;
    this.cancel = this.cancel;
  }

  cancel = (...rest: any[]): any => {
    (this.dialog as any).cancel();
  };

  submit = (...rest: any[]): any => {
    var tasks: any = [];
    for (var i: any=0;i<this.dashboardIds.length;i++) {
        var dashboardId: any = this.dashboardIds[i];
        var promise: any;
        if (this.actionType == 'manage') {
            promise = this.dashboardService.updateDashboardCustomers(dashboardId, this.assignedCustomers);
        } else if (this.actionType == 'assign') {
            promise = this.dashboardService.addDashboardCustomers(dashboardId, this.assignedCustomers);
        } else if (this.actionType == 'unassign') {
            promise = this.dashboardService.removeDashboardCustomers(dashboardId, this.assignedCustomers);
        }
        tasks.push(promise);
    }
    Promise.all(tasks).then(() => {
    (this.dialog as any).hide();
    });
  };
}
