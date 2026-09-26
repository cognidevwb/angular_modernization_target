import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `DashboardSelectPanelController` (module `thingsboard.directives.dashboardSelect`) in src/app/components/dashboard-select.directive.js:31.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'dashboard-select-panel',
  standalone: true,
  imports: [TranslatePipe, MatSelectModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './dashboard-select-panel.component.html',
})
export class DashboardSelectPanelComponent {
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  _mdPanelRef: any;
  dashboards: any;
  dashboardId: any;

  constructor() {
    this._mdPanelRef = this.dialogData.mdPanelRef;
    this.dashboards = this.dialogData.dashboards;
    this.dashboardId = this.dialogData.dashboardId;
    this.dashboardSelected = this.dashboardSelected;
  }

  dashboardSelected = (dashboardId?: any, ...rest: any[]): any => {
    if (this.dialogData.onDashboardSelected) {
        this.dialogData.onDashboardSelected(dashboardId);
    }
  };
}
