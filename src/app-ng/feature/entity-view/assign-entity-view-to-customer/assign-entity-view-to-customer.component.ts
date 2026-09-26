import { Component, inject } from '@angular/core';
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
import { CustomerService } from '../../api/services/customer.service';
import { EntityViewService } from '../../api/services/entity-view.service';

/** What the entityViews page opens the dialog with: the entityViews to assign and the first page of customers. */
export interface AssignEntityViewToCustomerData {
  entityViewIds: string[];
  customers: PagedListState;
}

/**
 * Ported from the AngularJS controller `AssignEntityViewToCustomerController` (module `thingsboard.entityView`)
 * with its template src/app/entity-view/assign-to-customer.tpl.html. Closes with `true` once the entityViews are assigned.
 */
@Component({
  selector: 'assign-entity-view-to-customer',
  standalone: true,
  imports: [TranslatePipe, FormsModule, ScrollingModule, MatDialogModule, MatToolbarModule, MatProgressBarModule, MatListModule, MatInputModule, MatIconModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './assign-entity-view-to-customer.component.html',
})
export class AssignEntityViewToCustomerComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly customerService = inject(CustomerService);
  protected readonly entityViewService = inject(EntityViewService);
  protected readonly dialogRef = inject(MatDialogRef<AssignEntityViewToCustomerComponent, boolean>);
  protected readonly dialogData: AssignEntityViewToCustomerData = inject(MAT_DIALOG_DATA);

  customers: PagedListState = this.dialogData.customers;
  searchText = '';

  private readonly fetchCustomers = (pageLink: any) => this.customerService.getCustomers(pageLink);

  cancel(): void {
    this.dialogRef.close();
  }

  assign(): void {
    const tasks = this.dialogData.entityViewIds.map((id) => this.entityViewService.assignEntityViewToCustomer(this.customers['selection'].id.id, id));
    Promise.all(tasks).then(() => this.dialogRef.close(true));
  }

  noData(): boolean {
    return this.customers.data.length == 0 && !this.customers.hasNext;
  }

  hasData(): boolean {
    return this.customers.data.length > 0;
  }

  onScrolled(index: number): void {
    onPagedListScrolled(this.customers, index, this.fetchCustomers);
  }

  toggleCustomerSelection(customer: any): void {
    if (this.isCustomerSelected(customer)) {
      this.customers['selection'] = null;
    } else {
      this.customers['selection'] = customer;
    }
  }

  isCustomerSelected(customer: any): boolean {
    return this.customers['selection'] != null && !!customer && customer.id.id === this.customers['selection'].id.id;
  }

  searchCustomerTextUpdated(): void {
    this.customers = newPagedList(this.customers.pageSize, this.searchText, { selection: null });
    fetchMorePage(this.customers, this.fetchCustomers);
  }
}
