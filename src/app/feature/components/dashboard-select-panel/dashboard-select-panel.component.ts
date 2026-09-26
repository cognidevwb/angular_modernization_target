import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { MD_PANEL_DATA } from '../md-panel/md-panel';

/**
 * Ported from the AngularJS controller `DashboardSelectPanelController` (src/app/components/dashboard-select-panel.controller.js)
 * with its template dashboard-select-panel.tpl.html. Opened by tb-dashboard-select as an `$mdPanel`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'dashboard-select-panel',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, TranslatePipe],
  templateUrl: './dashboard-select-panel.component.html',
})
export class DashboardSelectPanelComponent {
  private readonly data: any = inject(MD_PANEL_DATA);

  dashboards: any[] = this.data.dashboards || [];
  dashboardId: any = this.data.dashboardId;

  dashboardSelected(dashboardId: any): void {
    if (this.data.onDashboardSelected) {
      this.data.onDashboardSelected(dashboardId);
    }
  }
}
