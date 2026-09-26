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
import { AssetService } from '../../api/services/asset.service';

/** What the customer's assets page opens the dialog with: the customer and the first page of tenant assets. */
export interface AddAssetsToCustomerData {
  customerId: string;
  assets: PagedListState;
}

/**
 * Ported from the AngularJS controller `AddAssetsToCustomerController` (module `thingsboard.asset`)
 * with its template src/app/asset/add-assets-to-customer.tpl.html. Closes with `true` once the selected assets are assigned.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'add-assets-to-customer',
  standalone: true,
  imports: [TranslatePipe, FormsModule, ScrollingModule, MatDialogModule, MatToolbarModule, MatProgressBarModule, MatListModule, MatInputModule, MatIconModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './add-assets-to-customer.component.html',
})
export class AddAssetsToCustomerComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly assetService = inject(AssetService);
  protected readonly dialogRef = inject(MatDialogRef<AddAssetsToCustomerComponent, boolean>);
  protected readonly dialogData: AddAssetsToCustomerData = inject(MAT_DIALOG_DATA);

  assets: PagedListState = this.dialogData.assets;
  searchText = '';

  private readonly fetchAssets = (pageLink: any) => this.assetService.getTenantAssets(pageLink, false);

  cancel(): void {
    this.dialogRef.close();
  }

  assign(): void {
    const tasks = Object.keys(this.assets['selections']).map((id) => this.assetService.assignAssetToCustomer(this.dialogData.customerId, id));
    Promise.all(tasks).then(() => this.dialogRef.close(true));
  }

  noData(): boolean {
    return this.assets.data.length == 0 && !this.assets.hasNext;
  }

  hasData(): boolean {
    return this.assets.data.length > 0;
  }

  onScrolled(index: number): void {
    onPagedListScrolled(this.assets, index, this.fetchAssets);
  }

  toggleAssetSelection(asset: any): void {
    const selected = asset.selected !== undefined && asset.selected;
    asset.selected = !selected;
    if (asset.selected) {
      this.assets['selections'][asset.id.id] = true;
      this.assets['selectedCount']++;
    } else {
      delete this.assets['selections'][asset.id.id];
      this.assets['selectedCount']--;
    }
  }

  searchAssetTextUpdated(): void {
    this.assets = newPagedList(this.assets.pageSize, this.searchText, { selections: {}, selectedCount: 0 });
    fetchMorePage(this.assets, this.fetchAssets);
  }
}
