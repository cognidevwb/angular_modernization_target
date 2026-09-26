import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslatePipe } from '@ngx-translate/core';
import { RootState } from '../../../root-state';
import { PagedListState, fetchMorePage, newPagedList, onPagedListScrolled } from '../../components/tb-grid/paged-list';
import { DashboardService } from '../../api/services/dashboard.service';

/** What the customer's dashboards page opens the dialog with: the customer and the first page of tenant dashboards. */
export interface AddDashboardsToCustomerData {
  customerId: string;
  dashboards: PagedListState;
}

/**
 * Ported from the AngularJS controller `AddDashboardsToCustomerController` (module `thingsboard.dashboard`)
 * with its template src/app/dashboard/add-dashboards-to-customer.tpl.html. Closes with `true` once the selected dashboards are assigned.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'add-dashboards-to-customer',
  standalone: true,
  imports: [TranslatePipe, FormsModule, ScrollingModule, MatDialogModule, MatToolbarModule, MatProgressBarModule, MatListModule, MatInputModule, MatIconModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './add-dashboards-to-customer.component.html',
})
export class AddDashboardsToCustomerComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly dashboardService = inject(DashboardService);
  protected readonly dialogRef = inject(MatDialogRef<AddDashboardsToCustomerComponent, boolean>);
  protected readonly dialogData: AddDashboardsToCustomerData = inject(MAT_DIALOG_DATA);

  dashboards: PagedListState = this.dialogData.dashboards;
  searchText = '';

  private readonly fetchDashboards = (pageLink: any) => this.dashboardService.getTenantDashboards(pageLink);

  cancel(): void {
    this.dialogRef.close();
  }

  assign(): void {
    const tasks = Object.keys(this.dashboards['selections']).map((id) => this.dashboardService.assignDashboardToCustomer(this.dialogData.customerId, id));
    Promise.all(tasks).then(() => this.dialogRef.close(true));
  }

  noData(): boolean {
    return this.dashboards.data.length == 0 && !this.dashboards.hasNext;
  }

  hasData(): boolean {
    return this.dashboards.data.length > 0;
  }

  onScrolled(index: number): void {
    onPagedListScrolled(this.dashboards, index, this.fetchDashboards);
  }

  toggleDashboardSelection(dashboard: any): void {
    const selected = dashboard.selected !== undefined && dashboard.selected;
    dashboard.selected = !selected;
    if (dashboard.selected) {
      this.dashboards['selections'][dashboard.id.id] = true;
      this.dashboards['selectedCount']++;
    } else {
      delete this.dashboards['selections'][dashboard.id.id];
      this.dashboards['selectedCount']--;
    }
  }

  searchDashboardTextUpdated(): void {
    this.dashboards = newPagedList(this.dashboards.pageSize, this.searchText, { selections: {}, selectedCount: 0 });
    fetchMorePage(this.dashboards, this.fetchDashboards);
  }
}
