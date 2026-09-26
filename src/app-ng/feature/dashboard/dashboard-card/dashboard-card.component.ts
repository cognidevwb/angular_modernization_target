import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { types } from '../../common/constants/types';

/**
 * Ported from the AngularJS controller `DashboardCardController` (module `thingsboard.dashboard`) in src/app/dashboard/index.js:50,
 * with its card template src/app/dashboard/dashboard-card.tpl.html. Rendered by tb-grid for each dashboard.
 */
@Component({
  selector: 'dashboard-card',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div class="tb-small tb-dashboard-assigned-customers" [hidden]="!(parentCtl()?.dashboardsScope === 'tenant' && item()?.assignedCustomersText)">{{ 'dashboard.assignedToCustomers' | translate }}: '{{ item()?.assignedCustomersText }}'</div>
    <div class="tb-small" [hidden]="!(parentCtl()?.dashboardsScope === 'tenant' && item()?.publicCustomerId)">{{ 'dashboard.public' | translate }}</div>
  `,
})
export class DashboardCardComponent {
  readonly item = input<any>();
  readonly parentCtl = input<any>();
  types: any = types;
}
