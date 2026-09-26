import { Component, forwardRef, inject } from '@angular/core';
import { DashboardService } from '../../api/services/dashboard.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TbScopeElementDirective } from '../../components/tb-scope-element/tb-scope-element.directive';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `AddDashboardsToCustomerController` (module `thingsboard.dashboard`) in src/app/dashboard/index.js:50.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'add-dashboards-to-customer',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatListModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule, ScrollingModule, forwardRef(() => TbScopeElementDirective)],
  templateUrl: './add-dashboards-to-customer.component.html',
})
export class AddDashboardsToCustomerComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dashboardService = inject(DashboardService);
  protected readonly dialog = inject(MatDialog);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  // TODO(port): elements not resolved to a component: md-virtual-repeat-container
  // TODO(port): template: 1 × md-virtual-repeat-container left in place

  dashboards: any;
  searchText: any = '';
  theDashboards: any;

  constructor() {
    this.dashboards = this.dialogData.dashboards;
    this.assign = this.assign;
    this.cancel = this.cancel;
    this.hasData = this.hasData;
    this.noData = this.noData;
    this.searchDashboardTextUpdated = this.searchDashboardTextUpdated;
    this.toggleDashboardSelection = this.toggleDashboardSelection;
    this.theDashboards = {
        getItemAtIndex: (index?: any, ...rest: any[]) => {
            if (index > this.dashboards.data.length) {
                this.theDashboards.fetchMoreItems_(index);
                return null;
            }
            var item: any = this.dashboards.data[index];
            if (item) {
                item.indexNumber = index + 1;
            }
            return item;
        },

        getLength: (...rest: any[]) => {
            if (this.dashboards.hasNext) {
                return this.dashboards.data.length + this.dashboards.nextPageLink.limit;
            } else {
                return this.dashboards.data.length;
            }
            return undefined;
        },

        fetchMoreItems_: (...rest: any[]) => {
            if (this.dashboards.hasNext && !this.dashboards.pending) {
                this.dashboards.pending = true;
                this.dashboardService.getTenantDashboards(this.dashboards.nextPageLink).then(
                    (dashboards?: any) => {
                        this.dashboards.data = this.dashboards.data.concat(dashboards.data);
                        this.dashboards.nextPageLink = dashboards.nextPageLink;
                        this.dashboards.hasNext = dashboards.hasNext;
                        if (this.dashboards.hasNext) {
                            this.dashboards.nextPageLink.limit = this.dashboards.pageSize;
                        }
                        this.dashboards.pending = false;
                    },
                    () => {
                        this.dashboards.hasNext = false;
                        this.dashboards.pending = false;
                    });
            }
        }
    }
  }

  cancel = (...rest: any[]): any => {
    (this.dialog as any).cancel();
  };

  assign = (...rest: any[]): any => {
    var tasks: any = [];
    for (var dashboardId in this.dashboards.selections) {
        tasks.push(this.dashboardService.assignDashboardToCustomer(this.dialogData.customerId, dashboardId));
    }
    Promise.all(tasks).then(() => {
    (this.dialog as any).hide();
    });
  };

  noData = (...rest: any[]): any => {
    return this.dashboards.data.length == 0 && !this.dashboards.hasNext;
  };

  hasData = (...rest: any[]): any => {
    return this.dashboards.data.length > 0;
  };

  toggleDashboardSelection = ($event?: any, dashboard?: any, ...rest: any[]): any => {
    $event.stopPropagation();
    var selected: any = (dashboard.selected !== undefined) && dashboard.selected;
    dashboard.selected = !selected;
    if (dashboard.selected) {
        this.dashboards.selections[dashboard.id.id] = true;
        this.dashboards.selectedCount++;
    } else {
        delete this.dashboards.selections[dashboard.id.id];
        this.dashboards.selectedCount--;
    }
  };

  searchDashboardTextUpdated = (...rest: any[]): any => {
    this.dashboards = {
        pageSize: this.dashboards.pageSize,
        data: [],
        nextPageLink: {
            limit: this.dashboards.pageSize,
            textSearch: this.searchText
        },
        selections: {},
        selectedCount: 0,
        hasNext: true,
        pending: false
    };
  };
}
