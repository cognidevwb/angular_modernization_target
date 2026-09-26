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
import { CustomerService } from '../../api/services/customer.service';
import { AssetService } from '../../api/services/asset.service';

/** What the assets page opens the dialog with: the assets to assign and the first page of customers. */
export interface AssignAssetToCustomerData {
  assetIds: string[];
  customers: PagedListState;
}

/**
 * Ported from the AngularJS controller `AssignAssetToCustomerController` (module `thingsboard.asset`)
 * with its template src/app/asset/assign-to-customer.tpl.html. Closes with `true` once the assets are assigned.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'assign-asset-to-customer',
  standalone: true,
  imports: [TranslatePipe, FormsModule, ScrollingModule, MatDialogModule, MatToolbarModule, MatProgressBarModule, MatListModule, MatInputModule, MatIconModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './assign-asset-to-customer.component.html',
})
export class AssignAssetToCustomerComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly customerService = inject(CustomerService);
  protected readonly assetService = inject(AssetService);
  protected readonly dialogRef = inject(MatDialogRef<AssignAssetToCustomerComponent, boolean>);
  protected readonly dialogData: AssignAssetToCustomerData = inject(MAT_DIALOG_DATA);

  customers: PagedListState = this.dialogData.customers;
  searchText = '';

  private readonly fetchCustomers = (pageLink: any) => this.customerService.getCustomers(pageLink);

  cancel(): void {
    this.dialogRef.close();
  }

  assign(): void {
    const tasks = this.dialogData.assetIds.map((id) => this.assetService.assignAssetToCustomer(this.customers['selection'].id.id, id));
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
