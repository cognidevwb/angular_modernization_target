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
import { EntityViewService } from '../../api/services/entity-view.service';

/** What the customer's entityViews page opens the dialog with: the customer and the first page of tenant entityViews. */
export interface AddEntityViewsToCustomerData {
  customerId: string;
  entityViews: PagedListState;
}

/**
 * Ported from the AngularJS controller `AddEntityViewsToCustomerController` (module `thingsboard.entityView`)
 * with its template src/app/entity-view/add-entity-views-to-customer.tpl.html. Closes with `true` once the selected entityViews are assigned.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'add-entity-views-to-customer',
  standalone: true,
  imports: [TranslatePipe, FormsModule, ScrollingModule, MatDialogModule, MatToolbarModule, MatProgressBarModule, MatListModule, MatInputModule, MatIconModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './add-entity-views-to-customer.component.html',
})
export class AddEntityViewsToCustomerComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly entityViewService = inject(EntityViewService);
  protected readonly dialogRef = inject(MatDialogRef<AddEntityViewsToCustomerComponent, boolean>);
  protected readonly dialogData: AddEntityViewsToCustomerData = inject(MAT_DIALOG_DATA);

  entityViews: PagedListState = this.dialogData.entityViews;
  searchText = '';

  private readonly fetchEntityViews = (pageLink: any) => this.entityViewService.getTenantEntityViews(pageLink, false);

  cancel(): void {
    this.dialogRef.close();
  }

  assign(): void {
    const tasks = Object.keys(this.entityViews['selections']).map((id) => this.entityViewService.assignEntityViewToCustomer(this.dialogData.customerId, id));
    Promise.all(tasks).then(() => this.dialogRef.close(true));
  }

  noData(): boolean {
    return this.entityViews.data.length == 0 && !this.entityViews.hasNext;
  }

  hasData(): boolean {
    return this.entityViews.data.length > 0;
  }

  onScrolled(index: number): void {
    onPagedListScrolled(this.entityViews, index, this.fetchEntityViews);
  }

  toggleEntityViewSelection(entityView: any): void {
    const selected = entityView.selected !== undefined && entityView.selected;
    entityView.selected = !selected;
    if (entityView.selected) {
      this.entityViews['selections'][entityView.id.id] = true;
      this.entityViews['selectedCount']++;
    } else {
      delete this.entityViews['selections'][entityView.id.id];
      this.entityViews['selectedCount']--;
    }
  }

  searchEntityViewTextUpdated(): void {
    this.entityViews = newPagedList(this.entityViews.pageSize, this.searchText, { selections: {}, selectedCount: 0 });
    fetchMorePage(this.entityViews, this.fetchEntityViews);
  }
}
